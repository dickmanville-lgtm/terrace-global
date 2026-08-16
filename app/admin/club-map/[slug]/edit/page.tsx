import { supabaseAdmin } from '@/lib/supabase-admin';
import { notFound } from 'next/navigation';
import BlockEditor from './BlockEditor';

export default async function EditClubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: ground } = await supabaseAdmin
    .from('grounds')
    .select('id, club, name, slug, website')
    .eq('slug', slug)
    .single();

  if (!ground) {
    notFound();
  }

  const { data: section } = await supabaseAdmin
    .from('club_page_sections')
    .select('id, title')
    .eq('ground_id', ground.id)
    .eq('section_key', 'club_ground_info')
    .single();

  if (!section) {
    notFound();
  }

  const { data: blocks } = await supabaseAdmin
    .from('club_page_blocks')
    .select('*')
    .eq('section_id', section.id)
    .order('display_order', { ascending: true });

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
      <h1>{ground.club}</h1>
      <p style={{ color: '#666' }}>{ground.name}</p>
      {ground.website && (
        <p style={{ color: '#999', fontSize: '0.9rem' }}>
          Website on file: {ground.website} (auto-shown on the live page, not editable here)
        </p>
      )}

      <BlockEditor sectionId={section.id} slug={ground.slug} initialBlocks={blocks ?? []} />
    </div>
  );
}