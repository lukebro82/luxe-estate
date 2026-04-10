"use client";

import { useState, useTransition } from "react";
import { togglePropertyFeatured } from "@/app/actions/admin";
import type { Property } from "@/app/types/property";
import PropertyCard from "../components/PropertyCard";
import StatsOverview from "../components/StatsOverview";

interface AdminPropertiesClientProps {
  properties: Property[];
  dict: any;
}

export default function AdminPropertiesClient({
  properties,
  dict,
}: AdminPropertiesClientProps) {
  const [list, setList] = useState(properties);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredProperties = list.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleToggleFeatured = (id: string, current: boolean) => {
    startTransition(async () => {
      const result = await togglePropertyFeatured(id, !current);
      if (!result.error) {
        setList((prev) =>
          prev.map((p) => (p.id === id ? { ...p, featured: !current } : p)),
        );
      }
    });
  };

  const t = dict.admin;

  const stats = [
    {
      label: t.properties.totalListings,
      value: list.length,
      icon: "domain",
      bgColor: "bg-[#e5f0ee]",
      iconColor: "text-[#004135]",
    },
    {
      label: t.properties.activeProperties,
      value: list.filter((p) => p.type === "sale").length,
      icon: "check_circle",
      bgColor: "bg-[#d9ecc8]",
      iconColor: "text-[#006655]",
    },
    {
      label: t.properties.rentalProperties,
      value: list.filter((p) => p.type === "rent").length,
      icon: "pending",
      bgColor: "bg-[#ffe5cc]",
      iconColor: "text-[#ed6c02]",
    },
  ];

  return (
    <div>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-nordic-dark tracking-tight">
            {t.properties.title}
          </h1>
          <p className="text-nordic-muted mt-1">{t.properties.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-gray-200 text-nordic-dark hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm inline-flex items-center gap-2">
            <span className="material-icons text-base">filter_list</span>{" "}
            {t.properties.filter}
          </button>
          <button className="bg-[#006655] hover:bg-[#005544] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2">
            <span className="material-icons text-base">add</span>{" "}
            {t.properties.addNew}
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <StatsOverview stats={stats} />

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative w-full max-w-sm">
          <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-nordic-muted text-xl">
            search
          </span>
          <input
            type="text"
            placeholder={t.properties.searchPlaceholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-white text-nordic-dark shadow-sm placeholder-nordic-muted/50 focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
          />
        </div>
      </div>

      {/* Properties List Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header - Hidden on Mobile */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-nordic-muted uppercase tracking-wider">
          <div className="col-span-6">{t.properties.propertyDetails}</div>
          <div className="col-span-2">{t.properties.price}</div>
          <div className="col-span-2">{t.properties.status}</div>
          <div className="col-span-2 text-right">{t.properties.actions}</div>
        </div>

        {/* Properties Grid */}
        <div className="space-y-0 divide-y divide-gray-100">
          {paginatedProperties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-6">
              <span className="material-icons text-5xl text-nordic-muted/20 mb-3">
                home_outline
              </span>
              <p className="text-nordic-muted">{t.properties.noProperties}</p>
            </div>
          ) : (
            paginatedProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onEdit={() => console.log("Edit", property.id)}
                onDelete={() => console.log("Delete", property.id)}
                onToggleFeatured={handleToggleFeatured}
                dict={dict}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredProperties.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="text-sm text-nordic-muted">
              {t.properties.showing}{" "}
              <span className="font-medium text-nordic-dark">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              {t.properties.to}{" "}
              <span className="font-medium text-nordic-dark">
                {Math.min(
                  currentPage * itemsPerPage,
                  filteredProperties.length,
                )}
              </span>{" "}
              {t.properties.of}{" "}
              <span className="font-medium text-nordic-dark">
                {filteredProperties.length}
              </span>{" "}
              {t.properties.results}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-200 rounded-md text-nordic-muted hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t.properties.previous || "Anterior"}
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-200 rounded-md text-nordic-muted hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t.properties.next || "Siguiente"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
