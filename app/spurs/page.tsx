'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';

const ClubMap = dynamic(() => import('../../components/SpursMap'), {
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

const CLUB_COLOR = '#132257';

const SUPPORTER_CLUBS = [
  {
    region: 'United Kingdom',
    groups: [
      {
        name: "Tottenham Hotspur Supporters' Trust (THST)",
        type: 'supporter_club',
        city: 'London',
        country: 'UK',
        website: 'https://thstofficial.com',
        description: 'The independent democratic supporters trust for Spurs fans. Represents supporters directly with the club on ticketing, safety and fan engagement.',
      },
    ],
  },
  {
    region: 'USA',
    groups: [
      {
        name: 'South Florida Spurs',
        type: 'supporter_club',
        city: 'Hollywood, Florida',
        country: 'USA',
        website: 'https://www.soflospurs.com',
        description: 'Official Tottenham Hotspur supporters club in South Florida. Watch parties at Mickey Byrnes Irish Pub in Hollywood, FL.',
      },
      {
        name: 'Spurs Official Supporters Clubs USA',
        type: 'supporter_club',
        city: 'Nationwide',
        country: 'USA',
        website: 'https://www.tottenhamhotspur.com/supporters-clubs/join-a-club/',
        description: 'Find your nearest official Spurs supporters club across the USA via the Tottenham Hotspur official directory.',
      },
    ],
  },
  {
    region: 'Ireland',
    groups: [
      {
        name: 'Spurs OSC Ireland',
        type: 'supporter_club',
        city: 'Dublin',
        country: 'Ireland',
        website: 'https://www.tottenhamhotspur.com/supporters-clubs/join-a-club/',
        description: 'Official Tottenham Hotspur supporters club in Ireland, part of the global network of 680+ OSCs worldwide.',
      },
    ],
  },
  {
    region: 'Australia',
    groups: [
      {
        name: 'Spurs OSC Australia',
        type: 'supporter_club',
        city: 'Sydney',
        country: 'Australia',
        website: 'https://www.tottenhamhotspur.com/supporters-clubs/join-a-club/',
        description: 'Official Tottenham Hotspur supporters club in Australia, part of the global network of 680+ OSCs worldwide.',
      },
    ],
  },
  {
    region: 'Canada',
    groups: [
      {
        name: 'Spurs OSC Canada',
        type: 'supporter_club',
        city: 'Toronto',
        country: 'Canada',
        website: 'https://www.tottenhamhotspur.com/supporters-clubs/join-a-club/',
        description: 'Official Tottenham Hotspur supporters club in Canada, part of the global network of 680+ OSCs worldwide.',
      },
    ],
  },
  {
    region: 'Asia',
    groups: [
      {
        name: 'Spurs OSC Japan',
        type: 'supporter_club',
        city: 'Tokyo',
        country: 'Japan',
        website: 'https://www.tottenhamhotspur.com/supporters-clubs/join-a-club/',
        description: 'Official Tottenham Hotspur supporters club in Japan, part of the global network of 680+ OSCs worldwide.',
      },
    ],
  },
  {
    region: 'Africa',
    groups: [
      {
        name: 'Spurs OSC South Africa',
        type: 'supporter_club',
        city: 'Johannesburg',
        country: 'South Africa',
        website: 'https://www.tottenhamhotspur.com/supporters-clubs/join-a-club/',
        description: 'Official Tottenham Hotspur supporters club in South Africa, part of the global network of 680+ OSCs worldwide.',
      },
    ],
  },
];

const TYPE_COLORS: Record<string, string> = {
  supporter_club: CLUB_COLOR,
  community: '#FFFFFF',
  fan_bar: '#F97316',
};

const TYPE_LABELS: Record<string, string> = {
  supporter_club: 'Supporter club',
  community: 'Fan community',
  fan_bar: 'Fan bar',
};

export default function SpursPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'Inter', sans-serif" }}>

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>← Terrace.</Link>
          <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.15)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: CLUB_COLOR }} />
            <span style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Tottenham Hotspur</span>
          </div>
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>The Lilywhites · Est. 1882</div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '60px 32px 48px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: `linear-gradient(180deg, rgba(19,34,87,0.06) 0%, transparent 100%)` }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(19,34,87,0.12)', border: '1px solid rgba(19,34,87,0.25)', borderRadius: '999px', padding: '5px 12px', marginBottom: '24px', fontSize: '11px', color: '#4f6acd', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4f6acd' }} />
            Premier League · London
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '16px' }}>
            Spurs fans,<br /><span style={{ color: '#4f6acd' }}>all over the world.</span>
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: '520px', marginBottom: '32px' }}>
            Find fellow Lilywhites worldwide — 680+ official supporter clubs across 60+ countries. To dare is to do.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a href="#directory" style={{ background: CLUB_COLOR, color: '#fff', borderRadius: '8px', padding: '11px 22px', fontSize: '14px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>Find a group near you</a>
            <a href="#map" style={{ background: 'transparent', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '11px 22px', fontSize: '14px', fontWeight: 500, textDecoration: 'none', display: 'inline-block' }}>View on map</a>
          </div>
        </div>
      </section>

      {/* Map */}
      <section id="map" style={{ height: '480px', position: 'relative', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <ClubMap />
        <div style={{ position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap', zIndex: 10 }}>
          Tottenham Hotspur fan groups worldwide
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
            <h3 style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4f6acd', marginBottom: '16px', paddingBottom: '8px', borderBottom: `1px solid rgba(19,34,87,0.4)` }}>
              {region.region}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {region.groups.map(group => (
                <a key={group.name} href={group.website} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'block', textDecoration: 'none', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '16px 20px', transition: 'border-color 0.15s, background 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(19,34,87,0.5)'; (e.currentTarget as HTMLElement).style.background = 'rgba(19,34,87,0.1)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4f6acd', flexShrink: 0 }} />
                        <span style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>{group.name}</span>
                        <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#4f6acd', opacity: 0.8 }}>{TYPE_LABELS[group.type]}</span>
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
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>We're building the most complete directory of Tottenham Hotspur fan groups worldwide.</p>
          <a href="mailto:hello@terrace.global" style={{ display: 'inline-block', background: CLUB_COLOR, color: '#fff', borderRadius: '7px', padding: '9px 20px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>Add your group</a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '24px 32px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <Link href="/" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>← Back to Terrace.</Link>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.15)' }}>Terrace. · Tottenham Hotspur · To Dare Is To Do</span>
      </footer>

    </main>
  );
}