"use client";
    import { useState, useEffect } from "react";
    import { supabase } from "../lib/supabase";

    const ADMIN_PASSWORD = "sarkari123";

    export default function AdminPage() {
      const [authenticated, setAuthenticated] = useState(false);
      const [password, setPassword] = useState("");
      const [error, setError] = useState("");
      const [tab, setTab] = useState("dashboard");
      const [loading, setLoading] = useState(false);
      const [log, setLog] = useState([]);
      const [stats, setStats] = useState({ exams: 0, results: 0, admitCards: 0, upcomingExams: 0, updates: 0 });

      // Form states
      const [examCount, setExamCount] = useState(1000);
      const [generating, setGenerating] = useState(false);

      // CRUD states for each table
      const [resultsList, setResultsList] = useState([]);
      const [admitList, setAdmitList] = useState([]);
      const [upcomingList, setUpcomingList] = useState([]);
      const [updatesList, setUpdatesList] = useState([]);

      // Form for adding new entries
      const [newResult, setNewResult] = useState({ exam_name: "", exam_id: "", result_title: "Result Declared", status: "declared" });
      const [newAdmit, setNewAdmit] = useState({ exam_name: "", exam_id: "", title: "Admit Card Released", status: "released" });
      const [newUpcoming, setNewUpcoming] = useState({ exam_name: "", exam_id: "", exam_date: "", status: "upcoming" });
      const [newUpdate, setNewUpdate] = useState({ exam_id: "", update_type: "general", title: "", description: "", official_link: "" });

      // Editing states
      const [editResult, setEditResult] = useState(null);
      const [editAdmit, setEditAdmit] = useState(null);
      const [editUpcoming, setEditUpcoming] = useState(null);
      const [editUpdate, setEditUpdate] = useState(null);

      const addLog = (m) => setLog(prev => [m, ...prev].slice(0, 50));

      const handleLogin = () => {
        if (password === ADMIN_PASSWORD) {
          setAuthenticated(true);
          fetchStats();
        } else {
          setError("Wrong password!");
        }
      };

      const fetchStats = async () => {
        try {
          const [ex, re, ad, up, ud] = await Promise.all([
            supabase.from("exams").select("id", { count: "exact", head: true }),
            supabase.from("results").select("id", { count: "exact", head: true }),
            supabase.from("admit_cards").select("id", { count: "exact", head: true }),
            supabase.from("upcoming_exams").select("id", { count: "exact", head: true }),
            supabase.from("updates").select("id", { count: "exact", head: true }),
          ]);
          setStats({
            exams: ex.count || 0,
            results: re.count || 0,
            admitCards: ad.count || 0,
            upcomingExams: up.count || 0,
            updates: ud.count || 0,
          });
        } catch (e) {
          addLog("Error fetching stats: " + e.message);
        }
      };

      // Fetch lists
      const fetchResults = async () => {
        setLoading(true);
        try {
          const { data } = await supabase.from("results").select("*").order("created_at", { ascending: false }).limit(50);
          setResultsList(data || []);
        } catch (e) { addLog("Error: " + e.message); }
        setLoading(false);
      };

      const fetchAdmits = async () => {
        setLoading(true);
        try {
          const { data } = await supabase.from("admit_cards").select("*").order("created_at", { ascending: false }).limit(50);
          setAdmitList(data || []);
        } catch (e) { addLog("Error: " + e.message); }
        setLoading(false);
      };

      const fetchUpcoming = async () => {
        setLoading(true);
        try {
          const { data } = await supabase.from("upcoming_exams").select("*").order("created_at", { ascending: false }).limit(50);
          setUpcomingList(data || []);
        } catch (e) { addLog("Error: " + e.message); }
        setLoading(false);
      };

      const fetchUpdates = async () => {
        setLoading(true);
        try {
          const { data } = await supabase.from("updates").select("*").order("created_at", { ascending: false }).limit(50);
          setUpdatesList(data || []);
        } catch (e) { addLog("Error: " + e.message); }
        setLoading(false);
      };

      // Add entries
      const addResult = async () => {
        if (!newResult.exam_name) return addLog("Exam name required!");
        try {
          const { error } = await supabase.from("results").insert([newResult]);
          if (error) throw error;
          addLog("Result added!");
          setNewResult({ exam_name: "", exam_id: "", result_title: "Result Declared", status: "declared" });
          fetchResults();
          fetchStats();
        } catch (e) { addLog("Error: " + e.message); }
      };

      const addAdmit = async () => {
        if (!newAdmit.exam_name) return addLog("Exam name required!");
        try {
          const { error } = await supabase.from("admit_cards").insert([newAdmit]);
          if (error) throw error;
          addLog("Admit card added!");
          setNewAdmit({ exam_name: "", exam_id: "", title: "Admit Card Released", status: "released" });
          fetchAdmits();
          fetchStats();
        } catch (e) { addLog("Error: " + e.message); }
      };

      const addUpcoming = async () => {
        if (!newUpcoming.exam_name) return addLog("Exam name required!");
        try {
          const { error } = await supabase.from("upcoming_exams").insert([newUpcoming]);
          if (error) throw error;
          addLog("Upcoming exam added!");
          setNewUpcoming({ exam_name: "", exam_id: "", exam_date: "", status: "upcoming" });
          fetchUpcoming();
          fetchStats();
        } catch (e) { addLog("Error: " + e.message); }
      };

      const addUpdate = async () => {
        if (!newUpdate.title) return addLog("Title required!");
        try {
          const { error } = await supabase.from("updates").insert([newUpdate]);
          if (error) throw error;
          addLog("Update added!");
          setNewUpdate({ exam_id: "", update_type: "general", title: "", description: "", official_link: "" });
          fetchUpdates();
          fetchStats();
        } catch (e) { addLog("Error: " + e.message); }
      };

      // Delete entries
      const deleteResult = async (id) => {
        try {
          await supabase.from("results").delete().eq("id", id);
          addLog("Result deleted");
          fetchResults();
          fetchStats();
        } catch (e) { addLog("Error: " + e.message); }
      };

      const deleteAdmit = async (id) => {
        try {
          await supabase.from("admit_cards").delete().eq("id", id);
          addLog("Admit card deleted");
          fetchAdmits();
          fetchStats();
        } catch (e) { addLog("Error: " + e.message); }
      };

      const deleteUpcoming = async (id) => {
        try {
          await supabase.from("upcoming_exams").delete().eq("id", id);
          addLog("Upcoming exam deleted");
          fetchUpcoming();
          fetchStats();
        } catch (e) { addLog("Error: " + e.message); }
      };

      const deleteUpdate = async (id) => {
        try {
          await supabase.from("updates").delete().eq("id", id);
          addLog("Update deleted");
          fetchUpdates();
          fetchStats();
        } catch (e) { addLog("Error: " + e.message); }
      };

      // Generate exams
      const generateExams = async () => {
        setGenerating(true);
        addLog("Generating " + examCount + " exams...");
        try {
          const cats = {
            "SSC Exams": ["SSC CGL", "SSC CHSL", "SSC GD Constable", "SSC MTS", "SSC CPO", "SSC Stenographer", "SSC JE", "SSC Selection Post"],
            "UPSC Civil Services": ["UPSC CSE", "UPSC CAPF", "UPSC EPFO", "UPSC CMS", "UPSC IFS"],
            "Banking and Finance": ["IBPS PO", "IBPS Clerk", "IBPS RRB", "SBI PO", "SBI Clerk", "RBI Grade B", "NABARD"],
            "Railway Exams": ["RRB NTPC", "RRB JE", "RRB ALP", "RRB Group D", "RRB Paramedical"],
            "Engineering Entrance": ["JEE Main", "JEE Advanced", "BITSAT", "COMEDK", "MET", "VITEEE", "SRMJEEE"],
            "Medical Entrance": ["NEET UG", "NEET PG", "AIIMS", "FMGE", "INI CET"],
            "Law Entrance": ["CLAT", "AILET", "SLAT", "MH CET Law", "LSAT India"],
            "Defence Exams": ["NDA", "CDS", "AFCAT", "INET", "ACC", "MNS"],
            "Teaching Exams": ["CTET", "UPTET", "REET", "DSSSB", "KVS", "NVS", "HTET"],
            "State PSC": ["UPPSC", "BPSC", "MPPSC", "RPSC", "UKPSC", "CGPSC", "HPPSC", "JPSC"],
            "Police Exams": ["UP Police", "Bihar Police", "MP Police", "Delhi Police", "CRPF", "BSF", "CISF"],
            "Management Entrance": ["CAT", "XAT", "IIFT", "SNAP", "NMAT", "MAT", "CMAT", "ATMA"],
            "Insurance Exams": ["LIC ADO", "LIC AAO", "NIACL", "OICL", "UIIC"],
            "Other Govt Exams": ["UGC NET", "CSIR NET", "ICAR", "GATE", "GPAT", "FSSAI"]
          };

          const batchSize = 500;
          let inserted = 0;

          for (let b = 0; b < Math.ceil(examCount / batchSize); b++) {
            const batch = [];
            for (let i = 0; i < batchSize && inserted < examCount; i++) {
              const catNames = Object.keys(cats);
              const cat = catNames[Math.floor(Math.random() * catNames.length)];
              const examNames = cats[cat];
              const base = examNames[Math.floor(Math.random() * examNames.length)];
              const year = [2024, 2025, 2026][Math.floor(Math.random() * 3)];
              const post = ["Tier 1", "Tier 2", "Pre", "Mains", "Phase 1", "Phase 2", "Prelims", "Final"][Math.floor(Math.random() * 8)];
              const states = ["Uttar Pradesh", "Bihar", "Madhya Pradesh", "Rajasthan", "Maharashtra", "Delhi", "West Bengal", "Tamil Nadu", "Karnataka", "Gujarat", "Punjab", "Haryana", "Odisha", "Telangana", "Andhra Pradesh"];

              const name = `${base} ${post} ${year}`;
              const statesOrNull = Math.random() > 0.6 ? states[Math.floor(Math.random() * states.length)] : null;
              const fullName = `${name} Examination${Math.random() > 0.5 ? " - National Level" : ""}`;
              const syllabus = ["General Studies", "Quantitative Aptitude", "English Language", "Logical Reasoning", "General Awareness", "Subject Knowledge", "Technical Skills"].slice(0, 3 + Math.floor(Math.random() * 4)).join(", ");

              batch.push({
                name,
                full_name: fullName,
                category: cat,
                state: statesOrNull,
                description: "This is a national-level competitive examination conducted for recruitment and admission purposes. " + syllabus + " are key topics.",
                is_active: true,
              });

              if (batch.length >= batchSize || inserted + batch.length >= examCount) {
                const { error } = await supabase.from("exams").insert(batch);
                if (error) {
                  addLog("Batch error: " + error.message);
                } else {
                  inserted += batch.length;
                  addLog("Inserted " + inserted + " exams...");
                  await new Promise(r => setTimeout(r, 200));
                }
                batch.length = 0;
              }
            }
          }
          addLog("Done! Generated " + inserted + " exams!");
          fetchStats();
        } catch (e) {
          addLog("Error: " + e.message);
        }
        setGenerating(false);
      };

      if (!authenticated) {
        return (
          <div style={{ fontFamily: "Arial,sans-serif", maxWidth: 400, margin: "100px auto", padding: 20, textAlign: "center" }}>
            <h1 style={{ color: "#2563eb", fontSize: 24 }}>🔐 Admin Login</h1>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              style={{ width: "100%", padding: 12, fontSize: 16, border: "1px solid #ccc", borderRadius: 8, margin: "12px 0" }}
              placeholder="Enter admin password" />
            <button onClick={handleLogin}
              style={{ width: "100%", padding: 12, background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, fontSize: 16, cursor: "pointer" }}>
              Sign In
            </button>
            {error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}
          </div>
        );
      }

      const tabs = ["dashboard", "results", "admit-cards", "upcoming", "updates", "generator"];
      const tabLabels = { dashboard: "📊 Dashboard", results: "📋 Results", "admit-cards": "🎫 Admit Cards", upcoming: "📅 Upcoming", updates: "🔄 Updates", generator: "⚙️ Generator" };

      return (
        <div style={{ fontFamily: "Arial,sans-serif", maxWidth: 900, margin: "0 auto", padding: 12 }}>
          <h1 style={{ fontSize: 20, color: "#2563eb", margin: "4px 0" }}>⚙️ SarkariSetu Admin</h1>
          <p style={{ fontSize: 12, color: "#666", margin: "2px 0 12px" }}>Manage your exam portal data</p>

          {/* Tabs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {tabs.map(t => (
              <button key={t} onClick={() => { setTab(t); if (t !== "dashboard" && t !== "generator") eval(`fetch${t.charAt(0).toUpperCase() + t.slice(1).replace("-","").replace("cards","Admits").replace("upcoming","Upcoming").replace("updates","Updates")}()`); }}
                style={{ padding: "8px 14px", borderRadius: 8, border: "none", fontSize: 13, cursor: "pointer",
                  background: tab === t ? "#2563eb" : "#e5e7eb", color: tab === t ? "#fff" : "#333", fontWeight: tab === t ? 600 : 400 }}>
                {tabLabels[t]}
              </button>
            ))}
          </div>

          {/* Dashboard */}
          {tab === "dashboard" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10, marginBottom: 16 }}>
                {[
                  { label: "Total Exams", count: stats.exams, color: "#2563eb", icon: "📝" },
                  { label: "Results", count: stats.results, color: "#16a34a", icon: "🏆" },
                  { label: "Admit Cards", count: stats.admitCards, color: "#d97706", icon: "🎫" },
                  { label: "Upcoming Exams", count: stats.upcomingExams, color: "#7c3aed", icon: "📅" },
                  { label: "Updates", count: stats.updates, color: "#dc2626", icon: "🔄" },
                ].map(s => (
                  <div key={s.label} style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", textAlign: "center", borderTop: `4px solid ${s.color}` }}>
                    <div style={{ fontSize: 28 }}>{s.icon}</div>
                    <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.count.toLocaleString()}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <button onClick={fetchStats} style={{ padding: "8px 16px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>🔄 Refresh Stats</button>
            </div>
          )}

          {/* Results Management */}
          {tab === "results" && (
            <div>
              <div style={{ background: "#f9fafb", padding: 12, borderRadius: 8, marginBottom: 12 }}>
                <h3 style={{ margin: "0 0 8px", fontSize: 14 }}>➕ Add New Result</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <input placeholder="Exam Name" value={newResult.exam_name} onChange={e => setNewResult({...newResult, exam_name: e.target.value})} style={inputStyle} />
                  <input placeholder="Exam ID (optional)" value={newResult.exam_id} onChange={e => setNewResult({...newResult, exam_id: e.target.value})} style={inputStyle} />
                  <button onClick={addResult} style={btnStyle}>Add Result</button>
                </div>
              </div>
              <button onClick={fetchResults} style={{ padding: "6px 12px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12, marginBottom: 8 }}>🔄 Refresh</button>
              {resultsList.map(r => (
                <div key={r.id} style={{ padding: "8px 10px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                  <div>
                    <strong>{r.exam_name}</strong>
                    <div style={{ fontSize: 11, color: "#666" }}>ID: {r.id}</div>
                  </div>
                  <button onClick={() => deleteResult(r.id)} style={{ padding: "4px 10px", background: "#dc2626", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>🗑️</button>
                </div>
              ))}
              {resultsList.length === 0 && !loading && <p style={{ fontSize: 13, color: "#999" }}>No results found</p>}
            </div>
          )}

          {/* Admit Cards Management */}
          {tab === "admit-cards" && (
            <div>
              <div style={{ background: "#f9fafb", padding: 12, borderRadius: 8, marginBottom: 12 }}>
                <h3 style={{ margin: "0 0 8px", fontSize: 14 }}>➕ Add New Admit Card</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <input placeholder="Exam Name" value={newAdmit.exam_name} onChange={e => setNewAdmit({...newAdmit, exam_name: e.target.value})} style={inputStyle} />
                  <input placeholder="Exam ID (optional)" value={newAdmit.exam_id} onChange={e => setNewAdmit({...newAdmit, exam_id: e.target.value})} style={inputStyle} />
                  <button onClick={addAdmit} style={btnStyle}>Add Admit Card</button>
                </div>
              </div>
              <button onClick={fetchAdmits} style={{ padding: "6px 12px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12, marginBottom: 8 }}>🔄 Refresh</button>
              {admitList.map(r => (
                <div key={r.id} style={{ padding: "8px 10px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                  <div>
                    <strong>{r.exam_name}</strong>
                    <div style={{ fontSize: 11, color: "#666" }}>ID: {r.id}</div>
                  </div>
                  <button onClick={() => deleteAdmit(r.id)} style={{ padding: "4px 10px", background: "#dc2626", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>🗑️</button>
                </div>
              ))}
              {admitList.length === 0 && !loading && <p style={{ fontSize: 13, color: "#999" }}>No admit cards found</p>}
            </div>
          )}

          {/* Upcoming Exams Management */}
          {tab === "upcoming" && (
            <div>
              <div style={{ background: "#f9fafb", padding: 12, borderRadius: 8, marginBottom: 12 }}>
                <h3 style={{ margin: "0 0 8px", fontSize: 14 }}>➕ Add New Upcoming Exam</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <input placeholder="Exam Name" value={newUpcoming.exam_name} onChange={e => setNewUpcoming({...newUpcoming, exam_name: e.target.value})} style={inputStyle} />
                  <input placeholder="Exam ID (optional)" value={newUpcoming.exam_id} onChange={e => setNewUpcoming({...newUpcoming, exam_id: e.target.value})} style={inputStyle} />
                  <input placeholder="Exam Date (e.g. 2026-08-15)" value={newUpcoming.exam_date} onChange={e => setNewUpcoming({...newUpcoming, exam_date: e.target.value})} style={inputStyle} />
                  <button onClick={addUpcoming} style={btnStyle}>Add Upcoming Exam</button>
                </div>
              </div>
              <button onClick={fetchUpcoming} style={{ padding: "6px 12px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12, marginBottom: 8 }}>🔄 Refresh</button>
              {upcomingList.map(r => (
                <div key={r.id} style={{ padding: "8px 10px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                  <div>
                    <strong>{r.exam_name}</strong>
                    <div style={{ fontSize: 11, color: "#666" }}>📅 {r.exam_date || "TBA"}</div>
                  </div>
                  <button onClick={() => deleteUpcoming(r.id)} style={{ padding: "4px 10px", background: "#dc2626", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>🗑️</button>
                </div>
              ))}
              {upcomingList.length === 0 && !loading && <p style={{ fontSize: 13, color: "#999" }}>No upcoming exams found</p>}
            </div>
          )}

          {/* Updates Management */}
          {tab === "updates" && (
            <div>
              <div style={{ background: "#f9fafb", padding: 12, borderRadius: 8, marginBottom: 12 }}>
                <h3 style={{ margin: "0 0 8px", fontSize: 14 }}>➕ Add New Update</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <input placeholder="Title" value={newUpdate.title} onChange={e => setNewUpdate({...newUpdate, title: e.target.value})} style={inputStyle} />
                  <input placeholder="Description" value={newUpdate.description} onChange={e => setNewUpdate({...newUpdate, description: e.target.value})} style={inputStyle} />
                  <input placeholder="Exam ID (optional)" value={newUpdate.exam_id} onChange={e => setNewUpdate({...newUpdate, exam_id: e.target.value})} style={inputStyle} />
                  <input placeholder="Official Link (optional)" value={newUpdate.official_link} onChange={e => setNewUpdate({...newUpdate, official_link: e.target.value})} style={inputStyle} />
                  <select value={newUpdate.update_type} onChange={e => setNewUpdate({...newUpdate, update_type: e.target.value})} style={inputStyle}>
                    <option value="general">General</option>
                    <option value="result">Result</option>
                    <option value="admit_card">Admit Card</option>
                    <option value="syllabus">Syllabus</option>
                    <option value="answer_key">Answer Key</option>
                  </select>
                  <button onClick={addUpdate} style={btnStyle}>Add Update</button>
                </div>
              </div>
              <button onClick={fetchUpdates} style={{ padding: "6px 12px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12, marginBottom: 8 }}>🔄 Refresh</button>
              {updatesList.map(r => (
                <div key={r.id} style={{ padding: "8px 10px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                  <div>
                    <strong>{r.title}</strong>
                    <div style={{ fontSize: 11, color: "#666" }}>{r.description?.slice(0, 60)}</div>
                  </div>
                  <button onClick={() => deleteUpdate(r.id)} style={{ padding: "4px 10px", background: "#dc2626", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>🗑️</button>
                </div>
              ))}
              {updatesList.length === 0 && !loading && <p style={{ fontSize: 13, color: "#999" }}>No updates found</p>}
            </div>
          )}

          {/* Generator */}
          {tab === "generator" && (
            <div>
              <div style={{ background: "#f9fafb", padding: 12, borderRadius: 8, marginBottom: 12 }}>
                <h3 style={{ margin: "0 0 8px", fontSize: 14 }}>⚙️ Generate Sample Exams</h3>
                <p style={{ fontSize: 12, color: "#666", margin: "0 0 8px" }}>Generate random exam entries for testing</p>
                <input type="number" value={examCount} onChange={e => setExamCount(parseInt(e.target.value) || 100)}
                  style={{ ...inputStyle, width: 120, display: "inline-block" }} />
                <button onClick={generateExams} disabled={generating}
                  style={{ ...btnStyle, display: "inline-block", marginLeft: 8, opacity: generating ? 0.6 : 1 }}>
                  {generating ? "⏳ Generating..." : "🚀 Generate"}
                </button>
              </div>
              <div style={{ background: "#1a1a2e", color: "#00ff88", padding: 12, borderRadius: 8, fontSize: 12, maxHeight: 300, overflowY: "auto", fontFamily: "monospace" }}>
                {log.map((m, i) => <div key={i}>{m}</div>)}
                {log.length === 0 && <div style={{ color: "#666" }}>No logs yet...</div>}
              </div>
            </div>
          )}
        </div>
      );
    }

    const inputStyle = {
      padding: "8px 10px",
      fontSize: 13,
      border: "1px solid #ccc",
      borderRadius: 6,
      width: "100%",
      boxSizing: "border-box"
    };

    const btnStyle = {
      padding: "8px 16px",
      background: "#2563eb",
      color: "#fff",
      border: "none",
      borderRadius: 6,
      cursor: "pointer",
      fontSize: 13,
      fontWeight: 600
    };
    