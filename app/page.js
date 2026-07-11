"use client";
    import { useState, useEffect } from "react";
    import { supabase } from "./lib/supabase";

    export default function HomePage() {
      const [latestResults, setLatestResults] = useState([]);
      const [admitCards, setAdmitCards] = useState([]);
      const [upcoming, setUpcoming] = useState([]);
      const [search, setSearch] = useState("");
      const [loading, setLoading] = useState(true);
      const [watchlist, setWatchlist] = useState([]);
      const [lang, setLang] = useState("hi");
  const [dark, setDark] = useState(false);

      useEffect(() => {
        setLang(localStorage.getItem("sarkarisetu_lang") || "hi");
    setDark(localStorage.getItem("sarkarisetu_dark") === "true");
        const saved = JSON.parse(localStorage.getItem("sarkarisetu_watchlist") || "[]");
        setWatchlist(saved);
        fetchData();
      }, []);

      const fetchData = async () => {
        try {
          const [res, adm, upc] = await Promise.all([
            supabase.from("results").select("*").order("created_at", { ascending: false }).limit(25),
            supabase.from("admit_cards").select("*").order("created_at", { ascending: false }).limit(25),
            supabase.from("upcoming_exams").select("*").order("exam_date", { ascending: true }).limit(25),
          ]);
          if (res.data) setLatestResults(res.data);
          if (adm.data) setAdmitCards(adm.data);
          if (upc.data) setUpcoming(upc.data);
        } catch (e) { console.error(e); }
        setLoading(false);
      };

      // Watchlist toggle
      const toggleWatchlist = (name, id) => {
        const exists = watchlist.find(w => w.id === id);
        let next;
        if (exists) {
          next = watchlist.filter(w => w.id !== id);
        } else {
          next = [...watchlist, { name, id }];
        }
        setWatchlist(next);
        localStorage.setItem("sarkarisetu_watchlist", JSON.stringify(next));
      };

      const isWatched = (id) => watchlist.some(w => w.id === id);

      // Countdown
      const getCountdown = (dateStr) => {
        if (!dateStr) return null;
        const target = new Date(dateStr);
        const now = new Date();
        const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
        if (diff < 0) return "Passed";
        if (diff === 0) return "Today!";
        if (diff === 1) return "Tomorrow";
        return diff + " days left";
      };

      // WhatsApp share
      const shareWhatsApp = (text, url) => {
        const fullUrl = url || window.location.href;
        window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + fullUrl)}`, "_blank");
      };

      // Category colors
      const catColors = {
        "SSC Exams": "#2563eb", "UPSC Civil Services": "#7c3aed", "Banking": "#16a34a",
        "Railway": "#ea580c", "Engineering": "#dc2626", "Medical": "#db2777",
        "Defence": "#0d9488", "Teaching": "#d97706", "State PSC": "#6366f1",
        "Law": "#0891b2", "Management": "#65a30d", "Insurance": "#ca8a04"
      };

      const t = (hi, en) => lang === "hi" ? hi : en;

      const categories = Object.keys(catColors);
      const filtered = latestResults.filter(r => !search || r.exam_name?.toLowerCase().includes(search.toLowerCase()));

      return (
        <div style={{ fontFamily: "'Segoe UI',Arial,sans-serif", dark ? "#0f172a" : "#f8fafc", minHeight: "100vh", padding: 12, maxWidth: 900, margin: "0 auto" }}>

          {/* Header */}
          <div style={{ background: "linear-gradient(135deg,#1e3a5f,#2563eb)", borderRadius: 14, padding: "20px 16px", color: "#fff", marginBottom: 16, textAlign: "center" }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>⚡ सरकारीसेतु India</h1>
            <p style={{ fontSize: 13, opacity: 0.85, margin: "4px 0 12px" }}>{t("परीक्षा परिणाम, प्रवेश पत्र और नौकरियां", "Exam Results, Admit Cards & Jobs")}</p>

            {/* Search */}
            <div style={{ display: "flex", gap: 6, maxWidth: 500, margin: "0 auto" }}>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder={t("🔍 परीक्षा खोजें...", "🔍 Search exams...")}
                style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: "none", fontSize: 14, outline: "none" }} />
            </div>
          </div>

          {/* Stats + Quick Links row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 8, marginBottom: 14 }}>
            {[
              { icon: "🏆", label: t("परिणाम", "Results"), count: latestResults.length, href: "/results" },
              { icon: "🎫", label: t("प्रवेश पत्र", "Admits"), count: admitCards.length, href: "/admit-cards" },
              { icon: "📚", label: t("सिलेबस", "Syllabus"), count: "", href: "/syllabus" },
              { icon: "🔑", label: t("उत्तर कुंजी", "Answer Keys"), count: "", href: "/answer-keys" },
              { icon: "📢", label: t("सूचनाएं", "Notif."), count: "", href: "/notifications" },
            ].map(s => (
              <a key={s.label} href={s.href}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "10px 6px",
                  background: dark ? "#1e293b" : "#ffffff", borderRadius: 10, textDecoration: "none", color: dark ? "#e2e8f0" : "#151515",
                  border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <span style={{ fontSize: 22 }}>{s.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 500, textAlign: "center" }}>{s.label}</span>
              </a>
            ))}
          </div>

          {/* Upcoming Exams with Countdown */}
          {upcoming.length > 0 && (
            <div style={{ background: dark ? "#1e293b" : "#ffffff", borderRadius: 12, padding: 16, marginBottom: 14, border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: dark ? "#e2e8f0" : "#151515", margin: 0 }}>
                  ⏰ {t("आगामी परीक्षाएं", "Upcoming Exams")}
                </h2>
                <button onClick={() => shareWhatsApp("Check upcoming exams on SarkariSetu:", window.location.href)}
                  style={{ padding: "4px 10px", background: "#25D366", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>
                  📱 Share
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {upcoming.slice(0, 5).map((e, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "8px 10px", dark ? "#0f172a" : "#f8fafc", borderRadius: 8, border: "1px solid var(--border)" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: dark ? "#e2e8f0" : "#151515" }}>{e.exam_name}</div>
                      <div style={{ fontSize: 11, color: dark ? "#94a3b8" : "#717171" }}>📅 {e.exam_date || "TBA"}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      {e.exam_date && (
                        <div style={{ fontSize: 13, fontWeight: 700,
                          color: getCountdown(e.exam_date)?.includes("left") ? "#16a34a" : "#ea580c" }}>
                          ⏳ {getCountdown(e.exam_date)}
                        </div>
                      )}
                      <div style={{ display: "flex", gap: 4, marginTop: 4, justifyContent: "flex-end" }}>
                        <button onClick={() => shareWhatsApp(`📅 ${e.exam_name} - ${e.exam_date}`, `https://exam-platform-beta.vercel.app/exam/${e.exam_id}`)}
                          style={{ padding: "2px 6px", background: "#25D366", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 10 }}>📱</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <a href="/results" style={{ display: "block", textAlign: "center", marginTop: 8, fontSize: 12, color: "#2563eb", textDecoration: "none" }}>
                {t("सभी देखें →", "View All →")}
              </a>
            </div>
          )}

          {/* Latest Results */}
          <div style={{ background: dark ? "#1e293b" : "#ffffff", borderRadius: 12, padding: 16, marginBottom: 14, border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: dark ? "#e2e8f0" : "#151515", margin: 0 }}>
                🏆 {t("नवीनतम परिणाम", "Latest Results")}
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {filtered.slice(0, 10).map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "8px 10px", dark ? "#0f172a" : "#f8fafc", borderRadius: 8, border: "1px solid var(--border)" }}>
                  <a href={`/exam/${r.exam_id}`} style={{ flex: 1, minWidth: 0, textDecoration: "none" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#2563eb" }}>{r.exam_name}</div>
                    <div style={{ fontSize: 11, color: dark ? "#94a3b8" : "#717171" }}>🏆 Result Declared</div>
                  </a>
                  <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                    <button onClick={() => toggleWatchlist(r.exam_name, r.exam_id)}
                      style={{ padding: "4px 8px", background: "transparent", border: "none", cursor: "pointer", fontSize: 16 }}>
                      {isWatched(r.exam_id) ? "🔔" : "🔕"}
                    </button>
                    <button onClick={() => shareWhatsApp(`🏆 ${r.exam_name} - Result Declared!`, `https://exam-platform-beta.vercel.app/exam/${r.exam_id}`)}
                      style={{ padding: "4px 8px", background: "#25D366", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 11 }}>📱</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admit Cards */}
          <div style={{ background: dark ? "#1e293b" : "#ffffff", borderRadius: 12, padding: 16, marginBottom: 14, border: "1px solid var(--border)" }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: dark ? "#e2e8f0" : "#151515", margin: "0 0 10px" }}>
              🎫 {t("प्रवेश पत्र", "Admit Cards")}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {admitCards.slice(0, 10).map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "8px 10px", dark ? "#0f172a" : "#f8fafc", borderRadius: 8, border: "1px solid var(--border)" }}>
                  <a href={`/exam/${r.exam_id}`} style={{ flex: 1, minWidth: 0, textDecoration: "none" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#ea580c" }}>{r.exam_name}</div>
                    <div style={{ fontSize: 11, color: dark ? "#94a3b8" : "#717171" }}>🎫 Admit Card Released</div>
                  </a>
                  <button onClick={() => shareWhatsApp(`🎫 ${r.exam_name} - Admit Card Released!`, `https://exam-platform-beta.vercel.app/exam/${r.exam_id}`)}
                    style={{ padding: "4px 8px", background: "#25D366", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 11 }}>📱</button>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div style={{ background: dark ? "#1e293b" : "#ffffff", borderRadius: 12, padding: 16, marginBottom: 14, border: "1px solid var(--border)" }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: dark ? "#e2e8f0" : "#151515", margin: "0 0 10px" }}>
              🏷️ {t("श्रेणियां", "Browse by Category")}
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {categories.map(c => (
                <a key={c} href={`/category/${c.toLowerCase().replace(/\s+/g, "-")}`}
                  style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 500,
                    background: catColors[c] + "18", color: catColors[c], border: `1px solid ${catColors[c]}40`,
                    textDecoration: "none" }}>
                  {c}
                </a>
              ))}
            </div>
          </div>

          {/* Watchlist Section */}
          {watchlist.length > 0 && (
            <div style={{ background: dark ? "#1e293b" : "#ffffff", borderRadius: 12, padding: 16, marginBottom: 14, border: "1px solid var(--border)" }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: dark ? "#e2e8f0" : "#151515", margin: "0 0 10px" }}>
                🔔 {t("आपकी सूची", "Your Watchlist")}
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {watchlist.slice(0, 10).map((w, i) => (
                  <a key={i} href={`/exam/${w.id}`}
                    style={{ padding: "6px 12px", borderRadius: 8, fontSize: 12, background: "#2563eb18", color: "#2563eb", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
                    🔔 {w.name?.slice(0, 25)}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{ textAlign: "center", padding: "20px 0", fontSize: 11, color: dark ? "#94a3b8" : "#717171" }}>
            <p>⚡ SarkariSetu India • {t("सरकारी निकाय से संबद्ध नहीं", "Not affiliated with any government body")}</p>
            <p style={{ marginTop: 4 }}>
              <a href="/sitemap.xml" style={{ color: "#2563eb", textDecoration: "none", margin: "0 6px" }}>Sitemap</a>
              <a href="/results" style={{ color: "#2563eb", textDecoration: "none", margin: "0 6px" }}>Results</a>
              <a href="/admit-cards" style={{ color: "#2563eb", textDecoration: "none", margin: "0 6px" }}>Admit Cards</a>
            </p>
          </div>
        </div>
      );
    }
    