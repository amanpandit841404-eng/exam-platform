"use client";
import { useState, useEffect, useCallback } from "react";

const ADMIN_PASSWORD = "sarkari123";

const TABLES = [
  { key: "dashboard", icon: "📊", label: "Dashboard", color: "#1e40af" },
  { key: "exams", icon: "📝", label: "Exams", color: "#2563eb" },
  { key: "results", icon: "🏆", label: "Results", color: "#16a34a" },
  { key: "admits", icon: "🎫", label: "Admit Cards", color: "#ea580c" },
  { key: "updates", icon: "🔄", label: "Updates", color: "#dc2626" },
  { key: "upcoming", icon: "📅", label: "Upcoming", color: "#7c3aed" },
];

const FIELD_DEFS = {
  exams: [
    { key: "name", label: "Name", type: "text" },
    { key: "full_name", label: "Full Name", type: "text" },
    { key: "category", label: "Category", type: "text" },
    { key: "state", label: "State", type: "text" },
    { key: "official_website", label: "Official Website", type: "text" },
    { key: "logo_url", label: "Logo URL", type: "text" },
    { key: "is_active", label: "Active", type: "bool" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "exam_date", label: "Exam Date", type: "text" },
  ],
  results: [
    { key: "exam_id", label: "Exam ID", type: "number" },
    { key: "exam_name", label: "Exam Name", type: "text" },
    { key: "result_title", label: "Result Title", type: "text" },
    { key: "result_date", label: "Result Date", type: "text" },
    { key: "result_url", label: "Result URL", type: "text" },
    { key: "status", label: "Status", type: "select", options: ["declared", "expected", "pending"] },
  ],
  admits: [
    { key: "exam_id", label: "Exam ID", type: "number" },
    { key: "exam_name", label: "Exam Name", type: "text" },
    { key: "title", label: "Title", type: "text" },
    { key: "download_url", label: "Download URL", type: "text" },
    { key: "active_from", label: "Active From", type: "text" },
    { key: "active_to", label: "Active To", type: "text" },
    { key: "status", label: "Status", type: "select", options: ["released", "expected", "pending"] },
  ],
  updates: [
    { key: "exam_id", label: "Exam ID", type: "number" },
    { key: "update_type", label: "Type", type: "select", options: ["result", "admit_card", "answer_key", "syllabus", "general"] },
    { key: "title", label: "Title", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "official_link", label: "Official Link", type: "text" },
    { key: "publish_date", label: "Publish Date", type: "text" },
    { key: "is_verified", label: "Verified", type: "bool" },
  ],
  upcoming: [
    { key: "exam_id", label: "Exam ID", type: "number" },
    { key: "exam_name", label: "Exam Name", type: "text" },
    { key: "exam_date", label: "Exam Date", type: "text" },
    { key: "status", label: "Status", type: "text" },
  ],
};

