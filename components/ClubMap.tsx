'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

type FanGroup = {
  name: string;
  city: string | null;
  country: string | null;
  lat: number;
  lng: number;
  website: string;
  description: string | null;
};

type Props = {
  groups: FanGroup[];
  color?: string;
};

export default function ClubMap({ groups, color = '#6CABDD' }: Props) {
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
        features: groups.map(g => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [g.lng, g.lat] },
          properties: { name: g.name, city: g.city, country: g.country, website: g.website, description: g.description },
        })),
      };

      m.addSource('city-fans', { type: 'geojson', data: geojson, cluster: true, clusterMaxZoom: 8, clusterRadius: 50 });

      m.addLayer({ id: 'clusters', type: 'circle', source: 'city-fans', filter: ['has', 'point_count'],
        paint: { 'circle-color': color, 'circle-radius': ['step', ['get', 'point_count'], 20, 5, 28, 20, 36], 'circle-opacity': 0.9, 'circle-stroke-width': 2, 'circle-stroke-color': '#ffffff', 'circle-stroke-opacity': 0.3 }
      });

      m.addLayer({ id: 'cluster-count', type: 'symbol', source: 'city-fans', filter: ['has', 'point_count'],
        layout: { 'text-field': '{point_count_abbreviated}', 'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'], 'text-size': 13 },
        paint: { 'text-color': '#ffffff' }
      });

      m.addLayer({ id: 'fan-pins', type: 'circle', source: 'city-fans', filter: ['!', ['has', 'point_count']],
        paint: { 'circle-color': color, 'circle-radius': 7, 'circle-stroke-width': 2, 'circle-stroke-color': '#000000', 'circle-opacity': 0.95 }
      });

      m.on('click', 'clusters', (e) => {
        const features = m.queryRenderedFeatures(e.point, { layers: ['clusters'] });
        const clusterId = features[0].properties?.cluster_id;
        (m.getSource('city-fans') as mapboxgl.GeoJSONSource).getClusterExpansionZoom(clusterId, (err, zoom) => {
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
        .tg-popup-btn { display: block; width: 100%; background: ${color}; color: #fff; border: none; border-radius: 6px; padding: 8px 12px; font-size: 13px; font-weight: 600; cursor: pointer; text-align: center; text-decoration: none; box-sizing: border-box; }
        .tg-popup-btn:hover { background: #4a8fbf; }
      `}</style>
    </div>
  );
}
