import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "https://fbcvxefvvifmxaiqxiuq.supabase.co";
const anonKey = process.env.SUPABASE_ANON_KEY || "sb_publishable_BShV19iGgcoKLiIsyvQ2Lg_1Lhe9uPV";
const envKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const serviceKey = (envKey && envKey.startsWith("eyJ")) ? envKey : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiY3Z4ZWZ2dmlmbXhhaXF4aXVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjEwMTg5NiwiZXhwIjoyMDk3Njc3ODk2fQ.aE96TdR-6EaqzjdI0Ift_-dpmJqFISaaYrlaQlZAZHw";

const supabase = createClient(supabaseUrl, anonKey);
const adminSupabase = serviceKey ? createClient(supabaseUrl, serviceKey) : supabase;

const OFFICIAL_LINKS = {
  201: 'https://ssc.gov.in', 202: 'https://ssc.gov.in', 203: 'https://ssc.gov.in',
  204: 'https://ssc.gov.in', 205: 'https://ssc.gov.in', 206: 'https://ssc.gov.in',
  207: 'https://ssc.gov.in', 301: 'https://upsc.gov.in', 302: 'https://upsc.gov.in',
  303: 'https://upsc.gov.in', 401: 'https://ibps.in', 402: 'https://ibps.in',
  403: 'https://ibps.in', 404: 'https://sbi.co.in/careers', 405: 'https://sbi.co.in/careers',
  406: 'https://rbi.org.in', 501: 'https://indianrailways.gov.in', 502: 'https://indianrailways.gov.in',
  503: 'https://indianrailways.gov.in', 504: 'https://indianrailways.gov.in',
  601: 'https://jeemain.nta.ac.in', 602: 'https://jeeadv.ac.in',
  701: 'https://neet.nta.nic.in', 702: 'https://natboard.edu.in', 703: 'https://aiimsexams.ac.in',
  801: 'https://consortiumofnlus.ac.in', 901: 'https://upsc.gov.in', 902: 'https://upsc.gov.in',
  1001: 'https://ctet.nic.in', 1002: 'https://dsssb.delhi.gov.in',
  1101: 'https://bpsc.bihar.gov.in', 1102: 'https://uppsc.up.nic.in',
  1103: 'https://mppsc.mp.gov.in', 1104: 'https://rpsc.rajasthan.gov.in',
  1105: 'https://uppsc.up.nic.in', 1106: 'https://psc.cg.gov.in',
  1401: 'https://joinindiancoastguard.gov.in', 1501: 'https://allindiabarexamination.ac.in',
  1601: 'https://www.mha.gov.in', 1701: 'https://css.theig presidency.gov.in',
  1801: 'https://rpf.indianrailways.gov.in', 1901: 'https://www.epfindia.gov.in',
  2001: 'https://www.sebi.gov.in', 2101: 'https://www.nabard.org',
  2201: 'https://www.rbi.org.in', 2301: 'https://www.cbi.gov.in',
  2401: 'https://www.nia.gov.in', 2501: 'https://upsc.gov.in',
};

// Extended exam name → ID mapping
const EXAM_IDS = {
  "ssc cgl": 201, "ssc chsl": 202, "ssc gd": 203, "ssc mts": 204,
  "ssc cpo": 205, "ssc stenographer": 206, "ssc je": 207,
  "upsc cse": 301, "upsc capf": 302, "upsc epfo": 303,
  "ibps po": 401, "ibps clerk": 402, "ibps rrb": 403,
  "sbi po": 404, "sbi clerk": 405, "rbi grade b": 406,
  "railway ntpc": 501, "rrb je": 502, "rrb alp": 503, "rrb group d": 504,
  "jee main": 601, "jee advanced": 602,
  "neet ug": 701, "neet pg": 702, "aiims": 703,
  "clat": 801, "nda": 901, "cds": 902,
  "ctet": 1001, "dsssb": 1002,
  "bpsc": 1101, "uppsc": 1102, "mppsc": 1103, "rpsc": 1104,
  "ukpsc": 1105, "cgpsc": 1106,
  "coast guard": 1401, "aibe": 1501,
  "ib acío": 1601, "ib security assistant": 1601,
  "css": 1701, "rpf": 1801, "epfo": 1901,
  "sebi": 2001, "nabard": 2101,
  "cbi": 2301, "nia": 2401, "capf": 2501,
};

