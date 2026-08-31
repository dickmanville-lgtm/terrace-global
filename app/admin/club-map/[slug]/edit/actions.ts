'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export type BlockType = 'photo' | 'banner' | 'text' | 'visiting_info';

export interface BlockContent {
  image_url?: string;
  caption?: string;
  body?: string;
  transport?: string;
  museum?: string;
  shop?: string;
  entry_points?: string;
  pubs?: string;
  eateries?: string;
}

export interface Block {
  id: string;
  section_id: string;
  block_type: BlockType;
  title: string;
  description: string | null;
  url: string | null;
  content: BlockContent;
  display_order: number;
  created_at: string | null;
}

export async function addBlock(sectionId: string, slug: string, blockType: BlockType) {
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from('club_page_blocks')
    .select('display_order')
    .eq('section_id', sectionId)
    .order('display_order', { ascending: false })
    .limit(1);

  if (fetchError) {
    return { success: false, error: fetchError.message };
  }

  const nextOrder = existing && existing.length > 0 ? existing[0].display_order + 1 : 1;

  const { error } = await supabaseAdmin.from('club_page_blocks').insert({
    section_id: sectionId,
    block_type: blockType,
    title: '',
    description: null,
    url: null,
    content: {},
    display_order: nextOrder,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath(`/admin/club-map/${slug}/edit`);
  return { success: true };
}

export async function updateBlock(
  blockId: string,
  slug: string,
  updates: {
    title?: string;
    url?: string | null;
    content?: BlockContent;
  }
) {
  const { error } = await supabaseAdmin
    .from('club_page_blocks')
    .update(updates)
    .eq('id', blockId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath(`/admin/club-map/${slug}/edit`);
  return { success: true };
}

export async function deleteBlock(blockId: string, slug: string) {
  const { error } = await supabaseAdmin
    .from('club_page_blocks')
    .delete()
    .eq('id', blockId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath(`/admin/club-map/${slug}/edit`);
  return { success: true };
}

export async function moveBlock(
  blockId: string,
  sectionId: string,
  slug: string,
  direction: 'up' | 'down'
) {
  const { data: blocks, error: fetchError } = await supabaseAdmin
    .from('club_page_blocks')
    .select('id, display_order')
    .eq('section_id', sectionId)
    .order('display_order', { ascending: true });

  if (fetchError || !blocks) {
    return { success: false, error: fetchError?.message ?? 'Could not load blocks' };
  }

  const index = blocks.findIndex((b) => b.id === blockId);
  if (index === -1) {
    return { success: false, error: 'Block not found' };
  }

  const targetIndex = direction === 'up' ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= blocks.length) {
    return { success: true };
  }

  const current = blocks[index];
  const target = blocks[targetIndex];

  const { error: error1 } = await supabaseAdmin
    .from('club_page_blocks')
    .update({ display_order: target.display_order })
    .eq('id', current.id);

  const { error: error2 } = await supabaseAdmin
    .from('club_page_blocks')
    .update({ display_order: current.display_order })
    .eq('id', target.id);

  if (error1 || error2) {
    return { success: false, error: error1?.message ?? error2?.message };
  }

  revalidatePath(`/admin/club-map/${slug}/edit`);
  return { success: true };
}
export async function uploadBlockImage(formData: FormData) {
  const file = formData.get('file') as File | null;
  const slug = formData.get('slug') as string;

  if (!file || !slug) {
    return { success: false, error: 'Missing file or slug' };
  }

  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${slug}/${Date.now()}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from('club-images')
    .upload(path, file, { upsert: false });

  if (error) {
    return { success: false, error: error.message };
  }

  const { data } = supabaseAdmin.storage.from('club-images').getPublicUrl(path);

  return { success: true, url: data.publicUrl };
}