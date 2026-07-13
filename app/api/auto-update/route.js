import { createClient } from "@supabase/supabase-js";

    const supabaseUrl = process.env.SUPABASE_URL || "https://fbcvxefvvifmxaiqxiuq.supabase.co";
    const anonKey = process.env.SUPABASE_ANON_KEY || "sb_publishable_BShV19iGgcoKLiIsyvQ2Lg_1Lhe9uPV";
    const envKey = process.env.SUPABASE_SERVICE_ROLE_KEY; const serviceKey = (envKey && envKey.startsWith("eyJ")) ? envKey : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiY3Z4ZWZ2dmlmbXhhaXF4aXVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjEwMTg5NiwiZXhwIjoyMDk3Njc3ODk2fQ.aE96TdR-6EaqzjdI0Ift_-dpmJqFISaaYrlaQlZAZHw";

    const supabase = createClient(supabaseUrl, anonKey);
    const adminSupabase = serviceKey ? createClient(supabaseUrl, serviceKey) : supabase;

    // Test what admin client can see
    async function debugCheck() {
      const { data: ad, error: ae } = await adminSupabase.from("results").select("id").limit(1);
      const { data: sd, error: se } = await supabase.from("results").select("id").limit(1);
      return {
        admin_has_key: !!serviceKey,
        admin_key_length: serviceKey ? serviceKey.length : 0,
        admin_first_chars: serviceKey ? serviceKey.substring(0, 10) : "none",
        admin_data: ad?.length || 0,
        admin_error: ae?.message || null,
        anon_data: sd?.length || 0,
        anon_error: se?.message || null,
      };
    }


    const OFFICIAL_LINKS = {
      201: 'https://ssc.gov.in',        // SSC CGL
      202: 'https://ssc.gov.in',        // SSC CHSL
      203: 'https://ssc.gov.in',        // SSC GD
      204: 'https://ssc.gov.in',        // SSC MTS
      205: 'https://ssc.gov.in',        // SSC CPO
      206: 'https://ssc.gov.in',        // SSC Stenographer
      207: 'https://ssc.gov.in',        // SSC JE
      301: 'https://upsc.gov.in',       // UPSC CSE
      302: 'https://upsc.gov.in',       // UPSC CAPF
      303: 'https://upsc.gov.in',       // UPSC EPFO
      401: 'https://ibps.in',           // IBPS PO
      402: 'https://ibps.in',           // IBPS Clerk
      403: 'https://ibps.in',           // IBPS RRB
      404: 'https://sbi.co.in/careers', // SBI PO
      405: 'https://sbi.co.in/careers', // SBI Clerk
      406: 'https://rbi.org.in',        // RBI Grade B
      501: 'https://indianrailways.gov.in', // RRB NTPC
      502: 'https://indianrailways.gov.in', // RRB JE
      503: 'https://indianrailways.gov.in', // RRB ALP
      504: 'https://indianrailways.gov.in', // RRB Group D
      601: 'https://jeemain.nta.ac.in', // JEE Main
      602: 'https://jeeadv.ac.in',      // JEE Advanced
      701: 'https://neet.nta.nic.in',   // NEET UG
      702: 'https://natboard.edu.in',   // NEET PG
      703: 'https://aiimsexams.ac.in',  // AIIMS
      801: 'https://consortiumofnlus.ac.in', // CLAT
      901: 'https://upsc.gov.in',       // NDA
      902: 'https://upsc.gov.in',       // CDS
      1001: 'https://ctet.nic.in',      // CTET
      1002: 'https://dsssb.delhi.gov.in', // DSSSB
      1101: 'https://bpsc.bih.nic.in',  // BPSC
      1102: 'https://uppsc.up.nic.in',  // UPPSC
      1103: 'https://mpsc.gov.in',      // MPSC
      1104: 'https://rpsc.rajasthan.gov.in', // RPSC
      1105: 'https://tnpsc.gov.in',     // TNPSC
      1106: 'https://kpsc.kar.nic.in',  // KPSC
      1107: 'https://mppsc.mp.gov.in',  // MPPSC
      1108: 'https://opsc.gov.in',      // OPSC
      1109: 'https://wbpsc.gov.in',     // WBPSC
      1110: 'https://hpsc.gov.in',      // HPSC
    };

    const EXAM_MAP = {
      "ssc cgl": [201, "SSC CGL"], "ssc chsl": [202, "SSC CHSL"], "ssc gd": [203, "SSC GD"], "ssc mts": [204, "SSC MTS"],
      "ssc cpo": [205, "SSC CPO"], "ssc stenographer": [206, "SSC Stenographer"], "ssc je": [207, "SSC JE"],
      "upsc cse": [301, "UPSC CSE"], "upsc capf": [302, "UPSC CAPF"], "upsc epfo": [303, "UPSC EPFO"],
      "ibps po": [401, "IBPS PO"], "ibps clerk": [402, "IBPS Clerk"], "ibps rrb": [403, "IBPS RRB"],
      "sbi po": [404, "SBI PO"], "sbi clerk": [405, "SBI Clerk"], "rbi grade b": [406, "RBI Grade B"],
      "rrb ntpc": [501, "RRB NTPC"], "rrb je": [502, "RRB JE"], "rrb alp": [503, "RRB ALP"], "rrb group d": [504, "RRB Group D"],
      "jee main": [601, "JEE Main"], "jee advance": [602, "JEE Advanced"], "neet ug": [701, "NEET UG"], "neet pg": [702, "NEET PG"],
      "aiims": [703, "AIIMS"], "clat": [801, "CLAT"], "nda": [901, "NDA"], "cds": [902, "CDS"], "afcat": [903, "AFCAT"],
      "ctet": [1001, "CTET"], "uptet": [1002, "UPTET"], "reet": [1003, "REET"], "dsssb": [1004, "DSSSB"],
      "uppsc": [1101, "UPPSC"], "bpsc": [1102, "BPSC"], "mppsc": [1103, "MPPSC"],
      "cat": [1201, "CAT"], "xat": [1202, "XAT"], "ugc net": [1301, "UGC NET"], "csir net": [1302, "CSIR NET"], "gate": [1303, "GATE"],
    };

    function matchExam(title) {
      const lower = title.toLowerCase();
      for (const key of Object.keys(EXAM_MAP).sort((a,b) => b.length - a.length)) { if (lower.includes(key)) return EXAM_MAP[key]; }
      return null;
    }

    function detectType(title) {
      const lower = title.toLowerCase();
      if (lower.includes("result") || lower.includes("score") || lower.includes("marks")) return "result";
      if (lower.includes("admit") || lower.includes("hall ticket") || lower.includes("call letter")) return "admit_card";
      if (lower.includes("answer") || lower.includes("key")) return "answer_key";
      if (lower.includes("syllabus") || lower.includes("pattern")) return "syllabus";
      return "general";
    }

    async function fetchNews(query) {
      try {
        const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}+india+exam&hl=en-IN&gl=IN`;
        const resp = await fetch(url); const text = await resp.text();
        const items = []; const regex = /<item>([\s\S]*?)<\/item>/gi; let match;
        while ((match = regex.exec(text)) !== null) {
          const xml = match[1];
          const title = xml.match(/<title>(.*?)<\/title>/i)?.[1]?.replace(/<!\[CDATA\[|\]\]>/g, "").trim();
          const link = xml.match(/<link>(.*?)<\/link>/i)?.[1]?.trim();
          if (title && title.length > 15) items.push({ title, link });
        }
        return items;
      } catch (e) { return []; }
    }

    const ALL_EXAMS = [
      [201, "SSC CGL"], [202, "SSC CHSL"], [203, "SSC GD"], [204, "SSC MTS"],
      [205, "SSC CPO"], [206, "SSC Stenographer"], [207, "SSC JE"],
      [301, "UPSC CSE"], [302, "UPSC CAPF"], [303, "UPSC EPFO"],
      [401, "IBPS PO"], [402, "IBPS Clerk"], [403, "IBPS RRB"],
      [404, "SBI PO"], [405, "SBI Clerk"], [406, "RBI Grade B"],
      [501, "RRB NTPC"], [502, "RRB JE"], [503, "RRB ALP"], [504, "RRB Group D"],
      [601, "JEE Main"], [602, "JEE Advanced"], [701, "NEET UG"], [702, "NEET PG"],
      [703, "AIIMS"], [801, "CLAT"], [901, "NDA"], [902, "CDS"], [903, "AFCAT"],
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

      const mode = req.nextUrl.searchParams.get("mode") || "normal";
      const today = new Date().toISOString().split("T")[0];

      // ========== DEBUG MODE ==========
      if (mode === "debug") {
        const debug = await debugCheck();
        return Response.json({ success: true, debug });
      }

      try {
        // ========== BULK MODE ==========
        if (mode === "bulk") {
          let r=0, a=0;
          for (const [id, name] of ALL_EXAMS) {
            for (const year of YEARS) {
              const rn = `${name} ${year}`;
              const { data: re } = await adminSupabase.from("results").select("id").eq("exam_name", rn).maybeSingle();
              if (!re) { await adminSupabase.from("results").insert({ exam_name: rn, exam_id: id, result_title: `Result - ${name} ${year}`, status: "declared", official_link: OFFICIAL_LINKS[id] || null }); r++; }
              const { data: ae } = await adminSupabase.from("admit_cards").select("id").eq("exam_name", rn).maybeSingle();
              if (!ae) { await adminSupabase.from("admit_cards").insert({ exam_name: rn, exam_id: id, title: `Admit Card - ${name} ${year}`, status: "released", official_link: OFFICIAL_LINKS[id] || null }); a++; }
            }
          }
          // Check with anon key what was actually added
          const { data: rc } = await supabase.from("results").select("id");
          const { data: ac } = await supabase.from("admit_cards").select("id");
          return Response.json({ success: true, mode: "bulk", results_added: r, admits_added: a, results_actual: rc?.length || 0, admits_actual: ac?.length || 0 });
        }

        // ========== FIX LINKS MODE ==========
        if (mode === "fix-links") {
          let updated = 0;
          for (const [id, link] of Object.entries(OFFICIAL_LINKS)) {
            const examId = parseInt(id);
            const { data: rRows } = await adminSupabase.from("results").select("id").eq("exam_id", examId).is("official_link", null);
            if (rRows && rRows.length > 0) {
              await adminSupabase.from("results").update({ official_link: link }).eq("exam_id", examId).is("official_link", null);
              updated += rRows.length;
            }
            const { data: aRows } = await adminSupabase.from("admit_cards").select("id").eq("exam_id", examId).is("official_link", null);
            if (aRows && aRows.length > 0) {
              await adminSupabase.from("admit_cards").update({ official_link: link }).eq("exam_id", examId).is("official_link", null);
              updated += aRows.length;
            }
          }
          return Response.json({ success: true, mode: "fix-links", records_updated: updated });
        }

        // ========== CLEANUP ==========
        const { data: allUpcoming } = await adminSupabase.from("upcoming_exams").select("id,exam_name").order("id");
        let cleanupDone = 0;
        if (allUpcoming && allUpcoming.length > 0) {
          const seen = new Set(), toDelete = [];
          for (const item of allUpcoming) { const key = item.exam_name.toLowerCase().trim(); if (seen.has(key)) toDelete.push(item.id); else seen.add(key); }
          for (const id of toDelete) { await adminSupabase.from("upcoming_exams").delete().eq("id", id); cleanupDone++; }
        }

        // ========== NORMAL MODE: Google News ==========
        let newsAdded = 0, templateAdded = 0, resultsAdded = 0, admitsAdded = 0;
        const queries = ["exam result declared", "admit card released", "answer key published"];
        for (const query of queries) {
          const news = await fetchNews(query);
          for (const item of news.slice(0, 10)) {
            const match = matchExam(item.title);
            if (!match) continue;
            const [examId, examName] = match;
            const type = detectType(item.title);
            const displayTitle = `📰 ${examName} ${type.replace("_", " ")}`;
            const { data: exists } = await supabase.from("updates").select("id").eq("title", displayTitle).maybeSingle();
            if (exists) continue;
            await supabase.from("updates").insert({ exam_id: examId, update_type: type, title: displayTitle, description: item.title.slice(0, 200), official_link: null, publish_date: today, is_verified: false });
            newsAdded++;
            if (type === "result") { const { data: rExists } = await adminSupabase.from("results").select("id").eq("exam_name", `${examName} Result`).maybeSingle(); if (!rExists) { await adminSupabase.from("results").insert({ exam_name: `${examName} Result`, exam_id: examId, result_title: "Result Declared", status: "declared" }); resultsAdded++; } }
            if (type === "admit_card") { const { data: aExists } = await adminSupabase.from("admit_cards").select("id").eq("exam_name", `${examName} Admit Card`).maybeSingle(); if (!aExists) { await adminSupabase.from("admit_cards").insert({ exam_name: `${examName} Admit Card`, exam_id: examId, title: "Admit Card Released", status: "released" }); admitsAdded++; } }
          }
        }

        // ========== TEMPLATES ==========
        const templates = [["SSC CGL","result","SSC CGL Tier 1 result update."],["SSC CHSL","result","SSC CHSL result declared."],["SSC Stenographer","result","SSC Stenographer result announced."],["UPSC CSE","result","UPSC CSE result update."],["NEET UG","result","NEET UG result declared."],["JEE Main","result","JEE Main session result."],["IBPS PO","result","IBPS PO result released."],["CTET","admit_card","CTET admit card released."],["SSC CGL","admit_card","SSC CGL admit card available."],["SSC Stenographer","admit_card","SSC Stenographer admit card released."]];
        const day = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
        const sorted = [...templates].sort((a, b) => (templates.indexOf(a) * 17 + day) % 30 - (templates.indexOf(b) * 17 + day) % 30);
        for (const [name, type, desc, url] of sorted.slice(0, 4)) {
          const title = `${name} ${type === "result" ? "Result" : "Admit Card"} - ${today}`;
          const { data: exists } = await supabase.from("updates").select("id").eq("title", title).maybeSingle();
          if (!exists) { const match = matchExam(name); await supabase.from("updates").insert({ exam_id: match ? match[0] : null, update_type: type, title, description: desc, publish_date: today, is_verified: true, official_link: url }); templateAdded++; }
        }

        return Response.json({ success: true, date: today, duplicates_cleaned: cleanupDone, news_monitor_added: newsAdded, template_added: templateAdded, results_auto_added: resultsAdded, admit_cards_auto_added: admitsAdded, message: "Auto-update completed!" });
      } catch (e) {
        return Response.json({ success: false, date: today, error: e.message }, { status: 500 });
      }
    }
