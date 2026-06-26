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

export async function deleteFanGroup(id: number, clubSlug: string) {
  const { error } = await supabaseAdmin.from('fan_groups').delete().eq('id', id)

  if (error) return { success: false, error: error.message }

  revalidatePath(`/${clubSlug}`)
  return { success: true }
}