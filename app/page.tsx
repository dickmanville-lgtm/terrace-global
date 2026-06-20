'use client';

import { useState } from 'react';
import Link from 'next/link';

const CLUBS = [
  { name: 'Arsenal', url: '/arsenal' },
  { name: 'Aston Villa', url: '/aston-villa' },
  { name: 'Bournemouth', url: '/bournemouth' },
  { name: 'Brentford', url: '/brentford' },
  { name: 'Brighton', url: '/brighton' },
  { name: 'Celtic', url: '/celtic' },
  { name: 'Chelsea', url: '/chelsea' },
  { name: 'Coventry City', url: '/coventry' },
  { name: 'Crystal Palace', url: '/crystal-palace' },
  { name: 'Everton', url: '/everton' },
  { name: 'Fulham', url: '/fulham' },
  { name: 'Hull City', url: '/hull' },
  { name: 'Ipswich Town', url: '/ipswich' },
  { name: 'Leeds United', url: '/leeds' },
  { name: 'Liverpool', url: '/liverpool' },
  { name: 'Man United', url: '/manchester-united' },
  { name: 'Manchester City', url: '/manchester-city' },
  { name: 'Newcastle', url: '/newcastle' },
  { name: 'Nottingham Forest', url: '/nottingham-forest' },
  { name: 'Rangers', url: '/rangers' },
  { name: 'Spurs', url: '/spurs' },
  { name: 'Sunderland', url: '/sunderland' },
];

export default function Home() {
  const [activeClub, setActiveClub] = useState('Arsenal');

  return (
    <main className="min-h-screen bg-black text-white" style={{ fontFamily: "'Inter', sans-serif" }}>

      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 32px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        position: 'sticky',
        top: 0,
        background: 'rgba(0,0,0,0.9)',
        backdropFilter: 'blur(12px)',
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }} />
          <span style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            The Terrace
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div style={{ display: 'flex', gap: '28px', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
            <Link href="/fan-map" style={{ color: 'inherit', textDecoration: 'none' }}>Fan Map</Link>
            <Link href="/club-map" style={{ color: 'inherit', textDecoration: 'none' }}>Club Map</Link>
          </div>
        </div>
      </nav>

      <section style={{ padding: '100px 32px 80px', maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(42px, 8vw, 80px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '24px' }}>
          Football fans,{' '}
          <span style={{ color: '#EF4444' }}>everywhere on earth.</span>
        </h1>

        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 48px' }}>
          The global home for football supporters. Find your people, follow your club,
          and never watch alone — wherever you are in the world.
        </p>

        <p style={{
  fontSize: '16px',
  color: '#EF4444',
  fontWeight: 600,
  letterSpacing: '0.02em',
}}>
  ↓ Select your club below to explore your fan map
</p>
      </section>

      <section style={{ padding: '0 32px 80px', maxWidth: '900px', margin: '0 auto' }}>
        <p style={{
          textAlign: 'center', fontSize: '12px', fontWeight: 500, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '20px',
        }}>
          Select your club
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
          {CLUBS.map(club => (
            <button key={club.name} onClick={() => { setActiveClub(club.name); if(club.url) window.location.href=club.url; }} style={{
              padding: '8px 18px', borderRadius: '999px',
              border: activeClub === club.name ? '1px solid #EF4444' : '1px solid rgba(255,255,255,0.12)',
              background: activeClub === club.name ? 'rgba(239,68,68,0.15)' : 'transparent',
              color: activeClub === club.name ? '#EF4444' : 'rgba(255,255,255,0.5)',
              fontSize: '13px', fontWeight: activeClub === club.name ? 600 : 400,
              cursor: 'pointer', transition: 'all 0.15s ease',
            }}>
              {club.name}
            </button>
          ))}
        </div>
      </section>

      <section style={{ padding: '0 32px 100px', maxWidth: '960px', margin: '0 auto' }}>
        <Link href="/fan-map" style={{ textDecoration: 'none', display: 'block' }}>
          <div style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', position: 'relative',
          }}>
            <div style={{
              height: '320px', background: 'linear-gradient(135deg, #0a0a0a 0%, #111 50%, #0d0d0d 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden',
            }}>
              {[
                { top: '30%', left: '20%', color: '#EF4444', size: 10 },
                { top: '45%', left: '48%', color: '#EF4444', size: 14 },
                { top: '35%', left: '55%', color: '#FFFFFF', size: 8 },
                { top: '55%', left: '65%', color: '#F97316', size: 9 },
                { top: '40%', left: '72%', color: '#EF4444', size: 11 },
                { top: '60%', left: '30%', color: '#EF4444', size: 8 },
                { top: '25%', left: '62%', color: '#FFFFFF', size: 7 },
                { top: '70%', left: '55%', color: '#F97316', size: 8 },
                { top: '38%', left: '38%', color: '#EF4444', size: 12 },
                { top: '50%', left: '82%', color: '#EF4444', size: 9 },
              ].map((dot, i) => (
                <div key={i} style={{
                  position: 'absolute', top: dot.top, left: dot.left,
                  width: `${dot.size}px`, height: `${dot.size}px`,
                  borderRadius: '50%', background: dot.color, opacity: 0.9,
                  boxShadow: `0 0 ${dot.size * 2}px ${dot.color}44`,
                }} />
              ))}
              <div style={{
                position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px',
              }}>
                <div style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
                  Fan map
                </div>
                <div style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 700, color: '#fff', textAlign: 'center' }}>
                  47,291 fans mapped worldwide
                </div>
                <div style={{
                  background: '#EF4444', color: '#fff', borderRadius: '8px',
                  padding: '10px 24px', fontSize: '14px', fontWeight: 600, marginTop: '8px',
                }}>
                  Open the map →
                </div>
              </div>
            </div>
            <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {[
                { color: '#EF4444', label: 'Fan communities' },
                { color: '#FFFFFF', label: 'Supporter clubs' },
                { color: '#F97316', label: 'Fan bars' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Link>
      </section>

      <footer style={{
        padding: '32px', borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }} />
          <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            The Terrace
          </span>
        </div>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>
          The global home for football fans
        </span>
      </footer>

    </main>
  );
}
