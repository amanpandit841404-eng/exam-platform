"use client";
    import { useState, useEffect } from "react";
    import { supabase } from "../lib/supabase";

    const SECTIONS = [
      { id: "exams",          icon: "📝", label: "Exams",         color: "#2563eb", bg: "#eff6ff" },
      { id: "results",        icon: "🏆", label: "Results",        color: "#16a34a", bg: "#f0fdf4" },
      { id: "admit_cards",    icon: "🎫", label: "Admit Cards",    color: "#ea580c", bg: "#fff7ed" },
      { id: "updates",        icon: "📢", label: "Updates",        color: "#7c3aed", bg: "#f5f3ff" },
      { id: "upcoming_exams", icon: "📅", label: "Upcoming Exams", color: "#0891b2", bg: "#ecfeff" },
      { id: "categories",     icon: "📂", label: "Categories",     color: "#ca8a04", bg: "#fef3c7" },
      { id: "answer_keys",    icon: "🔑", label: "Answer Keys",    color: "#be185d", bg: "#fdf2f8" },
    ];

    const CATEGORIES = [
      { name:"SSC Exams", slug:"ssc-exams" },{ name:"UPSC Civil Services", slug:"upsc-civil-services" },
      { name:"Railway Recruitment", slug:"railway-recruitment" },{ name:"Banking and Finance", slug:"banking-finance" },
      { name:"State PSC", slug:"state-psc" },{ name:"State Police", slug:"state-police" },
      { name:"Teaching Exams", slug:"teaching-exams" },{ name:"Medical Entrance", slug:"medical-entrance" },
      { name:"Engineering Entrance", slug:"engineering-entrance" },{ name:"Defence and Armed Forces", slug:"defence-armed-forces" },
      { name:"Law Entrance", slug:"law-entrance" },{ name:"MBA and Management", slug:"mba-management" },
      { name:"School Boards", slug:"school-boards" },{ name:"Cloud Computing", slug:"cloud-computing" },
      { name:"Programming & Development", slug:"programming" },{ name:"Web Development", slug:"web-development" },
      { name:"Mobile App Development", slug:"mobile-development" },{ name:"Artificial Intelligence", slug:"artificial-intelligence" },
      { name:"Data Science & Analytics", slug:"data-science" },{ name:"Cyber Security", slug:"cyber-security" },
      { name:"Networking", slug:"networking" },{ name:"Database", slug:"database" },
      { name:"DevOps & SRE", slug:"devops" },{ name:"Software Testing", slug:"software-testing" },
      { name:"Project Management", slug:"project-management" },{ name:"Finance & Accounting", slug:"finance" },
      { name:"Digital Marketing", slug:"digital-marketing" },{ name:"ERP & Enterprise", slug:"erp-enterprise" },
      { name:"Language Certifications", slug:"language" },{ name:"Engineering Design", slug:"engineering" },
      { name:"Government Skill Certs", slug:"govt-skill" },{ name:"Emerging Technologies", slug:"emerging-tech" },
      { name:"Healthcare", slug:"healthcare" },{ name:"Agriculture and Veterinary", slug:"agriculture" },
      { name:"Architecture and Design", slug:"architecture" },{ name:"Aviation and Hospitality", slug:"aviation" },
      { name:"Pharmacy Nursing Paramedical", slug:"pharmacy" },{ name:"Polytechnic Entrance", slug:"polytechnic" },
      { name:"ITI Entrance", slug:"iti-entrance" },{ name:"CAPF Paramilitary", slug:"capf" },
      { name:"PSU Research GATE", slug:"psu-gate" },{ name:"Revenue Patwari Lekhpal", slug:"patwari" },
      { name:"School Entrance Specialist", slug:"school-entrance" },{ name:"School Olympiads Scholarship", slug:"olympiads" },
      { name:"University Admission", slug:"university-admission" },{ name:"International Language", slug:"international-language" },
      { name:"Teacher Training", slug:"teacher-training" },{ name:"Postal Services", slug:"postal" },
      { name:"Professional Certifications", slug:"professional-certs" },
    ];

    export default function QuickAddPage() {
      const [pw, setPw] = useState("");
      const [authed, setAuthed] = useState(false);
      const [step, setStep] = useState("section");
      const [section, setSection] = useState(null);
      const [cat, setCat] = useState("");
      const [vals, setVals] = useState(["","","",""]);
      const [msg, setMsg] = useState("");
      const [err, setErr] = useState("");
      const [items, setItems] = useState([]);
      const [loading, setLoading] = useState(false);
      const [mode, setMode] = useState("add");

      useEffect(() => {
        if (localStorage.getItem("qa_auth") === "sarkari123") setAuthed(true);
      }, []);

      const login = () => {
        if (pw === "sarkari123") { setAuthed(true); localStorage.setItem("qa_auth", "sarkari123"); }
        else setErr("Wrong password!");
      };

      const reset = () => { setStep("section"); setSection(null); setCat(""); setVals(["","","",""]); setMsg(""); setErr(""); setItems([]); };

      const needsCat = ["exams","results","admit_cards","answer_keys"];

      const fieldDefs = () => {
        const map = {
          exams: [
            { label:"Exam Name", ph:"e.g. SSC CGL 2026", type:"text" },
            { label:"Website Link (optional)", ph:"https://ssc.nic.in", type:"url" },
            { label:"Description (optional)", ph:"Kuch bhi extra info", type:"text" },
          ],
          results: [
            { label:"Title", ph:"e.g. SSC CGL Result 2026", type:"text" },
            { label:"Result Link", ph:"https://ssc.nic.in/result", type:"url" },
            { label:"Exam Name", ph:"SSC CGL", type:"text" },
          ],
          admit_cards: [
            { label:"Title", ph:"e.g. SSC CGL Admit Card", type:"text" },
            { label:"Download Link", ph:"https://ssc.nic.in/admit", type:"url" },
            { label:"Exam Name", ph:"SSC CGL", type:"text" },
          ],
          updates: [
            { label:"Title", ph:"e.g. SSC CGL result declared", type:"text" },
            { label:"Content", ph:"Full details likho...", type:"textarea" },
            { label:"Category (optional)", ph:"SSC / UPSC", type:"text" },
            { label:"Exam ID (optional)", ph:"Exam ka database ID", type:"number" },
          ],
          upcoming_exams: [
            { label:"Exam Name", ph:"e.g. SSC CGL 2026", type:"text" },
            { label:"Exam Date", ph:"2026-08-15", type:"date" },
            { label:"Description (optional)", ph:"Extra details", type:"text" },
          ],
          categories: [
            { label:"Category Name", ph:"e.g. Robotics", type:"text" },
            { label:"Slug (URL name)", ph:"robotics", type:"text" },
          ],
          answer_keys: [
            { label:"Title", ph:"e.g. SSC CGL Answer Key", type:"text" },
            { label:"Answer Key Link", ph:"https://ssc.nic.in/answer-key", type:"url" },
            { label:"Exam Name", ph:"SSC CGL", type:"text" },
          ],
        };
        return map[section?.id] || [];
      };

      const buildData = () => {
        const d = { v0:vals[0], v1:vals[1], v2:vals[2], v3:vals[3], cat };
        switch(section?.id) {
          case"exams": return { name:d.v0, official_website:d.v1||null, description:d.v2||null, category:cat||null, type:"exam" };
          case"results": return { title:d.v0, result_url:d.v1, exam_name:d.v2, category:cat||null };
          case"admit_cards": return { title:d.v0, download_url:d.v1, exam_name:d.v2, category:cat||null };
          case"updates": return { title:d.v0, content:d.v1, category:d.v2||cat||null, exam_id:d.v3?parseInt(d.v3):null };
          case"upcoming_exams": return { exam_name:d.v0, exam_date:d.v1, description:d.v2||null, category:cat||null };
          case"categories": return { name:d.v0, slug:d.v1 };
          case"answer_keys": return { title:d.v0, answer_key_url:d.v1, exam_name:d.v2, category:cat||null };
          default: return {};
        }
      };

      const handleAdd = async () => {
        if (!vals[0]) { setErr("Pehla field bharo!"); return; }
        if (section?.id==="upcoming_exams"&&!vals[1]) { setErr("Date chuno!"); return; }
        if (section?.id==="categories"&&!vals[1]) { setErr("Slug bharo!"); return; }
        setErr(""); setMsg("Adding...");
        try {
          const { error: e } = await supabase.from(section.id).insert(buildData());
          if (e) throw e;
          setMsg("Added! "+vals[0]);
          setVals(["","","",""]);
        } catch(e) { setErr("Error: "+e.message); }
      };

      const loadItems = async () => {
        setLoading(true); setErr(""); setMsg("");
        try {
          let q = supabase.from(section.id).select("*");
          if (section.id==="exams") q=q.eq("category",cat).order("name",{ascending:true}).limit(50);
          else if (section.id==="results") q=q.eq("category",cat).order("created_at",{ascending:false}).limit(50);
          else if (section.id==="admit_cards") q=q.eq("category",cat).order("created_at",{ascending:false}).limit(50);
          else if (section.id==="updates") q=q.order("created_at",{ascending:false}).limit(50);
          else if (section.id==="upcoming_exams") q=q.order("exam_date",{ascending:true}).limit(50);
          else if (section.id==="answer_keys") q=q.eq("category",cat).order("created_at",{ascending:false}).limit(50);
          else if (section.id==="categories") q=q.order("name");
          const {data,error:fe} = await q;
          if(fe) throw fe;
          setItems(data||[]);
          if(!data||data.length===0) setMsg("Koi item nahi mila");
        } catch(e) { setErr("Error: "+e.message); }
        setLoading(false);
      };

      const deleteItem = async (id,name) => {
        if(!confirm('Delete "'+name+'"?')) return;
        try {
          const {error:de} = await supabase.from(section.id).delete().eq("id",id);
          if(de) throw de;
          setMsg("Deleted: "+name);
          setItems(items.filter(i=>i.id!==id));
        } catch(e) { setErr("Error: "+e.message); }
      };

      const getName = (item) => item.name||item.exam_name||item.title||item.slug||"(no name)";

      if(!authed) {
        return (
          <div style={{minHeight:"100vh",background:"#f5f5f5",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"sans-serif",padding:20}}>
            <div style={{maxWidth:340,width:"100%",textAlign:"center"}}>
              <div style={{fontSize:48,marginBottom:10}}>⚡</div>
              <h1 style={{fontSize:22,fontWeight:700,color:"#1e3a5f",marginBottom:6}}>SarkariSetu Manage</h1>
              <p style={{fontSize:13,color:"#666",marginBottom:20}}>Password daal kar data manage karo</p>
              <input type="password" placeholder="Password" value={pw} onChange={e=>setPw(e.target.value)}
                style={{width:"100%",padding:"14px 16px",fontSize:16,border:"2px solid #ddd",borderRadius:12,marginBottom:12,boxSizing:"border-box",textAlign:"center"}} />
              <button onClick={login}
                style={{width:"100%",padding:"14px",fontSize:16,fontWeight:700,background:"#1e3a5f",color:"#fff",border:"none",borderRadius:12,cursor:"pointer"}}>Login</button>
              {err&&<p style={{color:"#dc2626",fontSize:13,marginTop:12}}>{err}</p>}
            </div>
          </div>
        );
      }

      if(step==="section") {
        return (
          <div style={{minHeight:"100vh",background:"#f8fafc",fontFamily:"sans-serif",padding:16}}>
            <div style={{maxWidth:500,margin:"0 auto"}}>
              <div style={{textAlign:"center",marginBottom:20}}>
                <h1 style={{fontSize:22,fontWeight:700,color:"#1e3a5f",marginBottom:4}}>⚡ Manage Data</h1>
                <p style={{fontSize:13,color:"#64748b"}}>Pehle chuno kis section me data dalna hai</p>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {SECTIONS.map(s=>(
                  <button key={s.id} onClick={()=>{setSection(s);setStep("category");setMode("add");setCat("");}}
                    style={{display:"flex",alignItems:"center",gap:14,padding:"16px 18px",background:s.bg,border:"none",borderRadius:14,cursor:"pointer",textAlign:"left",width:"100%"}}>
                    <div style={{fontSize:28}}>{s.icon}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:16,fontWeight:700,color:"#1e293b"}}>{s.label}</div>
                      <div style={{fontSize:12,color:"#64748b"}}>{s.id==="exams"?"52,472 exams":s.id==="updates"?"40,000+ updates":"Add ya delete karo"}</div>
                    </div>
                    <div style={{fontSize:20,color:s.color}}>›</div>
                  </button>
                ))}
              </div>
              <a href="/" style={{display:"block",marginTop:16,textAlign:"center",fontSize:13,color:"#2563eb",textDecoration:"none"}}>← Back to Website</a>
            </div>
          </div>
        );
      }

      const si = section;
      const sc = si.color;
      const fields = fieldDefs();

      return (
        <div style={{minHeight:"100vh",background:"#f8fafc",fontFamily:"sans-serif",padding:0}}>
          <div style={{background:`linear-gradient(135deg, ${sc} 0%, #1e3a5f 100%)`,color:"#fff",padding:"16px 16px 20px"}}>
            <div style={{maxWidth:500,margin:"0 auto"}}>
              <button onClick={reset} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",padding:"6px 14px",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",marginBottom:10}}>← Back</button>
              <div style={{fontSize:28,marginBottom:4}}>{si.icon}</div>
              <h1 style={{fontSize:20,fontWeight:800,margin:0}}>{si.label}</h1>
              <p style={{fontSize:12,opacity:0.8,marginTop:2}}>Data add ya delete karo</p>
            </div>
          </div>

          <div style={{maxWidth:500,margin:"0 auto",padding:"12px 16px"}}>
            <div style={{display:"flex",gap:8,marginBottom:14}}>
              <button onClick={()=>setMode("add")}
                style={{flex:1,padding:"12px",fontSize:14,fontWeight:700,border:"none",borderRadius:10,cursor:"pointer",
                  background:mode==="add"?sc:"#e5e7eb",color:mode==="add"?"#fff":"#4b5563"}}>➕ Add</button>
              <button onClick={()=>setMode("delete")}
                style={{flex:1,padding:"12px",fontSize:14,fontWeight:700,border:"none",borderRadius:10,cursor:"pointer",
                  background:mode==="delete"?"#dc2626":"#e5e7eb",color:mode==="delete"?"#fff":"#4b5563"}}>🗑️ Delete</button>
            </div>

            {msg&&<div style={{background:"#dcfce7",color:"#166534",padding:"12px 16px",borderRadius:10,fontSize:13,marginBottom:12}}>{msg}</div>}
            {err&&<div style={{background:"#fee2e2",color:"#991b1b",padding:"12px 16px",borderRadius:10,fontSize:13,marginBottom:12}}>{err}</div>}

            {mode==="add"&&(
              <div style={{background:"#fff",borderRadius:14,padding:18,border:"1px solid #e5e7eb"}}>
                {needsCat.includes(si.id)&&(
                  <div style={{marginBottom:14}}>
                    <label style={{fontSize:13,fontWeight:600,color:"#374151",display:"block",marginBottom:4}}>Category <span style={{color:"#dc2626"}}>*</span></label>
                    <select value={cat} onChange={e=>setCat(e.target.value)}
                      style={{width:"100%",padding:"12px 14px",fontSize:14,border:"2px solid #e5e7eb",borderRadius:10,background:"#fff"}}>
                      <option value="">-- Select --</option>
                      {CATEGORIES.map(c=><option key={c.slug} value={c.slug}>{c.name}</option>)}
                    </select>
                  </div>
                )}
                {si.id==="updates"&&(
                  <div style={{marginBottom:14}}>
                    <label style={{fontSize:13,fontWeight:600,color:"#374151",display:"block",marginBottom:4}}>Category</label>
                    <select value={cat} onChange={e=>setCat(e.target.value)}
                      style={{width:"100%",padding:"12px 14px",fontSize:14,border:"2px solid #e5e7eb",borderRadius:10,background:"#fff"}}>
                      <option value="">-- Select --</option>
                      {CATEGORIES.map(c=><option key={c.slug} value={c.slug}>{c.name}</option>)}
                    </select>
                  </div>
                )}
                {fields.map((f,i)=>(
                  <div key={i} style={{marginBottom:14}}>
                    <label style={{fontSize:13,fontWeight:600,color:"#374151",display:"block",marginBottom:4}}>{f.label}</label>
                    {f.type==="textarea"?(
                      <textarea value={vals[i]} onChange={e=>{const n=[...vals];n[i]=e.target.value;setVals(n);}} rows={3}
                        placeholder={f.ph} style={{width:"100%",padding:"12px 14px",fontSize:14,border:"2px solid #e5e7eb",borderRadius:10,resize:"vertical"}} />
                    ):(
                      <input type={f.type} value={vals[i]} onChange={e=>{const n=[...vals];n[i]=e.target.value;setVals(n);}}
                        placeholder={f.ph} style={{width:"100%",padding:"12px 14px",fontSize:14,border:"2px solid #e5e7eb",borderRadius:10}} />
                    )}
                  </div>
                ))}
                <button onClick={handleAdd}
                  style={{width:"100%",padding:"14px",fontSize:15,fontWeight:700,background:sc,color:"#fff",border:"none",borderRadius:12,cursor:"pointer",marginTop:4}}>
                  ➕ {si.label} mein Add karo
                </button>
              </div>
            )}

            {mode==="delete"&&(
              <div style={{background:"#fff",borderRadius:14,padding:18,border:"1px solid #e5e7eb"}}>
                {!["updates","categories"].includes(si.id)&&(
                  <div style={{marginBottom:14}}>
                    <label style={{fontSize:13,fontWeight:600,color:"#374151",display:"block",marginBottom:4}}>Category</label>
                    <select value={cat} onChange={e=>{setCat(e.target.value);setItems([]);}}
                      style={{width:"100%",padding:"12px 14px",fontSize:14,border:"2px solid #e5e7eb",borderRadius:10,background:"#fff"}}>
                      <option value="">-- Select --</option>
                      {CATEGORIES.map(c=><option key={c.slug} value={c.slug}>{c.name}</option>)}
                    </select>
                  </div>
                )}
                <button onClick={loadItems} disabled={loading}
                  style={{width:"100%",padding:"12px",fontSize:14,fontWeight:700,background:"#374151",color:"#fff",border:"none",borderRadius:10,cursor:"pointer",marginBottom:12}}>
                  {loading?"Loading...":"📂 Items Load karo"}
                </button>
                {items.length>0&&(
                  <div style={{maxHeight:400,overflowY:"auto"}}>
                    {items.map(item=>(
                      <div key={item.id} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 0",borderBottom:"1px solid #f1f5f9"}}>
                        <span style={{flex:1,fontSize:13,color:"#374151"}}>{getName(item)}</span>
                        <button onClick={()=>deleteItem(item.id,getName(item))}
                          style={{padding:"8px 14px",fontSize:12,fontWeight:600,background:"#fee2e2",color:"#dc2626",border:"none",borderRadius:8,cursor:"pointer",whiteSpace:"nowrap"}}>
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {items.length===0&&!loading&&<p style={{fontSize:13,color:"#94a3b8",textAlign:"center",padding:20}}>Category chuno aur Load karo</p>}
              </div>
            )}

            <div style={{marginTop:14,padding:14,background:"#f0fdf4",borderRadius:10,fontSize:12,color:"#166534",lineHeight:1.7}}>
              💡 <strong>Tips:</strong> Pehle section chuno. Phir Add ya Delete mode me kaam karo. Har section ka apna form hai.
            </div>
          </div>
        </div>
      );
    }
    