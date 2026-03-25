"use client";

import dynamic from "next/dynamic";

// Map needs to be client-side only because Leaflet relies on the window object
const PropertyMap = dynamic(() => import("./PropertyMap"), { ssr: false });

export default function MapWrapper(props: any) {
  return <PropertyMap {...props} />;
}
