import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import ClubMapLoader from '../../components/ClubMapLoader';
import SiteNav from '../../components/SiteNav';
import FanGroupDirectory, { type FanGroupRow } from '../../components/FanGroupDirectory';
import HeroActionButtons from '../../components/HeroActionButtons';


export const revalidate = 3600; // refresh from Supabase at most once per hour


export default async function ArsenalPage() {
  const { data: club } = await supabase
    .from('clubs')
    .select('id, color')
    .eq('slug', 'arsenal')
    .single();

  if (!club) {
    return (
      <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '40px', fontFamily: "'Inter', sans-serif" }}>
        Unable to load club data right now.
      </main>
    );
  }

  const CLUB_COLOR = club.color || '#EF4444';

  const { data: groupsData } = await supabase
    .from('fan_groups')
    .select('name, city, country, latitude, longitude, url, description, region, type, instagram_url, facebook_url, tiktok_url')
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
      facebook: g.facebook_url,
      instagram: g.instagram_url,
      tiktok: g.tiktok_url,
      description: g.description,
    }));

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'Inter', sans-serif" }}>

      <SiteNav active="supporter-groups" club={{ name: 'Arsenal', color: CLUB_COLOR, tagline: 'The Gunners Â· Est. 1886' }} />

      {/* â”€â”€ Hero â”€â”€ */}
      <section style={{
        padding: '60px 32px 48px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'linear-gradient(180deg, rgba(239,68,68,0.06) 0%, transparent 100%)',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: '999px', padding: '5px 12px', marginBottom: '24px',
            fontSize: '11px', color: CLUB_COLOR, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: CLUB_COLOR }} />
            North London
          </div>

          <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '16px' }}>
            Arsenal fans,<br />
            <span style={{ color: CLUB_COLOR }}>everywhere on earth.</span>
          </h1>

          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: '520px', marginBottom: '32px' }}>
            Find Gooners worldwide â€” supporter clubs, fan communities and bars showing Arsenal matches wherever you are.
          </p>

          <HeroActionButtons clubColor={CLUB_COLOR} />
        </div>
      </section>

      {/* â”€â”€ Map â”€â”€ */}
      <section id="map" style={{ height: '480px', position: 'relative', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <ClubMapLoader groups={mapGroups} color={CLUB_COLOR} />
        
      </section>

      {/* â”€â”€ Directory â”€â”€ */}
      <section id="directory" style={{ padding: '64px 32px', maxWidth: '960px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Fan group directory</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '48px' }}>
          Official supporter clubs, fan communities and bars worldwide. Click any group to visit their site.
        </p>

<FanGroupDirectory groups={groups} clubColor={CLUB_COLOR} />
        <div style={{
          marginTop: '48px', padding: '28px', borderRadius: '12px',
          border: '1px dashed rgba(255,255,255,0.12)',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>Is your group missing?</p>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>
            We're building the most complete directory of Arsenal fan groups worldwide. Get in touch to add yours.
          </p>
          <a href="mailto:hello@terrace.global" style={{
            display: 'inline-block', background: CLUB_COLOR, color: '#fff',
            borderRadius: '7px', padding: '9px 20px', fontSize: '13px',
            fontWeight: 600, textDecoration: 'none',
          }}>
            Add your group
          </a>
        </div>
      </section>

      {/* â”€â”€ Footer â”€â”€ */}
      <footer style={{
        padding: '24px 32px', borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
      }}>
        <Link href="/" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>
          â† Back to Terrace.
        </Link>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.15)' }}>
          Terrace. Â· Arsenal Â· The global home for football fans
        </span>
      </footer>

    </main>
  );
}
