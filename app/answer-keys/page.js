"use client";
    import { useState, useEffect } from "react";
    import { supabase } from "../lib/supabase";

    export default function AnswerKeysPage() {
      const [updates, setUpdates] = useState([]);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        fetchAnswerKeys();
      }, []);

      const fetchAnswerKeys = async () => {
        setLoading(true);
        try {
          const { data } = await supabase.from("updates")
            .select("*, exams!inner(name)")
            .eq("update_type", "answer_key")
            .order("created_at", { ascending: false });
          setUpdates(data || []);
        } catch (e) {
          // Fallback: just get answer_key type updates without join
          try {
            const { data } = await supabase.from("updates")
              .eq("update_type", "answer_key")
              .order("created_at", { ascending: false });
            setUpdates(data || []);
          } catch(e2) { console.error(e2); }
        }
        setLoading(false);
      };

      return (
        <div style={{ fontFamily: "Arial,sans-serif", maxWidth: 800, margin: "0 auto", padding: 12 }}>
          <h1 style={{ fontSize: 22, color: "#1e3a5f", marginBottom: 4 }}>🔑 Answer Keys</h1>
          <p style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>Latest answer keys for various exams</p>

          {loading ? <p style={{ textAlign: "center", color: "#999", padding: 40 }}>Loading...</p> : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {updates.map(u => (
                <div key={u.id} style={{ padding: 12, background: "#f9fafb", borderRadius: 8, border: "1px solid #eee" }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{u.title}</div>
                  {u.description && <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>{u.description}</div>}
                  {u.official_link && (
                    <a href={u.official_link} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 12, color: "#2563eb", display: "inline-block", marginTop: 6, textDecoration: "underline" }}>
                      📄 View Official Answer Key
                    </a>
                  )}
                  <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>{new Date(u.created_at).toLocaleDateString()}</div>
                </div>
              ))}
              {updates.length === 0 && (
                <div style={{ textAlign: "center", padding: 40, color: "#999" }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>🔑</div>
                  <p>No answer keys available yet</p>
                  <p style={{ fontSize: 12 }}>Answer keys will appear here when published</p>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
    