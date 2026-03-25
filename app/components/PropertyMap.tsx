"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';

interface PropertyMapProps {
  locationString: string;
  lat?: number;
  lng?: number;
}

export default function PropertyMap({ locationString, lat = 37.4419, lng = -122.1430 }: PropertyMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Fix for default Leaflet icon not showing up in React
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  if (!isClient) return <div className="w-full h-full min-h-75 bg-slate-100 flex items-center justify-center animate-pulse rounded-lg">Loading map...</div>;

  return (
    <div className="w-full h-full min-h-75 rounded-lg overflow-hidden relative z-0">
      <MapContainer 
        center={[lat, lng]} 
        zoom={13} 
        scrollWheelZoom={false}
        className="w-full h-full min-h-75 rounded-lg z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <Marker position={[lat, lng]}>
          <Popup>{locationString}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
