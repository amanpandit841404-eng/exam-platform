"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { ENRICHMENT } from "../../enrichment-data";

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

export default function CertDetail() {
  const params = useParams();
  const categorySlug = params?.category || "";
  const certSlug = params?.cert || "";
  const [certs, setCerts] = useState([]);
  const [cats, setCats] = useState([]);
  const [study, setStudy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);

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
      } catch (e) {} finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!categorySlug) return;
    fetch("/certifications-data/" + categorySlug + ".json")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setStudy(d))
      .catch(() => {});
  }, [categorySlug]);

  const catName = useMemo(() => {
    const match = cats.find(([c]) => slugify(c) === categorySlug);
    return match ? match[0] : null;
  }, [cats, categorySlug]);

  const cert = useMemo(() => {
    if (!catName) return null;
    return certs.find((c) => (c.category || "").replace("Professional Certification - ", "") === catName && slugify(c.name) === certSlug) || null;
  }, [certs, catName, certSlug]);

  const others = useMemo(() => {
    if (!catName || !cert) return [];
    return certs.filter((c) => (c.category || "").replace("Professional Certification - ", "") === catName && c.name !== cert.name);
  }, [certs, catName, cert]);

  const enrich = cert ? ENRICHMENT[cert.name] || ["", ""] : ["", ""];
  const org = enrich[0] || "";
  const shortDesc = ((cert?.description || enrich[1] || "").trim());
  const studyEntry = study && cert ? study.entries[cert.name] : null;
  const fees = studyEntry?.fees || "";
  const format = studyEntry?.format || "";
  const validity = studyEntry?.validity || "";
  const studySite = studyEntry?.site || cert?.official_website || "";
  const overview = studyEntry?.overview || shortDesc || "";

  useEffect(() => {
    if (cert && catName) {
      document.title = cert.name + " - " + catName + " Certification (Fees, Exam Pattern) | SarkariSetu India";
      const meta = document.querySelector('meta[name="description"]');
      if (meta) {
        const base = overview
          ? overview + ". "
          : cert.name + " (" + catName + ") ki poori jankari. ";
        meta.content = base + "Exam fees, pattern, validity aur official website — SarkariSetu India Certification Center.";
      }
    }
  }, [cert, catName, overview]);

  const shareWA = () => {
    if (!cert) return;
    const text = encodeURIComponent(cert.name + " - " + catName + " Certification | SarkariSetu India");
    window.open("https://wa.me/?text=" + text + "%0A" + encodeURIComponent(window.location.href));
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const bg = darkMode ? "#0f172a" : "#f1f5f9";
  const cardBg = darkMode ? "#1e293b" : "#ffffff";
  const textMain = darkMode ? "#f1f5f9" : "#1e3a5f";
  const textSub = darkMode ? "#94a3b8" : "#6b7280";
  const border = darkMode ? "#334155" : "#e5e7eb";

  if (loading) {
    return <div style={{ minHeight: "100vh", background: bg, fontFamily: "sans-serif", display: "flex", alignItems: "center", justifyContent: "center", color: textSub }}>Loading...</div>;
  }

  if (!cert || !catName) {
    return (
      <div style={{ minHeight: "100vh", background: bg, fontFamily: "sans-serif", padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 40 }}>🤔</div>
        <h1 style={{ fontSize: 18, color: textMain }}>Certification nahi mili</h1>
        <a href="/certifications" style={{ color: "#2563eb", textDecoration: "none", fontSize: 14 }}>← Saari Certifications dekhen</a>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: bg, fontFamily: "sans-serif", paddingBottom: 70 }}>
      <div style={{ background: "linear-gradient(135deg,#1e3a5f,#2a5a8f)", padding: "18px 16px 16px", color: "#fff" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <a href={"/certifications/" + slugify(catName)} style={{ color: "#cbd5e1", textDecoration: "none", fontSize: 12 }}>← {catName} Certifications</a>
          <h1 style={{ fontSize: 19, fontWeight: 800, margin: "6px 0 4px", lineHeight: 1.35 }}>{CAT_EMOJI[catName] || "📘"} {cert.name}</h1>
          <div style={{ fontSize: 12.5, color: "#cbd5e1" }}>{catName} Certification · All India</div>
        </div>
      </div>

      <div style={{ padding: "14px 16px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
          <a href={"/certifications/" + slugify(catName)} style={{ padding: "7px 13px", fontSize: 11.5, fontWeight: 700, borderRadius: 20, textDecoration: "none", background: darkMode ? "#334155" : "#dbeafe", color: darkMode ? "#93c5fd" : "#1e40af", border: "1px solid " + border }}>{CAT_EMOJI[catName] || "📘"} {catName}</a>
          <span style={{ padding: "7px 13px", fontSize: 11.5, fontWeight: 700, borderRadius: 20, background: darkMode ? "#334155" : "#f0fdf4", color: darkMode ? "#86efac" : "#166534", border: "1px solid " + border }}>📍 All India</span>
        </div>

        <div style={{ background: cardBg, border: "1px solid " + border, borderRadius: 14, padding: "16px", marginBottom: 12 }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: textMain, margin: "0 0 10px" }}>📌 Certification Jankari</h2>
          {org && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid " + border }}>
              <span style={{ fontSize: 13, color: textSub }}>🏢 Issuing Organization</span>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: textMain, textAlign: "right", paddingLeft: 12 }}>{org}</span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid " + border }}>
            <span style={{ fontSize: 13, color: textSub }}>📂 Category</span>
            <a href={"/certifications/" + slugify(catName)} style={{ fontSize: 13.5, fontWeight: 700, color: "#2563eb", textDecoration: "none" }}>{catName}</a>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid " + border }}>
            <span style={{ fontSize: 13, color: textSub }}>📍 State</span>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: textMain }}>All India</span>
          </div>
          {fees && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid " + border }}>
              <span style={{ fontSize: 13, color: textSub, flexShrink: 0 }}>💰 Exam Fees</span>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: textMain, textAlign: "right", paddingLeft: 12 }}>{fees}</span>
            </div>
          )}
          {format && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid " + border }}>
              <span style={{ fontSize: 13, color: textSub, flexShrink: 0 }}>📝 Exam Format</span>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: textMain, textAlign: "right", paddingLeft: 12 }}>{format}</span>
            </div>
          )}
          {validity && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid " + border }}>
              <span style={{ fontSize: 13, color: textSub, flexShrink: 0 }}>⏳ Validity</span>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: textMain, textAlign: "right", paddingLeft: 12 }}>{validity}</span>
            </div>
          )}
          {studySite ? (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0" }}>
              <span style={{ fontSize: 13, color: textSub }}>🌐 Official Website</span>
              <a href={studySite} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13.5, fontWeight: 700, color: "#2563eb", textDecoration: "none" }}>Visit ↗</a>
            </div>
          ) : (
            <div style={{ padding: "9px 0" }}>
              <span style={{ fontSize: 13, color: textSub }}>🌐 Official Website</span>
              <div style={{ fontSize: 12, color: textSub, marginTop: 4 }}>Official website ka link jald add kiya jayega.</div>
            </div>
          )}
        </div>

        <div style={{ background: cardBg, border: "1px solid " + border, borderRadius: 14, padding: "16px", marginBottom: 12 }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: textMain, margin: "0 0 8px" }}>📖 Kya hai ye Certification?</h2>
          <p style={{ fontSize: 13.5, color: textSub, lineHeight: 1.7, margin: 0 }}>
            {overview
              ? overview + ". Ye ek professional certification hai jo India aur global market mein maanya jata hai. Iski official website, syllabus aur exam details SarkariSetu India par update ki jati hain."
              : cert.name + " ek professional certification hai jo " + catName + " category mein aati hai. Iski official website, syllabus, exam pattern aur fees details jald add ki jayengi. Tab tak aap niche di gayi related certifications dekh sakte hain."}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          <button onClick={shareWA} style={{ padding: "12px", fontSize: 13, fontWeight: 700, border: "none", borderRadius: 12, background: "#25d366", color: "#fff", cursor: "pointer" }}>📲 WhatsApp par Share</button>
          <button onClick={copyLink} style={{ padding: "12px", fontSize: 13, fontWeight: 700, border: "1px solid " + border, borderRadius: 12, background: cardBg, color: textMain, cursor: "pointer" }}>{copied ? "✅ Link Copy Ho Gaya" : "🔗 Link Copy Karein"}</button>
        </div>

        <div style={{ fontSize: 11.5, color: textSub, background: darkMode ? "#1e293b" : "#f8fafc", border: "1px solid " + border, borderRadius: 10, padding: "10px 14px", marginBottom: 14 }}>
          ℹ️ Fees aur exam format अनुमानित हैं (Aug 2026 update)। Latest syllabus, fees aur dates ke liye official website zaroor check karein.
        </div>

        {others.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: textMain, marginBottom: 10 }}>📜 Isi Category ki Aur Certifications ({others.length})</h2>
            {others.slice(0, 12).map((c, i) => (
              <a key={i} href={"/certifications/" + slugify(catName) + "/" + slugify(c.name)} style={{ display: "block", background: cardBg, border: "1px solid " + border, borderRadius: 10, padding: "10px 14px", marginBottom: 8, fontSize: 13, fontWeight: 600, color: textMain, textDecoration: "none" }}>
                {c.name}
              </a>
            ))}
          </div>
        )}

        <div>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: textMain, marginBottom: 10 }}>🗂️ Doosri Categories</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {cats.filter(([c]) => c !== catName).map(([c, n]) => (
              <a key={c} href={"/certifications/" + slugify(c)} style={{ padding: "7px 13px", fontSize: 11.5, fontWeight: 700, borderRadius: 20, textDecoration: "none", background: darkMode ? "#334155" : "#ffffff", color: darkMode ? "#e2e8f0" : "#1e3a5f", border: "1px solid " + border, whiteSpace: "nowrap" }}>
                {CAT_EMOJI[c] || "📘"} {c} ({n})
              </a>
            ))}
          </div>
        </div>

        <div style={{ textAlign: "center", fontSize: 11.5, color: textSub, padding: "16px 0 0" }}>
          SarkariSetu India — India's #1 Exam Intelligence Platform
        </div>
      </div>
    </div>
  );
}
