'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MANCITY_BLUE = '#6CABDD';

const fanGroups = [
  { name: 'Chicago MCFC', city: 'Chicago, USA', coordinates: [-87.6298, 41.8781], website: 'http://www.chicagomcfc.org/' },
  { name: 'MCFC Boston', city: 'Boston, USA', coordinates: [-71.0589, 42.3601], website: 'http://www.mcfcboston.com/' },
  { name: 'Man City Atlanta Cityzens', city: 'Atlanta, USA', coordinates: [-84.3880, 33.7490], website: 'http://www.mancityatlcityzens.com/' },
  { name: 'Man City Switzerland', city: 'Zurich, Switzerland', coordinates: [8.5417, 47.3769], website: 'https://www.mancityswisssupporters.com/' },
  { name: 'Man City Scandinavia', city: 'Oslo, Norway', coordinates: [10.7522, 59.9139], website: 'http://www.manchestercity.no/' },
  { name: 'MCFC Australia', city: 'Australia', coordinates: [133.7751, -25.2744], website: 'https://www.mcfcaustralia.com.au/' },
  { name: 'Man City OSC (Official)', city: 'Manchester, UK', coordinates: [-2.2006, 53.4831], website: 'https://www.mancityosc.com/' },
  { name: 'Canal Street Blues', city: 'Manchester, UK', coordinates: [-2.2374, 53.4808], website: 'http://canalstreetblues.co.uk/' },
  { name: 'Dukinfield Blues', city: 'Dukinfield, UK', coordinates: [-2.0897, 53.4741], website: 'https://www.dukinfieldmcfc.co.uk/' },
  { name: 'Hazel Grove Blues', city: 'Hazel Grove, UK', coordinates: [-2.1197, 53.3741], website: 'http://www.hazelgroveblues.co.uk/' },
  { name: 'Northenden Blues', city: 'Northenden, UK', coordinates: [-2.2469, 53.4066], website: 'http://www.northendenblues.com/' },
  { name: 'Reddish Blues', city: 'Reddish, UK', coordinates: [-2.1624, 53.4441], website: 'http://www.reddishblues.com/' },
  { name: 'Wessex Blues', city: 'Wessex, UK', coordinates: [-1.4000, 51.0577], website: 'http://wessexblues.co.uk/' },
];

export default function ManCityMap() {
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
          properties: {
            name: group.name,
            city: group.city,
            website: group.website,
          },
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
          'circle-color': MANCITY_BLUE,
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
          'circle-color': MANCITY_BLUE,
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
                style="color:${MANCITY_BLUE};font-size:13px;text-decoration:none;font-weight:600">
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

      map.current!.on('mouseenter', 'unclustered-point', () => {
        map.current!.getCanvas().style.cursor = 'pointer';
      });
      map.current!.on('mouseleave', 'unclustered-point', () => {
        map.current!.getCanvas().style.cursor = '';
      });
      map.current!.on('mouseenter', 'clusters', () => {
        map.current!.getCanvas().style.cursor = 'pointer';
      });
      map.current!.on('mouseleave', 'clusters', () => {
        map.current!.getCanvas().style.cursor = '';
      });
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
}