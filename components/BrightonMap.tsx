'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const CLUB_COLOR = '#0057B8';

const fanGroups = [
  { name: 'Brighton & Hove Albion Supporters Club', city: 'Brighton, UK', coordinates: [-0.1278, 50.8225], website: 'https://bhasc.com/wp/' },
  { name: 'Seagulls Over London', city: 'London, UK', coordinates: [-0.1278, 51.5074], website: 'http://www.seagullsoverlondon.com' },
  { name: 'Proud Seagulls (LGBTQ+)', city: 'Brighton, UK', coordinates: [-0.1400, 50.8300], website: 'https://proudseagulls.com' },
  { name: 'Houston Seagulls', city: 'Houston, USA', coordinates: [-95.3698, 29.7604], website: 'https://houstonseagulls.com' },
  { name: 'Stateside Seagulls', city: 'USA (nationwide)', coordinates: [-98.5795, 39.8283], website: 'https://www.brightonandhovealbion.com/supporters-club-map' },
  { name: 'Hong Kong Seagulls', city: 'Hong Kong', coordinates: [114.1694, 22.3193], website: 'https://www.brightonandhovealbion.com/supporters-club-map' },
  { name: 'Singapore Seagulls', city: 'Singapore', coordinates: [103.8198, 1.3521], website: 'https://www.brightonandhovealbion.com/supporters-club-map' },
  { name: 'Hellas Seagulls', city: 'Athens, Greece', coordinates: [23.7275, 37.9838], website: 'https://www.brightonandhovealbion.com/supporters-club-map' },
  { name: 'Seagulls Over Spain', city: 'Spain', coordinates: [-3.7038, 40.4168], website: 'https://www.brightonandhovealbion.com/supporters-club-map' },
  { name: 'BHAlba Scottish Seagulls', city: 'Scotland, UK', coordinates: [-4.2026, 56.4907], website: 'https://www.brightonandhovealbion.com/supporters-club-map' },
];

export default function BrightonMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [0, 30],
      zoom: 1.8,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      const geojson: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: fanGroups.map((group) => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: group.coordinates },
          properties: { name: group.name, city: group.city, website: group.website },
        })),
      };

      map.current!.addSource('fan-groups', {
        type: 'geojson',
        data: geojson,
        cluster: true,
        clusterMaxZoom: 12,
        clusterRadius: 50,
      });

      map.current!.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'fan-groups',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': CLUB_COLOR,
          'circle-radius': ['step', ['get', 'point_count'], 20, 5, 28, 10, 35],
          'circle-opacity': 0.85,
        },
      });

      map.current!.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'fan-groups',
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
        source: 'fan-groups',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': CLUB_COLOR,
          'circle-radius': 10,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      });

      map.current!.on('click', 'unclustered-point', (e) => {
        const features = e.features;
        if (!features || !features.length) return;
        const props = features[0].properties!;
        const coords = (features[0].geometry as GeoJSON.Point).coordinates.slice() as [number, number];

        new mapboxgl.Popup({ offset: 25 })
          .setLngLat(coords)
          .setHTML(
            `<div style="font-family:sans-serif;padding:4px 6px">
              <strong style="font-size:14px">${props.name}</strong><br/>
              <span style="font-size:12px;color:#aaa">${props.city}</span><br/><br/>
              <a href="${props.website}" target="_blank" rel="noopener noreferrer"
                style="color:${CLUB_COLOR};font-size:13px;text-decoration:none;font-weight:600">
                Visit group →
              </a>
            </div>`
          )
          .addTo(map.current!);
      });

      map.current!.on('click', 'clusters', (e) => {
        const features = map.current!.queryRenderedFeatures(e.point, { layers: ['clusters'] });
        const clusterId = features[0].properties!.cluster_id;
        (map.current!.getSource('fan-groups') as mapboxgl.GeoJSONSource).getClusterExpansionZoom(
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
    });

    return () => { map.current?.remove(); map.current = null; };
  }, []);

  return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
}