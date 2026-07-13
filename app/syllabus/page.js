"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function SyllabusPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    document.title = 'Exam Syllabus 2026 | SarkariSetu India';
    supabase.from("exams").select("id,name,full_name,category,description").order("name")
      .then(({ data }) => { if (data) setExams(data); setLoading(false); });
  }, []);

  const categories = ["All", ...new Set(exams.map(e => e.category).filter(Boolean))];
  const filtered = exams.filter(e => {
    if (category !== "All" && e.category !== category) return false;
    if (search && !e.name?.toLowerCase().includes(search.toLowerCase()) && !e.full_name?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const catIcons = { SSC: "📋", UPSC: "🏛️", Banking: "🏦", Railway: "🚂", Engineering: "⚙️", Medical: "🏥", Defence: "🎖️", Teaching: "📚", State: "🗺️" };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'sans-serif' }}>
      <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#1e40af)', color: '#fff', padding: '16px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <a href="/" style={{ color: '#93c5fd', fontSize: 13, textDecoration: 'none' }}>← Home</a>
          <h1 style={{ margin: '8px 0 4px', fontSize: 22, fontWeight: 800 }}>📚 Exam Syllabus</h1>
          <p style={{ margin: 0, fontSize: 13, opacity: 0.8 }}>{exams.length.toLocaleString()}+ exams</p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '16px' }}>
        <input
          placeholder="🔍 Search exam syllabus... (SSC CGL, UPSC, NEET...)"
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 14, marginBottom: 12, boxSizing: 'border-box', outline: 'none' }}
        />

        {/* Category filter */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {categories.slice(0, 12).map(c => (
            <button key={c} onClick={() => setCategory(c)}
              style={{ padding: '5px 12px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                background: category === c ? '#1e3a5f' : '#fff',
                color: category === c ? '#fff' : '#374151',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
              {catIcons[c] || '📁'} {c}
            </button>
          ))}
        </div>

        {loading ? <p style={{ textAlign: 'center', color: '#999', padding: 40 }}>Loading...</p> : (
          <>
            <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>{filtered.length} exams found</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
              {filtered.slice(0, 100).map((exam, i) => (
                <a key={i} href={`/exam/${exam.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', border: '1px solid #e5e7eb', height: '100%', transition: 'box-shadow 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                    <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 14, color: '#1e3a5f' }}>{exam.full_name || exam.name}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 11, padding: '2px 8px', background: '#dbeafe', color: '#2563eb', borderRadius: 20, fontWeight: 600 }}>
                        {catIcons[exam.category] || '📁'} {exam.category || 'Exam'}
                      </span>
                      <span style={{ fontSize: 11, color: '#2563eb', marginLeft: 'auto' }}>View →</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
            {filtered.length > 100 && (
              <p style={{ textAlign: 'center', color: '#6b7280', fontSize: 13, marginTop: 16 }}>
                Showing 100 of {filtered.length} — search to narrow down
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
