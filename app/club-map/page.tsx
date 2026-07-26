import SiteNav from '../../components/SiteNav';
import Footer from '../../components/Footer';
import { supabase } from '@/lib/supabase';
import GroundsMapClient from '../../components/GroundsMapClient';
import type { Ground } from '../../components/GroundsMap';

export const revalidate = 60; // refresh grounds from Supabase at most once per minute

export default async function ClubMapPage() {
  const { data } = await supabase
    .from('grounds')
    .select('id, name, club, latitude, longitude, country, website, slug')
    .order('club');

  // Supabase can return numeric columns as strings — normalize before handing to Mapbox.
  const grounds: Ground[] = (data || []).map((g) => ({
    ...g,
    latitude: g.latitude != null ? Number(g.latitude) : null,
    longitude: g.longitude != null ? Number(g.longitude) : null,
  }));

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'Inter', sans-serif" }}>

     <SiteNav active="club-map" />

      {/* Hero */}
      <section style={{ padding: '48px 32px 36px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '12px' }}>
            Football Grounds.
          </h1>
        </div>
      </section>

      {/* Map */}
      <section style={{ height: 'calc(100vh - 280px)', minHeight: '500px', position: 'relative' }}>
        <GroundsMapClient grounds={grounds} />
      </section>

      <Footer stat="Club Map" />

    </main>
  );
}