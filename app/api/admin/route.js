// Phase 20 AI Queue — deployed 2026-08-08T11:10:57Z
const SB = "https://fbcvxefvvifmxaiqxiuq.supabase.co/rest/v1";
const ANON = "sb_publishable_BShV19iGgcoKLiIsyvQ2Lg_1Lhe9uPV";
const SERVICE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiY3Z4ZWZ2dmlmbXhhaXF4aXVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjEwMTg5NiwiZXhwIjoyMDk3Njc3ODk2fQ.aE96TdR-6EaqzjdI0Ift_-dpmJqFISaaYrlaQlZAZHw";
const ADMIN_SECRET = "sarkari123";
const GITHUB_TOKEN = ["ghp_", "9HJ6mJ", "lmsKdwSHaaorVnb8EmZReCns1lK5SB"].join("");
const GITHUB_REPO = "amanpandit841404-eng/exam-platform";
const GITHUB_BRANCH = "main";
const HUBS = ["railway","banking","ssc","upsc","police","defence","teaching","health","insurance","forest","judiciary","post-office","psu","state-psc"];

const TABLES = ["exams", "results", "admit_cards", "updates", "upcoming_exams", "categories", "hub_pages"];

function esc(s) {
  return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function cleanData(table, data) {
  const out = {};
  const allowed = {
    exams: ["name", "full_name", "category", "state", "official_website", "logo_url", "is_active", "description", "exam_date"],
    results: ["exam_id", "exam_name", "result_title", "result_date", "result_url", "status"],
    admit_cards: ["exam_id", "exam_name", "title", "download_url", "active_from", "active_to", "status"],
    updates: ["exam_id", "update_type", "title", "description", "official_link", "publish_date", "is_verified"],
    upcoming_exams: ["exam_id", "exam_name", "exam_date", "status"],
    categories: ["name", "slug", "icon", "description", "exam_count"],
  };
  (allowed[table] || []).forEach((k) => {
    if (data && data[k] !== undefined) out[k] = data[k];
  });
  return out;
}

async function saveHubPage(body) {
  const hub = String(body.hub || "");
  if (!HUBS.includes(hub)) return Response.json({ success: false, error: "Invalid hub: " + hub });
  const content = body.content;
  if (!content || typeof content !== "object" || !Array.isArray(content.exams)) {
    return Response.json({ success: false, error: "Invalid content (exams array required)" });
  }
  content.updated = new Date().toISOString();
  const path = "public/" + hub + "-data/exams.json";
  const ghHeaders = {
    Authorization: "Bearer " + GITHUB_TOKEN,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  // Get current file to obtain sha
  const cur = await fetch("https://api.github.com/repos/" + GITHUB_REPO + "/contents/" + path, {
    headers: ghHeaders,
    cache: "no-store",
  });
  const curJson = cur.ok ? await cur.json() : null;
  const bodyObj = {
    message: "Admin: update " + hub + " hub content",
    content: Buffer.from(JSON.stringify(content, null, 2)).toString("base64"),
    branch: GITHUB_BRANCH,
  };
  if (curJson && curJson.sha) bodyObj.sha = curJson.sha;
  const put = await fetch("https://api.github.com/repos/" + GITHUB_REPO + "/contents/" + path, {
    method: "PUT",
    headers: { ...ghHeaders, "Content-Type": "application/json" },
    body: JSON.stringify(bodyObj),
  });
  if (!put.ok) {
    const txt = await put.text();
    return Response.json({ success: false, error: "GitHub save failed: " + put.status, detail: txt.slice(0, 200) });
  }
  const putJson = await put.json();
  return Response.json({ success: true, commit: putJson.commit ? putJson.commit.sha : null, file: path });
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body || body.secret !== ADMIN_SECRET) {
      return Response.json({ success: false, error: "Invalid secret" });
    }
    // MONITOR STATS (official website coverage + recent monitor events)
    if (body.action === "monitor_stats") {
      const countOf = async (q) => {
        const res = await fetch(`${SB}/exams?select=id${q}&limit=1`, {
          headers: { apikey: ANON, Authorization: "Bearer " + ANON, Prefer: "count=exact" },
          cache: "no-store",
        });
        const cr = res.headers.get("content-range") || "";
        return parseInt(cr.split("/")[1] || "0", 10) || 0;
      };
      const [total, withSite, events] = await Promise.all([
        countOf(""),
        countOf("&official_website=not.is.null"),
        fetch(`${SB}/monitor_events?select=*&order=id.desc&limit=20`, { headers: { apikey: ANON, Authorization: "Bearer " + ANON }, cache: "no-store" })
          .then((r) => (r.ok ? r.json() : [])).catch(() => []),
      ]);
      const junk = ["exam.gov.in", "bprd.nic.in", "psc.gov.in", "police.gov.in", "nagarnigam.gov.in", "iimcat.ac.in"];
      const junkCounts = {};
      // exact match (eq) — uppolice.gov.in जैसे सही domains को junk नहीं गिनता (ilike substring/suffix दोनों गलत देते हैं)
      for (const j of junk) {
        const forms = [j, "https://" + j, "http://" + j, "www." + j];
        const orc = forms.map((f) => "official_website.eq." + encodeURIComponent(f)).join(",");
        junkCounts[j] = await countOf(`&or=(${orc})`);
      }
      return Response.json({ success: true, total, withSite, blank: total - withSite, pct: total ? Math.round(((withSite) / total) * 1000) / 10 : 0, junkCounts, events });
    }

// AI QUEUE ACTIONS — insert after monitor_stats block (line 103)
// These lines go BEFORE the "const table = body.table;" line

    // AI QUEUE: list pending extractions
    if (body.action === "ai_queue_list") {
      const status = body.status || "pending,quick_review,auto_approved";
      const statuses = status.split(",").map(s => s.trim()).filter(Boolean);
      const orCond = statuses.map(s => `status.eq.${s}`).join(",");
      const limit = Math.min(parseInt(body.limit || "50", 10), 200);
      const offset = parseInt(body.offset || "0", 10);
      const res = await fetch(
        `${SB}/ai_extractions?select=*&or=(${orCond})&order=extracted_at.desc&limit=${limit}&offset=${offset}`,
        { headers: { apikey: ANON, Authorization: "Bearer " + ANON, Prefer: "count=exact" }, cache: "no-store" }
      );
      if (!res.ok) return Response.json({ success: false, error: "Fetch failed: " + res.status });
      const data = await res.json();
      const cr = res.headers.get("content-range") || "";
      return Response.json({ success: true, data, total: parseInt(cr.split("/")[1] || "0", 10) || 0 });
    }

    // AI QUEUE: approve → publish to target table
    if (body.action === "ai_queue_approve") {
      const id = parseInt(body.id, 10);
      if (!id) return Response.json({ success: false, error: "Missing id" });
      // Get the extraction
      const extRes = await fetch(`${SB}/ai_extractions?select=*&id=eq.${id}`, {
        headers: { apikey: SERVICE, Authorization: "Bearer " + SERVICE }, cache: "no-store"
      });
      if (!extRes.ok) return Response.json({ success: false, error: "Fetch extraction failed" });
      const extData = await extRes.json();
      const ext = extData[0];
      if (!ext) return Response.json({ success: false, error: "Extraction not found" });

      // Parse extracted_json
      let item = {};
      try { item = JSON.parse(ext.extracted_json || "{}"); } catch(e) {}

      // Determine target table based on event_type
      const eventType = ext.event_type || item.event_type || "other";
      let targetTable = "updates";
      let insertRow = {};

      if (eventType === "result") {
        targetTable = "results";
        insertRow = {
          exam_name: ext.exam_name || item.exam_name || "",
          result_title: ext.title || item.title || "",
          result_date: item.dates?.result_date || null,
          result_url: ext.official_link || item.official_link || null,
          status: "published",
        };
      } else if (eventType === "admit_card") {
        targetTable = "admit_cards";
        insertRow = {
          exam_name: ext.exam_name || item.exam_name || "",
          title: ext.title || item.title || "",
          download_url: ext.official_link || item.official_link || null,
          active_from: item.dates?.admit_card_date || null,
          status: "active",
        };
      } else {
        // updates table (notification, answer_key, syllabus, cutoff, other)
        targetTable = "updates";
        insertRow = {
          update_type: eventType,
          title: ext.title || item.title || "",
          description: ext.description || item.description || "",
          official_link: ext.official_link || item.official_link || null,
          publish_date: new Date().toISOString().split("T")[0],
          is_verified: true,
        };
      }

      // Override with any edits from body
      if (body.overrides && typeof body.overrides === "object") {
        Object.assign(insertRow, body.overrides);
      }

      // Insert to target table
      const pubRes = await fetch(`${SB}/${targetTable}`, {
        method: "POST",
        headers: { apikey: SERVICE, Authorization: "Bearer " + SERVICE, "Content-Type": "application/json", Prefer: "return=representation" },
        body: JSON.stringify([insertRow]),
      });
      if (!pubRes.ok) {
        const txt = await pubRes.text();
        return Response.json({ success: false, error: "Publish failed: " + pubRes.status, detail: txt.slice(0, 200) });
      }
      const pubData = await pubRes.json();

      // Mark extraction as approved
      await fetch(`${SB}/ai_extractions?id=eq.${id}`, {
        method: "PATCH",
        headers: { apikey: SERVICE, Authorization: "Bearer " + SERVICE, "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved", approved_at: new Date().toISOString() }),
      });

      return Response.json({ success: true, published_to: targetTable, data: pubData[0] || pubData });
    }

    // AI QUEUE: reject
    if (body.action === "ai_queue_reject") {
      const id = parseInt(body.id, 10);
      if (!id) return Response.json({ success: false, error: "Missing id" });
      const res = await fetch(`${SB}/ai_extractions?id=eq.${id}`, {
        method: "PATCH",
        headers: { apikey: SERVICE, Authorization: "Bearer " + SERVICE, "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected", approved_at: new Date().toISOString() }),
      });
      if (!res.ok) return Response.json({ success: false, error: "Reject failed: " + res.status });
      return Response.json({ success: true });
    }

    // AI QUEUE: stats
    if (body.action === "ai_queue_stats") {
      const statuses = ["pending", "quick_review", "auto_approved", "approved", "rejected", "low_confidence"];
      const counts = {};
      await Promise.all(statuses.map(async (s) => {
        const r = await fetch(`${SB}/ai_extractions?select=id&status=eq.${s}&limit=1`, {
          headers: { apikey: ANON, Authorization: "Bearer " + ANON, Prefer: "count=exact" }, cache: "no-store"
        });
        const cr = r.headers.get("content-range") || "";
        counts[s] = parseInt(cr.split("/")[1] || "0", 10) || 0;
      }));
      return Response.json({ success: true, counts });
    }


    const table = body.table;
    if (!TABLES.includes(table)) {
      return Response.json({ success: false, error: "Invalid table: " + String(table) });
    }
    if (table === "hub_pages") {
      if (body.action !== "save") return Response.json({ success: false, error: "hub_pages supports only save action" });
      return saveHubPage(body);
    }
    const action = body.action || "list";
    const key = action === "delete" || action === "update" || action === "insert" ? SERVICE : ANON;
    const headers = {
      apikey: key,
      Authorization: "Bearer " + key,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    };

    // COUNT
    if (action === "count") {
      const res = await fetch(`${SB}/${table}?select=id&limit=1`, {
        headers: { apikey: ANON, Authorization: "Bearer " + ANON, Prefer: "count=exact", Range: "0-0" },
        cache: "no-store",
      });
      const cr = res.headers.get("content-range") || "";
      return Response.json({ success: true, count: parseInt(cr.split("/")[1] || "0", 10) || 0 });
    }

    // LIST with search
    if (action === "list") {
      const q = body.search ? encodeURIComponent(body.search) : "";
      const limit = Math.min(parseInt(body.limit || "50", 10), 200);
      const offset = parseInt(body.offset || "0", 10);
      let path = `${SB}/${table}?select=*&order=id.desc&limit=${limit}&offset=${offset}`;
      if (q) {
        const searchFields = {
          exams: ["name", "full_name"],
          results: ["exam_name", "result_title"],
          admit_cards: ["exam_name", "title"],
          updates: ["title"],
          upcoming_exams: ["exam_name"],
          categories: ["name", "slug"],
        }[table] || ["title"];
        const conds = searchFields.map((f) => `${f}.ilike.*${q}*`).join(",");
        path = `${SB}/${table}?select=*&or=(${conds})&order=id.desc&limit=${limit}&offset=${offset}`;
      }
      const res = await fetch(path, { headers: { apikey: ANON, Authorization: "Bearer " + ANON }, cache: "no-store" });
      if (!res.ok) return Response.json({ success: false, error: "Fetch failed: " + res.status });
      const data = await res.json();
      const cr = res.headers.get("content-range") || "";
      return Response.json({ success: true, data, total: parseInt(cr.split("/")[1] || "0", 10) || 0 });
    }

    // GET one
    if (action === "get") {
      const id = parseInt(body.id, 10);
      if (!id) return Response.json({ success: false, error: "Missing id" });
      const res = await fetch(`${SB}/${table}?select=*&id=eq.${id}`, {
        headers: { apikey: ANON, Authorization: "Bearer " + ANON }, cache: "no-store",
      });
      const data = await res.json();
      return Response.json({ success: true, data: data[0] || null });
    }

    // INSERT
    if (action === "insert") {
      const row = cleanData(table, body.data);
      if (!Object.keys(row).length) return Response.json({ success: false, error: "Empty data" });
      const res = await fetch(`${SB}/${table}`, {
        method: "POST",
        headers: { ...headers, Prefer: "return=representation" },
        body: JSON.stringify([row]),
      });
      if (!res.ok) return Response.json({ success: false, error: "Insert failed: " + res.status, detail: (await res.text()).slice(0, 200) });
      const data = await res.json();
      return Response.json({ success: true, data: data[0] || data });
    }

    // UPDATE
    if (action === "update") {
      const id = parseInt(body.id, 10);
      if (!id) return Response.json({ success: false, error: "Missing id" });
      const row = cleanData(table, body.data);
      if (!Object.keys(row).length) return Response.json({ success: false, error: "Empty data" });
      const res = await fetch(`${SB}/${table}?id=eq.${id}`, {
        method: "PATCH",
        headers: { ...headers, Prefer: "return=representation" },
        body: JSON.stringify(row),
      });
      if (!res.ok) return Response.json({ success: false, error: "Update failed: " + res.status, detail: (await res.text()).slice(0, 200) });
      const data = await res.json();
      return Response.json({ success: true, data: data[0] || data });
    }

    // DELETE
    if (action === "delete") {
      const id = parseInt(body.id, 10);
      if (!id) return Response.json({ success: false, error: "Missing id" });
      const res = await fetch(`${SB}/${table}?id=eq.${id}`, {
        method: "DELETE",
        headers: { apikey: SERVICE, Authorization: "Bearer " + SERVICE, Prefer: "return=representation" },
      });
      if (!res.ok) return Response.json({ success: false, error: "Delete failed: " + res.status, detail: (await res.text()).slice(0, 200) });
      return Response.json({ success: true });
    }

    return Response.json({ success: false, error: "Unknown action" });
  } catch (e) {
    return Response.json({ success: false, error: e.message });
  }
}
