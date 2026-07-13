"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function NotificationsPage() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    document.title = 'Latest Notifications 2026 | SarkariSetu India';
    supabase.from("updates").select("*").order("created_at", { ascending: false }).limit(200)
      .then(({ data }) => { if (data) setUpdates(data); setLoading(false); });
  }, []);

  const typeConfig = {
    result:     { icon: "🏆", label: "Result",     bg: "#dcfce7", color: "#16a34a" },
    admit_card: { icon: "📄", label: "Admit Card", bg: "#ede9fe", color: "#7c3aed" },
    syllabus:   { icon: "📚", label: "Syllabus",   bg: "#dbeafe", color: "#2563eb" },
    answer_key: { icon: "🔑", label: "Answer Key", bg: "#fef9c3", color: "#ca8a04" },
    general:    { icon: "📢", label: "General",    bg: "#f3f4f6", color: "#6b7280" },
  };

  const tabs = ["all", "result", "admit_card", "answer_key", "syllabus"];
  const filtered = filter === "all" ? updates : updates.filter(u => u.update_type === filter);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'sans-serif' }}>
      <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#0f172a)', color: '#fff', padding: '16px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <a href="/" style={{ color: '#93c5fd', fontSize: 13, textDecoration: 'none' }}>← Home</a>
          <h1 style={{ margin: '8px 0 4px', fontSize: 22, fontWeight: 800 }}>📢 Latest Notifications</h1>
          <p style={{ margin: 0, fontSize: 13, opacity: 0.8 }}>{updates.length}+ updates</p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '16px' }}>
        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              style={{ padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                background: filter === t ? '#1e3a5f' : '#fff',
                color: filter === t ? '#fff' : '#374151',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
              {t === 'all' ? '📋 All' : (typeConfig[t]?.icon + ' ' + typeConfig[t]?.label)}
            </button>
          ))}
        </div>

        {loading ? <p style={{ textAlign: 'center', color: '#999', padding: 40 }}>Loading...</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map((u, i) => {
              const cfg = typeConfig[u.update_type] || typeConfig.general;
              return (
                <div key={i} style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 11, padding: '2px 8px', background: cfg.bg, color: cfg.color, borderRadius: 20, fontWeight: 600 }}>
                          {cfg.icon} {cfg.label}
                        </span>
                        {u.is_verified && <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 600 }}>✅ Verified</span>}
                        <span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 'auto' }}>
                          {new Date(u.created_at).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                      <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 14, color: '#1e3a5f' }}>{u.title}</p>
                      {u.description && <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>{u.description}</p>}
                    </div>
                    {u.official_link && (
                      <a href={u.official_link} target="_blank" rel="noopener noreferrer"
                        style={{ padding: '6px 12px', background: '#1e3a5f', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>
                        Official ↗
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>📭</div>
                <p>No notifications yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
