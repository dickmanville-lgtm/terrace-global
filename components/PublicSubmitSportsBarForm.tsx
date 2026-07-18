'use client'

import { useState } from 'react'
import { submitSportsBar } from './submit-bar-actions'

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

  const [address, setAddress] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [geocodeStatus, setGeocodeStatus] = useState<'idle' | 'loading' | 'found' | 'notfound' | 'error'>('idle')
  const [geocodeLabel, setGeocodeLabel] = useState('')

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleGeocode() {
    const query = address.trim() || `${name} ${location} ${country}`.trim()
    if (!query) return
    setGeocodeStatus('loading')
    try {
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${token}&limit=1`
      )
      const data = await res.json()
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center
        setLatitude(lat.toFixed(6))
        setLongitude(lng.toFixed(6))
        setGeocodeLabel(data.features[0].place_name)
        setGeocodeStatus('found')
      } else {
        setGeocodeStatus('notfound')
      }
    } catch {
      setGeocodeStatus('error')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!name.trim() || !location.trim() || !url.trim()) {
      setStatus('error')
      setMessage('Please add a bar name, location, and a link — a bar with no link isn\u2019t much use on the map.')
      return
    }
    if (!latitude || !longitude) {
      setStatus('error')
      setMessage('Please use "Find on map" to pin the exact spot — that\u2019s how people find it once it\u2019s live.')
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
      setAddress(''); setLatitude(''); setLongitude(''); setGeocodeStatus('idle')
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

      <label style={labelStyle}>Pin the exact spot — search the bar name or address</label>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <input
          value={address}
          onChange={e => setAddress(e.target.value)}
          style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
          placeholder="Leave blank to search the bar name + location above"
        />
        <button type="button" onClick={handleGeocode} style={{
          padding: '10px 16px', borderRadius: '8px', border: 'none',
          background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap',
        }}>
          Find on map
        </button>
      </div>
      {geocodeStatus === 'loading' && <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px' }}>Looking up…</p>}
      {geocodeStatus === 'found' && <p style={{ fontSize: '12px', color: '#4ADE80', marginBottom: '12px' }}>Found: {geocodeLabel}</p>}
      {geocodeStatus === 'notfound' && <p style={{ fontSize: '12px', color: '#F97316', marginBottom: '12px' }}>No match — try adding a street name or nearby landmark.</p>}
      {geocodeStatus === 'error' && <p style={{ fontSize: '12px', color: '#EF4444', marginBottom: '12px' }}>Lookup failed — check your connection and try again.</p>}

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
