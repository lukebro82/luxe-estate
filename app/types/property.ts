export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  type: "sale" | "rent";
  category?: string | null;
  beds: number;
  baths: number;
  size: number;
  tag?: string | null;
  featured: boolean;
  created_at: string;
  slug: string;
  images: string[];
}

export interface PropertyFilters {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  minBaths?: number;
}
