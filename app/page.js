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
          supabase.from('upcoming_exams').select('*').order('exam_date', { ascending: true }).limit(8),
          supabase.from('exams').select('*', { count: 'exact', head: true }),
        ]);
        if (catRes.data) setCategories(catRes.data);
        if (resultsRes.data) setLatestResults(resultsRes.data);
        if (admitRes.data) setAdmitCards(admitRes.data);
        if (upcomingRes.data) setUpcomingExams(upcomingRes.data);
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
            {['Results','Admit Cards','Answer Keys','Syllabus','Search'].map(item => (
              <a key={item} href={`/${item.toLowerCase().replace(/\s+/g,'-')}`} 
                className="px-2.5 py-1.5 rounded bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-600 transition">
                {item}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-3">
        {/* Search Bar */}
        <form action="/search" method="GET" className="flex gap-2 mb-4">
          <input type="text" name="q" placeholder="🔍 52,000+ exams search karein..." 
            className="flex-1 px-4 py-3 rounded-xl bg-white border border-gray-200 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand" />
          <button type="submit" className="bg-brand text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-brand-dark transition shadow-sm whitespace-nowrap">
            Search
          </button>
        </form>

        {/* Ticker */}
        <div className="bg-brand text-white text-sm px-4 py-2.5 rounded-lg mb-4 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap">
            🚀 {totalExams.toLocaleString()}+ Exams  |  📢 SarkariSetu India - Aapka Sarkari Exam Dost  |  📌 SSC, UPSC, Railway, Banking, NEET, JEE
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-4 text-center shadow-md">
            <div className="text-2xl font-black">{totalExams.toLocaleString()}+</div>
            <div className="text-[11px] opacity-90 mt-0.5">📚 Total Exams</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 text-center shadow-md">
            <div className="text-2xl font-black">{latestResults.length}+</div>
            <div className="text-[11px] opacity-90 mt-0.5">🏆 Results</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4 text-center shadow-md">
            <div className="text-2xl font-black">{admitCards.length}+</div>
            <div className="text-[11px] opacity-90 mt-0.5">🪪 Admit Cards</div>
          </div>
        </div>

        {/* 3 Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Results */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-red-50 px-4 py-3 border-b border-red-100">
              <h2 className="text-red-600 font-bold text-sm flex items-center gap-2">🏆 Latest Results</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {latestResults.length > 0 ? latestResults.map((item, i) => (
                <a key={i} href={`/exam/${item.exam_id}`} className="block px-4 py-2.5 hover:bg-red-50 transition">
                  <p className="text-sm font-semibold text-gray-800">{item.exam_name || item.name}</p>
                  <p className="text-xs text-green-600 mt-0.5">✅ Result Declared</p>
                </a>
              )) : (
                <p className="px-4 py-6 text-center text-gray-400 text-sm">Loading...</p>
              )}
            </div>
          </section>

          {/* Admit Cards */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
              <h2 className="text-blue-600 font-bold text-sm flex items-center gap-2">🪪 Admit Cards</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {admitCards.length > 0 ? admitCards.map((item, i) => (
                <a key={i} href={`/exam/${item.exam_id}`} className="block px-4 py-2.5 hover:bg-blue-50 transition">
                  <p className="text-sm font-semibold text-gray-800">{item.exam_name || item.title || item.name}</p>
                  <p className="text-xs text-blue-600 mt-0.5">📄 Admit Card Released</p>
                </a>
              )) : (
                <p className="px-4 py-6 text-center text-gray-400 text-sm">Loading...</p>
              )}
            </div>
          </section>

          {/* Upcoming */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-purple-50 px-4 py-3 border-b border-purple-100">
              <h2 className="text-purple-600 font-bold text-sm flex items-center gap-2">📅 Upcoming Exams</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {upcomingExams.length > 0 ? upcomingExams.map((item, i) => (
                <a key={i} href={`/exam/${item.exam_id}`} className="block px-4 py-2.5 hover:bg-purple-50 transition">
                  <p className="text-sm font-semibold text-gray-800">{item.exam_name || item.name}</p>
                  <p className="text-xs text-purple-600 mt-0.5">📅 {item.exam_date || 'Coming Soon'}</p>
                </a>
              )) : (
                <p className="px-4 py-6 text-center text-gray-400 text-sm">Loading...</p>
              )}
            </div>
          </section>
        </div>

        {/* Categories */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-5">
          <h2 className="text-brand font-bold text-base mb-4 flex items-center gap-2">📍 Browse by Category</h2>
          <div className="flex flex-wrap gap-2">
            {categories.length > 0 ? categories.map((cat, i) => (
              <a key={i} href={`/category/${cat.slug || cat.name}`} 
                className="px-3.5 py-2 bg-green-50 rounded-full text-brand text-xs font-semibold border border-green-100 hover:bg-green-100 hover:shadow-sm transition">
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
          <h2 className="text-brand font-bold text-base mb-4 flex items-center gap-2">🔗 Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {href:'/syllabus', icon:'📖', label:'Syllabus'},
              {href:'/answer-keys', icon:'🔑', label:'Answer Keys'},
              {href:'/results', icon:'📈', label:'Results'},
              {href:'/notifications', icon:'📢', label:'Notifications'},
            ].map(link => (
              <a key={link.href} href={link.href} 
                className="px-3 py-3 bg-green-50 rounded-lg text-center text-brand text-sm font-semibold border border-green-100 hover:bg-green-100 transition">
                {link.icon} {link.label}
              </a>
            ))}
          </div>
        </section>
      </div>

      <footer className="bg-dark text-gray-400 text-xs py-6 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="mb-2">© 2026 <span className="text-brand font-bold">SarkariSetu India</span></p>
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
