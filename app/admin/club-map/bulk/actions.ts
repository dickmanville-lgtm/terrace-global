'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '../../../../lib/supabase-admin';

type BulkRow = {
  name: string
  club: string
  slug: string
  country: string
  website: string
  latitude: string
  longitude: string
}

type ExistingGround = {
  id: string
  name: string
  club: string
  slug: string | null
  country: string | null
  website: string | null
  latitude: number | null
  longitude: number | null
}

type InsertGround = {
  name: string
  club: string
  slug: string
  country: string
  website: string
  latitude: number
  longitude: number
}

function matchKey(name: string, club: string) {
  return `${name.trim().toLowerCase()}|${club.trim().toLowerCase()}`
}

function isEmpty(val: string | number | null | undefined) {
  return val === null || val === undefined || (typeof val === 'string' && val.trim() === '')
}

export async function bulkCreateGrounds(rows: BulkRow[]) {
  const { data: existingGrounds } = await supabaseAdmin
    .from('grounds')
    .select('id, name, club, slug, country, website, latitude, longitude')

  const existingMap = new Map<string, ExistingGround>(
    (existingGrounds || []).map((g: ExistingGround) => [matchKey(g.name, g.club), g])
  )

  const toInsert: InsertGround[] = []
  const toUpdate: { id: string; fields: Partial<Record<'slug' | 'country' | 'website' | 'latitude' | 'longitude', string | number>> }[] = []
  const skipped: { row: number; reason: string }[] = []
  const enriched: { row: number; name: string; fields: string[] }[] = []

  rows.forEach((r, i) => {
    if (!r.name || !r.name.trim()) {
      skipped.push({ row: i + 1, reason: 'Missing name' })
      return
    }
    if (!r.club || !r.club.trim()) {
      skipped.push({ row: i + 1, reason: 'Missing club' })
      return
    }
    if (!r.slug || !r.slug.trim()) {
      skipped.push({ row: i + 1, reason: 'Missing slug' })
      return
    }
    if (!r.country || !r.country.trim()) {
      skipped.push({ row: i + 1, reason: 'Missing country' })
      return
    }
    if (!r.website || !r.website.trim()) {
      skipped.push({ row: i + 1, reason: 'Missing website' })
      return
    }

    const lat = parseFloat(r.latitude)
    const lng = parseFloat(r.longitude)
    if (isNaN(lat) || isNaN(lng)) {
      skipped.push({ row: i + 1, reason: 'Missing or invalid latitude/longitude' })
      return
    }

    const key = matchKey(r.name, r.club)
    const existing = existingMap.get(key)

    if (!existing) {
      toInsert.push({
        name: r.name.trim(),
        club: r.club.trim(),
        slug: r.slug.trim(),
        country: r.country.trim(),
        website: r.website.trim(),
        latitude: lat,
        longitude: lng,
      })
      return
    }

    const fieldsToUpdate: Partial<Record<'slug' | 'country' | 'website' | 'latitude' | 'longitude', string | number>> = {}
    const filledFieldNames: string[] = []

    if (isEmpty(existing.slug)) {
      fieldsToUpdate.slug = r.slug.trim()
      filledFieldNames.push('slug')
    }
    if (isEmpty(existing.country)) {
      fieldsToUpdate.country = r.country.trim()
      filledFieldNames.push('country')
    }
    if (isEmpty(existing.website)) {
      fieldsToUpdate.website = r.website.trim()
      filledFieldNames.push('website')
    }
    if (isEmpty(existing.latitude)) {
      fieldsToUpdate.latitude = lat
      filledFieldNames.push('latitude')
    }
    if (isEmpty(existing.longitude)) {
      fieldsToUpdate.longitude = lng
      filledFieldNames.push('longitude')
    }

    if (filledFieldNames.length > 0) {
      toUpdate.push({ id: existing.id, fields: fieldsToUpdate })
      enriched.push({ row: i + 1, name: r.name.trim(), fields: filledFieldNames })
    } else {
      skipped.push({ row: i + 1, reason: `"${r.name.trim()}" already exists, no gaps to fill` })
    }
  })

  if (toInsert.length === 0 && toUpdate.length === 0) {
    return { success: false, inserted: 0, enriched: [], skipped, error: 'No new rows to insert and no existing rows to enrich.' }
  }

  if (toInsert.length > 0) {
    const { error } = await supabaseAdmin.from('grounds').insert(toInsert)
    if (error) {
      return { success: false, inserted: 0, enriched: [], skipped, error: error.message }
    }
  }

  for (const u of toUpdate) {
    const { error } = await supabaseAdmin.from('grounds').update(u.fields).eq('id', u.id)
    if (error) {
      skipped.push({ row: -1, reason: `Enrichment failed for ground id ${u.id}: ${error.message}` })
    }
  }

  revalidatePath('/club-map')

  return { success: true, inserted: toInsert.length, enriched, skipped }
}