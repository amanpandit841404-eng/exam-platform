"use client";
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AdmitCardsPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    document.title = 'Latest Admit Cards 2026 | SarkariSetu India';
    supabase.from('admit_cards').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setCards(data); setLoading(false); });
  }, []);

  const filtered = cards.filter(r =>
    !search || r.exam_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#6d28d9,#7c3aed)', color: '#fff', padding: '16px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <a href="/" style={{ color: '#c4b5fd', fontSize: 13, textDecoration: 'none' }}>← Home</a>
          <h1 style={{ margin: '8px 0 4px', fontSize: 22, fontWeight: 800 }}>📄 Latest Admit Cards</h1>
          <p style={{ margin: 0, fontSize: 13, opacity: 0.8 }}>{cards.length}+ admit cards available</p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '16px' }}>
        {/* Search */}
        <input
          placeholder="🔍 Search admit cards... (SSC, UPSC, IBPS...)"
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 14, marginBottom: 16, boxSizing: 'border-box', outline: 'none' }}
        />

        {loading ? (
          <p style={{ textAlign: 'center', color: '#999', padding: 40 }}>Loading...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map((r, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 16 }}>📄</span>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#1e3a5f' }}>{r.exam_name}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 11, padding: '2px 8px', background: '#ede9fe', color: '#7c3aed', borderRadius: 20, fontWeight: 600 }}>Released</span>
                    {r.active_from && <span style={{ fontSize: 11, color: '#999' }}>From: {new Date(r.active_from).toLocaleDateString('en-IN')}</span>}
                    {r.active_to && <span style={{ fontSize: 11, color: '#ef4444' }}>Last: {new Date(r.active_to).toLocaleDateString('en-IN')}</span>}
                  </div>
                </div>
                {r.download_url && (
                  <a href={r.download_url} target="_blank" rel="noopener noreferrer"
                    style={{ padding: '8px 16px', background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>
                    Download ↗
                  </a>
                )}
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>😕</div>
                <p>No admit cards found for "{search}"</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
