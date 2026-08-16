'use client';

import { useState } from 'react';
import { addBlock, updateBlock, deleteBlock, moveBlock, Block, BlockType } from './actions';

export default function BlockEditor({
  sectionId,
  slug,
  initialBlocks,
}: {
  sectionId: string;
  slug: string;
  initialBlocks: Block[];
}) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [pending, setPending] = useState(false);

  async function refresh() {
    // simplest reliable approach for now: full page reload after any change
    window.location.reload();
  }

  async function handleAdd(blockType: BlockType) {
    setPending(true);
    await addBlock(sectionId, slug, blockType);
    await refresh();
  }

  async function handleDelete(blockId: string) {
    if (!confirm('Delete this block?')) return;
    setPending(true);
    await deleteBlock(blockId, slug);
    await refresh();
  }

  async function handleMove(blockId: string, direction: 'up' | 'down') {
    setPending(true);
    await moveBlock(blockId, sectionId, slug, direction);
    await refresh();
  }

  async function handleSave(
    blockId: string,
    title: string,
    url: string,
    content: Block['content']
  ) {
    setPending(true);
    await updateBlock(blockId, slug, { title, url: url || null, content });
    await refresh();
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button disabled={pending} onClick={() => handleAdd('photo')}>+ Photo block</button>
        <button disabled={pending} onClick={() => handleAdd('banner')}>+ Banner block</button>
        <button disabled={pending} onClick={() => handleAdd('text')}>+ Text block</button>
      </div>

      {blocks.length === 0 && <p style={{ color: '#999' }}>No blocks yet — add one above.</p>}

      {blocks.map((block, index) => (
        <div
          key={block.id}
          style={{
            border: '1px solid #ddd',
            borderRadius: 6,
            padding: '1rem',
            marginBottom: '1rem',
            background: '#fafafa',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <strong style={{ textTransform: 'capitalize' }}>{block.block_type} block</strong>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button disabled={pending || index === 0} onClick={() => handleMove(block.id, 'up')}>↑</button>
              <button disabled={pending || index === blocks.length - 1} onClick={() => handleMove(block.id, 'down')}>↓</button>
              <button disabled={pending} onClick={() => handleDelete(block.id)} style={{ color: 'red' }}>Delete</button>
            </div>
          </div>

          <BlockFields block={block} onSave={handleSave} disabled={pending} />
        </div>
      ))}
    </div>
  );
}

function BlockFields({
  block,
  onSave,
  disabled,
}: {
  block: Block;
  onSave: (blockId: string, title: string, url: string, content: Block['content']) => void;
  disabled: boolean;
}) {
  const [title, setTitle] = useState(block.title);
  const [url, setUrl] = useState(block.url ?? '');
  const [imageUrl, setImageUrl] = useState(block.content?.image_url ?? '');
  const [caption, setCaption] = useState(block.content?.caption ?? '');
  const [body, setBody] = useState(block.content?.body ?? '');

  function save() {
    let content: Block['content'] = {};
    if (block.block_type === 'photo') content = { image_url: imageUrl, caption };
    if (block.block_type === 'banner') content = { image_url: imageUrl };
    if (block.block_type === 'text') content = { body };
    onSave(block.id, title, url, content);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {block.block_type === 'text' && (
        <input
          placeholder="Heading (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      )}

      {(block.block_type === 'photo' || block.block_type === 'banner') && (
        <input
          placeholder="Image URL (upload wiring comes next session — paste a URL for now)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      )}

      {block.block_type === 'photo' && (
        <input
          placeholder="Caption (optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
      )}

      {block.block_type === 'banner' && (
        <input
          placeholder="Link URL (where the banner sends visitors)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      )}

      {block.block_type === 'text' && (
        <textarea
          placeholder="Text content (rich formatting comes next session — plain text for now)"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={5}
        />
      )}

      <button disabled={disabled} onClick={save} style={{ alignSelf: 'flex-start' }}>
        Save block
      </button>
    </div>
  );
}