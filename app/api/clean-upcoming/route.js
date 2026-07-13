import { createClient } from "@supabase/supabase-js";

export async function GET(req) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== "sarkari123auto") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!adminKey) {
      return Response.json({ error: "SERVICE_ROLE_KEY not set in env" });
    }

    const admin = createClient(
      process.env.SUPABASE_URL || "https://fbcvxefvvifmxaiqxiuq.supabase.co",
      adminKey
    );

    let deleted = 0;
    const { data: all } = await admin.from("upcoming_exams").select("id,exam_name").order("id");
    
    if (all && all.length > 0) {
      const seen = new Set();
      const toDelete = [];
      for (const item of all) {
        const key = item.exam_name.toLowerCase().trim();
        if (seen.has(key)) toDelete.push(item.id);
        else seen.add(key);
      }
      for (const id of toDelete) {
        await admin.from("upcoming_exams").delete().eq("id", id);
        deleted++;
      }
    }

    const { data: remaining } = await admin.from("upcoming_exams").select("id,exam_name").order("id");
    const names = new Set();
    for (const item of remaining || []) {
      names.add(item.exam_name.toLowerCase().trim());
    }

    return Response.json({
      success: true,
      duplicates_deleted: deleted,
      remaining_unique: names.size,
      remaining_total: remaining?.length || 0,
    });
  } catch (e) {
    return Response.json({ success: false, error: e.message });
  }
}
