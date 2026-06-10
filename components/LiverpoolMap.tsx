'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

const LIVERPOOL_COLOR = '#C8102E';

const LIVERPOOL_GROUPS = [
  { id: 1, name: 'Spirit of Shankly', city: 'Liverpool', country: 'UK', lat: 53.4308, lng: -2.9608, website: 'https://spiritofshankly.com', description: 'Official LFC supporters union. 300,000+ worldwide followers. Represents fans to the club.' },
  { id: 2, name: 'OLSC Boston', city: 'Boston', country: 'USA', lat: 42.3601, lng: -71.0589, website: 'https://www.lfcboston.com', description: 'Watches at The Phoenix Landing, Cambridge MA and The Greatest Bar, Boston.' },
  { id: 3, name: 'OLSC New York', city: 'New York', country: 'USA', lat: 40.7128, lng: -74.006, website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official Liverpool supporters club in New York City.' },
  { id: 4, name: 'OLSC Los Angeles', city: 'Los Angeles', country: 'USA', lat: 34.0522, lng: -118.2437, website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official Liverpool supporters club in Los Angeles.' },
  { id: 5, name: 'OLSC Chicago', city: 'Chicago', country: 'USA', lat: 41.8781, lng: -87.6298, website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official Liverpool supporters club in Chicago.' },
  { id: 6, name: 'OLSC Toronto', city: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832, website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official Liverpool supporters club in Toronto.' },
  { id: 7, name: 'OLSC Sydney', city: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official Liverpool supporters club in Sydney.' },
  { id: 8, name: 'OLSC Melbourne', city: 'Melbourne', country: 'Australia', lat: -37.8136, lng: 144.9631, website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official Liverpool supporters club in Melbourne.' },
  { id: 9, name: 'BigReds Indonesia', city: 'Jakarta', country: 'Indonesia', lat: -6.2088, lng: 106.8456, website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official LFC supporters club in Indonesia. LFC opened official retail store in Jakarta 2024.' },
  { id: 10, name: 'BigReds Surabaya', city: 'Surabaya', country: 'Indonesia', lat: -7.2575, lng: 112.7521, website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official LFC supporters club in Surabaya. LFC opened second retail store here Jan 2025.' },
  { id: 11, name: 'OLSC Singapore', city: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official Liverpool supporters club in Singapore.' },
  { id: 12, name: 'OLSC Hong Kong', city: 'Hong Kong', country: 'China', lat: 22.3193, lng: 114.1694, website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official Liverpool supporters club in Hong Kong.' },
  { id: 13, name: 'OLSC Malaysia', city: 'Kuala Lumpur', country: 'Malaysia', lat: 3.139, lng: 101.6869, website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official Liverpool supporters club in Malaysia.' },
  { id: 14, name: 'OLSC Thailand', city: 'Bangkok', country: 'Thailand', lat: 13.7563, lng: 100.5018, website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official Liverpool supporters club in Thailand.' },
  { id: 15, name: 'OLSC India', city: 'Mumbai', country: 'India', lat: 19.076, lng: 72.8777, website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official Liverpool supporters club in India.' },
  { id: 16, name: 'OLSC Maldives', city: 'Male', country: 'Maldives', lat: 4.1755, lng: 73.5093, website: 'https://www.liverpoolfc.com/news/we-love-you-liverpool-meet-official-lfc-supporters-club-maldives', description: 'Official LFC Supporters Club Maldives — featured by LFC for their passion and community spirit.' },
  { id: 17, name: 'OLSC Nigeria', city: 'Lagos', country: 'Nigeria', lat: 6.5244, lng: 3.3792, website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official Liverpool supporters club in Nigeria.' },
  { id: 18, name: 'OLSC South Africa', city: 'Johannesburg', country: 'South Africa', lat: -26.2041, lng: 28.0473, website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official Liverpool supporters club in South Africa.' },
  { id: 19, name: 'OLSC Norway', city: 'Oslo', country: 'Norway', lat: 59.9139, lng: 10.7522, website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official Liverpool supporters club in Norway.' },
  { id: 20, name: 'OLSC Sweden', city: 'Stockholm', country: 'Sweden', lat: 59.3293, lng: 18.0686, website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official Liverpool supporters club in Sweden.' },
  { id: 21, name: 'OLSC Germany', city: 'Berlin', country: 'Germany', lat: 52.52, lng: 13.405, website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official Liverpool supporters club in Germany.' },
  { id: 22, name: 'OLSC Ireland', city: 'Dublin', country: 'Ireland', lat: 53.3498, lng: -6.2603, website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official Liverpool supporters club in Ireland.' },
  { id: 23, name: 'OLSC Spain', city: 'Madrid', country: 'Spain', lat: 40.4168, lng: -3.7038, website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official Liverpool supporters club in Spain.' },
  { id: 24, name: 'LFC Bangladesh', city: 'Dhaka', country: 'Bangladesh', lat: 23.8103, lng: 90.4125, website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'First official OLSC in India/Bangladesh region, recognised in 2013.' },
  { id: 25, name: 'OLSC Brazil', city: 'São Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333, website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official Liverpool supporters club in Brazil.' },
  { id: 26, name: 'OLSC Argentina', city: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lng: -58.3816, website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official Liverpool supporters club in Argentina.' },
  { id: 27, name: 'OLSC Japan', city: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official Liverpool supporters club in Japan.' },
  { id: 28, name: 'OLSC Kenya', city: 'Nairobi', country: 'Kenya', lat: -1.2921, lng: 36.8219, website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official Liverpool supporters club in Kenya.' },
  { id: 29, name: 'OLSC UAE', city: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708, website: 'https://www.liverpoolfc.com/info/official-liverpool-supporters-clubs', description: 'Official Liverpool supporters club in the UAE.' },
];

export default function LiverpoolMap() {
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
        features: LIVERPOOL_GROUPS.map(g => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [g.lng, g.lat] },
          properties: { name: g.name, city: g.city, country: g.country, website: g.website, description: g.description },
        })),
      };

      m.addSource('lfc-fans', { type: 'geojson', data: geojson, cluster: true, clusterMaxZoom: 8, clusterRadius: 50 });

      m.addLayer({ id: 'clusters', type: 'circle', source: 'lfc-fans', filter: ['has', 'point_count'],
        paint: { 'circle-color': LIVERPOOL_COLOR, 'circle-radius': ['step', ['get', 'point_count'], 20, 5, 28, 20, 36], 'circle-opacity': 0.9, 'circle-stroke-width': 2, 'circle-stroke-color': '#ffffff', 'circle-stroke-opacity': 0.3 }
      });

      m.addLayer({ id: 'cluster-count', type: 'symbol', source: 'lfc-fans', filter: ['has', 'point_count'],
        layout: { 'text-field': '{point_count_abbreviated}', 'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'], 'text-size': 13 },
        paint: { 'text-color': '#ffffff' }
      });

      m.addLayer({ id: 'fan-pins', type: 'circle', source: 'lfc-fans', filter: ['!', ['has', 'point_count']],
        paint: { 'circle-color': LIVERPOOL_COLOR, 'circle-radius': 7, 'circle-stroke-width': 2, 'circle-stroke-color': '#000000', 'circle-opacity': 0.95 }
      });

      m.on('click', 'clusters', (e) => {
        const features = m.queryRenderedFeatures(e.point, { layers: ['clusters'] });
        const clusterId = features[0].properties?.cluster_id;
        (m.getSource('lfc-fans') as mapboxgl.GeoJSONSource).getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;
          m.easeTo({ center: (features[0].geometry as GeoJSON.Point).coordinates as [number, number], zoom: zoom! + 0.5, duration: 600 });
        });
      });

      m.on('click', 'fan-pins', (e) => {
        const feature = e.features?.[0];
        if (!feature) return;
        const props = feature.properties!;
        const coords = (feature.geometry as GeoJSON.Point).coordinates as [number, number];
        if (popup.current) popup.current.remove();
        popup.current = new mapboxgl.Popup({ closeButton: false, maxWidth: '260px', offset: 14, className: 'tg-popup' })
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
        .tg-popup-btn { display: block; width: 100%; background: ${LIVERPOOL_COLOR}; color: #fff; border: none; border-radius: 6px; padding: 8px 12px; font-size: 13px; font-weight: 600; cursor: pointer; text-align: center; text-decoration: none; box-sizing: border-box; }
        .tg-popup-btn:hover { background: #a00d24; }
      `}</style>
    </div>
  );
}
