'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '../../../lib/supabase-admin'

export async function updateFanGroup(id: number, clubSlug: string, fields: {
  name: string
  type: string
  city: string
  country: string
  region: string
  url: string
  instagram_url: string
  facebook_url: string
  tiktok_url: string
  description: string
  latitude: number | null
  longitude: number | null
}) {
  const { error } = await supabaseAdmin
    .from('fan_groups')
    .update({
      name: fields.name,
      type: fields.type,
      city: fields.city || null,
      country: fields.country || null,
      region: fields.region,
      url: fields.url || null,
      instagram_url: fields.instagram_url || null,
      facebook_url: fields.facebook_url || null,
      tiktok_url: fields.tiktok_url || null,
      description: fields.description || null,
      latitude: fields.latitude,
      longitude: fields.longitude,
    })
    .eq('id', id)

  if (error) return { success: false, error: error.message }

  revalidatePath(`/${clubSlug}`)
  return { success: true }
}

export async function deleteFanGroup(id: number, clubSlug: string, note?: string) {
  // Fetch the full row first so we have a snapshot for the deleted-pins log.
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from('fan_groups')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !existing) {
    return { success: false, error: fetchError?.message || 'Fan group not found' }
  }

  const { error: logError } = await supabaseAdmin.from('deleted_pins_log').insert({
    source_table: 'fan_groups',
    record_id: String(id),
    record_data: existing,
    reason: 'manual_admin_removal',
    note: note || null,
  })

  if (logError) {
    return { success: false, error: `Could not log deletion — nothing was deleted. ${logError.message}` }
  }

  const { error } = await supabaseAdmin.from('fan_groups').delete().eq('id', id)

  if (error) return { success: false, error: error.message }

  revalidatePath(`/${clubSlug}`)
  return { success: true }
}