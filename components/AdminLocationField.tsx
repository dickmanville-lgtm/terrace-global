'use client';

import { useState } from 'react';
import BarLocationPicker from './BarLocationPicker';

export default function AdminLocationField({
  initialLat = '',
  initialLng = '',
}: {
  initialLat?: string;
  initialLng?: string;
}) {
  const [lat, setLat] = useState(initialLat);
  const [lng, setLng] = useState(initialLng);

  return (
    <div>
      <label style={{ display: 'block', marginBottom: '0.5rem' }}>Location</label>
      <BarLocationPicker
        searchHint=""
        latitude={lat}
        longitude={lng}
        onLocationChange={(newLat, newLng) => {
          setLat(newLat);
          setLng(newLng);
        }}
      />
      <input type="hidden" name="latitude" value={lat} />
      <input type="hidden" name="longitude" value={lng} />
    </div>
  );
}