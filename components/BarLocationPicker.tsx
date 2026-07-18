'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function BarLocationPicker({
  searchHint,
  latitude,
  longitude,
  onLocationChange,
}: {
  searchHint: string;
  latitude: string;
  longitude: string;
  onLocationChange: (lat: string, lng: string) => void;
}) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'notfound' | 'error'>('idle');

  function placeMarker(lng: number, lat: number, flyIn: boolean) {
    if (!map.current) return;
    if (marker.current) {
      marker.current.setLngLat([lng, lat]);
    } else {
      marker.current = new mapboxgl.Marker({ color: '#F97316', draggable: true })
        .setLngLat([lng, lat])
        .addTo(map.current);
      marker.current.on('dragend', () => {
        const pos = marker.current!.getLngLat();
        onLocationChange(pos.lat.toFixed(6), pos.lng.toFixed(6));
      });
    }
    if (flyIn) map.current.flyTo({ center: [lng, lat], zoom: 15 });
  }

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    const hasInitial = latitude && longitude;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: hasInitial ? [parseFloat(longitude), parseFloat(latitude)] : [10, 45],
      zoom: hasInitial ? 14 : 3,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      if (hasInitial) placeMarker(parseFloat(longitude), parseFloat(latitude), false);
    });

    map.current.on('click', (e) => {
      placeMarker(e.lngLat.lng, e.lngLat.lat, false);
      onLocationChange(e.lngLat.lat.toFixed(6), e.lngLat.lng.toFixed(6));
    });

    return () => { map.current?.remove(); map.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSearch() {
    const q = query.trim() || searchHint;
    if (!q) return;
    setStatus('loading');
    try {
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json?access_token=${token}&limit=1`
      );
      const data = await res.json();
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        placeMarker(lng, lat, true);
        onLocationChange(lat.toFixed(6), lng.toFixed(6));
        setStatus('idle');
      } else {
        setStatus('notfound');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSearch(); } }}
          placeholder={searchHint ? `Search, or leave blank to search "${searchHint}"` : 'Search for the bar or address'}
          style={{
            flex: 1, padding: '10px 12px', borderRadius: '8px', boxSizing: 'border-box',
            border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)',
            color: '#fff', fontSize: '13px',
          }}
        />
        <button type="button" onClick={handleSearch} style={{
          padding: '10px 16px', borderRadius: '8px', border: 'none',
          background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap',
        }}>
          Search
        </button>
      </div>
      {status === 'notfound' && (
        <p style={{ fontSize: '12px', color: '#F97316', marginBottom: '8px' }}>No match — click the map below to drop a pin instead.</p>
      )}
      {status === 'error' && (
        <p style={{ fontSize: '12px', color: '#EF4444', marginBottom: '8px' }}>Search failed — click the map below to drop a pin instead.</p>
      )}
      <div ref={mapContainer} style={{ width: '100%', height: '220px', borderRadius: '8px', overflow: 'hidden' }} />
      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '6px' }}>
        Click the map to drop a pin, or drag it once placed to fine-tune.
      </p>
    </div>
  );
}
