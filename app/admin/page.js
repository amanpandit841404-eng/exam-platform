"use client";
    import { useState, useEffect } from "react";
    import { supabase } from "../lib/supabase";

    const ADMIN_PASSWORD = "sarkari123";

    const COLORS = {
      primary: "#1e40af", blue: "#2563eb", green: "#16a34a", orange: "#ea580c",
      purple: "#7c3aed", red: "#dc2626", teal: "#0d9488", pink: "#db2777"
    };

    const TAB_STYLES = {
      dashboard: { icon: "📊", color: "#1e40af", label: "Dashboard" },
      results: { icon: "🏆", color: "#16a34a", label: "Results" },
      admits: { icon: "🎫", color: "#ea580c", label: "Admit Cards" },
      upcoming: { icon: "📅", color: "#7c3aed", label: "Upcoming" },
      updates: { icon: "🔄", color: "#dc2626", label: "Updates" },
      generator: { icon: "⚡", color: "#0d9488", label: "Generator" }
    };

    const styles = {
      page: { minHeight: "100vh", background: "#f0f4f8", fontFamily: "'Segoe UI',Arial,sans-serif" },
      header: { background: "linear-gradient(135deg, #1e3a5f, #2563eb)", padding: "16px 20px", color: "#fff" },
      headerTitle: { fontSize: 22, fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 8 },
      headerSub: { fontSize: 12, opacity: 0.8, marginTop: 2 },
      container: { maxWidth: 960, margin: "0 auto", padding: "12px 12px 80px" },
      tabBar: { display: "flex", gap: 6, flexWrap: "wrap", margin: "-8px 0 16px" },
      tabBtn: (active, color) => ({
        padding: "10px 16px", borderRadius: 10, border: "none", fontSize: 13, fontWeight: active ? 600 : 400,
        cursor: "pointer", background: active ? color : "#fff", color: active ? "#fff" : "#444",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 5,
        flex: window?.innerWidth < 500 ? "1 1 auto" : "none",
        transition: "all 0.2s", WebkitTapHighlightColor: "transparent"
      }),
      card: { background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: 12 },
      statCard: (color) => ({
        background: "#fff", borderRadius: 14, padding: 18, boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        textAlign: "center", borderTop: `4px solid ${color}`
      }),
      input: { padding: "10px 12px", fontSize: 14, border: "1px solid #d1d5db", borderRadius: 8, width: "100%",
        boxSizing: "border-box", outline: "none", transition: "border 0.2s", background: "#fff" },
      btn: (color, small) => ({
        padding: small ? "6px 12px" : "10px 18px", background: color, color: "#fff", border: "none",
        borderRadius: 8, cursor: "pointer", fontSize: small ? 12 : 14, fontWeight: 600,
        transition: "all 0.2s", opacity: 1, display: "inline-flex", alignItems: "center", gap: 4
      }),
      listItem: { padding: "10px 12px", borderBottom: "1px solid #f0f0f0", display: "flex",
        justifyContent: "space-between", alignItems: "center", gap: 8 },
      badge: (bg) => ({ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: bg, color: "#fff", fontWeight: 600 }),
      toast: (type) => ({
        position: "fixed", bottom: 20, right: 20, padding: "12px 20px", borderRadius: 10, zIndex: 9999,
        background: type === "success" ? "#16a34a" : "#dc2626", color: "#fff", fontSize: 13, fontWeight: 500,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)", animation: "slideUp 0.3s ease"
      })
    };

    export default function AdminPage() {
      const [auth, setAuth] = useState(false);
      const [pw, setPw] = useState("");
      const [err, setErr] = useState("");
      const [tab, setTab] = useState("dashboard");
      const [stats, setStats] = useState({ exams: 0, results: 0, admits: 0, upcoming: 0, updates: 0 });
      const [toast, setToast] = useState(null);

      const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

      // Lists
      const [results, setResults] = useState([]);
      const [admits, setAdmits] = useState([]);
      const [upcomings, setUpcomings] = useState([]);
      const [updates, setUpdates] = useState([]);
      const [logs, setLogs] = useState([]);
      const [loading, setLoading] = useState(false);
      const [genCount, setGenCount] = useState(1000);
      const [genning, setGenning] = useState(false);

      const addLog = (m) => setLogs(p => [m, ...p].slice(0, 30));

      // Auth
      const handleLogin = () => {
        if (pw === ADMIN_PASSWORD) { setAuth(true); fetchStats(); }
        else setErr("❌ Wrong password!");
      };

      // Fetch stats
      const fetchStats = async () => {
        try {
          const [ex, re, ad, up, ud] = await Promise.all([
            supabase.from("exams").select("id", { count: "exact", head: true }),
            supabase.from("results").select("id", { count: "exact", head: true }),
            supabase.from("admit_cards").select("id", { count: "exact", head: true }),
            supabase.from("upcoming_exams").select("id", { count: "exact", head: true }),
            supabase.from("updates").select("id", { count: "exact", head: true }),
          ]);
          setStats({ exams: ex.count||0, results: re.count||0, admits: ad.count||0, upcoming: up.count||0, updates: ud.count||0 });
        } catch(e) { showToast("Error fetching stats", "error"); }
      };

      // CRUD helpers
      const fetchTable = async (table, setter) => {
        setLoading(true);
        try {
          const { data } = await supabase.from(table).select("*").order("created_at", { ascending: false }).limit(50);
          setter(data || []);
        } catch(e) { showToast("Error fetching data", "error"); }
        setLoading(false);
      };

      const addRow = async (table, data, reset, refetch) => {
        try {
          const { error } = await supabase.from(table).insert([data]);
          if (error) throw error;
          showToast("✅ Added successfully!");
          reset();
          refetch();
        } catch(e) { showToast(e.message, "error"); }
      };

      const deleteRow = async (table, id, refetch, statsUpdate) => {
        try {
          await supabase.from(table).delete().eq("id", id);
          showToast("🗑️ Deleted!");
          refetch();
          if (statsUpdate) fetchStats();
        } catch(e) { showToast(e.message, "error"); }
      };

      // Form states
      const [fResult, setFResult] = useState({ exam_name: "", exam_id: "", result_title: "Result Declared", status: "declared" });
      const [fAdmit, setFAdmit] = useState({ exam_name: "", exam_id: "", title: "Admit Card Released", status: "released" });
      const [fUpcoming, setFUpcoming] = useState({ exam_name: "", exam_id: "", exam_date: "", status: "upcoming" });
      const [fUpdate, setFUpdate] = useState({ exam_id: "", update_type: "general", title: "", description: "", official_link: "" });
      const [showForm, setShowForm] = useState(null);

      const resetResult = () => setFResult({ exam_name: "", exam_id: "", result_title: "Result Declared", status: "declared" });
      const resetAdmit = () => setFAdmit({ exam_name: "", exam_id: "", title: "Admit Card Released", status: "released" });
      const resetUpcoming = () => setFUpcoming({ exam_name: "", exam_id: "", exam_date: "", status: "upcoming" });
      const resetUpdate = () => setFUpdate({ exam_id: "", update_type: "general", title: "", description: "", official_link: "" });

      // Generator
      const generateExams = async () => {
        setGenning(true);
        addLog("🚀 Generating " + genCount + " exams...");
        try {
          const cats = {
            "SSC Exams": ["SSC CGL","SSC CHSL","SSC GD Constable","SSC MTS","SSC CPO","SSC Stenographer","SSC JE","SSC Selection Post"],
            "UPSC Civil Services": ["UPSC CSE","UPSC CAPF","UPSC EPFO","UPSC CMS","UPSC IFS"],
            "Banking": ["IBPS PO","IBPS Clerk","IBPS RRB","SBI PO","SBI Clerk","RBI Grade B","NABARD"],
            "Railway": ["RRB NTPC","RRB JE","RRB ALP","RRB Group D","RRB Paramedical"],
            "Engineering": ["JEE Main","JEE Advanced","BITSAT","COMEDK","MET","VITEEE","SRMJEEE"],
            "Medical": ["NEET UG","NEET PG","AIIMS","FMGE","INI CET"],
            "Law": ["CLAT","AILET","SLAT","MH CET Law","LSAT India"],
            "Defence": ["NDA","CDS","AFCAT","INET","ACC","MNS"],
            "Teaching": ["CTET","UPTET","REET","DSSSB","KVS","NVS","HTET"],
            "State PSC": ["UPPSC","BPSC","MPPSC","RPSC","UKPSC","CGPSC","HPPSC","JPSC"],
            "Police": ["UP Police","Bihar Police","MP Police","Delhi Police","CRPF","BSF","CISF"],
            "Management": ["CAT","XAT","IIFT","SNAP","NMAT","MAT","CMAT","ATMA"],
            "Insurance": ["LIC ADO","LIC AAO","NIACL","OICL","UIIC"],
            "Other": ["UGC NET","CSIR NET","ICAR","GATE","GPAT","FSSAI"]
          };
          const states = ["Uttar Pradesh","Bihar","Madhya Pradesh","Rajasthan","Maharashtra","Delhi","West Bengal","Tamil Nadu","Karnataka","Gujarat","Punjab","Haryana","Odisha","Telangana","Andhra Pradesh"];
          const posts = ["Tier 1","Tier 2","Pre","Mains","Phase 1","Phase 2","Prelims","Final"];
          const years = [2024,2025,2026];
          let inserted = 0;

          for (let b = 0; b < Math.ceil(genCount / 200); b++) {
            const batch = [];
            for (let i = 0; i < 200 && inserted < genCount; i++) {
              const catNames = Object.keys(cats);
              const cat = catNames[Math.floor(Math.random()*catNames.length)];
              const base = cats[cat][Math.floor(Math.random()*cats[cat].length)];
              const name = `${base} ${posts[Math.floor(Math.random()*posts.length)]} ${years[Math.floor(Math.random()*years.length)]}`;
              batch.push({
                name, category: cat,
                state: Math.random() > 0.6 ? states[Math.floor(Math.random()*states.length)] : null,
                full_name: name + " Examination",
                description: "National-level competitive examination. Key topics include General Studies, Quantitative Aptitude, English, Reasoning.",
                is_active: true
              });
            }
            const { error } = await supabase.from("exams").insert(batch);
            if (error) addLog("❌ " + error.message);
            else { inserted += batch.length; addLog("✅ " + inserted + " exams inserted..."); }
            await new Promise(r => setTimeout(r, 300));
          }
          addLog("🎉 Done! " + inserted + " exams generated!");
          fetchStats();
          showToast("✅ " + inserted + " exams generated!");
        } catch(e) { addLog("❌ " + e.message); }
        setGenning(false);
      };

      // Login screen
      if (!auth) {
        return (
          <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0f172a,#1e3a5f)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"'Segoe UI',Arial,sans-serif"}}>
            <div style={{background:"#fff",borderRadius:20,padding:"32px 24px",width:"100%",maxWidth:380,boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
              <div style={{textAlign:"center",marginBottom:20}}>
                <div style={{fontSize:40,marginBottom:8}}>🔐</div>
                <h1 style={{fontSize:22,color:"#1e3a5f",margin:0}}>SarkariSetu Admin</h1>
                <p style={{fontSize:12,color:"#888",margin:"4px 0 0"}}>Enter password to continue</p>
              </div>
              <input type="password" value={pw} onChange={e=>setPw(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&handleLogin()}
                placeholder="Enter admin password"
                style={{width:"100%",padding:"12px 14px",fontSize:15,border:"2px solid #e5e7eb",borderRadius:10,marginBottom:12,outline:"none",boxSizing:"border-box",transition:"border 0.2s"}}
                onFocus={e=>e.target.style.borderColor="#2563eb"} onBlur={e=>e.target.style.borderColor="#e5e7eb"} />
              <button onClick={handleLogin}
                style={{width:"100%",padding:"12px",background:"linear-gradient(135deg,#2563eb,#1e40af)",color:"#fff",border:"none",borderRadius:10,fontSize:16,fontWeight:600,cursor:"pointer",boxShadow:"0 4px 12px rgba(37,99,235,0.3)"}}>
                Sign In 🔓
              </button>
              {err && <p style={{color:"#dc2626",textAlign:"center",marginTop:12,fontSize:13}}>{err}</p>}
            </div>
          </div>
        );
      }

      const StatCard = ({ icon, label, count, color }) => (
        <div style={styles.statCard(color)}>
          <div style={{fontSize:32,marginBottom:4}}>{icon}</div>
          <div style={{fontSize:28,fontWeight:700,color}}>{count.toLocaleString()}</div>
          <div style={{fontSize:12,color:"#666",fontWeight:500}}>{label}</div>
        </div>
      );

      const AddForm = ({ title, fields, onAdd, onCancel }) => (
        <div style={{...styles.card, background:"#f8fafc", border:"1px solid #e2e8f0", marginBottom:12}}>
          <h3 style={{margin:"0 0 10px",fontSize:15,color:"#1e3a5f"}}>✏️ {title}</h3>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {fields.map((f, i) => (
              f.type === "select" ? (
                <select key={i} value={f.value} onChange={e=>f.onChange(e.target.value)} style={styles.input}>
                  {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ) : (
                <input key={i} placeholder={f.placeholder} value={f.value}
                  onChange={e=>f.onChange(e.target.value)} style={styles.input} type={f.type||"text"} />
              )
            ))}
            <div style={{display:"flex",gap:6}}>
              <button onClick={onAdd} style={styles.btn("#2563eb")}>✅ Add</button>
              <button onClick={onCancel} style={{...styles.btn("#9ca3af")}}>Cancel</button>
            </div>
          </div>
        </div>
      );

      const tabKeys = Object.keys(TAB_STYLES);

      return (
        <div style={styles.page}>
          {toast && <div style={styles.toast(toast.type)}>{toast.msg}</div>}

          {/* Header */}
          <div style={styles.header}>
            <div style={{maxWidth:960,margin:"0 auto"}}>
              <div style={styles.headerTitle}>
                ⚙️ SarkariSetu Admin
              </div>
              <div style={styles.headerSub}>Manage your exam portal — Add, Edit, Delete data</div>
            </div>
          </div>

          <div style={styles.container}>
            {/* Tab Bar */}
            <div style={styles.tabBar}>
              {tabKeys.map(k => (
                <button key={k} onClick={() => { setTab(k); setShowForm(null);
                  if (k==="results") fetchTable("results",setResults);
                  if (k==="admits") fetchTable("admit_cards",setAdmits);
                  if (k==="upcoming") fetchTable("upcoming_exams",setUpcomings);
                  if (k==="updates") fetchTable("updates",setUpdates);
                  if (k==="dashboard") fetchStats();
                }}
                  style={styles.tabBtn(tab===k, TAB_STYLES[k].color)}>
                  <span>{TAB_STYLES[k].icon}</span>
                  <span>{TAB_STYLES[k].label}</span>
                </button>
              ))}
            </div>

            {/* Dashboard */}
            {tab === "dashboard" && (
              <div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10,marginBottom:16}}>
                  <StatCard icon="📝" label="Total Exams" count={stats.exams} color={COLORS.blue} />
                  <StatCard icon="🏆" label="Results" count={stats.results} color={COLORS.green} />
                  <StatCard icon="🎫" label="Admit Cards" count={stats.admits} color={COLORS.orange} />
                  <StatCard icon="📅" label="Upcoming" count={stats.upcoming} color={COLORS.purple} />
                  <StatCard icon="🔄" label="Updates" count={stats.updates} color={COLORS.red} />
                </div>
                <div style={{...styles.card, display:"flex", gap:10, flexWrap:"wrap", alignItems:"center", justifyContent:"center"}}>
                  <button onClick={fetchStats} style={styles.btn("#2563eb")}>🔄 Refresh Stats</button>
                  <button onClick={()=>window.open("/","_blank")} style={styles.btn("#16a34a")}>🏠 View Site</button>
                  <span style={{fontSize:12,color:"#888"}}>Auto-update: every 12h ⏰</span>
                </div>
              </div>
            )}

            {/* Results */}
            {tab === "results" && (
              <div>
                <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>
                  <button onClick={()=>setShowForm(showForm==="result"?null:"result")} style={styles.btn(showForm==="result"?"#6b7280":"#16a34a")}>
                    {showForm==="result"?"✕ Close":"➕ Add Result"}
                  </button>
                  <button onClick={()=>fetchTable("results",setResults)} style={styles.btn("#2563eb",true)}>🔄</button>
                </div>
                {showForm==="result" && (
                  <AddForm title="Add New Result"
                    fields={[
                      {placeholder:"Exam Name *", value:fResult.exam_name, onChange:v=>setFResult(p=>({...p,exam_name:v}))},
                      {placeholder:"Exam ID (optional)", value:fResult.exam_id, onChange:v=>setFResult(p=>({...p,exam_id:v}))},
                    ]}
                    onAdd={()=>addRow("results",fResult,resetResult,()=>fetchTable("results",setResults))}
                    onCancel={()=>setShowForm(null)} />
                )}
                {results.length === 0 && !loading && <div style={{...styles.card,textAlign:"center",padding:40,color:"#999"}}>No results yet. Click "Add Result" to add one!</div>}
                {results.map(r => (
                  <div key={r.id} style={styles.listItem}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:600,fontSize:14}}>{r.exam_name}</div>
                      <div style={{fontSize:11,color:"#999"}}>ID: {r.id}</div>
                    </div>
                    <button onClick={()=>deleteRow("results",r.id,()=>fetchTable("results",setResults),true)}
                      style={{...styles.btn("#dc2626",true),padding:"4px 10px"}}>🗑️</button>
                  </div>
                ))}
              </div>
            )}

            {/* Admit Cards */}
            {tab === "admits" && (
              <div>
                <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>
                  <button onClick={()=>setShowForm(showForm==="admit"?null:"admit")} style={styles.btn(showForm==="admit"?"#6b7280":"#ea580c")}>
                    {showForm==="admit"?"✕ Close":"➕ Add Admit Card"}
                  </button>
                  <button onClick={()=>fetchTable("admit_cards",setAdmits)} style={styles.btn("#2563eb",true)}>🔄</button>
                </div>
                {showForm==="admit" && (
                  <AddForm title="Add New Admit Card"
                    fields={[
                      {placeholder:"Exam Name *", value:fAdmit.exam_name, onChange:v=>setFAdmit(p=>({...p,exam_name:v}))},
                      {placeholder:"Exam ID (optional)", value:fAdmit.exam_id, onChange:v=>setFAdmit(p=>({...p,exam_id:v}))},
                    ]}
                    onAdd={()=>addRow("admit_cards",fAdmit,resetAdmit,()=>fetchTable("admit_cards",setAdmits))}
                    onCancel={()=>setShowForm(null)} />
                )}
                {admits.map(r => (
                  <div key={r.id} style={styles.listItem}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:600,fontSize:14}}>{r.exam_name}</div>
                      <div style={{fontSize:11,color:"#999"}}>ID: {r.id}</div>
                    </div>
                    <button onClick={()=>deleteRow("admit_cards",r.id,()=>fetchTable("admit_cards",setAdmits),true)}
                      style={{...styles.btn("#dc2626",true),padding:"4px 10px"}}>🗑️</button>
                  </div>
                ))}
              </div>
            )}

            {/* Upcoming */}
            {tab === "upcoming" && (
              <div>
                <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>
                  <button onClick={()=>setShowForm(showForm==="upcoming"?null:"upcoming")} style={styles.btn(showForm==="upcoming"?"#6b7280":"#7c3aed")}>
                    {showForm==="upcoming"?"✕ Close":"➕ Add Upcoming"}
                  </button>
                  <button onClick={()=>fetchTable("upcoming_exams",setUpcomings)} style={styles.btn("#2563eb",true)}>🔄</button>
                </div>
                {showForm==="upcoming" && (
                  <AddForm title="Add Upcoming Exam"
                    fields={[
                      {placeholder:"Exam Name *", value:fUpcoming.exam_name, onChange:v=>setFUpcoming(p=>({...p,exam_name:v}))},
                      {placeholder:"Exam ID (optional)", value:fUpcoming.exam_id, onChange:v=>setFUpcoming(p=>({...p,exam_id:v}))},
                      {placeholder:"Exam Date (e.g. 2026-08-15)", value:fUpcoming.exam_date, onChange:v=>setFUpcoming(p=>({...p,exam_date:v}))},
                    ]}
                    onAdd={()=>addRow("upcoming_exams",fUpcoming,resetUpcoming,()=>fetchTable("upcoming_exams",setUpcomings))}
                    onCancel={()=>setShowForm(null)} />
                )}
                {upcomings.map(r => (
                  <div key={r.id} style={styles.listItem}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:600,fontSize:14}}>{r.exam_name}</div>
                      <div style={{fontSize:11,color:"#7c3aed"}}>📅 {r.exam_date || "TBA"}</div>
                    </div>
                    <button onClick={()=>deleteRow("upcoming_exams",r.id,()=>fetchTable("upcoming_exams",setUpcomings),true)}
                      style={{...styles.btn("#dc2626",true),padding:"4px 10px"}}>🗑️</button>
                  </div>
                ))}
              </div>
            )}

            {/* Updates */}
            {tab === "updates" && (
              <div>
                <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>
                  <button onClick={()=>setShowForm(showForm==="update"?null:"update")} style={styles.btn(showForm==="update"?"#6b7280":"#dc2626")}>
                    {showForm==="update"?"✕ Close":"➕ Add Update"}
                  </button>
                  <button onClick={()=>fetchTable("updates",setUpdates)} style={styles.btn("#2563eb",true)}>🔄</button>
                </div>
                {showForm==="update" && (
                  <AddForm title="Add New Update"
                    fields={[
                      {placeholder:"Title *", value:fUpdate.title, onChange:v=>setFUpdate(p=>({...p,title:v}))},
                      {placeholder:"Description", value:fUpdate.description, onChange:v=>setFUpdate(p=>({...p,description:v}))},
                      {placeholder:"Exam ID (optional)", value:fUpdate.exam_id, onChange:v=>setFUpdate(p=>({...p,exam_id:v}))},
                      {placeholder:"Official Link (optional)", value:fUpdate.official_link, onChange:v=>setFUpdate(p=>({...p,official_link:v}))},
                      {type:"select", value:fUpdate.update_type, onChange:v=>setFUpdate(p=>({...p,update_type:v})),
                        options:[{value:"general",label:"📢 General"},{value:"result",label:"🏆 Result"},{value:"admit_card",label:"🎫 Admit Card"},{value:"syllabus",label:"📚 Syllabus"},{value:"answer_key",label:"🔑 Answer Key"}]}
                    ]}
                    onAdd={()=>addRow("updates",fUpdate,resetUpdate,()=>fetchTable("updates",setUpdates))}
                    onCancel={()=>setShowForm(null)} />
                )}
                {updates.map(r => (
                  <div key={r.id} style={styles.listItem}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:600,fontSize:14}}>{r.title}</div>
                      <div style={{fontSize:11,color:"#666"}}>{r.description?.slice(0,80)}</div>
                    </div>
                    <button onClick={()=>deleteRow("updates",r.id,()=>fetchTable("updates",setUpdates),true)}
                      style={{...styles.btn("#dc2626",true),padding:"4px 10px"}}>🗑️</button>
                  </div>
                ))}
              </div>
            )}

            {/* Generator */}
            {tab === "generator" && (
              <div>
                <div style={styles.card}>
                  <h3 style={{margin:"0 0 8px",fontSize:16,color:"#0d9488"}}>⚡ Generate Exams</h3>
                  <p style={{fontSize:12,color:"#888",margin:"0 0 12px"}}>Generate sample exam entries for testing/demo</p>
                  <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                    <input type="number" value={genCount} onChange={e=>setGenCount(parseInt(e.target.value)||100)}
                      style={{...styles.input,width:120}} />
                    <button onClick={generateExams} disabled={genning}
                      style={{...styles.btn("#0d9488"),opacity:genning?0.6:1}}>
                      {genning ? "⏳ Generating..." : "🚀 Generate"}
                    </button>
                  </div>
                </div>
                <div style={{background:"#0f172a",borderRadius:12,padding:14,maxHeight:350,overflowY:"auto",fontFamily:"monospace",fontSize:12,color:"#22d3ee"}}>
                  {logs.map((m,i) => <div key={i} style={{padding:"2px 0"}}>{m}</div>)}
                  {logs.length===0 && <div style={{color:"#555"}}>No logs yet. Click Generate to start.</div>}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
    