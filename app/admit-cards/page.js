"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AdmitCardsPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Latest Admit Cards 2026 | SarkariSetu India';
    async function load() {
      const { data } = await supabase.from('admit_cards').select('*').order('created_at', { ascending: false });
      if (data) setCards(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto', padding: '16px' }}>
      <h1 style={{ color: '#2563eb' }}>🪪 Latest Admit Cards</h1>
      {loading ? <p>Loading...</p> : cards.map((r, i) => (
        <div key={i} style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
          <a href={`/exam/${r.exam_id}`} style={{ fontWeight: '600', color: '#2563eb', textDecoration: 'none' }}>{r.exam_name}</a>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>📄 Admit Card Released</div>
        </div>
      ))}
    </div>
  );
}
