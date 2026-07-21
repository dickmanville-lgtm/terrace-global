'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '../../../lib/supabase-admin'

export async function updateSportsBar(id: number, fields: {
  name: string
  location: string
  country: string
  url: string
  latitude: number | null
  longitude: number | null
}) {
  const { error } = await supabaseAdmin
    .from('sports_bars')
    .update({
      name: fields.name,
      location: fields.location || null,
      country: fields.country || null,
      url: fields.url || null,
      latitude: fields.latitude,
      longitude: fields.longitude,
    })
    .eq('id', id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/sports-bars')
  revalidatePath('/admin/sports-bars')
  return { success: true }
}

export async function deleteSportsBar(id: number, note?: string) {
  // Fetch the full row first so we have a snapshot for the deleted-pins log.
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from('sports_bars')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !existing) {
    return { success: false, error: fetchError?.message || 'Sports bar not found' }
  }

  const { error: logError } = await supabaseAdmin.from('deleted_pins_log').insert({
    source_table: 'sports_bars',
    record_id: String(id),
    record_data: existing,
    reason: 'manual_admin_removal',
    note: note || null,
  })

  if (logError) {
    return { success: false, error: `Could not log deletion — nothing was deleted. ${logError.message}` }
  }

  const { error } = await supabaseAdmin.from('sports_bars').delete().eq('id', id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/sports-bars')
  revalidatePath('/admin/sports-bars')
  return { success: true }
}