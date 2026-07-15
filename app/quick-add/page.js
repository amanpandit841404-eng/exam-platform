"use client";
    import { useState, useEffect } from "react";
    import { supabase } from "../lib/supabase";

    const CATEGORIES = [
      { name: "SSC Exams", slug: "ssc-exams" },
      { name: "UPSC Civil Services", slug: "upsc-civil-services" },
      { name: "Railway Recruitment", slug: "railway-recruitment" },
      { name: "Banking and Finance", slug: "banking-finance" },
      { name: "State PSC", slug: "state-psc" },
      { name: "State Police", slug: "state-police" },
      { name: "Teaching Exams", slug: "teaching-exams" },
      { name: "Medical Entrance", slug: "medical-entrance" },
      { name: "Engineering Entrance", slug: "engineering-entrance" },
      { name: "Defence and Armed Forces", slug: "defence-armed-forces" },
      { name: "Law Entrance", slug: "law-entrance" },
      { name: "MBA and Management", slug: "mba-management" },
      { name: "School Boards", slug: "school-boards" },
      // Professional Certifications
      { name: "Cloud Computing", slug: "cloud-computing" },
      { name: "Programming & Development", slug: "programming" },
      { name: "Web Development", slug: "web-development" },
      { name: "Mobile App Development", slug: "mobile-development" },
      { name: "Artificial Intelligence", slug: "artificial-intelligence" },
      { name: "Data Science & Analytics", slug: "data-science" },
      { name: "Cyber Security", slug: "cyber-security" },
      { name: "Networking", slug: "networking" },
      { name: "Database", slug: "database" },
      { name: "DevOps & SRE", slug: "devops" },
      { name: "Software Testing", slug: "software-testing" },
      { name: "Project Management", slug: "project-management" },
      { name: "Finance & Accounting", slug: "finance" },
      { name: "Digital Marketing", slug: "digital-marketing" },
      { name: "ERP & Enterprise", slug: "erp-enterprise" },
      { name: "Language Certifications", slug: "language" },
      { name: "Engineering Design", slug: "engineering" },
      { name: "Government Skill Certs", slug: "government-skills" },
      { name: "Emerging Technologies", slug: "emerging-tech" },
      { name: "Healthcare", slug: "healthcare" },
    ];

    export default function QuickAddPage() {
      const [pw, setPw] = useState("");
      const [auth, setAuth] = useState(false);
      const [category, setCategory] = useState("");
      const [examName, setExamName] = useState("");
      const [officialUrl, setOfficialUrl] = useState("");
      const [description, setDescription] = useState("");
      const [msg, setMsg] = useState("");
      const [error, setError] = useState("");

      useEffect(() => {
        const saved = localStorage.getItem("qa_auth");
        if (saved === "sarkari123") setAuth(true);
      }, []);

      const login = () => {
        if (pw === "sarkari123") {
          setAuth(true);
          localStorage.setItem("qa_auth", "sarkari123");
        } else {
          setError("Wrong password!");
        }
      };

      const handleAdd = async () => {
        setMsg(""); setError("");
        if (!examName || !category) {
          setError("Exam name and category required!");
          return;
        }

        try {
          const { error: insertError } = await supabase.from("exams").insert({
            name: examName,
            category: category,
            type: "exam",
            official_website: officialUrl || null,
            description: description || null,
          });

          if (insertError) throw insertError;
          setMsg("✅ Added: " + examName);
          setExamName(""); setOfficialUrl(""); setDescription("");
        } catch (e) {
          setError("Error: " + e.message);
        }
      };

      if (!auth) {
        return (
          <div style={{ padding: 40, textAlign: "center", fontFamily: "sans-serif", minHeight: "100vh", background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ maxWidth: 320, width: "100%" }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: "#1e3a5f" }}>🔐 Quick Add</h1>
              <p style={{ fontSize: 13, color: "#666", marginBottom: 20 }}>Enter password to add data</p>
              <input type="password" placeholder="Password" value={pw} onChange={e => setPw(e.target.value)}
                style={{ width: "100%", padding: "12px 16px", fontSize: 15, border: "1px solid #ddd", borderRadius: 10, marginBottom: 12 }} />
              <button onClick={login}
                style={{ width: "100%", padding: 12, fontSize: 15, fontWeight: 600, background: "#1e3a5f", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer" }}>Login</button>
              {error && <p style={{ color: "#dc2626", fontSize: 13, marginTop: 10 }}>{error}</p>}
            </div>
          </div>
        );
      }

      return (
        <div style={{ padding: 20, fontFamily: "sans-serif", minHeight: "100vh", maxWidth: 500, margin: "0 auto", background: "#f5f5f5" }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1e3a5f", marginBottom: 4 }}>⚡ Quick Add</h1>
          <p style={{ fontSize: 12, color: "#666", marginBottom: 20 }}>Category wise exam/certification add karo</p>

          {msg && <div style={{ background: "#dcfce7", color: "#166534", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 12 }}>{msg}</div>}
          {error && <div style={{ background: "#fee2e2", color: "#991b1b", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 12 }}>{error}</div>}

          <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #e5e7eb" }}>

            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", fontSize: 14, border: "1px solid #ddd", borderRadius: 8, marginBottom: 14 }}>
              <option value="">-- Select Category --</option>
              {CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>

            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Exam / Certification Name *</label>
            <input type="text" placeholder="e.g., AWS Solutions Architect, Python PCAP, NEET UG" value={examName} onChange={e => setExamName(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", fontSize: 14, border: "1px solid #ddd", borderRadius: 8, marginBottom: 14 }} />

            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Official Website Link</label>
            <input type="url" placeholder="e.g., https://aws.amazon.com/certification/" value={officialUrl} onChange={e => setOfficialUrl(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", fontSize: 14, border: "1px solid #ddd", borderRadius: 8, marginBottom: 14 }} />

            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Description (optional)</label>
            <textarea placeholder="Brief description about this exam/certification" value={description} onChange={e => setDescription(e.target.value)} rows={3}
              style={{ width: "100%", padding: "10px 12px", fontSize: 14, border: "1px solid #ddd", borderRadius: 8, marginBottom: 14, resize: "vertical" }} />

            <button onClick={handleAdd}
              style={{ width: "100%", padding: 12, fontSize: 15, fontWeight: 600, background: "#2563eb", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer" }}>
              ➕ Add to Database
            </button>

            <div style={{ marginTop: 16, padding: 12, background: "#f0fdf4", borderRadius: 8, fontSize: 12, color: "#166534" }}>
              <strong>💡 Tips:</strong>
              <ul style={{ margin: "4px 0 0", paddingLeft: 16, lineHeight: 1.8 }}>
                <li>Pehle Category select karo</li>
                <li>Phir exam/certification name daalo</li>
                <li>Official website link add karo (optional)</li>
                <li>Enter dabao — data turant add!</li>
              </ul>
            </div>

            <a href="/" style={{ display: "block", marginTop: 16, textAlign: "center", fontSize: 13, color: "#2563eb", textDecoration: "none" }}>
              ← Back to Website
            </a>
          </div>
        </div>
      );
    }
    