"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function LatestUpdatesPage() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sarkari-dark-mode');
    if (saved === 'true') setDarkMode(true);
  }, []);

  useEffect(() => {
    document.title = 'आज के अपडेट - Sarkari Result, Admit Card, Answer Key | SarkariSetu India';
    async function load() {
      try {
        const { data } = await supabase
          .from('updates')
          .select('id,title,description,update_type,publish_date,official_link,exam_id,is_verified,created_at')
          .order('created_at', { ascending: false })
          .limit(60);
        if (data) setItems(data);
      } catch (e) {}
      setLoaded(true);
    }
    load();
  }, []);

  const bg = darkMode ? '#0f172a' : '#f8fafc';
  const cardBg = darkMode ? '#1e293b' : '#ffffff';
  const textMain = darkMode ? '#f1f5f9' : '#0f172a';
  const textSub = darkMode ? '#94a3b8' : '#64748b';
  const border = darkMode ? '#334155' : '#e5e7eb';

  const typeConfig = {
    result: { icon: '🏆', bg: '#dcfce7', color: '#16a34a', label: 'Result' },
    admit_card: { icon: '📄', bg: '#ede9fe', color: '#7c3aed', label: 'Admit Card' },
    answer_key: { icon: '🔑', bg: '#fef9c3', color: '#ca8a04', label: 'Answer Key' },
    syllabus: { icon: '📚', bg: '#dbeafe', color: '#2563eb', label: 'Syllabus' },
    general: { icon: '📢', bg: '#f3f4f6', color: '#64748b', label: 'Update' },
  };

  const HUB_LINKS = [
    { re: /\bupsc\b|nda|cds|capf|ifos/i, href: '/upsc', name: 'UPSC' },
    { re: /\bssc\b/i, href: '/ssc', name: 'SSC' },
    { re: /ibps|sbi|rbi|bank|nabard|sebi/i, href: '/banking', name: 'Banking' },
    { re: /rrb|railway|rpf|ntpc|group d/i, href: '/railway', name: 'Railway' },
    { re: /bpsc|uppsc|mppsc|rpsc|ukpsc|hpsc|opsc|jpsc|kpsc|tnpsc|mpsc|psc/i, href: '/state-psc', name: 'State PSC' },
    { re: /army|navy|air force|afcat|coast guard|agniveer/i, href: '/defence', name: 'Defence' },
    { re: /ctet|dsssb|kvs|nvs|tet|teacher/i, href: '/teaching', name: 'Teaching' },
    { re: /police|constable|home guard/i, href: '/police', name: 'Police' },
    { re: /aiims|norcet|nurse|esic/i, href: '/health', name: 'Health' },
    { re: /forest|van rakshak|\brfo\b/i, href: '/forest', name: 'Forest' },
    { re: /clat|ailet|law|court|judici/i, href: '/judiciary', name: 'Judiciary' },
    { re: /epfo|psu|nhpc|ongc|bhel/i, href: '/psu', name: 'PSU' },
    { re: /insurance/i, href: '/insurance', name: 'Insurance' },
    { re: /post office|gds|india post/i, href: '/post-office', name: 'Post Office' },
  ];
  function hubFor(title) {
    for (const h of HUB_LINKS) if (h.re.test(title)) return h;
    return null;
  }

  const todayStr = new Date().toISOString().slice(0, 10);
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  function dayLabel(d) {
    if (!d) return 'हालिया';
    if (d === todayStr) return 'आज — ' + d;
    if (d === yesterdayStr) return 'कल — ' + d;
    const p = d.split('-');
    const months = ['जनवरी','फ़रवरी','मार्च','अप्रैल','मई','जून','जुलाई','अगस्त','सितंबर','अक्टूबर','नवंबर','दिसंबर'];
    return months[parseInt(p[1], 10) - 1] + ' ' + p[2] + ', ' + p[0];
  }

  const filtered = filter === 'all' ? items : items.filter((u) => u.update_type === filter);
  const groups = [];
  const seenDates = new Set();
  for (const u of filtered) {
    const d = u.publish_date || (u.created_at || '').slice(0, 10) || 'recent';
    if (!seenDates.has(d)) { seenDates.add(d); groups.push({ date: d, items: [] }); }
    groups[groups.length - 1].items.push(u);
  }

  const chips = [
    { key: 'all', label: 'सभी' },
    { key: 'result', label: '🏆 Result' },
    { key: 'admit_card', label: '📄 Admit Card' },
    { key: 'answer_key', label: '🔑 Answer Key' },
    { key: 'syllabus', label: '📚 Syllabus' },
    { key: 'general', label: '📢 Other' },
  ];
  const counts = {};
  items.forEach((u) => { counts[u.update_type] = (counts[u.update_type] || 0) + 1; });
  const todayCount = items.filter((u) => (u.publish_date || '').slice(0, 10) === todayStr).length;

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: "'Segoe UI', Arial, sans-serif", color: textMain, paddingBottom: 90, transition: 'all 0.3s' }}>
      {/* Header */}
      <header style={{ background: 'linear-gradient(135deg,#1e3a5f,#164e63)', color: '#fff', padding: '20px 16px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <a href="/" style={{ color: '#93c5fd', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>← Home</a>
            <button onClick={() => setDarkMode(!darkMode)}
              style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 16 }}>
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
          <h1 style={{ margin: '14px 0 4px', fontSize: 24, fontWeight: 900 }}>📰 आज के अपडेट</h1>
          <p style={{ margin: 0, fontSize: 13, opacity: 0.9, lineHeight: 1.5 }}>
            हर दिन सुबह — नए Sarkari Result, Admit Card, Answer Key और Notification। News sources से auto-tracked, official website से confirm करें।
          </p>
          <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: 20, fontWeight: 600 }}>
              {loaded ? (todayCount + ' अपडेट आज') : 'लोड हो रहा है…'}
            </span>
            <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: 20, fontWeight: 600 }}>
              अंतिम अपडेट: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </header>

      {/* Filter chips */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '14px 16px 0', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {chips.map((c) => (
          <button key={c.key} onClick={() => setFilter(c.key)}
            style={{
              padding: '7px 14px', borderRadius: 20, border: `1px solid ${border}`,
              background: filter === c.key ? '#164e63' : cardBg,
              color: filter === c.key ? '#fff' : textMain,
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
            }}>
            {c.label}{c.key !== 'all' && counts[c.key] ? ` (${counts[c.key]})` : ''}
          </button>
        ))}
      </div>

      {/* Items */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '14px 16px 0' }}>
        {!loaded && <p style={{ color: textSub, fontSize: 13 }}>लोड हो रहा है…</p>}
        {loaded && filtered.length === 0 && (
          <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 14, padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 34 }}>🗓️</div>
            <p style={{ fontSize: 13, color: textSub, margin: '8px 0 0' }}>इस श्रेणी में अभी कोई अपडेट नहीं है। दोबारा देखें!</p>
          </div>
        )}
        {groups.map((g) => (
          <div key={g.date} style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#164e63', margin: '0 2px 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ background: darkMode ? '#1e293b' : '#e0f2fe', padding: '3px 10px', borderRadius: 16 }}>{dayLabel(g.date)}</span>
              <span style={{ flex: 1, height: 1, background: border }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {g.items.map((u) => {
                const cfg = typeConfig[u.update_type] || typeConfig.general;
                const hub = hubFor(u.title || '');
                return (
                  <div key={u.id} style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 12, padding: '12px 14px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                      <span style={{ fontSize: 10, padding: '2px 8px', background: cfg.bg, color: cfg.color, borderRadius: 20, fontWeight: 700 }}>{cfg.icon} {cfg.label}</span>
                      {u.is_verified && <span style={{ fontSize: 10, color: '#16a34a', fontWeight: 700 }}>✅ Verified</span>}
                      {hub && <a href={hub.href} style={{ fontSize: 10, padding: '2px 8px', background: '#f0f9ff', color: '#1e40af', borderRadius: 20, fontWeight: 700, textDecoration: 'none', border: '1px solid #bfdbfe' }}>{hub.name} Center ↗</a>}
                    </div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: textMain, lineHeight: 1.5 }}>{u.title}</p>
                    {u.description && <p style={{ margin: '4px 0 0', fontSize: 11, color: textSub }}>{u.description}</p>}
                    <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {u.official_link && (
                        <a href={u.official_link} target="_blank" rel="noopener noreferrer"
                          style={{ padding: '5px 12px', background: '#164e63', color: '#fff', borderRadius: 8, fontSize: 11, fontWeight: 700, textDecoration: 'none' }}>
                          Official Site ↗
                        </a>
                      )}
                      {!u.official_link && (
                        <a href={`https://www.google.com/search?q=${encodeURIComponent(u.title)}`} target="_blank" rel="noopener noreferrer"
                          style={{ padding: '5px 12px', background: '#f3f4f6', color: '#1e3a5f', borderRadius: 8, fontSize: 11, fontWeight: 700, textDecoration: 'none' }}>
                          🔍 Search
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Telegram CTA */}
        <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#1e40af)', borderRadius: 14, padding: '16px 18px', margin: '6px 0 16px', color: '#fff' }}>
          <div style={{ fontSize: 16, fontWeight: 800 }}>📱 Telegram Channel से जुड़ें</div>
          <p style={{ margin: '4px 0 10px', fontSize: 12, opacity: 0.9 }}>हर दिन नए Result, Admit Card और Notification — सीधे आपके फोन पर, फ्री में।</p>
          <a href="/telegram" style={{ padding: '8px 18px', background: '#fbbf24', color: '#1e3a5f', borderRadius: 10, fontSize: 13, fontWeight: 800, textDecoration: 'none', display: 'inline-block' }}>Channel देखें →</a>
        </div>

        <p style={{ fontSize: 10.5, color: textSub, lineHeight: 1.6, margin: '0 0 20px' }}>
          ⚠️ Disclaimer: ये अपडेट Google News से auto-tracked हैं। हमेशा official website (ssc.gov.in, upsc.gov.in आदि) पर जाकर final information confirm करें। SarkariSetu India किसी सरकारी संस्था से संबद्ध नहीं है।
        </p>
      </div>
    </div>
  );
}
