'use client'

import { useState } from 'react'
import { submitFanGroup } from './submit-actions'

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

// Trim whitespace and prepend https:// if the fan forgot the scheme.
// Leaves empty strings alone so optional fields stay optional.
function normalizeUrl(raw: string): string {
  const v = raw.trim()
  if (!v) return ''
  if (/^https?:\/\//i.test(v)) return v
  return `https://${v}`
}

export default function PublicSubmitFanGroupForm({
  clubId,
  clubSlug,
  clubName,
  accentColor = '#EF4444',
  onSubmitted,
}: {
  clubId: number
  clubSlug: string
  clubName: string
  accentColor?: string
  onSubmitted?: () => void
}) {
  const [name, setName] = useState('')
  const [type, setType] = useState('supporter_club')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [url, setUrl] = useState('')
  const [xUrl, setXUrl] = useState('')
  const [instagramUrl, setInstagramUrl] = useState('')
  const [facebookUrl, setFacebookUrl] = useState('')
  const [tiktokUrl, setTiktokUrl] = useState('')
  const [description, setDescription] = useState('')
  const [submitterEmail, setSubmitterEmail] = useState('')

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const hasAnyLink = url || xUrl || instagramUrl || facebookUrl || tiktokUrl
    if (!name.trim() || !hasAnyLink) {
      setStatus('error')
      setMessage('Please add a group name and at least one link (website, X, Instagram, Facebook, or TikTok).')
      return
    }

    setStatus('submitting')
    const result = await submitFanGroup({
      club_id: clubId,
      club_slug: clubSlug,
      name: name.trim(),
      type,
      city: city.trim(),
      country: country.trim(),
      url: normalizeUrl(url),
      x_url: normalizeUrl(xUrl),
      instagram_url: normalizeUrl(instagramUrl),
      facebook_url: normalizeUrl(facebookUrl),
      tiktok_url: normalizeUrl(tiktokUrl),
      description: description.trim(),
      submitter_email: submitterEmail.trim(),
    })

    if (result.success) {
      setStatus('success')
      setMessage(`Thanks! We'll review "${name}" and add it to ${clubName} soon.`)
      setName(''); setType('supporter_club'); setCity(''); setCountry('')
      setUrl(''); setXUrl(''); setInstagramUrl(''); setFacebookUrl(''); setTiktokUrl('')
      setDescription(''); setSubmitterEmail('')
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
      <label style={labelStyle}>Group name</label>
      <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} required placeholder={`e.g. ${clubName} Supporters — Your City`} />

      <label style={labelStyle}>Type</label>
      <select value={type} onChange={e => setType(e.target.value)} style={inputStyle}>
        {TYPES.map(t => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>

      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>City</label>
          <input value={city} onChange={e => setCity(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Country</label>
          <input value={country} onChange={e => setCountry(e.target.value)} style={inputStyle} />
        </div>
      </div>

      <label style={labelStyle}>Website</label>
      <input value={url} onChange={e => setUrl(e.target.value)} style={inputStyle} placeholder="yourclub.com" />

      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '-4px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Social links (add at least one if you don&apos;t have a website)
      </p>

      <label style={labelStyle}>X (Twitter)</label>
      <input value={xUrl} onChange={e => setXUrl(e.target.value)} style={inputStyle} placeholder="x.com/yourgroup" />

      <label style={labelStyle}>Instagram</label>
      <input value={instagramUrl} onChange={e => setInstagramUrl(e.target.value)} style={inputStyle} placeholder="instagram.com/yourgroup" />

      <label style={labelStyle}>Facebook</label>
      <input value={facebookUrl} onChange={e => setFacebookUrl(e.target.value)} style={inputStyle} placeholder="facebook.com/yourgroup" />

      <label style={labelStyle}>TikTok</label>
      <input value={tiktokUrl} onChange={e => setTiktokUrl(e.target.value)} style={inputStyle} placeholder="tiktok.com/@yourgroup" />

      <label style={labelStyle}>Tell us about your group (optional)</label>
      <textarea value={description} onChange={e => setDescription(e.target.value)} style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }} />

      <label style={labelStyle}>Your email (optional — only used if we need to check something)</label>
      <input type="email" value={submitterEmail} onChange={e => setSubmitterEmail(e.target.value)} style={inputStyle} placeholder="you@example.com" />

      <button type="submit" disabled={status === 'submitting'} style={{
        width: '100%', padding: '12px', borderRadius: '8px', border: 'none',
        background: accentColor, color: '#fff', fontWeight: 600, fontSize: '14px',
        cursor: status === 'submitting' ? 'default' : 'pointer',
        opacity: status === 'submitting' ? 0.6 : 1,
      }}>
        {status === 'submitting' ? 'Submitting…' : 'Submit your group'}
      </button>

      {status === 'error' && <p style={{ color: '#EF4444', fontSize: '13px', marginTop: '16px' }}>{message}</p>}
    </form>
  )
}
