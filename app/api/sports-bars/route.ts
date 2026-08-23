import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const revalidate = 0; // always fresh — this is a live viewport query, not a cached page

const RESULTS_LIMIT = 3000;

type BarRow = {
  id: number;
  name: string;
  location: string | null;
  country: string | null;
  url: string | null;
  latitude: string | null;
  longitude: string | null;
};

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const minLng = parseFloat(params.get('minLng') || '');
  const minLat = parseFloat(params.get('minLat') || '');
  const maxLng = parseFloat(params.get('maxLng') || '');
  const maxLat = parseFloat(params.get('maxLat') || '');

  if ([minLng, minLat, maxLng, maxLat].some((n) => isNaN(n))) {
    return NextResponse.json(
      { error: 'minLng, minLat, maxLng, maxLat query params are all required and must be numbers' },
      { status: 400 }
    );
  }

  // Base query — same "only show bars with working links" rule as the old full-table fetch.
  let query = supabase
    .from('sports_bars')
    .select('id, name, location, country, url, latitude, longitude')
    .neq('link_status', 'pending_removal')
    .not('url', 'is', null)
    .gte('latitude', minLat)
    .lte('latitude', maxLat)
    .limit(RESULTS_LIMIT);

  // Antimeridian case: when the map view wraps from +180 to -180 (e.g. panning across
  // the Pacific — NZ/Fiji/Hawaii), Mapbox reports minLng > maxLng. A normal BETWEEN
  // filter would then match nothing, so switch to an OR across the wrap point instead.
  if (minLng > maxLng) {
    query = query.or(`longitude.gte.${minLng},longitude.lte.${maxLng}`);
  } else {
    query = query.gte('longitude', minLng).lte('longitude', maxLng);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Supabase returns `numeric` columns as strings — convert back to numbers for Mapbox.
  const bars = (data as BarRow[] || [])
    .map((b) => ({
      id: b.id,
      name: b.name,
      location: b.location || '',
      country: b.country || '',
      url: b.url,
      latitude: Number(b.latitude),
      longitude: Number(b.longitude),
    }))
    .filter((b) => !isNaN(b.latitude) && !isNaN(b.longitude));

  return NextResponse.json({ bars, capped: bars.length === RESULTS_LIMIT });
}