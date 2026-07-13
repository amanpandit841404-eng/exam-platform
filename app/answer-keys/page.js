"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function AnswerKeysPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    document.title = 'Answer Keys 2026 | SarkariSetu India';
    supabase.from("updates").select("*").eq("update_type", "answer_key").order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setItems(data); setLoading(false); });
  }, []);

  const filtered = items.filter(r =>
    !search || r.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'sans-serif' }}>
      <div style={{ background: 'linear-gradient(135deg,#ca8a04,#d97706)', color: '#fff', padding: '16px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <a href="/" style={{ color: '#fef9c3', fontSize: 13, textDecoration: 'none' }}>← Home</a>
          <h1 style={{ margin: '8px 0 4px', fontSize: 22, fontWeight: 800 }}>🔑 Answer Keys</h1>
          <p style={{ margin: 0, fontSize: 13, opacity: 0.8 }}>Latest answer keys for all exams</p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '16px' }}>
        <input
          placeholder="🔍 Search answer keys..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 14, marginBottom: 16, boxSizing: 'border-box', outline: 'none' }}
        />

        {loading ? <p style={{ textAlign: 'center', color: '#999', padding: 40 }}>Loading...</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.length > 0 ? filtered.map((u, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 16 }}>🔑</span>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#1e3a5f' }}>{u.title}</p>
                  </div>
                  {u.description && <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>{u.description}</p>}
                  <span style={{ fontSize: 11, color: '#9ca3af' }}>{new Date(u.created_at).toLocaleDateString('en-IN')}</span>
                </div>
                {u.official_link && (
                  <a href={u.official_link} target="_blank" rel="noopener noreferrer"
                    style={{ padding: '8px 16px', background: 'linear-gradient(135deg,#ca8a04,#d97706)', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>
                    Download ↗
                  </a>
                )}
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>
                <div style={{ fontSize: 50, marginBottom: 12 }}>🔑</div>
                <h2 style={{ color: '#374151', marginBottom: 8 }}>Answer Keys Coming Soon</h2>
                <p style={{ fontSize: 13 }}>Answer keys will appear here as soon as they are released.</p>
                <a href="/notifications" style={{ display: 'inline-block', marginTop: 16, padding: '10px 20px', background: '#1e3a5f', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
                  📢 Check Notifications
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
