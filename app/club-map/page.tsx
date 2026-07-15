'use client';

import dynamic from 'next/dynamic';
import SiteNav from '../../components/SiteNav';
import Footer from '../../components/Footer';

const GroundsMap = dynamic(() => import('../../components/GroundsMap'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100%', height: '100%', background: '#0a0a0a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'rgba(255,255,255,0.3)', fontSize: '13px', letterSpacing: '0.1em',
    }}>
      LOADING MAP
    </div>
  ),
});

export default function ClubMapPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'Inter', sans-serif" }}>

     <SiteNav active="club-map" />

      {/* Hero */}
      <section style={{ padding: '48px 32px 36px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '999px', padding: '5px 12px', marginBottom: '20px', fontSize: '11px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#fff' }} />
           
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '12px' }}>
            Every ground.<br /><span style={{ color: 'rgba(255,255,255,0.4)' }}>Click to visit the club.</span>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: '520px' }}>Grounds mapped from Europe's top leagues. Click any pin for the stadium name and a link to the club's official website.</p>
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: '520px' }}>
            
          </p>
        </div>
      </section>

      {/* Map */}
      <section style={{ height: 'calc(100vh - 280px)', minHeight: '500px', position: 'relative' }}>
        <GroundsMap />
      </section>

      <Footer stat="Club Map" />

    </main>
  );
}