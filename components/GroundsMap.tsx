'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const grounds = [
  // Premier League
  { club: 'Arsenal', stadium: 'Emirates Stadium', city: 'London, England', coordinates: [-0.1085, 51.5549], website: 'https://www.arsenal.com' },
  { club: 'Aston Villa', stadium: 'Villa Park', city: 'Birmingham, England', coordinates: [-1.8847, 52.5092], website: 'https://www.avfc.co.uk' },
  { club: 'AFC Bournemouth', stadium: 'Vitality Stadium', city: 'Bournemouth, England', coordinates: [-1.8381, 50.7352], website: 'https://www.afcb.co.uk' },
  { club: 'Brentford', stadium: 'Gtech Community Stadium', city: 'London, England', coordinates: [-0.3088, 51.4882], website: 'https://www.brentfordfc.com' },
  { club: 'Brighton & Hove Albion', stadium: 'Amex Stadium', city: 'Brighton, England', coordinates: [-0.0831, 50.8618], website: 'https://www.brightonandhovealbion.com' },
  { club: 'Chelsea', stadium: 'Stamford Bridge', city: 'London, England', coordinates: [-0.1910, 51.4816], website: 'https://www.chelseafc.com' },
  { club: 'Coventry City', stadium: 'Coventry Building Society Arena', city: 'Coventry, England', coordinates: [-1.4916, 52.4480], website: 'https://www.ccfc.co.uk' },
  { club: 'Crystal Palace', stadium: 'Selhurst Park', city: 'London, England', coordinates: [-0.0853, 51.3983], website: 'https://www.cpfc.co.uk' },
  { club: 'Everton', stadium: 'Hill Dickinson Stadium', city: 'Liverpool, England', coordinates: [-3.0027, 53.4435], website: 'https://www.evertonfc.com' },
  { club: 'Fulham', stadium: 'Craven Cottage', city: 'London, England', coordinates: [-0.2214, 51.4749], website: 'https://www.fulhamfc.com' },
  { club: 'Hull City', stadium: 'MKM Stadium', city: 'Hull, England', coordinates: [-0.3676, 53.7457], website: 'https://www.wearehullcity.co.uk' },
  { club: 'Ipswich Town', stadium: 'Portman Road', city: 'Ipswich, England', coordinates: [1.1449, 52.0550], website: 'https://www.itfc.co.uk' },
  { club: 'Leeds United', stadium: 'Elland Road', city: 'Leeds, England', coordinates: [-1.5724, 53.7779], website: 'https://www.leedsunited.com' },
  { club: 'Liverpool', stadium: 'Anfield', city: 'Liverpool, England', coordinates: [-2.9608, 53.4308], website: 'https://www.liverpoolfc.com' },
  { club: 'Manchester City', stadium: 'Etihad Stadium', city: 'Manchester, England', coordinates: [-2.2004, 53.4831], website: 'https://www.mancity.com' },
  { club: 'Manchester United', stadium: 'Old Trafford', city: 'Manchester, England', coordinates: [-2.2913, 53.4631], website: 'https://www.manutd.com' },
  { club: 'Newcastle United', stadium: "St James' Park", city: 'Newcastle, England', coordinates: [-1.6214, 54.9756], website: 'https://www.newcastleunited.com' },
  { club: 'Nottingham Forest', stadium: 'City Ground', city: 'Nottingham, England', coordinates: [-1.1327, 52.9400], website: 'https://www.nottinghamforest.co.uk' },
  { club: 'Sunderland', stadium: 'Stadium of Light', city: 'Sunderland, England', coordinates: [-1.3883, 54.9147], website: 'https://www.safc.com' },
  { club: 'Tottenham Hotspur', stadium: 'Tottenham Hotspur Stadium', city: 'London, England', coordinates: [-0.0663, 51.6042], website: 'https://www.tottenhamhotspur.com' },

  // Scotland
  { club: 'Celtic', stadium: 'Celtic Park', city: 'Glasgow, Scotland', coordinates: [-4.2052, 55.8490], website: 'https://www.celticfc.com' },
  { club: 'Rangers', stadium: 'Ibrox Stadium', city: 'Glasgow, Scotland', coordinates: [-4.3092, 55.8553], website: 'https://www.rangers.co.uk' },

  // Spain - Champions League
  { club: 'Real Madrid', stadium: 'Santiago Bernabeu', city: 'Madrid, Spain', coordinates: [-3.6883, 40.4531], website: 'https://www.realmadrid.com/en' },
  { club: 'Barcelona', stadium: 'Estadio Olimpic Lluis Companys', city: 'Barcelona, Spain', coordinates: [2.1538, 41.3580], website: 'https://www.fcbarcelona.com' },
  { club: 'Atletico Madrid', stadium: 'Civitas Metropolitano', city: 'Madrid, Spain', coordinates: [-3.5996, 40.4361], website: 'https://www.atleticodemadrid.com/en' },
  { club: 'Athletic Club', stadium: 'San Mames', city: 'Bilbao, Spain', coordinates: [-2.9495, 43.2641], website: 'https://www.athletic-club.eus/en' },
  { club: 'Villarreal', stadium: 'Estadio de la Ceramica', city: 'Villarreal, Spain', coordinates: [-0.1036, 39.9444], website: 'https://www.villarrealcf.es/en' },

  // Germany - Champions League
  { club: 'Bayern Munich', stadium: 'Allianz Arena', city: 'Munich, Germany', coordinates: [11.6242, 48.2188], website: 'https://www.fcbayern.com/en' },
  { club: 'Bayer Leverkusen', stadium: 'BayArena', city: 'Leverkusen, Germany', coordinates: [6.9937, 51.0383], website: 'https://www.bayer04.de/en' },
  { club: 'Eintracht Frankfurt', stadium: 'Deutsche Bank Park', city: 'Frankfurt, Germany', coordinates: [8.6455, 50.0687], website: 'https://www.eintracht.de/en' },
  { club: 'Borussia Dortmund', stadium: 'Signal Iduna Park', city: 'Dortmund, Germany', coordinates: [7.4516, 51.4926], website: 'https://www.bvb.de/eng' },

  // France - Champions League
  { club: 'Paris Saint-Germain', stadium: 'Parc des Princes', city: 'Paris, France', coordinates: [2.2531, 48.8414], website: 'https://www.psg.fr/en' },
  { club: 'Marseille', stadium: 'Stade Velodrome', city: 'Marseille, France', coordinates: [5.3959, 43.2697], website: 'https://www.om.fr/en' },
  { club: 'Monaco', stadium: 'Stade Louis II', city: 'Monaco', coordinates: [7.4159, 43.7276], website: 'https://www.asmonaco.com/en' },

  // Italy - Champions League
  { club: 'Inter Milan', stadium: 'San Siro', city: 'Milan, Italy', coordinates: [9.1237, 45.4781], website: 'https://www.inter.it/en' },
  { club: 'Napoli', stadium: 'Stadio Diego Armando Maradona', city: 'Naples, Italy', coordinates: [14.0916, 40.8279], website: 'https://www.sscnapoli.it/en' },
  { club: 'Atalanta', stadium: 'Gewiss Stadium', city: 'Bergamo, Italy', coordinates: [9.6809, 45.6986], website: 'https://www.atalanta.it/en' },
  { club: 'Juventus', stadium: 'Allianz Stadium', city: 'Turin, Italy', coordinates: [7.6411, 45.1096], website: 'https://www.juventus.com/en' },

  // Netherlands - Champions League
  { club: 'PSV', stadium: 'Philips Stadion', city: 'Eindhoven, Netherlands', coordinates: [5.4674, 51.4416], website: 'https://www.psv.nl/en' },
  { club: 'Ajax', stadium: 'Johan Cruyff Arena', city: 'Amsterdam, Netherlands', coordinates: [4.9419, 52.3141], website: 'https://www.ajax.nl/en' },

  // Portugal - Champions League
  { club: 'Benfica', stadium: 'Estadio da Luz', city: 'Lisbon, Portugal', coordinates: [-9.1845, 38.7526], website: 'https://www.slbenfica.pt/en-us' },
  { club: 'Sporting CP', stadium: 'Estadio Jose Alvalade', city: 'Lisbon, Portugal', coordinates: [-9.1609, 38.7613], website: 'https://www.sporting.pt/en' },

  // Belgium - Champions League
  { club: 'Club Brugge', stadium: 'Jan Breydel Stadium', city: 'Bruges, Belgium', coordinates: [3.1597, 51.1973], website: 'https://www.clubbrugge.be/en' },
  { club: 'Union Saint-Gilloise', stadium: 'Stade Joseph Marien', city: 'Brussels, Belgium', coordinates: [4.3382, 50.8329], website: 'https://www.rusg.be/en' },

  // Turkey - Champions League
  { club: 'Galatasaray', stadium: 'RAMS Park', city: 'Istanbul, Turkey', coordinates: [28.7674, 41.0653], website: 'https://www.galatasaray.org/en' },

  // Czech Republic - Champions League
  { club: 'Slavia Praha', stadium: 'Sinobo Stadium', city: 'Prague, Czech Republic', coordinates: [14.4727, 50.0674], website: 'https://www.slavia.cz/en' },

  // Norway - Champions League
  { club: 'Bodo/Glimt', stadium: 'Aspmyra Stadion', city: 'Bodo, Norway', coordinates: [14.4059, 67.2884], website: 'https://www.bodo-glimt.no' },

  // Greece - Champions League
  { club: 'Olympiacos', stadium: 'Georgios Karaiskakis Stadium', city: 'Piraeus, Greece', coordinates: [23.6683, 37.9364], website: 'https://www.olympiacosfc.gr/en' },

  // Denmark - Champions League
  { club: 'FC Copenhagen', stadium: 'Parken Stadium', city: 'Copenhagen, Denmark', coordinates: [12.5787, 55.7026], website: 'https://www.fck.dk/en' },

  // Europa League clubs
  { club: 'AS Roma', stadium: 'Stadio Olimpico', city: 'Rome, Italy', coordinates: [12.4545, 41.9339], website: 'https://www.asroma.com/en' },
  { club: 'FC Porto', stadium: 'Estadio do Dragao', city: 'Porto, Portugal', coordinates: [-8.5836, 41.1611], website: 'https://www.fcporto.pt/en' },
  { club: 'Feyenoord', stadium: 'De Kuip', city: 'Rotterdam, Netherlands', coordinates: [4.5231, 51.8939], website: 'https://www.feyenoord.com/en' },
  { club: 'Lille', stadium: 'Stade Pierre-Mauroy', city: 'Lille, France', coordinates: [3.1305, 50.6113], website: 'https://www.losc.fr/en' },
  { club: 'Dinamo Zagreb', stadium: 'Stadion Maksimir', city: 'Zagreb, Croatia', coordinates: [16.0124, 45.8151], website: 'https://www.gnkdinamo.hr/en' },
  { club: 'Real Betis', stadium: 'Estadio Benito Villamarin', city: 'Seville, Spain', coordinates: [-5.9811, 37.3561], website: 'https://www.realbetisbalompie.es/en' },
  { club: 'Red Bull Salzburg', stadium: 'Red Bull Arena', city: 'Salzburg, Austria', coordinates: [13.0636, 47.8222], website: 'https://www.redbulls.com/salzburg/en' },
  { club: 'Fenerbahce', stadium: 'Ulker Stadium', city: 'Istanbul, Turkey', coordinates: [29.0414, 40.9895], website: 'https://www.fenerbahce.org/en' },
  { club: 'SC Braga', stadium: 'Estadio Municipal de Braga', city: 'Braga, Portugal', coordinates: [-8.4258, 41.5578], website: 'https://www.scbraga.pt/en' },
  { club: 'Red Star Belgrade', stadium: 'Rajko Mitic Stadium', city: 'Belgrade, Serbia', coordinates: [20.4633, 44.7842], website: 'https://www.crvenazvezdafk.com/en' },
  { club: 'Lyon', stadium: 'Groupama Stadium', city: 'Lyon, France', coordinates: [4.9819, 45.7654], website: 'https://www.ol.fr/en' },
  { club: 'PAOK', stadium: 'Toumba Stadium', city: 'Thessaloniki, Greece', coordinates: [22.9670, 40.5988], website: 'https://www.paokfc.gr/en' },
  { club: 'SC Freiburg', stadium: 'Europa-Park Stadion', city: 'Freiburg, Germany', coordinates: [7.9128, 48.0220], website: 'https://www.scfreiburg.com/en' },
  { club: 'Lazio', stadium: 'Stadio Olimpico', city: 'Rome, Italy', coordinates: [12.4545, 41.9339], website: 'https://www.sslazio.it/en' },
  { club: 'Rayo Vallecano', stadium: 'Campo de Futbol de Vallecas', city: 'Madrid, Spain', coordinates: [-3.6580, 40.3919], website: 'https://www.rayovallecano.es/en' },
  { club: 'AZ Alkmaar', stadium: 'AFAS Stadion', city: 'Alkmaar, Netherlands', coordinates: [4.7404, 52.6123], website: 'https://www.az.nl/en' },
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
      center: [10.0, 51.0],
      zoom: 3.5,
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

        new mapboxgl.Popup({ offset: 25 })
          .setLngLat(coords)
          .setHTML(
            `<div style="font-family:sans-serif;padding:4px 6px">
              <strong style="font-size:14px">${props.club}</strong><br/>
              <span style="font-size:12px;color:#aaa">${props.stadium}</span><br/>
              <span style="font-size:12px;color:#aaa">${props.city}</span><br/><br/>
              <button onclick="window.open('${props.website}','_blank')" style="background:#fff;color:#000;border:none;padding:6px 12px;font-size:13px;font-weight:600;cursor:pointer;border-radius:4px">
                Visit club website &rarr;</button>
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