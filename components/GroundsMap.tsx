'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const grounds = [
  { club: 'Arsenal', stadium: 'Emirates Stadium', city: 'London', coordinates: [-0.1085, 51.5549], website: 'https://www.arsenal.com' },
  { club: 'Aston Villa', stadium: 'Villa Park', city: 'Birmingham', coordinates: [-1.8847, 52.5092], website: 'https://www.avfc.co.uk' },
  { club: 'AFC Bournemouth', stadium: 'Vitality Stadium', city: 'Bournemouth', coordinates: [-1.8381, 50.7352], website: 'https://www.afcb.co.uk' },
  { club: 'Brentford', stadium: 'Gtech Community Stadium', city: 'London', coordinates: [-0.3088, 51.4882], website: 'https://www.brentfordfc.com' },
  { club: 'Brighton & Hove Albion', stadium: 'Amex Stadium', city: 'Brighton', coordinates: [-0.0831, 50.8618], website: 'https://www.brightonandhovealbion.com' },
  { club: 'Chelsea', stadium: 'Stamford Bridge', city: 'London', coordinates: [-0.1910, 51.4816], website: 'https://www.chelseafc.com' },
  { club: 'Coventry City', stadium: 'Coventry Building Society Arena', city: 'Coventry', coordinates: [-1.4916, 52.4480], website: 'https://www.ccfc.co.uk' },
  { club: 'Crystal Palace', stadium: 'Selhurst Park', city: 'London', coordinates: [-0.0853, 51.3983], website: 'https://www.cpfc.co.uk' },
  { club: 'Everton', stadium: 'Hill Dickinson Stadium', city: 'Liverpool', coordinates: [-3.0027, 53.4435], website: 'https://www.evertonfc.com' },
  { club: 'Fulham', stadium: 'Craven Cottage', city: 'London', coordinates: [-0.2214, 51.4749], website: 'https://www.fulhamfc.com' },
  { club: 'Hull City', stadium: 'MKM Stadium', city: 'Hull', coordinates: [-0.3676, 53.7457], website: 'https://www.wearehullcity.co.uk' },
  { club: 'Ipswich Town', stadium: 'Portman Road', city: 'Ipswich', coordinates: [1.1449, 52.0550], website: 'https://www.itfc.co.uk' },
  { club: 'Leeds United', stadium: 'Elland Road', city: 'Leeds', coordinates: [-1.5724, 53.7779], website: 'https://www.leedsunited.com' },
  { club: 'Liverpool', stadium: 'Anfield', city: 'Liverpool', coordinates: [-2.9608, 53.4308], website: 'https://www.liverpoolfc.com' },
  { club: 'Manchester City', stadium: 'Etihad Stadium', city: 'Manchester', coordinates: [-2.2004, 53.4831], website: 'https://www.mancity.com' },
  { club: 'Manchester United', stadium: 'Old Trafford', city: 'Manchester', coordinates: [-2.2913, 53.4631], website: 'https://www.manutd.com' },
  { club: 'Newcastle United', stadium: "St James' Park", city: 'Newcastle', coordinates: [-1.6214, 54.9756], website: 'https://www.newcastleunited.com' },
  { club: 'Nottingham Forest', stadium: 'City Ground', city: 'Nottingham', coordinates: [-1.1327, 52.9400], website: 'https://www.nottinghamforest.co.uk' },
  { club: 'Sunderland', stadium: 'Stadium of Light', city: 'Sunderland', coordinates: [-1.3883, 54.9147], website: 'https://www.safc.com' },
  { club: 'Tottenham Hotspur', stadium: 'Tottenham Hotspur Stadium', city: 'London', coordinates: [-0.0663, 51.6042], website: 'https://www.tottenhamhotspur.com' },
];

export default function GroundsMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-2.0, 53.5],
      zoom: 5.5,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      const geojson: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: grounds.map((ground) => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: ground.coordinates },
          properties: { club: ground.club, stadium: ground.stadium, city: ground.city, website: ground.website },
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

        const popup = new mapboxgl.Popup({ offset: 25 })
          .setLngLat(coords)
          .setHTML(
            `<div style="font-family:sans-serif;padding:4px 6px">
              <strong style="font-size:14px">${props.club}</strong><br/>
              <span style="font-size:12px;color:#aaa">${props.stadium}</span><br/>
              <span style="font-size:12px;color:#aaa">${props.city}</span><br/><br/>
              <button onclick="window.open('${props.website}','_blank')" style="background:#fff;color:#000;border:none;padding:6px 12px;font-size:13px;font-weight:600;cursor:pointer;border-radius:4px">
                Visit club website →
              </button>
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
  }, []);

  return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
}