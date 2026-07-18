'use client';

import { useEffect, useRef } from 'react';
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

export default function SportsBarsMap({ bars }: { bars: SportsBar[] }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

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

    map.current.on('load', () => {
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

      map.current!.addSource('sports-bars', {
        type: 'geojson',
        data: geojson,
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
    });

    return () => { map.current?.remove(); map.current = null; };
  }, [bars]);

  return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
}
