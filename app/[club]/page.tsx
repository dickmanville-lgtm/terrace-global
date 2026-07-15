import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { readableAccent } from '@/lib/color';
import ClubMapLoader from '@/components/ClubMapLoader';
import SiteNav from '@/components/SiteNav';
import FanGroupDirectory, { type FanGroupRow } from '@/components/FanGroupDirectory';
import HeroActionButtons from '@/components/HeroActionButtons';
import AddGroupPill from '@/components/AddGroupPill';
import Footer from '@/components/Footer';

export const revalidate = 60; // refresh from Supabase at most once per minute

// Pre-render a static page for every club slug in the DB.
export async function generateStaticParams() {
  const { data } = await supabase.from('clubs').select('slug');
  return (data || []).map(c => ({ club: c.slug as string }));
}

type ClubRow = {
  id: number;
  name: string | null;
  slug: string | null;
  color: string | null;
  nav_name: string | null;
  tagline: string | null;
  hero_location: string | null;
  hero_headline: string | null;
  hero_subhead: string | null;
  hero_blurb: string | null;
  map_caption: string | null;
  footer_tagline: string | null;
  directory_intro: string | null;
};

export default async function ClubPage({
  params,
}: {
  params: Promise<{ club: string }>;
}) {
  const { club: slug } = await params;

  const { data: club } = await supabase
    .from('clubs')
    .select(
      'id, name, slug, color, nav_name, tagline, hero_location, hero_headline, hero_subhead, hero_blurb, map_caption, footer_tagline, directory_intro'
    )
    .eq('slug', slug)
    .single<ClubRow>();

  if (!club) {
    notFound();
  }

  // Raw brand colour drives the map pins (which sit on the pale Mapbox map, where
  // the true dark colour is correct). Everything on the near-black page background
  // uses the readable (auto-lightened) version.
  const rawColor = club.color || '#EF4444';
  const accent = readableAccent(rawColor);

  // Per-club copy with sensible fallbacks, so a bare clubs row (slug + name + color)
  // still renders a complete page.
  const name = club.name || slug;
  const navName = club.nav_name || name;
  const heroHeadline = club.hero_headline || `${name} fans,`;
  const heroSubhead = club.hero_subhead || 'all over the world.';
  const heroBlurb =
    club.hero_blurb || `Find fellow ${name} supporters worldwide.`;
  const mapCaption = club.map_caption || `${name} fan groups worldwide`;
  const directoryIntro =
    club.directory_intro ||
    'Official supporter clubs and fan communities worldwide. Click any group to visit their site.';

  const { data: groupsData } = await supabase
    .from('fan_groups')
    .select(
      'name, city, country, latitude, longitude, url, description, region, type, instagram_url, facebook_url, tiktok_url'
    )
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

      {/* Nav */}
      <SiteNav
        active="supporter-groups"
        club={{ name: navName, color: accent, tagline: club.tagline || undefined }}
      />

      {/* Hero */}
      <section style={{ padding: '60px 32px 48px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: `linear-gradient(180deg, ${accent}0f 0%, transparent 100%)` }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {club.hero_location && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: `${accent}1f`, border: `1px solid ${accent}40`, borderRadius: '999px', padding: '5px 12px', marginBottom: '24px', fontSize: '11px', color: accent, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: accent }} />
              {club.hero_location}
            </div>
          )}
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '16px' }}>
            {heroHeadline}<br /><span style={{ color: accent }}>{heroSubhead}</span>
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: '520px', marginBottom: '32px' }}>
            {heroBlurb}
          </p>
          <HeroActionButtons clubColor={accent} clubId={club.id} clubSlug={slug} clubName={name} />
        </div>
      </section>

      {/* Map */}
      <section id="map" style={{ height: '480px', position: 'relative', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <ClubMapLoader groups={mapGroups} color={rawColor} />
        <div style={{ position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap', zIndex: 10 }}>
          {mapCaption}
        </div>
      </section>

      {/* Directory */}
      <section id="directory" style={{ padding: '64px 32px', maxWidth: '960px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Fan group directory</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '48px' }}>
          {directoryIntro}
        </p>
        <FanGroupDirectory groups={groups} clubColor={rawColor} />

        <div style={{ marginTop: '48px', padding: '28px', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.12)', textAlign: 'center' }}>
          <p style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>Is your group missing?</p>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>We&apos;re building the most complete directory of {name} fan groups worldwide.</p>
          <AddGroupPill clubId={club.id} clubSlug={slug} clubName={name} accentColor={accent} variant="link" />
        </div>
      </section>

      <Footer stat={`${name}${club.footer_tagline ? ` · ${club.footer_tagline}` : ''}`} />

    </main>
  );
}
