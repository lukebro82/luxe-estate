export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  type: "sale" | "rent" | "sold";
  category?: string | null;
  beds: number;
  baths: number;
  size: number;
  tag?: string | null;
  featured: boolean;
  created_at: string;
  slug: string;
  images: string[];
  description?: string | null;
  parking?: number | null;
  year_built?: number | null;
  amenities?: string[] | null;
}

export interface PropertyFilters {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  minBaths?: number;
  type?: "sale" | "rent" | "sold";
}
