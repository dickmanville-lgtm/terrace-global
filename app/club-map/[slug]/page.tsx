// app/club-map/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '../../../lib/supabase-admin';

export const revalidate = 60;

const ACCENT = '#2B6CB0';
const BG = '#F1ECE1';
const TEXT = '#1A1A1A';

interface BlockContent {
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

interface Block {
  id: string;
  block_type: string;
  title: string;
  description: string | null;
  url: string | null;
  content: BlockContent;
  display_order: number;
}

interface Section {
  id: string;
  section_key: string;
  title: string;
  display_order: number;
  blocks: Block[];
}

async function getClubPageData(slug: string) {
  const { data: ground, error: groundError } = await supabaseAdmin
    .from('grounds')
    .select('id, name, club, country, website, slug')
    .eq('slug', slug)
    .single();

  if (groundError || !ground) {
    return null;
  }

  const { data: sections, error: sectionsError } = await supabaseAdmin
    .from('club_page_sections')
    .select('id, section_key, title, display_order')
    .eq('ground_id', ground.id)
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (sectionsError || !sections) {
    return { ground, sections: [] as Section[] };
  }

  const sectionIds = sections.map(function (s) {
    return s.id;
  });

  const { data: blocks } = await supabaseAdmin
    .from('club_page_blocks')
    .select('id, section_id, block_type, title, description, url, content, display_order')
    .in('section_id', sectionIds)
    .order('display_order', { ascending: true });

  const sectionsWithBlocks: Section[] = sections.map(function (section) {
    const sectionBlocks = (blocks || []).filter(function (b) {
      return b.section_id === section.id;
    });
    return Object.assign({}, section, { blocks: sectionBlocks });
  });

  return { ground: ground, sections: sectionsWithBlocks };
}

export default async function ClubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getClubPageData(slug);

  if (!data) {
    notFound();
  }

  const ground = data!.ground;
  const sections = data!.sections;

  return (
    <div style={{ minHeight: '100vh', background: BG, color: TEXT, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '56px 24px 80px' }}>
        <header style={{ marginBottom: '48px' }}>
          <h1 style={{ fontSize: '40px', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            {ground.club}
          </h1>
          <p style={{ color: '#6B6B6B', marginTop: '6px', fontSize: '15px' }}>{ground.country}</p>
        </header>

        {sections.map(function (section) {
          const injectWebsite = section.section_key === 'club_ground_info' ? ground.website : null;
          return (
            <SectionBlock
              key={section.id}
              section={section}
              injectWebsite={injectWebsite}
            />
          );
        })}
      </div>
    </div>
  );
}

function SectionBlock(props: { section: Section; injectWebsite: string | null }) {
  const section = props.section;
  const injectWebsite = props.injectWebsite;
  const hasWebsite = injectWebsite ? true : false;
  const hasContent = hasWebsite || section.blocks.length > 0;

  const firstPhotoIndex = section.blocks.findIndex(function (b) {
    return b.block_type === 'photo';
  });

  return (
    <section style={{ marginBottom: '48px' }}>
      {section.section_key !== 'club_ground_info' && (
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #E2E0DB' }}>
          {section.title}
        </h2>
      )}

      {!hasContent && <p style={{ color: '#999', fontStyle: 'italic' }}>Coming soon</p>}

      {hasContent && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {hasWebsite && firstPhotoIndex === -1 && (
            <WebsiteLink url={injectWebsite as string} />
          )}

          {section.blocks.map(function (block, index) {
            return (
              <div key={block.id}>
                <BlockItem block={block} />
                {hasWebsite && index === firstPhotoIndex && (
                  <div style={{ marginTop: '10px' }}>
                    <WebsiteLink url={injectWebsite as string} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function WebsiteLink(props: { url: string }) {
  return (
    
     <a href={props.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: ACCENT, fontWeight: 600, textDecoration: 'none' }}
    >
      Official website →
    </a>
  );
}

function BlockItem(props: { block: Block }) {
  const block = props.block;
  const content = block.content || {};

  if (block.block_type === 'photo') {
    if (!content.image_url) return null;
    return (
      <div>
        <img
          src={content.image_url}
          alt={content.caption || block.title || ''}
          style={{ width: '100%', borderRadius: '10px', display: 'block' }}
        />
        {content.caption && (
          <p style={{ color: '#8A8A8A', fontSize: '13px', marginTop: '8px' }}>{content.caption}</p>
        )}
      </div>
    );
  }

  if (block.block_type === 'banner') {
    if (!content.image_url) return null;
    const banner = (
      <div>
        <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em', color: '#8A8A8A', marginBottom: '8px' }}>
          Sponsored
        </div>
        <img
          src={content.image_url}
          alt={block.title || 'Sponsored'}
          style={{ width: '100%', display: 'block', borderRadius: '8px' }}
        />
      </div>
    );
    return (
      <div style={{ border: `1px solid ${ACCENT}55`, borderRadius: '10px', padding: '16px' }}>
        {block.url ? (
          <a href={block.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            {banner}
          </a>
        ) : (
          banner
        )}
      </div>
    );
  }

  if (block.block_type === 'text') {
    return (
      <div>
        {block.title && (
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{block.title}</h3>
        )}
        {content.body && (
          <p style={{ color: '#3A3A3A', lineHeight: 1.75, whiteSpace: 'pre-wrap', fontSize: '15.5px' }}>
            {content.body}
          </p>
        )}
      </div>
    );
  }if (block.block_type === 'visiting_info') {
  const items: { label: string; value?: string }[] = [
    { label: 'Transport Links', value: content.transport },
    { label: 'Club Museum', value: content.museum },
    { label: 'Club Shop', value: content.shop },
    { label: 'Away Fans Entry Points', value: content.entry_points },
    { label: 'Local Pubs (¼ mile)', value: content.pubs },
    { label: 'Eateries / Restaurants', value: content.eateries },
  ].filter((item) => item.value);

  if (items.length === 0) return null;

   return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Visiting Supporters</h3>
      {items.map((item) => (
        <div key={item.label}>
          <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px', color: '#1A1A1A' }}>
            {item.label}
          </h4>
          <p style={{ color: '#3A3A3A', fontSize: '14.5px', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

  // fallback for any legacy block types (e.g. old 'link' blocks)
  return (
    <div>
      <span style={{ fontWeight: 600 }}>{block.title}</span>
      {block.description && (
        <p style={{ color: '#6B6B6B', fontSize: '13px', marginTop: '6px' }}>{block.description}</p>
      )}
    </div>
  );
}
