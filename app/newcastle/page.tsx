'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';

const ClubMap = dynamic(() => import('../../components/NewcastleMap'), {
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

const CLUB_COLOR = '#241F20';
const CLUB_COLOR_LIGHT = '#8B8B8B';

const SUPPORTER_CLUBS = [
  {
    region: 'United Kingdom',
    groups: [
      {
        name: 'Newcastle United Supporters Trust (NUST)',
        type: 'supporter_club',
        city: 'Newcastle upon Tyne',
        country: 'UK',
        website: 'https://www.nufctrust.co.uk',
        description: 'The official supporters trust with 13,000 members across 35 countries. Representing the Toon Army\'s voice at board level.',
      },
      {
        name: 'Newcastle United SC London',
        type: 'supporter_club',
        city: 'London',
        country: 'UK',
        website: 'https://www.nufc-london.com',
        description: 'Official NUFC supporters club serving London and the South East since 1964. Matchdays at The Dolphin, Kings Cross.',
      },
    ],
  },
  {
    region: 'USA',
    groups: [
      {
        name: 'NUFC Official Supporters Clubs USA',
        type: 'supporter_club',
        city: 'Nationwide',
        country: 'USA',
        website: 'https://www.newcastleunited.com/en/fans/official-nufc-supporters-clubs',
        description: 'Find your nearest official Newcastle United supporters club across the USA via the official NUFC directory.',
      },
    ],
  },
  {
    region: 'Ireland',
    groups: [
      {
        name: 'NUFC OSC Ireland',
        type: 'supporter_club',
        city: 'Dublin',
        country: 'Ireland',
        website: 'https://www.newcastleunited.com/en/fans/official-nufc-supporters-clubs',
        description: 'Official Newcastle United supporters club in Ireland, part of the growing global OSC network.',
      },
    ],
  },
  {
    region: 'Australia',
    groups: [
      {
        name: 'NUFC OSC Australia',
        type: 'supporter_club',
        city: 'Sydney',
        country: 'Australia',
        website: 'https://www.newcastleunited.com/en/fans/official-nufc-supporters-clubs',
        description: 'Official Newcastle United supporters club in Australia, part of the growing global OSC network.',
      },
    ],
  },
  {
    region: 'Canada',
    groups: [
      {
        name: 'NUFC OSC Canada',
        type: 'supporter_club',
        city: 'Toronto',
        country: 'Canada',
        website: 'https://www.newcastleunited.com/en/fans/official-nufc-supporters-clubs',
        description: 'Official Newcastle United supporters club in Canada, part of the growing global OSC network.',
      },
    ],
  },
  {
    region: 'New Zealand',
    groups: [
      {
        name: 'NUFC OSC New Zealand',
        type: 'supporter_club',
        city: 'Wellington',
        country: 'New Zealand',
        website: 'https://www.newcastleunited.com/en/fans/official-nufc-supporters-clubs',
        description: 'Official Newcastle United supporters club in New Zealand — from Wallsend to Wellington.',
      },
    ],
  },
];

const TYPE_LABELS: Record<string, string> = {
  supporter_club: 'Supporter club',
  community: 'Fan community',
  fan_bar: 'Fan bar',
};

export default function NewcastlePage() {
  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'Inter', sans-serif" }}>

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>← Terrace.</Link>
          <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.15)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: CLUB_COLOR_LIGHT }} />
            <span style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Newcastle United</span>
          </div>
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>The Magpies · Est. 1892</div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '60px 32px 48px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: `linear-gradient(180deg, rgba(36,31,32,0.3) 0%, transparent 100%)` }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(139,139,139,0.12)', border: '1px solid rgba(139,139,139,0.25)', borderRadius: '999px', padding: '5px 12px', marginBottom: '24px', fontSize: '11px', color: CLUB_COLOR_LIGHT, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: CLUB_COLOR_LIGHT }} />
            Premier League · Newcastle upon Tyne
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '16px' }}>
            Toon Army,<br /><span style={{ color: CLUB_COLOR_LIGHT }}>all over the world.</span>
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: '520px', marginBottom: '32px' }}>
            Find fellow Geordies worldwide — from Newcastle to New York, Blyth to Beijing, Wallsend to Wellington. Howay the Lads.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a href="#directory" style={{ background: CLUB_COLOR_LIGHT, color: '#fff', borderRadius: '8px', padding: '11px 22px', fontSize: '14px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>Find a group near you</a>
            <a href="#map" style={{ background: 'transparent', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '11px 22px', fontSize: '14px', fontWeight: 500, textDecoration: 'none', display: 'inline-block' }}>View on map</a>
          </div>
        </div>
      </section>

      {/* Map */}
      <section id="map" style={{ height: '480px', position: 'relative', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <ClubMap />
        <div style={{ position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap', zIndex: 10 }}>
          Newcastle United fan groups worldwide
        </div>
      </section>

      {/* Directory */}
      <section id="directory" style={{ padding: '64px 32px', maxWidth: '960px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Fan group directory</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '48px' }}>
          Official supporter clubs and fan communities worldwide. Click any group to visit their site.
        </p>
        {SUPPORTER_CLUBS.map(region => (
          <div key={region.region} style={{ marginBottom: '48px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: CLUB_COLOR_LIGHT, marginBottom: '16px', paddingBottom: '8px', borderBottom: `1px solid rgba(139,139,139,0.2)` }}>
              {region.region}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {region.groups.map(group => (
                <a key={group.name} href={group.website} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'block', textDecoration: 'none', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '16px 20px', transition: 'border-color 0.15s, background 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(139,139,139,0.3)'; (e.currentTarget as HTMLElement).style.background = 'rgba(139,139,139,0.05)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: CLUB_COLOR_LIGHT, flexShrink: 0 }} />
                        <span style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>{group.name}</span>
                        <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: CLUB_COLOR_LIGHT, opacity: 0.8 }}>{TYPE_LABELS[group.type]}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginBottom: '6px' }}>{group.city} · {group.country}</div>
                      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{group.description}</div>
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', flexShrink: 0, paddingTop: '2px' }}>Visit →</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}

        {/* Missing group CTA */}
        <div style={{ marginTop: '48px', padding: '28px', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.12)', textAlign: 'center' }}>
          <p style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>Is your group missing?</p>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>We're building the most complete directory of Newcastle United fan groups worldwide.</p>
          <a href="mailto:hello@terrace.global" style={{ display: 'inline-block', background: CLUB_COLOR_LIGHT, color: '#fff', borderRadius: '7px', padding: '9px 20px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>Add your group</a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '24px 32px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <Link href="/" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>← Back to Terrace.</Link>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.15)' }}>Terrace. · Newcastle United · Howay the Lads</span>
      </footer>

    </main>
  );
}