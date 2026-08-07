"use client";

    import { useEffect, useState, useMemo } from "react";
    import { useParams } from "next/navigation";
    import { supabase } from "../../lib/supabase";

    const CAT_EMOJI = {
      "Cloud Computing": "☁️", "Programming & Development": "💻", "Web Development": "🌐",
      "Mobile App Development": "📱", "Artificial Intelligence": "🤖", "Data Science & Analytics": "📊",
      "Cyber Security": "🔐", "Networking": "🌐", "Database": "🗄️", "DevOps & SRE": "⚙️",
      "Software Architecture": "🏗️", "Software Testing": "🧪", "Project Management": "📋",
      "Finance & Accounting": "💰", "Law & Compliance": "⚖️", "Human Resources": "👥",
      "Healthcare": "🏥", "Engineering": "🛠️", "Design": "🎨", "Digital Marketing": "📣",
      "Supply Chain & Logistics": "🚚", "ERP & Enterprise": "🏢", "Hospitality & Tourism": "🏨",
      "Aviation": "✈️", "Maritime": "🚢", "Language Certifications": "🗣️",
      "Education & Teaching": "🎓", "Government Skill Certifications": "🏛️", "Emerging Technologies": "🚀"
    };

    const slugify = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    export default function CertCategory() {
      const params = useParams();
      const slug = params?.category || "";
      const [certs, setCerts] = useState([]);
      const [cats, setCats] = useState([]);
      const [loading, setLoading] = useState(true);
      const [darkMode, setDarkMode] = useState(false);

      useEffect(() => {
        const saved = localStorage.getItem("sarkari-dark-mode");
        if (saved === "true") setDarkMode(true);
        async function load() {
          try {
            const { data } = await supabase
              .from("exams")
              .select("name, category, official_website, description")
              .ilike("category", "Professional Certification%")
              .eq("is_active", true)
              .order("name");
            if (data) {
              setCerts(data);
              const m = {};
              data.forEach((c) => {
                const k = (c.category || "").replace("Professional Certification - ", "");
                m[k] = (m[k] || 0) + 1;
              });
              setCats(Object.entries(m).sort((a, b) => b[1] - a[1]));
            }
          } catch (e) {
          } finally {
            setLoading(false);
          }
        }
        load();
      }, []);

      const catName = useMemo(() => {
        const match = cats.find(([c]) => slugify(c) === slug);
        return match ? match[0] : null;
      }, [cats, slug]);

      const list = useMemo(() => {
        if (!catName) return [];
        return certs.filter((c) => (c.category || "").replace("Professional Certification - ", "") === catName);
      }, [certs, catName]);

      useEffect(() => {
        if (catName) document.title = catName + " Certifications List - SarkariSetu India";
      }, [catName]);

      const bg = darkMode ? "#0f172a" : "#f1f5f9";
      const cardBg = darkMode ? "#1e293b" : "#ffffff";
      const textMain = darkMode ? "#f1f5f9" : "#1e3a5f";
      const textSub = darkMode ? "#94a3b8" : "#6b7280";
      const border = darkMode ? "#334155" : "#e5e7eb";

      if (loading) {
        return <div style={{ minHeight: "100vh", background: bg, fontFamily: "sans-serif", display: "flex", alignItems: "center", justifyContent: "center", color: textSub }}>Loading...</div>;
      }

      if (!catName) {
        return (
          <div style={{ minHeight: "100vh", background: bg, fontFamily: "sans-serif", padding: 40, textAlign: "center" }}>
            <div style={{ fontSize: 40 }}>🤔</div>
            <h1 style={{ fontSize: 18, color: textMain }}>Category नहीं मिली</h1>
            <a href="/certifications" style={{ color: "#2563eb", textDecoration: "none", fontSize: 14 }}>← सभी Certifications देखें</a>
          </div>
        );
      }

      return (
        <div style={{ minHeight: "100vh", background: bg, fontFamily: "sans-serif", paddingBottom: 70 }}>
          <div style={{ background: "linear-gradient(135deg,#1e3a5f,#2a5a8f)", padding: "18px 16px 16px", color: "#fff" }}>
            <div style={{ maxWidth: 1000, margin: "0 auto" }}>
              <a href="/certifications" style={{ color: "#cbd5e1", textDecoration: "none", fontSize: 12 }}>← सभी Certifications</a>
              <h1 style={{ fontSize: 20, fontWeight: 800, margin: "6px 0 4px" }}>{CAT_EMOJI[catName] || "📘"} {catName} Certifications</h1>
              <div style={{ fontSize: 12.5, color: "#cbd5e1" }}>{list.length} certifications · SarkariSetu India Certification Center</div>
            </div>
          </div>

          <div style={{ padding: "14px 16px", maxWidth: 1000, margin: "0 auto" }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: textMain, marginBottom: 10 }}>📜 {catName} की सारी Certifications ({list.length})</h2>
            {list.map((c, i) => (
              <div key={i} style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 10, padding: "11px 14px", marginBottom: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: textMain }}>{c.name}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 6, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontSize: 10.5, background: darkMode ? "#334155" : "#dbeafe", color: darkMode ? "#93c5fd" : "#1e40af", padding: "3px 9px", borderRadius: 20 }}>{catName}</span>
                  {c.official_website && (
                    <a href={c.official_website} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#2563eb", textDecoration: "none" }}>Official Website ↗</a>
                  )}
                  {c.description && <span style={{ fontSize: 11.5, color: textSub }}>{c.description}</span>}
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: "6px 16px 16px", maxWidth: 1000, margin: "0 auto" }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: textMain, marginBottom: 10 }}>🗂️ दूसरी Categories</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {cats.filter(([c]) => c !== catName).map(([c, n]) => (
                <a key={c} href={`/certifications/${slugify(c)}`} style={{
                  padding: "7px 13px", fontSize: 11.5, fontWeight: 700, borderRadius: 20, textDecoration: "none",
                  background: darkMode ? "#334155" : "#ffffff", color: darkMode ? "#e2e8f0" : "#1e3a5f",
                  border: `1px solid ${border}`, whiteSpace: "nowrap"
                }}>
                  {CAT_EMOJI[c] || "📘"} {c} ({n})
                </a>
              ))}
            </div>
          </div>

          <div style={{ textAlign: "center", fontSize: 11.5, color: textSub, padding: "0 16px 10px" }}>
            SarkariSetu India — India's #1 Exam Intelligence Platform
          </div>
        </div>
      );
    }
    