'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '../../../../lib/supabase-admin'

type ApproveInput = {
  id: number
  club_id: number
  club_slug: string
  name: string
  type: string
  city: string
  country: string
  region: string
  url: string
  description: string
  instagram_url: string
  facebook_url: string
  tiktok_url: string
  latitude: number | null
  longitude: number | null
}

export async function approveSubmission(input: ApproveInput) {
  // Insert into the live fan_groups table with the admin-reviewed fields.
  const { error: insertError } = await supabaseAdmin.from('fan_groups').insert({
    club_id: input.club_id,
    name: input.name,
    type: input.type,
    city: input.city || null,
    country: input.country || null,
    region: input.region,
    url: input.url || null,
    description: input.description || null,
    instagram_url: input.instagram_url || null,
    facebook_url: input.facebook_url || null,
    tiktok_url: input.tiktok_url || null,
    latitude: input.latitude,
    longitude: input.longitude,
  })

  if (insertError) {
    // Unique index is on (club_id, lower(name)) — surface a clear message for that case.
    const isDuplicate = insertError.message.toLowerCase().includes('duplicate') || insertError.code === '23505'
    return {
      success: false,
      error: isDuplicate
        ? `"${input.name}" already exists for this club — check for a duplicate before approving.`
        : insertError.message,
    }
  }

  const { error: updateError } = await supabaseAdmin
    .from('fan_group_submissions')
    .update({ status: 'approved', reviewed_at: new Date().toISOString() })
    .eq('id', input.id)

  if (updateError) {
    // The fan_groups row was created but the submission wasn't marked reviewed —
    // flag this clearly rather than silently leaving it stuck in the queue.
    return {
      success: false,
      error: `Added to fan_groups, but failed to mark the submission reviewed: ${updateError.message}`,
    }
  }

  revalidatePath(`/${input.club_slug}`)
  revalidatePath('/admin/fan-groups/submissions')
  revalidatePath('/supporter-groups')
  return { success: true }
}

export async function rejectSubmission(id: number, note: string) {
  const { error } = await supabaseAdmin
    .from('fan_group_submissions')
    .update({ status: 'rejected', reviewed_at: new Date().toISOString(), review_note: note || null })
    .eq('id', id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/fan-groups/submissions')
  return { success: true }
}
