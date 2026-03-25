export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  type: "sale" | "rent";
  beds: number;
  baths: number;
  size: number;
  image_url: string;
  tag?: string | null;
  featured: boolean;
  created_at: string;
  slug: string;
  images: string[];
}
