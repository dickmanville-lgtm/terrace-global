'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '../../../../lib/supabase-admin'

const VALID_REGIONS = [
  'United Kingdom', 'Ireland', 'Europe', 'North America', 'South America',
  'Africa', 'Asia', 'Australia & New Zealand', 'More worldwide',
]
const VALID_TYPES = ['supporter_club', 'community', 'fan_bar']

type BulkRow = {
  club_slug: string
  name: string
  type: string
  city: string
  country: string
  region: string
  url: string
  description: string
  latitude: string
  longitude: string
}

export async function bulkCreateFanGroups(rows: BulkRow[]) {
  const { data: clubs } = await supabaseAdmin.from('clubs').select('id, slug')
  const clubMap = new Map((clubs || []).map(c => [c.slug, c.id]))

  const toInsert: any[] = []
  const skipped: { row: number; reason: string }[] = []
  const touchedSlugs = new Set<string>()

  rows.forEach((r, i) => {
    const clubId = clubMap.get(r.club_slug)
    if (!clubId) {
      skipped.push({ row: i + 1, reason: `Unknown club slug "${r.club_slug}"` })
      return
    }
    if (!r.name || !r.name.trim()) {
      skipped.push({ row: i + 1, reason: 'Missing name' })
      return
    }
    if (!VALID_REGIONS.includes(r.region)) {
      skipped.push({ row: i + 1, reason: `Invalid region "${r.region}"` })
      return
    }

    const lat = r.latitude ? parseFloat(r.latitude) : null
    const lng = r.longitude ? parseFloat(r.longitude) : null

    toInsert.push({
      club_id: clubId,
      name: r.name.trim(),
      type: VALID_TYPES.includes(r.type) ? r.type : 'supporter_club',
      city: r.city || null,
      country: r.country || null,
      region: r.region,
      url: r.url || null,
      description: r.description || null,
      latitude: lat !== null && !isNaN(lat) ? lat : null,
      longitude: lng !== null && !isNaN(lng) ? lng : null,
    })
    touchedSlugs.add(r.club_slug)
  })

  if (toInsert.length === 0) {
    return { success: false, inserted: 0, skipped, error: 'No valid rows to insert.' }
  }

  const { error } = await supabaseAdmin.from('fan_groups').insert(toInsert)

  if (error) {
    return { success: false, inserted: 0, skipped, error: error.message }
  }

  touchedSlugs.forEach(slug => revalidatePath(`/${slug}`))

  return { success: true, inserted: toInsert.length, skipped }
}