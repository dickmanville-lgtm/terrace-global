import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import ClubMapLoader from '../../components/ClubMapLoader';
import SiteNav from '../../components/SiteNav';
import FanGroupDirectory, { type FanGroupRow } from '../../components/FanGroupDirectory';


export const revalidate = 3600; // refresh from Supabase at most once per hour

export default async function NottinghamForestPage() {
  const { data: club } = await supabase
    .from('clubs')
    .select('id, color')
    .eq('slug', 'nottingham-forest')
    .single();

  if (!club) {
    return (
      <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '40px', fontFamily: "'Inter', sans-serif" }}>
        Unable to load club data right now.
      </main>
    );
  }

  const CLUB_COLOR = club.color || '#DD0000';

  const { data: groupsData } = await supabase
    .from('fan_groups')
    .select('name, city, country, latitude, longitude, url, description, region, type')
    .eq('club_id', club.id);

  const groups: FanGroupRow[] = groupsData || [];

  const mapGroups = groups
    .filter(g => g.latitude !== null && g.longitude !== null)
    .map(g => ({
      name: g.name,
      city: g.city,
      country: g.country,
      lat: g.latitude as number,
      lng: g.longitude as number,
      website: g.url,
      description: g.description,
    }));

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'Inter', sans-serif" }}>

      {/* Nav */}
      <SiteNav active="club-map" club={{ name: 'Nottingham Forest', color: CLUB_COLOR, tagline: 'The Tricky Trees · Est. 1865' }} />

      {/* Hero */}
      <section style={{ padding: '60px 32px 48px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: `linear-gradient(180deg, rgba(221,0,0,0.06) 0%, transparent 100%)` }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(221,0,0,0.12)', border: '1px solid rgba(221,0,0,0.25)', borderRadius: '999px', padding: '5px 12px', marginBottom: '24px', fontSize: '11px', color: CLUB_COLOR, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: CLUB_COLOR }} />
            Nottingham
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '16px' }}>
            Forest fans,<br /><span style={{ color: CLUB_COLOR }}>all over the world.</span>
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: '520px', marginBottom: '32px' }}>
            Find fellow Tricky Trees fans worldwide — 50+ branches spanning the globe. We've Got The Whole World In Our Hands.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a href="#directory" style={{ background: CLUB_COLOR, color: '#fff', borderRadius: '8px', padding: '11px 22px', fontSize: '14px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>Find a group near you</a>
            <a href="#map" style={{ background: 'transparent', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '11px 22px', fontSize: '14px', fontWeight: 500, textDecoration: 'none', display: 'inline-block' }}>View on map</a>
          </div>
        </div>
      </section>

      {/* Map */}
      <section id="map" style={{ height: '480px', position: 'relative', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <ClubMapLoader groups={mapGroups} color={CLUB_COLOR} />
        <div style={{ position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap', zIndex: 10 }}>
          Nottingham Forest fan groups worldwide
        </div>
      </section>

      {/* Directory */}
      <section id="directory" style={{ padding: '64px 32px', maxWidth: '960px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Fan group directory</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '48px' }}>
          Official supporter clubs and fan communities worldwide. Click any group to visit their site.
        </p>
        <FanGroupDirectory groups={groups} clubColor={CLUB_COLOR} />

        <div style={{ marginTop: '48px', padding: '28px', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.12)', textAlign: 'center' }}>
          <p style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>Is your group missing?</p>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>We're building the most complete directory of Nottingham Forest fan groups worldwide.</p>
          <a href="mailto:hello@terrace.global" style={{ display: 'inline-block', background: CLUB_COLOR, color: '#fff', borderRadius: '7px', padding: '9px 20px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>Add your group</a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '24px 32px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <Link href="/" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>← Back to Terrace.</Link>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.15)' }}>Terrace. · Nottingham Forest · We've Got The Whole World In Our Hands</span>
      </footer>

    </main>
  );
}