"use client";
    import { useState, useEffect } from "react";
    import { supabase } from "../../lib/supabase";
    import { useParams, useSearchParams } from "next/navigation";

    export default function CheckResultPage() {
      const params = useParams();
      const searchParams = useSearchParams();
      const [exam, setExam] = useState(null);
      const [officialLink, setOfficialLink] = useState("");
      const [showIframe, setShowIframe] = useState(false);

      useEffect(() => {
        if (params.id) {
          fetchExam();
          fetchResultLink();
        }
      }, [params.id]);

      const fetchExam = async () => {
        try {
          const { data } = await supabase.from("exams").select("*").eq("id", params.id).single();
          if (data) setExam(data);
        } catch(e) {}
      };

      const fetchResultLink = async () => {
        try {
          const { data } = await supabase.from("updates").select("official_link")
            .eq("exam_id", params.id).eq("update_type", "result")
            .order("created_at", { ascending: false }).limit(1);
          if (data && data.length > 0 && data[0].official_link) {
            setOfficialLink(data[0].official_link);
          }
        } catch(e) {}

        // Fallback: check if exam has official_website
        try {
          const { data } = await supabase.from("exams").select("official_website").eq("id", params.id).single();
          if (data && data.official_website) setOfficialLink(data.official_website);
        } catch(e) {}
      };

      const examName = exam?.name || exam?.full_name || "Exam";

      return (
        <div style={{ fontFamily: "Arial,sans-serif", maxWidth: 800, margin: "0 auto", padding: 12, background: "#f8fafc", minHeight: "100vh" }}>

          <div style={{ background: "linear-gradient(135deg,#1e3a5f,#2563eb)", borderRadius: 14, padding: 20, color: "#fff", marginBottom: 16 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>🔍 Check Your Result</h1>
            <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>{examName}</div>
          </div>

          {!officialLink && (
            <div style={{ background: "#fff", borderRadius: 12, padding: 30, textAlign: "center", border: "1px solid #e5e7eb" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
              <h2 style={{ fontSize: 16, color: "#1e3a5f", margin: "0 0 8px" }}>Result Not Yet Announced</h2>
              <p style={{ fontSize: 13, color: "#666" }}>The result for this exam has not been declared yet.<br/>Check back later or browse other exams.</p>
              <a href="/" style={{ display: "inline-block", marginTop: 12, padding: "10px 20px", background: "#2563eb", color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 600 }}>🏠 Go to Homepage</a>
            </div>
          )}

          {officialLink && !showIframe && (
            <div style={{ background: "#fff", borderRadius: 12, padding: 24, textAlign: "center", border: "1px solid #e5e7eb" }}>
              <div style={{ fontSize: 50, marginBottom: 12 }}>🏆</div>
              <h2 style={{ fontSize: 18, color: "#16a34a", margin: "0 0 8px" }}>Result Declared!</h2>
              <p style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>Click below to check your result on the official portal.<br/>Enter your Roll Number and other details there.</p>

              <a href={officialLink} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-block", padding: "14px 32px", background: "linear-gradient(135deg,#16a34a,#15803d)", color: "#fff", borderRadius: 10, textDecoration: "none", fontSize: 16, fontWeight: 700, boxShadow: "0 4px 12px rgba(22,163,74,0.3)" }}>
                🏆 Check Your Result →
              </a>

              <p style={{ fontSize: 11, color: "#999", marginTop: 16 }}>🔒 You will be redirected to the official website to check your result.</p>

              <button onClick={() => setShowIframe(true)}
                style={{ marginTop: 8, padding: "8px 16px", background: "transparent", color: "#2563eb", border: "1px solid #2563eb", borderRadius: 8, cursor: "pointer", fontSize: 12 }}>
                🔄 Try Embedded View
              </button>
            </div>
          )}

          {officialLink && showIframe && (
            <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid #e5e7eb" }}>
              <div style={{ padding: "10px 14px", background: "#f0fdf4", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: "#16a34a", fontWeight: 600 }}>🏆 Official Result Portal</span>
                <div>
                  <button onClick={() => window.open(officialLink, "_blank")} style={{ padding: "4px 10px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 11, marginRight: 6 }}>🔗 Open in New Tab</button>
                  <button onClick={() => setShowIframe(false)} style={{ padding: "4px 10px", background: "#6b7280", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>✕ Close</button>
                </div>
              </div>
              <iframe src={officialLink} style={{ width: "100%", height: 500, border: "none" }} title="Result Portal" />
            </div>
          )}

          {/* Steps */}
          <div style={{ background: "#fff", borderRadius: 12, padding: 16, marginTop: 16, border: "1px solid #e5e7eb" }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e3a5f", margin: "0 0 10px" }}>📋 How to Check Result</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                "1. Click the "Check Your Result" button above",
                "2. Enter your Roll Number on the official portal",
                "3. Enter your Date of Birth / Password",
                "4. Click Submit to view your result",
                "5. Download / print your result for future use",
              ].map((step, i) => (
                <div key={i} style={{ fontSize: 13, color: "#333", padding: "6px 10px", background: "#f9fafb", borderRadius: 6 }}>{step}</div>
              ))}
            </div>
          </div>

          <a href="/" style={{ display: "block", textAlign: "center", marginTop: 16, fontSize: 13, color: "#2563eb", textDecoration: "none" }}>🏠 Back to Homepage</a>
        </div>
      );
    }
    