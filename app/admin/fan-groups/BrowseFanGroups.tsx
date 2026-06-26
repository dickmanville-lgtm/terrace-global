'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateFanGroup, deleteFanGroup } from './actions'

type Club = { id: number; name: string; slug: string }
type FanGroup = {
  id: number
  name: string
  type: string
  city: string | null
  country: string | null
  region: string | null
  url: string | null
  instagram_url: string | null
  facebook_url: string | null
  tiktok_url: string | null
  description: string | null
  latitude: number | null
  longitude: number | null
}

const REGIONS = [
  'United Kingdom', 'Ireland', 'Europe', 'North America', 'South America',
  'Africa', 'Asia', 'Australia & New Zealand', 'More worldwide',
]
const TYPES = [
  { value: 'supporter_club', label: 'Supporter club' },
  { value: 'community', label: 'Fan community' },
  { value: 'fan_bar', label: 'Fan bar' },
]

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px', borderRadius: '6px', boxSizing: 'border-box',
  border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)',
  color: '#fff', fontSize: '13px', marginBottom: '10px',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px',
}

export default function BrowseFanGroups({ clubs, selectedSlug, groups }: { clubs: Club[]; selectedSlug: string; groups: FanGroup[] }) {
  const router = useRouter()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<FanGroup | null>(null)
  const [status, setStatus] = useState<Record<number, string>>({})

  function startEdit(g: FanGroup) {
    setEditingId(g.id)
    setForm({ ...g })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(null)
  }

  async function saveEdit() {
    if (!form) return
    setStatus(s => ({ ...s, [form.id]: 'saving' }))
    const result = await updateFanGroup(form.id, selectedSlug, {
      name: form.name,
      type: form.type,
      city: form.city || '',
      country: form.country || '',
      region: form.region || '',
      url: form.url || '',
      instagram_url: form.instagram_url || '',
      facebook_url: form.facebook_url || '',
      tiktok_url: form.tiktok_url || '',
      description: form.description || '',
      latitude: form.latitude,
      longitude: form.longitude,
    })
    if (result.success) {
      setEditingId(null)
      setForm(null)
      router.refresh()
    } else {
      setStatus(s => ({ ...s, [form.id]: 'error: ' + result.error }))
    }
  }

  async function handleDelete(id: number, name: string) {
    if (!window.confirm(`Delete "${name}"? This can't be undone.`)) return
    setStatus(s => ({ ...s, [id]: 'deleting' }))
    const result = await deleteFanGroup(id, selectedSlug)
    if (result.success) {
      router.refresh()
    } else {
      setStatus(s => ({ ...s, [id]: 'error: ' + result.error }))
    }
  }

  return (
    <div>
      <label style={labelStyle}>Club</label>
      <select
        value={selectedSlug}
        onChange={e => router.push(`/admin/fan-groups?club=${e.target.value}`)}
        style={{ ...inputStyle, marginBottom: '24px', maxWidth: '320px' }}
      >
        <option value="">Select a club</option>
        {clubs.map(c => (
          <option key={c.id} value={c.slug}>{c.name}</option>
        ))}
      </select>

      {!selectedSlug && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Pick a club above to see its fan groups.</p>}

      {selectedSlug && groups.length === 0 && (
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>No fan groups found for this club yet.</p>
      )}

      {groups.map(g => (
        <div key={g.id} style={{
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
          padding: '16px', marginBottom: '12px', background: 'rgba(255,255,255,0.02)',
        }}>
          {editingId === g.id && form ? (
            <div>
              <label style={labelStyle}>Name</label>
              <input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />

              <label style={labelStyle}>Type</label>
              <select style={inputStyle} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>

              <label style={labelStyle}>City</label>
              <input style={inputStyle} value={form.city || ''} onChange={e => setForm({ ...form, city: e.target.value })} />

              <label style={labelStyle}>Country</label>
              <input style={inputStyle} value={form.country || ''} onChange={e => setForm({ ...form, country: e.target.value })} />

              <label style={labelStyle}>Region</label>
              <select style={inputStyle} value={form.region || ''} onChange={e => setForm({ ...form, region: e.target.value })}>
                <option value="">Select a region</option>
                {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>

              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Latitude</label>
                  <input style={inputStyle} value={form.latitude ?? ''} onChange={e => setForm({ ...form, latitude: e.target.value ? parseFloat(e.target.value) : null })} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Longitude</label>
                  <input style={inputStyle} value={form.longitude ?? ''} onChange={e => setForm({ ...form, longitude: e.target.value ? parseFloat(e.target.value) : null })} />
                </div>
              </div>

              <label style={labelStyle}>Website</label>
              <input style={inputStyle} value={form.url || ''} onChange={e => setForm({ ...form, url: e.target.value })} />

              <label style={labelStyle}>Instagram</label>
              <input style={inputStyle} value={form.instagram_url || ''} onChange={e => setForm({ ...form, instagram_url: e.target.value })} />

              <label style={labelStyle}>Facebook</label>
              <input style={inputStyle} value={form.facebook_url || ''} onChange={e => setForm({ ...form, facebook_url: e.target.value })} />

              <label style={labelStyle}>TikTok</label>
              <input style={inputStyle} value={form.tiktok_url || ''} onChange={e => setForm({ ...form, tiktok_url: e.target.value })} />

              <label style={labelStyle}>Description</label>
              <textarea style={{ ...inputStyle, minHeight: '60px' }} value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} />

              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button onClick={saveEdit} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#EF4444', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
                  Save
                </button>
                <button onClick={cancelEdit} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
              {status[g.id]?.startsWith('error') && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '8px' }}>{status[g.id]}</p>}
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '15px' }}>{g.name}</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                  {g.type} · {g.city || '—'} · {g.region || '—'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button onClick={() => startEdit(g)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: '#fff', fontSize: '13px', cursor: 'pointer' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(g.id, g.name)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.4)', background: 'transparent', color: '#EF4444', fontSize: '13px', cursor: 'pointer' }}>
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}