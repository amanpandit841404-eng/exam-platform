"use client";
    import { useState, useEffect } from "react";
    import { supabase } from "../lib/supabase";

    export default function NotificationsPage() {
      const [updates, setUpdates] = useState([]);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        fetchUpdates();
      }, []);

      const fetchUpdates = async () => {
        setLoading(true);
        try {
          const { data } = await supabase.from("updates")
            .select("*")
            .order("created_at", { ascending: false });
          setUpdates(data || []);
        } catch (e) { console.error(e); }
        setLoading(false);
      };

      const typeColors = {
        result: "#16a34a", admit_card: "#d97706", syllabus: "#7c3aed", answer_key: "#2563eb", general: "#666"
      };
      const typeIcons = {
        result: "🏆", admit_card: "🎫", syllabus: "📚", answer_key: "🔑", general: "📢"
      };

      return (
        <div style={{ fontFamily: "Arial,sans-serif", maxWidth: 800, margin: "0 auto", padding: 12 }}>
          <h1 style={{ fontSize: 22, color: "#1e3a5f", marginBottom: 4 }}>📢 Notifications</h1>
          <p style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>All latest updates and notifications</p>

          {loading ? <p style={{ textAlign: "center", color: "#999", padding: 40 }}>Loading...</p> : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {updates.map(u => (
                <div key={u.id} style={{ padding: 12, background: "#f9fafb", borderRadius: 8, border: "1px solid #eee" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 16 }}>{typeIcons[u.update_type] || "📢"}</span>
                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: typeColors[u.update_type] || "#666", color: "#fff" }}>
                      {u.update_type?.replace("_", " ")}
                    </span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{u.title}</div>
                  {u.description && <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>{u.description}</div>}
                  {u.official_link && (
                    <a href={u.official_link} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 12, color: "#2563eb", display: "inline-block", marginTop: 6, textDecoration: "underline" }}>
                      🔗 Official Link
                    </a>
                  )}
                  <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>
                    {new Date(u.created_at).toLocaleDateString("en-IN")}
                    {u.is_verified && <span style={{ color: "#16a34a", marginLeft: 8 }}>✅ Verified</span>}
                  </div>
                </div>
              ))}
              {updates.length === 0 && (
                <div style={{ textAlign: "center", padding: 40, color: "#999" }}>
                  <p>No notifications yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
    