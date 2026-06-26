'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '../../../../lib/supabase-admin'

type CreateFanGroupInput = {
  club_id: number
  club_slug: string
  name: string
  type: string
  city: string
  country: string
  region: string
  url: string
  description: string
  latitude: number | null
  longitude: number | null
}

export async function createFanGroup(input: CreateFanGroupInput) {
  const { error } = await supabaseAdmin.from('fan_groups').insert({
    club_id: input.club_id,
    name: input.name,
    type: input.type,
    city: input.city || null,
    country: input.country || null,
    region: input.region,
    url: input.url || null,
    description: input.description || null,
    latitude: input.latitude,
    longitude: input.longitude,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath(`/${input.club_slug}`)
  return { success: true }
}