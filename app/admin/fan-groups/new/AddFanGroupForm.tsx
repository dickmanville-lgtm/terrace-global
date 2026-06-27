'use client'

import { useState } from 'react'
import { createFanGroup } from './actions'

type Club = { id: number; name: string; slug: string }

const REGIONS = [
  'United Kingdom', 'Ireland', 'Europe', 'North America', 'South America',
  'Africa', 'Asia', 'Australia & New Zealand', 'More worldwide',
]

const TYPES: { value: string; label: string }[] = [
  { value: 'supporter_club', label: 'Supporter club' },
  { value: 'community', label: 'Fan community' },
  { value: 'fan_bar', label: 'Fan bar' },
]

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: '8px', boxSizing: 'border-box',
  border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)',
  color: '#fff', fontSize: '14px', marginBottom: '16px',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px',
}

export default function AddFanGroupForm({ clubs }: { clubs: Club[] }) {
  const [clubId, setClubId] = useState('')
  const [name, setName] = useState('')
  const [type, setType] = useState('supporter_club')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [region, setRegion] = useState('')
  const [url, setUrl] = useState('https://')
  const [description, setDescription] = useState('')

  const [instagramUrl, setInstagramUrl] = useState('')
  const [facebookUrl, setFacebookUrl] = useState('')
  const [tiktokUrl, setTiktokUrl] = useState('')

  const [address, setAddress] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [geocodeStatus, setGeocodeStatus] = useState<'idle' | 'loading' | 'found' | 'notfound' | 'error'>('idle')
  const [geocodeLabel, setGeocodeLabel] = useState('')

  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  async function handleGeocode() {
    if (!address.trim()) return
    setGeocodeStatus('loading')
    try {
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${token}&limit=1`
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
    const club = clubs.find(c => c.id === Number(clubId))
    if (!club || !name || !region) {
      setSubmitStatus('error')
      setSubmitMessage('Club, name, and region are required.')
      return
    }

    setSubmitStatus('submitting')
    const result = await createFanGroup({
      club_id: club.id,
      club_slug: club.slug,
      name,
      type,
      city,
      country,
      region,
      url,
      description,
      instagram_url: instagramUrl,
      facebook_url: facebookUrl,
      tiktok_url: tiktokUrl,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
    })

    if (result.success) {
      setSubmitStatus('success')
      setSubmitMessage(`Added "${name}" to ${club.name}.`)
      setName(''); setType('supporter_club'); setCity(''); setCountry(''); setRegion('')
setUrl('https://'); setDescription(''); setAddress(''); setLatitude(''); setLongitude('')
      setInstagramUrl(''); setFacebookUrl(''); setTiktokUrl('')
      setGeocodeStatus('idle'); setGeocodeLabel('')
    } else {
      setSubmitStatus('error')
      setSubmitMessage(result.error || 'Something went wrong.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label style={labelStyle}>Club</label>
      <select value={clubId} onChange={e => setClubId(e.target.value)} style={inputStyle} required>
        <option value="">Select a club</option>
        {clubs.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <label style={labelStyle}>Group name</label>
      <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} required />

      <label style={labelStyle}>Type</label>
      <select value={type} onChange={e => setType(e.target.value)} style={inputStyle}>
        {TYPES.map(t => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>

      <label style={labelStyle}>City</label>
      <input value={city} onChange={e => setCity(e.target.value)} style={inputStyle} />

      <label style={labelStyle}>Country</label>
      <input value={country} onChange={e => setCountry(e.target.value)} style={inputStyle} />

      <label style={labelStyle}>Region</label>
      <select value={region} onChange={e => setRegion(e.target.value)} style={inputStyle} required>
        <option value="">Select a region</option>
        {REGIONS.map(r => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>

      <label style={labelStyle}>Find location (address, venue, or city)</label>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <input value={address} onChange={e => setAddress(e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
        <button type="button" onClick={handleGeocode} style={{
          padding: '10px 16px', borderRadius: '8px', border: 'none',
          background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap',
        }}>
          Find
        </button>
      </div>
      {geocodeStatus === 'loading' && <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px' }}>Looking up…</p>}
      {geocodeStatus === 'found' && <p style={{ fontSize: '12px', color: '#4ADE80', marginBottom: '12px' }}>Found: {geocodeLabel}</p>}
      {geocodeStatus === 'notfound' && <p style={{ fontSize: '12px', color: '#F97316', marginBottom: '12px' }}>No results — try a different search, or enter coordinates manually below.</p>}
      {geocodeStatus === 'error' && <p style={{ fontSize: '12px', color: '#EF4444', marginBottom: '12px' }}>Lookup failed — check your connection.</p>}

      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Latitude</label>
          <input value={latitude} onChange={e => setLatitude(e.target.value)} style={inputStyle} placeholder="e.g. 51.5072" />
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Longitude</label>
          <input value={longitude} onChange={e => setLongitude(e.target.value)} style={inputStyle} placeholder="e.g. -0.1276" />
        </div>
      </div>

      <label style={labelStyle}>Website / social link</label>
      <input type="url" value={url} onChange={e => setUrl(e.target.value)} style={inputStyle} placeholder="https://..." />

      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '-4px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Social media (optional)
      </p>

      <label style={labelStyle}>Instagram</label>
      <input type="url" value={instagramUrl} onChange={e => setInstagramUrl(e.target.value)} style={inputStyle} placeholder="https://instagram.com/..." />

      <label style={labelStyle}>Facebook</label>
      <input type="url" value={facebookUrl} onChange={e => setFacebookUrl(e.target.value)} style={inputStyle} placeholder="https://facebook.com/..." />

      <label style={labelStyle}>TikTok</label>
      <input type="url" value={tiktokUrl} onChange={e => setTiktokUrl(e.target.value)} style={inputStyle} placeholder="https://tiktok.com/@..." />

      <label style={labelStyle}>Description (optional)</label>
      <textarea value={description} onChange={e => setDescription(e.target.value)} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} />

      <button type="submit" disabled={submitStatus === 'submitting'} style={{
        width: '100%', padding: '12px', borderRadius: '8px', border: 'none',
        background: '#EF4444', color: '#fff', fontWeight: 600, fontSize: '14px',
        cursor: submitStatus === 'submitting' ? 'default' : 'pointer',
        opacity: submitStatus === 'submitting' ? 0.6 : 1,
      }}>
        {submitStatus === 'submitting' ? 'Adding…' : 'Add fan group'}
      </button>

      {submitStatus === 'success' && <p style={{ color: '#4ADE80', fontSize: '13px', marginTop: '16px' }}>{submitMessage}</p>}
      {submitStatus === 'error' && <p style={{ color: '#EF4444', fontSize: '13px', marginTop: '16px' }}>{submitMessage}</p>}
    </form>
  )
}