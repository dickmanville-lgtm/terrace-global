import { supabase } from '../../../lib/supabase'
import Link from 'next/link'
import BrowseFanGroups from './BrowseFanGroups'

export const revalidate = 0

export default async function FanGroupsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ club?: string }>
}) {
  const params = await searchParams
  const selectedSlug = params.club || ''

  const { data: clubs } = await supabase
    .from('clubs')
    .select('id, name, slug')
    .order('name')

  let groups: any[] = []
  if (selectedSlug) {
    const club = clubs?.find(c => c.slug === selectedSlug)
    if (club) {
      const { data } = await supabase
        .from('fan_groups')
        .select('id, name, type, city, country, region, url, instagram_url, facebook_url, tiktok_url, description, latitude, longitude')
        .eq('club_id', club.id)
        .order('name')
      groups = data || []
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'Inter', sans-serif", padding: '48px 24px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <Link href="/admin" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', textDecoration: 'none' }}>
          ← Back to admin
        </Link>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '16px 0 24px' }}>Browse & edit fan groups</h1>
        <BrowseFanGroups clubs={clubs || []} selectedSlug={selectedSlug} groups={groups} />
      </div>
    </main>
  )
}