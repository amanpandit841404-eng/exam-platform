"use client";
import { useState, useEffect, Suspense } from "react";
import { supabase } from "../lib/supabase";
import { useSearchParams } from "next/navigation";

function SearchContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [tab, setTab] = useState("exams");
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [admits, setAdmits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    document.title = "Search Exams, Results, Admit Cards | SarkariSetu India";
    if (query) doSearch(query);
  }, []);

  const doSearch = async (q) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const [exRes, rRes, aRes] = await Promise.all([
        supabase.from("exams").select("id,name,full_name,category,state,official_website").ilike("name", `%${q}%`).limit(30),
        supabase.from("results").select("*").ilike("exam_name", `%${q}%`).limit(20),
        supabase.from("admit_cards").select("*").ilike("exam_name", `%${q}%`).limit(20),
      ]);
      setExams(exRes.data || []);
      setResults(rRes.data || []);
      setAdmits(aRes.data || []);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    doSearch(query);
  };

  const popular = ["SSC CGL", "UPSC IAS", "IBPS PO", "Railway NTPC", "NEET", "JEE Main", "SBI PO", "NDA"];

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)", color: "#fff", padding: "20px 16px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <a href="/" style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, textDecoration: "none" }}>Home</a>
          <h1 style={{ margin: "8px 0 16px", fontSize: 22, fontWeight: 800 }}>Search Everything</h1>
          <form onSubmit={handleSearch}>
            <div style={{ display: "flex", gap: 8 }}>
              <input value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search exams, results, admit cards..."
                style={{ flex: 1, padding: "12px 16px", borderRadius: 10, border: "none", fontSize: 15, outline: "none" }} />
              <button type="submit" style={{ padding: "12px 20px", background: "#f59e0b", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                Search
              </button>
            </div>
          </form>
          {!searched && (
            <div style={{ marginTop: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
              {popular.map(p => (
                <button key={p} onClick={() => { setQuery(p); doSearch(p); }}
                  style={{ padding: "4px 12px", background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 20, fontSize: 12, cursor: "pointer" }}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {searched && (
        <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
          <div style={{ maxWidth: 800, margin: "0 auto", display: "flex" }}>
            {[
              { id: "exams", label: "Exams", count: exams.length },
              { id: "results", label: "Results", count: results.length },
              { id: "admits", label: "Admit Cards", count: admits.length },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ flex: 1, padding: "12px 8px", border: "none", background: "none", cursor: "pointer", fontSize: 13, fontWeight: 700,
                  color: tab === t.id ? "#2563eb" : "#6b7280",
                  borderBottom: tab === t.id ? "3px solid #2563eb" : "3px solid transparent" }}>
                {t.label} ({t.count})
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "16px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>Searching...</div>
        ) : !searched ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <div style={{ fontSize: 64, marginBottom: 12 }}>🔍</div>
            <h2 style={{ color: "#1e3a5f", fontSize: 18 }}>52,000+ exams search करो</h2>
          </div>
        ) : (
          <div>
            {tab === "exams" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {exams.length === 0 ? <div style={{ textAlign: "center", padding: 40, color: "#6b7280" }}>No exams found</div>
                : exams.map((exam, i) => (
                  <a key={exam.id || i} href={"/exam/" + exam.id} style={{ background: "#fff", borderRadius: 12, padding: 14, border: "1px solid #e5e7eb", textDecoration: "none", display: "block" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 14, color: "#1e3a5f" }}>{exam.name}</p>
                        {exam.full_name && exam.full_name !== exam.name && <p style={{ margin: "0 0 6px", fontSize: 12, color: "#6b7280" }}>{exam.full_name}</p>}
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {exam.category && <span style={{ fontSize: 11, padding: "2px 8px", background: "#eff6ff", color: "#2563eb", borderRadius: 10 }}>{exam.category}</span>}
                          {exam.state && <span style={{ fontSize: 11, padding: "2px 8px", background: "#f3f4f6", color: "#6b7280", borderRadius: 10 }}>{exam.state}</span>}
                        </div>
                      </div>
                      {exam.official_website && (
                        <a href={exam.official_website} target="_blank" rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          style={{ marginLeft: 8, padding: "7px 12px", background: "linear-gradient(135deg,#1e3a5f,#2563eb)", color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0 }}>
                          🌐 Official ↗
                        </a>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            )}
            {tab === "results" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {results.length === 0 ? <div style={{ textAlign: "center", padding: 40, color: "#6b7280" }}>No results found</div>
                : results.map((r, i) => (
                  <div key={r.id || i} style={{ background: "#fff", borderRadius: 12, padding: 14, border: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 14, color: "#1e3a5f" }}>{r.exam_name || r.title}</p>
                      <span style={{ fontSize: 11, padding: "2px 8px", background: "#dcfce7", color: "#16a34a", borderRadius: 10, fontWeight: 700 }}>Declared</span>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {r.result_url && <a href={r.result_url} target="_blank" rel="noopener noreferrer" style={{ padding: "6px 12px", background: "#16a34a", color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 12, fontWeight: 700 }}>Official</a>}
                      <a href={"/results/" + r.id} style={{ padding: "6px 12px", background: "#f3f4f6", color: "#1e3a5f", borderRadius: 8, textDecoration: "none", fontSize: 12 }}>Details</a>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {tab === "admits" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {admits.length === 0 ? <div style={{ textAlign: "center", padding: 40, color: "#6b7280" }}>No admit cards found</div>
                : admits.map((c, i) => (
                  <div key={c.id || i} style={{ background: "#fff", borderRadius: 12, padding: 14, border: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 14, color: "#1e3a5f" }}>{c.exam_name || c.title}</p>
                      <span style={{ fontSize: 11, padding: "2px 8px", background: "#fff7ed", color: "#ea580c", borderRadius: 10, fontWeight: 700 }}>Available</span>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {c.download_url && <a href={c.download_url} target="_blank" rel="noopener noreferrer" style={{ padding: "6px 12px", background: "#ea580c", color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 12, fontWeight: 700 }}>Download</a>}
                      <a href={"/admit-cards/" + c.id} style={{ padding: "6px 12px", background: "#f3f4f6", color: "#1e3a5f", borderRadius: 8, textDecoration: "none", fontSize: 12 }}>Details</a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return <Suspense fallback={<div style={{ textAlign: "center", padding: 60 }}>Loading...</div>}><SearchContent /></Suspense>;
}
