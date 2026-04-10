import AdminSidebar from "./components/AdminSidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getDictionary } from "@/app/utils/i18n";

import AdminUserMenu from "./components/AdminUserMenu";

export const metadata = {
  title: "Admin Panel | LuxeEstate",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const dict = await getDictionary();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!roleData || roleData.role !== "admin") redirect("/");

  const avatarUrl =
    user.user_metadata?.avatar_url ||
    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";
  const name = user.user_metadata?.name || user.email || "Admin";

  return (
    <div className="min-h-screen bg-[#EEF6F6] flex">
      <AdminSidebar dict={dict} />

      {/* Main content */}
      <div className="ml-64 flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 h-16 flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="material-icons text-[#5C706D] text-sm">home</span>
            <span className="text-xs text-[#5C706D]">/</span>
            <span className="text-sm font-medium text-[#19322F]">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <AdminUserMenu name={name} avatarUrl={avatarUrl} />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
