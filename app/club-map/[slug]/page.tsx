// app/club-map/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '../../../lib/supabase-admin';

export const revalidate = 60;

interface Block {
  id: string;
  block_type: string;
  title: string;
  description: string | null;
  url: string | null;
  content: any;
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
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <header className="mb-10">
          <h1 className="text-4xl font-bold">{ground.club}</h1>
          <p className="text-gray-600 mt-1">{ground.country}</p>
        </header>

        {sections.map(function (section) {
          const injectWebsite = section.section_key === 'home_fans' ? ground.website : null;
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

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-semibold mb-4 border-b border-gray-200 pb-2">
        {section.title}
      </h2>

      {!hasContent && <p className="text-gray-400 italic">Coming soon</p>}

      {hasContent && (
        <ul className="space-y-3">
          {hasWebsite && (
            <li>
              <WebsiteLink url={injectWebsite as string} />
            </li>
          )}
          {section.blocks.map(function (block) {
            return (
              <li key={block.id}>
                <BlockItem block={block} />
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function WebsiteLink(props: { url: string }) {
  const linkStyle = "text-blue-700 hover:underline font-medium";
  return (
    <a href={props.url} target="_blank" rel="noopener noreferrer" className={linkStyle}>
      Official Website →
    </a>
  );
}

function BlockItem(props: { block: Block }) {
  const block = props.block;
  const linkStyle = "text-blue-700 hover:underline font-medium";

  if (block.block_type === 'link' && block.url) {
    return (
      <a href={block.url} target="_blank" rel="noopener noreferrer" className={linkStyle}>
        {block.title} →
      </a>
    );
  }

  return (
    <div>
      <span className="font-medium">{block.title}</span>
      {block.description && (
        <p className="text-gray-600 text-sm mt-1">{block.description}</p>
      )}
    </div>
  );
}