"use client";
    import { useState } from "react";
    import { supabase } from "../lib/supabase";

    export default function QuickAddPage() {
      const [pw, setPw] = useState("");
      const [auth, setAuth] = useState(false);
      const [examName, setExamName] = useState("");
      const [type, setType] = useState("result");
      const [msg, setMsg] = useState("");
      const [error, setError] = useState("");

      const login = () => {
        if (pw === "sarkari123") setAuth(true);
        else setError("Wrong password!");
      };

      const quickAdd = async () => {
        if (!examName.trim()) return setError("Exam name required!");
        setMsg("");
        setError("");

        try {
          if (type === "result") {
            const { error } = await supabase.from("results").insert({
              exam_name: examName.trim(),
              result_title: "Result Declared",
              status: "declared",
            });
            if (error) throw error;
          } else if (type === "admit_card") {
            const { error } = await supabase.from("admit_cards").insert({
              exam_name: examName.trim(),
              title: "Admit Card Released",
              status: "released",
            });
            if (error) throw error;
          } else {
            const { error } = await supabase.from("updates").insert({
              title: examName.trim(),
              update_type: type,
              description: "Quick added from SarkariResult",
              is_verified: true,
            });
            if (error) throw error;
          }

          setMsg("✅ Added successfully!");
          setExamName("");
        } catch (e) {
          setError("Error: " + e.message);
        }
      };

      if (!auth) {
        return (
          <div style={{ fontFamily: "Arial,sans-serif", maxWidth: 380, margin: "100px auto", padding: 20, textAlign: "center" }}>
            <h1 style={{ color: "#2563eb", fontSize: 22 }}>⚡ Quick Add</h1>
            <input type="password" value={pw} onChange={e => setPw(e.target.value)}
              onKeyDown={e => e.key === "Enter" && login()}
              style={{ width: "100%", padding: 12, fontSize: 16, border: "1px solid #ccc", borderRadius: 8, margin: "8px 0" }}
              placeholder="Password" />
            <button onClick={login} style={{ width: "100%", padding: 12, background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, fontSize: 16, cursor: "pointer" }}>Login</button>
            {error && <p style={{ color: "red", fontSize: 13 }}>{error}</p>}
          </div>
        );
      }

      return (
        <div style={{ fontFamily: "Arial,sans-serif", maxWidth: 500, margin: "40px auto", padding: 16 }}>
          <h1 style={{ fontSize: 20, color: "#2563eb" }}>⚡ Quick Add from SarkariResult</h1>
          <p style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>
            1. SarkariResult dekho → 2. Yahan type karo → 3. Add! Done!
          </p>

          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            {[
              { key: "result", label: "🏆 Result" },
              { key: "admit_card", label: "🎫 Admit Card" },
              { key: "general", label: "📢 Update" },
            ].map(t => (
              <button key={t.key} onClick={() => setType(t.key)}
                style={{ flex: 1, padding: "8px 4px", borderRadius: 8, border: type === t.key ? "2px solid #2563eb" : "1px solid #ccc",
                  background: type === t.key ? "#eff6ff" : "#fff", cursor: "pointer", fontSize: 12, fontWeight: 500 }}>
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 6 }}>
            <input value={examName} onChange={e => setExamName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && quickAdd()}
              placeholder={type === "result" ? 'e.g. "UP Police Constable Result 2026"' : type === "admit_card" ? 'e.g. "RRB NTPC Admit Card 2026"' : 'e.g. "SSC CGL Syllabus Updated"'}
              style={{ flex: 1, padding: "10px 12px", fontSize: 14, border: "1px solid #ccc", borderRadius: 8, outline: "none" }}
              autoFocus />
            <button onClick={quickAdd}
              style={{ padding: "10px 20px", background: "#16a34a", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              ➕ Add
            </button>
          </div>

          {msg && <p style={{ color: "#16a34a", marginTop: 12, fontSize: 14, fontWeight: 600 }}>{msg}</p>}
          {error && <p style={{ color: "#dc2626", marginTop: 12, fontSize: 13 }}>{error}</p>}

          <div style={{ marginTop: 24, background: "#f9fafb", padding: 12, borderRadius: 8, fontSize: 12, color: "#666" }}>
            <strong style={{ color: "#333" }}>💡 Tips:</strong>
            <ul style={{ margin: "4px 0 0", paddingLeft: 16 }}>
              <li>SarkariResult se exact name copy karo</li>
              <li>Result ya Admit Card select karo</li>
              <li>Enter dabao — 2 second mein add!</li>
            </ul>
          </div>

          <a href="/admin" style={{ display: "block", marginTop: 16, textAlign: "center", fontSize: 13, color: "#2563eb", textDecoration: "none" }}>
            🔧 Go to Full Admin Panel →
          </a>
        </div>
      );
    }
    