"use client";

import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [latestResults, setLatestResults] = useState([]);
  const [admitCards, setAdmitCards] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [totalExams, setTotalExams] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [totalAdmits, setTotalAdmits] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, resultsRes, admitRes, upcomingRes, countRes, rCountRes, aCountRes] = await Promise.all([
          supabase.from('categories').select('*').order('name'),
          supabase.from('results').select('*').order('created_at', { ascending: false }).limit(8),
          supabase.from('admit_cards').select('*').order('created_at', { ascending: false }).limit(8),
          supabase.from('upcoming_exams').select('*').order('exam_date', { ascending: true }).limit(20),
          supabase.from('exams').select('*', { count: 'exact', head: true }),
          supabase.from('results').select('*', { count: 'exact', head: true }),
          supabase.from('admit_cards').select('*', { count: 'exact', head: true }),
        ]);
        if (catRes.data) setCategories(catRes.data);
        if (resultsRes.data) setLatestResults(resultsRes.data);
        if (admitRes.data) setAdmitCards(admitRes.data);
        if (upcomingRes.data) {
          // Deduplicate by exam_name
          const seen = new Set();
          const unique = upcomingRes.data.filter(item => {
            const key = item.exam_name.toLowerCase().trim();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
          setUpcomingExams(unique.slice(0, 8));
        }
        if (countRes.count) setTotalExams(countRes.count);
        if (rCountRes.count) setTotalResults(rCountRes.count);
        if (aCountRes.count) setTotalAdmits(aCountRes.count);
      } catch (err) { console.error(err); }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-900 text-white px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">
              <span className="text-[#ff9933]">S</span><span className="text-white">arkari</span><span className="text-[#138808]">Setu</span>
              <span className="block text-[10px] text-gray-300 font-normal">India</span>
            </h1>
          </div>
          <nav className="flex gap-1.5 text-xs">
            <a href="/" className="text-white font-bold px-2 py-1 rounded bg-white/10">Home</a>
            <a href="/results" className="text-gray-200 hover:text-white px-2 py-1 rounded">Results</a>
            <a href="/admit-cards" className="text-gray-200 hover:text-white px-2 py-1 rounded">Admit Cards</a>
            <a href="/search" className="text-gray-200 hover:text-white px-2 py-1 rounded">Search</a>
          </nav>
        </div>
      </header>

      {/* Stats Banner */}
      <div className="bg-blue-900/95 text-white px-4 py-3">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm font-semibold tracking-wide">
            🏛️ {totalExams.toLocaleString()}+ Exams | SarkariSetu India
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="max-w-6xl mx-auto px-4 pt-4 pb-2">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-4 text-center shadow-md">
            <p className="text-2xl font-black">{totalExams ? totalExams.toLocaleString() + '+' : '...'}</p>
            <p className="text-[10px] opacity-90 font-semibold mt-0.5">Total Exams</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 text-center shadow-md">
            <p className="text-2xl font-black">{totalResults ? totalResults + '+' : latestResults.length + '+'}</p>
            <p className="text-[10px] opacity-90 font-semibold mt-0.5">🏆 Results</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4 text-center shadow-md">
            <p className="text-2xl font-black">{totalAdmits ? totalAdmits + '+' : admitCards.length + '+'}</p>
            <p className="text-[10px] opacity-90 font-semibold mt-0.5">📄 Admit Cards</p>
          </div>
        </div>
      </div>

      {/* Three Column Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="main-grid">
          
          {/* Latest Results Column */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2.5 flex items-center justify-between">
              <h2 className="font-bold text-sm flex items-center gap-1.5">🏆 Latest Results</h2>
              <a href="/results" className="text-[10px] text-white/80 hover:text-white font-semibold">View All →</a>
            </div>
            <div className="divide-y divide-gray-50">
              {latestResults.length > 0 ? latestResults.map((item, i) => (
                <div key={i} className="flex items-center justify-between px-3.5 py-2.5 hover:bg-blue-50 transition">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-green-500 text-xs">✅</span>
                    <p className="text-xs font-medium text-gray-800 truncate">{item.exam_name || item.name}</p>
                  </div>
                  <div className="flex items-center gap-1 ml-1 shrink-0">
                    {item.official_link && (
                      <a href={item.official_link} target="_blank" rel="noopener noreferrer"
                        className="text-[9px] px-1.5 py-0.5 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700">Official ↗</a>
                    )}
                    <span className="text-[9px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full font-semibold">Declared</span>
                  </div>
                </div>
              )) : (
                <p className="text-center text-gray-400 text-xs py-6">Loading...</p>
              )}
            </div>
          </div>

          {/* Admit Cards Column */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2.5 flex items-center justify-between">
              <h2 className="font-bold text-sm flex items-center gap-1.5">📄 Admit Cards</h2>
              <a href="/admit-cards" className="text-[10px] text-white/80 hover:text-white font-semibold">View All →</a>
            </div>
            <div className="divide-y divide-gray-50">
              {admitCards.length > 0 ? admitCards.map((item, i) => (
                <div key={i} className="flex items-center justify-between px-3.5 py-2.5 hover:bg-purple-50 transition">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-purple-500 text-xs">📄</span>
                    <p className="text-xs font-medium text-gray-800 truncate">{item.exam_name || item.name}</p>
                  </div>
                  <div className="flex items-center gap-1 ml-1 shrink-0">
                    {item.official_link && (
                      <a href={item.official_link} target="_blank" rel="noopener noreferrer"
                        className="text-[9px] px-1.5 py-0.5 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700">Official ↗</a>
                    )}
                    <span className="text-[9px] px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded-full font-semibold">Released</span>
                  </div>
                </div>
              )) : (
                <p className="text-center text-gray-400 text-xs py-6">Loading...</p>
              )}
            </div>
          </div>

          {/* Upcoming Exams Column */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2.5 flex items-center justify-between">
              <h2 className="font-bold text-sm flex items-center gap-1.5">📅 Upcoming Exams</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {upcomingExams.length > 0 ? upcomingExams.map((item, i) => (
                <a key={i} href={`/exam/${item.exam_id || i}`}
                  className="flex items-center justify-between px-3.5 py-2.5 hover:bg-orange-50 transition">
                  <div>
                    <p className="text-xs font-medium text-gray-800">{item.exam_name || item.name}</p>
                    <p className="text-[10px] text-orange-600 mt-0.5">📅 {item.exam_date || 'Coming Soon'}</p>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded-full font-semibold whitespace-nowrap">Upcoming</span>
                </a>
              )) : (
                <p className="text-center text-gray-400 text-xs py-6">Loading...</p>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Categories */}
      <div className="max-w-6xl mx-auto px-4 py-2">
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h2 className="text-gray-800 font-bold text-sm mb-3 flex items-center gap-2">📍 Browse by Category</h2>
          <div className="flex flex-wrap gap-2">
            {categories.length > 0 ? categories.map((cat, i) => (
              <a key={i} href={`/category/${cat.slug || cat.name}`} 
                className="px-3 py-1.5 bg-green-50 rounded-full text-green-700 text-[11px] font-semibold border border-green-100 hover:bg-green-100 transition">
                {cat.icon || '📁'} {cat.name.length > 22 ? cat.name.slice(0,20)+'..' : cat.name}
              </a>
            )) : (
              <p className="text-center text-gray-400 text-xs w-full py-4">Loading categories...</p>
            )}
          </div>
        </section>
      </div>

      {/* Ad & Quick Links */}
      <div className="max-w-6xl mx-auto px-4 py-2">
        <div className="bg-gray-200 text-center py-5 rounded-xl text-gray-500 text-xs border-2 border-dashed border-gray-300 mb-4">
          📢 Advertisement / Google AdSense
        </div>

        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
          <h2 className="text-gray-800 font-bold text-sm mb-3 flex items-center gap-2">🔗 Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {[
              {href:'/syllabus', icon:'📖', label:'Syllabus'},
              {href:'/answer-keys', icon:'🔑', label:'Answer Keys'},
              {href:'/results', icon:'📈', label:'Results'},
              {href:'/notifications', icon:'📢', label:'Notifications'},
            ].map(link => (
              <a key={link.href} href={link.href} 
                className="px-3 py-2.5 bg-green-50 rounded-lg text-center text-green-700 text-xs font-semibold border border-green-100 hover:bg-green-100 transition">
                {link.icon} {link.label}
              </a>
            ))}
          </div>
        </section>
      </div>

      <footer className="bg-blue-900 text-gray-300 text-[11px] py-5 px-4 text-center">
        <div className="max-w-6xl mx-auto">
          <p className="mb-1.5">© 2026 <span className="text-green-400 font-bold">SarkariSetu India</span></p>
          <p className="leading-relaxed opacity-80">Not affiliated with any government organization.</p>
        </div>
      </footer>
    </div>
  );
}
