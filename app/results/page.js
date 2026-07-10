"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Latest Exam Results 2026 | SarkariSetu India';
    async function load() {
      const { data } = await supabase.from('results').select('*').order('created_at', { ascending: false });
      if (data) setResults(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto', padding: '16px' }}>
      <h1 style={{ color: '#dc2626' }}>🏆 Latest Exam Results</h1>
      {loading ? <p>Loading...</p> : results.map((r, i) => (
        <div key={i} style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
          <a href={`/exam/${r.exam_id}`} style={{ fontWeight: '600', color: '#2563eb', textDecoration: 'none' }}>{r.exam_name}</a>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>✅ Result Declared</div>
        </div>
      ))}
    </div>
  );
}
