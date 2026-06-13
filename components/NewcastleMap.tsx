'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const CLUB_COLOR = '#241F20';
const CLUB_COLOR_LIGHT = '#8B8B8B';

const fanGroups = [
  { name: 'Newcastle United Supporters Trust (NUST)', city: 'Newcastle, UK', coordinates: [-1.6178, 54.9783], website: 'https://www.nufctrust.co.uk' },
  { name: 'Newcastle United SC London', city: 'London, UK', coordinates: [-0.1118, 51.5308], website: 'https://www.nufc-london.com' },
  { name: 'NUFC OSC USA', city: 'USA (nationwide)', coordinates: [-98.5795, 39.8283], website: 'https://www.newcastleunited.com/en/fans/official-nufc-supporters-clubs' },
  { name: 'NUFC OSC Australia', city: 'Sydney, Australia', coordinates: [151.2093, -33.8688], website: 'https://www.newcastleunited.com/en/fans/official-nufc-supporters-clubs' },
  { name: 'NUFC OSC Ireland', city: 'Dublin, Ireland', coordinates: [-6.2603, 53.3498], website: 'https://www.newcastleunited.com/en/fans/official-nufc-supporters-clubs' },
  { name: 'NUFC OSC Canada', city: 'Toronto, Canada', coordinates: [-79.3832, 43.6532], website: 'https://www.newcastleunited.com/en/fans/official-nufc-supporters-clubs' },
  { name: 'NUFC OSC New Zealand', city: 'Wellington, New Zealand', coordinates: [174.7762, -41.2865], website: 'https://www.newcastleunited.com/en/fans/official-nufc-supporters-clubs' },
  { name: 'NUFC OSC Asia', city: 'Beijing, China', coordinates: [116.4074, 39.9042], website: 'https://www.newcastleunited.com/en/fans/official-nufc-supporters-clubs' },
];

export default function NewcastleMap() {
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
          'circle-color': CLUB_COLOR_LIGHT,
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
          'circle-color': CLUB_COLOR_LIGHT,
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
                style="color:${CLUB_COLOR_LIGHT};font-size:13px;text-decoration:none;font-weight:600">
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