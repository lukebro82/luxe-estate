import { Suspense } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeaturedCollections from "../components/FeaturedCollections";
import NewMarket from "../components/NewMarket";
import {
  getFeaturedProperties,
  getProperties,
  PAGE_SIZE,
} from "../../lib/properties";
import { getDictionary } from "../utils/i18n";

interface BuyProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    minBeds?: string;
    minBaths?: string;
  }>;
}

export default async function Buy({ searchParams }: BuyProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page ?? "1", 10));
  const dict = await getDictionary();

  const filters = {
    query: params.q,
    category: params.category,
    minPrice: params.minPrice ? parseInt(params.minPrice, 10) : undefined,
    maxPrice: params.maxPrice ? parseInt(params.maxPrice, 10) : undefined,
    minBeds: params.minBeds ? parseInt(params.minBeds, 10) : undefined,
    minBaths: params.minBaths ? parseInt(params.minBaths, 10) : undefined,
    type: "sale" as const,
  };

  const rawParams: Record<string, string> = {};
  if (params.q) rawParams.q = params.q;
  if (params.category) rawParams.category = params.category;
  if (params.minPrice) rawParams.minPrice = params.minPrice;
  if (params.maxPrice) rawParams.maxPrice = params.maxPrice;
  if (params.minBeds) rawParams.minBeds = params.minBeds;
  if (params.minBaths) rawParams.minBaths = params.minBaths;

  const hasActiveFilters = Boolean(
    params.q ||
    params.category ||
    params.minPrice ||
    params.maxPrice ||
    params.minBeds ||
    params.minBaths,
  );

  const [featuredProperties, { properties, totalCount }] = await Promise.all([
    getFeaturedProperties(),
    getProperties(currentPage, PAGE_SIZE, filters),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <>
      <Navbar activePath="/buy" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Suspense fallback={<div className="py-12 md:py-16 h-48" />}>
          <HeroSection dict={dict} />
        </Suspense>
        {!hasActiveFilters && (
          <FeaturedCollections
            properties={featuredProperties.slice(0, 2)}
            dict={dict.featured}
          />
        )}
        <NewMarket
          properties={properties}
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          activeFilters={filters}
          searchParams={rawParams}
          dict={dict.newMarket}
          basePath="/buy"
        />
      </main>
    </>
  );
}
