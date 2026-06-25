import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import ClubMapLoader from '../../components/ClubMapLoader';
import SiteNav from '../../components/SiteNav';


export const revalidate = 3600; // refresh from Supabase at most once per hour

type FanGroupRow = {
  name: string;
  city: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  url: string;
  description: string | null;
  region: string | null;
  type: string | null;
};

function typeColor(type: string | null, clubColor: string) {
  if (type === 'community') return '#FFFFFF';
  if (type === 'fan_bar') return '#F97316';
  return clubColor;
}

function typeLabel(type: string | null) {
  if (type === 'community') return 'Fan community';
  if (type === 'fan_bar') return 'Fan bar';
  return 'Supporter club';
}

export default async function EvertonPage() {
  const { data: club } = await supabase
    .from('clubs')
    .select('id, color')
    .eq('slug', 'everton')
    .single();

  if (!club) {
    return (
      <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '40px', fontFamily: "'Inter', sans-serif" }}>
        Unable to load club data right now.
      </main>
    );
  }

  const CLUB_COLOR = club.color || '#003399';

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

  const regionMap = new Map<string, FanGroupRow[]>();
  for (const g of groups) {
    const region = g.region || 'More worldwide';
    if (!regionMap.has(region)) regionMap.set(region, []);
    regionMap.get(region)!.push(g);
  }
  const regionOrder = Array.from(regionMap.keys()).sort((a, b) => {
    if (a === 'United Kingdom') return -1;
    if (b === 'United Kingdom') return 1;
    if (a === 'More worldwide') return 1;
    if (b === 'More worldwide') return -1;
    return a.localeCompare(b);
  });

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'Inter', sans-serif" }}>

      {/* Nav */}
      <SiteNav active="club-map" club={{ name: 'Everton FC', color: CLUB_COLOR, tagline: 'The Toffees · Est. 1878' }} />

      {/* Hero */}
      <section style={{ padding: '60px 32px 48px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: `linear-gradient(180deg, rgba(0,51,153,0.06) 0%, transparent 100%)` }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0,51,153,0.12)', border: '1px solid rgba(0,51,153,0.25)', borderRadius: '999px', padding: '5px 12px', marginBottom: '24px', fontSize: '11px', color: CLUB_COLOR, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: CLUB_COLOR }} />
            Premier League · Liverpool
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '16px' }}>
            Toffees fans,<br /><span style={{ color: CLUB_COLOR }}>all over the world.</span>
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: '520px', marginBottom: '32px' }}>
            Find fellow Evertonians worldwide — the People's Club, now at the Hill Dickinson Stadium. Nothing but Blue Skies.
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
          Everton FC fan groups worldwide
        </div>
      </section>

      {/* Directory */}
      <section id="directory" style={{ padding: '64px 32px', maxWidth: '960px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Fan group directory</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '48px' }}>
          Official supporter clubs and fan communities worldwide. Click any group to visit their site.
        </p>
        {regionOrder.map(region => (
          <div key={region} style={{ marginBottom: '48px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: CLUB_COLOR, marginBottom: '16px', paddingBottom: '8px', borderBottom: `1px solid rgba(108,171,221,0.2)` }}>
              {region}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {regionMap.get(region)!.map(group => (
                <a key={group.name} href={group.url} target="_blank" rel="noopener noreferrer" className="tg-fan-card"
                  style={{ display: 'block', textDecoration: 'none', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '16px 20px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: typeColor(group.type, CLUB_COLOR), flexShrink: 0 }} />
                        <span style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>{group.name}</span>
                        <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: typeColor(group.type, CLUB_COLOR), opacity: 0.8 }}>{typeLabel(group.type)}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginBottom: '6px' }}>{group.city ? `${group.city} · ${group.country}` : group.country}</div>
                      {group.description && (
                        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{group.description}</div>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', flexShrink: 0, paddingTop: '2px' }}>Visit →</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}

        <style>{`
          .tg-fan-card { transition: border-color 0.15s, background 0.15s; }
          .tg-fan-card:hover { border-color: ${CLUB_COLOR}55; background: rgba(255,255,255,0.05); }
        `}</style>

        <div style={{ marginTop: '48px', padding: '28px', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.12)', textAlign: 'center' }}>
          <p style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>Is your group missing?</p>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>We're building the most complete directory of Everton FC fan groups worldwide.</p>
          <a href="mailto:hello@terrace.global" style={{ display: 'inline-block', background: CLUB_COLOR, color: '#fff', borderRadius: '7px', padding: '9px 20px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>Add your group</a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '24px 32px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <Link href="/" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>← Back to Terrace.</Link>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.15)' }}>Terrace. · Everton FC · Nothing But Blue Skies</span>
      </footer>

    </main>
  );
}