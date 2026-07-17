// Maps a free-text country string to one of the site's fixed region values.
// Used to auto-suggest a region on the submissions review page so the admin
// isn't picking it manually for every row — it's still an editable dropdown,
// this just saves the click in the common case.
//
// Valid regions (must match the fan_groups region enum / REGIONS list):
// 'United Kingdom', 'Ireland', 'Europe', 'North America', 'South America',
// 'Africa', 'Asia', 'Australia & New Zealand', 'More worldwide'

const REGION_BY_COUNTRY: Record<string, string> = {
  // United Kingdom
  'united kingdom': 'United Kingdom',
  'uk': 'United Kingdom',
  'great britain': 'United Kingdom',
  'england': 'United Kingdom',
  'scotland': 'United Kingdom',
  'wales': 'United Kingdom',
  'northern ireland': 'United Kingdom',

  // Ireland
  'ireland': 'Ireland',
  'republic of ireland': 'Ireland',

  // Europe
  'france': 'Europe', 'germany': 'Europe', 'spain': 'Europe', 'italy': 'Europe',
  'portugal': 'Europe', 'netherlands': 'Europe', 'holland': 'Europe', 'belgium': 'Europe',
  'switzerland': 'Europe', 'austria': 'Europe', 'sweden': 'Europe', 'norway': 'Europe',
  'denmark': 'Europe', 'finland': 'Europe', 'iceland': 'Europe', 'poland': 'Europe',
  'czech republic': 'Europe', 'czechia': 'Europe', 'greece': 'Europe', 'turkey': 'Europe',
  'russia': 'Europe', 'ukraine': 'Europe', 'croatia': 'Europe', 'serbia': 'Europe',
  'romania': 'Europe', 'hungary': 'Europe', 'luxembourg': 'Europe', 'malta': 'Europe',
  'cyprus': 'Europe', 'bulgaria': 'Europe', 'slovakia': 'Europe', 'slovenia': 'Europe',
  'estonia': 'Europe', 'latvia': 'Europe', 'lithuania': 'Europe',
  'bosnia and herzegovina': 'Europe', 'bosnia': 'Europe', 'albania': 'Europe',
  'montenegro': 'Europe', 'north macedonia': 'Europe', 'kosovo': 'Europe',
  'belarus': 'Europe', 'moldova': 'Europe', 'georgia': 'Europe', 'armenia': 'Europe',
  'azerbaijan': 'Europe', 'andorra': 'Europe', 'monaco': 'Europe',
  'liechtenstein': 'Europe', 'san marino': 'Europe', 'vatican city': 'Europe',

  // North America
  'united states': 'North America', 'united states of america': 'North America',
  'usa': 'North America', 'us': 'North America', 'canada': 'North America',
  'mexico': 'North America',

  // South America
  'brazil': 'South America', 'argentina': 'South America', 'chile': 'South America',
  'colombia': 'South America', 'peru': 'South America', 'uruguay': 'South America',
  'paraguay': 'South America', 'ecuador': 'South America', 'bolivia': 'South America',
  'venezuela': 'South America',

  // Africa
  'south africa': 'Africa', 'nigeria': 'Africa', 'kenya': 'Africa', 'egypt': 'Africa',
  'morocco': 'Africa', 'ghana': 'Africa', 'ethiopia': 'Africa', 'tanzania': 'Africa',
  'uganda': 'Africa', 'algeria': 'Africa', 'tunisia': 'Africa', 'senegal': 'Africa',
  'cameroon': 'Africa', 'ivory coast': 'Africa', "cote d'ivoire": 'Africa',

  // Asia
  'china': 'Asia', 'japan': 'Asia', 'south korea': 'Asia', 'india': 'Asia',
  'indonesia': 'Asia', 'thailand': 'Asia', 'vietnam': 'Asia', 'philippines': 'Asia',
  'malaysia': 'Asia', 'singapore': 'Asia', 'pakistan': 'Asia', 'bangladesh': 'Asia',
  'saudi arabia': 'Asia', 'united arab emirates': 'Asia', 'uae': 'Asia', 'qatar': 'Asia',
  'israel': 'Asia', 'hong kong': 'Asia', 'taiwan': 'Asia', 'sri lanka': 'Asia',
  'nepal': 'Asia', 'kuwait': 'Asia', 'bahrain': 'Asia', 'oman': 'Asia',

  // Australia & New Zealand
  'australia': 'Australia & New Zealand', 'new zealand': 'Australia & New Zealand',
}

/**
 * Returns the best-guess region for a given free-text country, or ''
 * if nothing matches (falls through to 'More worldwide' being picked
 * manually, rather than silently guessing wrong).
 */
export function regionForCountry(country: string): string {
  const key = country.trim().toLowerCase()
  if (!key) return ''
  return REGION_BY_COUNTRY[key] || ''
}
