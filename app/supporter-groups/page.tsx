import Link from 'next/link';
import SiteNav from '../../components/SiteNav';

const CLUBS = [
  { name: 'Arsenal', url: '/arsenal' },
  { name: 'Aston Villa', url: '/aston-villa' },
  { name: 'Bournemouth', url: '/bournemouth' },
  { name: 'Brentford', url: '/brentford' },
  { name: 'Brighton', url: '/brighton' },
  { name: 'Celtic', url: '/celtic' },
  { name: 'Chelsea', url: '/chelsea' },
  { name: 'Coventry City', url: '/coventry' },
  { name: 'Crystal Palace', url: '/crystal-palace' },
  { name: 'Everton', url: '/everton' },
  { name: 'Fulham', url: '/fulham' },
  { name: 'Hull City', url: '/hull' },
  { name: 'Ipswich Town', url: '/ipswich' },
  { name: 'Leeds United', url: '/leeds' },
  { name: 'Liverpool', url: '/liverpool' },
  { name: 'Man United', url: '/manchester-united' },
  { name: 'Manchester City', url: '/manchester-city' },
  { name: 'Newcastle', url: '/newcastle' },
  { name: 'Nottingham Forest', url: '/nottingham-forest' },
  { name: 'Rangers', url: '/rangers' },
  { name: 'Spurs', url: '/spurs' },
  { name: 'Sunderland', url: '/sunderland' },
];

export default function CommunitiesPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'Inter', sans-serif" }}>

      <SiteNav active="supporter-groups" />

      {/* Hero */}
      <section style={{ padding: '64px 32px 40px', maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '16px' }}>
          Find your <span style={{ color: '#EF4444' }}>people.</span>
        </h1>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: '520px', margin: '0 auto' }}>
          Supporter clubs, fan communities and matchday bars for every club below.
          Select yours to explore.
        </p>
      </section>

      {/* Club grid */}
      <section style={{ padding: '0 32px 100px', maxWidth: '900px', margin: '0 auto' }}>
        <p style={{
          textAlign: 'center', fontSize: '12px', fontWeight: 500, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '20px',
        }}>
          Select your club
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
          {CLUBS.map(club => (
            <Link key={club.name} href={club.url} style={{
              padding: '8px 18px', borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'transparent',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '13px', fontWeight: 400,
              textDecoration: 'none', transition: 'all 0.15s ease',
              display: 'inline-block',
            }}>
              {club.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '24px 32px', borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
      }}>
        <Link href="/" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>
          &larr; Back to Terrace.
        </Link>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.15)' }}>
          Terrace. &middot; Supporter Groups &middot; 22 clubs, 239 fan groups
        </span>
      </footer>

    </main>
  );
}