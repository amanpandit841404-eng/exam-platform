"use client";

import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [latestResults, setLatestResults] = useState([]);
  const [admitCards, setAdmitCards] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [totalExams, setTotalExams] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, resultsRes, admitRes, upcomingRes, countRes] = await Promise.all([
          supabase.from('categories').select('*').order('name'),
          supabase.from('results').select('*').order('created_at', { ascending: false }).limit(8),
          supabase.from('admit_cards').select('*').order('created_at', { ascending: false }).limit(8),
          supabase.from('upcoming_exams').select('*').order('exam_date', { ascending: true }).limit(20),
          supabase.from('exams').select('*', { count: 'exact', head: true }),
        ]);
        if (catRes.data) setCategories(catRes.data);
        if (resultsRes.data) setLatestResults(resultsRes.data);
        if (admitRes.data) setAdmitCards(admitRes.data);
        if (upcomingRes.data) {
          // Deduplicate by exam_name (keep first occurrence)
          const seen = new Set();
          const unique = upcomingRes.data.filter(item => {
            const key = item.exam_name.toLowerCase().trim();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
          setUpcomingExams(unique.slice(0, 10));
        }
        if (countRes.count) setTotalExams(countRes.count);
      } catch (err) { console.error(err); }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-dark text-white px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold">
              <span className="text-[#ff9933]">S</span><span className="text-white">arkari</span><span className="text-[#138808]">Setu</span>
              <span className="block text-[10px] text-gray-400 font-normal">India</span>
            </h1>
          </div>
          <nav className="flex gap-1.5 text-xs">
            <a href="/" className="text-white font-bold px-2 py-1 rounded bg-white/10">Home</a>
            <a href="/results" className="text-gray-300 hover:text-white px-2 py-1 rounded">Results</a>
            <a href="/admit-cards" className="text-gray-300 hover:text-white px-2 py-1 rounded">Admit Cards</a>
            <a href="/search" className="text-gray-300 hover:text-white px-2 py-1 rounded">Search</a>
          </nav>
        </div>
      </header>

      {/* Dark Stats Bar */}
      <div className="bg-dark/95 text-white px-4 py-4 border-b border-gray-700">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-gray-300 mb-3">
            <span>🇮🇳</span>
            <span className="animate-pulse">●</span>
            <span className="font-semibold">SarkariSetu India</span>
            <span className="text-gray-500">|</span>
            <span>India's Exam Platform</span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white/10 rounded-lg py-2.5">
              <p className="text-lg font-bold text-[#ff9933]">{totalExams || '...'}</p>
              <p className="text-[10px] text-gray-400">Total Exams</p>
            </div>
            <div className="bg-white/10 rounded-lg py-2.5">
              <p className="text-lg font-bold text-white">{latestResults.length}</p>
              <p className="text-[10px] text-gray-400">Latest Results</p>
            </div>
            <div className="bg-white/10 rounded-lg py-2.5">
              <p className="text-lg font-bold text-[#138808]">{admitCards.length}</p>
              <p className="text-[10px] text-gray-400">Admit Cards</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Ticker */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg overflow-hidden mb-5">
          <div className="flex items-center gap-2 px-3 py-2">
            <span className="text-red-600 font-bold text-xs whitespace-nowrap">📢 LIVE:</span>
            <div className="overflow-hidden relative flex-1">
              <div className="animate-marquee whitespace-nowrap text-xs text-gray-700">
                {latestResults.slice(0, 4).map((r, i) => (
                  <span key={i} className="mr-8">✅ {r.exam_name} — Result Declared</span>
                ))}
                {admitCards.slice(0, 4).map((a, i) => (
                  <span key={i+4} className="mr-8">📄 {a.exam_name} — Admit Card Released</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-green-700 font-bold text-base flex items-center gap-2">🏆 Latest Results</h2>
            <a href="/results" className="text-xs text-green-600 font-semibold hover:underline">View All →</a>
          </div>
          <div className="space-y-2">
            {latestResults.length > 0 ? latestResults.map((item, i) => (
              <a key={i} href={`/check-result/${item.exam_id || i}`}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-lg hover:bg-green-50 border border-transparent hover:border-green-100 transition">
                <div className="flex items-center gap-2.5">
                  <span className="text-green-500 text-sm">✅</span>
                  <p className="text-sm font-medium text-gray-800">{item.exam_name || item.name}</p>
                </div>
                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-semibold">Declared</span>
              </a>
            )) : (
              <p className="text-center text-gray-400 text-sm py-6">Loading...</p>
            )}
          </div>
        </section>

        {/* Admit Cards Section */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-purple-700 font-bold text-base flex items-center gap-2">📄 Latest Admit Cards</h2>
            <a href="/admit-cards" className="text-xs text-purple-600 font-semibold hover:underline">View All →</a>
          </div>
          <div className="space-y-2">
            {admitCards.length > 0 ? admitCards.map((item, i) => (
              <a key={i} href={`/check-result/${item.exam_id || i}`}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-lg hover:bg-purple-50 border border-transparent hover:border-purple-100 transition">
                <div className="flex items-center gap-2.5">
                  <span className="text-purple-500 text-sm">📄</span>
                  <p className="text-sm font-medium text-gray-800">{item.exam_name || item.name}</p>
                </div>
                <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-semibold">Released</span>
              </a>
            )) : (
              <p className="text-center text-gray-400 text-sm py-6">Loading...</p>
            )}
          </div>
        </section>

        {/* Upcoming Exams */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-5">
          <h2 className="text-orange-600 font-bold text-base mb-4 flex items-center gap-2">📅 Upcoming Exams</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {upcomingExams.length > 0 ? upcomingExams.map((item, i) => (
              <a key={i} href={`/exam/${item.exam_id || i}`}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-orange-100 bg-orange-50/30 hover:bg-orange-50 transition">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{item.exam_name || item.name}</p>
                  <p className="text-xs text-orange-600 mt-0.5">📅 {item.exam_date || 'Coming Soon'}</p>
                </div>
                <span className="text-[10px] px-2 py-1 bg-orange-100 text-orange-700 rounded-full font-semibold whitespace-nowrap">Upcoming</span>
              </a>
            )) : (
              <p className="px-4 py-6 text-center text-gray-400 text-sm col-span-2">Loading...</p>
            )}
          </div>
        </section>

        {/* Categories */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-5">
          <h2 className="text-green-700 font-bold text-base mb-4 flex items-center gap-2">📍 Browse by Category</h2>
          <div className="flex flex-wrap gap-2">
            {categories.length > 0 ? categories.map((cat, i) => (
              <a key={i} href={`/category/${cat.slug || cat.name}`} 
                className="px-3.5 py-2 bg-green-50 rounded-full text-green-700 text-xs font-semibold border border-green-100 hover:bg-green-100 hover:shadow-sm transition">
                {cat.icon || '📁'} {cat.name.length > 20 ? cat.name.slice(0,18)+'..' : cat.name}
              </a>
            )) : (
              <p className="text-center text-gray-400 text-sm w-full py-6">Loading categories...</p>
            )}
          </div>
        </section>

        {/* Ad */}
        <div className="bg-gray-200 text-center py-6 rounded-xl text-gray-500 text-sm border-2 border-dashed border-gray-300 mb-5">
          📢 Advertisement / Google AdSense
        </div>

        {/* Quick Links */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-5">
          <h2 className="text-green-700 font-bold text-base mb-4 flex items-center gap-2">🔗 Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {href:'/syllabus', icon:'📖', label:'Syllabus'},
              {href:'/answer-keys', icon:'🔑', label:'Answer Keys'},
              {href:'/results', icon:'📈', label:'Results'},
              {href:'/notifications', icon:'📢', label:'Notifications'},
            ].map(link => (
              <a key={link.href} href={link.href} 
                className="px-3 py-3 bg-green-50 rounded-lg text-center text-green-700 text-sm font-semibold border border-green-100 hover:bg-green-100 transition">
                {link.icon} {link.label}
              </a>
            ))}
          </div>
        </section>
      </div>

      <footer className="bg-dark text-gray-400 text-xs py-6 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="mb-2">© 2026 <span className="text-green-400 font-bold">SarkariSetu India</span></p>
          <p className="leading-relaxed">Disclaimer: Not affiliated with any government organization.</p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
