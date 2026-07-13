'use server'

import { supabaseAdmin } from '../lib/supabase-admin'
// NOTE: adjust the relative path above to match wherever this file ends up.
// It mirrors app/admin/fan-groups/actions.ts, which uses '../../../lib/supabase-admin'.

export async function submitFanGroup(fields: {
  club_id: number
  club_slug: string
  name: string
  type: string
  city: string
  country: string
  url: string
  instagram_url: string
  facebook_url: string
  tiktok_url: string
  description: string
  submitter_email: string
}) {
  const { error } = await supabaseAdmin
    .from('fan_group_submissions')
    .insert({
      status: 'pending',
      club_id: fields.club_id,
      club_slug: fields.club_slug,
      name: fields.name,
      type: fields.type,
      city: fields.city || null,
      country: fields.country || null,
      url: fields.url || null,
      instagram_url: fields.instagram_url || null,
      facebook_url: fields.facebook_url || null,
      tiktok_url: fields.tiktok_url || null,
      description: fields.description || null,
      submitter_email: fields.submitter_email || null,
      // region, latitude, longitude deliberately NOT set here —
      // the admin sets these at review time (region dropdown + geocode).
    })

  if (error) return { success: false, error: error.message }

  return { success: true }
}