const styles = {
  page: { minHeight: "100vh", background: "#f0f4f8", fontFamily: "'Segoe UI',Arial,sans-serif" },
  header: { background: "linear-gradient(135deg, #1e3a5f, #2563eb)", padding: "16px 20px", color: "#fff" },
  headerTitle: { fontSize: 22, fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 8 },
  headerSub: { fontSize: 12, opacity: 0.85, marginTop: 2 },
  container: { maxWidth: 1100, margin: "0 auto", padding: "12px 12px 90px" },
  tabBar: { display: "flex", gap: 6, flexWrap: "wrap", margin: "-8px 0 16px" },
  tabBtn: (active, color) => ({
    padding: "10px 14px", borderRadius: 10, border: "none", fontSize: 13, fontWeight: active ? 600 : 400,
    cursor: "pointer", background: active ? color : "#fff", color: active ? "#fff" : "#444",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 5, transition: "all .2s",
  }),
  card: { background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: 12 },
  input: { width: "100%", padding: "9px 12px", fontSize: 13, border: "1px solid #d1d5db", borderRadius: 8, outline: "none", boxSizing: "border-box" },
  btn: (bg, sm) => ({ padding: sm ? "6px 12px" : "10px 18px", background: bg, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }),
  listItem: { display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "#fff", borderRadius: 10, marginBottom: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #eef2f7" },
  searchRow: { display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap", alignItems: "center" },
  badge: (c) => ({ background: c, color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 999, whiteSpace: "nowrap" }),
  modal: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15,23,42,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 999 },
  modalBox: { background: "#fff", borderRadius: 16, padding: 20, width: "100%", maxWidth: 640, maxHeight: "85vh", overflowY: "auto" },
  toast: (type) => ({ position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)", padding: "10px 22px", borderRadius: 10, zIndex: 9999, background: type === "success" ? "#16a34a" : "#dc2626", color: "#fff", fontSize: 13, fontWeight: 500, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }),
  statCard: (c) => ({ background: "#fff", borderRadius: 12, padding: 16, textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }),
};

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [tab, setTab] = useState("dashboard");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});

  // per-table state
  const [tableData, setTableData] = useState({ exams: [], results: [], admits: [], updates: [], upcoming: [] });
  const [totals, setTotals] = useState({});
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null); // { table, row }
  const [adding, setAdding] = useState(null); // table key
  const [form, setForm] = useState({});

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 2800); };

  const api = async (payload) => {
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: ADMIN_PASSWORD, ...payload }),
    });
    return res.json();
  };

  const loadStats = useCallback(async () => {
    try {
      const [ex, re, ad, ud, up] = await Promise.all([
        api({ action: "count", table: "exams" }),
        api({ action: "count", table: "results" }),
        api({ action: "count", table: "admit_cards" }),
        api({ action: "count", table: "updates" }),
        api({ action: "count", table: "upcoming_exams" }),
      ]);
      setStats({ exams: ex.count || 0, results: re.count || 0, admits: ad.count || 0, updates: ud.count || 0, upcoming: up.count || 0 });
    } catch (e) { showToast("Stats error", "error"); }
  }, []);

  const tableKeyFor = (t) => t === "admit_cards" ? "admits" : (t === "upcoming_exams" ? "upcoming" : t);

  const fetchTable = async (t, q) => {
    setLoading(true);
    try {
      const r = await api({ action: "list", table: t, search: q || "", limit: 50 });
      if (r.success) {
        const k = tableKeyFor(t);
        setTableData((p) => ({ ...p, [k]: r.data || [] }));
        setTotals((p) => ({ ...p, [k]: r.total || 0 }));
      } else showToast(r.error || "Fetch error", "error");
    } catch (e) { showToast("Fetch error", "error"); }
    setLoading(false);
  };

  const handleTab = (k) => {
    setTab(k);
    setEditing(null); setAdding(null); setSearch("");
    if (k === "dashboard") loadStats();
    else if (k === "exams") fetchTable("exams");
    else if (k === "results") fetchTable("results");
    else if (k === "admits") fetchTable("admit_cards");
    else if (k === "updates") fetchTable("updates");
    else if (k === "upcoming") fetchTable("upcoming_exams");
  };

  const doSearch = () => {
    const t = { exams: "exams", results: "results", admits: "admit_cards", updates: "updates", upcoming: "upcoming_exams" }[tab];
    if (t) fetchTable(t, search.trim());
  };

  const openAdd = (k) => {
    const t = { exams: "exams", results: "results", admits: "admit_cards", updates: "updates", upcoming: "upcoming_exams" }[k];
    setAdding(k);
    const empty = {};
    (FIELD_DEFS[t] || []).forEach((f) => { empty[f.key] = f.type === "bool" ? true : f.type === "number" ? "" : ""; });
    setForm(empty);
  };

  const openEdit = (k, row) => {
    setEditing({ table: k, row });
    const f = {};
    (FIELD_DEFS[k] || []).forEach((fd) => { f[fd.key] = row[fd.key] ?? ""; });
    setForm(f);
  };

  const saveRow = async () => {
    const realTable = { exams: "exams", results: "results", admits: "admit_cards", updates: "updates", upcoming: "upcoming_exams" }[editing ? editing.table : adding];
    try {
      if (editing) {
        const r = await api({ action: "update", table: realTable, id: editing.row.id, data: form });
        if (!r.success) return showToast(r.error || "Update failed", "error");
        showToast("✅ Updated");
      } else {
        const r = await api({ action: "insert", table: realTable, data: form });
        if (!r.success) return showToast(r.error || "Add failed", "error");
        showToast("✅ Added");
      }
      setEditing(null); setAdding(null);
      fetchTable(realTable, search.trim());
      if (tab === "dashboard") loadStats();
      loadStats();
    } catch (e) { showToast("Save error", "error"); }
  };

  const deleteRow = async (k, row) => {
    if (!window.confirm("Delete this row? This cannot be undone.")) return;
    const realTable = { exams: "exams", results: "results", admits: "admit_cards", updates: "updates", upcoming: "upcoming_exams" }[k];
    try {
      const r = await api({ action: "delete", table: realTable, id: row.id });
      if (!r.success) return showToast(r.error || "Delete failed", "error");
      showToast("🗑️ Deleted");
      fetchTable(realTable, search.trim());
      loadStats();
    } catch (e) { showToast("Delete error", "error"); }
  };

  const handleLogin = () => {
    if (pw === ADMIN_PASSWORD) { setAuth(true); loadStats(); }
    else setErr("❌ Wrong password!");
  };

  const FieldInput = ({ fd, value, onChange }) => {
    if (fd.type === "select") {
      return (
        <select value={value} onChange={(e) => onChange(fd.key, e.target.value)} style={styles.input}>
          {(fd.options || []).map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      );
    }
    if (fd.type === "bool") {
      return (
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, padding: "6px 0" }}>
          <input type="checkbox" checked={!!value} onChange={(e) => onChange(fd.key, e.target.checked)} style={{ width: 18, height: 18 }} />
          Yes
        </label>
      );
    }
    if (fd.type === "textarea") {
      return <textarea rows={2} value={value} onChange={(e) => onChange(fd.key, e.target.value)} style={styles.input} />;
    }
    return <input type={fd.type === "number" ? "number" : "text"} value={value} onChange={(e) => onChange(fd.key, e.target.value)} style={styles.input} />;
  };

  const renderRows = (k) => {
    const rows = tableData[k] || [];
    return (
      <div>
        <div style={styles.searchRow}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && doSearch()}
            placeholder="Search..." style={{ ...styles.input, maxWidth: 320 }} />
          <button onClick={doSearch} style={styles.btn("#2563eb")}>🔍 Search</button>
          <button onClick={() => openAdd(k)} style={styles.btn("#16a34a")}>➕ Add New</button>
          <span style={{ fontSize: 12, color: "#666", marginLeft: "auto" }}>{totals[k] !== undefined ? `${totals[k].toLocaleString()} total · showing ${rows.length}` : ""}</span>
        </div>
        {loading && <div style={{ textAlign: "center", padding: 30, color: "#999" }}>Loading...</div>}
        {!loading && rows.length === 0 && <div style={{ ...styles.card, textAlign: "center", padding: 40, color: "#999" }}>No data found. Try a different search or add new.</div>}
        {rows.map((r) => (
          <div key={r.id} style={styles.listItem}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#1e3a5f" }}>
                {r.name || r.title || r.result_title || r.exam_name || "ID: " + r.id}
              </div>
              <div style={{ fontSize: 11, color: "#666", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                #{r.id} · {r.category || r.status || r.update_type || ""} {r.exam_date ? "· 📅 " + r.exam_date : ""}
              </div>
            </div>
            <button onClick={() => openEdit(k, r)} style={{ ...styles.btn("#7c3aed", true), padding: "5px 10px" }}>✏️</button>
            <button onClick={() => deleteRow(k, r)} style={{ ...styles.btn("#dc2626", true), padding: "5px 10px" }}>🗑️</button>
          </div>
        ))}
      </div>
    );
  };

  // Login screen
  if (!auth) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0f172a,#1e3a5f)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Segoe UI',Arial,sans-serif" }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "32px 24px", width: "100%", maxWidth: 380, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🔐</div>
            <h1 style={{ fontSize: 22, color: "#1e3a5f", margin: 0 }}>SarkariSetu Admin</h1>
            <p style={{ fontSize: 12, color: "#888", margin: "4px 0 0" }}>हर table का पूरा control — Edit, Add, Delete</p>
          </div>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Enter admin password" style={{ width: "100%", padding: "12px 14px", fontSize: 15, border: "2px solid #e5e7eb", borderRadius: 10, marginBottom: 12, outline: "none", boxSizing: "border-box" }} />
          <button onClick={handleLogin} style={{ width: "100%", padding: 12, background: "linear-gradient(135deg,#2563eb,#1e40af)", color: "#fff", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: "pointer" }}>Sign In 🔓</button>
          {err && <p style={{ color: "#dc2626", textAlign: "center", marginTop: 12, fontSize: 13 }}>{err}</p>}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {toast && <div style={styles.toast(toast.type)}>{toast.msg}</div>}

      <div style={styles.header}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={styles.headerTitle}>⚙️ SarkariSetu Admin Panel</div>
          <div style={styles.headerSub}>Exams · Results · Admit Cards · Updates · Upcoming — full CRUD control</div>
        </div>
      </div>

      <div style={styles.container}>
        <div style={styles.tabBar}>
          {TABLES.map((t) => (
            <button key={t.key} onClick={() => handleTab(t.key)} style={styles.tabBtn(tab === t.key, t.color)}>
              <span>{t.icon}</span><span>{t.label}</span>
            </button>
          ))}
        </div>

        {tab === "dashboard" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))", gap: 10, marginBottom: 16 }}>
              {[
                { icon: "📝", label: "Total Exams", count: stats.exams, color: "#2563eb" },
                { icon: "🏆", label: "Results", count: stats.results, color: "#16a34a" },
                { icon: "🎫", label: "Admit Cards", count: stats.admits, color: "#ea580c" },
                { icon: "🔄", label: "Updates", count: stats.updates, color: "#dc2626" },
                { icon: "📅", label: "Upcoming Exams", count: stats.upcoming, color: "#7c3aed" },
              ].map((s, i) => (
                <div key={i} style={styles.statCard(s.color)}>
                  <div style={{ fontSize: 30 }}>{s.icon}</div>
                  <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{(s.count || 0).toLocaleString()}</div>
                  <div style={{ fontSize: 12, color: "#666", fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={styles.card}>
              <h3 style={{ margin: "0 0 10px", fontSize: 15, color: "#1e3a5f" }}>ℹ️ कैसे use करें</h3>
              <div style={{ fontSize: 13, color: "#555", lineHeight: 1.9 }}>
                • ऊपर के tabs से कोई भी section खोलो — Exams, Results, Admit Cards, Updates, Upcoming<br/>
                • <b>🔍 Search</b> — नाम से खोजो<br/>
                • <b>➕ Add New</b> — नया data जोड़ो<br/>
                • <b>✏️</b> — किसी भी row को edit करो<br/>
                • <b>🗑️</b> — row delete करो<br/>
                • Results/Admit Cards/Updates में हर change website पर तुरंत दिखता है (उनके pages live DB से fetch करते हैं)
              </div>
            </div>
          </div>
        )}

        {tab === "exams" && renderRows("exams")}
        {tab === "results" && renderRows("results")}
        {tab === "admits" && renderRows("admits")}
        {tab === "updates" && renderRows("updates")}
        {tab === "upcoming" && renderRows("upcoming")}
      </div>

      {/* Edit/Add modal */}
      {(editing || adding) && (
        <div style={styles.modal} onClick={() => { setEditing(null); setAdding(null); }}>
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 14px", fontSize: 16, color: "#1e3a5f" }}>
              {editing ? "✏️ Edit Row #" + editing.row.id : "➕ Add New"} — {TABLES.find((t) => t.key === (editing ? editing.table : adding))?.label}
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {(FIELD_DEFS[editing ? editing.table : adding] || []).map((fd) => (
                <div key={fd.key} style={{ gridColumn: fd.type === "textarea" || fd.type === "bool" ? "1 / -1" : undefined }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>{fd.label}</label>
                  <FieldInput fd={fd} value={form[fd.key]} onChange={(k, v) => setForm((p) => ({ ...p, [k]: v }))} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button onClick={saveRow} style={styles.btn("#16a34a")}>✅ Save</button>
              <button onClick={() => { setEditing(null); setAdding(null); }} style={{ ...styles.btn("#9ca3af") }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
