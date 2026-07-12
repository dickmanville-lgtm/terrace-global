'use client'

import { useState } from 'react'
import PublicSubmitFanGroupForm from './PublicSubmitFanGroupForm'

export default function AddGroupPill({
  clubId,
  clubSlug,
  clubName,
  accentColor = '#EF4444',
  label = 'Add your group',
  variant = 'button', // 'button' (hero-style pill) | 'link' (understated text link)
}: {
  clubId: number
  clubSlug: string
  clubName: string
  accentColor?: string
  label?: string
  variant?: 'button' | 'link'
}) {
  const [open, setOpen] = useState(false)

  const buttonStyle: React.CSSProperties = variant === 'button'
    ? {
        borderRadius: '8px', padding: '11px 22px', fontSize: '14px', fontWeight: 500,
        background: 'transparent', color: 'rgba(255,255,255,0.7)',
        border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer',
      }
    : {
        display: 'inline-block', background: accentColor, color: '#fff', borderRadius: '7px',
        padding: '9px 20px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer',
      }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} style={buttonStyle}>
        {label}
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px',
              padding: '28px', maxWidth: '480px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
              position: 'relative',
            }}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              style={{
                position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none',
                color: 'rgba(255,255,255,0.4)', fontSize: '20px', cursor: 'pointer', lineHeight: 1,
              }}
            >
              ×
            </button>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px', paddingRight: '24px' }}>
              Add your {clubName} group
            </h3>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>
              We&apos;ll review it and add it to the directory.
            </p>
            <PublicSubmitFanGroupForm
              clubId={clubId}
              clubSlug={clubSlug}
              clubName={clubName}
              accentColor={accentColor}
            />
          </div>
        </div>
      )}
    </>
  )
}
