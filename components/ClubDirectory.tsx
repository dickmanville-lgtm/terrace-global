'use client'

import { useState } from 'react'
import Link from 'next/link'

export type ClubRow = {
  id: number;
  name: string | null;
  club: string | null;
  slug: string;
  country: string | null;
};

const accent = '#6CABDD';

export default function ClubDirectory({ clubs }: { clubs: ClubRow[] }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const countryMap = new Map<string, ClubRow[]>();
  for (const c of clubs) {
    const country = c.country || 'Other';
    if (!countryMap.has(country)) countryMap.set(country, []);
    countryMap.get(country)!.push(c);
  }
 const homeNations = ['England', 'Scotland', 'Wales'];
const countryOrder = Array.from(countryMap.keys()).sort((a, b) => {
  const aIndex = homeNations.indexOf(a);
  const bIndex = homeNations.indexOf(b);
  if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
  if (aIndex !== -1) return -1;
  if (bIndex !== -1) return 1;
  return a.localeCompare(b);
});

  return (
    <>
      {countryOrder.map(country => {
        const isOpen = !!expanded[country];
        const count = countryMap.get(country)!.length;
        return (
          <div key={country} style={{ marginBottom: '16px' }}>
            <button
              onClick={() => setExpanded(prev => ({ ...prev, [country]: !prev[country] }))}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
                background: 'transparent', border: 'none', cursor: 'pointer', padding: '12px 0',
                borderBottom: '1px solid rgba(108,171,221,0.2)',
              }}
            >
              <span style={{
                fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: accent,
              }}>
                {country} <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400, letterSpacing: 'normal', textTransform: 'none' }}>({count})</span>
              </span>
              <span style={{
                color: 'rgba(255,255,255,0.4)', fontSize: '14px',
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.15s',
                display: 'inline-block',
              }}>
                ▾
              </span>
            </button>

            {isOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                {countryMap.get(country)!.map(club => (
                  <Link
                    key={club.id}
                    href={`/club-map/${club.slug}`}
                    className="tg-club-card"
                    style={{
                      display: 'block', textDecoration: 'none', background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '16px 20px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: accent, flexShrink: 0 }} />
                      <span style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>{club.club || club.name}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
                      {club.name}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <style>{`
        .tg-club-card { transition: border-color 0.15s, background 0.15s; }
        .tg-club-card:hover { border-color: ${accent}55; background: rgba(255,255,255,0.05); }
      `}</style>
    </>
  );
}