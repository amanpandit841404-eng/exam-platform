"use client";

    import { useEffect, useState } from 'react';
    import { supabase } from './lib/supabase';

    export default function Home() {
      const [categories, setCategories] = useState([]);
      const [latestResults, setLatestResults] = useState([]);
      const [admitCards, setAdmitCards] = useState([]);
      const [upcomingExams, setUpcomingExams] = useState([]);
      const [latestUpdates, setLatestUpdates] = useState([]);
      const [totalExams, setTotalExams] = useState(52472);
      const [totalResults, setTotalResults] = useState(0);
      const [totalAdmits, setTotalAdmits] = useState(0);
      const [searchQuery, setSearchQuery] = useState('');
      const [darkMode, setDarkMode] = useState(false);

      useEffect(() => {
        document.title = 'SarkariSetu India - Sarkari Result, Admit Card, Syllabus 2026';
        async function fetchData() {
          try {
            const [catRes, resultsRes, admitRes, upcomingRes, updatesRes, countRes, rCountRes, aCountRes] = await Promise.all([
              supabase.from('categories').select('*').order('name'),
              supabase.from('results').select('*').order('created_at', { ascending: false }).limit(10),
              supabase.from('admit_cards').select('*').order('created_at', { ascending: false }).limit(10),
              supabase.from('upcoming_exams').select('*').order('exam_date', { ascending: true }).limit(20),
              supabase.from('updates').select('*').order('created_at', { ascending: false }).limit(6),
              supabase.from('exams').select('*', { count: 'exact', head: true }),
              supabase.from('results').select('*', { count: 'exact', head: true }),
              supabase.from('admit_cards').select('*', { count: 'exact', head: true }),
            ]);
            if (catRes.data) setCategories(catRes.data);
            if (resultsRes.data) setLatestResults(resultsRes.data);
            if (admitRes.data) setAdmitCards(admitRes.data);
            if (updatesRes.data) setLatestUpdates(updatesRes.data);
            if (upcomingRes.data) {
              const seen = new Set();
              const unique = upcomingRes.data.filter(item => {
                const key = item.exam_name.toLowerCase().trim();
                if (seen.has(key)) return false;
                seen.add(key); return true;
              });
              setUpcomingExams(unique.slice(0, 10));
            }
            if (countRes.count) setTotalExams(countRes.count);
            if (rCountRes.count) setTotalResults(rCountRes.count);
            if (aCountRes.count) setTotalAdmits(aCountRes.count);
          } catch (err) { console.error(err); }
        }
        fetchData();
      }, []);

      const bg = darkMode ? '#0f172a' : '#f1f5f9';
      const cardBg = darkMode ? '#1e293b' : '#ffffff';
      const textMain = darkMode ? '#f1f5f9' : '#1e3a5f';
      const textSub = darkMode ? '#94a3b8' : '#6b7280';
      const border = darkMode ? '#334155' : '#e5e7eb';

      const catIcons = { 'SSC': '📋', 'UPSC': '🏛️', 'Banking': '🏦', 'Railway': '🚂', 'Engineering': '⚙️', 'Medical': '🏥', 'Defence': '🎖️', 'Teaching': '📚', 'State': '🗺️', 'Police': '👮' };
      function getCatIcon(name) {
        for (const [k, v] of Object.entries(catIcons)) { if (name?.toLowerCase().includes(k.toLowerCase())) return v; }
        return '📁';
      }

      const typeConfig = {
        result: { icon: '🏆', bg: '#dcfce7', color: '#16a34a', label: 'Result' },
        admit_card: { icon: '📄', bg: '#ede9fe', color: '#7c3aed', label: 'Admit Card' },
        answer_key: { icon: '🔑', bg: '#fef9c3', color: '#ca8a04', label: 'Answer Key' },
        syllabus: { icon: '📚', bg: '#dbeafe', color: '#2563eb', label: 'Syllabus' },
        general: { icon: '📢', bg: '#f3f4f6', color: '#6b7280', label: 'Update' },
      };

      return (
        <div style={{ minHeight: '100vh', background: bg, fontFamily: "'Segoe UI', Arial, sans-serif", color: textMain, transition: 'all 0.3s' }}>

          {/* TOP BAR */}
          <div style={{ background: '#1e3a5f', color: '#fff', fontSize: 11, padding: '4px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
            <span>📅 {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <div style={{ display: 'flex', gap: 12 }}>
              <a href="/notifications" style={{ color: '#93c5fd', textDecoration: 'none' }}>📢 Latest Updates</a>
              <a href="/answer-keys" style={{ color: '#93c5fd', textDecoration: 'none' }}>🔑 Answer Keys</a>
            </div>
          </div>

          {/* HEADER */}
          <header style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%)', color: '#fff', padding: '12px 16px 0' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>🏛️ SarkariSetu <span style={{ color: '#fbbf24' }}>India</span></h1>
                  <p style={{ margin: 0, fontSize: 11, opacity: 0.8 }}>Sarkari Result | Admit Card | Syllabus | Notification</p>
                </div>
                <button onClick={() => setDarkMode(!darkMode)}
                  style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 16 }}>
                  {darkMode ? '☀️' : '🌙'}
                </button>
              </div>

              {/* Search */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && searchQuery.trim() && (window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`)}
                  placeholder="🔍 SSC CGL, UPSC, NEET, JEE, IBPS, Railway..."
                  style={{ flex: 1, padding: '11px 16px', borderRadius: 10, border: 'none', fontSize: 14, outline: 'none', color: '#1e3a5f' }} />
                <button onClick={() => searchQuery.trim() && (window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`)}
                  style={{ padding: '11px 20px', background: '#fbbf24', color: '#1e3a5f', borderRadius: 10, border: 'none', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
                  Search
                </button>
              </div>

              {/* Nav */}
              <nav style={{ display: 'flex', gap: 2, overflowX: 'auto' }}>
                {[['/', '🏠 Home'], ['/results', '🏆 Results'], ['/admit-cards', '📄 Admit Card'], ['/syllabus', '📚 Syllabus'], ['/answer-keys', '🔑 Answer Key'], ['/notifications', '📢 Notifications']].map(([href, label]) => (
                  <a key={href} href={href} style={{ padding: '8px 14px', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: 12, fontWeight: 600, borderRadius: '8px 8px 0 0', whiteSpace: 'nowrap', background: href === '/' ? 'rgba(255,255,255,0.15)' : 'transparent' }}>{label}</a>
                ))}
              </nav>
            </div>
          </header>

          {/* STATS BAR */}
          <div style={{ background: cardBg, borderBottom: `1px solid ${border}`, padding: '12px 16px' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {[
                { icon: '🏛️', val: totalExams.toLocaleString() + '+', label: 'Total Exams', color: '#2563eb', bg: '#eff6ff' },
                { icon: '🏆', val: (totalResults || 93) + '+', label: 'Results', color: '#16a34a', bg: '#f0fdf4' },
                { icon: '🎫', val: (totalAdmits || 95) + '+', label: 'Admit Cards', color: '#ea580c', bg: '#fff7ed' },
                { icon: '📅', val: upcomingExams.length + '+', label: 'Upcoming', color: '#7c3aed', bg: '#f5f3ff' }
              ].map((s, i) => (
                <div key={i} style={{ background: darkMode ? '#1e293b' : s.bg, borderRadius: 10, padding: '10px 8px', textAlign: 'center', border: `1px solid ${border}` }}>
                  <div style={{ fontSize: 20 }}>{s.icon}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: darkMode ? '#e2e8f0' : s.color, marginTop: 2 }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: textSub, marginTop: 1 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* WHATSAPP SHARE BAR */}
          <div style={{ background: '#25d366', color: '#fff', padding: '7px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>📲 दोस्तों को Share करें — Free में Sarkari Result पाएं</span>
            <a href={`https://wa.me/?text=${encodeURIComponent('SarkariSetu India - Latest Sarkari Result, Admit Card 2026 🏛️\nhttps://exam-platform-beta.vercel.app')}`}
              target="_blank" rel="noopener noreferrer"
              style={{ padding: '4px 14px', background: '#fff', color: '#25d366', borderRadius: 20, textDecoration: 'none', fontSize: 12, fontWeight: 800, flexShrink: 0 }}>
              WhatsApp ↗
            </a>
          </div>

          {/* NEWS TICKER */}
          {latestUpdates.length > 0 && (
            <div style={{ background: '#dc2626', color: '#fff', padding: '6px 16px', display: 'flex', alignItems: 'center', gap: 12, overflow: 'hidden' }}>
              <span style={{ background: '#fff', color: '#dc2626', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 800, whiteSpace: 'nowrap' }}>🔴 LIVE</span>
              <div style={{ fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {latestUpdates.slice(0, 3).map((u, i) => <span key={i} style={{ marginRight: 32 }}>📌 {u.title}</span>)}
              </div>
            </div>
          )}

          {/* MAIN */}
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '16px' }}>

            {/* 3-Column */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14, marginBottom: 16 }}>

              {/* Results */}
              <div style={{ background: cardBg, borderRadius: 14, border: `1px solid ${border}`, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ background: 'linear-gradient(135deg,#16a34a,#15803d)', color: '#fff', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ margin: 0, fontSize: 14, fontWeight: 800 }}>🏆 Latest Results</h2>
                  <a href="/results" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, textDecoration: 'none', fontWeight: 600 }}>View All →</a>
                </div>
                {latestResults.map((item, i) => (
                  <div key={i} style={{ padding: '10px 14px', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
                      <span>✅</span>
                      <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: textMain, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.exam_name}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                      {item.result_url && <a href={item.result_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, padding: '3px 8px', background: '#2563eb', color: '#fff', borderRadius: 6, textDecoration: 'none', fontWeight: 700 }}>Official ↗</a>}
                      <span style={{ fontSize: 10, padding: '3px 8px', background: '#dcfce7', color: '#16a34a', borderRadius: 6, fontWeight: 700 }}>Declared</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Admit Cards */}
              <div style={{ background: cardBg, borderRadius: 14, border: `1px solid ${border}`, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', color: '#fff', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ margin: 0, fontSize: 14, fontWeight: 800 }}>📄 Admit Cards</h2>
                  <a href="/admit-cards" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, textDecoration: 'none', fontWeight: 600 }}>View All →</a>
                </div>
                {admitCards.map((item, i) => (
                  <div key={i} style={{ padding: '10px 14px', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
                      <span>📄</span>
                      <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: textMain, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.exam_name}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                      {item.download_url && <a href={item.download_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, padding: '3px 8px', background: '#7c3aed', color: '#fff', borderRadius: 6, textDecoration: 'none', fontWeight: 700 }}>Download ↗</a>}
                      <span style={{ fontSize: 10, padding: '3px 8px', background: '#ede9fe', color: '#7c3aed', borderRadius: 6, fontWeight: 700 }}>Released</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Upcoming */}
              <div style={{ background: cardBg, borderRadius: 14, border: `1px solid ${border}`, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ background: 'linear-gradient(135deg,#ea580c,#dc2626)', color: '#fff', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ margin: 0, fontSize: 14, fontWeight: 800 }}>📅 Upcoming Exams</h2>
                  <a href="/notifications" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, textDecoration: 'none', fontWeight: 600 }}>View All →</a>
                </div>
                {upcomingExams.map((item, i) => (
                  <div key={i} style={{ padding: '10px 14px', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: '0 0 2px', fontSize: 12, fontWeight: 600, color: textMain, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>🎯 {item.exam_name}</p>
                      <p style={{ margin: 0, fontSize: 10, color: '#ea580c' }}>📅 {item.exam_date || 'Coming Soon'}</p>
                    </div>
                    <span style={{ fontSize: 10, padding: '3px 8px', background: '#fff7ed', color: '#ea580c', borderRadius: 6, fontWeight: 700, flexShrink: 0 }}>Upcoming</span>
                  </div>
                ))}
              </div>
            </div>

            {/* NOTIFICATIONS SECTION */}
            {latestUpdates.length > 0 && (
              <div style={{ background: cardBg, borderRadius: 14, border: `1px solid ${border}`, overflow: 'hidden', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#1e40af)', color: '#fff', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ margin: 0, fontSize: 14, fontWeight: 800 }}>📢 Latest Notifications</h2>
                  <a href="/notifications" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, textDecoration: 'none', fontWeight: 600 }}>View All →</a>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                  {latestUpdates.map((u, i) => {
                    const cfg = typeConfig[u.update_type] || typeConfig.general;
                    return (
                      <div key={i} style={{ padding: '12px 16px', borderBottom: `1px solid ${border}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <span style={{ fontSize: 10, padding: '2px 8px', background: cfg.bg, color: cfg.color, borderRadius: 20, fontWeight: 700 }}>{cfg.icon} {cfg.label}</span>
                          {u.is_verified && <span style={{ fontSize: 10, color: '#16a34a', fontWeight: 700 }}>✅</span>}
                        </div>
                        <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: textMain, lineHeight: 1.4 }}>{u.title}</p>
                        {u.official_link && <a href={u.official_link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>Official Link ↗</a>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CATEGORIES */}
            <div style={{ background: cardBg, borderRadius: 14, border: `1px solid ${border}`, padding: '14px 16px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h2 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 800, color: textMain }}>📍 Browse by Category</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {categories.map((cat, i) => (
                  <a key={i} href={`/category/${cat.slug || cat.name}`}
                    style={{ padding: '7px 14px', background: '#f0f9ff', borderRadius: 20, color: '#1e40af', fontSize: 12, fontWeight: 600, textDecoration: 'none', border: '1px solid #bfdbfe' }}>
                    {getCatIcon(cat.name)} {cat.name.length > 22 ? cat.name.slice(0, 20) + '..' : cat.name}
                  </a>
                ))}
              </div>
            </div>

            {/* QUICK LINKS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, marginBottom: 16 }}>
              {[
                { href: '/results', icon: '🏆', label: 'Results', color: '#16a34a', bg: '#dcfce7' },
                { href: '/admit-cards', icon: '📄', label: 'Admit Cards', color: '#7c3aed', bg: '#ede9fe' },
                { href: '/syllabus', icon: '📚', label: 'Syllabus', color: '#2563eb', bg: '#dbeafe' },
                { href: '/answer-keys', icon: '🔑', label: 'Answer Keys', color: '#ca8a04', bg: '#fef9c3' },
                { href: '/notifications', icon: '📢', label: 'Notifications', color: '#dc2626', bg: '#fee2e2' },
                { href: '/search', icon: '🔍', label: 'Search Exams', color: '#0891b2', bg: '#e0f2fe' },
                { href: '/jobs', icon: '💼', label: 'Govt Jobs', color: '#ea580c', bg: '#fff7ed' },
                { href: '/cutoff', icon: '✂️', label: 'Cutoff', color: '#7c3aed', bg: '#f5f3ff' },
                { href: '/merit-list', icon: '📋', label: 'Merit List', color: '#0891b2', bg: '#ecfeff' },
                { href: '/vacancy', icon: '📊', label: 'Vacancy', color: '#059669', bg: '#f0fdf4' },
              ].map(link => (
                <a key={link.href} href={link.href}
                  style={{ padding: '14px 12px', background: link.bg, borderRadius: 12, textAlign: 'center', textDecoration: 'none', border: `1px solid ${border}`, display: 'block' }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{link.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: link.color }}>{link.label}</div>
                </a>
              ))}
            </div>

            {/* AD */}
            <div style={{ background: '#f8fafc', border: '2px dashed #e5e7eb', borderRadius: 12, padding: '20px', textAlign: 'center', color: '#9ca3af', fontSize: 12, marginBottom: 16 }}>
              📢 Advertisement — Google AdSense
            </div>
          </div>

          {/* FOOTER */}
          <footer style={{ background: '#1e3a5f', color: '#94a3b8', padding: '24px 16px', textAlign: 'center' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
              <p style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 800, color: '#fff' }}>🏛️ SarkariSetu <span style={{ color: '#fbbf24' }}>India</span></p>
              <p style={{ margin: '0 0 12px', fontSize: 12 }}>Sarkari Result | Admit Card | Syllabus | Answer Key | Notification</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 12 }}>
                {['/results', '/admit-cards', '/syllabus', '/answer-keys', '/notifications', '/search'].map((href, i) => (
                  <a key={i} href={href} style={{ color: '#93c5fd', fontSize: 11, textDecoration: 'none' }}>
                    {['Results', 'Admit Cards', 'Syllabus', 'Answer Keys', 'Notifications', 'Search'][i]}
                  </a>
                ))}
              </div>
              <p style={{ margin: 0, fontSize: 11, opacity: 0.6 }}>© 2026 SarkariSetu India — Not affiliated with any government organization.</p>
              <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 8, flexWrap: "wrap" }}>
                <a href="/about" style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>About Us</a>
                <a href="/privacy-policy" style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Privacy Policy</a>
                <a href="/contact" style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Contact</a>
              </div>
            </div>
          </footer>
        </div>
      );
    }
    