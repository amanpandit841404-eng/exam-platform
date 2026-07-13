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
    const supabaseUrl = process.env.SUPABASE_URL || "https://fbcvxefvvifmxaiqxiuq.supabase.co";
    
    if (!adminKey) {
      return Response.json({ error: "SERVICE_ROLE_KEY not set", env: !!adminKey });
    }

    // Use REST API directly instead of Supabase client
    let r = 0, a = 0, rSkipped = 0, aSkipped = 0, rErrors = 0, aErrors = 0;

    for (const [id, name] of EXAMS) {
      for (const year of YEARS) {
        const rn = `${name} ${year}`;
        
        // Insert result via REST
        try {
          const res = await fetch(`${supabaseUrl}/rest/v1/results`, {
            method: "POST",
            headers: {
              "apikey": adminKey,
              "Authorization": `Bearer ${adminKey}`,
              "Content-Type": "application/json",
              "Prefer": "return=minimal,resolution=merge-duplicates"
            },
            body: JSON.stringify({
              exam_name: rn,
              exam_id: id,
              result_title: `Result - ${name} ${year}`,
              status: "declared"
            })
          });
          if (res.ok || res.status === 201) r++;
          else if (res.status === 409) rSkipped++;
          else rErrors++;
        } catch(e) { rErrors++; }

        // Insert admit card via REST
        try {
          const res = await fetch(`${supabaseUrl}/rest/v1/admit_cards`, {
            method: "POST",
            headers: {
              "apikey": adminKey,
              "Authorization": `Bearer ${adminKey}`,
              "Content-Type": "application/json",
              "Prefer": "return=minimal,resolution=merge-duplicates"
            },
            body: JSON.stringify({
              exam_name: rn,
              exam_id: id,
              title: `Admit Card - ${name} ${year}`,
              status: "released"
            })
          });
          if (res.ok || res.status === 201) a++;
          else if (res.status === 409) aSkipped++;
          else aErrors++;
        } catch(e) { aErrors++; }
      }
    }

    // Get final counts
    const countRes = await fetch(`${supabaseUrl}/rest/v1/results?select=exam_name&limit=500`, {
      headers: { "apikey": adminKey, "Authorization": `Bearer ${adminKey}` }
    });
    const countData = await countRes.json();
    
    const countAdmit = await fetch(`${supabaseUrl}/rest/v1/admit_cards?select=exam_name&limit=500`, {
      headers: { "apikey": adminKey, "Authorization": `Bearer ${adminKey}` }
    });
    const admitData = await countAdmit.json();

    return Response.json({
      success: true,
      key_available: !!adminKey,
      results_inserted: r,
      results_skipped: rSkipped,
      results_errors: rErrors,
      results_total_now: countData.length,
      admits_inserted: a,
      admits_skipped: aSkipped,
      admits_errors: aErrors,
      admits_total_now: admitData.length,
    });
  } catch (e) {
    return Response.json({ success: false, error: e.message, stack: e.stack }, { status: 500 });
  }
}
