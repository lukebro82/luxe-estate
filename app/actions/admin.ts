"use server";

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AdminUser = {
  user_id: string;
  email: string;
  name: string;
  avatar_url: string;
  role: "admin" | "user" | "agent";
  created_at: string;
};

export type AdminStats = {
  totalProperties: number;
  totalUsers: number;
  totalAdmins: number;
  totalAgents: number;
  featuredProperties: number;
};

// ─── Stats ────────────────────────────────────────────────────────────────────

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = await createClient();

  const [
    { count: totalProperties },
    { count: featuredProperties },
    { data: roles },
  ] = await Promise.all([
    supabase.from("properties").select("*", { count: "exact", head: true }),
    supabase
      .from("properties")
      .select("*", { count: "exact", head: true })
      .eq("featured", true),
    supabase.from("user_roles").select("role"),
  ]);

  const totalUsers = roles?.length ?? 0;
  const totalAdmins = roles?.filter((r) => r.role === "admin").length ?? 0;
  const totalAgents = roles?.filter((r) => r.role === "agent").length ?? 0;

  return {
    totalProperties: totalProperties ?? 0,
    featuredProperties: featuredProperties ?? 0,
    totalUsers,
    totalAdmins,
    totalAgents,
  };
}

// ─── Users ────────────────────────────────────────────────────────────────────

export type GetAllUsersResult = {
  users: AdminUser[];
  error?: string;
};

export async function getAllUsers(): Promise<GetAllUsersResult> {
  const supabase = await createClient();

  const { data: authUsers, error: rpcError } = await supabase.rpc(
    "get_users_for_admin",
  );

  if (rpcError) {
    console.error("[getAllUsers] get_users_for_admin:", rpcError.message);
    return { users: [], error: rpcError.message };
  }

  const rows = Array.isArray(authUsers) ? authUsers : [];
  if (authUsers == null) {
    return { users: [], error: "La función no devolvió datos." };
  }

  const { data: roles } = await supabase
    .from("user_roles")
    .select("user_id, role, created_at");

  const roleMap: Record<string, "admin" | "user" | "agent"> = {};
  for (const r of roles ?? []) {
    roleMap[r.user_id] = r.role as "admin" | "user" | "agent";
  }

  const users = rows.map((u: Record<string, unknown>) => ({
    user_id: String(u.user_id),
    email: String(u.email ?? ""),
    name: String(u.name ?? u.email ?? "Unknown"),
    avatar_url: String(u.avatar_url ?? ""),
    role: roleMap[String(u.user_id)] ?? "user",
    created_at: String(u.created_at ?? ""),
  }));

  return { users };
}

// ─── Update Role ──────────────────────────────────────────────────────────────

export async function updateUserRole(
  userId: string,
  newRole: "admin" | "user" | "agent",
): Promise<{ error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: callerRole } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  // Validate role value
  if (!["admin", "user", "agent"].includes(newRole)) {
    return { error: "Invalid role" };
  }

  if (callerRole?.role !== "admin") return { error: "Not authorized" };

  const { error } = await supabase.rpc("update_user_role_admin", {
    target_user_id: userId,
    target_role: newRole,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/users");
  return {};
}

// ─── Properties ───────────────────────────────────────────────────────────────

export async function getAllAdminProperties() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [];
  return data;
}

export async function togglePropertyFeatured(
  propertyId: string,
  featured: boolean,
): Promise<{ error?: string }> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("properties")
    .update({ featured })
    .eq("id", propertyId);

  if (error) return { error: error.message };

  revalidatePath("/admin/properties");
  return {};
}

// ─── Property CRUD ────────────────────────────────────────────────────────────

export type PropertyFormData = {
  title: string;
  location: string;
  price: number;
  type: "sale" | "rent" | "sold";
  category?: string | null;
  beds: number;
  baths: number;
  size: number;
  parking?: number;
  year_built?: number | null;
  description?: string | null;
  amenities?: string[];
  images: string[];
};

function toSlug(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base}-${Date.now().toString(36)}`;
}

export async function getPropertyById(id: string): Promise<{
  property?: import("@/app/types/property").Property;
  error?: string;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return { error: error.message };
  return { property: data };
}

export async function createProperty(
  formData: PropertyFormData,
): Promise<{ id?: string; error?: string }> {
  const supabase = createAdminClient();

  const slug = toSlug(formData.title);

  const { data, error } = await supabase
    .from("properties")
    .insert({
      ...formData,
      slug,
      featured: false,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/admin/properties");
  revalidatePath("/");
  return { id: data.id };
}

export async function updateProperty(
  id: string,
  formData: PropertyFormData,
): Promise<{ error?: string }> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("properties")
    .update({ ...formData })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/properties");
  revalidatePath("/");
  return {};
}

export async function deleteProperty(id: string): Promise<{ error?: string }> {
  const supabase = createAdminClient();

  const { error } = await supabase.from("properties").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/properties");
  revalidatePath("/");
  return {};
}
