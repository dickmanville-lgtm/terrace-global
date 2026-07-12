'use client'

import { useState } from 'react'
import AddGroupPill from './AddGroupPill'

export default function HeroActionButtons({
  clubColor,
  clubId,
  clubSlug,
  clubName,
}: {
  clubColor: string
  clubId: number
  clubSlug: string
  clubName: string
}) {
  const [active, setActive] = useState<'region' | 'map'>('region')

  const base: React.CSSProperties = {
    borderRadius: '8px',
    padding: '11px 22px',
    fontSize: '14px',
    textDecoration: 'none',
    display: 'inline-block',
    transition: 'background 0.15s, color 0.15s, border-color 0.15s',
  }

  function styleFor(key: 'region' | 'map'): React.CSSProperties {
    const isActive = active === key
    return {
      ...base,
      fontWeight: isActive ? 600 : 500,
      background: isActive ? clubColor : 'transparent',
      color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
      border: isActive ? 'none' : '1px solid rgba(255,255,255,0.15)',
    }
  }

  return (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <a href="#directory" onClick={() => setActive('region')} style={styleFor('region')}>
        Select by region
      </a>
      <a href="#map" onClick={() => setActive('map')} style={styleFor('map')}>
        View on map
      </a>
      <AddGroupPill
        clubId={clubId}
        clubSlug={clubSlug}
        clubName={clubName}
        accentColor={clubColor}
        variant="button"
      />
    </div>
  )
}
