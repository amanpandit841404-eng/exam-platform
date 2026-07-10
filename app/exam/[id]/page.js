"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useParams } from 'next/navigation';

// Category-specific syllabus content
const categorySyllabus = {
  'SSC Exams': {
    pattern: 'Tier 1: General Intelligence, General Awareness, Quantitative Aptitude, English Comprehension. Tier 2: Quantitative Abilities, English Language, Statistics, General Studies.',
    exams: 'SSC CGL, CHSL, MTS, GD, CPO, Stenographer, JE, Selection Post',
  },
  'UPSC Civil Services': {
    pattern: 'Prelims: General Studies 1 & CSAT. Mains: 9 papers including Essay, GS 1-4, Optional, and Language. Interview: Personality Test.',
    exams: 'UPSC CSE, NDA, CDS, CAPF, EPFO, CMS, IFS, Engineering Services',
  },
  'Railway Recruitment': {
    pattern: 'CBT 1: General Awareness, Maths, General Intelligence, General Science. CBT 2: Subject-specific sections. Typing/Skill Test for relevant posts.',
    exams: 'RRB NTPC, ALP, Group D, JE, SSE, ASM, Paramedical, Clerk',
  },
  'Banking and Finance': {
    pattern: 'Prelims: English, Quantitative Aptitude, Reasoning. Mains: GA, English, Reasoning, Quantitative Aptitude, Computer Knowledge. Interview: Final stage.',
    exams: 'IBPS PO, Clerk, RRB PO, RRB Clerk, SO, SBI PO, Clerk, RBI Grade B, NABARD, SEBI',
  },
  'Medical Entrance': {
    pattern: 'Physics, Chemistry, Biology/Biotechnology. 180 questions, 3 hours. Marking: +4 correct, -1 incorrect.',
    exams: 'NEET UG, NEET PG, AIIMS INI CET, JIPMER, AIIMS NORCET',
  },
  'Engineering Entrance': {
    pattern: 'Physics, Chemistry, Mathematics. JEE Main: 90 questions, 3 hours. JEE Advanced: 2 papers of 3 hours each.',
    exams: 'JEE Main, JEE Advanced, BITSAT, VITEEE, MET, COMEDK, WBJEE, MHT CET',
  },
  'Teaching Exams': {
    pattern: 'Child Development & Pedagogy, Language 1 & 2, Mathematics, Environmental Studies, Subject-specific sections.',
    exams: 'CTET, UPTET, BTET, MPTET, HTET, DSSSB, KVS, NVS, REET',
  },
  'Defence': {
    pattern: 'Written Exam: General Knowledge, English, Physics, Chemistry, Maths. Physical Fitness Test, Medical Exam, Interview.',
    exams: 'Indian Army GD, Technical, Clerk, Navy SSR, AA, Air Force Airmen, AFCAT, Coast Guard',
  },
  'State PSC': {
    pattern: 'Prelims: General Studies 1 & 2 (CSAT). Mains: General Studies, Optional Subject, Essay, Interview.',
    exams: 'UPPSC, BPSC, MPPSC, RPSC, UKPSC, CGPSC, JPSC, HPAS, WBPSC',
  },
  'State Police': {
    pattern: 'Written Exam: General Knowledge, Maths, Reasoning. Physical Efficiency Test, Physical Measurement, Document Verification.',
    exams: 'UP Police, Bihar Police, MP Police, Rajasthan Police, Delhi Police, CRPF, BSF, CISF',
  },
};

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
        const { data, error } = await supabase.from('exams').select('*').eq('id', examId).single();
        if (error) throw error;
        if (!data) throw new Error('Exam not found');
        setExam(data);
        document.title = `${data.name} - Syllabus, Admit Card, Result, Exam Date | SarkariSetu India`;

        // Meta description update
        let meta = document.querySelector('meta[name="description"]');
        if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
        meta.content = `Get all details about ${data.name} - syllabus, admit card, result, exam date, application form, cut-off marks. Complete guide for ${data.category || 'sarkari exam'} at SarkariSetu India.`;

        // Related exams
        if (data.category) {
          const { data: related } = await supabase.from('exams').select('id, name').eq('category', data.category).neq('id', examId).limit(8);
          if (related) setRelatedExams(related);
        }
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    }
    loadExam();
  }, [examId]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-3">⏳</div>
        <p className="text-gray-500">Loading exam details...</p>
      </div>
    </div>
  );

  if (error || !exam) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center bg-white p-8 rounded-xl shadow-sm">
        <div className="text-5xl mb-4">😕</div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">Exam Not Found</h1>
        <p className="text-gray-500 mb-4">Yeh exam humare database mein nahi mila.</p>
        <a href="/" className="inline-block bg-brand text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-dark transition">← Home Page</a>
      </div>
    </div>
  );

  const catInfo = categorySyllabus[exam.category] || categorySyllabus[Object.keys(categorySyllabus).find(k => exam.category?.toLowerCase().includes(k.toLowerCase()))] || null;

  const quickLinks = [
    {icon:'📖', label:'Official Syllabus', href:'/syllabus'},
    {icon:'📝', label:'Previous Papers', href:'/answer-keys'},
    {icon:'📊', label:'Cut-off Trends', href:'/cutoffs'},
    {icon:'❓', label:'FAQ', href:'/faq'},
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-dark text-white px-4 py-3">
        <div className="max-w-4xl mx-auto">
          <a href="/" className="text-brand text-sm hover:underline">← Back to Home</a>
          <h1 className="text-xl font-bold mt-1.5">{exam.full_name || exam.name}</h1>
          <span className="inline-block bg-brand text-white text-xs px-3 py-1 rounded-full mt-1.5">{exam.category || 'Exam'}</span>
        </div>
      </header>

      {/* Alert Banner */}
      <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-sm">
          <span className="text-lg">🔔</span>
          <span className="text-yellow-800 font-medium">Latest Update:</span>
          <span className="text-yellow-700">{exam.name} ki latest updates ke liye <a href="/" className="text-brand font-semibold underline">homepage</a> check karein.</span>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-5">
        {/* Quick Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4">
          <h2 className="text-brand font-bold text-base mb-4 flex items-center gap-2">📋 Quick Information</h2>
          <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
            {[
              ['Exam Name', exam.name],
              ['Category', exam.category || 'N/A'],
              ['Status', exam.is_active ? '✅ Active' : '❌ Inactive'],
              ['Official Website', exam.official_website ? 
                <a key="web" href={exam.official_website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Visit ↗</a> : 'N/A'],
            ].map(([label, value], i) => (
              <div key={i}>
                <span className="text-gray-500 text-xs">{label}</span>
                <div className="font-medium text-gray-800 mt-0.5">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Important Dates */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4">
          <h2 className="text-brand font-bold text-base mb-4 flex items-center gap-2">📅 Important Dates</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {label:'Notification', date:'To be announced', icon:'📢'},
              {label:'Apply Start', date:'To be announced', icon:'📝'},
              {label:'Exam Date', date:'To be announced', icon:'📅'},
              {label:'Result', date:'To be announced', icon:'🏆'},
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                <div className="text-lg mb-1">{item.icon}</div>
                <div className="text-[11px] text-gray-500">{item.label}</div>
                <div className="text-xs font-semibold text-gray-700 mt-0.5">{item.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Syllabus & Exam Pattern */}
        {catInfo && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4">
            <h2 className="text-brand font-bold text-base mb-3 flex items-center gap-2">📖 Exam Pattern & Syllabus</h2>
            <div className="text-sm text-gray-700 leading-relaxed mb-3">{catInfo.pattern}</div>
            <div className="bg-brand-light rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Related Exams in this category:</p>
              <p className="text-sm font-medium text-gray-800">{catInfo.exams}</p>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4">
          <h2 className="text-brand font-bold text-base mb-3 flex items-center gap-2">🔗 Quick Links</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickLinks.map((link, i) => (
              <a key={i} href={link.href} className="block px-3 py-3 bg-brand-light rounded-lg text-center text-brand text-sm font-semibold border border-green-100 hover:bg-green-100 transition">
                {link.icon} {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Related Exams */}
        {relatedExams.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4">
            <h2 className="text-brand font-bold text-base mb-3 flex items-center gap-2">📌 Related Exams</h2>
            <div className="divide-y divide-gray-100">
              {relatedExams.map((re, i) => (
                <a key={i} href={`/exam/${re.id}`} className="flex items-center gap-3 py-2.5 hover:bg-gray-50 px-2 -mx-2 rounded-lg transition">
                  <span className="text-lg">📝</span>
                  <span className="text-sm font-medium text-blue-600">{re.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Ad Space */}
        <div className="bg-gray-200 text-center py-6 rounded-xl text-gray-500 text-sm border-2 border-dashed border-gray-300 mb-4">
          📢 Advertisement / Google AdSense
        </div>
      </main>

      <footer className="bg-dark text-gray-400 text-xs py-6 px-4 text-center">
        <p>© 2026 <span className="text-brand font-bold">SarkariSetu India</span></p>
      </footer>
    </div>
  );
}
