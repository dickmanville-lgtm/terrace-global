'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '../../../../lib/supabase-admin'

type ApproveInput = {
  id: number
  name: string
  location: string
  country: string
  url: string
  latitude: number | null
  longitude: number | null
}

export async function approveSubmission(input: ApproveInput) {
  // Insert into the live sports_bars table with the admin-reviewed fields.
  const { error: insertError } = await supabaseAdmin.from('sports_bars').insert({
    name: input.name,
    location: input.location,
    country: input.country,
    url: input.url,
    latitude: input.latitude,
    longitude: input.longitude,
  })

  if (insertError) {
    return {
      success: false,
      error: insertError.message,
    }
  }

  const { error: updateError } = await supabaseAdmin
    .from('sports_bar_submissions')
    .update({ status: 'approved', reviewed_at: new Date().toISOString() })
    .eq('id', input.id)

  if (updateError) {
    // The sports_bars row was created but the submission wasn't marked reviewed —
    // flag this clearly rather than silently leaving it stuck in the queue.
    return {
      success: false,
      error: `Added to sports_bars, but failed to mark the submission reviewed: ${updateError.message}`,
    }
  }

  revalidatePath('/sports-bars')
  revalidatePath('/admin/sports-bars/submissions')

  return { success: true }
}

export async function rejectSubmission(id: number, note: string) {
  const { error } = await supabaseAdmin
    .from('sports_bar_submissions')
    .update({ status: 'rejected', reviewed_at: new Date().toISOString(), review_note: note || null })
    .eq('id', id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/sports-bars/submissions')
  return { success: true }
}
