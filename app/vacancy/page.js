"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function VacancyPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    document.title = "Sarkari Vacancy 2026 - Latest Government Jobs | SarkariSetu India";
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const { data } = await supabase.from("upcoming_exams").select("*").order("exam_date", { ascending: true }).limit(100);
      setExams(data || []);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const categories = ["all","SSC","UPSC","Banking","Railway","State PSC","Defence","Teaching","Police"];

  const filtered = exams.filter(e => {
    const matchSearch = !search || e.name?.toLowerCase().includes(search.toLowerCase()) || e.organization?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || e.category === category;
    return matchSearch && matchCat;
  });

  const totalVacancies = filtered.reduce((sum, e) => sum + (parseInt(e.vacancies) || 0), 0);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #059669 0%, #047857 100%)", color: "#fff", padding: "20px 16px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative" }}>
          <a href="/" style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, textDecoration: "none" }}>← Home</a>
          <h1 style={{ margin: "8px 0 4px", fontSize: 22, fontWeight: 800 }}>📊 Sarkari Vacancy 2026</h1>
          <p style={{ margin: "0 0 4px", fontSize: 13, opacity: 0.85 }}>Latest government job vacancies</p>
          {totalVacancies > 0 && <p style={{ margin: "0 0 16px", fontSize: 13, fontWeight: 700, color: "#a7f3d0" }}>🎯 Total {totalVacancies.toLocaleString()}+ posts available</p>}
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔍</span>
            <input placeholder="Search vacancy... (SSC, Railway, Bank...)"
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", padding: "11px 12px 11px 38px", borderRadius: 10, border: "none", fontSize: 14, boxSizing: "border-box", outline: "none" }} />
          </div>
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: 8, padding: "10px 16px", overflowX: "auto", background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            style={{ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", whiteSpace: "nowrap", fontSize: 12, fontWeight: 600,
              background: category === cat ? "#059669" : "#f3f4f6", color: category === cat ? "#fff" : "#4b5563" }}>
            {cat === "all" ? "🌐 All" : cat}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "12px 16px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>Loading vacancies...</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((exam, i) => {
              const daysLeft = exam.exam_date ? Math.ceil((new Date(exam.exam_date) - new Date()) / (1000*60*60*24)) : null;
              return (
                <div key={exam.id || i} style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #e5e7eb", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 14, color: "#1e3a5f" }}>{exam.name}</p>
                      {exam.organization && <p style={{ margin: "0 0 6px", fontSize: 12, color: "#6b7280" }}>🏛️ {exam.organization}</p>}
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {exam.vacancies && (
                          <span style={{ fontSize: 12, padding: "3px 10px", background: "#f0fdf4", color: "#16a34a", borderRadius: 10, fontWeight: 800 }}>
                            📋 {parseInt(exam.vacancies).toLocaleString()} Posts
                          </span>
                        )}
                        {exam.category && <span style={{ fontSize: 11, padding: "2px 8px", background: "#eff6ff", color: "#2563eb", borderRadius: 10 }}>{exam.category}</span>}
                        {daysLeft !== null && daysLeft > 0 && (
                          <span style={{ fontSize: 11, padding: "2px 8px", background: daysLeft <= 30 ? "#fef2f2" : "#f0fdf4", color: daysLeft <= 30 ? "#dc2626" : "#16a34a", borderRadius: 10, fontWeight: 600 }}>
                            ⏰ {daysLeft}d left
                          </span>
                        )}
                      </div>
                    </div>
                    {exam.official_website && (
                      <a href={exam.official_website} target="_blank" rel="noopener noreferrer"
                        style={{ padding: "8px 14px", background: "linear-gradient(135deg,#059669,#047857)", color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>
                        Apply ↗
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>
                <div style={{ fontSize: 48 }}>📊</div>
                <p>No vacancies found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
