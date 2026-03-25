import { supabase } from "./supabase";
import { Property } from "../app/types/property";

export const PAGE_SIZE = 8;

export async function getFeaturedProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching featured properties:", error.message);
    return [];
  }

  return data as Property[];
}

export async function getProperties(
  page: number,
  pageSize: number = PAGE_SIZE
): Promise<{ properties: Property[]; totalCount: number }> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("properties")
    .select("*", { count: "exact" })
    .eq("featured", false)
    .order("created_at", { ascending: true })
    .range(from, to);

  if (error) {
    console.error("Error fetching properties:", error.message);
    return { properties: [], totalCount: 0 };
  }

  return {
    properties: data as Property[],
    totalCount: count ?? 0,
  };
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching property by slug:", error.message);
    return null;
  }

  return data as Property;
}
