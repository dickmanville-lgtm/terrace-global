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
  website?: string | null;
  description: string | null;
  facebook?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
};

type Props = {
  groups: FanGroup[];
  color?: string;
};

// Escape text for safe injection into popup HTML (setHTML renders raw HTML).
function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Only allow http/https links, and escape them for use in an href attribute.
// Returns null for anything blank, non-http, or otherwise unusable.
function safeUrl(value: unknown): string | null {
  const s = String(value ?? '').trim();
  if (!s) return null;
  if (!/^https?:\/\//i.test(s)) return null;
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function hasAnyLink(g: FanGroup): boolean {
  return Boolean(g.website || g.facebook || g.instagram || g.tiktok);
}

export default function ClubMap({ groups, color = '#6CABDD' }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const popup = useRef<mapboxgl.Popup | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Only map groups that have at least one live link - a pin with no link
    // to click is not useful, so it is not shown.
    const linked = groups.filter(hasAnyLink);

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
        features: linked.map(g => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [g.lng, g.lat] },
          properties: {
            name: g.name ?? '',
            city: g.city ?? '',
            country: g.country ?? '',
            description: g.description ?? '',
            website: g.website ?? '',
            facebook: g.facebook ?? '',
            instagram: g.instagram ?? '',
            tiktok: g.tiktok ?? '',
          },
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
        const p = feature.properties!;
        const coords = (feature.geometry as GeoJSON.Point).coordinates as [number, number];
        if (popup.current) popup.current.remove();

        // City &middot; Country - omit the separator if one side is missing.
        const locationParts = [p.city, p.country]
          .filter((x: unknown) => x && String(x).trim())
          .map((x: unknown) => esc(x));
        const locationHtml = locationParts.length
          ? `<div class="tg-popup-city">${locationParts.join(' &middot; ')}</div>`
          : '';

        const descHtml = p.description && String(p.description).trim()
          ? `<div class="tg-popup-desc">${esc(p.description)}</div>`
          : '';

        // Build one button per present link, in order: Website, Facebook, Instagram, TikTok.
        const buttons: string[] = [];
        const addButton = (raw: unknown, label: string) => {
          const url = safeUrl(raw);
          if (url) {
            buttons.push(
              `<a class="tg-popup-btn" href="${url}" target="_blank" rel="noopener noreferrer">${label} &rarr;</a>`
            );
          }
        };
        addButton(p.website, 'Website');
        addButton(p.facebook, 'Facebook');
        addButton(p.instagram, 'Instagram');
        addButton(p.tiktok, 'TikTok');

        const linksHtml = buttons.length
          ? `<div class="tg-popup-links">${buttons.join('')}</div>`
          : '';

        popup.current = new mapboxgl.Popup({ closeButton: false, maxWidth: '260px', offset: 14, className: 'tg-popup' })
          .setLngLat(coords)
          .setHTML(`
            <div class="tg-popup-inner">
              <div class="tg-popup-name">${esc(p.name)}</div>
              ${locationHtml}
              ${descHtml}
              ${linksHtml}
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
        .tg-popup-links { display: flex; flex-direction: column; gap: 6px; }
        .tg-popup-btn { display: block; width: 100%; background: ${color}; color: #fff; border: none; border-radius: 6px; padding: 8px 12px; font-size: 13px; font-weight: 600; cursor: pointer; text-align: center; text-decoration: none; box-sizing: border-box; }
        .tg-popup-btn:hover { filter: brightness(0.9); }
      `}</style>
    </div>
  );
}
