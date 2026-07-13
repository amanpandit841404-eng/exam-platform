"use client";
import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useSearchParams } from 'next/navigation';

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [query, setQuery] = useState(q);
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [admits, setAdmits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(!!q);
  const [tab, setTab] = useState('exams');

  useEffect(() => {
    document.title = 'Search | SarkariSetu India';
    if (q) { setQuery(q); doSearch(q); }
  }, [q]);

  async function doSearch(term) {
    if (!term.trim()) return;
    setLoading(true); setSearched(true);
    const t = term.trim();
    const [examRes, resultRes, admitRes] = await Promise.all([
      supabase.from('exams').select('id,name,full_name,category').or(`name.ilike.%${t}%,full_name.ilike.%${t}%`).limit(50),
      supabase.from('results').select('*').ilike('exam_name', `%${t}%`).limit(20),
      supabase.from('admit_cards').select('*').ilike('exam_name', `%${t}%`).limit(20),
    ]);
    setExams(examRes.data || []);
    setResults(resultRes.data || []);
    setAdmits(admitRes.data || []);
    setLoading(false);
  }

  const total = exams.length + results.length + admits.length;

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '16px' }}>
      {/* Search bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input value={query} onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && doSearch(query)}
          placeholder="SSC CGL, UPSC, NEET, IBPS..."
          style={{ flex: 1, padding: '12px 16px', borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 14, outline: 'none' }} />
        <button onClick={() => doSearch(query)}
          style={{ background: '#1e3a5f', color: '#fff', padding: '12px 20px', borderRadius: 12, border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          Search
        </button>
      </div>

      {loading && <p style={{ textAlign: 'center', color: '#999', padding: 40 }}>🔍 Searching...</p>}

      {!loading && searched && total === 0 && (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>😕</div>
          <p style={{ color: '#6b7280' }}>No results found for "{query}"</p>
        </div>
      )}

      {!loading && searched && total > 0 && (
        <>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {[['exams', '🏛️ Exams', exams.length], ['results', '🏆 Results', results.length], ['admits', '📄 Admit Cards', admits.length]].map(([key, label, count]) => (
              <button key={key} onClick={() => setTab(key)}
                style={{ padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  background: tab === key ? '#1e3a5f' : '#fff',
                  color: tab === key ? '#fff' : '#374151',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                {label} ({count})
              </button>
            ))}
          </div>

          {/* Exams tab */}
          {tab === 'exams' && (
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
              {exams.map((exam, i) => (
                <a key={i} href={`/exam/${exam.id}`} style={{ display: 'block', padding: '12px 16px', borderBottom: '1px solid #f3f4f6', textDecoration: 'none' }}>
                  <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: 14, color: '#1e3a5f' }}>{exam.full_name || exam.name}</p>
                  <span style={{ fontSize: 11, padding: '2px 8px', background: '#dbeafe', color: '#2563eb', borderRadius: 20, fontWeight: 600 }}>📁 {exam.category || 'Exam'}</span>
                </a>
              ))}
            </div>
          )}

          {/* Results tab */}
          {tab === 'results' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {results.map((r, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 14, color: '#1e3a5f' }}>✅ {r.exam_name}</p>
                    <span style={{ fontSize: 11, padding: '2px 8px', background: '#dcfce7', color: '#16a34a', borderRadius: 20, fontWeight: 600 }}>Declared</span>
                  </div>
                  {r.result_url && (
                    <a href={r.result_url} target="_blank" rel="noopener noreferrer"
                      style={{ padding: '8px 14px', background: '#2563eb', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 12, fontWeight: 700 }}>Official ↗</a>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Admits tab */}
          {tab === 'admits' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {admits.map((r, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 14, color: '#1e3a5f' }}>📄 {r.exam_name}</p>
                    <span style={{ fontSize: 11, padding: '2px 8px', background: '#ede9fe', color: '#7c3aed', borderRadius: 20, fontWeight: 600 }}>Released</span>
                  </div>
                  {r.download_url && (
                    <a href={r.download_url} target="_blank" rel="noopener noreferrer"
                      style={{ padding: '8px 14px', background: '#7c3aed', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 12, fontWeight: 700 }}>Download ↗</a>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {!searched && (
        <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>
          <div style={{ fontSize: 50, marginBottom: 12 }}>🔍</div>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#374151' }}>52,000+ Exams Search करें</p>
          <p style={{ fontSize: 13 }}>SSC, UPSC, NEET, JEE, IBPS, Railway...</p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginTop: 16 }}>
            {['SSC CGL', 'UPSC CSE', 'NEET UG', 'JEE Main', 'IBPS PO', 'RRB NTPC'].map(s => (
              <button key={s} onClick={() => { setQuery(s); doSearch(s); }}
                style={{ padding: '6px 14px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 20, fontSize: 12, cursor: 'pointer', color: '#1e3a5f', fontWeight: 600 }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'sans-serif' }}>
      <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#0f172a)', color: '#fff', padding: '16px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <a href="/" style={{ color: '#93c5fd', fontSize: 13, textDecoration: 'none' }}>← Home</a>
          <h1 style={{ margin: '8px 0 0', fontSize: 20, fontWeight: 800 }}>🔍 Search</h1>
        </div>
      </div>
      <Suspense fallback={<div style={{ textAlign: 'center', padding: 40, color: '#999' }}>Loading...</div>}>
        <SearchContent />
      </Suspense>
    </div>
  );
}
