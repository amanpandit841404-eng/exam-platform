"use client";

    import { useEffect, useState } from 'react';
    import { supabase } from './lib/supabase';

    export default function Home() {
      const [categories, setCategories] = useState([]);
      const [latestResults, setLatestResults] = useState([]);
      const [admitCards, setAdmitCards] = useState([]);
      const [upcomingExams, setUpcomingExams] = useState([]);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        async function fetchData() {
          try {
            const [catRes, resultsRes, admitRes, upcomingRes] = await Promise.all([
              supabase.from('categories').select('*').order('name'),
              supabase.from('exams').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(10),
              supabase.from('admit_cards').select('*').order('release_date', { ascending: false }).limit(10),
              supabase.from('exams').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(10),
            ]);
            if (catRes.data) setCategories(catRes.data);
            if (resultsRes.data) setLatestResults(resultsRes.data);
            if (admitRes.data) setAdmitCards(admitRes.data);
            if (upcomingRes.data) setUpcomingExams(upcomingRes.data);
          } catch (err) {
            console.error('Error fetching data:', err);
          } finally {
            setLoading(false);
          }
        }
        fetchData();
      }, []);

      // Live ticker text
      const tickerItems = [
        'UPSC Civil Services 2026 Notification Out',
        'SSC CGL Tier 2 Results Announced',
        'RRB NTPC Admit Card Released',
        'NEET UG 2026 Registration Open',
        'CTET July 2026 Application Deadline Extended',
        'Bihar Board 12th Result 2026 Declared',
        'IBPS PO 2026 Prelims Date Announced',
        'UP Board 10th Result 2026 Available Now',
      ];

      const totalExams = 200;
      const totalResults = 45;
      const totalAdmitCards = 28;

      if (loading) {
        return (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', fontFamily: 'sans-serif', fontSize: '1.25rem', color: '#374151' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ border: '4px solid #e5e7eb', borderTop: '4px solid #16a34a', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              Loading...
            </div>
          </div>
        );
      }

      return (
        <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
          <style>{`
            * { margin: 0; padding: 0; box-sizing: border-box; }
            a { color: inherit; text-decoration: none; }
          `}</style>

          {/* Header */}
          <header style={{ backgroundColor: '#16a34a', color: 'white', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>🇮🇳</span>
              <div>
                <h1 style={{ fontSize: '22px', fontWeight: 'bold' }}>SarkariSetu</h1>
                <p style={{ fontSize: '11px', opacity: 0.9 }}>India, SarkariSetu India</p>
              </div>
            </div>
            <nav style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', fontSize: '14px' }}>
              <a href="/results" style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '4px' }}>Results</a>
              <a href="/admit-cards" style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '4px' }}>Admit Cards</a>
              <a href="/answer-keys" style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '4px' }}>Answer Keys</a>
              <a href="/syllabus" style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '4px' }}>Syllabus</a>
              <a href="/search" style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '4px' }}>Search</a>
            </nav>
          </header>

          {/* Ticker */}
          <div style={{ backgroundColor: '#1e40af', color: 'white', padding: '8px 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <div style={{ display: 'inline-block', animation: 'ticker 30s linear infinite', paddingLeft: '100%' }}>
              {tickerItems.map((item, i) => (
                <span key={i} style={{ marginRight: '50px', fontSize: '13px' }}>📢 {item}</span>
              ))}
            </div>
            <style>{`@keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }`}</style>
          </div>

          {/* Stats Bar */}
          <div style={{ backgroundColor: '#22c55e', color: 'white', display: 'flex', justifyContent: 'center', gap: '30px', padding: '10px', fontSize: '14px', flexWrap: 'wrap' }}>
            <span>📋 <strong>{totalExams}+</strong> Exams</span>
            <span>📊 <strong>{totalResults}+</strong> Results</span>
            <span>🎫 <strong>{totalAdmitCards}+</strong> Admit Cards</span>
          </div>

          {/* Main Content */}
          <main style={{ maxWidth: '1200px', margin: '20px auto', padding: '0 15px' }}>
            {/* Top Banner Ad Placeholder */}
            <div style={{ backgroundColor: '#e5e7eb', textAlign: 'center', padding: '20px', marginBottom: '20px', borderRadius: '6px', color: '#6b7280', fontSize: '14px', border: '1px dashed #d1d5db' }}>
              📢 Advertisement / Google AdSense
            </div>

            {/* 3 Column Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              {/* Latest Results */}
              <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ backgroundColor: '#dc2626', color: 'white', padding: '10px 15px', fontWeight: 'bold', fontSize: '16px' }}>📊 Latest Results</div>
                <ul style={{ listStyle: 'none', padding: '10px 15px' }}>
                  {latestResults.length > 0 ? latestResults.map((exam, i) => (
                    <li key={i} style={{ padding: '8px 0', borderBottom: i < latestResults.length - 1 ? '1px solid #e5e7eb' : 'none', fontSize: '13px' }}>
                      <a href={exam.official_website || '#'} style={{ color: '#1e40af' }}>{exam.name}</a>
                    </li>
                  )) : (
                    <li style={{ padding: '8px 0', fontSize: '13px', color: '#6b7280' }}>No results announced yet</li>
                  )}
                </ul>
                <div style={{ padding: '8px 15px', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
                  <a href="/results" style={{ color: '#16a34a', fontSize: '13px', fontWeight: 'bold' }}>View All Results →</a>
                </div>
              </div>

              {/* Admit Cards */}
              <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ backgroundColor: '#2563eb', color: 'white', padding: '10px 15px', fontWeight: 'bold', fontSize: '16px' }}>🎫 Admit Cards</div>
                <ul style={{ listStyle: 'none', padding: '10px 15px' }}>
                  {admitCards.length > 0 ? admitCards.map((card, i) => (
                    <li key={i} style={{ padding: '8px 0', borderBottom: i < admitCards.length - 1 ? '1px solid #e5e7eb' : 'none', fontSize: '13px' }}>
                      <a href={card.official_website || '#'} style={{ color: '#1e40af' }}>{card.name || card.title}</a>
                      {card.release_date && <span style={{ color: '#6b7280', fontSize: '11px', marginLeft: '5px' }}>| {card.release_date}</span>}
                    </li>
                  )) : (
                    <li style={{ padding: '8px 0', fontSize: '13px', color: '#6b7280' }}>No admit cards available</li>
                  )}
                </ul>
                <div style={{ padding: '8px 15px', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
                  <a href="/admit-cards" style={{ color: '#2563eb', fontSize: '13px', fontWeight: 'bold' }}>View All Admit Cards →</a>
                </div>
              </div>

              {/* Upcoming Exams */}
              <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ backgroundColor: '#7c3aed', color: 'white', padding: '10px 15px', fontWeight: 'bold', fontSize: '16px' }}>📅 Upcoming Exams</div>
                <ul style={{ listStyle: 'none', padding: '10px 15px' }}>
                  {upcomingExams.length > 0 ? upcomingExams.map((exam, i) => (
                    <li key={i} style={{ padding: '8px 0', borderBottom: i < upcomingExams.length - 1 ? '1px solid #e5e7eb' : 'none', fontSize: '13px' }}>
                      <a href={exam.official_website || '#'} style={{ color: '#1e40af' }}>{exam.name}</a>
                    </li>
                  )) : (
                    <li style={{ padding: '8px 0', fontSize: '13px', color: '#6b7280' }}>No upcoming exams</li>
                  )}
                </ul>
                <div style={{ padding: '8px 15px', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
                  <a href="/exams" style={{ color: '#7c3aed', fontSize: '13px', fontWeight: 'bold' }}>View All Exams →</a>
                </div>
              </div>
            </div>

            {/* Category Grid */}
            <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
              <h2 style={{ color: '#16a34a', marginBottom: '15px', fontSize: '18px' }}>📍 Browse by Category</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
                {categories.length > 0 ? categories.map((cat, i) => (
                  <a key={i} href={`/category/${cat.slug || cat.name}`} style={{ display: 'block', padding: '10px', backgroundColor: '#f0fdf4', borderRadius: '6px', color: '#16a34a', fontSize: '13px', fontWeight: '600', textAlign: 'center', border: '1px solid #dcfce7' }}>
                    {cat.icon || '📁'} {cat.name}
                  </a>
                )) : (
                  <p style={{ color: '#6b7280', gridColumn: '1/-1', textAlign: 'center', padding: '20px' }}>
                    Loading categories...
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Banner Ad Placeholder */}
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
          </main>

          {/* Footer */}
          <footer style={{ backgroundColor: '#1f2937', color: '#9ca3af', padding: '20px', textAlign: 'center', fontSize: '12px' }}>
            <p style={{ marginBottom: '8px' }}>© 2026 <strong style={{ color: '#16a34a' }}>SarkariSetu India</strong> — All Rights Reserved</p>
            <p>Disclaimer: This website is not affiliated with any government organization. Always verify official information at respective department websites.</p>
          </footer>
        </div>
      );
    }