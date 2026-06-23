export default function Home() {
  return (
    <main style={{fontFamily:'Arial', maxWidth:'1200px', margin:'0 auto', padding:'20px'}}>
      <div style={{background:'#2E7D52', color:'white', padding:'30px', borderRadius:'10px', marginBottom:'20px', textAlign:'center'}}>
        <h1 style={{margin:0, fontSize:'32px'}}>🇮🇳 SarkariSetu India</h1>
        <p style={{margin:'10px 0 0'}}>India का सबसे बड़ा Exam Information Hub — 520+ Exams</p>
      </div>
      <div style={{background:'#FFF0DC', border:'1px solid #E47700', padding:'15px', borderRadius:'8px', marginBottom:'20px'}}>
        <marquee>🔴 LIVE: SSC CGL 2025 Result Out | NEET PG Admit Card | RRB NTPC Phase 2 Date Announced</marquee>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'16px', marginBottom:'20px'}}>
        <div style={{background:'white', border:'1px solid #ddd', borderRadius:'8px', padding:'16px'}}>
          <h3 style={{color:'#2E7D52', borderBottom:'2px solid #2E7D52', paddingBottom:'8px'}}>📋 Latest Results</h3>
          <p>• SSC CGL 2025 Final Result</p>
          <p>• NEET UG 2025 Result</p>
          <p>• UPSC CSE Prelims 2025</p>
          <p>• SBI PO 2025 Result</p>
        </div>
        <div style={{background:'white', border:'1px solid #ddd', borderRadius:'8px', padding:'16px'}}>
          <h3 style={{color:'#3E54CE', borderBottom:'2px solid #3E54CE', paddingBottom:'8px'}}>🪪 Admit Cards</h3>
          <p>• IBPS PO 2025</p>
          <p>• NEET PG 2025</p>
          <p>• RRB Group D</p>
          <p>• UPSC CDS II</p>
        </div>
        <div style={{background:'white', border:'1px solid #ddd', borderRadius:'8px', padding:'16px'}}>
          <h3 style={{color:'#E47700', borderBottom:'2px solid #E47700', paddingBottom:'8px'}}>📅 Upcoming Exams</h3>
          <p>• JEE Advanced — June 25</p>
          <p>• CLAT 2025 — July 1</p>
          <p>• UPSC CAPF — July 10</p>
          <p>• CAT 2025 — Nov 2025</p>
        </div>
      </div>
      <h2 style={{color:'#151515'}}>📂 Exam Categories</h2>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))', gap:'12px'}}>
        {[
          {icon:'⚙️', name:'Engineering', count:'33'},
          {icon:'🏥', name:'Medical', count:'31'},
          {icon:'🏛️', name:'UPSC/SSC', count:'21'},
          {icon:'🚂', name:'Railway', count:'12'},
          {icon:'🏦', name:'Banking', count:'25'},
          {icon:'🛡️', name:'Defence', count:'17'},
          {icon:'📚', name:'Teaching', count:'28'},
          {icon:'🏢', name:'State PSC', count:'29'},
          {icon:'⚖️', name:'Law', count:'15'},
          {icon:'💼', name:'MBA', count:'19'},
          {icon:'🌍', name:'International', count:'19'},
          {icon:'📜', name:'Certifications', count:'28'},
        ].map(cat => (
          <div key={cat.name} style={{background:'white', border:'1px solid #ddd', borderRadius:'8px', padding:'12px', textAlign:'center', cursor:'pointer'}}>
            <div style={{fontSize:'24px'}}>{cat.icon}</div>
            <div style={{fontWeight:'600', fontSize:'13px', margin:'4px 0'}}>{cat.name}</div>
            <div style={{fontSize:'11px', color:'#2E7D52'}}>{cat.count} exams</div>
          </div>
        ))}
      </div>
      <div style={{background:'#2E7D52', color:'white', padding:'20px', borderRadius:'10px', marginTop:'20px', textAlign:'center'}}>
        <p style={{margin:0}}>© 2025 SarkariSetu India | sarkarisetuindia.com</p>
      </div>
    </main>
  )
}

