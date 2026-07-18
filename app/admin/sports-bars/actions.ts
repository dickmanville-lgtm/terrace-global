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

export async function deleteSportsBar(id: number) {
  const { error } = await supabaseAdmin.from('sports_bars').delete().eq('id', id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/sports-bars')
  revalidatePath('/admin/sports-bars')
  return { success: true }
}
