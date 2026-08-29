'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export type Ground = {
  id: number;
  name: string;
  club: string | null;
  latitude: number | null;
  longitude: number | null;
  country: string | null;
  website: string | null;
  slug: string | null;
};

export default function GroundsMap({ grounds }: { grounds: Ground[] }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

       map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [10.0, 51.0],
      zoom: 3.5,
      minZoom: 3,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      const plottable = grounds.filter(
        (g) => g.latitude != null && g.longitude != null
      );

      const geojson: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: plottable.map((ground) => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [ground.longitude as number, ground.latitude as number] },
          properties: {
            club: ground.club || ground.name,
            stadium: ground.name,
            slug: ground.slug || '',
          },
        })),
      };

      map.current!.addSource('grounds', {
        type: 'geojson',
        data: geojson,
        cluster: true,
        clusterMaxZoom: 8,
        clusterRadius: 40,
      });

      map.current!.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'grounds',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#374151',
          'circle-radius': ['step', ['get', 'point_count'], 20, 5, 28, 10, 35],
          'circle-opacity': 0.9,
          'circle-stroke-width': 1,
          'circle-stroke-color': 'rgba(255,255,255,0.2)',
        },
      });

      map.current!.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'grounds',
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
        source: 'grounds',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#1f2937',
          'circle-radius': 10,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      });

      map.current!.on('click', 'unclustered-point', (e) => {
        if (!e.features || !e.features.length) return;
        const props = e.features[0].properties!;
        const coords = (e.features[0].geometry as GeoJSON.Point).coordinates.slice() as [number, number];

        new mapboxgl.Popup({ offset: 25 })
          .setLngLat(coords)
          .setHTML(
            `<div style="font-family:sans-serif;padding:4px 6px">
              <strong style="font-size:14px;color:#000">${props.club}</strong><br/>
              <span style="font-size:12px;color:#aaa">${props.stadium}</span><br/><br/>
              <button onclick="window.location.href='/club-map/${props.slug}'" style="background:#fff;color:#000;border:none;padding:6px 12px;font-size:13px;font-weight:600;cursor:pointer;border-radius:4px">
                Club Page &rarr;</button>
            </div>`
          )
          .addTo(map.current!);
      });

      map.current!.on('click', 'clusters', (e) => {
        const features = map.current!.queryRenderedFeatures(e.point, { layers: ['clusters'] });
        const clusterId = features[0].properties!.cluster_id;
        (map.current!.getSource('grounds') as mapboxgl.GeoJSONSource).getClusterExpansionZoom(
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
  }, [grounds]);

  return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
}