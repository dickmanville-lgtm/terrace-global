'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const CLUB_COLOR = '#0066CC';

const fanGroups = [
  { name: 'Rangers FC Supporters Association (RFCSA)', city: 'Glasgow, UK', coordinates: [-4.3092, 55.8553], website: 'https://www.rfcsa.co.uk' },
  { name: 'Club 1872', city: 'Glasgow, UK', coordinates: [-4.3100, 55.8550], website: 'https://www.club1872.co.uk' },
  { name: 'North American Rangers Supporters Association (NARSA)', city: 'North America', coordinates: [-98.5795, 39.8283], website: 'https://narsa.ca' },
  { name: 'Rangers FC Global Supporters Clubs', city: 'Worldwide', coordinates: [-4.3092, 55.8553], website: 'https://aws.rangers.co.uk/fans/supporters-clubs/global-supporters-clubs/' },
  { name: 'Chicago RSC', city: 'Chicago, USA', coordinates: [-87.6298, 41.8781], website: 'https://narsa.ca/usa-club-directory/' },
  { name: 'New York Bears RSC', city: 'New York, USA', coordinates: [-74.0060, 40.7128], website: 'https://narsa.ca/usa-club-directory/' },
  { name: 'Cape Town RSC', city: 'Cape Town, South Africa', coordinates: [18.4241, -33.9249], website: 'https://aws.rangers.co.uk/fans/supporters-clubs/global-supporters-clubs/' },
  { name: 'Johannesburg RSC', city: 'Johannesburg, South Africa', coordinates: [28.0473, -26.2041], website: 'https://aws.rangers.co.uk/fans/supporters-clubs/global-supporters-clubs/' },
  { name: 'Dublin Loyal RSC', city: 'Dublin, Ireland', coordinates: [-6.2603, 53.3498], website: 'https://aws.rangers.co.uk/fans/supporters-clubs/global-supporters-clubs/' },
  { name: 'Costa Blanca Loyal RSC', city: 'Alicante, Spain', coordinates: [-0.4810, 38.3452], website: 'https://aws.rangers.co.uk/fans/supporters-clubs/global-supporters-clubs/' },
  { name: 'Brian Laudrup Loyal RSC', city: 'Aarhus, Denmark', coordinates: [10.2039, 56.1629], website: 'https://aws.rangers.co.uk/fans/supporters-clubs/global-supporters-clubs/' },
  { name: 'Cyprus Loyal RSC', city: 'Paphos, Cyprus', coordinates: [32.4166, 34.7722], website: 'https://aws.rangers.co.uk/fans/supporters-clubs/global-supporters-clubs/' },
  { name: 'Australia RSC', city: 'Sydney, Australia', coordinates: [151.2093, -33.8688], website: 'https://aws.rangers.co.uk/fans/supporters-clubs/global-supporters-clubs/' },
];

export default function RangersMap() {
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