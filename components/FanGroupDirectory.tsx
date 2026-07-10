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

// Ensure a club's accent colour is readable on the near-black (#0a0a0a) background.
// Keys off *perceived* brightness so bright-channel colours (reds, ambers) are left
// untouched, while dark navies / near-blacks are lightened just enough to read —
// hue preserved, so e.g. Spurs navy stays blue rather than falling back to white.
function readableAccent(input: string): string {
  const raw = String(input).trim().replace(/^#/, '');
  const full = raw.length === 3 ? raw.split('').map(c => c + c).join('') : raw;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return input; // not hex we can parse — leave as-is

  const R = parseInt(full.slice(0, 2), 16);
  const G = parseInt(full.slice(2, 4), 16);
  const B = parseInt(full.slice(4, 6), 16);

  const brightness = (r: number, g: number, b: number) =>
    Math.sqrt(0.299 * r * r + 0.587 * g * g + 0.114 * b * b) / 255;

  const TARGET = 0.42;
  if (brightness(R, G, B) >= TARGET) return `#${full.toLowerCase()}`;

  // rgb -> hsl
  const r0 = R / 255, g0 = G / 255, b0 = B / 255;
  const max = Math.max(r0, g0, b0), min = Math.min(r0, g0, b0), d = max - min;
  let h = 0, s = 0;
  const lHsl = (max + min) / 2;
  if (d !== 0) {
    s = lHsl > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r0: h = (g0 - b0) / d + (g0 < b0 ? 6 : 0); break;
      case g0: h = (b0 - r0) / d + 2; break;
      default: h = (r0 - g0) / d + 4; break;
    }
    h /= 6;
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const toRgb = (l: number): [number, number, number] => {
    if (s === 0) return [l, l, l];
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    return [hue2rgb(p, q, h + 1 / 3), hue2rgb(p, q, h), hue2rgb(p, q, h - 1 / 3)];
  };

  // Raise lightness in small steps until perceived brightness clears the target.
  let l = lHsl;
  let out: [number, number, number] = [r0, g0, b0];
  for (let i = 0; i < 60 && l < 0.9; i++) {
    l += 0.02;
    out = toRgb(l);
    if (brightness(out[0] * 255, out[1] * 255, out[2] * 255) >= TARGET) break;
  }

  const hx = (v: number) =>
    Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, '0');
  return `#${hx(out[0])}${hx(out[1])}${hx(out[2])}`;
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

  // Readable version of the club colour for all foreground/accent uses.
  const accent = readableAccent(clubColor);

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
                fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: accent,
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
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: accent, flexShrink: 0 }} />
                            <span style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>{group.name}</span>
                            <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: accent, opacity: 0.8 }}>
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
        .tg-fan-card:hover { border-color: ${accent}55; background: rgba(255,255,255,0.05); }
        .tg-fan-link:hover { color: ${accent} !important; }
      `}</style>
    </>
  );
}
