import { createClient } from "@supabase/supabase-js";

    const supabase = createClient(
      process.env.SUPABASE_URL || "https://fbcvxefvvifmxaiqxiuq.supabase.co",
      process.env.SUPABASE_ANON_KEY || "sb_publishable_BShV19iGgcoKLiIsyvQ2Lg_1Lhe9uPV"
    );

    // Known exams for matching
    const EXAM_MAP = {
      "ssc cgl": 201, "ssc chsl": 202, "ssc gd": 203, "ssc mts": 204,
      "ssc cpo": 205, "ssc stenographer": 206, "ssc stenographer": 206, "ssc je": 207, "ssc selection post": 208,
      "upsc cse": 301, "upsc civil": 301, "upsc capf": 302, "upsc epfo": 303, "upsc cms": 304,
      "ibps po": 401, "ibps clerk": 402, "ibps rrb": 403, "sbi po": 404, "sbi clerk": 405,
      "rbi grade b": 406, "nabard": 407,
      "rrb ntpc": 501, "rrb je": 502, "rrb alp": 503, "rrb group d": 504, "rrb paramedical": 505,
      "jee main": 601, "jee advance": 602,
      "neet ug": 701, "neet pg": 702, "aiims": 703,
      "clat": 801, "ailct": 802,
      "nda": 901, "cds": 902, "afcat": 903,
      "ctet": 1001, "uptet": 1002, "reet": 1003, "dsssb": 1004,
      "uppsc": 1101, "bpsc": 1102, "mppsc": 1103,
      "cat": 1201, "xat": 1202,
      "ugc net": 1301, "csir net": 1302, "gate": 1303, "cbse": 1401,
    };

    function findExamId(title) {
      const lower = title.toLowerCase();
      for (const [key, id] of Object.entries(EXAM_MAP)) {
        if (lower.includes(key)) return id;
      }
      return null;
    }

    function findExamName(title) {
      const lower = title.toLowerCase();
      const examNames = Object.keys(EXAM_MAP).sort((a,b) => b.length - a.length); // longest first
      for (const key of examNames) {
        if (lower.includes(key)) {
          return key.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        }
      }
      return null;
    }

    function determineType(title) {
      const lower = title.toLowerCase();
      if (lower.includes("result") || lower.includes("score") || lower.includes("marks")) return "result";
      if (lower.includes("admit") || lower.includes("hall ticket") || lower.includes("call letter")) return "admit_card";
      if (lower.includes("answer") || lower.includes("key")) return "answer_key";
      if (lower.includes("syllabus") || lower.includes("pattern")) return "syllabus";
      return "general";
    }

    // Google News RSS fetching
    async function fetchGoogleNews(query) {
      const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}+exam+india&hl=en-IN&gl=IN`;
      try {
        const resp = await fetch(url);
        const text = await resp.text();

        // Simple XML parsing
        const items = [];
        const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
        let match;
        while ((match = itemRegex.exec(text)) !== null) {
          const itemXml = match[1];
          const titleMatch = /<title>(.*?)<\/title>/i.exec(itemXml);
          const linkMatch = /<link>(.*?)<\/link>/i.exec(itemXml);
          const dateMatch = /<pubDate>(.*?)<\/pubDate>/i.exec(itemXml);

          if (titleMatch) {
            items.push({
              title: titleMatch[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim(),
              link: linkMatch ? linkMatch[1].trim() : null,
              date: dateMatch ? dateMatch[1].trim() : null,
            });
          }
        }
        return items.slice(0, 20);
      } catch (e) {
        return [];
      }
    }

    export async function GET(req) {
      const secret = req.nextUrl.searchParams.get("secret");
      if (secret !== "sarkari123auto") {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }

      const today = new Date().toISOString().split("T")[0];
      let added = 0;
      let alerts = [];
      let templateAdded = 0;

      try {
        // === PART 1: Google News Monitoring ===
        const queries = ["result declared", "admit card released", "exam result", "answer key released"];

        for (const query of queries) {
          const news = await fetchGoogleNews(query);

          for (const item of news) {
            const examName = findExamName(item.title);
            if (!examName) continue; // Skip if no known exam found

            const type = determineType(item.title);
            const title = `${examName} ${type.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}`;

            // Check if we already have this
            const { data: existing } = await supabase
              .from("updates")
              .select("id")
              .eq("title", `📰 ${title}`)
              .maybeSingle();

            if (!existing) {
              const examId = findExamId(item.title);

              // Add to updates
              const { error } = await supabase.from("updates").insert({
                exam_id: examId,
                update_type: type,
                title: `📰 ${title}`,
                description: item.title,
                official_link: item.link,
                publish_date: today,
                is_verified: false,
              });

              if (!error) {
                added++;

                // Also add alert for admin panel
                await supabase.from("alerts").insert({
                  title: `🔍 Found: ${title}`,
                  source: "Google News",
                  source_url: item.link,
                  exam_name: examName,
                  alert_type: "new_exam",
                  status: "new",
                });

                // Add to results or admit_cards if applicable
                if (type === "result") {
                  const { data: existingR } = await supabase.from("results").select("id").eq("exam_name", `${examName} Result`).maybeSingle();
                  if (!existingR) {
                    await supabase.from("results").insert({
                      exam_name: `${examName} Result`,
                      exam_id: examId,
                      result_title: "Result Declared",
                      status: "declared",
                    });
                  }
                }

                if (type === "admit_card") {
                  const { data: existingA } = await supabase.from("admit_cards").select("id").eq("exam_name", `${examName} Admit Card`).maybeSingle();
                  if (!existingA) {
                    await supabase.from("admit_cards").insert({
                      exam_name: `${examName} Admit Card`,
                      exam_id: examId,
                      title: "Admit Card Released",
                      status: "released",
                    });
                  }
                }
              }
            }
          }
        }

        // === PART 2: Template Rotation (backup) ===
        const templates = [
          { e: "SSC CGL", type: "result" }, { e: "SSC CHSL", type: "result" },
          { e: "SSC Stenographer", type: "result" }, { e: "UPSC CSE", type: "result" },
          { e: "NEET UG", type: "result" }, { e: "JEE Main", type: "result" },
          { e: "IBPS PO", type: "result" }, { e: "SBI Clerk", type: "result" },
          { e: "CTET", type: "admit_card" }, { e: "SSC CGL", type: "admit_card" },
        ];

        const day = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
        const selected = templates.filter((_, i) => (i * 7 + day) % 11 < 2);

        for (const t of selected.slice(0, 4)) {
          const typeTitle = t.type === "result" ? "Result" : "Admit Card";
          const title = `${t.e} ${typeTitle} - ${today}`;

          const { data: existing } = await supabase.from("updates").select("id").eq("title", title).maybeSingle();
          if (!existing) {
            const examId = findExamId(t.e);
            await supabase.from("updates").insert({
              exam_id: examId,
              update_type: t.type,
              title,
              description: `${t.e} ${typeTitle.toLowerCase()} update for ${today}.`,
              publish_date: today,
              is_verified: true,
            });
            templateAdded++;
          }
        }

        // === PART 3: Upcoming exams ===
        const upcomingList = [
          { name: "UPSC CSE 2026 Prelims", date: "2026-08-15" },
          { name: "SSC CGL 2026 Tier 1", date: "2026-09-20" },
          { name: "SSC Stenographer 2026", date: "2026-11-10" },
          { name: "NEET UG 2027", date: "2027-05-02" },
          { name: "JEE Main 2027", date: "2026-09-15" },
        ];

        const uc = upcomingList[day % upcomingList.length];
        const { data: existingU } = await supabase.from("upcoming_exams").select("id").eq("exam_name", uc.name).maybeSingle();
        if (!existingU) {
          await supabase.from("upcoming_exams").insert({
            exam_name: uc.name,
            exam_id: findExamId(uc.name),
            exam_date: uc.date,
            status: "upcoming",
          });
        }

        return Response.json({
          success: true,
          date: today,
          google_news_added: added,
          template_added: templateAdded,
          total_updates: added + templateAdded,
          alerts_count: alerts.length,
        });
      } catch (e) {
        return Response.json({ success: false, error: e.message }, { status: 500 });
      }
    }
    