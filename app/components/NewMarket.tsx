import { Property } from "../types/property";
import { PropertyFilters } from "../types/property";
import PropertyCard from "./PropertyCard";
import Pagination from "./Pagination";

interface NewMarketProps {
  properties: Property[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  activeFilters: PropertyFilters;
  searchParams?: Record<string, string>;
}

export default function NewMarket({
  properties,
  currentPage,
  totalPages,
  totalCount,
  activeFilters,
  searchParams = {},
}: NewMarketProps) {
  const isFiltered =
    activeFilters.query ||
    (activeFilters.category && activeFilters.category !== "All") ||
    activeFilters.minPrice ||
    activeFilters.maxPrice ||
    activeFilters.minBeds ||
    activeFilters.minBaths;

  return (
    <section>
      <div className="flex items-end justify-between mb-8">
        <div>
          {isFiltered ? (
            <>
              <h2 className="text-2xl font-light text-nordic-dark">Search Results</h2>
              <p className="text-nordic-muted mt-1 text-sm">
                {totalCount} {totalCount === 1 ? "property" : "properties"} found
                {activeFilters.query ? ` for "${activeFilters.query}"` : ""}
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-light text-nordic-dark">New in Market</h2>
              <p className="text-nordic-muted mt-1 text-sm">Fresh opportunities added this week.</p>
            </>
          )}
        </div>
        <div className="hidden md:flex bg-white p-1 rounded-lg">
          <button className="px-4 py-1.5 rounded-md text-sm font-medium bg-nordic-dark text-white shadow-sm">All</button>
          <button className="px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic-dark">Buy</button>
          <button className="px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic-dark">Rent</button>
        </div>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-20 text-nordic-muted">
          <span className="material-icons text-5xl mb-4 block opacity-30">search_off</span>
          <p className="text-lg">No properties found matching your search.</p>
          <p className="text-sm mt-1">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} searchParams={searchParams} />
    </section>
  );
}
