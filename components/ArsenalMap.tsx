'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

const ARSENAL_COLOR = '#EF4444';

const ARSENAL_GROUPS = [
  { id: 1, name: 'Arsenal Supporters Trust', city: 'London', country: 'UK', lat: 51.555, lng: -0.108, website: 'https://www.arsenaltrust.org', description: 'Independent supporters trust' },
  { id: 2, name: 'Gay Gooners', city: 'London', country: 'UK', lat: 51.545, lng: -0.115, website: 'https://www.arsenal.com/fanzone/gay-gooners', description: 'Official LGBTQ+ supporters group. 1,600+ members across 51 countries.' },
  { id: 3, name: 'Arsenal America', city: 'Washington DC', country: 'USA', lat: 38.9072, lng: -77.0369, website: 'https://arsenalamerica.com', description: 'Official national chapter. 86+ branches across the USA.' },
  { id: 4, name: 'Arsenal NYC', city: 'New York', country: 'USA', lat: 40.7128, lng: -74.006, website: 'https://arsenalnyc.com', description: 'Independent supporters group for New York City.' },
  { id: 10, name: 'Arsenal Canada', city: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832, website: 'https://www.arsenal.com/fanzone/arsenal-supporters-clubs', description: 'Arsenal supporters across Canada.' },
  { id: 11, name: 'Arsenal Australia', city: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, website: 'https://arsenalaustralia.com.au', description: 'Official supporters club. Active in Sydney, Melbourne, Brisbane, Perth and beyond.' },
  { id: 12, name: 'Arsenal Melbourne', city: 'Melbourne', country: 'Australia', lat: -37.8136, lng: 144.9631, website: 'https://arsenalaustralia.com.au', description: 'Part of Arsenal Australia Supporters Club network.' },
  { id: 13, name: 'Arsenal Perth', city: 'Perth', country: 'Australia', lat: -31.9505, lng: 115.8605, website: 'https://arsenalaustralia.com.au', description: 'Part of Arsenal Australia. National Meet in Perth 2026.' },
  { id: 14, name: 'Arsenal Singapore', city: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, website: 'https://www.arsenal.com/supportersclubs/asia', description: 'Official supporters club. Arsenal played in Singapore on pre-season tour July 2025.' },
  { id: 15, name: 'Arsenal Hong Kong', city: 'Hong Kong', country: 'China', lat: 22.3193, lng: 114.1694, website: 'https://www.arsenal.com/supportersclubs/asia', description: 'Official supporters club. One of the largest Arsenal communities in Asia.' },
  { id: 16, name: 'Arsenal Thailand', city: 'Bangkok', country: 'Thailand', lat: 13.7563, lng: 100.5018, website: 'https://www.arsenal.com/supportersclubs/asia', description: 'Official supporters club. Enormous fan base across Thailand.' },
  { id: 17, name: 'Arsenal Indonesia', city: 'Jakarta', country: 'Indonesia', lat: -6.2088, lng: 106.8456, website: 'https://www.arsenal.com/supportersclubs/asia', description: 'Official supporters club. Massive following across Indonesia.' },
  { id: 18, name: 'Arsenal Malaysia', city: 'Kuala Lumpur', country: 'Malaysia', lat: 3.139, lng: 101.6869, website: 'https://www.arsenal.com/supportersclubs/asia', description: 'Official supporters club in Malaysia.' },
  { id: 19, name: 'Arsenal Japan', city: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, website: 'https://www.arsenal.com/supportersclubs/asia', description: 'Arsenal supporters club in Japan.' },
  { id: 20, name: 'Arsenal India', city: 'Mumbai', country: 'India', lat: 19.076, lng: 72.8777, website: 'https://www.arsenal.com/supportersclubs/asia', description: 'Arsenal supporters across India.' },
  { id: 21, name: 'Arsenal UAE', city: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708, website: 'https://www.arsenal.com/fanzone/arsenal-supporters-clubs', description: 'Arsenal supporters in the UAE.' },
  { id: 22, name: 'Arsenal South Africa', city: 'Johannesburg', country: 'South Africa', lat: -26.2041, lng: 28.0473, website: 'https://www.arsenal.com/fanzone/arsenal-supporters-clubs', description: 'Arsenal supporters across South Africa.' },
  { id: 23, name: 'Arsenal Nigeria', city: 'Lagos', country: 'Nigeria', lat: 6.5244, lng: 3.3792, website: 'https://www.arsenal.com/fanzone/arsenal-supporters-clubs', description: 'Arsenal supporters across Nigeria.' },
  { id: 24, name: 'Arsenal Kenya', city: 'Nairobi', country: 'Kenya', lat: -1.2921, lng: 36.8219, website: 'https://www.arsenal.com/fanzone/arsenal-supporters-clubs', description: 'Arsenal supporters across Kenya.' },
  { id: 25, name: 'Arsenal Norway', city: 'Oslo', country: 'Norway', lat: 59.9139, lng: 10.7522, website: 'https://www.arsenal.com/supportersclubs/arsenal-supporters-clubs-europe', description: 'Official Arsenal supporters club in Norway.' },
  { id: 26, name: 'Arsenal Sweden', city: 'Stockholm', country: 'Sweden', lat: 59.3293, lng: 18.0686, website: 'https://www.arsenal.com/supportersclubs/arsenal-supporters-clubs-europe', description: 'Official Arsenal supporters club in Sweden.' },
  { id: 27, name: 'Arsenal Germany', city: 'Berlin', country: 'Germany', lat: 52.52, lng: 13.405, website: 'https://www.arsenal.com/supportersclubs/arsenal-supporters-clubs-europe', description: 'Official Arsenal supporters club in Germany.' },
  { id: 28, name: 'Arsenal Spain', city: 'Madrid', country: 'Spain', lat: 40.4168, lng: -3.7038, website: 'https://www.arsenal.com/supportersclubs/arsenal-supporters-clubs-europe', description: 'Official Arsenal supporters club in Spain.' },
  { id: 29, name: 'Arsenal Ireland', city: 'Dublin', country: 'Ireland', lat: 53.3498, lng: -6.2603, website: 'https://www.arsenal.com/supportersclubs/arsenal-supporters-clubs-europe', description: 'Official Arsenal supporters club in Ireland.' },
  { id: 30, name: 'Arsenal Netherlands', city: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lng: 4.9041, website: 'https://www.arsenal.com/supportersclubs/arsenal-supporters-clubs-europe', description: 'Official Arsenal supporters club in the Netherlands.' },
  { id: 31, name: 'Arsenal Brasil', city: 'São Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333, website: 'https://www.arsenal.com/fanzone/arsenal-supporters-clubs', description: 'Arsenal supporters across Brazil.' },
  { id: 32, name: 'Arsenal Argentina', city: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lng: -58.3816, website: 'https://www.arsenal.com/fanzone/arsenal-supporters-clubs', description: 'Arsenal supporters across Argentina.' },
];

export default function ArsenalMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const popup = useRef<mapboxgl.Popup | null>(null);

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

      const geojson: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: ARSENAL_GROUPS.map(g => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [g.lng, g.lat] },
          properties: {
            name: g.name,
            city: g.city,
            country: g.country,
            website: g.website,
            description: g.description,
          },
        })),
      };

      m.addSource('arsenal-fans', {
        type: 'geojson',
        data: geojson,
        cluster: true,
        clusterMaxZoom: 8,
        clusterRadius: 50,
      });

      m.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'arsenal-fans',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': ARSENAL_COLOR,
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
        source: 'arsenal-fans',
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
        source: 'arsenal-fans',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': ARSENAL_COLOR,
          'circle-radius': 7,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#000000',
          'circle-opacity': 0.95,
        },
      });

      m.on('click', 'clusters', (e) => {
        const features = m.queryRenderedFeatures(e.point, { layers: ['clusters'] });
        const clusterId = features[0].properties?.cluster_id;
        (m.getSource('arsenal-fans') as mapboxgl.GeoJSONSource).getClusterExpansionZoom(clusterId, (err, zoom) => {
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

        popup.current = new mapboxgl.Popup({
          closeButton: false,
          maxWidth: '260px',
          offset: 14,
          className: 'tg-popup',
        })
          .setLngLat(coords)
          .setHTML(`
            <div class="tg-popup-inner">
              <div class="tg-popup-name">${props.name}</div>
              <div class="tg-popup-city">${props.city} · ${props.country}</div>
              <div class="tg-popup-desc">${props.description}</div>
              <a class="tg-popup-btn" href="${props.website}" target="_blank" rel="noopener noreferrer">Visit group →</a>
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

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
      <style>{`
        .tg-popup .mapboxgl-popup-content { background: #111; border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; padding: 0; box-shadow: 0 8px 32px rgba(0,0,0,0.6); }
        .tg-popup .mapboxgl-popup-tip { border-top-color: #111; }
        .tg-popup-inner { padding: 14px 16px; }
        .tg-popup-name { font-size: 15px; font-weight: 600; color: #fff; margin-bottom: 2px; }
        .tg-popup-city { font-size: 12px; color: rgba(255,255,255,0.4); margin-bottom: 6px; }
        .tg-popup-desc { font-size: 12px; color: rgba(255,255,255,0.55); line-height: 1.5; margin-bottom: 10px; }
        .tg-popup-btn { display: block; width: 100%; background: #EF4444; color: #fff; border: none; border-radius: 6px; padding: 8px 12px; font-size: 13px; font-weight: 600; cursor: pointer; text-align: center; text-decoration: none; box-sizing: border-box; }
        .tg-popup-btn:hover { background: #dc2626; }
      `}</style>
    </div>
  );
}
