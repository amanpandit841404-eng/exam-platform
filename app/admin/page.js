"use client";

import { useState } from 'react';
import { supabase } from '../lib/supabase';

function generateAllExams() {
  const exams = [];
  const years = ["2024", "2025", "2026", "2027", "2028"];

  const sscNames = ["SSC CGL","SSC CHSL","SSC GD","SSC MTS","SSC CPO","SSC Stenographer","SSC JE","SSC Selection Post","SSC JHT","SSC Scientific Asst","SSC Delhi Police SI","SSC Delhi Police Const","SSC Phase 12","SSC Phase 13"];
  for (const e of sscNames) for (const y of years) exams.push({name:`${e} ${y}`,full_name:`${e} ${y}`,category:"ssc",official_website:"https://ssc.nic.in"});

  const bankNames = ["SBI PO","SBI Clerk","SBI SO","SBI Apprentice","IBPS PO","IBPS Clerk","IBPS RRB PO","IBPS RRB Clerk","IBPS SO","IBPS AFO","RBI Grade B","RBI Assistant","RBI DEPR","NABARD Grade A","NABARD Grade B","SEBI Grade A","SEBI Grade B","Cooperative Bank PO","Cooperative Bank Clerk","Regional Rural Bank PO","Regional Rural Bank Clerk","Bank of India PO","Bank of India Clerk","Canara Bank PO","Canara Bank Clerk","PNB PO","PNB Clerk"];
  for (const e of bankNames) for (const y of years) exams.push({name:`${e} ${y}`,full_name:`${e} ${y}`,category:"banking",official_website:"https://ibps.in"});

  const railNames = ["RRB NTPC UG","RRB NTPC PG","RRB ALP","RRB Group D","RRB JE","RRB SSE","RRB ASM","RRB TC","RRB Paramedical","RRB Sr Clerk","RRB Jr Clerk","RRB Ministerial","Railway Metro JE"];
  for (const e of railNames) for (const y of years) exams.push({name:`${e} ${y}`,full_name:`${e} ${y}`,category:"railway",official_website:"https://rrb.gov.in"});
  const rrcZones = ["CR","WR","NR","ER","SR","NER","SCR","NFR","SECR","ECR","SWR","WCR","NCR","NWR","ECoR","SER"];
  for (const z of rrcZones) for (const y of years) exams.push({name:`RRC ${z} Apprentice ${y}`,full_name:`RRC ${z} Apprentice ${y}`,category:"railway",official_website:"https://rrc.gov.in"});

  const upscNames = ["UPSC CSE Prelims","UPSC CSE Mains","UPSC NDA I","UPSC NDA II","UPSC CDS I","UPSC CDS II","UPSC EPFO","UPSC CAPF","UPSC IES","UPSC ISS","UPSC CMS","UPSC Geo Scientist","UPSC CGS","UPSC SCRA","UPSC IFS"];
  for (const e of upscNames) for (const y of years) exams.push({name:`${e} ${y}`,full_name:`${e} ${y}`,category:"upsc",official_website:"https://upsc.gov.in"});

  const pscStates = ["UPPSC","BPSC","MPPSC","RPSC","UKPSC","HPSC","PPSC","JPSC","GPSC","OPSC","CGPSC","HPPSC","APPSC","TSPSC","MPSC","WBPSC","JKPSC","Goa PSC","APSC","Kerala PSC","TNSPSC","KSPSC","Chhattisgarh PSC","Jharkhand PSC","Uttarakhand PSC","Himachal PSC","Manipur PSC","Tripura PSC","Meghalaya PSC","Mizoram PSC","Nagaland PSC","Sikkim PSC","Arunachal PSC","Punjab PSC"];
  const pscPosts = ["PCS","AE","Civil","Combined","Prelims"];
  for (const s of pscStates) for (const p of pscPosts) for (const y of years) exams.push({name:`${s} ${p} ${y}`,full_name:`${s} ${p} ${y}`,category:"state-psc",official_website:"https://psc.gov.in"});

  const policeStates = ["UP","Bihar","MP","Rajasthan","Maharashtra","Gujarat","Karnataka","TN","WB","AP","TS","Kerala","Punjab","Haryana","Delhi","Jharkhand","Odisha","Assam","UK","HP","J&K","Goa","Chhattisgarh","Manipur","Nagaland","Mizoram","Tripura","Meghalaya","Sikkim","Arunachal"];
  const policePosts = ["Police Constable","Police SI","ASI"];
  for (const s of policeStates) for (const p of policePosts) for (const y of years) exams.push({name:`${s} ${p} ${y}`,full_name:`${s} ${p} ${y}`,category:"police",official_website:"https://police.gov.in"});

  const medicalNames = ["NEET UG","NEET PG","NEET SS","AIIMS PG","AIIMS Nursing","JIPMER PG","FMGE","Nursing Officer","NORCET","GPAT","NIPER MSc","NIPER PhD","AIAPGET","ESIC MO","ESIC SR","ICMR JRF"];
  for (const e of medicalNames) for (const y of years) exams.push({name:`${e} ${y}`,full_name:`${e} ${y}`,category:e.includes("Nursing")||e.includes("GPAT")||e.includes("NIPER")?"pharmacy-nursing":"medical",official_website:"https://nbe.edu.in"});

  const enggNames = ["JEE Main","JEE Advanced","GATE","BITSAT","NATA","COMEDK","MHT CET","KCET","WBJEE","AP EAMCET","TS EAMCET","BCECE","CG PET","OJEE","UPSEE","IPU CET B.Tech","JCECE","TNEA","CUET Engg"];
  for (const e of enggNames) for (const y of years) exams.push({name:`${e} ${y}`,full_name:`${e} ${y}`,category:["COMEDK","MHT CET","KCET","WBJEE","AP EAMCET","TS EAMCET","BCECE","CG PET","OJEE","UPSEE","IPU CET B.Tech","JCECE","TNEA"].includes(e)?"engineering-state":"engineering-national",official_website:"https://nta.nic.in"});

  const teachingNames = ["CTET","UPTET","DSSSB TGT","DSSSB PGT","KVS PRT","KVS TGT","KVS PGT","NVS PRT","NVS TGT","NVS PGT","HTET","BTET","MPTET","REET","APTET","MAHA TET","OTET","CGTET","Gujarat TET","UKTET","DSSSB Librarian","DSSSB Music Teacher","DSSSB Special Edu","RPSC Sr Teacher"];
  for (const e of teachingNames) for (const y of years) exams.push({name:`${e} ${y}`,full_name:`${e} ${y}`,category:"teaching",official_website:"https://tet.nic.in"});

  const defNames = ["Indian Army GD","Indian Army Clerk","Indian Army Tradesman","Indian Army NA","Indian Army NCC","Indian Army TES","Indian Navy SSR","Indian Navy AA","Indian Navy MR","Indian Navy SSC","IAF Airmen GD","IAF Airmen Tech","IAF AFCAT"];
  for (const e of defNames) for (const y of years) exams.push({name:`${e} ${y}`,full_name:`${e} ${y}`,category:"defense",official_website:"https://joinindianarmy.nic.in"});

  const capfNames = ["CISF HC","CISF Constable","CRPF HC","CRPF Constable","BSF HC","BSF Constable","ITBP HC","ITBP Constable","SSB SI","SSB ASI","Assam Rifles GD","Assam Rifles SI","IB Security Asst"];
  for (const e of capfNames) for (const y of years) exams.push({name:`${e} ${y}`,full_name:`${e} ${y}`,category:"capf-paramilitary",official_website:"https://mha.gov.in"});

  const mbaNames = ["CAT","XAT","SNAP","NMAT","CMAT","MAT","ATMA","MAH MBA CET","TISSNET","IIFT"];
  for (const e of mbaNames) for (const y of years) exams.push({name:`${e} ${y}`,full_name:`${e} ${y}`,category:"mba-management",official_website:"https://iimcat.ac.in"});

  const iimList = ["Ahmedabad","Bangalore","Calcutta","Lucknow","Kozhikode","Indore","Rohtak","Ranchi","Raipur","Udaipur","Nagpur","Amritsar","Bodh Gaya","Sambalpur","Sirmaur","Jammu","Kashipur","Visakhapatnam"];
  for (const i of iimList) for (const y of years) { exams.push({name:`IIM ${i} PGP ${y}`,full_name:`IIM ${i} PGP ${y}`,category:"mba-management",official_website:"https://iim.ac.in"}); exams.push({name:`IIM ${i} IPM ${y}`,full_name:`IIM ${i} IPM ${y}`,category:"mba-management",official_website:"https://iim.ac.in"}); }

  const insNames = ["LIC ADO","LIC AAO","LIC Assistant","NIACL AO","NIACL Assistant","OICL AO","OICL Assistant","United India AO","United India Assistant","ICICI Prudential AM","HDFC Life AM","SBI Life AM","IRDAI Assistant","IRDAI AO"];
  for (const e of insNames) for (const y of years) exams.push({name:`${e} ${y}`,full_name:`${e} ${y}`,category:"insurance",official_website:"https://licindia.in"});

  const psuNames = [["ONGC Chemist","https://ongcindia.com"],["ONGC Geologist","https://ongcindia.com"],["ONGC Exec","https://ongcindia.com"],["IOCL Engg","https://iocl.com"],["IOCL Apprentice","https://iocl.com"],["HPCL Apprentice","https://hindustanpetroleum.com"],["BPCL Apprentice","https://bharatpetroleum.in"],["GAIL Apprentice","https://gailonline.com"],["GAIL Chemist","https://gailonline.com"],["NTPC Diploma","https://ntpc.co.in"],["NTPC Exec","https://ntpc.co.in"],["SAIL MT","https://sail.co.in"],["SAIL Apprentice","https://sail.co.in"],["BEL Engg","https://bel-india.in"],["BEL Apprentice","https://bel-india.in"],["HAL MT","https://hal-india.co.in"],["HAL Apprentice","https://hal-india.co.in"],["BHEL Supervisor","https://bhel.com"],["BHEL Apprentice","https://bhel.com"],["AAI JE","https://aai.aero"],["AAI Sr Asst","https://aai.aero"],["NHAI Manager","https://nhai.gov.in"],["NHAI AE","https://nhai.gov.in"],["PGCIL Diploma","https://powergrid.in"],["PGCIL Exec","https://powergrid.in"],["NHPC JE","https://nhpcindia.com"],["NHPC AE","https://nhpcindia.com"],["SJVN JE","https://sjvn.nic.in"],["NLC MT","https://nlcindia.in"],["THDC JE","https://thdc.co.in"],["MSTC MT","https://mstcindia.co.in"],["RINL MT","https://rinl.co.in"],["ECIL Scientist","https://ecil.co.in"],["BEML MT","https://bemlindia.in"],["NFL AE","https://nfl.co.in"],["NFL MT","https://nfl.co.in"],["DRDO JRF","https://drdo.gov.in"],["DRDO RA","https://drdo.gov.in"],["ISRO JRF","https://isro.gov.in"],["ISRO Scientist","https://isro.gov.in"],["BARC Stipendiary","https://barc.gov.in"],["NTA UGC NET","https://ugcnet.nta.nic.in"],["NTA CSIR NET","https://csirnet.nta.nic.in"],["FCI AGM","https://fci.gov.in"],["FCI JE","https://fci.gov.in"],["FCI Manager","https://fci.gov.in"],["FCI Steno","https://fci.gov.in"],["FCI Accountant","https://fci.gov.in"]];
  for (const [n,s] of psuNames) for (const y of years) exams.push({name:`${n} ${y}`,full_name:`${n} ${y}`,category:"psu-research",official_website:s});

  const schoolNames = ["JNVST Class 6","JNVST Class 9","AISSEE Class 6","AISSEE Class 9","RIMC Dehradun","AMU City School","NTSE Stage 1","NTSE Stage 2","NMMS","KVPY SA","KVPY SB","KVPY SX","SOF IMO","SOF NSO","SOF IEO","SOF IGKO","SilverZone IOM","SilverZone IOS","SilverZone IOEL","Hummingbird Olympiad","Unified Council","EduHeal Olympiad","NSTSE"];
  for (const e of schoolNames) for (const y of years) exams.push({name:`${e} ${y}`,full_name:`${e} ${y}`,category:e.includes("JNVST")||e.includes("AISSEE")||e.includes("RIMC")||e.includes("AMU City")?"school-entrance":"school-olympiads",official_website:"https://navodaya.gov.in"});

  const lawNames = ["CLAT UG","CLAT PG","AILET","SLAT","MH CET Law","AP LAWCET","TS LAWCET","DU LLB","DU LLM","BHU LLB","KU LLB"];
  for (const e of lawNames) for (const y of years) exams.push({name:`${e} ${y}`,full_name:`${e} ${y}`,category:"law",official_website:"https://consortiumofnlus.ac.in"});

  const courtNames = [["Supreme Court Jr Asst","https://sci.gov.in"],["Supreme Court Steno","https://sci.gov.in"],["Delhi Court Clerk","https://delhidistrictcourts.nic.in"],["Delhi Court Steno","https://delhidistrictcourts.nic.in"],["Bombay Court Clerk","https://bombayhighcourt.nic.in"],["Allahabad Court Clerk","https://allahabadhighcourt.in"],["Rajasthan Court Clerk","https://hcraj.nic.in"],["Madras Court Clerk","https://madrashighcourt.in"],["Kolkata Court Clerk","https://calcuttahighcourt.gov.in"]];
  for (const [n,s] of courtNames) for (const y of years) exams.push({name:`${n} ${y}`,full_name:`${n} ${y}`,category:"court",official_website:s});

  const forestNames = ["Forest Ranger","Forest Guard","Forest Supervisor","Forest Officer","UPSC IFoS","UP Forest Guard","MP Forest Guard","MH Forest Guard","Environment Engineer","Wildlife Warden"];
  for (const e of forestNames) for (const y of years) exams.push({name:`${e} ${y}`,full_name:`${e} ${y}`,category:"forest-environment",official_website:"https://forest.gov.in"});

  const uniNames = ["DU UG","DU PG","JNU UG","JNU PG","BHU UG","BHU PG","AMU UG","AMU PG","JMI UG","JMI PG","CUET UG","CUET PG","Symbiosis UG","Symbiosis PG","Christ UG","Christ PG","Ashoka UG","IISER UG","IISER PhD","IISc UG","IISc PhD","NID DAT","NIFT","CEED","UCEED","FTII","IIT Bombay UG","IIT Delhi UG","IIT Madras UG","IIT Kanpur UG","IIT Kharagpur UG","IIT Roorkee UG","IIT Guwahati UG","IIT Hyderabad UG"];
  for (const e of uniNames) for (const y of years) exams.push({name:`${e} ${y}`,full_name:`${e} ${y}`,category:"miscellaneous",official_website:"https://ugc.ac.in"});

  const postalNames = ["India Post GDS","India Post PA","India Post MTS","India Post Postman","India Post Mail Guard","IPPB Supervisor","IPPB Executive"];
  for (const e of postalNames) for (const y of years) exams.push({name:`${e} ${y}`,full_name:`${e} ${y}`,category:"postal",official_website:"https://indiapost.gov.in"});

  const sportsNames = ["Sports Officer","Sports Coach","SAI Coach","NIS Coach","State Sports Officer"];
  for (const e of sportsNames) for (const y of years) exams.push({name:`${e} ${y}`,full_name:`${e} ${y}`,category:"sports",official_website:"https://sportsauthority.gov.in"});

  const tpNames = ["Town Planner","Town Planning JE","Town Planning Asst"];
  for (const e of tpNames) for (const y of years) exams.push({name:`${e} ${y}`,full_name:`${e} ${y}`,category:"town-planning",official_website:"https://townplanning.gov.in"});

  const agriNames = ["ICAR PG","ICAR PhD","ICAR JRF","ICAR ASRB","ICAR STO","BHU Agriculture","GB Pant Agri","Veterinary Officer","Animal Husbandry","Agriculture Officer"];
  for (const e of agriNames) for (const y of years) exams.push({name:`${e} ${y}`,full_name:`${e} ${y}`,category:"agriculture-veterinary",official_website:"https://icar.org.in"});

  const ecNames = ["EC Office Assistant","EC Clerk","EC Supervisor"];
  for (const e of ecNames) for (const y of years) exams.push({name:`${e} ${y}`,full_name:`${e} ${y}`,category:"election-commission",official_website:"https://eci.gov.in"});

  const miscNames = ["CA Foundation","CA Inter","CA Final","CS Foundation","CS Executive","CS Professional","CMA Foundation","CMA Inter","CMA Final","CSEET","NIELIT CCC","NIELIT O Level","NIELIT A Level","Hotel Management NCHMCT","NITI Aayog Intern","PFRDA Asst","ISI Exam"];
  for (const e of miscNames) for (const y of years) exams.push({name:`${e} ${y}`,full_name:`${e} ${y}`,category:"miscellaneous",official_website:"https://exam.gov.in"});

  const seen = new Set();
  return exams.filter(e => { if (seen.has(e.name)) return false; seen.add(e.name); return true; });
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [log, setLog] = useState([]);
  const [examCount, setExamCount] = useState(0);

  function addLog(msg) { setLog(p => [...p, msg]); }

  async function handleLogin() {
    if (password === "sarkari123") {
      setAuthed(true);
      addLog("✅ Access granted!");
      const { count } = await supabase.from("exams").select("*", { count: "exact", head: true });
      setExamCount(count || 0);
      addLog(`📊 Current exams in DB: ${count || 0}`);
    } else {
      addLog("❌ Wrong password!");
    }
  }

  async function handleGenerate() {
    setStatus("generating");
    addLog("🔄 Generating exam data...");
    const allExams = generateAllExams();
    addLog(`✅ Generated ${allExams.length} unique exams!`);
    addLog("🔄 Inserting in batches of 500...");
    setStatus("inserting");
    setProgress({ done: 0, total: allExams.length });
    let inserted = 0;
    const BATCH = 500;
    for (let i = 0; i < allExams.length; i += BATCH) {
      const batch = allExams.slice(i, i + BATCH);
      const { error } = await supabase.from("exams").upsert(batch, { onConflict: "name", ignoreDuplicates: true });
      if (error) { addLog(`❌ ${error.message}`); continue; }
      inserted += batch.length;
      setProgress({ done: inserted, total: allExams.length });
      addLog(`✅ ${inserted}/${allExams.length}`);
      await new Promise(r => setTimeout(r, 100));
    }
    const { count } = await supabase.from("exams").select("*", { count: "exact", head: true });
    setExamCount(count || 0);
    addLog(`🎉 Total exams: ${count || 0}`);
    setStatus("done");
  }

  if (!authed) {
    return (
      <div style={{maxWidth:400,margin:"100px auto",textAlign:"center",fontFamily:"Arial"}}>
        <h1 style={{color:"#16a34a"}}>🔐 Admin Panel</h1>
        <p style={{color:"#666",marginBottom:20}}>Password: sarkari123</p>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key==="Enter"&&handleLogin()} style={{padding:"12px 16px",width:"100%",fontSize:16,border:"2px solid #16a34a",borderRadius:8,marginBottom:12,boxSizing:"border-box"}} placeholder="Enter password..." />
        <button onClick={handleLogin} style={{padding:"12px 24px",background:"#16a34a",color:"white",border:"none",borderRadius:8,fontSize:16,cursor:"pointer",fontWeight:600}}>Login</button>
        <div style={{marginTop:16,fontSize:13,color:"#999"}}>{log.map((m,i)=><p key={i}>{m}</p>)}</div>
      </div>
    );
  }

  return (
    <div style={{maxWidth:600,margin:"50px auto",padding:"0 20px",fontFamily:"Arial"}}>
      <h1 style={{color:"#16a34a",textAlign:"center"}}>⚙️ Exam Generator</h1>
      <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,padding:16,marginBottom:20,textAlign:"center"}}>
        <p style={{fontSize:14,color:"#166534",margin:0}}>🗂️ <strong>Current Exams:</strong> {examCount}</p>
      </div>
      {status==="idle" && (
        <div style={{textAlign:"center"}}>
          <p style={{color:"#666",marginBottom:20}}>Click below to insert <strong>5000+ exams</strong> in one go!</p>
          <button onClick={handleGenerate} style={{padding:"16px 32px",background:"#16a34a",color:"white",border:"none",borderRadius:8,fontSize:18,cursor:"pointer",fontWeight:700,boxShadow:"0 4px 6px rgba(22,163,74,0.3)"}}>🚀 Generate 5000+ Exams</button>
        </div>
      )}
      {(status==="generating"||status==="inserting") && (
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:48,marginBottom:10}}>⏳</div>
          <p style={{fontWeight:600,color:"#16a34a"}}>{status==="generating"?"Generating...":"Inserting..."}</p>
          {progress.total>0 && (
            <div style={{background:"#e5e7eb",borderRadius:8,height:24,overflow:"hidden",margin:"10px 0"}}>
              <div style={{background:"#16a34a",height:"100%",width:`${(progress.done/progress.total)*100}%`,transition:"width 0.3s",borderRadius:8}} />
            </div>
          )}
          <p style={{fontSize:13,color:"#666"}}>{progress.done}/{progress.total}</p>
        </div>
      )}
      {status==="done" && (
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:48,marginBottom:10}}>🎉</div>
          <h2 style={{color:"#16a34a"}}>Complete! {examCount} exams in DB 🚀</h2>
          <a href="/" style={{display:"inline-block",marginTop:16,padding:"12px 24px",background:"#16a34a",color:"white",borderRadius:8,textDecoration:"none",fontWeight:600}}>🔙 Homepage</a>
        </div>
      )}
      <div style={{marginTop:20,fontSize:13,color:"#666",background:"#f9fafb",padding:12,borderRadius:8,maxHeight:200,overflowY:"auto"}}>
        {log.map((m,i)=><p key={i} style={{margin:"2px 0"}}>{m}</p>)}
      </div>
    </div>
  );
}
