'use client'

import { useState } from 'react'
import { bulkCreateSportsBars } from './actions'

type ParsedRow = {
  name: string
  location: string
  country: string
  url: string
  latitude: string
  longitude: string
  issues: string[]
}

function parseCSV(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const next = text[i + 1]
    if (inQuotes) {
      if (char === '"' && next === '"') { field += '"'; i++ }
      else if (char === '"') { inQuotes = false }
      else { field += char }
    } else {
      if (char === '"') { inQuotes = true }
      else if (char === ',') { row.push(field); field = '' }
      else if (char === '\n') { row.push(field); rows.push(row); row = []; field = '' }
      else if (char === '\r') { /* skip */ }
      else { field += char }
    }
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row) }
  return rows.filter(r => r.some(c => c.trim() !== ''))
}

function validateRow(r: Record<string, string>): string[] {
  const issues: string[] = []
  if (!r.name || !r.name.trim()) issues.push('Missing name')
  if (!r.location || !r.location.trim()) issues.push('Missing location')
  if (!r.country || !r.country.trim()) issues.push('Missing country')
  if (!r.url || !r.url.trim()) issues.push('Missing url')
  if (!r.latitude || isNaN(parseFloat(r.latitude))) issues.push('Missing or invalid latitude')
  if (!r.longitude || isNaN(parseFloat(r.longitude))) issues.push('Missing or invalid longitude')
  return issues
}

export default function BulkUploadForm() {
  const [csvText, setCsvText] = useState('')
  const [parsed, setParsed] = useState<ParsedRow[]>([])
  const [stage, setStage] = useState<'input' | 'preview' | 'submitting' | 'done'>('input')
  const [resultMessage, setResultMessage] = useState('')
  const [parseError, setParseError] = useState('')

  function handlePreview() {
    setParseError('')
    const grid = parseCSV(csvText)
    if (grid.length < 2) {
      setParseError('Could not find a header row plus at least one data row.')
      return
    }
    const headers = grid[0].map(h => h.trim().toLowerCase())
    const required = ['name', 'location', 'country', 'url', 'latitude', 'longitude']
    const missing = required.filter(col => !headers.includes(col))
    if (missing.length > 0) {
      setParseError(`Missing column(s): ${missing.join(', ')}`)
      return
    }

    const rows: ParsedRow[] = grid.slice(1).map(line => {
      const obj: Record<string, string> = {}
      headers.forEach((h, idx) => { obj[h] = (line[idx] || '').trim() })
      const issues = validateRow(obj)
      return {
        name: obj.name, location: obj.location, country: obj.country,
        url: obj.url || '', latitude: obj.latitude, longitude: obj.longitude, issues,
      }
    })

    setParsed(rows)
    setStage('preview')
  }

  async function handleConfirm() {
    setStage('submitting')
    const validRows = parsed.filter(r => r.issues.length === 0)
    const result = await bulkCreateSportsBars(validRows)

    if (result.success) {
      let msg = `Added ${result.inserted} sports bar${result.inserted === 1 ? '' : 's'}.`
      if (result.skipped.length > 0) {
        msg += ` Skipped ${result.skipped.length}: ${result.skipped.map(s => `row ${s.row} (${s.reason})`).join(', ')}`
      }
      setResultMessage(msg)
    } else {
      setResultMessage(`Error: ${result.error}`)
    }
    setStage('done')
  }

  function handleReset() {
    setCsvText('')
    setParsed([])
    setStage('input')
    setResultMessage('')
    setParseError('')
  }

  const validCount = parsed.filter(r => r.issues.length === 0).length
  const errorCount = parsed.length - validCount

  return (
    <div>
      {stage === 'input' && (
        <>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '12px', lineHeight: 1.6 }}>
            Paste CSV with these columns (any order): <code style={{ color: 'rgba(255,255,255,0.7)' }}>name, location, country, url, latitude, longitude</code>
          </p>
          <textarea
            value={csvText}
            onChange={e => setCsvText(e.target.value)}
            placeholder="name,location,country,url,latitude,longitude"
            style={{
              width: '100%', minHeight: '220px', padding: '12px', borderRadius: '8px', boxSizing: 'border-box',
              border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)',
              color: '#fff', fontSize: '13px', fontFamily: 'monospace', marginBottom: '16px', resize: 'vertical',
            }}
          />
          {parseError && <p style={{ color: '#EF4444', fontSize: '13px', marginBottom: '12px' }}>{parseError}</p>}
          <button onClick={handlePreview} style={{
            padding: '12px 20px', borderRadius: '8px', border: 'none',
            background: '#EF4444', color: '#fff', fontWeight: 600, fontSize: '14px', cursor: 'pointer',
          }}>
            Preview
          </button>
        </>
      )}

      {stage === 'preview' && (
        <>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>
            {validCount} row{validCount === 1 ? '' : 's'} ready to add
            {errorCount > 0 && <span style={{ color: '#EF4444' }}> · {errorCount} row{errorCount === 1 ? '' : 's'} with problems (won&apos;t be added)</span>}
          </p>
          <div style={{ overflowX: 'auto', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                  {['#', 'Name', 'Location', 'Country', 'Lat/Long', 'Issues'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 10px', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parsed.map((r, i) => {
                  const hasError = r.issues.length > 0
                  return (
                    <tr key={i} style={{ background: hasError ? 'rgba(239,68,68,0.08)' : 'transparent', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <td style={{ padding: '8px 10px', color: 'rgba(255,255,255,0.4)' }}>{i + 1}</td>
                      <td style={{ padding: '8px 10px' }}>{r.name}</td>
                      <td style={{ padding: '8px 10px', color: 'rgba(255,255,255,0.6)' }}>{r.location}</td>
                      <td style={{ padding: '8px 10px', color: 'rgba(255,255,255,0.6)' }}>{r.country}</td>
                      <td style={{ padding: '8px 10px', color: 'rgba(255,255,255,0.6)' }}>{r.latitude}, {r.longitude}</td>
                      <td style={{ padding: '8px 10px', color: hasError ? '#F87171' : 'rgba(255,255,255,0.4)' }}>
                        {r.issues.join('; ') || '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={handleReset} style={{
              padding: '12px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)',
              background: 'transparent', color: 'rgba(255,255,255,0.7)', fontSize: '14px', cursor: 'pointer',
            }}>
              Start over
            </button>
            <button onClick={handleConfirm} disabled={validCount === 0} style={{
              padding: '12px 20px', borderRadius: '8px', border: 'none',
              background: '#EF4444', color: '#fff', fontWeight: 600, fontSize: '14px',
              cursor: validCount === 0 ? 'default' : 'pointer', opacity: validCount === 0 ? 0.5 : 1,
            }}>
              Add {validCount} sports bar{validCount === 1 ? '' : 's'}
            </button>
          </div>
        </>
      )}

      {stage === 'submitting' && (
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>Adding…</p>
      )}

      {stage === 'done' && (
        <>
          <p style={{ color: resultMessage.startsWith('Error') ? '#EF4444' : '#4ADE80', fontSize: '14px', marginBottom: '20px', lineHeight: 1.6 }}>
            {resultMessage}
          </p>
          <button onClick={handleReset} style={{
            padding: '12px 20px', borderRadius: '8px', border: 'none',
            background: '#EF4444', color: '#fff', fontWeight: 600, fontSize: '14px', cursor: 'pointer',
          }}>
            Upload another batch
          </button>
        </>
      )}
    </div>
  )
}
