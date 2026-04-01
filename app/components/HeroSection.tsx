"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchFiltersModal from "./SearchFiltersModal";

const CATEGORIES = ["All", "House", "Apartment", "Villa", "Penthouse"];

export default function HeroSection() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchText, setSearchText] = useState(searchParams.get("q") ?? "");
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") ?? "All"
  );

  // Sync state when URL changes (e.g. after modal applies filters)
  useEffect(() => {
    setSearchText(searchParams.get("q") ?? "");
    setActiveCategory(searchParams.get("category") ?? "All");
  }, [searchParams]);

  const buildUrl = useCallback(
    (overrides: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      // Reset page on new search
      params.delete("page");
      Object.entries(overrides).forEach(([k, v]) => {
        if (v === undefined || v === "" || v === "All") params.delete(k);
        else params.set(k, v);
      });
      return `/?${params.toString()}`;
    },
    [searchParams]
  );

  const handleSearch = () => {
    router.push(buildUrl({ q: searchText }));
  };

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    router.push(buildUrl({ category: cat }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <>
      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-nordic-dark leading-tight">
            Find your{" "}
            <span className="relative inline-block">
              <span className="relative z-10 font-medium">sanctuary</span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-mosque/20 -rotate-1 z-0"></span>
            </span>
            .
          </h1>

          {/* Search bar */}
          <div className="relative group max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="material-icons text-nordic-muted text-2xl group-focus-within:text-mosque transition-colors">
                search
              </span>
            </div>
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="block w-full pl-12 pr-4 py-4 rounded-xl border-none bg-white text-nordic-dark shadow-soft placeholder-nordic-muted/60 focus:ring-2 focus:ring-mosque focus:bg-white transition-all text-lg"
              placeholder="Search by city, neighborhood, or address..."
              type="text"
            />
            <button
              onClick={handleSearch}
              className="absolute inset-y-2 right-2 px-6 bg-mosque hover:bg-mosque/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-mosque/20"
            >
              Search
            </button>
          </div>

          {/* Category pills */}
          <div className="flex items-center justify-center gap-3 overflow-x-auto hide-scroll py-2 px-4 -mx-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-nordic-dark text-white shadow-lg shadow-nordic-dark/10 -translate-y-0.5"
                    : "bg-white border border-nordic-dark/5 text-nordic-muted hover:text-nordic-dark hover:border-mosque/50 hover:bg-mosque/5"
                }`}
              >
                {cat}
              </button>
            ))}
            <div className="w-px h-6 bg-nordic-dark/10 mx-2"></div>
            <button
              onClick={() => setFiltersOpen(true)}
              className="whitespace-nowrap flex items-center gap-1 px-4 py-2 rounded-full text-nordic-dark font-medium text-sm hover:bg-black/5 transition-colors"
            >
              <span className="material-icons text-base">tune</span> Filters
            </button>
          </div>
        </div>
      </section>

      <SearchFiltersModal
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
      />
    </>
  );
}
