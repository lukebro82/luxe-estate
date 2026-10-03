import { supabase } from "./supabase";
import { Property, PropertyFilters, AgentProfile } from "@/types/property";

export const PAGE_SIZE = 8;

export const DEFAULT_AGENT: AgentProfile = {
  id: "default-agent",
  name: "Sarah Jenkins",
  email: "sarah.jenkins@luxeestate.com",
  phone: "+1 (604) 555-0192",
  avatar_url:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD4TxUmdQRb2VMjuaNxLEwLorv_dgHzoET2_wL5toSvew6nhtziaR3DX-U69DBN7J74yO6oKokpw8tqEFutJf13MeXghCy7FwZuAxnoJel6FYcKeCRUVinpZtrNnkZvXd-MY5_2MAtRD7JP5BieHixfCaeAPW04jm-y-nvF3HIrwcZ_HRDk_MrNP5WiPV3u9zNrEgM-SQoWGh4xLVSV444aZAbVl03mjjsW5WBpIeodCyqJxprTDp6Q157D06VxcdUSCf-l9UKQT-w",
  role: "agent",
};

export async function getAgentProfile(
  userId?: string | null,
): Promise<AgentProfile> {
  if (!userId) return DEFAULT_AGENT;

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !data) {
      return DEFAULT_AGENT;
    }

    return {
      id: data.id,
      name: data.name || DEFAULT_AGENT.name,
      email: data.email || DEFAULT_AGENT.email,
      phone: data.phone || DEFAULT_AGENT.phone,
      avatar_url: data.avatar_url || DEFAULT_AGENT.avatar_url,
      role: data.role || "agent",
    };
  } catch {
    return DEFAULT_AGENT;
  }
}

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
  pageSize: number = PAGE_SIZE,
  filters: PropertyFilters = {},
): Promise<{ properties: Property[]; totalCount: number }> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("properties")
    .select("*", { count: "exact" })
    .eq("featured", false)
    .order("created_at", { ascending: true });

  // Text search: match title OR location
  if (filters.query && filters.query.trim() !== "") {
    query = query.or(
      `title.ilike.%${filters.query}%,location.ilike.%${filters.query}%`,
    );
  }

  // Category filter (House, Apartment, Villa, Penthouse…)
  if (filters.category && filters.category !== "All") {
    query = query.eq("category", filters.category);
  }

  // Type filter (sale, rent, sold)
  if (filters.type) {
    query = query.eq("type", filters.type);
  }

  // Price range
  if (filters.minPrice !== undefined) {
    query = query.gte("price", filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    query = query.lte("price", filters.maxPrice);
  }

  // Beds / Baths minimum
  if (filters.minBeds !== undefined && filters.minBeds > 0) {
    query = query.gte("beds", filters.minBeds);
  }
  if (filters.minBaths !== undefined && filters.minBaths > 0) {
    query = query.gte("baths", filters.minBaths);
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    console.error("Error fetching properties:", error.message);
    return { properties: [], totalCount: 0 };
  }

  return {
    properties: data as Property[],
    totalCount: count ?? 0,
  };
}

export async function getPropertyBySlug(
  slug: string,
): Promise<Property | null> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    console.error("Error fetching property by slug:", error?.message);
    return null;
  }

  const property = data as Property;
  property.agent = await getAgentProfile(property.created_by);

  return property;
}
