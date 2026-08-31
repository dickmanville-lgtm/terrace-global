'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export type SportsBar = {
  id: number;
  name: string;
  location: string;
  country: string;
  url: string | null;
  latitude: number;
  longitude: number;
};

export default function SportsBarsMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      // Wide default view — bars can be anywhere in the world, unlike the club map's Europe focus.
      center: [10.0, 30.0],
      zoom: 2,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Fetches only the bars within the map's current bounding box from our
    // viewport-based API route, then swaps them into the existing GeoJSON
    // source in place — no full-table fetch, no source rebuild.
    const fetchAndSetBars = async () => {
      if (!map.current) return;
      const bounds = map.current.getBounds();
      if (!bounds) return;

      const params = new URLSearchParams({
        minLng: String(bounds.getWest()),
        minLat: String(bounds.getSouth()),
        maxLng: String(bounds.getEast()),
        maxLat: String(bounds.getNorth()),
      });

      try {
        const res = await fetch(`/api/sports-bars?${params.toString()}`);
        if (!res.ok) return;
        const json = await res.json();
        const bars: SportsBar[] = json.bars || [];

        const geojson: GeoJSON.FeatureCollection = {
          type: 'FeatureCollection',
          features: bars.map((bar) => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [bar.longitude, bar.latitude] },
            properties: {
              name: bar.name,
              location: bar.location,
              country: bar.country,
              url: bar.url || '',
            },
          })),
        };

        const source = map.current!.getSource('sports-bars') as mapboxgl.GeoJSONSource | undefined;
        source?.setData(geojson);
      } catch {
        // Silent fail — keep whatever pins are already on screen rather than clearing the map.
      }
    };

    map.current.on('load', () => {
      map.current!.addSource('sports-bars', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }, // populated by fetchAndSetBars below
        cluster: true,
        clusterMaxZoom: 11,
        clusterRadius: 45,
      });

      map.current!.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'sports-bars',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#7C2D12',
          'circle-radius': ['step', ['get', 'point_count'], 20, 10, 28, 50, 36, 200, 44],
          'circle-opacity': 0.85,
          'circle-stroke-width': 1,
          'circle-stroke-color': 'rgba(255,255,255,0.2)',
        },
      });

      map.current!.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'sports-bars',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-size': 13,
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        },
        paint: { 'text-color': '#ffffff' },
      });

      map.current!.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'sports-bars',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#F97316',
          'circle-radius': 8,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      });

      map.current!.on('click', 'unclustered-point', (e) => {
        if (!e.features || !e.features.length) return;
        const props = e.features[0].properties!;
        const coords = (e.features[0].geometry as GeoJSON.Point).coordinates.slice() as [number, number];

        const linkButton = props.url
          ? `<button onclick="window.open('${props.url}','_blank','noopener,noreferrer')" style="background:#F97316;color:#fff;border:none;padding:6px 12px;font-size:13px;font-weight:600;cursor:pointer;border-radius:4px;margin-top:8px">
              Visit page &rarr;</button>`
          : `<span style="font-size:11px;color:#888">No link listed yet</span>`;

        new mapboxgl.Popup({ offset: 20 })
          .setLngLat(coords)
          .setHTML(
            `<div style="font-family:sans-serif;padding:4px 6px">
              <strong style="font-size:14px">${props.name}</strong><br/>
              <span style="font-size:12px;color:#aaa">${props.location}, ${props.country}</span><br/>
              ${linkButton}
            </div>`
          )
          .addTo(map.current!);
      });

      map.current!.on('click', 'clusters', (e) => {
        const features = map.current!.queryRenderedFeatures(e.point, { layers: ['clusters'] });
        const clusterId = features[0].properties!.cluster_id;
        (map.current!.getSource('sports-bars') as mapboxgl.GeoJSONSource).getClusterExpansionZoom(
          clusterId,
          (err, zoom) => {
            if (err) return;
            map.current!.easeTo({
              center: (features[0].geometry as GeoJSON.Point).coordinates as [number, number],
              zoom: zoom!,
            });
          }
        );
      });

      map.current!.on('mouseenter', 'unclustered-point', () => { map.current!.getCanvas().style.cursor = 'pointer'; });
      map.current!.on('mouseleave', 'unclustered-point', () => { map.current!.getCanvas().style.cursor = ''; });
      map.current!.on('mouseenter', 'clusters', () => { map.current!.getCanvas().style.cursor = 'pointer'; });
      map.current!.on('mouseleave', 'clusters', () => { map.current!.getCanvas().style.cursor = ''; });

      // Initial load — fetch bars for the default world view.
      fetchAndSetBars();
    });

    // Refetch on pan/zoom, debounced so a drag doesn't fire a request per frame.
    map.current.on('moveend', () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(fetchAndSetBars, 300);
    });

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      map.current?.remove();
      map.current = null;
    };
  }, []);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim() || !map.current) return;

    setSearching(true);
    setSearchError('');

    try {
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${token}&limit=1`
      );
      const json = await res.json();

      if (!json.features || json.features.length === 0) {
        setSearchError('Place not found');
        setSearching(false);
        return;
      }

      const [lng, lat] = json.features[0].center;

      // Choose a reasonable zoom based on the type of place returned —
      // countries/regions get a wider view than cities or addresses.
      const placeType = json.features[0].place_type?.[0];
      const zoom = placeType === 'country' ? 4 : placeType === 'region' ? 6 : 10;

      map.current.flyTo({ center: [lng, lat], zoom, duration: 1200 });
      setSearching(false);
    } catch {
      setSearchError('Search failed');
      setSearching(false);
    }
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <form
        onSubmit={handleSearch}
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          zIndex: 10,
          display: 'flex',
          gap: 6,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          padding: 6,
          borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search country, city, region..."
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 6,
            padding: '8px 10px',
            fontSize: 13,
            color: '#fff',
            width: 220,
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={searching}
          style={{
            background: '#F97316',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '8px 14px',
            fontSize: 13,
            fontWeight: 600,
            cursor: searching ? 'default' : 'pointer',
            opacity: searching ? 0.6 : 1,
          }}
        >
          {searching ? '...' : 'Go'}
        </button>
      </form>

      {searchError && (
        <div
          style={{
            position: 'absolute',
            top: 56,
            left: 12,
            zIndex: 10,
            background: 'rgba(220,38,38,0.9)',
            color: '#fff',
            fontSize: 12,
            padding: '6px 10px',
            borderRadius: 6,
          }}
        >
          {searchError}
        </div>
      )}

      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}