"use client";
    import { useState, useEffect } from "react";
    import { supabase } from "../lib/supabase";

    const CATEGORIES = [
      { name: "SSC Exams", slug: "ssc-exams" },
      { name: "UPSC Civil Services", slug: "upsc-civil-services" },
      { name: "Railway Recruitment", slug: "railway-recruitment" },
      { name: "Banking and Finance", slug: "banking-finance" },
      { name: "State PSC", slug: "state-psc" },
      { name: "State Police", slug: "state-police" },
      { name: "Teaching Exams", slug: "teaching-exams" },
      { name: "Medical Entrance", slug: "medical-entrance" },
      { name: "Engineering Entrance", slug: "engineering-entrance" },
      { name: "Defence and Armed Forces", slug: "defence-armed-forces" },
      { name: "Law Entrance", slug: "law-entrance" },
      { name: "MBA and Management", slug: "mba-management" },
      { name: "School Boards", slug: "school-boards" },
      { name: "Cloud Computing", slug: "cloud-computing" },
      { name: "Programming & Development", slug: "programming" },
      { name: "Web Development", slug: "web-development" },
      { name: "Mobile App Development", slug: "mobile-development" },
      { name: "Artificial Intelligence", slug: "artificial-intelligence" },
      { name: "Data Science & Analytics", slug: "data-science" },
      { name: "Cyber Security", slug: "cyber-security" },
      { name: "Networking", slug: "networking" },
      { name: "Database", slug: "database" },
      { name: "DevOps & SRE", slug: "devops" },
      { name: "Software Testing", slug: "software-testing" },
      { name: "Project Management", slug: "project-management" },
      { name: "Finance & Accounting", slug: "finance" },
      { name: "Digital Marketing", slug: "digital-marketing" },
      { name: "ERP & Enterprise", slug: "erp-enterprise" },
      { name: "Language Certifications", slug: "language" },
      { name: "Engineering Design", slug: "engineering" },
      { name: "Government Skill Certs", slug: "govt-skill" },
      { name: "Emerging Technologies", slug: "emerging-tech" },
      { name: "Healthcare", slug: "healthcare" },
      { name: "Agriculture and Veterinary", slug: "agriculture" },
      { name: "Architecture and Design", slug: "architecture" },
      { name: "Aviation and Hospitality", slug: "aviation" },
      { name: "Pharmacy Nursing Paramedical", slug: "pharmacy" },
      { name: "Polytechnic Entrance", slug: "polytechnic" },
      { name: "ITI Entrance", slug: "iti-entrance" },
      { name: "CAPF Paramilitary", slug: "capf" },
      { name: "PSU Research GATE", slug: "psu-gate" },
      { name: "Revenue Patwari Lekhpal", slug: "patwari" },
      { name: "School Entrance Specialist", slug: "school-entrance" },
      { name: "School Olympiads Scholarship", slug: "olympiads" },
      { name: "University Admission", slug: "university-admission" },
      { name: "International Language", slug: "international-language" },
      { name: "Teacher Training", slug: "teacher-training" },
      { name: "Postal Services", slug: "postal" },
      { name: "Professional Certifications", slug: "professional-certs" },
    ];

    const TABLES = [
      { id: "exams", label: "Exams", color: "#2563eb" },
      { id: "results", label: "Results", color: "#16a34a" },
      { id: "admit_cards", label: "Admit Cards", color: "#ea580c" },
      { id: "updates", label: "Updates", color: "#7c3aed" },
      { id: "upcoming_exams", label: "Upcoming", color: "#0891b2" },
      { id: "categories", label: "Categories", color: "#ca8a04" },
      { id: "answer_keys", label: "Answer Keys", color: "#be185d" },
    ];

    export default function QuickAddPage() {
      const [pw, setPw] = useState("");
      const [auth, setAuth] = useState(false);
      const [table, setTable] = useState("exams");
      const [mode, setMode] = useState("add");
      const [category, setCategory] = useState("");
      const [items, setItems] = useState([]);
      const [loading, setLoading] = useState(false);
      const [msg, setMsg] = useState("");
      const [error, setError] = useState("");
      const [editItem, setEditItem] = useState(null);
      const [f1, setF1] = useState("");
      const [f2, setF2] = useState("");
      const [f3, setF3] = useState("");
      const [f4, setF4] = useState("");

      useEffect(() => {
        const saved = localStorage.getItem("qa_auth");
        if (saved === "sarkari123") setAuth(true);
      }, []);

      const login = () => {
        if (pw === "sarkari123") { setAuth(true); localStorage.setItem("qa_auth", "sarkari123"); }
        else setError("Wrong password!");
      };

      const clearForm = () => { setF1(""); setF2(""); setF3(""); setF4(""); setEditItem(null); };
      const showMsg = (m) => { setMsg(m); setError(""); setTimeout(() => setMsg(""), 3000); };
      const showErr = (e) => { setError(e); setMsg(""); };

      const getLabels = () => ({
        exams: { f1:"Exam Name", f2:"Website", f3:"Description", f4:"", p1:"e.g. SSC CGL 2026", p2:"https://..." },
        results: { f1:"Title", f2:"Result URL", f3:"Exam Name", f4:"", p1:"e.g. SSC CGL Result", p2:"https://..." },
        admit_cards: { f1:"Title", f2:"Download URL", f3:"Exam Name", f4:"", p1:"e.g. SSC CGL Admit", p2:"https://..." },
        updates: { f1:"Title", f2:"Content", f3:"Category", f4:"Exam ID", p1:"Update title...", p2:"Details..." },
        upcoming_exams: { f1:"Exam Name", f2:"Date", f3:"Description", f4:"Category", p1:"e.g. SSC CGL", p2:"2026-08-15" },
        categories: { f1:"Name", f2:"Slug", f3:"", f4:"", p1:"e.g. Robotics", p2:"robotics" },
        answer_keys: { f1:"Title", f2:"Answer Key URL", f3:"Exam Name", f4:"", p1:"e.g. SSC CGL Key", p2:"https://..." },
      }[table] || {});
      const L = getLabels();

      const buildData = () => {
        switch(table) {
          case"exams": return {name:f1,official_website:f2||null,description:f3||null,category:category||null,type:"exam"};
          case"results": return {title:f1,result_url:f2,exam_name:f3,category:category||null};
          case"admit_cards": return {title:f1,download_url:f2,exam_name:f3,category:category||null};
          case"updates": return {title:f1,content:f2,category:f3||category||null,exam_id:f4?parseInt(f4):null};
          case"upcoming_exams": return {exam_name:f1,exam_date:f2,description:f3||null,category:f4||category||null};
          case"categories": return {name:f1,slug:f2};
          case"answer_keys": return {title:f1,answer_key_url:f2,exam_name:f3,category:category||null};
          default: return {};
        }
      };

      const handleAdd = async () => {
        setMsg(""); setError("");
        if (!f1) { showErr("Field bharo!"); return; }
        if (table==="upcoming_exams"&&!f2) { showErr("Date bharo!"); return; }
        if (table==="categories"&&!f2) { showErr("Slug bharo!"); return; }
        try {
          const {error:e} = await supabase.from(table).insert(buildData());
          if(e) throw e;
          showMsg("Added: "+f1); clearForm();
        } catch(e) { showErr("Error: "+e.message); }
      };

      const loadItems = async () => {
        setLoading(true); setError(""); setMsg("");
        try {
          let q = supabase.from(table).select("*");
          if(table==="exams") q=q.eq("category",category).order("name",{ascending:true});
          else if(table==="results") q=q.eq("category",category).order("created_at",{ascending:false});
          else if(table==="admit_cards") q=q.eq("category",category).order("created_at",{ascending:false});
          else if(table==="updates") q=q.order("created_at",{ascending:false}).limit(100);
          else if(table==="upcoming_exams") q=q.order("exam_date",{ascending:true});
          else if(table==="answer_keys") q=q.eq("category",category).order("created_at",{ascending:false});
          else if(table==="categories") q=q.order("name");
          const {data,error:fe} = await q;
          if(fe) throw fe;
          setItems(data||[]);
          if(!data||data.length===0) showMsg("No items found.");
        } catch(e) { showErr("Error: "+e.message); }
        setLoading(false);
      };

      const deleteItem = async (id,name) => {
        if(!confirm('Delete "'+name+'"?')) return;
        try {
          const {error:de} = await supabase.from(table).delete().eq("id",id);
          if(de) throw de;
          showMsg("Deleted: "+name);
          setItems(items.filter(i=>i.id!==id));
        } catch(e) { showErr("Error: "+e.message); }
      };

      const startEdit = (item) => {
        setEditItem(item); setMode("edit");
        setF1(item.name||item.exam_name||item.title||"");
        setF2(item.official_website||item.result_url||item.download_url||item.answer_key_url||item.exam_date||item.slug||item.content||"");
        setF3(item.description||item.exam_name||item.content||"");
        setF4(item.state||item.full_name||item.category||"");
        setCategory(item.category||"");
      };

      const handleEdit = async () => {
        if(!editItem) return;
        setMsg(""); setError("");
        try {
          const d = buildData();
          Object.keys(d).forEach(k=>{if(!d[k]) delete d[k];});
          const {error:ue} = await supabase.from(table).update(d).eq("id",editItem.id);
          if(ue) throw ue;
          showMsg("Updated: "+f1);
          setEditItem(null); clearForm(); setMode("add"); loadItems();
        } catch(e) { showErr("Error: "+e.message); }
      };

      const cancelEdit = () => { setEditItem(null); clearForm(); setMode("add"); };
      const getName = (item) => item.name||item.exam_name||item.title||item.slug||"(no name)";

      const getBadge = (item) => {
        if(table==="exams"&&item.category) return <span style={{fontSize:10,color:"#2563eb",background:"#eff6ff",padding:"2px 6px",borderRadius:4,marginLeft:4}}>{item.category}</span>;
        if(table==="results"&&item.result_url) return <span style={{fontSize:10,color:"#16a34a",background:"#f0fdf4",padding:"2px 6px",borderRadius:4,marginLeft:4}}>URL</span>;
        if(table==="upcoming_exams"&&item.exam_date) return <span style={{fontSize:10,color:"#0891b2",background:"#ecfeff",padding:"2px 6px",borderRadius:4,marginLeft:4}}>{item.exam_date}</span>;
        if(table==="categories") return <span style={{fontSize:10,color:"#ca8a04",background:"#fef3c7",padding:"2px 6px",borderRadius:4,marginLeft:4}}>/{item.slug}</span>;
        return null;
      };

      const needsCat = ["exams","results","admit_cards","answer_keys"];

      if(!auth) {
        return (
          <div style={{padding:40,textAlign:"center",fontFamily:"sans-serif",minHeight:"100vh",background:"#f5f5f5",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{maxWidth:320,width:"100%"}}>
              <h1 style={{fontSize:22,fontWeight:700,marginBottom:8,color:"#1e3a5f"}}>Quick Manage</h1>
              <p style={{fontSize:13,color:"#666",marginBottom:20}}>Password daal kar login karo</p>
              <input type="password" placeholder="Password" value={pw} onChange={e=>setPw(e.target.value)}
                style={{width:"100%",padding:"12px 16px",fontSize:15,border:"1px solid #ddd",borderRadius:10,marginBottom:10,boxSizing:"border-box"}} />
              <button onClick={login}
                style={{width:"100%",padding:12,fontSize:15,fontWeight:600,background:"#1e3a5f",color:"#fff",border:"none",borderRadius:10,cursor:"pointer"}}>Login</button>
              {error&&<p style={{color:"#dc2626",fontSize:13,marginTop:10}}>{error}</p>}
            </div>
          </div>
        );
      }

      const tb = (id,label,color) => (
        <button key={id} onClick={()=>{setTable(id);setMode("add");setItems([]);clearForm();setCategory("");}}
          style={{padding:"6px 10px",fontSize:11,fontWeight:600,border:"none",borderRadius:6,cursor:"pointer",
            background:table===id?color:"#e5e7eb",color:table===id?"#fff":"#4b5563"}}>{label}</button>
      );

      const mb = (label,active,color, onClick) => (
        <button onClick={onClick}
          style={{flex:1,padding:"8px",fontSize:12,fontWeight:600,border:"none",borderRadius:6,cursor:"pointer",
            background:active?color:"#e5e7eb",color:active?"#fff":"#4b5563"}}>{label}</button>
      );

      return (
        <div style={{padding:12,fontFamily:"sans-serif",minHeight:"100vh",maxWidth:540,margin:"0 auto",background:"#f5f5f5"}}>
          <h1 style={{fontSize:20,fontWeight:700,color:"#1e3a5f",marginBottom:2}}>Quick Manage</h1>
          <p style={{fontSize:11,color:"#666",marginBottom:12}}>7 sections ko Add / Delete / Edit karo</p>

          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>
            {TABLES.map(t=>tb(t.id,t.label,t.color))}
          </div>

          <div style={{display:"flex",gap:4,marginBottom:8}}>
            {mb("+ Add",mode==="add","#2563eb",()=>{setMode("add");clearForm();setEditItem(null);})}
            {mb("Delete",mode==="delete","#dc2626",()=>{setMode("delete");setItems([]);})}
            {(table==="categories"||table==="upcoming_exams")&&mb("Edit",mode==="edit"&&!editItem,"#ca8a04",()=>{setMode("edit");setItems([]);setEditItem(null);})}
          </div>

          {msg&&<div style={{background:"#dcfce7",color:"#166534",padding:"8px 12px",borderRadius:8,fontSize:12,marginBottom:6}}>{msg}</div>}
          {error&&<div style={{background:"#fee2e2",color:"#991b1b",padding:"8px 12px",borderRadius:8,fontSize:12,marginBottom:6}}>{error}</div>}

          <div style={{background:"#fff",borderRadius:12,padding:14,border:"1px solid #e5e7eb"}}>
            {/* ADD */}
            {mode==="add"&&(
              <>
                {needsCat.includes(table)&&(
                  <div style={{marginBottom:12}}>
                    <label style={{fontSize:12,fontWeight:600,color:"#374151",display:"block",marginBottom:4}}>Category</label>
                    <select value={category} onChange={e=>setCategory(e.target.value)}
                      style={{width:"100%",padding:"10px 12px",fontSize:14,border:"1px solid #ddd",borderRadius:8,background:"#fff"}}>
                      <option value="">-- Select --</option>
                      {CATEGORIES.map(c=><option key={c.slug} value={c.slug}>{c.name}</option>)}
                    </select>
                  </div>
                )}
                <label style={{fontSize:12,fontWeight:600,color:"#374151",display:"block",marginBottom:4}}>{L.f1}</label>
                <input type="text" placeholder={L.p1} value={f1} onChange={e=>setF1(e.target.value)}
                  style={{width:"100%",padding:"10px 12px",fontSize:14,border:"1px solid #ddd",borderRadius:8,marginBottom:12}} />
                {L.f2&&(
                  <>
                    <label style={{fontSize:12,fontWeight:600,color:"#374151",display:"block",marginBottom:4}}>{L.f2}</label>
                    {table==="updates"?(
                      <textarea placeholder={L.p2} value={f2} onChange={e=>setF2(e.target.value)} rows={3}
                        style={{width:"100%",padding:"10px 12px",fontSize:14,border:"1px solid #ddd",borderRadius:8,marginBottom:12,resize:"vertical"}} />
                    ):(
                      <input type={table==="upcoming_exams"?"date":"text"} placeholder={L.p2} value={f2} onChange={e=>setF2(e.target.value)}
                        style={{width:"100%",padding:"10px 12px",fontSize:14,border:"1px solid #ddd",borderRadius:8,marginBottom:12}} />
                    )}
                  </>
                )}
                {L.f3&&(
                  <>
                    <label style={{fontSize:12,fontWeight:600,color:"#374151",display:"block",marginBottom:4}}>{L.f3}</label>
                    <input type="text" value={f3} onChange={e=>setF3(e.target.value)}
                      style={{width:"100%",padding:"10px 12px",fontSize:14,border:"1px solid #ddd",borderRadius:8,marginBottom:12}} />
                  </>
                )}
                {L.f4&&(
                  <>
                    <label style={{fontSize:12,fontWeight:600,color:"#374151",display:"block",marginBottom:4}}>{L.f4}</label>
                    <input type="text" value={f4} onChange={e=>setF4(e.target.value)}
                      style={{width:"100%",padding:"10px 12px",fontSize:14,border:"1px solid #ddd",borderRadius:8,marginBottom:12}} />
                  </>
                )}
                <button onClick={handleAdd}
                  style={{width:"100%",padding:12,fontSize:15,fontWeight:600,background:"#2563eb",color:"#fff",border:"none",borderRadius:10,cursor:"pointer"}}>
                  Add to Database
                </button>
              </>
            )}

            {/* EDIT FORM */}
            {mode==="edit"&&editItem&&(
              <>
                {needsCat.includes(table)&&(
                  <div style={{marginBottom:12}}>
                    <label style={{fontSize:12,fontWeight:600,color:"#374151",display:"block",marginBottom:4}}>Category</label>
                    <select value={category} onChange={e=>setCategory(e.target.value)}
                      style={{width:"100%",padding:"10px 12px",fontSize:14,border:"1px solid #ddd",borderRadius:8,background:"#fff"}}>
                      <option value="">-- Select --</option>
                      {CATEGORIES.map(c=><option key={c.slug} value={c.slug}>{c.name}</option>)}
                    </select>
                  </div>
                )}
                <label style={{fontSize:12,fontWeight:600,color:"#374151",display:"block",marginBottom:4}}>{L.f1}</label>
                <input type="text" value={f1} onChange={e=>setF1(e.target.value)}
                  style={{width:"100%",padding:"10px 12px",fontSize:14,border:"1px solid #ddd",borderRadius:8,marginBottom:12}} />
                {L.f2&&(
                  <>
                    <label style={{fontSize:12,fontWeight:600,color:"#374151",display:"block",marginBottom:4}}>{L.f2}</label>
                    <input type="text" value={f2} onChange={e=>setF2(e.target.value)}
                      style={{width:"100%",padding:"10px 12px",fontSize:14,border:"1px solid #ddd",borderRadius:8,marginBottom:12}} />
                  </>
                )}
                {L.f3&&(
                  <>
                    <label style={{fontSize:12,fontWeight:600,color:"#374151",display:"block",marginBottom:4}}>{L.f3}</label>
                    <input type="text" value={f3} onChange={e=>setF3(e.target.value)}
                      style={{width:"100%",padding:"10px 12px",fontSize:14,border:"1px solid #ddd",borderRadius:8,marginBottom:12}} />
                  </>
                )}
                {L.f4&&(
                  <>
                    <label style={{fontSize:12,fontWeight:600,color:"#374151",display:"block",marginBottom:4}}>{L.f4}</label>
                    <input type="text" value={f4} onChange={e=>setF4(e.target.value)}
                      style={{width:"100%",padding:"10px 12px",fontSize:14,border:"1px solid #ddd",borderRadius:8,marginBottom:12}} />
                  </>
                )}
                <button onClick={handleEdit}
                  style={{width:"100%",padding:12,fontSize:15,fontWeight:600,background:"#ca8a04",color:"#fff",border:"none",borderRadius:10,cursor:"pointer"}}>
                  Save Changes
                </button>
                <button onClick={cancelEdit}
                  style={{width:"100%",padding:10,fontSize:13,fontWeight:600,background:"#e5e7eb",color:"#374151",border:"none",borderRadius:8,cursor:"pointer",marginTop:8}}>
                  Cancel
                </button>
              </>
            )}

            {/* DELETE */}
            {mode==="delete"&&(
              <>
                {!["updates","upcoming_exams","categories"].includes(table)&&(
                  <div style={{marginBottom:10}}>
                    <label style={{fontSize:12,fontWeight:600,color:"#374151",display:"block",marginBottom:4}}>Category</label>
                    <select value={category} onChange={e=>{setCategory(e.target.value);setItems([]);}}
                      style={{width:"100%",padding:"10px 12px",fontSize:14,border:"1px solid #ddd",borderRadius:8,background:"#fff"}}>
                      <option value="">-- Select --</option>
                      {CATEGORIES.map(c=><option key={c.slug} value={c.slug}>{c.name}</option>)}
                    </select>
                  </div>
                )}
                <button onClick={loadItems} disabled={loading}
                  style={{width:"100%",padding:10,fontSize:13,fontWeight:600,background:"#374151",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",marginBottom:10}}>
                  {loading?"Loading...":"Load Items"}
                </button>
                {items.length>0&&(
                  <div style={{maxHeight:420,overflowY:"auto"}}>
                    {items.map(item=>(
                      <div key={item.id} style={{display:"flex",alignItems:"center",gap:4,padding:"6px 0",borderBottom:"1px solid #f3f4f6"}}>
                        <span style={{flex:1,fontSize:12,color:"#374151",lineHeight:1.3}}>
                          {getName(item)}{getBadge(item)}
                        </span>
                        <button onClick={()=>deleteItem(item.id,getName(item))}
                          style={{padding:"5px 10px",fontSize:11,fontWeight:600,background:"#fee2e2",color:"#dc2626",border:"none",borderRadius:4,cursor:"pointer",whiteSpace:"nowrap"}}>
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {items.length===0&&!loading&&<p style={{fontSize:12,color:"#9ca3af",textAlign:"center",padding:20}}>Load karo</p>}
              </>
            )}

            {/* EDIT LIST */}
            {mode==="edit"&&!editItem&&(
              <>
                <button onClick={loadItems} disabled={loading}
                  style={{width:"100%",padding:10,fontSize:13,fontWeight:600,background:"#ca8a04",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",marginBottom:10}}>
                  {loading?"Loading...":"Load Items to Edit"}
                </button>
                {items.length>0&&(
                  <div style={{maxHeight:420,overflowY:"auto"}}>
                    {items.map(item=>(
                      <div key={item.id} style={{display:"flex",alignItems:"center",gap:4,padding:"6px 0",borderBottom:"1px solid #f3f4f6"}}>
                        <span style={{flex:1,fontSize:12,color:"#374151"}}>
                          {getName(item)}{getBadge(item)}
                        </span>
                        <button onClick={()=>startEdit(item)}
                          style={{padding:"5px 10px",fontSize:11,fontWeight:600,background:"#fef3c7",color:"#ca8a04",border:"none",borderRadius:4,cursor:"pointer",whiteSpace:"nowrap"}}>
                          Edit
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          <div style={{marginTop:10,padding:10,background:"#f0fdf4",borderRadius:8,fontSize:11,color:"#166534",lineHeight:1.6}}>
            Tips: Upar Table tab se chuno kis section me kaam karna hai. Add me form bharko Add dabao. Delete me load karo aur Delete karo. Categories aur Upcoming Exams me Edit bhi hai.
          </div>

          <a href="/" style={{display:"block",marginTop:10,textAlign:"center",fontSize:12,color:"#2563eb",textDecoration:"none"}}>Back to Website</a>
        </div>
      );
    }