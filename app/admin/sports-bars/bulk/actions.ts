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

export async function bulkCreateSportsBars(rows: BulkRow[]) {
  const toInsert: {
    name: string
    location: string
    country: string
    url: string | null
    latitude: number
    longitude: number
  }[] = []
  const skipped: { row: number; reason: string }[] = []

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

    const lat = parseFloat(r.latitude)
    const lng = parseFloat(r.longitude)
    if (isNaN(lat) || isNaN(lng)) {
      skipped.push({ row: i + 1, reason: 'Missing or invalid latitude/longitude' })
      return
    }

    toInsert.push({
      name: r.name.trim(),
      location: r.location.trim(),
      country: r.country.trim(),
      url: r.url ? r.url.trim() : null,
      latitude: lat,
      longitude: lng,
    })
  })

  if (toInsert.length === 0) {
    return { success: false, inserted: 0, skipped, error: 'No valid rows to insert.' }
  }

  const { error } = await supabaseAdmin.from('sports_bars').insert(toInsert)

  if (error) {
    return { success: false, inserted: 0, skipped, error: error.message }
  }

  revalidatePath('/sports-bars')

  return { success: true, inserted: toInsert.length, skipped }
}
