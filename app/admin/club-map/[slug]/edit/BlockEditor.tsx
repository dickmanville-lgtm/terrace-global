'use client';

import { useState } from 'react';
import { addBlock, updateBlock, deleteBlock, moveBlock, uploadBlockImage, Block, BlockType } from './actions';

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
<button disabled={pending} onClick={() => handleAdd('visiting_info')}>+ Visiting Supporters block</button>
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

          <BlockFields block={block} onSave={handleSave} disabled={pending} slug={slug} />
        </div>
      ))}
    </div>
  );
}

function BlockFields({
  block,
  onSave,
  disabled,
  slug,
}: {
  block: Block;
  onSave: (blockId: string, title: string, url: string, content: Block['content']) => void;
  disabled: boolean;
  slug: string;
}) {
  const [title, setTitle] = useState(block.title);
  const [url, setUrl] = useState(block.url ?? '');
  const [imageUrl, setImageUrl] = useState(block.content?.image_url ?? '');
  const [caption, setCaption] = useState(block.content?.caption ?? '');
  const [body, setBody] = useState(block.content?.body ?? '');
  const [transport, setTransport] = useState(block.content?.transport ?? '');
const [museum, setMuseum] = useState(block.content?.museum ?? '');
const [shop, setShop] = useState(block.content?.shop ?? '');
const [entryPoints, setEntryPoints] = useState(block.content?.entry_points ?? '');
const [pubs, setPubs] = useState(block.content?.pubs ?? '');
const [eateries, setEateries] = useState(block.content?.eateries ?? '');
const [pasteAll, setPasteAll] = useState('');
  const [uploading, setUploading] = useState(false);

  function parsePasteAll() {
  const labels: { key: string; setter: (v: string) => void }[] = [
    { key: 'Transport Links', setter: setTransport },
    { key: 'Club Museum', setter: setMuseum },
    { key: 'Club Shop', setter: setShop },
    { key: 'Away Fans Entry Points', setter: setEntryPoints },
    { key: 'Local Pubs', setter: setPubs },
    { key: 'Eateries', setter: setEateries },
  ];

  let remaining = pasteAll;

  for (let i = 0; i < labels.length; i++) {
    const current = labels[i];
    const startIdx = remaining.indexOf(current.key + ':');
    if (startIdx === -1) continue;

    const afterLabel = remaining.slice(startIdx + current.key.length + 1);

    let endIdx = afterLabel.length;
    for (let j = i + 1; j < labels.length; j++) {
      const nextIdx = afterLabel.indexOf(labels[j].key + ':');
      if (nextIdx !== -1 && nextIdx < endIdx) {
        endIdx = nextIdx;
      }
    }

    const value = afterLabel.slice(0, endIdx).trim();
    current.setter(value);
  }
}function save() {
    let content: Block['content'] = {};
    if (block.block_type === 'photo') content = { image_url: imageUrl, caption };
    if (block.block_type === 'banner') content = { image_url: imageUrl };
    if (block.block_type === 'text') content = { body };
    if (block.block_type === 'visiting_info') content = { transport, museum, shop, entry_points: entryPoints, pubs, eateries };
    onSave(block.id, title, url, content);
  }
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];
  if (!file) return;

  setUploading(true);
  const formData = new FormData();
  formData.append('file', file);
  formData.append('slug', slug);

  const result = await uploadBlockImage(formData);

  if (result.success && result.url) {
    setImageUrl(result.url);
  } else {
    alert(`Upload failed: ${result.error}`);
  }

  setUploading(false);
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
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
    {imageUrl && (
      <img
        src={imageUrl}
        alt=""
        style={{ maxWidth: 200, maxHeight: 120, objectFit: 'cover', borderRadius: 4 }}
      />
    )}
    <input
      type="file"
      accept="image/jpeg,image/png,image/webp"
      onChange={handleFileUpload}
      disabled={uploading}
    />
    {uploading && <span style={{ color: '#999' }}>Uploading…</span>}
    <input
      placeholder="Or paste an image URL directly"
      value={imageUrl}
      onChange={(e) => setImageUrl(e.target.value)}
    />
  </div>
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
{block.block_type === 'visiting_info' && (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ border: '1px dashed #999', padding: '0.75rem', borderRadius: 4 }}>
      <label>
        Paste all at once (format: "Transport Links: ... Club Museum: ..." etc)
        <textarea
          value={pasteAll}
          onChange={(e) => setPasteAll(e.target.value)}
          rows={6}
          style={{ width: '100%', display: 'block' }}
        />
      </label>
      <button type="button" onClick={parsePasteAll} style={{ marginTop: '0.5rem' }}>
        Parse into fields below
      </button>
    </div>
    <label>
      Transport Links
      <textarea value={transport} onChange={(e) => setTransport(e.target.value)} rows={2} style={{ width: '100%', display: 'block' }} />
    </label>
    <label>
      Club Museum
      <textarea value={museum} onChange={(e) => setMuseum(e.target.value)} rows={2} style={{ width: '100%', display: 'block' }} />
    </label>
    <label>
      Club Shop
      <textarea value={shop} onChange={(e) => setShop(e.target.value)} rows={2} style={{ width: '100%', display: 'block' }} />
    </label>
    <label>
      Away Fans Entry Points
      <textarea value={entryPoints} onChange={(e) => setEntryPoints(e.target.value)} rows={2} style={{ width: '100%', display: 'block' }} />
    </label>
    <label>
      Local Pubs (¼ mile)
      <textarea value={pubs} onChange={(e) => setPubs(e.target.value)} rows={2} style={{ width: '100%', display: 'block' }} />
    </label>
    <label>
      Eateries / Restaurants
      <textarea value={eateries} onChange={(e) => setEateries(e.target.value)} rows={2} style={{ width: '100%', display: 'block' }} />
    </label>
  </div>
)}
      <button disabled={disabled} onClick={save} style={{ alignSelf: 'flex-start' }}>
        Save block
      </button>
    </div>
  );
}