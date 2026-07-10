"use client";
import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useSearchParams } from 'next/navigation';

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [query, setQuery] = useState(q);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(!!q);

  useEffect(() => {
    document.title = 'Search Exams | SarkariSetu India';
    if (q) { setQuery(q); doSearch(q); }
  }, [q]);

  async function doSearch(term) {
    if (!term.trim()) return;
    setLoading(true); setSearched(true);
    const t = term.trim();
    const { data } = await supabase
      .from('exams')
      .select('id, name, full_name, category')
      .or(`name.ilike.%${t}%,full_name.ilike.%${t}%,category.ilike.%${t}%`)
      .limit(50);
    setResults(data || []);
    setLoading(false);
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-5">
      <div className="flex gap-2 mb-5">
        <input value={query} onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && doSearch(query)}
          placeholder="Search by exam name, category..."
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
        <button onClick={() => doSearch(query)}
          className="bg-brand text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-brand-dark transition">
          Search
        </button>
      </div>
      {loading && <p className="text-center text-gray-500 py-10">🔍 Searching...</p>}
      {!loading && searched && results.length === 0 && (
        <div className="text-center py-10"><div className="text-4xl mb-3">😕</div><p className="text-gray-500">No exams found for "{query}"</p></div>
      )}
      {!loading && results.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y">
          <p className="px-4 py-2 text-xs text-gray-500 bg-gray-50 rounded-t-xl">{results.length} results</p>
          {results.map(exam => (
            <a key={exam.id} href={`/exam/${exam.id}`} className="block px-4 py-3 hover:bg-gray-50 transition">
              <p className="text-sm font-semibold text-blue-600">{exam.full_name || exam.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">📁 {exam.category || 'Exam'}</p>
            </a>
          ))}
        </div>
      )}
      {!searched && (
        <div className="text-center py-10 text-gray-400">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-sm">52,000+ exams search karein</p>
        </div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-dark text-white px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <a href="/" className="text-brand text-sm hover:underline">← Home</a>
          <h1 className="text-lg font-bold mt-1">🔍 Search Exams</h1>
        </div>
      </header>
      <Suspense fallback={<div className="text-center py-10"><p className="text-gray-500">Loading...</p></div>}>
        <SearchContent />
      </Suspense>
    </div>
  );
}
