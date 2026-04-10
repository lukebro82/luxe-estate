import UsersTable from "../components/UsersTable";
import { getAllUsers } from "@/app/actions/admin";

export default async function AdminUsersPage() {
  const { users, error } = await getAllUsers();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#19322F] tracking-tight">
          Usuarios
        </h1>
        <p className="text-[#5C706D] mt-1">
          Gestiona los roles de los usuarios registrados
        </p>
      </div>

      <UsersTable users={users} loadError={error} />
    </div>
  );
}
