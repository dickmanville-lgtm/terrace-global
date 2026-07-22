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
  instagram_url: string
  facebook_url: string
  tiktok_url: string
  latitude: string
  longitude: string
}

type ExistingFanGroup = {
  id: string
  club_id: string
  name: string
  url: string | null
  description: string | null
  instagram_url: string | null
  facebook_url: string | null
  tiktok_url: string | null
  city: string | null
  country: string | null
  region: string | null
  latitude: number | null
  longitude: number | null
}

type InsertFanGroup = {
  club_id: string
  name: string
  type: string
  city: string | null
  country: string | null
  region: string
  url: string | null
  description: string | null
  instagram_url: string | null
  facebook_url: string | null
  tiktok_url: string | null
  latitude: number | null
  longitude: number | null
}

// Fields enrichment is allowed to fill in when empty on the existing row.
// Enrichment NEVER overwrites a field that already has a value.
const ENRICHABLE_TEXT_FIELDS = [
  'url', 'description', 'instagram_url', 'facebook_url', 'tiktok_url',
  'city', 'country', 'region',
] as const
type EnrichableTextField = typeof ENRICHABLE_TEXT_FIELDS[number]
type EnrichableField = EnrichableTextField | 'latitude' | 'longitude'

function isEmpty(val: string | number | null | undefined) {
  return val === null || val === undefined || (typeof val === 'string' && val.trim() === '')
}

export async function bulkCreateFanGroups(rows: BulkRow[]) {
  const { data: clubs } = await supabaseAdmin.from('clubs').select('id, slug')
  const clubMap = new Map((clubs || []).map(c => [c.slug, c.id]))

  const relevantClubIds = Array.from(new Set(
    rows.map(r => clubMap.get(r.club_slug)).filter((id): id is string => !!id)
  ))

  const { data: existingGroups } = relevantClubIds.length
    ? await supabaseAdmin
        .from('fan_groups')
        .select('id, club_id, name, url, description, instagram_url, facebook_url, tiktok_url, city, country, region, latitude, longitude')
        .in('club_id', relevantClubIds)
    : { data: [] as ExistingFanGroup[] }

  const existingMap = new Map<string, ExistingFanGroup>(
    (existingGroups || []).map((g: ExistingFanGroup) => [`${g.club_id}|${g.name.toLowerCase()}`, g])
  )

  const toInsert: InsertFanGroup[] = []
  const toUpdate: { id: string; fields: Partial<Record<EnrichableField, string | number>> }[] = []
  const skipped: { row: number; reason: string }[] = []
  const enriched: { row: number; name: string; fields: string[] }[] = []
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
    if (!r.url?.trim() && !r.instagram_url?.trim() && !r.facebook_url?.trim() && !r.tiktok_url?.trim()) {
      skipped.push({ row: i + 1, reason: 'No link (url, Instagram, Facebook, or TikTok) provided' })
      return
    }

    const lat = r.latitude ? parseFloat(r.latitude) : null
    const lng = r.longitude ? parseFloat(r.longitude) : null
    const key = `${clubId}|${r.name.trim().toLowerCase()}`
    const existing = existingMap.get(key)

    if (!existing) {
      toInsert.push({
        club_id: clubId,
        name: r.name.trim(),
        type: VALID_TYPES.includes(r.type) ? r.type : 'supporter_club',
        city: r.city || null,
        country: r.country || null,
        region: r.region,
        url: r.url || null,
        description: r.description || null,
        instagram_url: r.instagram_url || null,
        facebook_url: r.facebook_url || null,
        tiktok_url: r.tiktok_url || null,
        latitude: lat !== null && !isNaN(lat) ? lat : null,
        longitude: lng !== null && !isNaN(lng) ? lng : null,
      })
      touchedSlugs.add(r.club_slug)
      return
    }

    const csvValues: Record<EnrichableTextField, string> = {
      url: r.url, description: r.description, instagram_url: r.instagram_url,
      facebook_url: r.facebook_url, tiktok_url: r.tiktok_url,
      city: r.city, country: r.country, region: r.region,
    }
    const fieldsToUpdate: Partial<Record<EnrichableField, string | number>> = {}
    const filledFieldNames: string[] = []

    for (const field of ENRICHABLE_TEXT_FIELDS) {
      const csvVal = csvValues[field]
      if (!isEmpty(csvVal) && isEmpty(existing[field])) {
        fieldsToUpdate[field] = csvVal.trim()
        filledFieldNames.push(field)
      }
    }
    if (lat !== null && !isNaN(lat) && isEmpty(existing.latitude)) {
      fieldsToUpdate.latitude = lat
      filledFieldNames.push('latitude')
    }
    if (lng !== null && !isNaN(lng) && isEmpty(existing.longitude)) {
      fieldsToUpdate.longitude = lng
      filledFieldNames.push('longitude')
    }

    if (filledFieldNames.length > 0) {
      toUpdate.push({ id: existing.id, fields: fieldsToUpdate })
      enriched.push({ row: i + 1, name: r.name.trim(), fields: filledFieldNames })
      touchedSlugs.add(r.club_slug)
    } else {
      skipped.push({ row: i + 1, reason: `"${r.name.trim()}" already exists, no gaps to fill` })
    }
  })

  if (toInsert.length === 0 && toUpdate.length === 0) {
    return { success: false, inserted: 0, enriched: [], skipped, error: 'No new rows to insert and no existing rows to enrich.' }
  }

  if (toInsert.length > 0) {
    const { error } = await supabaseAdmin.from('fan_groups').insert(toInsert)
    if (error) {
      return { success: false, inserted: 0, enriched: [], skipped, error: error.message }
    }
  }

  for (const u of toUpdate) {
    const { error } = await supabaseAdmin.from('fan_groups').update(u.fields).eq('id', u.id)
    if (error) {
      skipped.push({ row: -1, reason: `Enrichment failed for group id ${u.id}: ${error.message}` })
    }
  }

  touchedSlugs.forEach(slug => revalidatePath(`/${slug}`))

  return { success: true, inserted: toInsert.length, enriched, skipped }
}