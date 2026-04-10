import AdminDashboardClient from "./AdminDashboardClient";
import { getAdminStats } from "@/app/actions/admin";
import { getDictionary } from "@/app/utils/i18n";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();
  const dict = await getDictionary();

  return <AdminDashboardClient stats={stats} dict={dict} />;
}
