import { Property } from "../types/property";
import PropertyCard from "./PropertyCard";

interface FeaturedCollectionsProps {
  properties: Property[];
}

export default function FeaturedCollections({ properties }: FeaturedCollectionsProps) {
  return (
    <section className="mb-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light text-nordic-dark ">Featured Collections</h2>
          <p className="text-nordic-muted mt-1 text-sm">Curated properties for the discerning eye.</p>
        </div>
        <a className="hidden sm:flex items-center gap-1 text-sm font-medium text-mosque hover:opacity-70 transition-opacity" href="#">
          View all <span className="material-icons text-sm">arrow_forward</span>
        </a>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {properties.slice(0, 2).map(property => (
          <PropertyCard key={property.id} property={property} variant="featured" />
        ))}
      </div>
    </section>
  );
}
