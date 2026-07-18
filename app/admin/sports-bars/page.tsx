import { supabaseAdmin } from '../../../lib/supabase-admin'
import Link from 'next/link'
import BrowseSportsBars from './BrowseSportsBars'

export const revalidate = 0

export default async function SportsBarsAdminPage() {
  const { data } = await supabaseAdmin
    .from('sports_bars')
    .select('id, name, location, country, url, latitude, longitude, link_status')
    .order('name')

  const bars = data || []

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'Inter', sans-serif", padding: '48px 24px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <Link href="/admin" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', textDecoration: 'none' }}>
          ← Back to admin
        </Link>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '16px 0 24px' }}>Browse & edit sports bars</h1>
        <BrowseSportsBars bars={bars} />
      </div>
    </main>
  )
}
