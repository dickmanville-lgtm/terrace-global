'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';

const ManCityMap = dynamic(() => import('../../components/ManCityMap'), {
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

const CLUB_COLOR = '#6CABDD';

const SUPPORTER_CLUBS = [
  {
    region: 'United Kingdom',
    groups: [
      { name: 'Man City OSC (Official)', type: 'supporter_club', city: 'Manchester', country: 'UK', website: 'https://www.mancityosc.com/', description: 'The official Manchester City Supporters Club, formed in 1949. Over 240 branches and 19,000 members worldwide.' },
      
      { name: 'Dukinfield Blues', type: 'supporter_club', city: 'Dukinfield', country: 'UK', website: 'https://www.dukinfieldmcfc.co.uk/', description: 'Official MCFC supporters branch serving the Dukinfield area of Greater Manchester.' },
      { name: 'Hazel Grove Blues', type: 'supporter_club', city: 'Hazel Grove', country: 'UK', website: 'http://www.hazelgroveblues.co.uk/', description: 'Official supporters branch for Man City fans in the Hazel Grove and Stockport area.' },
      { name: 'Northenden Blues', type: 'supporter_club', city: 'Northenden', country: 'UK', website: 'http://www.northendenblues.com/', description: 'Official MCFC supporters branch in the Northenden area of South Manchester.' },
      { name: 'Reddish Blues', type: 'supporter_club', city: 'Reddish', country: 'UK', website: 'http://www.reddishblues.com/', description: 'Official Manchester City supporters branch based in Reddish, Stockport.' },
      { name: 'Wessex Blues', type: 'supporter_club', city: 'South England', country: 'UK', website: 'http://wessexblues.co.uk/', description: 'Official MCFC supporters branch serving City fans across the Wessex region of southern England.' },
    ]
  },
  {
    region: 'USA',
    groups: [
      { name: 'Chicago MCFC', type: 'supporter_club', city: 'Chicago', country: 'USA', website: 'http://www.chicagomcfc.org/', description: 'Official Man City supporters branch in Chicago. One of the most active City groups in North America.' },
      { name: 'MCFC Boston', type: 'supporter_club', city: 'Boston', country: 'USA', website: 'http://www.mcfcboston.com/', description: 'Official Manchester City supporters club in Boston, Massachusetts.' },
      { name: 'Man City Atlanta Cityzens', type: 'supporter_club', city: 'Atlanta', country: 'USA', website: 'http://www.mancityatlcityzens.com/', description: 'Official Man City supporters branch serving the Atlanta metro area.' },
    ]
  },
  {
    region: 'Europe',
    groups: [
      { name: 'Man City Switzerland', type: 'supporter_club', city: 'Zurich', country: 'Switzerland', website: 'https://www.mancityswisssupporters.com/', description: 'Official Manchester City supporters club for fans across Switzerland.' },
      { name: 'Man City Scandinavia', type: 'supporter_club', city: 'Oslo', country: 'Norway', website: 'http://www.manchestercity.no/', description: 'Official MCFC supporters branch for City fans across Scandinavia, based in Norway.' },
    ]
  },
  {
    region: 'Australia',
    groups: [
      { name: 'MCFC Australia', type: 'supporter_club', city: 'Australia', country: 'Australia', website: 'https://www.mcfcaustralia.com.au/', description: 'Founded in 2003 by fans for fans. The home of Manchester City FC in Australia, connecting Aussie Blues nationwide.' },
    ]
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

export default function ManCityPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'Inter', sans-serif" }}>

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>← Terrace.</Link>
          <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.15)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: CLUB_COLOR }} />
            <span style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Manchester City</span>
          </div>
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>The Citizens · Est. 1880</div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '60px 32px 48px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: `linear-gradient(180deg, rgba(108,171,221,0.06) 0%, transparent 100%)` }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(108,171,221,0.12)', border: '1px solid rgba(108,171,221,0.25)', borderRadius: '999px', padding: '5px 12px', marginBottom: '24px', fontSize: '11px', color: CLUB_COLOR, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: CLUB_COLOR }} />
            Premier League · Manchester
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '16px' }}>
            City fans,<br /><span style={{ color: CLUB_COLOR }}>all over the world.</span>
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: '520px', marginBottom: '32px' }}>
            Find fellow Cityzens worldwide — 400+ official supporter clubs across 65+ countries. Always Sky Blue.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a href="#directory" style={{ background: CLUB_COLOR, color: '#fff', borderRadius: '8px', padding: '11px 22px', fontSize: '14px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>Find a group near you</a>
            <a href="#map" style={{ background: 'transparent', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '11px 22px', fontSize: '14px', fontWeight: 500, textDecoration: 'none', display: 'inline-block' }}>View on map</a>
          </div>
        </div>
      </section>

      {/* Map */}
      <section id="map" style={{ height: '480px', position: 'relative', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <ManCityMap />
        <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap', zIndex: 10 }}>
          Manchester City fan groups worldwide
        </div>
      </section>

      {/* Directory */}
      <section id="directory" style={{ padding: '64px 32px', maxWidth: '960px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Fan group directory</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '48px' }}>
          Official supporter clubs, fan communities and bars worldwide. Click any group to visit their site.
        </p>
        {SUPPORTER_CLUBS.map(region => (
          <div key={region.region} style={{ marginBottom: '48px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: CLUB_COLOR, marginBottom: '16px', paddingBottom: '8px', borderBottom: `1px solid rgba(108,171,221,0.2)` }}>
              {region.region}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {region.groups.map(group => (
                <a key={group.name} href={group.website} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'block', textDecoration: 'none', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '16px 20px', transition: 'border-color 0.15s, background 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(108,171,221,0.3)'; (e.currentTarget as HTMLElement).style.background = 'rgba(108,171,221,0.05)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: TYPE_COLORS[group.type], flexShrink: 0 }} />
                        <span style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>{group.name}</span>
                        <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: TYPE_COLORS[group.type], opacity: 0.8 }}>{TYPE_LABELS[group.type]}</span>
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
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>We're building the most complete directory of Manchester City fan groups worldwide.</p>
          <a href="mailto:hello@terrace.global" style={{ display: 'inline-block', background: CLUB_COLOR, color: '#fff', borderRadius: '7px', padding: '9px 20px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>Add your group</a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '24px 32px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <Link href="/" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>← Back to Terrace.</Link>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.15)' }}>Terrace. · Manchester City · Always Sky Blue</span>
      </footer>

    </main>
  );
}
