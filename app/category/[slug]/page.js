"use client";
    import { useState, useEffect } from "react";
    import { supabase } from "../../lib/supabase";
    import { useParams } from "next/navigation";

    export default function CategoryPage() {
      const params = useParams();
      const slug = params?.slug;
      const [exams, setExams] = useState([]);
      const [results, setResults] = useState([]);
      const [admits, setAdmits] = useState([]);
      const [category, setCategory] = useState(null);
      const [loading, setLoading] = useState(true);
      const [search, setSearch] = useState("");
      const [tab, setTab] = useState("exams");

      // Manage mode
      const [mgmt, setMgmt] = useState(false);
      const [mpw, setMpw] = useState("");
      const [mauth, setMaut] = useState(false);
      const [mAction, setMAction] = useState(""); // add_exam | add_result | add_admit | ""
      const [f1, setF1] = useState("");
      const [f2, setF2] = useState("");
      const [f3, setF3] = useState("");
      const [msg, setMsg] = useState("");
      const [err, setErr] = useState("");

      useEffect(() => {
        if (!slug) return;
        async function load() {
          const { data: catData } = await supabase.from("categories").select("*").eq("slug", slug).maybeSingle();
          const catName = catData?.name || slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
          if (catData) setCategory(catData);
          document.title = catName + " Exams 2026 - Results, Admit Cards | SarkariSetu India";
          const [examRes, resultRes, admitRes] = await Promise.all([
            supabase.from("exams").select("id,name,full_name,category").eq("category", catData?.name || slug).order("name"),
            supabase.from("results").select("*").order("created_at", { ascending: false }).limit(20),
            supabase.from("admit_cards").select("*").order("created_at", { ascending: false }).limit(20),
          ]);
          setExams(examRes.data || []);
          setResults(resultRes.data || []);
          setAdmits(admitRes.data || []);
          setLoading(false);
        }
        load();
      }, [slug]);

      const displayName = category?.name || (slug ? slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) : "Category");
      const filtered = exams.filter(e => !search || e.name?.toLowerCase().includes(search.toLowerCase()) || e.full_name?.toLowerCase().includes(search.toLowerCase()));
      const catName = category?.name || slug?.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) || "";
      const catSlug = category?.slug || slug || "";

      const enableMgmt = () => {
        if (mpw === "sarkari123") { setMaut(true); setMgmt(true); setMpw(""); }
        else setErr("Wrong password!");
      };

      const addExam = async () => {
        if (!f1) { setErr("Exam name bharo!"); return; }
        try {
          const { error: e } = await supabase.from("exams").insert({ name:f1, official_website:f2||null, description:f3||null, category:catName, type:"exam" });
          if(e) throw e;
          setMsg("Added exam: "+f1); setF1(""); setF2(""); setF3("");
          setExams([...exams, { id:Date.now(), name:f1, category:catName }]);
        } catch(e) { setErr("Error: "+e.message); }
      };

      const addResult = async () => {
        if (!f1) { setErr("Title bharo!"); return; }
        try {
          const { error: e } = await supabase.from("results").insert({ title:f1, result_url:f2, exam_name:f3||f1, category:catName });
          if(e) throw e;
          setMsg("Added result: "+f1); setF1(""); setF2(""); setF3("");
        } catch(e) { setErr("Error: "+e.message); }
      };

      const addAdmit = async () => {
        if (!f1) { setErr("Title bharo!"); return; }
        try {
          const { error: e } = await supabase.from("admit_cards").insert({ title:f1, download_url:f2, exam_name:f3||f1, category:catName });
          if(e) throw e;
          setMsg("Added admit card: "+f1); setF1(""); setF2(""); setF3("");
        } catch(e) { setErr("Error: "+e.message); }
      };

      const delExam = async (id, name) => {
        if(!confirm('Delete "'+name+'"?')) return;
        try {
          await supabase.from("exams").delete().eq("id", id);
          setExams(exams.filter(e=>e.id!==id));
          setMsg("Deleted: "+name);
        } catch(e) { setErr("Error: "+e.message); }
      };

      const delResult = async (id, name) => {
        if(!confirm('Delete "'+name+'"?')) return;
        try {
          await supabase.from("results").delete().eq("id", id);
          setResults(results.filter(r=>r.id!==id));
          setMsg("Deleted: "+name);
        } catch(e) { setErr("Error: "+e.message); }
      };

      const delAdmit = async (id, name) => {
        if(!confirm('Delete "'+name+'"?')) return;
        try {
          await supabase.from("admit_cards").delete().eq("id", id);
          setAdmits(admits.filter(a=>a.id!==id));
          setMsg("Deleted: "+name);
        } catch(e) { setErr("Error: "+e.message); }
      };

      const inputStyle = { width:"100%", padding:"10px 12px", fontSize:14, border:"1px solid #ddd", borderRadius:8, marginBottom:8, boxSizing:"border-box" };

      const renderForm = (title, fields, onSubmit) => (
        <div style={{background:"#fff", borderRadius:10, padding:14, border:"1px solid #e5e7eb", marginBottom:12}}>
          <p style={{fontSize:14, fontWeight:700, color:"#1e3a5f", marginBottom:10}}>➕ Add {title}</p>
          {fields.map((f,i)=>(
            <div key={i}>
              <label style={{fontSize:11, fontWeight:600, color:"#374151", display:"block", marginBottom:3}}>{f.label}</label>
              <input type={f.type||"text"} placeholder={f.ph} value={[f1,f2,f3][i]} onChange={e=>{
                if(i===0) setF1(e.target.value); if(i===1) setF2(e.target.value); if(i===2) setF3(e.target.value);
              }} style={inputStyle} />
            </div>
          ))}
          <button onClick={onSubmit} style={{width:"100%", padding:"10px", fontSize:13, fontWeight:700, background:"#2563eb", color:"#fff", border:"none", borderRadius:8, cursor:"pointer"}}>
            Add to {title}
          </button>
        </div>
      );

      return (
        <div style={{minHeight:"100vh", background:"#f8fafc", fontFamily:"sans-serif", paddingBottom:80}}>
          {/* Header */}
          <div style={{background:"linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)", color:"#fff", padding:"16px 16px 24px", position:"relative", overflow:"hidden"}}>
            <div style={{position:"absolute", top:-40, right:-40, width:180, height:180, borderRadius:"50%", background:"rgba(255,255,255,0.05)"}} />
            <div style={{maxWidth:800, margin:"0 auto", position:"relative"}}>
              <a href="/" style={{color:"rgba(255,255,255,0.8)", fontSize:13, textDecoration:"none"}}>← Home</a>
              <h1 style={{margin:"6px 0 4px", fontSize:22, fontWeight:800}}>{displayName}</h1>
              <p style={{margin:"0 0 10px", fontSize:12, opacity:0.85}}>{exams.length} exams · {results.length} results · {admits.length} admit cards</p>
              <div style={{position:"relative"}}>
                <input placeholder="Search in this category..." value={search} onChange={e=>setSearch(e.target.value)}
                  style={{width:"100%", padding:"10px 14px", borderRadius:8, border:"none", fontSize:13, boxSizing:"border-box", outline:"none"}} />
              </div>
              {/* Manage toggle */}
              <div style={{marginTop:8, display:"flex", justifyContent:"flex-end"}}>
                {!mauth ? (
                  <div style={{display:"flex", gap:4, alignItems:"center"}}>
                    <input type="password" placeholder="Manage" value={mpw} onChange={e=>setMpw(e.target.value)}
                      style={{padding:"6px 10px", fontSize:12, borderRadius:6, border:"none", width:100}} />
                    <button onClick={enableMgmt} style={{padding:"6px 12px", fontSize:11, fontWeight:700, background:"rgba(255,255,255,0.2)", color:"#fff", border:"none", borderRadius:6, cursor:"pointer"}}>⚡ Go</button>
                  </div>
                ) : (
                  <button onClick={()=>{setMgmt(!mgmt);setMAction("");}} style={{padding:"6px 12px", fontSize:11, fontWeight:700, background:mgmt?"#22c55e":"rgba(255,255,255,0.2)", color:"#fff", border:"none", borderRadius:6, cursor:"pointer"}}>
                    {mgmt ? "✅ Manage ON" : "⚡ Manage"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {msg&&<div style={{maxWidth:800,margin:"0 auto",padding:"8px 16px 0"}}><div style={{background:"#dcfce7",color:"#166534",padding:"10px 14px",borderRadius:8,fontSize:12}}>{msg}<button onClick={()=>setMsg("")} style={{float:"right",background:"none",border:"none",fontSize:14,cursor:"pointer",color:"#166534"}}>×</button></div></div>}
          {err&&<div style={{maxWidth:800,margin:"0 auto",padding:"8px 16px 0"}}><div style={{background:"#fee2e2",color:"#991b1b",padding:"10px 14px",borderRadius:8,fontSize:12}}>{err}<button onClick={()=>setErr("")} style={{float:"right",background:"none",border:"none",fontSize:14,cursor:"pointer",color:"#991b1b"}}>×</button></div></div>}

          <div style={{maxWidth:800,margin:"0 auto",padding:"12px 16px"}}>

            {/* Manage Panel */}
            {mgmt && mauth && (
              <div style={{marginBottom:14}}>
                <div style={{display:"flex", gap:4, marginBottom:10, flexWrap:"wrap"}}>
                  <button onClick={()=>setMAction("add_exam")} style={{padding:"8px 14px", fontSize:12, fontWeight:700, border:"none", borderRadius:8, cursor:"pointer", background:mAction==="add_exam"?"#2563eb":"#e5e7eb", color:mAction==="add_exam"?"#fff":"#4b5563"}}>➕ Exam</button>
                  <button onClick={()=>setMAction("add_result")} style={{padding:"8px 14px", fontSize:12, fontWeight:700, border:"none", borderRadius:8, cursor:"pointer", background:mAction==="add_result"?"#16a34a":"#e5e7eb", color:mAction==="add_result"?"#fff":"#4b5563"}}>➕ Result</button>
                  <button onClick={()=>setMAction("add_admit")} style={{padding:"8px 14px", fontSize:12, fontWeight:700, border:"none", borderRadius:8, cursor:"pointer", background:mAction==="add_admit"?"#ea580c":"#e5e7eb", color:mAction==="add_admit"?"#fff":"#4b5563"}}>➕ Admit Card</button>
                  <button onClick={()=>setMAction("")} style={{padding:"8px 14px", fontSize:12, fontWeight:700, border:"none", borderRadius:8, cursor:"pointer", background:"#dc2626", color:"#fff"}}>✕ Close</button>
                </div>
                {mAction==="add_exam" && renderForm("Exam", [{label:"Exam Name", ph:"e.g. SSC CGL 2026"},{label:"Website (optional)", ph:"https://..."},{label:"Description (optional)", ph:"Extra info"}], addExam)}
                {mAction==="add_result" && renderForm("Result", [{label:"Title", ph:"e.g. SSC CGL Result"},{label:"Result Link", ph:"https://..."},{label:"Exam Name", ph:"SSC CGL"}], addResult)}
                {mAction==="add_admit" && renderForm("Admit Card", [{label:"Title", ph:"e.g. SSC CGL Admit"},{label:"Download Link", ph:"https://..."},{label:"Exam Name", ph:"SSC CGL"}], addAdmit)}
              </div>
            )}

            {/* Tabs */}
            <div style={{display:"flex", gap:4, marginBottom:12}}>
              {["exams","results","admits"].map(t => (
                <button key={t} onClick={()=>setTab(t)} style={{flex:1, padding:"10px", fontSize:12, fontWeight:700, border:"none", borderRadius:8, cursor:"pointer",
                  background:tab===t?"#1e3a5f":"#e5e7eb", color:tab===t?"#fff":"#4b5563"}}>
                  {t==="exams"?`📝 Exams (${exams.length})`:t==="results"?`🏆 Results (${results.length})`:`🎫 Admit Cards (${admits.length})`}
                </button>
              ))}
            </div>

            {/* Exams Tab */}
            {tab==="exams" && (
              <div style={{display:"flex", flexDirection:"column", gap:8}}>
                {filtered.map((e,i) => (
                  <div key={e.id||i} style={{background:"#fff", borderRadius:12, padding:"14px 16px", border:"1px solid #e5e7eb", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                    <div style={{flex:1}}>
                      <p style={{margin:"0 0 2px", fontWeight:700, fontSize:14, color:"#1e3a5f"}}>{e.name}</p>
                      {e.full_name && <p style={{margin:0, fontSize:11, color:"#64748b"}}>{e.full_name}</p>}
                    </div>
                    <div style={{display:"flex", gap:6, alignItems:"center"}}>
                      <a href={`/exam/${e.id}`} style={{fontSize:12, color:"#2563eb", fontWeight:600, textDecoration:"none"}}>Details →</a>
                      {mgmt && mauth && (
                        <button onClick={()=>delExam(e.id,e.name)} style={{padding:"4px 8px", fontSize:11, fontWeight:600, background:"#fee2e2", color:"#dc2626", border:"none", borderRadius:4, cursor:"pointer"}}>✕</button>
                      )}
                    </div>
                  </div>
                ))}
                {filtered.length===0 && <p style={{color:"#999", textAlign:"center", padding:40, fontSize:13}}>No exams found</p>}
              </div>
            )}

            {/* Results Tab */}
            {tab==="results" && (
              <div style={{display:"flex", flexDirection:"column", gap:8}}>
                {results.map((r,i) => (
                  <div key={r.id||i} style={{background:"#fff", borderRadius:12, padding:"14px 16px", border:"1px solid #e5e7eb", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                    <div style={{flex:1}}>
                      <p style={{margin:"0 0 4px", fontWeight:700, fontSize:14, color:"#1e3a5f"}}>✅ {r.exam_name||r.title}</p>
                      <span style={{fontSize:11, padding:"2px 8px", background:"#dcfce7", color:"#16a34a", borderRadius:20, fontWeight:600}}>Declared</span>
                    </div>
                    <div style={{display:"flex", gap:6, alignItems:"center"}}>
                      {r.result_url && <a href={r.result_url} target="_blank" rel="noopener noreferrer" style={{padding:"8px 14px", background:"#2563eb", color:"#fff", borderRadius:8, textDecoration:"none", fontSize:12, fontWeight:700}}>Official ↗</a>}
                      {mgmt && mauth && (
                        <button onClick={()=>delResult(r.id,r.exam_name||r.title)} style={{padding:"4px 8px", fontSize:11, fontWeight:600, background:"#fee2e2", color:"#dc2626", border:"none", borderRadius:4, cursor:"pointer"}}>✕</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Admits Tab */}
            {tab==="admits" && (
              <div style={{display:"flex", flexDirection:"column", gap:8}}>
                {admits.map((r,i) => (
                  <div key={r.id||i} style={{background:"#fff", borderRadius:12, padding:"14px 16px", border:"1px solid #e5e7eb", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                    <div style={{flex:1}}>
                      <p style={{margin:"0 0 4px", fontWeight:700, fontSize:14, color:"#1e3a5f"}}>📄 {r.exam_name||r.title}</p>
                      <span style={{fontSize:11, padding:"2px 8px", background:"#ede9fe", color:"#7c3aed", borderRadius:20, fontWeight:600}}>Released</span>
                    </div>
                    <div style={{display:"flex", gap:6, alignItems:"center"}}>
                      {r.download_url && <a href={r.download_url} target="_blank" rel="noopener noreferrer" style={{padding:"8px 14px", background:"#7c3aed", color:"#fff", borderRadius:8, textDecoration:"none", fontSize:12, fontWeight:700}}>Download ↗</a>}
                      {mgmt && mauth && (
                        <button onClick={()=>delAdmit(r.id,r.exam_name||r.title)} style={{padding:"4px 8px", fontSize:11, fontWeight:600, background:"#fee2e2", color:"#dc2626", border:"none", borderRadius:4, cursor:"pointer"}}>✕</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }
    