import Link from 'next/link';
import SiteNav from '../components/SiteNav';
import Footer from '../components/Footer';
import { supabase } from '@/lib/supabase';

export const revalidate = 60; // refresh live counts from Supabase at most once per minute

export default async function Home() {
  // Live count so the supporter-groups card never goes stale as groups grow.
  const { count: groupsCount } = await supabase
    .from('fan_groups')
    .select('*', { count: 'exact', head: true });

  // If the count query fails, fall back to a number-free sentence rather than showing "0".
  const groupsBody =
    groupsCount != null
      ? `${groupsCount} supporter groups and growing. Find your people, wherever you are.`
      : 'Supporter groups and growing. Find your people, wherever you are.';

  // Live count for the sports-bars card, same pattern as supporter groups.
  const { count: barsCount } = await supabase
    .from('sports_bars')
    .select('*', { count: 'exact', head: true });

  const barsBody =
    barsCount != null
      ? `${barsCount} bars mapped and growing. Find one wherever you're travelling.`
      : 'Bars showing the match, wherever you\u2019re travelling.';

  const DOORS = [
    {
      key: 'supporter-groups',
      label: 'Supporter Groups',
      dot: '#EF4444',
      pillBg: 'rgba(239,68,68,0.15)',
      pillBorder: 'rgba(239,68,68,0.35)',
      headline: 'Fan groups, worldwide.',
      body: groupsBody,
      cta: 'Find your people',
      href: '/supporter-groups',
    },
    {
      key: 'clubs-stadiums',
      label: 'Clubs / Stadiums',
      dot: '#FFFFFF',
      pillBg: 'rgba(255,255,255,0.1)',
      pillBorder: 'rgba(255,255,255,0.3)',
      headline: 'Every ground, mapped.',
      body: '65+ grounds across Europe\u2019s top leagues. Click a pin to visit the club.',
      cta: 'Open the map',
      href: '/club-map',
    },
    {
      key: 'sports-bars',
      label: 'Sports Bars',
      dot: '#F97316',
      pillBg: 'rgba(249,115,22,0.12)',
      pillBorder: 'rgba(249,115,22,0.3)',
      headline: 'Sports bars, mapped.',
      body: barsBody,
      cta: 'Find a bar',
      href: '/sports-bars',
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white" style={{ fontFamily: "'Inter', sans-serif" }}>

      <SiteNav active="home" />

      <section style={{ padding: '100px 32px 64px', maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(42px, 8vw, 80px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '24px' }}>
          Football fans,{' '}
          <span style={{ color: '#EF4444' }}>everywhere on earth.</span>
        </h1>

        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 48px' }}>
          The global home for football supporters. Find your people, follow your club,
          and never watch alone &mdash; wherever you are in the world.
        </p>

        <p style={{
          fontSize: '16px',
          color: '#EF4444',
          fontWeight: 600,
          letterSpacing: '0.02em',
        }}>
          &darr; Click below to search for fan groups around the world, club information, or sports bars
        </p>
      </section>

      <section style={{ padding: '0 32px 100px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}>
          {DOORS.map(door => {
            const cardInner = (
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: door.href ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.06)',
                borderRadius: '16px',
                padding: '32px 28px',
                height: '100%',
                opacity: door.href ? 1 : 0.55,
                transition: 'border-color 0.15s ease, background 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}>
                <div style={{
                  display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center',
                  background: door.pillBg, border: `1px solid ${door.pillBorder}`,
                  borderRadius: '999px', padding: '6px 14px',
                }}>
                  <span style={{
                    fontSize: '11px', fontWeight: 700, letterSpacing: '0.07em',
                    textTransform: 'uppercase', color: door.dot,
                  }}>
                    {door.label}
                  </span>
                </div>

                <h2 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.25 }}>
                  {door.headline}
                </h2>

                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, flexGrow: 1 }}>
                  {door.body}
                </p>

                <div style={{
                  fontSize: '13px', fontWeight: 600,
                  color: door.href ? (door.dot === '#FFFFFF' ? '#fff' : door.dot) : 'rgba(255,255,255,0.35)',
                }}>
                  {door.href ? `${door.cta} \u2192` : door.cta}
                </div>
              </div>
            );

            return door.href ? (
              <Link key={door.key} href={door.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                {cardInner}
              </Link>
            ) : (
              <div key={door.key} style={{ cursor: 'default' }}>
                {cardInner}
              </div>
            );
          })}
        </div>
      </section>

      <Footer showBackLink={false} stat="The global home for football fans" />

    </main>
  );
}
