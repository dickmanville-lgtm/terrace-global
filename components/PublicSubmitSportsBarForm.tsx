'use client'

import { useState } from 'react'
import { submitSportsBar } from './submit-bar-actions'
import BarLocationPicker from './BarLocationPicker'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: '8px', boxSizing: 'border-box',
  border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)',
  color: '#fff', fontSize: '14px', marginBottom: '16px',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px',
}

// Trim whitespace and prepend https:// if the submitter forgot the scheme.
function normalizeUrl(raw: string): string {
  const v = raw.trim()
  if (!v) return ''
  if (/^https?:\/\//i.test(v)) return v
  return `https://${v}`
}

export default function PublicSubmitSportsBarForm({
  accentColor = '#F97316',
  onSubmitted,
}: {
  accentColor?: string
  onSubmitted?: () => void
}) {
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [country, setCountry] = useState('')
  const [url, setUrl] = useState('')
  const [submitterEmail, setSubmitterEmail] = useState('')

  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!name.trim() || !location.trim() || !url.trim()) {
      setStatus('error')
      setMessage('Please add a bar name, location, and a link — a bar with no link isn\u2019t much use on the map.')
      return
    }
    if (!latitude || !longitude) {
      setStatus('error')
      setMessage('Please search, click, or drag the pin on the map to mark the exact spot.')
      return
    }

    setStatus('submitting')
    const result = await submitSportsBar({
      name: name.trim(),
      location: location.trim(),
      country: country.trim(),
      url: normalizeUrl(url),
      submitter_email: submitterEmail.trim(),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    })

    if (result.success) {
      setStatus('success')
      setMessage(`Thanks! We'll check "${name}" and add it to the map soon.`)
      setName(''); setLocation(''); setCountry(''); setUrl(''); setSubmitterEmail('')
      setLatitude(''); setLongitude('')
      onSubmitted?.()
    } else {
      setStatus('error')
      setMessage(result.error || 'Something went wrong — please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '8px 0' }}>
        <p style={{ color: '#4ADE80', fontSize: '15px', fontWeight: 600, marginBottom: '6px' }}>
          Submitted — thank you!
        </p>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>{message}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <label style={labelStyle}>Bar name</label>
      <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} required placeholder="e.g. Tamesis Sports Cafe" />

      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Location (town, resort, or area)</label>
          <input value={location} onChange={e => setLocation(e.target.value)} style={inputStyle} placeholder="e.g. San Antonio" />
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Country</label>
          <input value={country} onChange={e => setCountry(e.target.value)} style={inputStyle} placeholder="e.g. Spain" />
        </div>
      </div>

      <label style={labelStyle}>Pin the exact spot</label>
      <BarLocationPicker
        searchHint={`${name} ${location} ${country}`.trim()}
        latitude={latitude}
        longitude={longitude}
        onLocationChange={(lat, lng) => { setLatitude(lat); setLongitude(lng) }}
      />

      <label style={labelStyle}>Link (website, Facebook, or Instagram)</label>
      <input value={url} onChange={e => setUrl(e.target.value)} style={inputStyle} placeholder="theirsite.com or facebook.com/theirbar" />

      <label style={labelStyle}>Your email (optional — only used if we need to check something)</label>
      <input type="email" value={submitterEmail} onChange={e => setSubmitterEmail(e.target.value)} style={inputStyle} placeholder="you@example.com" />

      <button type="submit" disabled={status === 'submitting'} style={{
        width: '100%', padding: '12px', borderRadius: '8px', border: 'none',
        background: accentColor, color: '#fff', fontWeight: 600, fontSize: '14px',
        cursor: status === 'submitting' ? 'default' : 'pointer',
        opacity: status === 'submitting' ? 0.6 : 1,
      }}>
        {status === 'submitting' ? 'Submitting…' : 'Submit this bar'}
      </button>

      {status === 'error' && <p style={{ color: '#EF4444', fontSize: '13px', marginTop: '16px' }}>{message}</p>}
    </form>
  )
}