function matchExam(name) {
  const key = name.toLowerCase().trim();
  for (const [k, id] of Object.entries(EXAM_IDS)) {
    if (key.includes(k)) return [id, key];
  }
  return null;
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  const mode = searchParams.get("mode") || "full";

  if (secret !== "sarkari123auto") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];
  let newsAdded = 0, templateAdded = 0, resultsAdded = 0, admitsAdded = 0;
  let realNewsAdded = 0;
  let cleanupDone = 0, vacanciesAdded = 0, answersAdded = 0;

  try {
    // ========== CLEANUP: Remove stale/duplicate entries ==========
    if (mode === "full" || mode === "cleanup") {
      const { data: updates } = await adminSupabase.from("updates").select("id,title").order("created_at", { ascending: false });
      if (updates) {
        const seen = new Set();
        for (const u of updates) {
          const key = u.title.toLowerCase().trim();
          if (seen.has(key)) {
            await adminSupabase.from("updates").delete().eq("id", u.id);
            cleanupDone++;
          } else {
            seen.add(key);
          }
        }
      }
    }

    // ========== NEWS MONITOR: Check official sources ==========
    if (mode === "full" || mode === "news") {
      const sources = [
        // SSC
        { url: "https://ssc.gov.in", name: "SSC", match: /SSC/i },
        // UPSC
        { url: "https://upsc.gov.in/whats-new", name: "UPSC", match: /result|exam|admit|interview/i },
        // NTA
        { url: "https://nta.ac.in/NoticeBoard", name: "NTA", match: /result|exam|admit|score/i },
        // Railway
        { url: "https://indianrailways.gov.in/railwayboard/view_section.jsp?lang=0&id=0,1,304,366,537", name: "Railway", match: /recruitment|exam|result|rrb/i },
        // IBPS  
        { url: "https://ibps.in", name: "IBPS", match: /result|exam|admit|recruitment|clerk|po|rrb/i },
        // CTET
        { url: "https://ctet.nic.in", name: "CTET", match: /ctet|result|admit|answer/i },
        // RBI
        { url: "https://rbi.org.in/Scripts/BS_ViewBulletin.aspx", name: "RBI", match: /recruitment|exam|result|grade b/i },
        // SBI
        { url: "https://sbi.co.in/careers", name: "SBI", match: /result|admit|po|clerk|recruitment/i },
        // Defence
        { url: "https://upsc.gov.in/whats-new", name: "Defence", match: /nda|cds|afcat|result|admit/i },
        // Police
        { url: "https://bprd.nic.in", name: "Police", match: /recruitment|result|exam/i },
      ];

      for (const src of sources) {
        try {
          const res = await fetch(src.url, { signal: AbortSignal.timeout(5000) });
          const html = await res.text();
          // Extract text between specific tags or use basic text extraction
          const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").substring(0, 5000);
          const lines = text.split(/\.|\n/).filter(l => l.trim().length > 15 && l.trim().length < 200);

          for (const line of lines.slice(0, 15)) {
            if (!src.match.test(line)) continue;

            const lower = line.toLowerCase();
            let type = "notification";
            if (lower.includes("result") || lower.includes("score") || lower.includes("marks")) type = "result";
            else if (lower.includes("admit") || lower.includes("hall ticket") || lower.includes("call letter")) type = "admit_card";
            else if (lower.includes("syllabus") || lower.includes("curriculum") || lower.includes("pattern")) type = "syllabus";
            else if (lower.includes("answer") || lower.includes("key") || lower.includes("solution")) type = "answer_key";
            else if (lower.includes("vacancy") || lower.includes("recruitment") || lower.includes("apply")) type = "vacancy";
            else if (lower.includes("cutoff") || lower.includes("cut off") || lower.includes("qualifying")) type = "cutoff";

            let examName = src.name;
            for (const [ename] of Object.entries(EXAM_IDS)) {
              if (lower.includes(ename)) {
                examName = ename.toUpperCase();
                break;
              }
            }

            const displayTitle = `📰 ${examName} ${type.replace("_", " ")} Update`;
            const { data: exists } = await supabase.from("updates").select("id").eq("title", displayTitle).maybeSingle();
            if (exists) continue;

            const examMatch = matchExam(examName);
            await supabase.from("updates").insert({
              exam_id: examMatch ? examMatch[0] : null,
              update_type: type,
              title: displayTitle,
              description: line.trim().substring(0, 200),
              official_link: OFFICIAL_LINKS[examMatch?.[0]] || src.url,
              publish_date: today,
              is_verified: false,
            });
            newsAdded++;

            if (type === "result") {
              const { data: rExists } = await adminSupabase.from("results").select("id").eq("exam_name", `${examName} Result`).maybeSingle();
              if (!rExists) {
                await adminSupabase.from("results").insert({ exam_name: `${examName} Result`, exam_id: examMatch?.[0] || null, result_title: "Result Declared", status: "declared" });
                resultsAdded++;
              }
            }
            if (type === "admit_card") {
              const { data: aExists } = await adminSupabase.from("admit_cards").select("id").eq("exam_name", `${examName} Admit Card`).maybeSingle();
              if (!aExists) {
                await adminSupabase.from("admit_cards").insert({ exam_name: `${examName} Admit Card`, exam_id: examMatch?.[0] || null, title: "Admit Card Released", status: "released" });
                admitsAdded++;
              }
            }
            if (type === "vacancy") {
              const { data: vExists } = await adminSupabase.from("upcoming_exams").select("id").eq("exam_name", `${examName} Vacancy`).maybeSingle();
              if (!vExists) {
                await adminSupabase.from("upcoming_exams").insert({ exam_name: `${examName} Vacancy`, category: examMatch?.[1] || src.name, status: "vacancy_out" });
                vacanciesAdded++;
              }
            }
            if (type === "answer_key") {
              const { data: kExists } = await adminSupabase.from("answer_keys").select("id").eq("exam_name", `${examName} Answer Key`).maybeSingle();
              if (!kExists) {
                await adminSupabase.from("answer_keys").insert({ exam_name: `${examName} Answer Key`, exam_id: examMatch?.[0] || null, status: "released" });
                answersAdded++;
              }
            }
          }
        } catch (e) {
          // Skip failed source
          continue;
        }
      }
    }

    // ========== REAL NEWS TRACKER: Google News RSS (daily result/admit card tracking) ==========
    if (mode === "full" || mode === "news" || mode === "real") {
      const NEWS_QUERIES = [
        "sarkari result admit card",
        "SSC result",
        "UPSC result",
        "RRB admit card",
        "IBPS result",
        "NTA admit card",
        "CTET result admit card",
        "Bihar Police result",
        "UP Police result",
        "NEET result",
        "JEE Main result",
        "Railway group d result",
      ];
      const KNOWN_OFFICIAL = {
        "up police": "https://uppbpb.gov.in",
        "bihar police": "https://csbc.bihar.gov.in",
        "nmms": "https://nmmssa.in",
        "csir net": "https://csirnet.nta.nic.in",
        "ugc net": "https://ugcnet.nta.nic.in",
        "cuet": "https://cuet.nta.nic.in",
        "neet": "https://neet.nta.nic.in",
        "jee main": "https://jeemain.nta.ac.in",
        "navodaya": "https://navodaya.gov.in",
        "kvs": "https://kvsangathan.nic.in",
        "ctet": "https://ctet.nic.in",
        "upsssc": "https://upsssc.gov.in",
        "tnpsc": "https://tnpsc.gov.in",
        "wbpsc": "https://wbpsc.gov.in",
        "mpsc": "https://mpsc.gov.in",
        "kpsc": "https://kpsc.kar.nic.in",
        "apsc": "https://apsc.nic.in",
      };
      const classifyUpdate = (t) => {
        const k = t.toLowerCase();
        if (/(admit card|hall ticket|call letter|admitcard|hallticket)/.test(k)) return "admit_card";
        if (/(answer key|answerkey|answer keys|omr)/.test(k)) return "answer_key";
        if (/(syllabus)/.test(k)) return "syllabus";
        if (/(result|merit|shortlist|selected|qualified|declared)/.test(k)) return "result";
        return "general";
      };
      const rRes = await fetch(supabaseUrl + "/rest/v1/updates?select=title&order=created_at.desc&limit=1000", {
        headers: { apikey: anonKey, Authorization: "Bearer " + anonKey }, cache: "no-store",
      });
      const recentRows = rRes.ok ? await rRes.json() : null;
      const existingTitles = new Set();
      (recentRows || []).forEach((r) => {
        const k = (r.title || "").toLowerCase().trim();
        existingTitles.add(k);
        existingTitles.add(k.slice(0, 177));
      });
      for (const q of NEWS_QUERIES) {
        try {
          const rssUrl = "https://news.google.com/rss/search?q=" + encodeURIComponent(q) + "&hl=en-IN&gl=IN&ceid=IN:en";
          const res = await fetch(rssUrl, { signal: AbortSignal.timeout(8000), headers: { "User-Agent": "Mozilla/5.0" } });
          const xml = await res.text();
          const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
          for (const m of items) {
            if (realNewsAdded >= 14) break;
            const tMatch = m[1].match(/<title>(.*?)<\/title>/);
            if (!tMatch) continue;
            let title = tMatch[1].replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();
            if (!title || title.length < 15) continue;
            const key = title.toLowerCase().trim();
            if (existingTitles.has(key) || existingTitles.has(key.slice(0, 177))) continue;
            if (!/(sarkari|result|admit|hall ticket|answer key|exam date|notification|recruitment|shortlist|merit|declared)/.test(key)) continue;
            const examMatch = matchExam(title);
            if (!examMatch && !/(ssc|upsc|rrb|railway|ibps|sbi|rbi|bank|neet|jee|ctet|nta|bpsc|uppsc|mppsc|rpsc|police|nda|cds|afcat|lic|epfo|navy|army|air force|kvs|nvs|dsssb|nmms|ugc net|csir)/.test(key)) continue;
            const type = classifyUpdate(title);
            const knownKey = (examMatch && examMatch[1]) || Object.keys(KNOWN_OFFICIAL).find((kk) => key.includes(kk)) || null;
            const examId = examMatch ? examMatch[0] : null;
            const link = OFFICIAL_LINKS[examId] || (knownKey ? KNOWN_OFFICIAL[knownKey] : null);
            const insertTitle = title.length > 180 ? title.slice(0, 177) + "..." : title;
            const dRes = await fetch(supabaseUrl + "/rest/v1/updates?select=id&title=eq." + encodeURIComponent(insertTitle) + "&limit=1", {
              headers: { apikey: anonKey, Authorization: "Bearer " + anonKey }, cache: "no-store",
            });
            const dup = dRes.ok ? await dRes.json() : null;
            if (dup && dup.length) continue;
            await fetch(supabaseUrl + "/rest/v1/updates", {
              method: "POST",
              headers: { apikey: anonKey, Authorization: "Bearer " + anonKey, "Content-Type": "application/json", Prefer: "return=minimal" },
              body: JSON.stringify([{
                exam_id: examId,
                update_type: type,
                title: insertTitle,
                description: "Auto-tracked from Google News. Official site par confirm karein.",
                official_link: link,
                publish_date: today,
                is_verified: false,
              }]),
            });
            existingTitles.add(insertTitle.toLowerCase().trim());
            existingTitles.add(insertTitle.toLowerCase().trim().slice(0, 177));
            realNewsAdded++;
            const examLabel = examMatch ? examMatch[1] : insertTitle.slice(0, 40);
            if (type === "result") {
              const { data: rDup } = await adminSupabase.from("results").select("id").eq("result_title", insertTitle).limit(1);
              if (!rDup || !rDup.length) {
                await adminSupabase.from("results").insert({ exam_id: examId, exam_name: examLabel, result_title: insertTitle, result_url: link, status: "declared" });
                resultsAdded++;
              }
            }
            if (type === "admit_card") {
              const { data: aDup } = await adminSupabase.from("admit_cards").select("id").eq("title", insertTitle).limit(1);
              if (!aDup || !aDup.length) {
                await adminSupabase.from("admit_cards").insert({ exam_id: examId, exam_name: examLabel, title: insertTitle, download_url: link, status: "released" });
                admitsAdded++;
              }
            }
          }
        } catch (e) {
          continue;
        }
        if (realNewsAdded >= 14) break;
      }
      // Self-heal: delete any duplicate titles created in this run (keep newest)
      if (realNewsAdded > 0) {
        try {
          const hRes = await fetch(supabaseUrl + "/rest/v1/updates?select=id,title&order=created_at.desc&limit=1000", {
            headers: { apikey: serviceKey, Authorization: "Bearer " + serviceKey }, cache: "no-store",
          });
          const allRows = hRes.ok ? await hRes.json() : [];
          const seenT = new Set();
          for (const u of allRows) {
            const k = (u.title || "").toLowerCase().trim();
            if (seenT.has(k)) {
              await fetch(supabaseUrl + "/rest/v1/updates?id=eq." + u.id, {
                method: "DELETE",
                headers: { apikey: serviceKey, Authorization: "Bearer " + serviceKey },
              });
            } else {
              seenT.add(k);
            }
          }
        } catch (e) {}
      }
    }

    // ========== TEMPLATES: Rotating result/admit card templates ==========
    if ((mode === "full" || mode === "templates") && realNewsAdded < 3) {
      const templates = [
        ["SSC CGL","result","SSC CGL Tier 1 result update."],
        ["SSC CHSL","result","SSC CHSL result declared."],
        ["SSC GD","result","SSC GD Constable result update."],
        ["SSC MTS","result","SSC MTS result announced."],
        ["SSC Stenographer","result","SSC Stenographer result announced."],
        ["SSC CPO","result","SSC CPO result update."],
        ["UPSC CSE","result","UPSC CSE result update."],
        ["UPSC CAPF","result","UPSC CAPF result announced."],
        ["NEET UG","result","NEET UG result declared."],
        ["JEE Main","result","JEE Main session result."],
        ["JEE Advanced","result","JEE Advanced result declared."],
        ["IBPS PO","result","IBPS PO result released."],
        ["IBPS Clerk","result","IBPS Clerk result update."],
        ["IBPS RRB","result","IBPS RRB result released."],
        ["SBI PO","result","SBI PO result declared."],
        ["SBI Clerk","result","SBI Clerk result update."],
        ["RBI Grade B","result","RBI Grade B result released."],
        ["Railway NTPC","result","RRB NTPC result update."],
        ["RRB Group D","result","RRB Group D result declared."],
        ["RRB JE","result","RRB JE result announced."],
        ["NDA","result","NDA result declared."],
        ["CDS","result","CDS result announced."],
        ["CTET","admit_card","CTET admit card released."],
        ["UPSC CSE","admit_card","UPSC CSE admit card available."],
        ["SSC CGL","admit_card","SSC CGL admit card available."],
        ["SSC CHSL","admit_card","SSC CHSL admit card released."],
        ["SSC Stenographer","admit_card","SSC Stenographer admit card released."],
        ["JEE Main","admit_card","JEE Main admit card released."],
        ["NEET UG","admit_card","NEET UG admit card available."],
        ["IBPS PO","admit_card","IBPS PO admit card released."],
        ["IBPS Clerk","admit_card","IBPS Clerk admit card released."],
        ["Railway NTPC","admit_card","RRB NTPC admit card available."],
        ["RRB Group D","admit_card","RRB Group D admit card released."],
        ["BPSC","admit_card","BPSC admit card released."],
        ["BPSC","result","BPSC result update."],
        ["UP Police","result","UP Police result declared."],
        ["UPPSC","result","UPPSC result update."],
        ["MPPSC","result","MPPSC result declared."],
        ["RPSC","result","RPSC result announced."],
        ["CTET","result","CTET result update."],
        ["DSSSB","result","DSSSB result declared."],
        ["EPFO","result","EPFO result update."],
        ["SEBI","result","SEBI Grade A result declared."],
        ["NABARD","result","NABARD result update."],
        ["Coast Guard","result","Indian Coast Guard result update."],
        ["AIBE","result","AIBE result declared."],
        ["RPF","result","RPF result update."],
        ["CBI","result","CBI result announced."],
        ["CAPF","result","CAPF result declared."],
      ];

      const day = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
      const sorted = [...templates].sort((a, b) => (templates.indexOf(a) * 17 + day) % 60 - (templates.indexOf(b) * 17 + day) % 60);

      for (const [name, type, desc] of sorted.slice(0, 6)) {
        const title = `${name} ${type === "result" ? "Result" : "Admit Card"} - ${today}`;
        const { data: exists } = await supabase.from("updates").select("id").eq("title", title).maybeSingle();
        if (!exists) {
          const match = matchExam(name);
          const link = OFFICIAL_LINKS[match?.[0]];
          await supabase.from("updates").insert({
            exam_id: match ? match[0] : null,
            update_type: type,
            title,
            description: desc,
            publish_date: today,
            is_verified: true,
            official_link: link || null,
          });
          templateAdded++;
        }
      }
    }

    return Response.json({
      success: true,
      date: today,
      mode,
      duplicates_cleaned: cleanupDone,
      news_monitor_added: newsAdded,
      real_news_added: realNewsAdded,
      debug_build: "v4-rest",
      template_added: templateAdded,
      results_auto_added: resultsAdded,
      admit_cards_auto_added: admitsAdded,
      vacancies_auto_added: vacanciesAdded,
      answer_keys_auto_added: answersAdded,
      message: "Auto-update completed!",
    });

  } catch (e) {
    return Response.json({ success: false, date: today, error: e.message }, { status: 500 });
  }
}


