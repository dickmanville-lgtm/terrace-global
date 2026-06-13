'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const CLUB_COLOR = '#16A34A';

const fanGroups = [
  { name: 'Celtic Supporters Association (CSA)', city: 'Glasgow, UK', coordinates: [-4.2518, 55.8642], website: 'https://thecsa.co.uk' },
  { name: 'Association of Irish Celtic Supporters Clubs (AICSC)', city: 'Ireland', coordinates: [-7.6921, 53.1424], website: 'https://www.aicsc.com' },
  { name: 'Celtic FC Official Supporters Clubs', city: 'Worldwide', coordinates: [-4.2518, 55.8642], website: 'https://www.celticfc.com/fans/celtic-supporters-clubs/' },
  { name: 'New York CSC', city: 'New York, USA', coordinates: [-74.0060, 40.7128], website: 'https://www.celticbars.com/cscs/' },
  { name: 'Boston No1 CSC', city: 'Boston, USA', coordinates: [-71.0589, 42.3601], website: 'https://www.celticbars.com/cscs/' },
  { name: 'Chicago CSC', city: 'Chicago, USA', coordinates: [-87.6298, 41.8781], website: 'https://www.celticbars.com/cscs/' },
  { name: 'Los Angeles CSC', city: 'Los Angeles, USA', coordinates: [-118.2437, 34.0522], website: 'https://www.celticbars.com/cscs/' },
  { name: 'Toronto CSC', city: 'Toronto, Canada', coordinates: [-79.3832, 43.6532], website: 'https://www.celticbars.com/cscs/' },
  { name: 'Vancouver Shamrock CSC', city: 'Vancouver, Canada', coordinates: [-123.1207, 49.2827], website: 'https://www.celticbars.com/cscs/' },
  { name: 'Australia CSC', city: 'Sydney, Australia', coordinates: [151.2093, -33.8688], website: 'https://www.celticbars.com/cscs/' },
  { name: 'Singapore CSC', city: 'Singapore', coordinates: [103.8198, 1.3521], website: 'https://www.celticbars.com/cscs/' },
  { name: 'French CSC', city: 'Paris, France', coordinates: [2.3522, 48.8566], website: 'https://www.celticbars.com/cscs/' },
  { name: 'Cape Town CSC', city: 'Cape Town, South Africa', coordinates: [18.4241, -33.9249], website: 'https://www.celticbars.com/cscs/' },
  { name: 'Trondheim Brattbakk Bhoys CSC', city: 'Trondheim, Norway', coordinates: [10.3951, 63.4305], website: 'https://www.celticbars.com/cscs/' },
];

export default function CelticMap() {
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