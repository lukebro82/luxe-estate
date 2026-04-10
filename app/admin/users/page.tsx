import { getAllUsers } from "@/app/actions/admin";
import AdminUsersClient from "./AdminUsersClient";
import { getDictionary } from "@/app/utils/i18n";

export default async function AdminUsersPage() {
  const { users, error } = await getAllUsers();
  const dict = await getDictionary();

  return (
    <div>
      <AdminUsersClient initialUsers={users} loadError={error} dict={dict} />
    </div>
  );
}
