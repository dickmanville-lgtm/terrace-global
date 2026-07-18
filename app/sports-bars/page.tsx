import SiteNav from '../../components/SiteNav';
import Footer from '../../components/Footer';
import { supabase } from '@/lib/supabase';
import SportsBarsMapLoader from './SportsBarsMapLoader';

export const revalidate = 60; // refresh from Supabase at most once per minute

export default async function SportsBarsPage() {
  // Only ever show bars whose links are known-good — matches the same
  // "pin disappears if all links are dead" rule planned for the link-checker sweep.
  const { data: barsData } = await supabase
    .from('sports_bars')
    .select('id, name, location, country, url, latitude, longitude')
    .neq('link_status', 'pending_removal');

  const bars = barsData || [];

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'Inter', sans-serif" }}>

      <SiteNav active="sports-bars" />

      {/* Hero */}
      <section style={{ padding: '48px 32px 36px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: '999px', padding: '5px 12px', marginBottom: '20px', fontSize: '11px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#F97316' }} />
            Sports Bars
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '12px' }}>
            Find a bar showing<br /><span style={{ color: 'rgba(255,255,255,0.4)' }}>the match, wherever you are.</span>
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: '520px' }}>
            {bars.length} bars mapped worldwide. Zoom in on your holiday resort, city break, or away day — click a pin for the link.
          </p>
        </div>
      </section>

      {/* Map */}
      <section style={{ height: 'calc(100vh - 280px)', minHeight: '500px', position: 'relative' }}>
        <SportsBarsMapLoader bars={bars} />
      </section>

      <Footer stat={`Sports Bars · ${bars.length} mapped`} />

    </main>
  );
}
