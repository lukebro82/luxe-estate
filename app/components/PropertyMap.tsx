"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';

interface PropertyMapProps {
  locationString: string;
}

export default function PropertyMap({ locationString }: PropertyMapProps) {
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    if (!locationString) return;

    fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationString)}&format=json&limit=1`,
      { headers: { 'Accept-Language': 'en' } }
    )
      .then((res) => res.json())
      .then((results) => {
        if (results && results.length > 0) {
          setCoords([parseFloat(results[0].lat), parseFloat(results[0].lon)]);
        }
      })
      .catch(() => {/* silently ignore geocoding errors */});
  }, [locationString]);

  if (!isClient || !coords) {
    return (
      <div className="w-full h-full min-h-75 bg-slate-100 flex items-center justify-center animate-pulse rounded-lg">
        Loading map...
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-75 rounded-lg overflow-hidden relative z-0">
      <MapContainer
        center={coords}
        zoom={14}
        scrollWheelZoom={false}
        className="w-full h-full min-h-75 rounded-lg z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <Marker position={coords}>
          <Popup>{locationString}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
