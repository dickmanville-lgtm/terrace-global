'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiZ29vbmVybWFudmlsbGUiLCJhIjoiY21xNDN6YTZhMHRmdDJyc2F5d3hmM3M0OCJ9.s1SS4ivx-suzfsajowJPyA';

const FAN_GROUPS = [
  { id: 1, type: 'community', name: 'Gooners NYC', city: 'New York', lat: 40.7128, lng: -74.006, members: 340 },
  { id: 2, type: 'community', name: 'Arsenal Tokyo', city: 'Tokyo', lat: 35.6762, lng: 139.6503, members: 210 },
  { id: 3, type: 'community', name: 'Red Army Sydney', city: 'Sydney', lat: -33.8688, lng: 151.2093, members: 180 },
  { id: 4, type: 'community', name: 'Gooners Berlin', city: 'Berlin', lat: 52.52, lng: 13.405, members: 155 },
  { id: 5, type: 'community', name: 'Arsenal São Paulo', city: 'São Paulo', lat: -23.5505, lng: -46.6333, members: 290 },
  { id: 6, type: 'community', name: 'Arsenal Cape Town', city: 'Cape Town', lat: -33.9249, lng: 18.4241, members: 120 },
  { id: 7, type: 'community', name: 'Arsenal Dubai', city: 'Dubai', lat: 25.2048, lng: 55.2708, members: 200 },
  { id: 8, type: 'community', name: 'Gooners Paris', city: 'Paris', lat: 48.8566, lng: 2.3522, members: 175 },
  { id: 9, type: 'community', name: 'Arsenal Mumbai', city: 'Mumbai', lat: 19.076, lng: 72.8777, members: 310 },
  { id: 10, type: 'community', name: 'Arsenal Toronto', city: 'Toronto', lat: 43.6532, lng: -79.3832, members: 245 },
  { id: 11, type: 'supporter_club', name: 'AISA New York', city: 'New York', lat: 40.73, lng: -73.99, members: 500 },
  { id: 12, type: 'supporter_club', name: 'AISA Los Angeles', city: 'Los Angeles', lat: 34.0522, lng: -118.2437, members: 420 },
  { id: 13, type: 'supporter_club', name: 'AISA Singapore', city: 'Singapore', lat: 1.3521, lng: 103.8198, members: 380 },
  { id: 14, type: 'supporter_club', name: 'AISA Melbourne', city: 'Melbourne', lat: -37.8136, lng: 144.9631, members: 290 },
  { id: 15, type: 'supporter_club', name: 'AISA Amsterdam', city: 'Amsterdam', lat: 52.3676, lng: 4.9041, members: 195 },
  { id: 16, type: 'fan_bar', name: 'Blind Pig Arsenal Bar', city: 'New York', lat: 40.745, lng: -73.988, members: null },
  { id: 17, type: 'fan_bar', name: 'The Gooner Bar', city: 'Los Angeles', lat: 34.06, lng: -118.26, members: null },
  { id: 18, type: 'fan_bar', name: 'Penalty Box', city: 'Chicago', lat: 41.8781, lng: -87.6298, members: null },
  { id: 19, type: 'fan_bar', name: 'The Emirates Arms', city: 'Melbourne', lat: -37.82, lng: 144.97, members: null },
  { id: 20, type: 'fan_bar', name: 'Cannon Bar', city: 'Singapore', lat: 1.36, lng: 103.83, members: null },
  { id: 21, type: 'fan_bar', name: 'Red & White Tavern', city: 'Toronto', lat: 43.66, lng: -79.39, members: null },
  { id: 22, type: 'fan_bar', name: 'Highbury House', city: 'Dublin', lat: 53.3498, lng: -6.2603, members: null },
  { id: 23, type: 'community', name: 'Arsenal Mexico City', city: 'Mexico City', lat: 19.4326, lng: -99.1332, members: 220 },
  { id: 24, type: 'community', name: 'Gooners Lagos', city: 'Lagos', lat: 6.5244, lng: 3.3792, members: 190 },
  { id: 25, type: 'supporter_club', name: 'AISA Johannesburg', city: 'Johannesburg', lat: -26.2041, lng: 28.0473, members: 160 },
  { id: 26, type: 'community', name: 'Arsenal Bangkok', city: 'Bangkok', lat: 13.7563, lng: 100.5018, members: 280 },
  { id: 27, type: 'fan_bar', name: 'The Cannon', city: 'Hong Kong', lat: 22.3193, lng: 114.1694, members: null },
  { id: 28, type: 'community', name: 'Gooners Stockholm', city: 'Stockholm', lat: 59.3293, lng: 18.0686, members: 140 },
  { id: 29, type: 'supporter_club', name: 'AISA Madrid', city: 'Madrid', lat: 40.4168, lng: -3.7038, members: 210 },
  { id: 30, type: 'fan_bar', name: 'Emirates Sports Bar', city: 'Nairobi', lat: -1.2921, lng: 36.8219, members: null },
];

