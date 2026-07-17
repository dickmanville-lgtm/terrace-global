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
