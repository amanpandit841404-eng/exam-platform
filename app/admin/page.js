"use client";
import { useState } from 'react';
import { supabase } from '../lib/supabase';

function generateExams(count) {
  const exams = [];
  const cats = {};
  const categories = {
    'SSC Exams': ['SSC CGL', 'SSC CHSL', 'SSC GD Constable', 'SSC MTS', 'SSC CPO', 'SSC Stenographer', 'SSC JE', 'SSC Selection Post', 'SSC JHT', 'SSC Scientific Asst', 'SSC Delhi Police SI', 'SSC Delhi Police Constable'],
    'Railway Recruitment': ['RRB NTPC UG', 'RRB NTPC PG', 'RRB ALP', 'RRB Group D', 'RRB JE', 'RRB SSE', 'RRB ASM', 'RRB TC', 'RRB Paramedical', 'RRB Sr Clerk', 'RRB Jr Clerk', 'RRB Ministerial'],
    'Banking and Finance': ['SBI PO', 'SBI Clerk', 'SBI SO', 'SBI Apprentice', 'IBPS PO', 'IBPS Clerk', 'IBPS RRB PO', 'IBPS RRB Clerk', 'IBPS SO', 'RBI Grade B', 'RBI Assistant', 'NABARD Grade A', 'SEBI Grade A'],
    'UPSC Civil Services': ['UPSC CSE Prelims', 'UPSC CSE Mains', 'UPSC NDA', 'UPSC CDS', 'UPSC CAPF', 'UPSC EPFO', 'UPSC CMS', 'UPSC IFS', 'UPSC Engineering Services', 'UPSC Geo-Scientist'],
    'State Police': ['UP Police Constable', 'UP Police SI', 'Bihar Police Constable', 'Bihar Police SI', 'MP Police Constable', 'MP Police SI', 'Rajasthan Police Constable', 'Rajasthan Police SI', 'Maharashtra Police Constable', 'Maharashtra Police SI', 'West Bengal Police', 'TN Police', 'Karnataka Police', 'Gujarat Police', 'Odisha Police', 'Punjab Police', 'Haryana Police', 'Assam Police', 'Jharkhand Police'],
    'State PSC': ['UPPSC', 'BPSC', 'MPPSC', 'RPSC', 'MPSC', 'WBPSC', 'TNPSC', 'KPSC', 'GPSC', 'OPSC', 'PPSC', 'HPSC', 'APSC', 'JPSC', 'UKPSC', 'CGPSC', 'HPPSC', 'Goa PSC'],
    'Teaching Exams': ['CTET Paper 1', 'CTET Paper 2', 'UPTET', 'BTET', 'MPTET', 'RTET', 'HTET', 'APTET', 'TNTET', 'KARTET', 'Gujarat TET', 'OTET', 'PSTET', 'UKTET', 'CG TET'],
    'Medical Entrance': ['NEET UG', 'NEET PG', 'AIIMS INI CET', 'JIPMER', 'AIIMS NORCET', 'NEET SS', 'Nursing Entrance', 'AIIMS BSc Nursing'],
    'Engineering Entrance': ['JEE Main', 'JEE Advanced', 'BITSAT', 'VITEEE', 'MET', 'COMEDK', 'WBJEE', 'MHT CET', 'KCET', 'AP EAMCET', 'TS EAMCET', 'SRM JEE'],
    'Defence': ['Indian Army GD', 'Indian Army Technical', 'Indian Army Clerk', 'Indian Navy SSR', 'Indian Navy AA', 'Indian Navy MR', 'Indian Air Force Airmen', 'AFCAT', 'Territorial Army', 'Coast Guard'],
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Generate 50k+ exams
  const years = [2024, 2025, 2026, 2027, 2028, 2029, 2030];
  for (let y = 0; y < years.length; y++) {
    const yr = years[y];
    for (let c = 0; c < Object.keys(categories).length; c++) {
      const cat = Object.keys(categories)[c];
      const examList = categories[cat];
      let monthsNeeded = 12;
      if (['UPSC Civil Services'].includes(cat)) monthsNeeded = 3;
      for (let m = 0; m < monthsNeeded; m++) {
        for (let e = 0; e < examList.length; e++) {
          const exam = examList[e];
          let name = `${exam} ${months[m]} ${yr}`;
          if (monthsNeeded === 1) name = `${exam} ${yr}`;
          exams.push({
            name: name,
            category: cat,
          });
          if (exams.length >= count) break;
        }
        if (exams.length >= count) break;
      }
      if (exams.length >= count) break;
    }
    if (exams.length >= count) break;
  }
  return exams;
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [examCount, setExamCount] = useState(null);
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [log, setLog] = useState([]);

  function addLog(msg) {
    setLog(prev => [...prev, msg]);
  }

  async function handleLogin() {
    if (password === 'sarkari123') {
      setLoggedIn(true);
      addLog('Access granted!');
      const { count, error } = await supabase.from('exams').select('*', { count: 'exact', head: true });
      if (!error && count != null) setExamCount(count);
    } else {
      addLog('Wrong password!');
    }
  }

  async function handleGenerate() {
    setStatus('generating');
    addLog('Generating 50000 exams...');
    const allExams = generateExams(50000);
    addLog('Generated ' + allExams.length + ' unique exams!');

    setStatus('inserting');
    setProgress({ done: 0, total: allExams.length });

    const BATCH_SIZE = 50;
    let inserted = 0;
    for (let i = 0; i < allExams.length; i += BATCH_SIZE) {
      const batch = allExams.slice(i, i + BATCH_SIZE);
      try {
        const { error } = await supabase.from('exams').insert(batch, { onConflict: 'name', ignoreDuplicates: true });
        if (error) {
          addLog('Batch ' + (i / BATCH_SIZE + 1) + ' error: ' + error.message);
        }
      } catch (e) {
        addLog('Batch ' + (i / BATCH_SIZE + 1) + ' exception: ' + e.message);
      }
      inserted += batch.length;
      setProgress({ done: inserted, total: allExams.length });
    }

    const { count, error } = await supabase.from('exams').select('*', { count: 'exact', head: true });
    if (!error && count != null) setExamCount(count);
    setStatus('done');
    addLog('Complete! Final count: ' + (count || 'unknown') + ' exams! 🚀');
  }

  if (!loggedIn) {
    return (
      <div style={{ maxWidth: 400, margin: '100px auto', padding: '0 20px', fontFamily: 'Arial', textAlign: 'center' }}>
        <h1 style={{ color: '#16a34a' }}>🔐 Admin Login</h1>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          style={{ padding: '12px 16px', width: '100%', fontSize: 16, border: '2px solid #16a34a', borderRadius: 8, marginBottom: 12, boxSizing: 'border-box' }} placeholder="Enter password..." />
        <button onClick={handleLogin} style={{ padding: '12px 24px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 8, fontSize: 16, cursor: 'pointer', fontWeight: 600 }}>Login</button>
        <div style={{ marginTop: 16, fontSize: 13, color: '#999' }}>{log.map((m, i) => <p key={i}>{m}</p>)}</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '50px auto', padding: '0 20px', fontFamily: 'Arial' }}>
      <h1 style={{ color: '#16a34a', textAlign: 'center' }}>⚙️ Auto Exam Generator</h1>
      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: 16, marginBottom: 20, textAlign: 'center' }}>
        <p style={{ fontSize: 14, color: '#166534', margin: 0 }}>🗂️ <strong>Current Exams:</strong> {examCount}</p>
      </div>
      {status === 'idle' && (
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#666', marginBottom: 20 }}>Click below to insert <strong>50,000 exams</strong> in one go!</p>
          <button onClick={handleGenerate} style={{ padding: '16px 32px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 8, fontSize: 18, cursor: 'pointer', fontWeight: 700, boxShadow: '0 4px 6px rgba(22,163,74,0.3)' }}>🚀 Generate 50,000 Exams!</button>
        </div>
      )}
      {(status === 'generating' || status === 'inserting') && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>⏳</div>
          <p style={{ fontWeight: 600, color: '#16a34a' }}>{status === 'generating' ? '📝 Generating exam data...' : '📤 Inserting into database...'}</p>
          {progress.total > 0 && (
            <div style={{ background: '#e5e7eb', borderRadius: 8, height: 24, overflow: 'hidden', margin: '10px 0' }}>
              <div style={{ background: '#16a34a', height: '100%', width: `${Math.min(100, (progress.done / progress.total) * 100)}%`, transition: 'width 0.3s', borderRadius: 8 }} />
            </div>
          )}
          <p style={{ fontSize: 13, color: '#666' }}>{progress.done.toLocaleString()} / {progress.total.toLocaleString()}</p>
        </div>
      )}
      {status === 'done' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>🎉</div>
          <h2 style={{ color: '#16a34a' }}>Complete! {examCount.toLocaleString()} exams in DB! 🚀</h2>
          <a href="/" style={{ display: 'inline-block', marginTop: 16, padding: '12px 24px', background: '#16a34a', color: 'white', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>🔙 Go to Homepage</a>
        </div>
      )}
      <div style={{ marginTop: 20, fontSize: 13, color: '#666', background: '#f9fafb', padding: 12, borderRadius: 8, maxHeight: 200, overflowY: 'auto' }}>
        {log.map((m, i) => <p key={i} style={{ margin: '2px 0' }}>{m}</p>)}
      </div>
    </div>
  );
}