const TYPE_COLORS: Record<string, string> = {
  community: '#EF4444',
  supporter_club: '#FFFFFF',
  fan_bar: '#F97316',
};

const TYPE_LABELS: Record<string, string> = {
  community: 'Fan community',
  supporter_club: 'Supporter club',
  fan_bar: 'Fan bar',
};

type FilterType = 'all' | 'community' | 'supporter_club' | 'fan_bar';

export default function FanMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const popup = useRef<mapboxgl.Popup | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [loaded, setLoaded] = useState(false);

  const buildGeoJSON = (activeFilter: FilterType): GeoJSON.FeatureCollection => ({
    type: 'FeatureCollection',
    features: FAN_GROUPS
      .filter(g => activeFilter === 'all' || g.type === activeFilter)
      .map(g => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [g.lng, g.lat] },
        properties: {
          id: g.id,
          name: g.name,
          type: g.type,
          city: g.city,
          members: g.members,
          color: TYPE_COLORS[g.type],
        },
      })),
  });

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [10, 25],
      zoom: 1.8,
      minZoom: 1,
      maxZoom: 16,
      attributionControl: false,
    });

    map.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');

    map.current.on('load', () => {
      const m = map.current!;

      m.addSource('fans', {
        type: 'geojson',
        data: buildGeoJSON('all'),
        cluster: true,
        clusterMaxZoom: 8,
        clusterRadius: 50,
      });

      m.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'fans',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#EF4444',
          'circle-radius': ['step', ['get', 'point_count'], 20, 5, 28, 20, 36],
          'circle-opacity': 0.9,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-opacity': 0.3,
        },
      });

      m.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'fans',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 13,
        },
        paint: { 'text-color': '#ffffff' },
      });

      m.addLayer({
        id: 'fan-pins',
        type: 'circle',
        source: 'fans',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': ['get', 'color'],
          'circle-radius': 7,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#000000',
          'circle-opacity': 0.95,
        },
      });

      setLoaded(true);

      m.on('click', 'clusters', (e) => {
        const features = m.queryRenderedFeatures(e.point, { layers: ['clusters'] });
        const clusterId = features[0].properties?.cluster_id;
        (m.getSource('fans') as mapboxgl.GeoJSONSource).getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;
          const coords = (features[0].geometry as GeoJSON.Point).coordinates as [number, number];
          m.easeTo({ center: coords, zoom: zoom! + 0.5, duration: 600 });
        });
      });

      m.on('click', 'fan-pins', (e) => {
        const feature = e.features?.[0];
        if (!feature) return;
        const props = feature.properties!;
        const coords = (feature.geometry as GeoJSON.Point).coordinates as [number, number];
        if (popup.current) popup.current.remove();
        const membersLine = props.members ? `<div class="tg-popup-meta">${Number(props.members).toLocaleString()} members</div>` : '';
        popup.current = new mapboxgl.Popup({ closeButton: false, maxWidth: '240px', offset: 14, className: 'tg-popup' })
          .setLngLat(coords)
          .setHTML(`
            <div class="tg-popup-inner">
              <div class="tg-popup-type" style="color:${props.color}">${TYPE_LABELS[props.type]}</div>
              <div class="tg-popup-name">${props.name}</div>
              <div class="tg-popup-city">${props.city}</div>
              ${membersLine}
              <button class="tg-popup-btn" onclick="alert('Fan registration coming soon!')">Join group →</button>
            </div>
          `)
          .addTo(m);
      });

      m.on('mousemove', 'fan-pins', () => { m.getCanvas().style.cursor = 'pointer'; });
      m.on('mouseleave', 'fan-pins', () => { m.getCanvas().style.cursor = ''; });
      m.on('mouseenter', 'clusters', () => { m.getCanvas().style.cursor = 'pointer'; });
      m.on('mouseleave', 'clusters', () => { m.getCanvas().style.cursor = ''; });
    });

    return () => { map.current?.remove(); map.current = null; };
  }, []);

  useEffect(() => {
    if (!loaded || !map.current) return;
    (map.current.getSource('fans') as mapboxgl.GeoJSONSource)?.setData(buildGeoJSON(filter));
    if (popup.current) popup.current.remove();
  }, [filter, loaded]);

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All groups' },
    { key: 'community', label: 'Fan communities' },
    { key: 'supporter_club', label: 'Supporter clubs' },
    { key: 'fan_bar', label: 'Fan bars' },
  ];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />

      <div style={{
        position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: '8px', zIndex: 10,
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
        borderRadius: '999px', padding: '6px 8px',
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        {filters.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            padding: '6px 14px', borderRadius: '999px', border: 'none',
            cursor: 'pointer', fontSize: '13px', fontWeight: 500,
            transition: 'all 0.15s ease',
            background: filter === f.key ? '#EF4444' : 'transparent',
            color: filter === f.key ? '#ffffff' : 'rgba(255,255,255,0.6)',
          }}>
            {f.label}
          </button>
        ))}
      </div>

      <div style={{
        position: 'absolute', bottom: '40px', right: '16px',
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
        borderRadius: '10px', padding: '12px 14px',
        border: '1px solid rgba(255,255,255,0.1)', zIndex: 10,
        display: 'flex', flexDirection: 'column', gap: '8px',
      }}>
        {[
          { color: '#EF4444', label: 'Fan community' },
          { color: '#FFFFFF', label: 'Supporter club' },
          { color: '#F97316', label: 'Fan bar' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color, border: '2px solid rgba(0,0,0,0.5)', flexShrink: 0 }} />
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap' }}>{item.label}</span>
          </div>
        ))}
      </div>

      <style>{`
        .tg-popup .mapboxgl-popup-content { background: #111; border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; padding: 0; box-shadow: 0 8px 32px rgba(0,0,0,0.6); }
        .tg-popup .mapboxgl-popup-tip { border-top-color: #111; }
        .tg-popup-inner { padding: 14px 16px; }
        .tg-popup-type { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 4px; }
        .tg-popup-name { font-size: 15px; font-weight: 600; color: #fff; margin-bottom: 2px; }
        .tg-popup-city { font-size: 12px; color: rgba(255,255,255,0.5); margin-bottom: 8px; }
        .tg-popup-meta { font-size: 12px; color: rgba(255,255,255,0.5); margin-bottom: 8px; }
        .tg-popup-btn { width: 100%; background: #EF4444; color: #fff; border: none; border-radius: 6px; padding: 8px 12px; font-size: 13px; font-weight: 600; cursor: pointer; }
        .tg-popup-btn:hover { background: #dc2626; }
      `}</style>
    </div>
  );
}