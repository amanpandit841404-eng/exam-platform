// Fix RLS + Bulk Insert Results/Admit Cards
// Deploy to: app/api/fix-rls/route.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "https://fbcvxefvvifmxaiqxiuq.supabase.co";
const anonKey = process.env.SUPABASE_ANON_KEY || "sb_publishable_BShV19iGgcoKLiIsyvQ2Lg_1Lhe9uPV";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || null;

export async function GET(req) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== "sarkari123auto") return Response.json({ error: "Unauthorized" }, { status: 401 });

  const mode = req.nextUrl.searchParams.get("mode") || "all";
  const result = { serviceKeyAvailable: !!serviceKey, mode };

  try {
    // ==== STEP 1: If service key available, use it directly (bypasses RLS) ====
    const client = serviceKey 
      ? createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })
      : null;

    if (!client) {
      return Response.json({ ...result, error: "No SUPABASE_SERVICE_ROLE_KEY set on Vercel. Please add it in Vercel dashboard > Project Settings > Environment Variables." });
    }

    // Test service key
    const { error: testErr } = await client.from("results").select("id").limit(1);
    if (testErr) {
      return Response.json({ ...result, error: "Service key test failed: " + testErr.message });
    }

    result.serviceKeyWorks = true;

    // ==== STEP 2: Bulk insert results for ALL exams ====
    const { data: exams, error: examErr } = await createClient(supabaseUrl, anonKey)
      .from("exams").select("id, name").order("id");
    if (examErr) return Response.json({ ...result, error: "Exam fetch: " + examErr.message });

    result.totalExams = exams.length;

    // Get existing
    const [rRes, aRes] = await Promise.all([
      createClient(supabaseUrl, anonKey).from("results").select("exam_id"),
      createClient(supabaseUrl, anonKey).from("admit_cards").select("exam_id")
    ]);
    
    const existResults = new Set((rRes.data || []).map(r => r.exam_id));
    const existAdmits = new Set((aRes.data || []).map(a => a.exam_id));

    const needResults = exams.filter(e => !existResults.has(e.id));
    const needAdmits = exams.filter(e => !existAdmits.has(e.id));

    result.toAdd = { results: needResults.length, admits: needAdmits.length };

    // Insert using service key (bypasses RLS)
    const BATCH = 400;
    let rAdded = 0, aAdded = 0;
    
    for (let i = 0; i < needResults.length && rAdded < 20000; i += BATCH) {
      const batch = needResults.slice(i, i + BATCH).map(e => ({
        exam_id: e.id, exam_name: e.name, result_title: e.name + " Result", status: "declared"
      }));
      const res = await client.from("results").insert(batch);
      if (!res.error) rAdded += batch.length;
      else { result.firstError = res.error.message; break; }
    }

    for (let i = 0; i < needAdmits.length && aAdded < 20000; i += BATCH) {
      const batch = needAdmits.slice(i, i + BATCH).map(e => ({
        exam_id: e.id, exam_name: e.name, title: e.name + " Admit Card", status: "released"
      }));
      const res = await client.from("admit_cards").insert(batch);
      if (!res.error) aAdded += batch.length;
      else { result.admitError = res.error.message; break; }
    }

    result.inserted = { results: rAdded, admits: aAdded };

    return Response.json({
      ...result,
      message: "Service key WORKS! Inserted " + rAdded + " results + " + aAdded + " admit cards. Total exams: " + exams.length,
      note: "Set SUPABASE_SERVICE_ROLE_KEY on Vercel permanently."
    });

  } catch (e) {
    return Response.json({ ...result, error: e.message }, { status: 500 });
  }
}
