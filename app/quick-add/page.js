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
      const [tab, setTab] = useState("add");
      const [category, setCategory] = useState("");
      const [examName, setExamName] = useState("");
      const [officialUrl, setOfficialUrl] = useState("");
      const [description, setDescription] = useState("");
      const [msg, setMsg] = useState("");
      const [error, setError] = useState("");
      const [items, setItems] = useState([]);
      const [loading, setLoading] = useState(false);

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
          setMsg("Added: " + examName);
          setExamName(""); setOfficialUrl(""); setDescription("");
        } catch (e) {
          setError("Error: " + e.message);
        }
      };

      const loadItems = async () => {
        if (!category) { setError("Select a category first!"); return; }
        setLoading(true); setError(""); setMsg("");
        try {
          const { data, error: fetchError } = await supabase
            .from("exams")
            .select("id, name, official_website")
            .eq("category", category)
            .order("name", { ascending: true });
          if (fetchError) throw fetchError;
          setItems(data || []);
          if (!data || data.length === 0) setMsg("No items in this category");
        } catch (e) {
          setError("Error: " + e.message);
        }
        setLoading(false);
      };

      const deleteItem = async (id, name) => {
        if (!confirm("Delete: " + name + "?")) return;
        try {
          const { error: delError } = await supabase.from("exams").delete().eq("id", id);
          if (delError) throw delError;
          setMsg("Deleted: " + name);
          setItems(items.filter(i => i.id !== id));
        } catch (e) {
          setError("Error: " + e.message);
        }
      };

      if (!auth) {
        return (
          <div style={{ padding: 40, textAlign: "center", fontFamily: "sans-serif", minHeight: "100vh", background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ maxWidth: 320, width: "100%" }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: "#1e3a5f" }}>Quick Add</h1>
              <p style={{ fontSize: 13, color: "#666", marginBottom: 20 }}>Enter password to manage data</p>
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
        <div style={{ padding: 16, fontFamily: "sans-serif", minHeight: "100vh", maxWidth: 500, margin: "0 auto", background: "#f5f5f5" }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1e3a5f", marginBottom: 4 }}>Quick Add</h1>
          <p style={{ fontSize: 12, color: "#666", marginBottom: 16 }}>Category wise exam/certification manage karo</p>

          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <button onClick={() => setTab("add")}
              style={{ flex: 1, padding: "10px", fontSize: 13, fontWeight: 600, background: tab === "add" ? "#2563eb" : "#e5e7eb", color: tab === "add" ? "#fff" : "#374151", border: "none", borderRadius: 8, cursor: "pointer" }}>Add</button>
            <button onClick={() => setTab("delete")}
              style={{ flex: 1, padding: "10px", fontSize: 13, fontWeight: 600, background: tab === "delete" ? "#dc2626" : "#e5e7eb", color: tab === "delete" ? "#fff" : "#374151", border: "none", borderRadius: 8, cursor: "pointer" }}>Delete</button>
          </div>

          {msg && <div style={{ background: "#dcfce7", color: "#166534", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 12 }}>{msg}</div>}
          {error && <div style={{ background: "#fee2e2", color: "#991b1b", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 12 }}>{error}</div>}

          <div style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #e5e7eb" }}>

            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Category</label>
            <select value={category} onChange={e => { setCategory(e.target.value); setItems([]); }}
              style={{ width: "100%", padding: "10px 12px", fontSize: 14, border: "1px solid #ddd", borderRadius: 8, marginBottom: 14 }}>
              <option value="">-- Select Category --</option>
              {CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>

            {tab === "add" && (
              <>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Exam / Certification Name</label>
                <input type="text" placeholder="e.g., AWS Solutions Architect" value={examName} onChange={e => setExamName(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", fontSize: 14, border: "1px solid #ddd", borderRadius: 8, marginBottom: 14 }} />

                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Official Website Link</label>
                <input type="url" placeholder="https://..." value={officialUrl} onChange={e => setOfficialUrl(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", fontSize: 14, border: "1px solid #ddd", borderRadius: 8, marginBottom: 14 }} />

                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Description</label>
                <textarea placeholder="Optional" value={description} onChange={e => setDescription(e.target.value)} rows={2}
                  style={{ width: "100%", padding: "10px 12px", fontSize: 14, border: "1px solid #ddd", borderRadius: 8, marginBottom: 14, resize: "vertical" }} />

                <button onClick={handleAdd}
                  style={{ width: "100%", padding: 12, fontSize: 15, fontWeight: 600, background: "#2563eb", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer" }}>
                  Add to Database
                </button>
              </>
            )}

            {tab === "delete" && (
              <>
                <button onClick={loadItems} disabled={loading}
                  style={{ width: "100%", padding: 10, fontSize: 14, fontWeight: 600, background: "#374151", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", marginBottom: 12 }}>
                  {loading ? "Loading..." : "Load Items in this Category"}
                </button>

                {items.length > 0 && (
                  <div style={{ maxHeight: 400, overflowY: "auto" }}>
                    {items.map(item => (
                      <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "1px solid #e5e7eb" }}>
                        <span style={{ flex: 1, fontSize: 13, color: "#374151" }}>{item.name}</span>
                        <button onClick={() => deleteItem(item.id, item.name)}
                          style={{ padding: "6px 12px", fontSize: 12, fontWeight: 600, background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 6, cursor: "pointer" }}>
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          <div style={{ marginTop: 12, padding: 10, background: "#f0fdf4", borderRadius: 8, fontSize: 11, color: "#166534", lineHeight: 1.6 }}>
            <strong>Tips:</strong> Pehle category select karo. Add tab se add karo. Delete tab me items load karke delete karo.
          </div>

          <a href="/" style={{ display: "block", marginTop: 12, textAlign: "center", fontSize: 13, color: "#2563eb", textDecoration: "none" }}>
            Back to Website
          </a>
        </div>
      );
    }
    