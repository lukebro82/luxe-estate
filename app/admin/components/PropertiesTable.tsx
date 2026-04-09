"use client";

import { useState, useTransition } from "react";
import { togglePropertyFeatured } from "@/app/actions/admin";

type Property = {
  id: string;
  title: string;
  location: string;
  price: number;
  type: string;
  category: string;
  beds: number;
  baths: number;
  size: number;
  featured: boolean;
  images: string[];
  slug: string;
  created_at: string;
};

export default function PropertiesTable({ properties }: { properties: Property[] }) {
  const [list, setList] = useState(properties);
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");

  const filtered = list.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleFeatured = (id: string, current: boolean) => {
    startTransition(async () => {
      await togglePropertyFeatured(id, !current);
      setList((prev) =>
        prev.map((p) => (p.id === id ? { ...p, featured: !current } : p))
      );
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Search bar */}
      <div className="p-5 border-b border-gray-100 flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-[#5C706D] text-xl">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar propiedades..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#006655]/30 focus:border-[#006655] bg-[#EEF6F6] text-[#19322F] placeholder-[#5C706D]"
          />
        </div>
        <span className="text-sm text-[#5C706D]">
          {filtered.length} propiedades
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#EEF6F6] text-[#5C706D] text-xs uppercase tracking-wider">
              <th className="text-left px-6 py-3 font-semibold">Propiedad</th>
              <th className="text-left px-4 py-3 font-semibold">Ubicación</th>
              <th className="text-left px-4 py-3 font-semibold">Precio</th>
              <th className="text-left px-4 py-3 font-semibold">Tipo</th>
              <th className="text-left px-4 py-3 font-semibold">Hab / Baños</th>
              <th className="text-center px-4 py-3 font-semibold">Destacado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((p) => (
              <tr
                key={p.id}
                className="hover:bg-[#EEF6F6]/50 transition-colors duration-150"
              >
                {/* Property */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      {p.images?.[0] ? (
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-icons text-gray-300 text-xl">image</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-[#19322F] leading-tight line-clamp-1">
                        {p.title}
                      </p>
                      <p className="text-xs text-[#5C706D] mt-0.5">{p.category}</p>
                    </div>
                  </div>
                </td>

                {/* Location */}
                <td className="px-4 py-4 text-[#5C706D]">
                  <div className="flex items-center gap-1">
                    <span className="material-icons text-sm">location_on</span>
                    {p.location}
                  </div>
                </td>

                {/* Price */}
                <td className="px-4 py-4">
                  <span className="font-bold text-[#19322F]">
                    ${p.price.toLocaleString("en-US")}
                  </span>
                  <span className="text-xs text-[#5C706D] ml-1">
                    {p.type === "rent" ? "/mes" : ""}
                  </span>
                </td>

                {/* Type */}
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      p.type === "sale"
                        ? "bg-[#D9ECC8] text-[#006655]"
                        : "bg-[#006655]/10 text-[#006655]"
                    }`}
                  >
                    {p.type === "sale" ? "Venta" : "Alquiler"}
                  </span>
                </td>

                {/* Beds/Baths */}
                <td className="px-4 py-4 text-[#5C706D]">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <span className="material-icons text-sm">bed</span>
                      {p.beds}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-icons text-sm">bathtub</span>
                      {p.baths}
                    </span>
                  </div>
                </td>

                {/* Featured toggle */}
                <td className="px-4 py-4 text-center">
                  <button
                    onClick={() => handleToggleFeatured(p.id, p.featured)}
                    disabled={isPending}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none disabled:opacity-50 ${
                      p.featured ? "bg-[#006655]" : "bg-gray-200"
                    }`}
                    title={p.featured ? "Quitar destacado" : "Marcar como destacado"}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                        p.featured ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-[#5C706D]">
                  <span className="material-icons text-4xl text-gray-200 block mb-2">
                    search_off
                  </span>
                  No se encontraron propiedades
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
