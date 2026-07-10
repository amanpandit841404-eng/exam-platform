"use client";

import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [latestResults, setLatestResults] = useState([]);
  const [admitCards, setAdmitCards] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [totalExams, setTotalExams] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, resultsRes, admitRes, upcomingRes, countRes] = await Promise.all([
          supabase.from('categories').select('*').order('name'),
          supabase.from('results').select('*').order('created_at', { ascending: false }).limit(10),
          supabase.from('admit_cards').select('*').order('created_at', { ascending: false }).limit(10),
          supabase.from('upcoming_exams').select('*').order('created_at', { ascending: false }).limit(10),
          supabase.from('exams').select('*', { count: 'exact', head: true }),
        ]);

        if (catRes.data) setCategories(catRes.data);
        if (resultsRes.data) setLatestResults(resultsRes.data);
        if (admitRes.data) setAdmitCards(admitRes.data);
        if (upcomingRes.data) setUpcomingExams(upcomingRes.data);
        if (countRes.count) setTotalExams(countRes.count);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', maxWidth: '800px', margin: '0 auto', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Top Banner */}
      <div style={{ backgroundColor: '#1f2937', color: 'white', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: '800', fontSize: '22px' }}>
          <span style={{ color: '#ff9933' }}>S</span><span style={{ color: '#ffffff' }}>arkari</span><span style={{ color: '#138808' }}>Setu</span>
          <span style={{ fontSize: '10px', display: 'block', color: '#9ca3af', fontWeight: '400' }}>India</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', fontSize: '12px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <a href="/" style={{ color: '#16a34a', fontWeight: '600', textDecoration: 'none', padding: '4px 8px', backgroundColor: '#374151', borderRadius: '4px' }}>Home</a>
          <a href="/results" style={{ color: '#d1d5db', textDecoration: 'none', padding: '4px 8px', backgroundColor: '#374151', borderRadius: '4px' }}>Results</a>
          <a href="/admit-cards" style={{ color: '#d1d5db', textDecoration: 'none', padding: '4px 8px', backgroundColor: '#374151', borderRadius: '4px' }}>Admit Cards</a>
          <a href="/answer-keys" style={{ color: '#d1d5db', textDecoration: 'none', padding: '4px 8px', backgroundColor: '#374151', borderRadius: '4px' }}>Answer Keys</a>
          <a href="/syllabus" style={{ color: '#d1d5db', textDecoration: 'none', padding: '4px 8px', backgroundColor: '#374151', borderRadius: '4px' }}>Syllabus</a>
          <a href="/search" style={{ color: '#d1d5db', textDecoration: 'none', padding: '4px 8px', backgroundColor: '#374151', borderRadius: '4px' }}>Search</a>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Ticker */}
        <div style={{ backgroundColor: '#16a34a', color: 'white', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', marginBottom: '12px', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          <marquee>
            🚀 {totalExams.toLocaleString()}+ Exams  |  📢 Latest: SarkariSetu India - Your Gateway to Government Jobs  |  📌 RRB NTPC, SSC CGL, UPSC, NEET & more
          </marquee>
        </div>

        {/* Stats Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
          <div style={{ backgroundColor: '#dc2626', color: 'white', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: '800' }}>{totalExams.toLocaleString()}+</div>
            <div style={{ fontSize: '11px', opacity: '0.9' }}>Total Exams</div>
          </div>
          <div style={{ backgroundColor: '#2563eb', color: 'white', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: '800' }}>{latestResults.length}+</div>
            <div style={{ fontSize: '11px', opacity: '0.9' }}>Latest Results</div>
          </div>
          <div style={{ backgroundColor: '#9333ea', color: 'white', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: '800' }}>{admitCards.length}+</div>
            <div style={{ fontSize: '11px', opacity: '0.9' }}>Admit Cards</div>
          </div>
        </div>

        {/* Three Section Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          {/* Latest Results */}
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#dc2626', fontSize: '16px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🏆 Latest Results
            </h2>
            {latestResults.length > 0 ? latestResults.map((item, i) => (
              <div key={i} style={{ padding: '8px 0', borderBottom: i < latestResults.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                <div style={{ fontWeight: '600', fontSize: '13px', color: '#111827' }}>{item.exam_name || item.name}</div>
                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                  ✅ Result Declared
                </div>
              </div>
            )) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>Loading results...</div>
            )}
          </div>

          {/* Admit Cards */}
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#2563eb', fontSize: '16px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🪪 Admit Cards
            </h2>
            {admitCards.length > 0 ? admitCards.map((item, i) => (
              <div key={i} style={{ padding: '8px 0', borderBottom: i < admitCards.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                <div style={{ fontWeight: '600', fontSize: '13px', color: '#111827' }}>{item.exam_name || item.title || item.name}</div>
                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                  📄 Admit Card Released
                </div>
              </div>
            )) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>Loading admit cards...</div>
            )}
          </div>

          {/* Upcoming Exams */}
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#9333ea', fontSize: '16px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              📅 Upcoming Exams
            </h2>
            {upcomingExams.length > 0 ? upcomingExams.map((item, i) => (
              <div key={i} style={{ padding: '8px 0', borderBottom: i < upcomingExams.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                <div style={{ fontWeight: '600', fontSize: '13px', color: '#111827' }}>{item.exam_name || item.name}</div>
                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                  📅 Coming Soon
                </div>
              </div>
            )) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>Loading upcoming exams...</div>
            )}
          </div>
        </div>

        {/* Categories Section */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
          <h2 style={{ color: '#16a34a', marginBottom: '15px', fontSize: '18px' }}>📍 Browse by Category</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
            {categories.length > 0 ? categories.map((cat, i) => (
              <a key={i} href={`/category/${cat.slug || cat.name}`} style={{ display: 'block', padding: '10px', backgroundColor: '#f0fdf4', borderRadius: '6px', color: '#16a34a', fontSize: '13px', fontWeight: '600', textAlign: 'center', border: '1px solid #dcfce7' }}>
                {cat.icon || '📁'} {cat.name}
              </a>
            )) : (
              <p style={{ color: '#6b7280', gridColumn: '1/-1', textAlign: 'center', padding: '20px' }}>
                No categories found
              </p>
            )}
          </div>
        </div>

        {/* Ad Space */}
        <div style={{ backgroundColor: '#e5e7eb', textAlign: 'center', padding: '20px', borderRadius: '6px', color: '#6b7280', fontSize: '14px', border: '1px dashed #d1d5db', marginBottom: '20px' }}>
          📢 Advertisement / Google AdSense
        </div>

        {/* Quick Links */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
          <h2 style={{ color: '#16a34a', marginBottom: '15px', fontSize: '18px' }}>🔗 Quick Links</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
            <a href="/syllabus" style={{ padding: '10px', backgroundColor: '#f0fDF4', borderRadius: '6px', fontSize: '13px', fontWeight: '600', color: '#16a34a', textAlign: 'center' }}>📖 Syllabus</a>
            <a href="/answer-keys" style={{ padding: '10px', backgroundColor: '#f0fDF4', borderRadius: '6px', fontSize: '13px', fontWeight: '600', color: '#16a34a', textAlign: 'center' }}>🔑 Answer Keys</a>
            <a href="/cutoffs" style={{ padding: '10px', backgroundColor: '#f0fDF4', borderRadius: '6px', fontSize: '13px', fontWeight: '600', color: '#16a34a', textAlign: 'center' }}>📈 Cutoff Marks</a>
            <a href="/notifications" style={{ padding: '10px', backgroundColor: '#f0fDF4', borderRadius: '6px', fontSize: '13px', fontWeight: '600', color: '#16a34a', textAlign: 'center' }}>📢 Notifications</a>
          </div>
        </div>
      </div>

      <footer style={{ backgroundColor: '#1f2937', color: '#9ca3af', padding: '20px', textAlign: 'center', fontSize: '12px' }}>
        <p style={{ marginBottom: '8px' }}>© 2026 <strong style={{ color: '#16a34a' }}>SarkariSetu India</strong> — All Rights Reserved</p>
        <p>Disclaimer: This website is not affiliated with any government organization. Always verify official information at respective department websites.</p>
      </footer>
    </div>
  );
}
