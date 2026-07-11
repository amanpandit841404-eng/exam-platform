"use client";
    import { useState, useEffect } from "react";
    import { supabase } from "../../lib/supabase";
    import { useParams } from "next/navigation";

    export default function CheckResultPage() {
      const params = useParams();
      const [exam, setExam] = useState(null);
      const [resultUrl, setResultUrl] = useState("");
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        if (params.id) { fetchExam(); fetchResultLink(); }
      }, [params.id]);

      const fetchExam = async () => {
        try {
          const { data } = await supabase.from("exams").select("name,full_name,category,official_website").eq("id", params.id).single();
          setExam(data);
        } catch(e) {}
      };

      const fetchResultLink = async () => {
        try {
          const { data } = await supabase.from("updates")
            .select("official_link,update_type,title")
            .eq("exam_id", params.id)
            .eq("update_type", "result")
            .order("created_at", { ascending: false }).limit(1);
          if (data && data.length > 0 && data[0].official_link) {
            setResultUrl(data[0].official_link);
          }
        } catch(e) {}

        // Try admit cards too
        if (!resultUrl) {
          try {
            const { data } = await supabase.from("updates")
              .select("official_link,update_type,title")
              .eq("exam_id", params.id)
              .eq("update_type", "admit_card")
              .order("created_at", { ascending: false }).limit(1);
            if (data && data.length > 0 && data[0].official_link) {
              setResultUrl(data[0].official_link);
            }
          } catch(e) {}
        }

        // Fallback to exam's official website
        if (!resultUrl && exam?.official_website) {
          setResultUrl(exam.official_website);
        }
        setLoading(false);
      };

      const examName = exam?.name || exam?.full_name || "Exam";
      const category = exam?.category || "";

      if (loading) return <div style={{ textAlign:"center", padding:60, fontFamily:"Arial,sans-serif", color:"#999" }}>Loading...</div>;

      return (
        <div style={{ fontFamily:"Arial,sans-serif", maxWidth:700, margin:"0 auto", padding:12, background:"#f8fafc", minHeight:"100vh" }}>
          <div style={{ background:"linear-gradient(135deg,#1e3a5f,#2563eb)", borderRadius:14, padding:20, color:"#fff", textAlign:"center", marginBottom:16 }}>
            <div style={{ fontSize:48, marginBottom:8 }}>🏆</div>
            <h1 style={{ fontSize:20, fontWeight:700, margin:0 }}>{examName}</h1>
            {category && <div style={{ fontSize:12, opacity:0.8, marginTop:4 }}>{category}</div>}
          </div>

          {resultUrl ? (
            <div style={{ background:"#fff", borderRadius:12, padding:24, textAlign:"center", border:"1px solid #e5e7eb", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize:16, color:"#16a34a", fontWeight:700, marginBottom:12 }}>✅ Result Available!</div>
              <a href={resultUrl} target="_blank" rel="noopener noreferrer"
                style={{ display:"inline-block", padding:"16px 36px", background:"linear-gradient(135deg,#16a34a,#15803d)", color:"#fff", borderRadius:12, textDecoration:"none", fontSize:18, fontWeight:700, boxShadow:"0 4px 16px rgba(22,163,74,0.3)", marginBottom:12 }}>
                🔍 Check Your Result
              </a>
              <div style={{ fontSize:12, color:"#666", background:"#f0fdf4", padding:"8px 12px", borderRadius:8 }}>
                📋 Click the button above. Enter your Roll Number on the official site to view your result.
              </div>
            </div>
          ) : (
            <div style={{ background:"#fff", borderRadius:12, padding:30, textAlign:"center", border:"1px solid #e5e7eb" }}>
              <div style={{ fontSize:40, marginBottom:12 }}>⏳</div>
              <h2 style={{ fontSize:18, color:"#1e3a5f", margin:"0 0 8px" }}>Result Not Yet Available</h2>
              <p style={{ fontSize:13, color:"#666", marginBottom:16 }}>The result has not been declared yet. Check back later.</p>
              <a href={`/exam/${params.id}`} style={{ display:"inline-block", padding:"10px 20px", background:"#2563eb", color:"#fff", borderRadius:8, textDecoration:"none", fontSize:13, fontWeight:600 }}>🔙 Back to Exam Page</a>
            </div>
          )}

          <div style={{ marginTop:16, background:"#fff", borderRadius:12, padding:16, border:"1px solid #e5e7eb" }}>
            <h3 style={{ fontSize:14, fontWeight:700, color:"#1e3a5f", margin:"0 0 10px" }}>📋 How to Check</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {[
                "1. Click the green 'Check Your Result' button",
                "2. You'll go to the official result portal",
                "3. Enter your Roll Number / Registration No.",
                "4. Enter Date of Birth or Password",
                "5. Click Submit → View your result",
                "6. Download/Print for future use",
              ].map((s,i) => (
                <div key={i} style={{ fontSize:13, padding:"6px 10px", background:"#f9fafb", borderRadius:6, color:"#333" }}>{s}</div>
              ))}
            </div>
          </div>

          <a href="/" style={{ display:"block", textAlign:"center", marginTop:16, fontSize:13, color:"#2563eb", textDecoration:"none" }}>🏠 Back to Homepage</a>
        </div>
      );
    }
    