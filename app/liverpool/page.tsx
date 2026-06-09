'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';

const LiverpoolMap = dynamic(() => import('../../components/LiverpoolMap'), {
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
      { name: 'Spirit of Shankly', type: 'supporter_club', city: 'Liverpool', country: 'UK', website: 'https://spiritofshankly.com', description: 'Official LFC supporters union. 300,000+ worldwide followers. Represents fans directly to the club.' },
      { name: 'The Sandon', type: 'fan_bar', city: 'Liverpool', country: 'UK', website: 'https://www.thesandon.co.uk', description: 'The historic pub where Liverpool FC was founded in 1892. A pilgrimage for Reds fans worldwide.' },
    ]
  },
  {
    region: 'USA',
    groups: [
      { name: 'OLSC Boston', type: 'supporter_club', city: 'Boston', country: 'USA', website: 'https://www.lfcboston.com', description: 'Watches at The Phoenix Landing, Cambridge MA and The Greatest Bar, Boston. Est. 2006.' },
      { name: 'OLSC New York', type: 'supporter_club', city: 'New York', country: 'USA', website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official Liverpool supporters club in New York City.' },
      { name: 'OLSC Los Angeles', type: 'supporter_club', city: 'Los Angeles', country: 'USA', website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official Liverpool supporters club in Los Angeles.' },
      { name: 'OLSC Chicago', type: 'supporter_club', city: 'Chicago', country: 'USA', website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official Liverpool supporters club in Chicago.' },
    ]
  },
  {
    region: 'Australia',
    groups: [
      { name: 'OLSC Sydney', type: 'supporter_club', city: 'Sydney', country: 'Australia', website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official Liverpool supporters club in Sydney.' },
      { name: 'OLSC Melbourne', type: 'supporter_club', city: 'Melbourne', country: 'Australia', website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official Liverpool supporters club in Melbourne.' },
    ]
  },
  {
    region: 'Asia',
    groups: [
      { name: 'BigReds Indonesia', type: 'supporter_club', city: 'Jakarta', country: 'Indonesia', website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official LFC supporters club. LFC opened official retail stores in Jakarta (2024) and Surabaya (2025).' },
      { name: 'OLSC Singapore', type: 'supporter_club', city: 'Singapore', country: 'Singapore', website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official Liverpool supporters club in Singapore.' },
      { name: 'OLSC Malaysia', type: 'supporter_club', city: 'Kuala Lumpur', country: 'Malaysia', website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official Liverpool supporters club in Malaysia.' },
      { name: 'OLSC Thailand', type: 'supporter_club', city: 'Bangkok', country: 'Thailand', website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official Liverpool supporters club in Thailand.' },
      { name: 'OLSC Maldives', type: 'supporter_club', city: 'Male', country: 'Maldives', website: 'https://www.liverpoolfc.com/news/we-love-you-liverpool-meet-official-lfc-supporters-club-maldives', description: 'Featured by LFC for their passion and community spirit.' },
    ]
  },
  {
    region: 'Africa',
    groups: [
      { name: 'OLSC Nigeria', type: 'supporter_club', city: 'Lagos', country: 'Nigeria', website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official Liverpool supporters club in Nigeria.' },
      { name: 'OLSC South Africa', type: 'supporter_club', city: 'Johannesburg', country: 'South Africa', website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official Liverpool supporters club in South Africa.' },
      { name: 'OLSC Kenya', type: 'supporter_club', city: 'Nairobi', country: 'Kenya', website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official Liverpool supporters club in Kenya.' },
    ]
  },
  {
    region: 'Europe',
    groups: [
      { name: 'OLSC Norway', type: 'supporter_club', city: 'Oslo', country: 'Norway', website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official Liverpool supporters club in Norway.' },
      { name: 'OLSC Ireland', type: 'supporter_club', city: 'Dublin', country: 'Ireland', website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official Liverpool supporters club in Ireland.' },
      { name: 'OLSC Germany', type: 'supporter_club', city: 'Berlin', country: 'Germany', website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official Liverpool supporters club in Germany.' },
    ]
  },
  {
    region: 'South America',
    groups: [
      { name: 'OLSC Brazil', type: 'supporter_club', city: 'São Paulo', country: 'Brazil', website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official Liverpool supporters club in Brazil.' },
      { name: 'OLSC Argentina', type: 'supporter_club', city: 'Buenos Aires', country: 'Argentina', website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official Liverpool supporters club in Argentina.' },
    ]
  },
];

const TYPE_COLORS: Record<string, string> = {
  supporter_club: '#C8102E',
  community: '#FFFFFF',
  fan_bar: '#F97316',
};

const TYPE_LABELS: Record<string, string> = {
  supporter_club: 'Supporter club',
  community: 'Fan community',
  fan_bar: 'Fan bar',
};

export default function LiverpoolPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'Inter', sans-serif" }}>

      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>← Terrace.</Link>
          <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.15)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#C8102E' }} />
            <span style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Liverpool</span>
          </div>
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>The Reds · Est. 1892</div>
      </nav>

      <section style={{ padding: '60px 32px 48px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'linear-gradient(180deg, rgba(200,16,46,0.06) 0%, transparent 100%)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(200,16,46,0.12)', border: '1px solid rgba(200,16,46,0.25)', borderRadius: '999px', padding: '5px 12px', marginBottom: '24px', fontSize: '11px', color: '#C8102E', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#C8102E' }} />
            Premier League · Merseyside
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '16px' }}>
            Liverpool fans,<br /><span style={{ color: '#C8102E' }}>everywhere on earth.</span>
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: '520px', marginBottom: '32px' }}>
            Find Reds worldwide — 300+ official supporter clubs across 100 countries. You'll Never Walk Alone.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a href="#directory" style={{ background: '#C8102E', color: '#fff', borderRadius: '8px', padding: '11px 22px', fontSize: '14px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>Find a group near you</a>
            <a href="#map" style={{ background: 'transparent', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '11px 22px', fontSize: '14px', fontWeight: 500, textDecoration: 'none', display: 'inline-block' }}>View on map</a>
          </div>
        </div>
      </section>

      <section id="map" style={{ height: '480px', position: 'relative', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <LiverpoolMap />
        <div style={{ position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap', zIndex: 10 }}>
          Liverpool fan groups worldwide
        </div>
      </section>

      <section id="directory" style={{ padding: '64px 32px', maxWidth: '960px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Fan group directory</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '48px' }}>
          Official supporter clubs, fan communities and bars worldwide. Click any group to visit their site.
        </p>
        {SUPPORTER_CLUBS.map(region => (
          <div key={region.region} style={{ marginBottom: '48px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C8102E', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid rgba(200,16,46,0.2)' }}>
              {region.region}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {region.groups.map(group => (
                <a key={group.name} href={group.website} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textDecoration: 'none', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '16px 20px', transition: 'border-color 0.15s, background 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(200,16,46,0.3)'; (e.currentTarget as HTMLElement).style.background = 'rgba(200,16,46,0.05)'; }}
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
        <div style={{ marginTop: '48px', padding: '28px', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.12)', textAlign: 'center' }}>
          <p style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>Is your group missing?</p>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>We're building the most complete directory of Liverpool fan groups worldwide.</p>
          <a href="mailto:hello@terrace.global" style={{ display: 'inline-block', background: '#C8102E', color: '#fff', borderRadius: '7px', padding: '9px 20px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>Add your group</a>
        </div>
      </section>

      <footer style={{ padding: '24px 32px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <Link href="/" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>← Back to Terrace.</Link>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.15)' }}>Terrace. · Liverpool · You'll Never Walk Alone</span>
      </footer>
    </main>
  );
}