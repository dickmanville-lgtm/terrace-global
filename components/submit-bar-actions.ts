'use server'

import { supabaseAdmin } from '../lib/supabase-admin'

export async function submitSportsBar(fields: {
  name: string
  location: string
  country: string
  url: string
  submitter_email: string
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
      // latitude, longitude deliberately NOT set here — the admin geocodes
      // the address at review time, same pattern as fan_group_submissions.
    })

  if (error) return { success: false, error: error.message }

  return { success: true }
}
