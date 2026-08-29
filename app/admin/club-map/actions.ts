'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function deleteClub(formData: FormData) {
  const groundId = Number(formData.get('groundId'));

  if (!groundId) {
    return;
  }

  const { data: section } = await supabaseAdmin
    .from('club_page_sections')
    .select('id')
    .eq('ground_id', groundId)
    .single();

  if (section) {
    await supabaseAdmin.from('club_page_blocks').delete().eq('section_id', section.id);
    await supabaseAdmin.from('club_page_sections').delete().eq('id', section.id);
  }

  await supabaseAdmin.from('grounds').delete().eq('id', groundId);

  revalidatePath('/admin/club-map');
}