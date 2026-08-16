import { supabaseAdmin } from '@/lib/supabase-admin';
import Link from 'next/link';

export default async function ClubMapAdminIndex() {
  const { data: grounds } = await supabaseAdmin
    .from('grounds')
    .select('id, club, slug, country')
    .order('club', { ascending: true });

  const { data: sections } = await supabaseAdmin
    .from('club_page_sections')
    .select('id, ground_id')
    .eq('section_key', 'club_ground_info');

  const sectionByGround = new Map(
    (sections ?? []).map((s) => [s.ground_id, s.id])
  );

  const sectionIds = (sections ?? []).map((s) => s.id);

  const { data: blocks } = sectionIds.length
    ? await supabaseAdmin
        .from('club_page_blocks')
        .select('section_id')
        .in('section_id', sectionIds)
    : { data: [] };

  const blockCountBySection = new Map<string, number>();
  for (const b of blocks ?? []) {
    blockCountBySection.set(
      b.section_id,
      (blockCountBySection.get(b.section_id) ?? 0) + 1
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '2rem' }}>
      <h1>Club Content</h1>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        {grounds?.length ?? 0} clubs. Click any club to add or edit its page content.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {grounds?.map((ground) => {
          const sectionId = sectionByGround.get(ground.id);
          const blockCount = sectionId
            ? blockCountBySection.get(sectionId) ?? 0
            : 0;

          return (
            <Link
              key={ground.id}
              href={`/admin/club-map/${ground.slug}/edit`}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                border: '1px solid #ddd',
                borderRadius: 6,
                textDecoration: 'none',
                color: '#000',
              }}
            >
              <span>
                <strong>{ground.club}</strong>{' '}
                <span style={{ color: '#999' }}>({ground.country})</span>
              </span>
              <span style={{ color: blockCount > 0 ? '#2f6b4f' : '#999' }}>
                {blockCount > 0 ? `${blockCount} block${blockCount === 1 ? '' : 's'}` : 'No content'}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}