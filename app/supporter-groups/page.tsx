import Link from 'next/link';
import SiteNav from '../../components/SiteNav';
import { supabase } from '@/lib/supabase';

export const revalidate = 60; // refresh from Supabase at most once per minute

type ClubLink = { slug: string; name: string };

export default async function CommunitiesPage() {
  // Club pills come straight from the clubs table (alphabetical by name), so a new
  // club appears here automatically the moment its row is added \u2014 no code edit.
  const { data: clubsData } = await supabase
    .from('clubs')
    .select('slug, name')
    .order('name');

  // Live total for the footer strip so it never goes stale.
  const { count: groupsCount } = await supabase
    .from('fan_groups')
    .select('*', { count: 'exact', head: true });

  const clubs: ClubLink[] = (clubsData || []).filter(
    (c): c is ClubLink => Boolean(c.slug && c.name)
  );
  const clubsCount = clubs.length;

  const footerStat =
    groupsCount != null
      ? `${clubsCount} clubs, ${groupsCount} fan groups`
      : `${clubsCount} clubs`;

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
          {clubs.map(club => (
            <Link key={club.slug} href={`/${club.slug}`} style={{
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
          Terrace. &middot; Supporter Groups &middot; {footerStat}
        </span>
      </footer>

    </main>
  );
}
