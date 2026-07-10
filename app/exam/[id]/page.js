"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useParams } from 'next/navigation';

export default function ExamDetailPage() {
  const params = useParams();
  const examId = params.id;
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedExams, setRelatedExams] = useState([]);

  useEffect(() => {
    if (!examId) return;

    async function loadExam() {
      try {
        // Fetch exam details
        const { data: examData, error: examError } = await supabase
          .from('exams')
          .select('*')
          .eq('id', examId)
          .single();

        if (examError) throw examError;
        if (!examData) throw new Error('Exam not found');

        setExam(examData);

        // Update page title for SEO
        document.title = `${examData.name} 2026 - Syllabus, Admit Card, Result, Form Fill Date | SarkariSetu India`;

        // Update meta description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.name = 'description';
          document.head.appendChild(metaDesc);
        }
        metaDesc.content = `Get latest updates on ${examData.name} - Syllabus, Admit Card, Exam Date, Result, Application Form. All Sarkari exam information at SarkariSetu India.`;

        // Fetch related exams from same category
        if (examData.category) {
          const { data: related } = await supabase
            .from('exams')
            .select('id, name')
            .eq('category', examData.category)
            .neq('id', examId)
            .limit(10);
          if (related) setRelatedExams(related);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadExam();
  }, [examId]);

  if (loading) {
    return (
      <div style={{ fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto', padding: '40px', textAlign: 'center' }}>
        <p style={{ color: '#6b7280' }}>Loading exam details...</p>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div style={{ fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto', padding: '40px', textAlign: 'center' }}>
        <h1 style={{ color: '#dc2626' }}>Exam Not Found</h1>
        <p style={{ color: '#6b7280', marginTop: '10px' }}>The exam you are looking for does not exist.</p>
        <a href="/" style={{ color: '#16a34a', textDecoration: 'underline' }}>Go back to Home</a>
      </div>
    );
  }

  const sections = [
    { title: '📋 Exam Overview', content: `Complete details about ${exam.name} - eligibility, exam pattern, and important dates.` },
    { title: '📄 Application / Form', content: `Application process for ${exam.name}. Check form fill date, application fee, and how to apply online.` },
    { title: '📖 Syllabus', content: `Detailed syllabus for ${exam.name} including all subjects and topics.` },
    { title: '🪪 Admit Card', content: `Download admit card for ${exam.name}. Check exam date, exam center, and instructions.` },
    { title: '🏆 Result', content: `Check result for ${exam.name}. Merit list, cut-off marks, and scorecard download.` },
  ];

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', maxWidth: '800px', margin: '0 auto', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#1f2937', color: 'white', padding: '16px 20px' }}>
        <a href="/" style={{ color: '#16a34a', textDecoration: 'none', fontSize: '14px' }}>← Back to Home</a>
        <h1 style={{ fontSize: '22px', margin: '10px 0 5px', color: '#fff' }}>{exam.full_name || exam.name}</h1>
        <span style={{ backgroundColor: '#16a34a', color: 'white', padding: '3px 10px', borderRadius: '12px', fontSize: '12px', display: 'inline-block' }}>
          {exam.category || 'Exam'}
        </span>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Quick Info Box */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '16px', color: '#16a34a', marginBottom: '12px' }}>🔍 Quick Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
            <div><strong>Exam Name:</strong> <span>{exam.name}</span></div>
            <div><strong>Category:</strong> <span>{exam.category || 'N/A'}</span></div>
            <div><strong>Status:</strong> <span style={{ color: exam.is_active ? '#16a34a' : '#dc2626' }}>{exam.is_active ? '✅ Active' : '❌ Inactive'}</span></div>
            <div><strong>Official Website:</strong> <span>{exam.official_website ? <a href={exam.official_website} target="_blank" style={{ color: '#2563eb' }}>Visit ↗</a> : 'N/A'}</span></div>
          </div>
        </div>

        {/* Sections */}
        {sections.map((section, i) => (
          <div key={i} style={{ backgroundColor: 'white', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '16px', color: '#1f2937', marginBottom: '8px' }}>{section.title}</h2>
            <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.6' }}>{section.content}</p>
          </div>
        ))}

        {/* Related Exams */}
        {relatedExams.length > 0 && (
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', color: '#16a34a', marginBottom: '12px' }}>📌 Related Exams</h2>
            {relatedExams.map((re, i) => (
              <a key={i} href={`/exam/${re.id}`} style={{ display: 'block', padding: '8px 0', borderBottom: '1px solid #f3f4f6', color: '#2563eb', fontSize: '13px', textDecoration: 'none' }}>
                📝 {re.name}
              </a>
            ))}
          </div>
        )}

        {/* Ad Space */}
        <div style={{ backgroundColor: '#e5e7eb', textAlign: 'center', padding: '20px', borderRadius: '6px', color: '#6b7280', fontSize: '14px', border: '1px dashed #d1d5db', marginBottom: '16px' }}>
          📢 Advertisement / Google AdSense
        </div>
      </div>

      <footer style={{ backgroundColor: '#1f2937', color: '#9ca3af', padding: '20px', textAlign: 'center', fontSize: '12px' }}>
        <p>© 2026 <strong style={{ color: '#16a34a' }}>SarkariSetu India</strong></p>
      </footer>
    </div>
  );
}
