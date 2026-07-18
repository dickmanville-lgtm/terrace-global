// Normalizes user-entered Instagram/Facebook/TikTok input into a full URL.
// Accepts: a bare handle ("@theterrace.football" or "theterrace.football"),
// a domain without scheme ("instagram.com/theterrace.football"), or a
// fully-formed URL ("https://instagram.com/theterrace.football") — all
// three should end up pointing at the same place.

type SocialPlatform = 'instagram' | 'facebook' | 'tiktok'

const PLATFORM_DOMAINS: Record<SocialPlatform, RegExp> = {
  instagram: /^(www\.)?instagram\.com/i,
  facebook: /^(www\.)?(facebook|fb)\.com/i,
  tiktok: /^(www\.)?tiktok\.com/i,
}

function buildFromHandle(platform: SocialPlatform, handle: string): string {
  switch (platform) {
    case 'instagram':
      return `https://instagram.com/${handle}`
    case 'facebook':
      return `https://facebook.com/${handle}`
    case 'tiktok':
      // TikTok profile URLs conventionally keep the @ in the path.
      return `https://www.tiktok.com/@${handle}`
  }
}

export function normalizeSocialUrl(platform: SocialPlatform, raw: string): string {
  const v = raw.trim()
  if (!v) return ''

  // Already a full URL — just make sure it has a scheme.
  if (/^https?:\/\//i.test(v)) return v

  // Pasted as a bare domain (e.g. "instagram.com/yourgroup") — add the scheme.
  if (PLATFORM_DOMAINS[platform].test(v)) return `https://${v}`

  // Otherwise treat it as a handle: strip a leading "@", any stray
  // leading slashes, and any trailing slash, then build the platform URL.
  const handle = v.replace(/^@+/, '').replace(/^\/+/, '').replace(/\/+$/, '')
  if (!handle) return ''

  return buildFromHandle(platform, handle)
}

// For single-field cases (e.g. the sports bars "Link" field) where the person
// might paste a real website, a Facebook/Instagram/TikTok URL, a bare domain,
// or just an "@handle" with no platform stated at all. Detects the platform
// from the input itself rather than requiring the caller to already know it.
export function normalizeBarLink(raw: string): string {
  const v = raw.trim()
  if (!v) return ''

  // Already a full URL with a scheme — leave it alone, whatever platform it is.
  if (/^https?:\/\//i.test(v)) return v

  // Bare domain matching a known social platform (e.g. "facebook.com/yourbar") — add the scheme.
  for (const platform of Object.keys(PLATFORM_DOMAINS) as SocialPlatform[]) {
    if (PLATFORM_DOMAINS[platform].test(v)) return `https://${v}`
  }

  // A bare "@handle" carries no platform info by itself — Instagram is the most
  // common convention for venues posting just a handle, so default to that.
  if (v.startsWith('@')) return buildFromHandle('instagram', v.replace(/^@+/, ''))

  // Otherwise assume it's a plain website domain (e.g. "thatbar.com") and add the scheme.
  return `https://${v}`
}
