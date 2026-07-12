// Shared colour helpers for Terrace.
//
// readableAccent: ensure a club's accent colour is readable on the near-black
// (#0a0a0a) background. Keys off *perceived* brightness so bright-channel colours
// (reds, ambers) are left untouched, while dark navies / near-blacks are lightened
// just enough to read — hue preserved, so e.g. Spurs navy stays blue rather than
// falling back to white.
//
// Server-safe: no 'use client', no React imports. Import from both server
// components (app/[club]/page.tsx) and client components (FanGroupDirectory.tsx).

export function readableAccent(input: string): string {
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
