import { createClient } from "@supabase/supabase-js";

const EXAMS = [
  [201, "SSC CGL"], [202, "SSC CHSL"], [203, "SSC GD"], [204, "SSC MTS"],
  [205, "SSC CPO"], [206, "SSC Stenographer"], [207, "SSC JE"],
  [301, "UPSC CSE"], [302, "UPSC CAPF"], [303, "UPSC EPFO"],
  [404, "SBI PO"], [405, "SBI Clerk"], [406, "RBI Grade B"],
  [501, "RRB NTPC"], [502, "RRB JE"], [503, "RRB ALP"], [504, "RRB Group D"],
  [601, "JEE Main"], [602, "JEE Advanced"],
  [701, "NEET UG"], [702, "NEET PG"], [703, "AIIMS"],
  [801, "CLAT"], [901, "NDA"], [902, "CDS"], [903, "AFCAT"],
  [1001, "CTET"], [1002, "UPTET"], [1003, "REET"], [1004, "DSSSB"],
  [1101, "UPPSC"], [1102, "BPSC"], [1103, "MPPSC"],
  [1201, "CAT"], [1202, "XAT"], [1301, "UGC NET"], [1302, "CSIR NET"], [1303, "GATE"],
];

const YEARS = [2024, 2025, 2026, 2027];

export async function GET(req) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== "sarkari123auto") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!adminKey) return Response.json({ error: "SERVICE_ROLE_KEY missing" });

    const admin = createClient(
      process.env.SUPABASE_URL || "https://fbcvxefvvifmxaiqxiuq.supabase.co",
      adminKey
    );

    let r = 0, a = 0;
    for (const [id, name] of EXAMS) {
      for (const year of YEARS) {
        const rn = `${name} ${year}`;
        const { data: re } = await admin.from("results").select("id").eq("exam_name", rn).maybeSingle();
        if (!re) { await admin.from("results").insert({ exam_name: rn, exam_id: id, result_title: `Result - ${name} ${year}`, status: "declared" }); r++; }
        const { data: ae } = await admin.from("admit_cards").select("id").eq("exam_name", rn).maybeSingle();
        if (!ae) { await admin.from("admit_cards").insert({ exam_name: rn, exam_id: id, title: `Admit Card - ${name} ${year}`, status: "released" }); a++; }
      }
    }

    return Response.json({ success: true, results_added: r, admits_added: a });
  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 500 });
  }
}
