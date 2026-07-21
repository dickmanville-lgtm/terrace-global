'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '../../../../lib/supabase-admin'

type BulkRow = {
  name: string
  location: string
  country: string
  url: string
  latitude: string
  longitude: string
}

type ExistingSportsBar = {
  id: string
  name: string
  location: string
  country: string
  url: string | null
  latitude: number | null
  longitude: number | null
}

type InsertSportsBar = {
  name: string
  location: string
  country: string
  url: string
  latitude: number
  longitude: number
}

function matchKey(name: string, location: string, country: string) {
  return `${name.trim().toLowerCase()}|${location.trim().toLowerCase()}|${country.trim().toLowerCase()}`
}

function isEmpty(val: string | number | null | undefined) {
  return val === null || val === undefined || (typeof val === 'string' && val.trim() === '')
}

export async function bulkCreateSportsBars(rows: BulkRow[]) {
  const { data: existingBars } = await supabaseAdmin
    .from('sports_bars')
    .select('id, name, location, country, url, latitude, longitude')

  const existingMap = new Map<string, ExistingSportsBar>(
    (existingBars || []).map((b: ExistingSportsBar) => [matchKey(b.name, b.location, b.country), b])
  )

  const toInsert: InsertSportsBar[] = []
  const toUpdate: { id: string; fields: Partial<Record<'url' | 'latitude' | 'longitude', string | number>> }[] = []
  const skipped: { row: number; reason: string }[] = []
  const enriched: { row: number; name: string; fields: string[] }[] = []

  rows.forEach((r, i) => {
    if (!r.name || !r.name.trim()) {
      skipped.push({ row: i + 1, reason: 'Missing name' })
      return
    }
    if (!r.location || !r.location.trim()) {
      skipped.push({ row: i + 1, reason: 'Missing location' })
      return
    }
    if (!r.country || !r.country.trim()) {
      skipped.push({ row: i + 1, reason: 'Missing country' })
      return
    }
    if (!r.url || !r.url.trim()) {
      skipped.push({ row: i + 1, reason: 'Missing url — a bar with no link is not useful on the map' })
      return
    }

    const lat = parseFloat(r.latitude)
    const lng = parseFloat(r.longitude)
    if (isNaN(lat) || isNaN(lng)) {
      skipped.push({ row: i + 1, reason: 'Missing or invalid latitude/longitude' })
      return
    }

    const key = matchKey(r.name, r.location, r.country)
    const existing = existingMap.get(key)

    if (!existing) {
      toInsert.push({
        name: r.name.trim(),
        location: r.location.trim(),
        country: r.country.trim(),
        url: r.url.trim(),
        latitude: lat,
        longitude: lng,
      })
      return
    }

    const fieldsToUpdate: Partial<Record<'url' | 'latitude' | 'longitude', string | number>> = {}
    const filledFieldNames: string[] = []

    if (isEmpty(existing.url)) {
      fieldsToUpdate.url = r.url.trim()
      filledFieldNames.push('url')
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
    const { error } = await supabaseAdmin.from('sports_bars').insert(toInsert)
    if (error) {
      return { success: false, inserted: 0, enriched: [], skipped, error: error.message }
    }
  }

  for (const u of toUpdate) {
    const { error } = await supabaseAdmin.from('sports_bars').update(u.fields).eq('id', u.id)
    if (error) {
      skipped.push({ row: -1, reason: `Enrichment failed for bar id ${u.id}: ${error.message}` })
    }
  }

  revalidatePath('/sports-bars')

  return { success: true, inserted: toInsert.length, enriched, skipped }
}