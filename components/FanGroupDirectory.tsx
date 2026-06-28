'use client'

import { useState } from 'react'

export type FanGroupRow = {
  name: string;
  city: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  url: string;
  description: string | null;
  region: string | null;
  type: string | null;
  instagram_url?: string | null;
  facebook_url?: string | null;
  tiktok_url?: string | null;
};

function typeLabel(type: string | null) {
  if (type === 'community') return 'Fan community';
  if (type === 'fan_bar') return 'Fan bar';
  return 'Supporter club';
}

const linkStyle: React.CSSProperties = {
  fontSize: '12px',
  color: 'rgba(255,255,255,0.45)',
  textDecoration: 'none',
};

export default function FanGroupDirectory({
  groups,
  clubColor,
}: {
  groups: FanGroupRow[];
  clubColor: string;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const regionMap = new Map<string, FanGroupRow[]>();
  for (const g of groups) {
    const region = g.region || 'More worldwide';
    if (!regionMap.has(region)) regionMap.set(region, []);
    regionMap.get(region)!.push(g);
  }
  const regionOrder = Array.from(regionMap.keys()).sort((a, b) => {
    if (a === 'United Kingdom') return -1;
    if (b === 'United Kingdom') return 1;
    if (a === 'More worldwide') return 1;
    if (b === 'More worldwide') return -1;
    return a.localeCompare(b);
  });

  return (
    <>
      {regionOrder.map(region => {
        const isOpen = !!expanded[region];
        const count = regionMap.get(region)!.length;
        return (
          <div key={region} style={{ marginBottom: '16px' }}>
            <button
              onClick={() => setExpanded(prev => ({ ...prev, [region]: !prev[region] }))}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
                background: 'transparent', border: 'none', cursor: 'pointer', padding: '12px 0',
                borderBottom: '1px solid rgba(108,171,221,0.2)',
              }}
            >
              <span style={{
                fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: clubColor,
              }}>
                {region} <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400, letterSpacing: 'normal', textTransform: 'none' }}>({count})</span>
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
                {regionMap.get(region)!.map(group => {
                  const links: { label: string; href: string }[] = [];
                  if (group.url) links.push({ label: 'Website', href: group.url });
                  if (group.instagram_url) links.push({ label: 'Instagram', href: group.instagram_url });
                  if (group.facebook_url) links.push({ label: 'Facebook', href: group.facebook_url });
                  if (group.tiktok_url) links.push({ label: 'TikTok', href: group.tiktok_url });

                  return (
                    <div
                      key={group.name}
                      className="tg-fan-card"
                      style={{
                        display: 'block', background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '16px 20px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: clubColor, flexShrink: 0 }} />
                            <span style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>{group.name}</span>
                            <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: clubColor, opacity: 0.8 }}>
                              {typeLabel(group.type)}
                            </span>
                          </div>
                          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginBottom: links.length > 0 ? '10px' : 0 }}>
                            {group.city ? `${group.city} · ${group.country}` : group.country}
                          </div>
                          {links.length > 0 && (
                            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                              {links.map(l => (
                                <a
                                  key={l.label}
                                  href={l.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="tg-fan-link"
                                  style={linkStyle}
                                >
                                  {l.label} →
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      <style>{`
        .tg-fan-card { transition: border-color 0.15s, background 0.15s; }
        .tg-fan-card:hover { border-color: ${clubColor}55; background: rgba(255,255,255,0.05); }
        .tg-fan-link:hover { color: ${clubColor} !important; }
      `}</style>
    </>
  );
}
