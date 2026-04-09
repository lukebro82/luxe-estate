"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AdminUser = {
  user_id: string;
  email: string;
  name: string;
  avatar_url: string;
  role: "admin" | "user";
  created_at: string;
};

export type AdminStats = {
  totalProperties: number;
  totalUsers: number;
  totalAdmins: number;
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

  return {
    totalProperties: totalProperties ?? 0,
    featuredProperties: featuredProperties ?? 0,
    totalUsers,
    totalAdmins,
  };
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function getAllUsers(): Promise<AdminUser[]> {
  const supabase = await createClient();

  // Get auth user metadata via SECURITY DEFINER RPC
  const { data: authUsers, error: rpcError } = await supabase.rpc(
    "get_users_for_admin"
  );

  if (rpcError || !authUsers) return [];

  // Get roles for all users
  const { data: roles } = await supabase
    .from("user_roles")
    .select("user_id, role, created_at");

  const roleMap: Record<string, "admin" | "user"> = {};
  for (const r of roles ?? []) {
    roleMap[r.user_id] = r.role as "admin" | "user";
  }

  return (authUsers as any[]).map((u) => ({
    user_id: u.user_id,
    email: u.email ?? "",
    name: u.name ?? u.email ?? "Unknown",
    avatar_url: u.avatar_url ?? "",
    role: roleMap[u.user_id] ?? "user",
    created_at: u.created_at,
  }));
}

// ─── Update Role ──────────────────────────────────────────────────────────────

export async function updateUserRole(
  userId: string,
  newRole: "admin" | "user"
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

  if (callerRole?.role !== "admin") return { error: "Not authorized" };

  const { error } = await supabase
    .from("user_roles")
    .update({ role: newRole })
    .eq("user_id", userId);

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
  featured: boolean
): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("properties")
    .update({ featured })
    .eq("id", propertyId);

  if (error) return { error: error.message };

  revalidatePath("/admin/properties");
  return {};
}
