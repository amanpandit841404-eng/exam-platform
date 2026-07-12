import { createClient } from "@supabase/supabase-js";

    const supabase = createClient(
      process.env.SUPABASE_URL || "https://fbcvxefvvifmxaiqxiuq.supabase.co",
      process.env.SUPABASE_ANON_KEY || "sb_publishable_BShV19iGgcoKLiIsyvQ2Lg_1Lhe9uPV"
    );

    // Try to create admin client with service role key (if available on Vercel)
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || null;
    const adminClient = serviceKey ? createClient(
      process.env.SUPABASE_URL || "https://fbcvxefvvifmxaiqxiuq.supabase.co",
      serviceKey
    ) : null;

    const EXAM_MAP = {
      "ssc cgl": [201, "SSC CGL"], "ssc chsl": [202, "SSC CHSL"], "ssc gd": [203, "SSC GD"], "ssc mts": [204, "SSC MTS"],
      "ssc cpo": [205, "SSC CPO"], "ssc stenographer": [206, "SSC Stenographer"], "ssc je": [207, "SSC JE"],
      "upsc cse": [301, "UPSC CSE"], "upsc capf": [302, "UPSC CAPF"], "upsc epfo": [303, "UPSC EPFO"],
      "ibps po": [401, "IBPS PO"], "ibps clerk": [402, "IBPS Clerk"], "ibps rrb": [403, "IBPS RRB"],
      "sbi po": [404, "SBI PO"], "sbi clerk": [405, "SBI Clerk"], "rbi grade b": [406, "RBI Grade B"],
      "rrb ntpc": [501, "RRB NTPC"], "rrb je": [502, "RRB JE"], "rrb alp": [503, "RRB ALP"], "rrb group d": [504, "RRB Group D"],
      "jee main": [601, "JEE Main"], "jee advance": [602, "JEE Advanced"],
      "neet ug": [701, "NEET UG"], "neet pg": [702, "NEET PG"], "aiims": [703, "AIIMS"],
      "clat": [801, "CLAT"], "nda": [901, "NDA"], "cds": [902, "CDS"], "afcat": [903, "AFCAT"],
      "ctet": [1001, "CTET"], "uptet": [1002, "UPTET"], "reet": [1003, "REET"], "dsssb": [1004, "DSSSB"],
      "uppsc": [1101, "UPPSC"], "bpsc": [1102, "BPSC"], "mppsc": [1103, "MPPSC"],
      "cat": [1201, "CAT"], "xat": [1202, "XAT"],
      "ugc net": [1301, "UGC NET"], "csir net": [1302, "CSIR NET"], "gate": [1303, "GATE"],
      "cbse": [1401, "CBSE"],
    };

    function matchExam(title) {
      const lower = title.toLowerCase();
      const keys = Object.keys(EXAM_MAP).sort((a,b) => b.length - a.length);
      for (const key of keys) {
        if (lower.includes(key)) return EXAM_MAP[key];
      }
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
        const resp = await fetch(url);
        const text = await resp.text();
        const items = [];
        const regex = /<item>([\s\S]*?)<\/item>/gi;
        let match;
        while ((match = regex.exec(text)) !== null) {
          const xml = match[1];
          const title = xml.match(/<title>(.*?)<\/title>/i)?.[1]?.replace(/<!\[CDATA\[|\]\]>/g, "").trim();
          const link = xml.match(/<link>(.*?)<\/link>/i)?.[1]?.trim();
          const date = xml.match(/<pubDate>(.*?)<\/pubDate>/i)?.[1]?.trim();
          if (title && title.length > 15) items.push({ title, link, date });
        }
        return items;
      } catch (e) { return []; }
    }

    export async function GET(req) {
      const secret = req.nextUrl.searchParams.get("secret");
      if (secret !== "sarkari123auto") {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }

      const today = new Date().toISOString().split("T")[0];
      let newsAdded = 0, templateAdded = 0, resultsAdded = 0, admitsAdded = 0;

      try {
        // ========== PART 1: Google News Monitor ==========
        const queries = ["exam result declared", "admit card released", "answer key published"];

        for (const query of queries) {
          const news = await fetchNews(query);

          for (const item of news.slice(0, 10)) {
            const match = matchExam(item.title);
            if (!match) continue;

            const [examId, examName] = match;
            const type = detectType(item.title);
            const displayTitle = `📰 ${examName} ${type.replace("_", " ")}`;

            // Check duplicate
            const { data: exists } = await supabase.from("updates").select("id").eq("title", displayTitle).maybeSingle();
            if (exists) continue;

            // Add to updates table
            await supabase.from("updates").insert({
              exam_id: examId, update_type: type,
              title: displayTitle,
              description: item.title.slice(0, 200),
              official_link: null,
              publish_date: today,
              is_verified: false,
            });
            newsAdded++;

            // Auto-add to results table if result type
            if (type === "result") {
              const { data: rExists } = await supabase.from("results").select("id").eq("exam_name", `${examName} Result`).maybeSingle();
              if (!rExists) {
                await supabase.from("results").insert({ exam_name: `${examName} Result`, exam_id: examId, result_title: "Result Declared", status: "declared" });
                resultsAdded++;
              }
            }

            // Auto-add to admit_cards table if admit_card type
            if (type === "admit_card") {
              const { data: aExists } = await supabase.from("admit_cards").select("id").eq("exam_name", `${examName} Admit Card`).maybeSingle();
              if (!aExists) {
                await supabase.from("admit_cards").insert({ exam_name: `${examName} Admit Card`, exam_id: examId, title: "Admit Card Released", status: "released" });
                admitsAdded++;
              }
            }
          }
        }

        // ========== PART 2: Template Backup (for variety) ==========
        const templates = [
          ["SSC CGL", "result", "SSC CGL Tier 1 result update."],
          ["SSC CHSL", "result", "SSC CHSL result declared."],
          ["SSC Stenographer", "result", "SSC Stenographer result announced."],
          ["UPSC CSE", "result", "UPSC CSE result update."],
          ["NEET UG", "result", "NEET UG result declared."],
          ["JEE Main", "result", "JEE Main session result."],
          ["IBPS PO", "result", "IBPS PO result released."],
          ["CTET", "admit_card", "CTET admit card released."],
          ["SSC CGL", "admit_card", "SSC CGL admit card available."],
          ["SSC Stenographer", "admit_card", "SSC Stenographer admit card released."],
        ];

        const day = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
        const sorted = [...templates].sort((a, b) => (templates.indexOf(a) * 17 + day) % 30 - (templates.indexOf(b) * 17 + day) % 30);

        for (const [name, type, desc, url] of sorted.slice(0, 4)) {
          const title = `${name} ${type === "result" ? "Result" : "Admit Card"} - ${today}`;
          const { data: exists } = await supabase.from("updates").select("id").eq("title", title).maybeSingle();
          if (!exists) {
            const match = matchExam(name);
            await supabase.from("updates").insert({
              exam_id: match ? match[0] : null, update_type: type,
              title, description: desc,
              publish_date: today, is_verified: true,
      official_link: url,
            });
            templateAdded++;
          }
        }

        // ========== PART 3: Upcoming Exams ==========
        const upcoming = [
          ["UPSC CSE 2026 Prelims", "2026-08-15", "upsc cse"],
          ["SSC CGL 2026 Tier 1", "2026-09-20", "ssc cgl"],
          ["SSC Stenographer 2026", "2026-11-10", "ssc stenographer"],
          ["NEET UG 2027", "2027-05-02", "neet ug"],
          ["JEE Main 2027 Session 1", "2026-09-15", "jee main"],
        ];
        const [ucName, ucDate, ucKey] = upcoming[day % upcoming.length];
        const { data: ucExists } = await supabase.from("upcoming_exams").select("id").eq("exam_name", ucName).maybeSingle();
        if (!ucExists) {
          const match = matchExam(ucKey);
          await supabase.from("upcoming_exams").insert({
            exam_name: ucName, exam_id: match ? match[0] : null,
            exam_date: ucDate, status: "upcoming",
          });
        }

        // ========== PART 4: Bulk-fix results/admit cards (if service key available) ==========
        let bulkResultsAdded = 0, bulkAdmitsAdded = 0;
        
        if (adminClient) {
          try {
            // Get all exams
            const { data: allExams } = await supabase.from("exams").select("id, name").order("id");
            if (allExams && allExams.length > 0) {
              // Get existing
              const [rRes, aRes] = await Promise.all([
                supabase.from("results").select("exam_id"),
                supabase.from("admit_cards").select("exam_id")
              ]);
              
              const existResults = new Set((rRes.data || []).map(r => r.exam_id));
              const existAdmits = new Set((aRes.data || []).map(a => a.exam_id));

              const needResults = allExams.filter(e => !existResults.has(e.id));
              const needAdmits = allExams.filter(e => !existAdmits.has(e.id));

              // Insert results (service key bypasses RLS)
              const BATCH = 400;
              for (let i = 0; i < Math.min(needResults.length, 20000); i += BATCH) {
                const batch = needResults.slice(i, i + BATCH).map(e => ({
                  exam_id: e.id, exam_name: e.name,
                  result_title: e.name + " Result", status: "declared"
                }));
                const { error: err } = await adminClient.from("results").insert(batch);
                if (!err) bulkResultsAdded += batch.length;
                else break;
              }

              for (let i = 0; i < Math.min(needAdmits.length, 20000); i += BATCH) {
                const batch = needAdmits.slice(i, i + BATCH).map(e => ({
                  exam_id: e.id, exam_name: e.name,
                  title: e.name + " Admit Card", status: "released"
                }));
                const { error: err } = await adminClient.from("admit_cards").insert(batch);
                if (!err) bulkAdmitsAdded += batch.length;
                else break;
              }
            }
          } catch (be) {
            console.error("Bulk-fix error:", be.message);
          }
        }

        return Response.json({
          success: true, date: today,
          news_monitor_added: newsAdded,
          template_added: templateAdded,
          results_auto_added: resultsAdded,
          admit_cards_auto_added: admitsAdded,
          total_new: newsAdded + templateAdded + resultsAdded + admitsAdded,
          bulk_results_added: bulkResultsAdded,
          bulk_admits_added: bulkAdmitsAdded,
          service_key_available: !!adminClient,
          message: adminClient 
            ? ("Auto-update done! Also bulk-added " + bulkResultsAdded + " results + " + bulkAdmitsAdded + " admit cards using service key.")
            : "Google News monitored + auto-upload completed! (No service key set)",
        });
      } catch (e) {
        return Response.json({ success: false, date: today, error: e.message }, { status: 500 });
      }
    }
    