"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    document.title = "Latest Govt Jobs 2026 - SarkariSetu India";
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data } = await supabase.from("upcoming_exams")
        .select("*").order("exam_date", { ascending: true }).limit(100);
      setJobs(data || []);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const categories = ["all", "SSC", "Banking", "Railway", "UPSC", "State PSC", "Defence", "Teaching"];

  const filtered = jobs.filter(j => {
    const matchSearch = !search || j.name?.toLowerCase().includes(search.toLowerCase()) || j.organization?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || j.category === filter;
    return matchSearch && matchFilter;
  });

  const getDaysLeft = (dateStr) => {
    if (!dateStr) return null;
    const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getBadge = (days) => {
    if (days === null) return { text: "Coming Soon", color: "#6b7280", bg: "#f3f4f6" };
    if (days < 0) return { text: "Closed", color: "#dc2626", bg: "#fef2f2" };
    if (days <= 7) return { text: `${days}d left`, color: "#dc2626", bg: "#fef2f2" };
    if (days <= 30) return { text: `${days}d left`, color: "#d97706", bg: "#fffbeb" };
    return { text: `${days}d left`, color: "#16a34a", bg: "#f0fdf4" };
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 0 80px", fontFamily: "sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)", padding: "20px 16px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <a href="/" style={{ color: "#93c5fd", fontSize: 13, textDecoration: "none", display: "block", marginBottom: 12 }}>← Home</a>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: "0 0 4px" }}>💼 Latest Govt Jobs</h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", margin: "0 0 16px" }}>सरकारी नौकरी 2026 — Upcoming Exams & Vacancies</p>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search jobs, organizations..."
            style={{ width: "100%", padding: "10px 12px 10px 36px", borderRadius: 10, border: "none", fontSize: 14, boxSizing: "border-box", outline: "none" }} />
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, padding: "12px 16px", overflowX: "auto", background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            style={{ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", whiteSpace: "nowrap", fontSize: 12, fontWeight: 600,
              background: filter === cat ? "#1e3a5f" : "#f3f4f6",
              color: filter === cat ? "#fff" : "#4b5563" }}>
            {cat === "all" ? "🌐 All" : cat}
          </button>
        ))}
      </div>

      {/* Stats bar */}
      <div style={{ display: "flex", gap: 0, background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
        {[
          { icon: "💼", label: "Total Jobs", value: jobs.length },
          { icon: "🔥", label: "Closing Soon", value: jobs.filter(j => { const d = getDaysLeft(j.exam_date); return d !== null && d >= 0 && d <= 30; }).length },
          { icon: "✅", label: "Open Now", value: jobs.filter(j => { const d = getDaysLeft(j.exam_date); return d !== null && d > 0; }).length },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center", padding: "10px 4px", borderRight: i < 2 ? "1px solid #e5e7eb" : "none" }}>
            <div style={{ fontSize: 18 }}>{s.icon}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1e3a5f" }}>{s.value}</div>
            <div style={{ fontSize: 10, color: "#6b7280" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Jobs list */}
      <div style={{ padding: "12px 16px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "#6b7280" }}>Loading jobs...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "#6b7280" }}>No jobs found</div>
        ) : filtered.map((job, i) => {
          const days = getDaysLeft(job.exam_date);
          const badge = getBadge(days);
          return (
            <div key={job.id || i} style={{ background: "#fff", borderRadius: 12, padding: 16, marginBottom: 10, border: "1px solid #e5e7eb", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f", lineHeight: 1.3 }}>{job.name}</div>
                  {job.organization && <div style={{ fontSize: 12, color: "#6b7280", marginTop: 3 }}>🏛️ {job.organization}</div>}
                  <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                    {job.category && <span style={{ fontSize: 11, padding: "2px 8px", background: "#eff6ff", color: "#2563eb", borderRadius: 10, fontWeight: 600 }}>{job.category}</span>}
                    {job.vacancies && <span style={{ fontSize: 11, padding: "2px 8px", background: "#f0fdf4", color: "#16a34a", borderRadius: 10, fontWeight: 600 }}>📋 {job.vacancies} Posts</span>}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 10, fontWeight: 700, background: badge.bg, color: badge.color }}>{badge.text}</span>
                  {job.exam_date && <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>{new Date(job.exam_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>}
                </div>
              </div>
              {job.official_website && (
                <a href={job.official_website} target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-block", marginTop: 10, padding: "6px 14px", background: "#1e3a5f", color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 12, fontWeight: 600 }}>
                  🌐 Apply / Official Site ↗
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
