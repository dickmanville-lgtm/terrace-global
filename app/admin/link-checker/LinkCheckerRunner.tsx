'use client'

import { useState } from 'react'
import Link from 'next/link'
import { runLinkCheckerSweep } from './actions'

type SweepResult = {
  fanGroupsChecked: number
  fanGroupsDeleted: number
  sportsBarsChecked: number
  sportsBarsDeleted: number
  errors: string[]
}

export default function LinkCheckerRunner() {
  const [status, setStatus] = useState<'idle' | 'running' | 'done'>('idle')
  const [result, setResult] = useState<SweepResult | null>(null)

  async function handleRun() {
    setStatus('running')
    const res = await runLinkCheckerSweep()
    setResult(res)
    setStatus('done')
  }

  return (
    <div>
      <button
        onClick={handleRun}
        disabled={status === 'running'}
        style={{
          padding: '12px 20px', borderRadius: '8px', border: 'none',
          background: '#EF4444', color: '#fff', fontWeight: 600, fontSize: '14px',
          cursor: status === 'running' ? 'default' : 'pointer',
          opacity: status === 'running' ? 0.6 : 1,
        }}
      >
        {status === 'running' ? 'Checking links… this may take a few minutes' : 'Run link check now'}
      </button>

      {status === 'done' && result && (
        <div style={{
          marginTop: '24px', padding: '18px 20px', borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)',
          fontSize: '14px', lineHeight: 1.8,
        }}>
          <div>Fan groups checked: <strong>{result.fanGroupsChecked}</strong></div>
          <div>Fan groups removed (no live links): <strong style={{ color: result.fanGroupsDeleted > 0 ? '#F87171' : '#4ADE80' }}>{result.fanGroupsDeleted}</strong></div>
          <div style={{ marginTop: '10px' }}>Sports bars checked: <strong>{result.sportsBarsChecked}</strong></div>
          <div>Sports bars removed (no live link): <strong style={{ color: result.sportsBarsDeleted > 0 ? '#F87171' : '#4ADE80' }}>{result.sportsBarsDeleted}</strong></div>

   {result.errors.length > 0 && (
            <div style={{ marginTop: '14px', color: '#F87171' }}>
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>Errors:</div>
              {result.errors.map((e, i) => <div key={i}>{e}</div>)}
            </div>
          )}

          <div style={{ marginTop: '14px' }}>
            <Link href="/admin/deleted-pins" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
              → Review what was removed
            </Link>
          </div>
        </div>    )}
    </div>
  )
}