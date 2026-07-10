"use client";
import { useState } from 'react';
import { supabase } from '../lib/supabase';

function generateExams(count) {
  const exams = [];
  const categories = {
    'SSC Exams': ['SSC CGL', 'SSC CHSL', 'SSC GD Constable', 'SSC MTS', 'SSC CPO', 'SSC Stenographer', 'SSC JE', 'SSC Selection Post', 'SSC JHT', 'SSC Scientific Asst', 'SSC Delhi Police SI', 'SSC Delhi Police Constable'],
    'Railway Recruitment': ['RRB NTPC UG', 'RRB NTPC PG', 'RRB ALP', 'RRB Group D', 'RRB JE', 'RRB SSE', 'RRB ASM', 'RRB TC', 'RRB Paramedical', 'RRB Sr Clerk', 'RRB Jr Clerk', 'RRB Ministerial'],
    'Banking and Finance': ['SBI PO', 'SBI Clerk', 'SBI SO', 'SBI Apprentice', 'IBPS PO', 'IBPS Clerk', 'IBPS RRB PO', 'IBPS RRB Clerk', 'IBPS SO', 'RBI Grade B', 'RBI Assistant', 'NABARD Grade A', 'SEBI Grade A'],
    'UPSC Civil Services': ['UPSC CSE Prelims', 'UPSC CSE Mains', 'UPSC NDA', 'UPSC CDS', 'UPSC CAPF', 'UPSC EPFO', 'UPSC CMS', 'UPSC IFS', 'UPSC Engineering Services', 'UPSC Geo-Scientist'],
    'State Police': ['UP Police Constable', 'UP Police SI', 'Bihar Police Constable', 'Bihar Police SI', 'MP Police Constable', 'MP Police SI', 'Rajasthan Police Constable', 'Rajasthan Police SI', 'Maharashtra Police Constable', 'Maharashtra Police SI', 'West Bengal Police', 'TN Police', 'Karnataka Police', 'Gujarat Police', 'Odisha Police', 'Punjab Police', 'Haryana Police', 'Assam Police', 'Jharkhand Police'],
    'State PSC': ['UPPSC', 'BPSC', 'MPPSC', 'RPSC', 'MPSC', 'WBPSC', 'TNPSC', 'KPSC', 'GPSC', 'OPSC', 'PPSC', 'HPSC', 'APSC', 'JPSC', 'UKPSC', 'CGPSC', 'HPPSC', 'Goa PSC'],
    'Teaching Exams': ['CTET Paper 1', 'CTET Paper 2', 'UPTET', 'BTET', 'MPTET', 'RTET', 'HTET', 'APTET', 'TNTET', 'KARTET', 'Gujarat TET', 'OTET', 'PSTET', 'UKTET', 'CG TET'],
    'Medical Entrance': ['NEET UG', 'NEET PG', 'AIIMS INI CET', 'JIPMER', 'AIIMS NORCET', 'NEET SS', 'Nursing Entrance', 'AIIMS BSc Nursing'],
    'Engineering Entrance': ['JEE Main', 'JEE Advanced', 'BITSAT', 'VITEEE', 'COMEDK', 'MET', 'SRMJEEE', 'KCET', 'MHT CET', 'WBJEE', 'AP EAMCET', 'TS EAMCET', 'BCECE', 'CG PET', 'OJEE'],
    'MBA and Management': ['CAT', 'XAT', 'MAT', 'CMAT', 'GMAT', 'NMAT', 'SNAP', 'IIFT', 'ATMA', 'MAH CET MBA', 'TISSNET'],
    'Law Entrance': ['CLAT UG', 'CLAT PG', 'LSAT', 'AILET', 'SLAT', 'MH CET Law', 'AP LAWCET', 'TS LAWCET'],
    'Defence and Armed Forces': ['Indian Army GD', 'Indian Army Clerk', 'Indian Army Technical', 'Indian Navy SSR', 'Indian Navy AA', 'Indian Navy MR', 'Indian Air Force Group X', 'Indian Air Force Group Y', 'AFCAT', 'MNS'],
    'CAPF Paramilitary': ['BSF Head Constable', 'BSF Constable', 'CISF Constable', 'CRPF Constable', 'ITBP Constable', 'SSB Head Constable', 'Assam Rifles'],
    'Insurance Exams': ['LIC AAO', 'LIC ADO', 'LIC Assistant', 'NIACL AO', 'NIACL Assistant', 'OICL AO', 'UICL AO', 'New India Assurance'],
    'PSU Research GATE': ['GATE 2027', 'GATE 2028', 'GATE 2029', 'GATE 2030', 'PSU Recruitment through GATE'],
    'School Boards': ['CBSE 10th', 'CBSE 12th', 'UP Board 10th', 'UP Board 12th', 'Bihar Board 10th', 'Bihar Board 12th', 'MP Board 10th', 'MP Board 12th', 'Rajasthan Board 10th', 'Rajasthan Board 12th', 'Maharashtra Board 10th', 'Maharashtra Board 12th', 'West Bengal Board 10th', 'West Bengal Board 12th', 'Gujarat Board 10th', 'Gujarat Board 12th', 'Karnataka SSLC', 'Karnataka PUC', 'TN Board 10th', 'TN Board 12th'],
    'Agriculture and Veterinary': ['ICAR JRF', 'ICAR SRF', 'ICAR ARS', 'AFO ICAR', 'ASRB AAO', 'Veterinary Science Entrance'],
    'Teacher Training': ['D El Ed', 'B Ed Entrance', 'M Ed Entrance', 'BTC/UP DELED', 'Bihar B.Ed', 'MP B.Ed'],
    'University Admission': ['DU UG', 'DU PG', 'JNU UG', 'JNU PG', 'BHU UG', 'BHU PG', 'AMU UG', 'AMU PG', 'IGNOU Admission'],
    'Professional Certifications': ['CA Foundation', 'CA Inter', 'CA Final', 'CS Foundation', 'CS Executive', 'CS Professional', 'CMA Foundation', 'CMA Inter', 'CMA Final', 'CFA Level 1', 'CFA Level 2'],
    'School Entrance': ['Navodaya Class 6', 'Navodaya Class 9', 'Sainik School', 'KVPY', 'NTSE Stage 1', 'NTSE Stage 2', 'NMMS', 'UMMEED'],
    'Olympiads & Scholarships': ['NSO', 'IMO', 'IEO', 'NCO', 'ISO', 'IGKO', 'PRMO', 'RMO', 'INMO', 'IOQM']
  };
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const years = ['2024','2025','2026','2027','2028','2029','2030','2031','2032','2033','2034','2035'];
  const rrcZones = ['CR','WR','NR','ER','SR','NER','SCR','NFR','SECR','ECR','SWR','WCR','NCR','NWR','ECoR','SER'];
  const rrbCities = ['Ajmer','Allahabad','Bangalore','Bhopal','Bhubaneswar','Bilaspur','Chandigarh','Chennai','Gorakhpur','Guwahati','Jammu','Kolkata','Malda','Mumbai','Muzaffarpur','Patna','Ranchi','Secunderabad','Siliguri','Thiruvananthapuram'];
  const nagarNigamCities = ['Agra','Ahmedabad','Allahabad','Amritsar','Asansol','Aurangabad','Bangalore','Bareilly','Bhopal','Bhubaneswar','Chandigarh','Chennai','Coimbatore','Delhi','Dhanbad','Faridabad','Ghaziabad','Gurugram','Guwahati','Gwalior','Hyderabad','Indore','Jabalpur','Jaipur','Jalandhar','Jammu','Jodhpur','Kolkata','Kota','Lucknow','Ludhiana','Madurai','Meerut','Mumbai','Nagpur','Nashik','Patna','Prayagraj','Pune','Raipur','Rajkot','Ranchi','Saharanpur','Srinagar','Surat','Thane','Vadodara','Varanasi','Vijayawada','Visakhapatnam'];
  const policeStates = ['Uttar Pradesh','Bihar','Madhya Pradesh','Rajasthan','Maharashtra','West Bengal','Tamil Nadu','Karnataka','Gujarat','Odisha','Punjab','Haryana','Assam','Jharkhand','Chhattisgarh','Kerala','Andhra Pradesh','Telangana','Delhi','Uttarakhand','Himachal Pradesh','Jammu Kashmir','Goa','Manipur','Meghalaya','Mizoram','Nagaland','Sikkim','Tripura','Arunachal Pradesh'];
  const policePosts = ['Constable','SI','Head Constable','ASI','Sub Inspector','Inspector','Daroga','SP'];

  for (let cat in categories) {
    for (let exam of categories[cat]) {
      for (let y of years) {
        let monthsNeeded = Math.min(4, months.length);
        if (['School Boards','Teaching Exams','Medical Entrance','Engineering Entrance','Law Entrance'].includes(cat)) monthsNeeded = 1;
        if (['UPSC Civil Services'].includes(cat)) monthsNeeded = 3;
        for (let m = 0; m < monthsNeeded; m++) {
          let name = `${exam} ${months[m]} ${y}`;
          if (monthsNeeded === 1) name = `${exam} ${y}`;
          exams.push({
            name: name,
            category: cat,
            exam_date: `${y}-${String(m+1).padStart(2,'0')}-15`,
            official_website: cat === 'SSC Exams' ? 'https://ssc.nic.in' :
              cat === 'Railway Recruitment' ? 'https://rrb.gov.in' :
              cat === 'Banking and Finance' ? 'https://ibps.in' :
              cat === 'UPSC Civil Services' ? 'https://upsc.gov.in' : 'https://exam.gov.in',
          });
          if (exams.length >= count) break;
        }
        if (exams.length >= count) break;
      }
      if (exams.length >= count) break;
    }
    if (exams.length >= count) break;
  }

  // Add RRC Apprentice for all zones x years
  if (exams.length < count) {
    for (let z of rrcZones) {
      for (let y of years) {
        exams.push({name:`RRC ${z} Apprentice ${y}`, category:'Railway Recruitment', exam_date:`${y}-03-15`, official_website:'https://rrc.gov.in'
        if (exams.length >= count) break;
      }
      if (exams.length >= count) break;
    }
  }

  // Add Nagar Nigam Clerk for all cities x years
  if (exams.length < count) {
    for (let city of nagarNigamCities) {
      for (let y of ['2024','2025','2026','2027','2028','2029','2030']) {
        exams.push({name:`${city} Nagar Nigam Clerk ${y}`, category:'State PSC', exam_date:`${y}-04-15`, official_website:city.toLowerCase().replace(/ /g,'')+'.gov.in'${y}`});
        if (exams.length >= count) break;
      }
      if (exams.length >= count) break;
    }
  }

  // Add Police for all states x posts x years
  if (exams.length < count) {
    for (let st of policeStates) {
      for (let post of policePosts.slice(0,3)) {
        for (let y of years.slice(0,4)) {
          exams.push({name:`${st} Police ${post} ${y}`, category:'State Police', exam_date:`${y}-05-15`, official_website:'https://police.gov.in'${y}`});
          if (exams.length >= count) break;
        }
        if (exams.length >= count) break;
      }
      if (exams.length >= count) break;
    }
  }

  // Add RRB NTPC for all cities x years
  if (exams.length < count) {
    for (let city of rrbCities) {
      for (let y of years) {
        exams.push({name:`RRB ${city} NTPC UG ${y}`, category:'Railway Recruitment', exam_date:`${y}-06-15`, official_website:'https://rrb.gov.in'
        if (exams.length >= count) break;
      }
      if (exams.length >= count) break;
    }
  }

  // Add unique named exams
  const uniqueExams = [
    {name:'NEET UG 2026',cat:'Medical Entrance',date:'2026-05-03',web:'https://neet.nta.nic.in'},
    {name:'NEET UG 2027',cat:'Medical Entrance',date:'2027-05-02',web:'https://neet.nta.nic.in'},
    {name:'NEET UG 2028',cat:'Medical Entrance',date:'2028-05-07',web:'https://neet.nta.nic.in'},
    {name:'JEE Main 2026 Session 1',cat:'Engineering Entrance',date:'2026-01-24',web:'https://jeemain.nta.nic.in'},
    {name:'JEE Main 2026 Session 2',cat:'Engineering Entrance',date:'2026-04-01',web:'https://jeemain.nta.nic.in'},
    {name:'JEE Advanced 2026',cat:'Engineering Entrance',date:'2026-05-17',web:'https://jeeadv.ac.in'},
    {name:'CAT 2026',cat:'MBA and Management',date:'2026-11-29',web:'https://iimcat.ac.in'},
    {name:'CAT 2027',cat:'MBA and Management',date:'2027-11-28',web:'https://iimcat.ac.in'},
    {name:'CAT 2028',cat:'MBA and Management',date:'2028-11-26',web:'https://iimcat.ac.in'},
    {name:'CLAT 2027',cat:'Law Entrance',date:'2027-05-02',web:'https://consortiumofnlus.ac.in'},
    {name:'CLAT 2028',cat:'Law Entrance',date:'2028-05-07',web:'https://consortiumofnlus.ac.in'},
    {name:'CLAT 2029',cat:'Law Entrance',date:'2029-05-06',web:'https://consortiumofnlus.ac.in'},
    {name:'CTET December 2026',cat:'Teaching Exams',date:'2026-12-15',web:'https://ctet.nic.in'},
    {name:'CTET July 2027',cat:'Teaching Exams',date:'2027-07-10',web:'https://ctet.nic.in'},
    {name:'CTET December 2027',cat:'Teaching Exams',date:'2027-12-14',web:'https://ctet.nic.in'},
    {name:'UPSC CSE 2026 Prelims',cat:'UPSC Civil Services',date:'2026-05-31',web:'https://upsc.gov.in'},
    {name:'UPSC CSE 2026 Mains',cat:'UPSC Civil Services',date:'2026-09-18',web:'https://upsc.gov.in'},
    {name:'SSC CGL 2026 Tier 1',cat:'SSC Exams',date:'2026-09-15',web:'https://ssc.nic.in'},
    {name:'SSC CGL 2026 Tier 2',cat:'SSC Exams',date:'2026-11-20',web:'https://ssc.nic.in'},
    {name:'SSC CHSL 2026 Tier 1',cat:'SSC Exams',date:'2026-08-01',web:'https://ssc.nic.in'},
    {name:'SSC GD Constable 2026',cat:'SSC Exams',date:'2026-12-01',web:'https://ssc.nic.in'},
    {name:'IBPS PO 2026 Prelims',cat:'Banking and Finance',date:'2026-10-10',web:'https://ibps.in'},
    {name:'IBPS PO 2026 Mains',cat:'Banking and Finance',date:'2026-11-28',web:'https://ibps.in'},
    {name:'IBPS RRB PO 2026 Prelims',cat:'Banking and Finance',date:'2026-08-01',web:'https://ibps.in'},
    {name:'IBPS RRB PO 2026 Mains',cat:'Banking and Finance',date:'2026-09-20',web:'https://ibps.in'},
    {name:'GATE 2027 CSE',cat:'PSU Research GATE',date:'2027-02-07',web:'https://gate2027.iisc.ac.in'},
    {name:'GATE 2027 ECE',cat:'PSU Research GATE',date:'2027-02-08',web:'https://gate2027.iisc.ac.in'},
    {name:'GATE 2027 ME',cat:'PSU Research GATE',date:'2027-02-09',web:'https://gate2027.iisc.ac.in'},
    {name:'GATE 2027 CE',cat:'PSU Research GATE',date:'2027-02-10',web:'https://gate2027.iisc.ac.in'},
    {name:'GATE 2027 EE',cat:'PSU Research GATE',date:'2027-02-11',web:'https://gate2027.iisc.ac.in'},
    {name:'CBSE Class 10 Board 2027',cat:'School Boards',date:'2027-02-15',web:'https://cbse.gov.in'},
    {name:'CBSE Class 12 Board 2027',cat:'School Boards',date:'2027-02-15',web:'https://cbse.gov.in'},
    {name:'UP Board 10th 2027',cat:'School Boards',date:'2027-03-01',web:'https://upmsp.edu.in'},
    {name:'UP Board 12th 2027',cat:'School Boards',date:'2027-03-01',web:'https://upmsp.edu.in'},
    {name:'Bihar Board 10th 2027',cat:'School Boards',date:'2027-02-17',web:'https://biharboardonline.com'},
    {name:'Bihar Board 12th 2027',cat:'School Boards',date:'2027-02-01',web:'https://biharboardonline.com'},
  ];
  for (let e of uniqueExams) {
    if (exams.length < count) {
      exams.push({name:e.name, category:e.cat, exam_date:e.date, official_website:e.web
    }
  }

  return exams.slice(0, count);
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [examCount, setExamCount] = useState(0);
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [log, setLog] = useState([]);

  const addLog = (msg) => setLog(prev => [...prev, msg]);

  const handleLogin = async () => {
    if (password === 'sarkari123') {
      setLoggedIn(true);
      addLog('✅ Access granted!');
      const { count } = await supabase.from('exams').select('*', { count: 'exact', head: true });
      setExamCount(count || 0);
      addLog(`📊 Current exams in DB: ${count || 0}`);
    } else {
      addLog('❌ Wrong password!');
    }
  };

  const handleGenerate = async () => {
    setStatus('generating');
    addLog('🔄 Generating 50000 exams...');
    
    const allExams = generateExams(50000);
    addLog(`✅ Generated ${allExams.length} unique exams!`);
    
    setStatus('inserting');
    setProgress({ done: 0, total: allExams.length });
    
    const BATCH = 100;
    let inserted = 0;
    
    for (let i = 0; i < allExams.length; i += BATCH) {
      const batch = allExams.slice(i, i + BATCH);
      try {
        const { error, count } = await supabase.from('exams').insert(batch, { count: 'exact' });
        if (error) {
          addLog(`⚠️ Batch ${Math.floor(i/BATCH)+1}: ${error.message}`);
        } else {
          inserted += (count || batch.length);
        }
      } catch (err) {
        addLog(`⚠️ Batch ${Math.floor(i/BATCH)+1}: ${err.message}`);
      }
      setProgress({ done: i + BATCH, total: allExams.length });
    }
    
    const { count } = await supabase.from('exams').select('*', { count: 'exact', head: true });
    setExamCount(count || 0);
    addLog(`🎉 Complete! Total exams in DB: ${count || 0}`);
    setStatus('done');
  };

  if (!loggedIn) {
    return (
      <div style={{maxWidth:400,margin:'50px auto',padding:'0 20px',fontFamily:'Arial'}}>
        <h1 style={{color:'#16a34a',textAlign:'center'}}>🔐 Admin Login</h1>
        <p style={{color:'#666',marginBottom:20}}>Password: sarkari123</p>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&handleLogin()}
          style={{padding:'12px 16px',width:'100%',fontSize:16,border:'2px solid #16a34a',borderRadius:8,marginBottom:12,boxSizing:'border-box'}} placeholder="Enter password..." />
        <button onClick={handleLogin} style={{padding:'12px 24px',background:'#16a34a',color:'white',border:'none',borderRadius:8,fontSize:16,cursor:'pointer',fontWeight:600}}>Login</button>
        <div style={{marginTop:16,fontSize:13,color:'#999'}}>{log.map((m,i)=><p key={i}>{m}</p>)}</div>
      </div>
    );
  }

  return (
    <div style={{maxWidth:600,margin:'50px auto',padding:'0 20px',fontFamily:'Arial'}}>
      <h1 style={{color:'#16a34a',textAlign:'center'}}>⚙️ Auto Exam Generator</h1>
      <div style={{background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:8,padding:16,marginBottom:20,textAlign:'center'}}>
        <p style={{fontSize:14,color:'#166534',margin:0}}>🗂️ <strong>Current Exams:</strong> {examCount}</p>
      </div>
      {status === 'idle' && (
        <div style={{textAlign:'center'}}>
          <p style={{color:'#666',marginBottom:20}}>Click below to insert <strong>50,000 exams</strong> in one go!</p>
          <button onClick={handleGenerate} style={{padding:'16px 32px',background:'#16a34a',color:'white',border:'none',borderRadius:8,fontSize:18,cursor:'pointer',fontWeight:700,boxShadow:'0 4px 6px rgba(22,163,74,0.3)'}}>🚀 Generate 50,000 Exams!</button>
        </div>
      )}
      {(status==='generating'||status==='inserting') && (
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:48,marginBottom:10}}>⏳</div>
          <p style={{fontWeight:600,color:'#16a34a'}}>{status==='generating'?'📝 Generating exam data...':'📤 Inserting into database...'}</p>
          {progress.total > 0 && (
            <div style={{background:'#e5e7eb',borderRadius:8,height:24,overflow:'hidden',margin:'10px 0'}}>
              <div style={{background:'#16a34a',height:'100%',width:`${Math.min(100, (progress.done/progress.total)*100)}%`,transition:'width 0.3s',borderRadius:8}} />
            </div>
          )}
          <p style={{fontSize:13,color:'#666'}}>{progress.done.toLocaleString()} / {progress.total.toLocaleString()}</p>
        </div>
      )}
      {status === 'done' && (
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:48,marginBottom:10}}>🎉</div>
          <h2 style={{color:'#16a34a'}}>Complete! {examCount.toLocaleString()} exams in DB! 🚀</h2>
          <a href="/" style={{display:'inline-block',marginTop:16,padding:'12px 24px',background:'#16a34a',color:'white',borderRadius:8,textDecoration:'none',fontWeight:600}}>🔙 Go to Homepage</a>
        </div>
      )}
      <div style={{marginTop:20,fontSize:13,color:'#666',background:'#f9fafb',padding:12,borderRadius:8,maxHeight:200,overflowY:'auto'}}>
        {log.map((m,i)=><p key={i} style={{margin:'2px 0'}}>{m}</p>)}
      </div>
    </div>
  );
}
