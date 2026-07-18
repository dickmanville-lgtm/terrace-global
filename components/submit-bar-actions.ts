'use server'

import { supabaseAdmin } from '../lib/supabase-admin'

export async function submitSportsBar(fields: {
  name: string
  location: string
  country: string
  url: string
  submitter_email: string
  latitude: number
  longitude: number
}) {
  const { error } = await supabaseAdmin
    .from('sports_bar_submissions')
    .insert({
      status: 'pending',
      name: fields.name,
      location: fields.location || null,
      country: fields.country || null,
      url: fields.url || null,
      submitter_email: fields.submitter_email || null,
      latitude: fields.latitude,
      longitude: fields.longitude,
    })

  if (error) return { success: false, error: error.message }

  return { success: true }
}
