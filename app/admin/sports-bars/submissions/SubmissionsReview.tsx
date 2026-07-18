'use client'

import { useState } from 'react'
import { approveSubmission, rejectSubmission } from './actions'
import type { BarSubmission } from './page'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 11px', borderRadius: '8px', boxSizing: 'border-box',
  border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)',
  color: '#fff', fontSize: '13px', marginBottom: '12px',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '5px',
}

function SubmissionCard({ submission }: { submission: BarSubmission }) {
  const [name, setName] = useState(submission.name)
  const [location, setLocation] = useState(submission.location || '')
  const [country, setCountry] = useState(submission.country || '')
  const [url, setUrl] = useState(submission.url || '')

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
    if (!name || !location || !country || !url || !latitude || !longitude) {
      setActionStatus('error')
      setActionMessage('Name, location, country, url, and coordinates are all required to approve.')
      return
    }

    setActionStatus('working')
    const result = await approveSubmission({
      id: submission.id,
      name,
      location,
      country,
      url,
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
          {done === 'approved' ? `✓ Approved — "${name}" added to sports_bars.` : `Rejected "${name}".`}
        </p>
      </div>
    )
  }

  return (
    <div style={cardStyle}>
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '16px', fontWeight: 700 }}>{submission.name}</div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
          submitted {new Date(submission.created_at).toLocaleDateString('en-GB')}
          {submission.submitter_email ? ` · ${submission.submitter_email}` : ''}
        </div>
      </div>

      {submission.url && (
        <div style={{ marginBottom: '14px' }}>
          <a href={submission.url} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: '12px', color: '#F97316', textDecoration: 'none' }}>
            {submission.url} ↗
          </a>
        </div>
      )}

      <label style={labelStyle}>Bar name</label>
      <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} />

      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Location</label>
          <input value={location} onChange={e => setLocation(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Country</label>
          <input value={country} onChange={e => setCountry(e.target.value)} style={inputStyle} />
        </div>
      </div>

      <label style={labelStyle}>Link</label>
      <input value={url} onChange={e => setUrl(e.target.value)} style={inputStyle} />

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

      <label style={labelStyle}>Rejection note (optional, only used if you reject)</label>
      <input value={reviewNote} onChange={e => setReviewNote(e.target.value)} style={inputStyle} placeholder="e.g. dead link, duplicate, not football-focused" />

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

function ReadOnlyCard({ submission }: { submission: BarSubmission }) {
  return (
    <div style={{
      border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)',
      borderRadius: '12px', padding: '16px 20px', marginBottom: '12px',
    }}>
      <div style={{ fontSize: '15px', fontWeight: 700 }}>{submission.name}</div>
      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
        {submission.location}{submission.country ? `, ${submission.country}` : ''} · reviewed {submission.reviewed_at ? new Date(submission.reviewed_at).toLocaleDateString('en-GB') : '—'}
      </div>
      {submission.review_note && (
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '6px' }}>Note: {submission.review_note}</div>
      )}
    </div>
  )
}

export default function SubmissionsReview({
  submissions,
  status,
}: {
  submissions: BarSubmission[]
  status: string
}) {
  return (
    <div>
      {submissions.map((s) =>
        status === 'pending' ? (
          <SubmissionCard key={s.id} submission={s} />
        ) : (
          <ReadOnlyCard key={s.id} submission={s} />
        )
      )}
    </div>
  )
}
