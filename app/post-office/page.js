"use client";

import { useEffect, useState } from "react";

const slugify = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function PostOffice() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.title = "Post Office Exams Center - GDS, Postman, MTS, PA | SarkariSetu India";
    const saved = localStorage.getItem("sarkari-dark-mode");
    if (saved === "true") setDarkMode(true);
    async function load() {
      try {
        const res = await fetch("/post-office-data/exams.json");
        const j = await res.json();
        setData(j);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const bg = darkMode ? "#0f172a" : "#f1f5f9";
  const cardBg = darkMode ? "#1e293b" : "#ffffff";
  const textMain = darkMode ? "#f1f5f9" : "#1e3a5f";
  const textSub = darkMode ? "#94a3b8" : "#6b7280";
  const border = darkMode ? "#334155" : "#e5e7eb";

  const exams = data?.exams || [];
  const q = search.trim().toLowerCase();
  const filtered = exams.filter((e) => !q || e.name.toLowerCase().includes(q) || e.fullName.toLowerCase().includes(q) || e.tags.join(" ").toLowerCase().includes(q));

  return (
    <div style={{ minHeight: "100vh", background: bg, fontFamily: "sans-serif", paddingBottom: 80 }}>
      <div style={{ background: "linear-gradient(135deg,#064e3b,#10b981)", padding: "18px 16px 16px", color: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 13, opacity: 0.9 }}>📮 डाक विभाग भर्ती</div>
          <h1 style={{ margin: "6px 0", fontSize: 24, fontWeight: 800 }}>Post Office Exams Center</h1>
          <div style={{ fontSize: 13, opacity: 0.92, lineHeight: 1.5 }}>
            GDS, Postman, Mail Guard, MTS, Postal Assistant, IPPB — सभी post office exams की पूरी जानकारी एक जगह।
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "14px 14px 0" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 14 }}>
          {[
            ["📋", exams.length || 12, "Major Posts"],
            ["📮", "1.5L+", "GDS Posts हर साल"],
            ["✅", "10", "Merit-Based"],
          ].map(([ic, n, l]) => (
            <div key={l} style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 14, padding: "12px 8px", textAlign: "center" }}>
              <div style={{ fontSize: 20 }}>{ic}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: textMain }}>{n}</div>
              <div style={{ fontSize: 11, color: textSub }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          {[
            ["/results", "🏆 Post Office Results"],
            ["/admit-cards", "📄 Admit Card"],
            ["/search", "🔍 Search Exams"],
            ["/syllabus", "📚 Syllabus"],
            ["/notifications", "🔔 Updates"],
            ["https://indiapost.gov.in", "🌐 Official India Post"],
          ].map(([href, label]) => (
            <a key={href + label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
              style={{ textDecoration: "none", background: cardBg, border: `1px solid ${border}`, color: textMain, fontSize: 12.5, fontWeight: 700, padding: "8px 12px", borderRadius: 999 }}>
              {label}
            </a>
          ))}
        </div>

        {/* Search */}
        <div style={{ marginBottom: 14 }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 खोजें — GDS, Postman, MTS, PA, IPPB..."
            style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 12, border: `1px solid ${border}`, background: darkMode ? "#1e293b" : "#fff", color: textMain, fontSize: 14, outline: "none" }}
          />
        </div>

        {/* Exam cards */}
        {loading ? (
          <div style={{ textAlign: "center", color: textSub, padding: 40 }}>⏳ लोड हो रहा है...</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: 12 }}>
            {filtered.map((e) => (
              <a key={e.slug} href={`/post-office/${e.slug}`} style={{ textDecoration: "none", background: cardBg, border: `1px solid ${border}`, borderRadius: 16, padding: 14, display: "block", transition: "transform 0.15s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ fontSize: 28 }}>{e.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15.5, fontWeight: 800, color: textMain }}>{e.name}</div>
                    <div style={{ fontSize: 11, color: textSub, marginTop: 2 }}>{e.fullName.length > 52 ? e.fullName.slice(0, 52) + "..." : e.fullName}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "10px 0 8px" }}>
                  {e.tags.slice(0, 3).map((t) => (
                    <span key={t} style={{ fontSize: 10.5, background: darkMode ? "#334155" : "#f1f5f9", color: textSub, padding: "3px 8px", borderRadius: 999, fontWeight: 700 }}>{t}</span>
                  ))}
                </div>
                <div style={{ fontSize: 11.5, color: textSub, lineHeight: 1.45 }}>
                  💰 {e.examFee.split("•")[0].trim()}
                </div>
                <div style={{ fontSize: 11.5, color: "#10b981", marginTop: 8, fontWeight: 700 }}>Details देखें →</div>
              </a>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", color: textSub, padding: 30 }}>😕 कोई exam नहीं मिला</div>
        )}

        {/* Extras */}
        {data?.services?.length > 0 && (
          <div style={{ marginTop: 22 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: textMain, margin: "0 0 10px" }}>📮 India Post — Official Portals</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 10 }}>
              {data.services.map((b) => (
                <a key={b.name} href={b.site} target="_blank" rel="noreferrer" style={{ textDecoration: "none", background: cardBg, border: `1px solid ${border}`, borderRadius: 12, padding: "11px 13px", display: "block" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: textMain }}>{b.name}</div>
                  <div style={{ fontSize: 11, color: "#10b981", marginTop: 3 }}>{b.site.replace("https://", "")} ↗</div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Info note */}
        <div style={{ marginTop: 20, background: darkMode ? "#1e293b" : "#fff7ed", border: "1px solid " + (darkMode ? "#334155" : "#fed7aa"), borderRadius: 14, padding: "14px 16px" }}>
          <div style={{ fontSize: 13.5, fontWeight: 800, color: textMain }}>⚠️ ज़रूरी बात</div>
          <div style={{ fontSize: 12.5, color: textSub, lineHeight: 1.6, marginTop: 5 }}>
            {data?.note || "सभी जानकारी अनुमानित है। फीस, तारीखें और पैटर्न बदल सकते हैं — हमेशा rrb.gov.in पर official notification ज़रूर चेक करें।"}
          </div>
        </div>

        <div style={{ textAlign: "center", color: textSub, fontSize: 11.5, marginTop: 22, lineHeight: 1.6 }}>
          📮 SarkariSetu India — आपका डाक विभाग का पूरा साथी<br />अगली India Post notification की तैयारी आज से शुरू करें!
        </div>
      </div>
    </div>
  );
}
