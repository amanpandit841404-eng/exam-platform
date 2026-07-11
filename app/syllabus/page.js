"use client";
    import { useState, useEffect } from "react";
    import { supabase } from "../lib/supabase";

    export default function SyllabusPage() {
      const [exams, setExams] = useState([]);
      const [loading, setLoading] = useState(true);
      const [category, setCategory] = useState("All");
      const [search, setSearch] = useState("");

      useEffect(() => {
        fetchExams();
      }, []);

      const fetchExams = async () => {
        setLoading(true);
        try {
          let q = supabase.from("exams").select("id, name, category, description").order("name");
          const { data } = await q;
          setExams(data || []);
        } catch (e) { console.error(e); }
        setLoading(false);
      };

      const categories = ["All", ...new Set(exams.map(e => e.category).filter(Boolean))];
      const filtered = exams.filter(e => {
        if (category !== "All" && e.category !== category) return false;
        if (search && !e.name?.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      });

      return (
        <div style={{ fontFamily: "Arial,sans-serif", maxWidth: 800, margin: "0 auto", padding: 12 }}>
          <h1 style={{ fontSize: 22, color: "#1e3a5f", marginBottom: 4 }}>📚 Syllabus</h1>
          <p style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>Browse exam syllabus and patterns</p>

          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            <input placeholder="Search exams..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: 200, padding: "10px 14px", fontSize: 14, border: "1px solid #ccc", borderRadius: 8 }} />
          </div>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                style={{ padding: "6px 14px", borderRadius: 20, border: "none", fontSize: 12, cursor: "pointer",
                  background: category === c ? "#2563eb" : "#e5e7eb", color: category === c ? "#fff" : "#333" }}>
                {c === "All" ? "🏷️ All" : c}
              </button>
            ))}
          </div>

          {loading ? <p style={{ textAlign: "center", color: "#999", padding: 40 }}>Loading...</p> : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filtered.map(e => (
                <a key={e.id} href={`/exam/${e.id}`}
                  style={{ display: "block", padding: 12, background: "#f9fafb", borderRadius: 8, textDecoration: "none", color: "#333",
                    border: "1px solid #eee" }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{e.name}</div>
                  <div style={{ fontSize: 12, color: "#2563eb", marginTop: 2 }}>{e.category}</div>
                  {e.description && <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>{e.description.slice(0, 120)}...</div>}
                </a>
              ))}
              {filtered.length === 0 && <p style={{ textAlign: "center", color: "#999", padding: 40 }}>No exams found</p>}
            </div>
          )}
        </div>
      );
    }
    