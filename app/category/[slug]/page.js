"use client";
    import { useState, useEffect } from "react";
    import { supabase } from "../../lib/supabase";
    import { useParams } from "next/navigation";

    export default function CategoryPage() {
      const params = useParams();
      const slug = params?.slug;
      const [exams, setExams] = useState([]);
      const [results, setResults] = useState([]);
      const [admits, setAdmits] = useState([]);
      const [category, setCategory] = useState(null);
      const [loading, setLoading] = useState(true);
      const [search, setSearch] = useState("");
      const [tab, setTab] = useState("exams");

      useEffect(() => {
        if (!slug) return;
        async function load() {
          const { data: catData } = await supabase.from("categories").select("*").eq("slug", slug).maybeSingle();
          const catName = catData?.name || slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
          if (catData) setCategory(catData);
          document.title = catName + " Exams 2026 - Results, Admit Cards | SarkariSetu India";
          const [examRes, resultRes, admitRes] = await Promise.all([
            supabase.from("exams").select("id,name,full_name,category").eq("category", catData?.name || slug).order("name"),
            supabase.from("results").select("*").order("created_at", { ascending: false }).limit(20),
            supabase.from("admit_cards").select("*").order("created_at", { ascending: false }).limit(20),
          ]);
          setExams(examRes.data || []);
          setResults(resultRes.data || []);
          setAdmits(admitRes.data || []);
          setLoading(false);
        }
        load();
      }, [slug]);

      const displayName = category?.name || (slug ? slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) : "Category");
      const filtered = exams.filter(e => !search || e.name?.toLowerCase().includes(search.toLowerCase()) || e.full_name?.toLowerCase().includes(search.toLowerCase()));

      return (
        <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "sans-serif" }}>
          <div style={{ background: "linear-gradient(135deg,#1e3a5f,#1e40af)", color: "#fff", padding: "16px" }}>
            <div style={{ maxWidth: 900, margin: "0 auto" }}>
              <a href="/" style={{ color: "#93c5fd", fontSize: 13, textDecoration: "none" }}>← Home</a>
              <h1 style={{ margin: "8px 0 4px", fontSize: 22, fontWeight: 800 }}>{category?.icon || "📁"} {displayName}</h1>
              <p style={{ margin: 0, fontSize: 13, opacity: 0.8 }}>{exams.length} exams</p>
            </div>
          </div>
          <div style={{ maxWidth: 900, margin: "0 auto", padding: "16px" }}>
            <input placeholder={"Search " + displayName + " exams..."} value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 14, marginBottom: 12, boxSizing: "border-box", outline: "none" }} />
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {[["exams","Exams", exams.length], ["results","Results", results.length], ["admits","Admit Cards", admits.length]].map(([key, label, count]) => (
                <button key={key} onClick={() => setTab(key)}
                  style={{ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
                    background: tab === key ? "#1e3a5f" : "#fff", color: tab === key ? "#fff" : "#374151", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                  {label} ({count})
                </button>
              ))}
            </div>
            {loading ? <p style={{ textAlign: "center", color: "#999", padding: 40 }}>Loading...</p> : (
              <>
                {tab === "exams" && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
                    {filtered.map((exam, i) => (
                      <a key={i} href={"/exam/" + exam.id} style={{ textDecoration: "none" }}>
                        <div style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", border: "1px solid #e5e7eb" }}>
                          <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 14, color: "#1e3a5f" }}>{exam.full_name || exam.name}</p>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 11, padding: "2px 8px", background: "#dbeafe", color: "#2563eb", borderRadius: 20, fontWeight: 600 }}>📁 {exam.category}</span>
                            <div style={{ display: "flex", gap: 6 }}>
                            {exam.official_website && (
                              <a href={exam.official_website} target="_blank" rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()}
                                style={{ fontSize: 11, padding: "2px 8px", background: "#1e3a5f", color: "#fff", borderRadius: 6, textDecoration: "none", fontWeight: 700 }}>
                                🌐 Official
                              </a>
                            )}
                            <span style={{ fontSize: 11, color: "#2563eb", fontWeight: 600 }}>Details →</span>
                          </div>
                          </div>
                        </div>
                      </a>
                    ))}
                    {filtered.length === 0 && <p style={{ color: "#999", gridColumn: "1/-1", textAlign: "center", padding: 40 }}>No exams found</p>}
                  </div>
                )}
                {tab === "results" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {results.map((r, i) => (
                      <div key={i} style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div><p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 14, color: "#1e3a5f" }}>✅ {r.exam_name}</p>
                        <span style={{ fontSize: 11, padding: "2px 8px", background: "#dcfce7", color: "#16a34a", borderRadius: 20, fontWeight: 600 }}>Declared</span></div>
                        {r.result_url && <a href={r.result_url} target="_blank" rel="noopener noreferrer" style={{ padding: "8px 14px", background: "#2563eb", color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 12, fontWeight: 700 }}>Official ↗</a>}
                      </div>
                    ))}
                  </div>
                )}
                {tab === "admits" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {admits.map((r, i) => (
                      <div key={i} style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div><p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 14, color: "#1e3a5f" }}>📄 {r.exam_name}</p>
                        <span style={{ fontSize: 11, padding: "2px 8px", background: "#ede9fe", color: "#7c3aed", borderRadius: 20, fontWeight: 600 }}>Released</span></div>
                        {r.download_url && <a href={r.download_url} target="_blank" rel="noopener noreferrer" style={{ padding: "8px 14px", background: "#7c3aed", color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 12, fontWeight: 700 }}>Download ↗</a>}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      );
    }
    