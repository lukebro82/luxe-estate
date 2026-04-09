"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface SearchFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  dict: any;
}

const AMENITIES = [
  { id: "pool", icon: "pool", label: "Swimming Pool" },
  { id: "gym", icon: "fitness_center", label: "Gym" },
  { id: "parking", icon: "local_parking", label: "Parking" },
  { id: "ac", icon: "ac_unit", label: "Air Conditioning" },
  { id: "wifi", icon: "wifi", label: "High-speed Wifi" },
  { id: "terrace", icon: "deck", label: "Patio / Terrace" },
];

const PROPERTY_TYPES = ["Any Type", "House", "Apartment", "Villa", "Penthouse", "Condo", "Townhouse"];

const MIN = 100000;
const MAX = 10000000;

export default function SearchFiltersModal({ isOpen, onClose, dict }: SearchFiltersModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState(800000);
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [propertyType, setPropertyType] = useState("Any Type");
  const [beds, setBeds] = useState(0);
  const [baths, setBaths] = useState(0);
  const [amenities, setAmenities] = useState<Set<string>>(new Set());

  // Sync state from URL when modal opens
  useEffect(() => {
    if (!isOpen) return;
    setLocation(searchParams.get("q") ?? "");
    setMinPrice(searchParams.get("minPrice") ? parseInt(searchParams.get("minPrice")!, 10) : 800000);
    setMaxPrice(searchParams.get("maxPrice") ? parseInt(searchParams.get("maxPrice")!, 10) : 5000000);
    const cat = searchParams.get("category");
    setPropertyType(cat && PROPERTY_TYPES.includes(cat) ? cat : "Any Type");
    setBeds(searchParams.get("minBeds") ? parseInt(searchParams.get("minBeds")!, 10) : 0);
    setBaths(searchParams.get("minBaths") ? parseInt(searchParams.get("minBaths")!, 10) : 0);
  }, [isOpen, searchParams]);

  // Lock scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const toggleAmenity = (id: string) => {
    setAmenities(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const clearAll = () => {
    setLocation("");
    setMinPrice(800000);
    setMaxPrice(5000000);
    setPropertyType("Any Type");
    setBeds(0);
    setBaths(0);
    setAmenities(new Set());
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    params.delete("page");
    if (location.trim()) params.set("q", location.trim());
    if (propertyType !== "Any Type") params.set("category", propertyType);
    if (minPrice !== 800000) params.set("minPrice", String(minPrice));
    if (maxPrice !== 5000000) params.set("maxPrice", String(maxPrice));
    if (beds > 0) params.set("minBeds", String(beds));
    if (baths > 0) params.set("minBaths", String(baths));

    router.push(`/?${params.toString()}`);
    onClose();
  };

  const formatPrice = (v: number) =>
    "$" + (v >= 1000000 ? (v / 1000000).toFixed(1) + "M" : (v / 1000).toFixed(0) + "K");

  const minPct = ((minPrice - MIN) / (MAX - MIN)) * 100;
  const maxPct = ((maxPrice - MIN) / (MAX - MIN)) * 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <header className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-20">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">{dict.filters}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
            aria-label={dict.close}
          >
            <span className="material-icons">close</span>
          </button>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

          {/* Location */}
          <section>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {dict.location}
            </label>
            <div className="relative group">
              <span className="material-icons absolute left-4 top-3.5 text-gray-400 group-focus-within:text-mosque transition-colors">
                location_on
              </span>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder={dict.locationPlaceholder}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-mosque focus:bg-white transition-all shadow-sm"
              />
            </div>
          </section>

          {/* Price Range */}
          <section>
            <div className="flex justify-between items-end mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {dict.priceRange}
              </label>
              <span className="text-sm font-medium text-mosque">
                {formatPrice(minPrice)} – {formatPrice(maxPrice)}
              </span>
            </div>

            {/* Dual range slider */}
            <div className="relative h-12 flex items-center mb-6">
              <div className="absolute w-full h-1 bg-gray-200 rounded-full">
                <div
                  className="absolute h-full bg-mosque rounded-full"
                  style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
                />
              </div>
              <input
                type="range" min={MIN} max={MAX} step={50000} value={minPrice}
                onChange={e => { const v = Number(e.target.value); if (v < maxPrice - 100000) setMinPrice(v); }}
                className="absolute w-full appearance-none bg-transparent cursor-pointer z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-mosque [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-runnable-track]:h-0"
              />
              <input
                type="range" min={MIN} max={MAX} step={50000} value={maxPrice}
                onChange={e => { const v = Number(e.target.value); if (v > minPrice + 100000) setMaxPrice(v); }}
                className="absolute w-full appearance-none bg-transparent cursor-pointer z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-mosque [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-runnable-track]:h-0"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg border border-transparent focus-within:border-mosque/30 transition-colors">
                <label className="block text-[10px] text-gray-500 uppercase font-medium mb-1">{dict.minPrice}</label>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-1">$</span>
                  <input
                    type="text" value={minPrice.toLocaleString("en-US")}
                    onChange={e => { const v = Number(e.target.value.replace(/,/g, "")); if (!isNaN(v) && v < maxPrice) setMinPrice(v); }}
                    className="w-full bg-transparent border-0 p-0 text-gray-900 font-medium focus:ring-0 text-sm"
                  />
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-transparent focus-within:border-mosque/30 transition-colors">
                <label className="block text-[10px] text-gray-500 uppercase font-medium mb-1">{dict.maxPrice}</label>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-1">$</span>
                  <input
                    type="text" value={maxPrice.toLocaleString("en-US")}
                    onChange={e => { const v = Number(e.target.value.replace(/,/g, "")); if (!isNaN(v) && v > minPrice) setMaxPrice(v); }}
                    className="w-full bg-transparent border-0 p-0 text-gray-900 font-medium focus:ring-0 text-sm"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Property Details */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {dict.propertyType}
              </label>
              <div className="relative">
                <select
                  value={propertyType}
                  onChange={e => setPropertyType(e.target.value)}
                  className="w-full bg-gray-50 border-0 rounded-lg py-3 pl-4 pr-10 text-gray-900 appearance-none focus:ring-2 focus:ring-mosque cursor-pointer"
                >
                  {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
                <span className="material-icons absolute right-3 top-3 text-gray-400 pointer-events-none">expand_more</span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Beds */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">{dict.bedrooms}</span>
                <div className="flex items-center space-x-3 bg-gray-50 rounded-full p-1">
                  <button onClick={() => setBeds(b => Math.max(0, b - 1))} disabled={beds === 0}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-mosque disabled:opacity-40 transition-colors">
                    <span className="material-icons text-base">remove</span>
                  </button>
                  <span className="text-sm font-semibold w-6 text-center">{beds === 0 ? dict.any : `${beds}+`}</span>
                  <button onClick={() => setBeds(b => b + 1)}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-mosque hover:bg-mosque hover:text-white transition-colors">
                    <span className="material-icons text-base">add</span>
                  </button>
                </div>
              </div>
              {/* Baths */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">{dict.bathrooms}</span>
                <div className="flex items-center space-x-3 bg-gray-50 rounded-full p-1">
                  <button onClick={() => setBaths(b => Math.max(0, b - 1))} disabled={baths === 0}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-mosque disabled:opacity-40 transition-colors">
                    <span className="material-icons text-base">remove</span>
                  </button>
                  <span className="text-sm font-semibold w-6 text-center">{baths === 0 ? dict.any : `${baths}+`}</span>
                  <button onClick={() => setBaths(b => b + 1)}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-mosque hover:bg-mosque hover:text-white transition-colors">
                    <span className="material-icons text-base">add</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Amenities */}
          <section>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              {dict.amenities}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {AMENITIES.map(a => {
                const active = amenities.has(a.id);
                return (
                  <label key={a.id} className="cursor-pointer relative">
                    <input type="checkbox" checked={active} onChange={() => toggleAmenity(a.id)} className="sr-only peer" />
                    <div className={`h-full px-4 py-3 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all ${active ? "border-mosque bg-mosque/10 text-mosque font-medium" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}>
                      <span className={`material-icons text-lg ${active ? "text-mosque" : "text-gray-400"}`}>{a.icon}</span>
                      {dict.amenityLabels[a.id] || a.label}
                    </div>
                    {active && <div className="absolute top-2 right-2 w-2 h-2 bg-mosque rounded-full" />}
                  </label>
                );
              })}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 px-8 py-6 sticky bottom-0 z-20 flex items-center justify-between">
          <button
            onClick={clearAll}
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors underline decoration-gray-300 underline-offset-4"
          >
            {dict.clearAll}
          </button>
          <button
            onClick={applyFilters}
            className="bg-mosque hover:bg-mosque/90 text-white px-8 py-3 rounded-lg font-medium shadow-lg shadow-mosque/30 transition-all hover:shadow-mosque/40 flex items-center gap-2 active:scale-95"
          >
            {dict.showResults}
            <span className="material-icons text-sm">arrow_forward</span>
          </button>
        </footer>
      </div>
    </div>
  );
}
