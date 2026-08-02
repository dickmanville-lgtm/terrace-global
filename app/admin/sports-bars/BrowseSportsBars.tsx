'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { updateSportsBar, deleteSportsBar } from './actions'

type SportsBar = {
  id: number
  name: string
  location: string | null
  country: string | null
  url: string | null
  latitude: number | null
  longitude: number | null
  link_status: string | null
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px', borderRadius: '6px', boxSizing: 'border-box',
  border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)',
  color: '#fff', fontSize: '13px', marginBottom: '10px',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px',
}

export default function BrowseSportsBars({
  bars,
  query,
  totalCount,
  resultsLimit,
}: {
  bars: SportsBar[]
  query: string
  totalCount: number
  resultsLimit: number
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(query)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<SportsBar | null>(null)
  const [status, setStatus] = useState<Record<number, string>>({})

  // Debounce: update the URL (and trigger a fresh server-side search) 400ms after typing stops.
  useEffect(() => {
    const trimmed = search.trim()
    const currentQ = searchParams.get('q') || ''
    if (trimmed === currentQ) return

    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (trimmed) {
        params.set('q', trimmed)
      } else {
        params.delete('q')
      }
      router.push(`/admin/sports-bars?${params.toString()}`)
    }, 400)

    return () => clearTimeout(timeout)
  }, [search])

  function startEdit(b: SportsBar) {
    setEditingId(b.id)
    setForm({ ...b })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(null)
  }

  async function saveEdit() {
    if (!form) return
    setStatus(s => ({ ...s, [form.id]: 'saving' }))
    const result = await updateSportsBar(form.id, {
      name: form.name,
      location: form.location || '',
      country: form.country || '',
      url: form.url || '',
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
    const result = await deleteSportsBar(id)
    if (result.success) {
      router.refresh()
    } else {
      setStatus(s => ({ ...s, [id]: 'error: ' + result.error }))
    }
  }

  return (
    <div>
      <label style={labelStyle}>Search by name, location, or country</label>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ ...inputStyle, marginBottom: '8px', maxWidth: '320px' }}
        placeholder="e.g. Ibiza, Tamesis, Spain"
      />

      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginBottom: '24px' }}>
        {query
          ? `${bars.length} match${bars.length === 1 ? '' : 'es'} for "${query}" (of ${totalCount.toLocaleString()} total bars)`
          : `Showing first ${Math.min(resultsLimit, bars.length)} of ${totalCount.toLocaleString()} bars, alphabetically — search to find a specific one`}
      </p>

      {bars.length === 0 && (
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>No bars match that search.</p>
      )}

      {bars.map(b => (
        <div key={b.id} style={{
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
          padding: '16px', marginBottom: '12px', background: 'rgba(255,255,255,0.02)',
        }}>
          {editingId === b.id && form ? (
            <div>
              <label style={labelStyle}>Name</label>
              <input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />

              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Location</label>
                  <input style={inputStyle} value={form.location || ''} onChange={e => setForm({ ...form, location: e.target.value })} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Country</label>
                  <input style={inputStyle} value={form.country || ''} onChange={e => setForm({ ...form, country: e.target.value })} />
                </div>
              </div>

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

              <label style={labelStyle}>Link</label>
              <input style={inputStyle} value={form.url || ''} onChange={e => setForm({ ...form, url: e.target.value })} />

              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button onClick={saveEdit} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#F97316', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
                  Save
                </button>
                <button onClick={cancelEdit} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
              {status[b.id]?.startsWith('error') && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '8px' }}>{status[b.id]}</p>}
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '15px' }}>{b.name}</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                  {b.location || '—'} · {b.country || '—'} · {b.link_status || 'active'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button onClick={() => startEdit(b)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: '#fff', fontSize: '13px', cursor: 'pointer' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(b.id, b.name)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.4)', background: 'transparent', color: '#EF4444', fontSize: '13px', cursor: 'pointer' }}>
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