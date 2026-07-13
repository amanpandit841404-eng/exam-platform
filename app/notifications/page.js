"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function NotificationsPage() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.title = "Latest Sarkari Notifications 2026 | SarkariSetu India";
    supabase.from("updates").select("*").order("created_at", { ascending: false }).limit(100)
      .then(({ data }) => { if (data) setUpdates(data); setLoading(false); });
  }, []);

  const types = ["all", "result", "admit_card", "notification", "answer_key", "syllabus"];
  const typeLabels = { all: "🌐 All", result: "🏆 Results", admit_card: "🎫 Admit Cards", notification: "📢 Notifications", answer_key: "🔑 Answer Keys", syllabus: "📚 Syllabus" };
  const typeColors = { result: { bg: "#dcfce7", color: "#16a34a" }, admit_card: { bg: "#fff7ed", color: "#ea580c" }, notification: { bg: "#eff6ff", color: "#2563eb" }, answer_key: { bg: "#fef9c3", color: "#ca8a04" }, syllabus: { bg: "#f5f3ff", color: "#7c3aed" } };

  const filtered = updates.filter(u => {
    const matchFilter = filter === "all" || u.type === filter;
    const matchSearch = !search || u.title?.toLowerCase().includes(search.toLowerCase()) || u.description?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const getTimeAgo = (dateStr) => {
    if (!dateStr) return "";
    const diff = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60));
    if (diff < 60) return diff + "m ago";
    if (diff < 1440) return Math.floor(diff/60) + "h ago";
    return Math.floor(diff/1440) + "d ago";
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)", color: "#fff", padding: "20px 16px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <a href="/" style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, textDecoration: "none" }}>Home</a>
          <h1 style={{ margin: "8px 0 4px", fontSize: 22, fontWeight: 800 }}>📢 Latest Notifications</h1>
          <p style={{ margin: "0 0 16px", fontSize: 13, opacity: 0.85 }}>{updates.length} notifications • Updated daily</p>
          <div style={{ position: "relative" }}>
            <input placeholder="Search notifications..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", padding: "11px 16px", borderRadius: 10, border: "none", fontSize: 14, boxSizing: "border-box", outline: "none" }} />
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 6, padding: "10px 16px", overflowX: "auto", background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            style={{ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", whiteSpace: "nowrap", fontSize: 12, fontWeight: 600,
              background: filter === t ? "#1e3a5f" : "#f3f4f6", color: filter === t ? "#fff" : "#4b5563" }}>
            {typeLabels[t]}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "12px 16px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>Loading...</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.map((u, i) => {
              const tc = typeColors[u.type] || { bg: "#f3f4f6", color: "#6b7280" };
              const isNew = u.created_at && (new Date() - new Date(u.created_at)) < 86400000 * 3;
              return (
                <div key={u.id || i} style={{ background: "#fff", borderRadius: 12, padding: 14, border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
                        {isNew && <span style={{ fontSize: 10, padding: "1px 6px", background: "#dc2626", color: "#fff", borderRadius: 6, fontWeight: 800 }}>NEW</span>}
                        {u.type && <span style={{ fontSize: 11, padding: "2px 8px", background: tc.bg, color: tc.color, borderRadius: 10, fontWeight: 600 }}>{typeLabels[u.type] || u.type}</span>}
                        <span style={{ fontSize: 11, color: "#9ca3af" }}>{getTimeAgo(u.created_at)}</span>
                      </div>
                      <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 14, color: "#1e3a5f", lineHeight: 1.3 }}>{u.title}</p>
                      {u.description && <p style={{ margin: 0, fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>{u.description}</p>}
                    </div>
                    {u.official_link && (
                      <a href={u.official_link} target="_blank" rel="noopener noreferrer"
                        style={{ padding: "6px 12px", background: "#1e3a5f", color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0 }}>
                        View ↗
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>
                <div style={{ fontSize: 48 }}>📢</div>
                <p>No notifications found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
