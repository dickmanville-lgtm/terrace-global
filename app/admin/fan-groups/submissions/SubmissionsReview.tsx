'use client'

import { useState } from 'react'
import { approveSubmission, rejectSubmission } from './actions'
import type { Submission } from './page'
import { regionForCountry } from '../../../../lib/region'

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
  width: '100%', padding: '9px 11px', borderRadius: '8px', boxSizing: 'border-box',
  border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)',
  color: '#fff', fontSize: '13px', marginBottom: '12px',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '5px',
}

function SubmissionCard({ submission, clubs }: { submission: Submission; clubs: Club[] }) {
  const initialClub = clubs.find((c) => c.id === submission.club_id) || null

  const [clubId, setClubId] = useState(initialClub ? String(initialClub.id) : '')
  const [name, setName] = useState(submission.name)
  const [type, setType] = useState(submission.type || 'supporter_club')
  const [city, setCity] = useState(submission.city || '')
  const [country, setCountry] = useState(submission.country || '')
  const [region, setRegion] = useState(submission.region || regionForCountry(submission.country || ''))
  const [regionTouched, setRegionTouched] = useState(!!submission.region)
  const [url, setUrl] = useState(submission.url || '')
  const [description, setDescription] = useState(submission.description || '')

  const [address, setAddress] = useState('')
  const [latitude, setLatitude] = useState(submission.latitude != null ? String(submission.latitude) : '')
  const [longitude, setLongitude] = useState(submission.longitude != null ? String(submission.longitude) : '')
  const [geocodeStatus, setGeocodeStatus] = useState<'idle' | 'loading' | 'found' | 'notfound' | 'error'>('idle')
  const [geocodeLabel, setGeocodeLabel] = useState('')

  const [reviewNote, setReviewNote] = useState('')
  const [actionStatus, setActionStatus] = useState<'idle' | 'working' | 'error'>('idle')
  const [actionMessage, setActionMessage] = useState('')
  const [done, setDone] = useState<'approved' | 'rejected' | null>(null)

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

  async function handleApprove() {
    const club = clubs.find((c) => c.id === Number(clubId))
    if (!club || !name || !region || !latitude || !longitude) {
      setActionStatus('error')
      setActionMessage('Club, name, region, and coordinates are all required to approve.')
      return
    }

    setActionStatus('working')
    const result = await approveSubmission({
      id: submission.id,
      club_id: club.id,
      club_slug: club.slug,
      name,
      type,
      city,
      country,
      region,
      url,
      description,
      instagram_url: submission.instagram_url || '',
      facebook_url: submission.facebook_url || '',
      tiktok_url: submission.tiktok_url || '',
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    })

    if (result.success) {
      setDone('approved')
    } else {
      setActionStatus('error')
      setActionMessage(result.error || 'Something went wrong.')
    }
  }

  async function handleReject() {
    setActionStatus('working')
    const result = await rejectSubmission(submission.id, reviewNote)
    if (result.success) {
      setDone('rejected')
    } else {
      setActionStatus('error')
      setActionMessage(result.error || 'Something went wrong.')
    }
  }

  const cardStyle: React.CSSProperties = {
    border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)',
    borderRadius: '12px', padding: '20px', marginBottom: '16px',
  }

  if (done) {
    return (
      <div style={cardStyle}>
        <p style={{ fontSize: '14px', color: done === 'approved' ? '#4ADE80' : 'rgba(255,255,255,0.5)' }}>
          {done === 'approved' ? `✓ Approved — "${name}" added to fan_groups.` : `Rejected "${name}".`}
        </p>
      </div>
    )
  }

  const links = [
    submission.url && { label: 'Link', href: submission.url },
    submission.instagram_url && { label: 'Instagram', href: submission.instagram_url },
    submission.facebook_url && { label: 'Facebook', href: submission.facebook_url },
    submission.tiktok_url && { label: 'TikTok', href: submission.tiktok_url },
  ].filter(Boolean) as { label: string; href: string }[]

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <div style={{ fontSize: '16px', fontWeight: 700 }}>{submission.name}</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
            {initialClub?.name || 'Unknown club'} · submitted {new Date(submission.created_at).toLocaleDateString('en-GB')}
            {submission.submitter_email ? ` · ${submission.submitter_email}` : ''}
          </div>
        </div>
      </div>

      {links.length > 0 && (
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
          {links.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: '12px', color: '#EF4444', textDecoration: 'none' }}>
              {l.label} ↗
            </a>
          ))}
        </div>
      )}

      {submission.description && (
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '14px' }}>{submission.description}</p>
      )}

      <label style={labelStyle}>Club</label>
      <select value={clubId} onChange={(e) => setClubId(e.target.value)} style={inputStyle}>
        <option value="">Select a club</option>
        {clubs.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <label style={labelStyle}>Group name</label>
      <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />

      <label style={labelStyle}>Type</label>
      <select value={type} onChange={(e) => setType(e.target.value)} style={inputStyle}>
        {TYPES.map((t) => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>

      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>City</label>
          <input value={city} onChange={(e) => setCity(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Country</label>
          <input
            value={country}
            onChange={(e) => {
              const next = e.target.value
              setCountry(next)
              if (!regionTouched) setRegion(regionForCountry(next))
            }}
            style={inputStyle}
          />
        </div>
      </div>

      <label style={labelStyle}>Region</label>
      <select
        value={region}
        onChange={(e) => {
          setRegion(e.target.value)
          setRegionTouched(true)
        }}
        style={inputStyle}
      >
        <option value="">Select a region</option>
        {REGIONS.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
      {!regionTouched && region && (
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '-8px', marginBottom: '12px' }}>
          Auto-suggested from country — change it if that&apos;s wrong.
        </p>
      )}

      <label style={labelStyle}>Find location (address, venue, or city)</label>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <input value={address} onChange={(e) => setAddress(e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
        <button type="button" onClick={handleGeocode} style={{
          padding: '9px 14px', borderRadius: '8px', border: 'none',
          background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap',
        }}>
          Find
        </button>
      </div>
      {geocodeStatus === 'loading' && <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '10px' }}>Looking up…</p>}
      {geocodeStatus === 'found' && <p style={{ fontSize: '11px', color: '#4ADE80', marginBottom: '10px' }}>Found: {geocodeLabel}</p>}
      {geocodeStatus === 'notfound' && <p style={{ fontSize: '11px', color: '#F97316', marginBottom: '10px' }}>No results — try a different search, or enter coordinates manually below.</p>}
      {geocodeStatus === 'error' && <p style={{ fontSize: '11px', color: '#EF4444', marginBottom: '10px' }}>Lookup failed — check your connection.</p>}

      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Latitude</label>
          <input value={latitude} onChange={(e) => setLatitude(e.target.value)} style={inputStyle} placeholder="e.g. 51.5072" />
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Longitude</label>
          <input value={longitude} onChange={(e) => setLongitude(e.target.value)} style={inputStyle} placeholder="e.g. -0.1276" />
        </div>
      </div>

      <label style={labelStyle}>Website / social link</label>
      <input value={url} onChange={(e) => setUrl(e.target.value)} style={inputStyle} />

      <label style={labelStyle}>Description</label>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} />

      <label style={labelStyle}>Rejection note (optional, only used if you reject)</label>
      <input value={reviewNote} onChange={(e) => setReviewNote(e.target.value)} style={inputStyle} placeholder="e.g. dead link, duplicate, not club-specific" />

      <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
        <button
          type="button"
          onClick={handleApprove}
          disabled={actionStatus === 'working'}
          style={{
            flex: 1, padding: '11px', borderRadius: '8px', border: 'none',
            background: '#4ADE80', color: '#0a0a0a', fontWeight: 700, fontSize: '13px',
            cursor: actionStatus === 'working' ? 'default' : 'pointer', opacity: actionStatus === 'working' ? 0.6 : 1,
          }}
        >
          Approve
        </button>
        <button
          type="button"
          onClick={handleReject}
          disabled={actionStatus === 'working'}
          style={{
            flex: 1, padding: '11px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)',
            background: 'transparent', color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '13px',
            cursor: actionStatus === 'working' ? 'default' : 'pointer', opacity: actionStatus === 'working' ? 0.6 : 1,
          }}
        >
          Reject
        </button>
      </div>

      {actionStatus === 'error' && (
        <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '10px' }}>{actionMessage}</p>
      )}
    </div>
  )
}

function ReadOnlyCard({ submission, clubs }: { submission: Submission; clubs: Club[] }) {
  const club = clubs.find((c) => c.id === submission.club_id)
  return (
    <div style={{
      border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)',
      borderRadius: '12px', padding: '16px 20px', marginBottom: '12px',
    }}>
      <div style={{ fontSize: '15px', fontWeight: 700 }}>{submission.name}</div>
      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
        {club?.name || 'Unknown club'} · reviewed {submission.reviewed_at ? new Date(submission.reviewed_at).toLocaleDateString('en-GB') : '—'}
      </div>
      {submission.review_note && (
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '6px' }}>Note: {submission.review_note}</div>
      )}
    </div>
  )
}

export default function SubmissionsReview({
  clubs,
  submissions,
  status,
}: {
  clubs: Club[]
  submissions: Submission[]
  status: string
}) {
  return (
    <div>
      {submissions.map((s) =>
        status === 'pending' ? (
          <SubmissionCard key={s.id} submission={s} clubs={clubs} />
        ) : (
          <ReadOnlyCard key={s.id} submission={s} clubs={clubs} />
        )
      )}
    </div>
  )
}
