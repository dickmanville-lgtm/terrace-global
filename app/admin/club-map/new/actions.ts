'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { redirect } from 'next/navigation';

export async function addClub(formData: FormData) {
  const name = formData.get('name') as string;
  const club = formData.get('club') as string;
  const slug = formData.get('slug') as string;
  const country = formData.get('country') as string;
  const website = formData.get('website') as string;
  const latitude = parseFloat(formData.get('latitude') as string);
  const longitude = parseFloat(formData.get('longitude') as string);

  if (!name || !club || !slug || !country) {
    redirect('/admin/club-map/new?error=Name, club, slug, and country are required');
  }

  const { data: ground, error } = await supabaseAdmin
    .from('grounds')
    .insert({
      name,
      club,
      slug,
      country,
      website: website || null,
      latitude: isNaN(latitude) ? null : latitude,
      longitude: isNaN(longitude) ? null : longitude,
    })
    .select('id')
    .single();

  if (error || !ground) {
    redirect(`/admin/club-map/new?error=${encodeURIComponent(error?.message ?? 'Insert failed')}`);
  }

    const { error: sectionError } = await supabaseAdmin.from('club_page_sections').insert({
    ground_id: ground.id,
    section_key: 'club_ground_info',
    title: club,
    display_order: 1,
    is_active: true,
  });

  if (sectionError) {
    redirect(`/admin/club-map/new?error=${encodeURIComponent('Club created but section failed: ' + sectionError.message)}`);
  }

  redirect('/admin/club-map');
}