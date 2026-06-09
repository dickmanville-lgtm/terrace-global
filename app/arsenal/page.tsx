'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';

const ArsenalMap = dynamic(() => import('../../components/ArsenalMap'), {
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

const SUPPORTER_CLUBS = [
  {
    region: 'United Kingdom',
    groups: [
      { name: 'Arsenal Supporters Trust', type: 'supporter_club', city: 'London', country: 'UK', website: 'https://www.arsenaltrust.org', twitter: 'https://twitter.com/ArsenalTrust', description: 'The independent supporters trust representing Arsenal fans.' },
      { name: 'Gay Gooners', type: 'supporter_club', city: 'London', country: 'UK', website: 'https://www.arsenal.com/fanzone/gay-gooners', description: 'Official LGBTQ+ supporters group. First and largest in world football. 1,600+ members across 51 countries.' },
      { name: 'Arsenal Supporters Forum', type: 'community', city: 'London', country: 'UK', website: 'https://www.arsenal.com/fanzone/arsenal-supporters-forum', description: 'Official supporters forum — the formal channel between fans and the club.' },
    ]
  },
  {
    region: 'USA',
    groups: [
      { name: 'Arsenal America', type: 'supporter_club', city: 'Nationwide USA', country: 'USA', website: 'https://arsenalamerica.com', twitter: 'https://twitter.com/ArsenalAmerica', description: 'Officially recognised national chapter. 86+ branches across the USA. The largest Arsenal supporters network outside the UK.' },
      { name: 'Arsenal NYC', type: 'community', city: 'New York', country: 'USA', website: 'https://arsenalnyc.com', twitter: 'https://twitter.com/ArsenalNYC', description: 'Independent supporters group for New York City and surrounding area.' },
      { name: 'Arsenal Los Angeles', type: 'fan_bar', city: 'Los Angeles', country: 'USA', website: 'https://arsenalamerica.com/branches', description: 'Watches at The Fox & Hounds, 11100 Ventura Blvd, Studio City CA. Official Arsenal America branch.' },
      { name: 'Bay Area Gooners', type: 'fan_bar', city: 'San Francisco', country: 'USA', website: 'https://bayareagooners.com', twitter: 'https://twitter.com/bayareagooners', description: 'Watches at Maggy McGarry\'s Irish Pub, 1353 Grant Ave, San Francisco CA.' },
      { name: 'Chicago Gooners', type: 'fan_bar', city: 'Chicago', country: 'USA', website: 'https://arsenalamerica.com/branches', description: 'Official Arsenal America branch in Chicago. Check arsenalamerica.com for venue details.' },
    ]
  },
  {
    region: 'Australia',
    groups: [
      { name: 'Arsenal Australia Supporters Club', type: 'supporter_club', city: 'Nationwide Australia', country: 'Australia', website: 'https://arsenalaustralia.com.au', description: 'Official supporters club for Australia. Active in Sydney, Melbourne, Brisbane, Perth and beyond. Provides ticket access for home matches.' },
    ]
  },
  {
    region: 'Asia',
    groups: [
      { name: 'Arsenal Singapore', type: 'community', city: 'Singapore', country: 'Singapore', website: 'https://www.arsenal.com/supportersclubs/asia', description: 'Official supporters club. Arsenal played Singapore on pre-season tour in July 2025.' },
      { name: 'Arsenal Hong Kong', type: 'community', city: 'Hong Kong', country: 'China', website: 'https://www.arsenal.com/supportersclubs/asia', description: 'Official supporters club. One of the largest Arsenal communities in Asia.' },
      { name: 'Arsenal Thailand', type: 'community', city: 'Bangkok', country: 'Thailand', website: 'https://www.arsenal.com/supportersclubs/asia', description: 'Official supporters club. Enormous fan base — one of Arsenal\'s biggest communities worldwide.' },
      { name: 'Arsenal Indonesia', type: 'community', city: 'Jakarta', country: 'Indonesia', website: 'https://www.arsenal.com/supportersclubs/asia', description: 'Official supporters club. Massive following across Indonesia.' },
      { name: 'Arsenal Malaysia', type: 'community', city: 'Kuala Lumpur', country: 'Malaysia', website: 'https://www.arsenal.com/supportersclubs/asia', description: 'Official supporters club in Malaysia.' },
    ]
  },
  {
    region: 'Europe',
    groups: [
      { name: 'Arsenal Supporters Clubs Europe', type: 'supporter_club', city: 'Europe', country: 'Various', website: 'https://www.arsenal.com/supportersclubs/arsenal-supporters-clubs-europe', description: 'Directory of all official Arsenal supporters clubs across Europe — searchable by country.' },
    ]
  },
];

const TYPE_COLORS: Record<string, string> = {
  supporter_club: '#EF4444',
  community: '#FFFFFF',
  fan_bar: '#F97316',
};

const TYPE_LABELS: Record<string, string> = {
  supporter_club: 'Supporter club',
  community: 'Fan community',
  fan_bar: 'Fan bar',
};

export default function ArsenalPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'Inter', sans-serif" }}>

      {/* ── Nav ── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 32px', borderBottom: '1px solid rgba(255,255,255,0.08)',
        position: 'sticky', top: 0, background: 'rgba(10,10,10,0.95)',
        backdropFilter: 'blur(12px)', zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/" style={{
            fontSize: '12px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            ← Terrace.
          </Link>
          <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.15)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }} />
            <span style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Arsenal</span>
          </div>
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>
          The Gunners · Est. 1886
        </div>
      </nav>

      {/* ── Hero ── */}
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
            fontSize: '11px', color: '#EF4444', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#EF4444' }} />
            Premier League · North London
          </div>

          <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '16px' }}>
            Arsenal fans,<br />
            <span style={{ color: '#EF4444' }}>everywhere on earth.</span>
          </h1>

          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: '520px', marginBottom: '32px' }}>
            Find Gooners worldwide — supporter clubs, fan communities and bars showing Arsenal matches wherever you are.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a href="#directory" style={{
              background: '#EF4444', color: '#fff', borderRadius: '8px',
              padding: '11px 22px', fontSize: '14px', fontWeight: 600,
              textDecoration: 'none', display: 'inline-block',
            }}>
              Find a group near you
            </a>
            <a href="#map" style={{
              background: 'transparent', color: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px',
              padding: '11px 22px', fontSize: '14px', fontWeight: 500,
              textDecoration: 'none', display: 'inline-block',
            }}>
              View on map
            </a>
          </div>
        </div>
      </section>

      {/* ── Map ── */}
      <section id="map" style={{ height: '480px', position: 'relative', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <ArsenalMap />
        <div style={{
          position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
          padding: '8px 16px', fontSize: '12px', color: 'rgba(255,255,255,0.6)',
          whiteSpace: 'nowrap', zIndex: 10,
        }}>
          Arsenal fan groups worldwide
        </div>
      </section>

      {/* ── Directory ── */}
      <section id="directory" style={{ padding: '64px 32px', maxWidth: '960px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Fan group directory</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '48px' }}>
          Official supporter clubs, fan communities and bars worldwide. Click any group to visit their site.
        </p>

        {SUPPORTER_CLUBS.map(region => (
          <div key={region.region} style={{ marginBottom: '48px' }}>
            <h3 style={{
              fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: '#EF4444',
              marginBottom: '16px', paddingBottom: '8px',
              borderBottom: '1px solid rgba(239,68,68,0.2)',
            }}>
              {region.region}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {region.groups.map(group => (
                <a
                  key={group.name}
                  href={group.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block', textDecoration: 'none',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '10px', padding: '16px 20px',
                    transition: 'border-color 0.15s, background 0.15s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(239,68,68,0.3)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.05)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <div style={{
                          width: '8px', height: '8px', borderRadius: '50%',
                          background: TYPE_COLORS[group.type], flexShrink: 0,
                        }} />
                        <span style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>{group.name}</span>
                        <span style={{
                          fontSize: '10px', fontWeight: 500, letterSpacing: '0.06em',
                          textTransform: 'uppercase', color: TYPE_COLORS[group.type],
                          opacity: 0.8,
                        }}>
                          {TYPE_LABELS[group.type]}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginBottom: '6px' }}>
                        {group.city} · {group.country}
                      </div>
                      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
                        {group.description}
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', flexShrink: 0, paddingTop: '2px' }}>
                      Visit →
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}

        {/* Add your group CTA */}
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
            display: 'inline-block', background: '#EF4444', color: '#fff',
            borderRadius: '7px', padding: '9px 20px', fontSize: '13px',
            fontWeight: 600, textDecoration: 'none',
          }}>
            Add your group
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        padding: '24px 32px', borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
      }}>
        <Link href="/" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>
          ← Back to Terrace.
        </Link>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.15)' }}>
          Terrace. · Arsenal · The global home for football fans
        </span>
      </footer>

    </main>
  );
}
