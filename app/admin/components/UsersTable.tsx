"use client";

import { useState, useTransition } from "react";
import { updateUserRole, type AdminUser } from "@/app/actions/admin";

export default function UsersTable({
  users,
  loadError,
}: {
  users: AdminUser[];
  loadError?: string;
}) {
  const [list, setList] = useState(users);
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");

  const filtered = list.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleChange = (userId: string, newRole: "admin" | "user") => {
    startTransition(async () => {
      const result = await updateUserRole(userId, newRole);
      if (!result.error) {
        setList((prev) =>
          prev.map((u) => (u.user_id === userId ? { ...u, role: newRole } : u))
        );
      }
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {loadError && (
        <div className="px-5 py-3 bg-amber-50 border-b border-amber-100 text-sm text-amber-900">
          <span className="font-semibold">No se pudo cargar la lista: </span>
          {loadError}
          <p className="mt-1 text-amber-800/90 text-xs">
            Ejecutá el SQL de{" "}
            <code className="rounded bg-amber-100/80 px-1">
              supabase/migrations/20260410170000_get_users_for_admin.sql
            </code>{" "}
            en el SQL Editor de Supabase si aún no existe la función RPC.
          </p>
        </div>
      )}
      {/* Header */}
      <div className="p-5 border-b border-gray-100 flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-[#5C706D] text-xl">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#006655]/30 focus:border-[#006655] bg-[#EEF6F6] text-[#19322F] placeholder-[#5C706D]"
          />
        </div>
        <span className="text-sm text-[#5C706D]">{filtered.length} usuarios</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#EEF6F6] text-[#5C706D] text-xs uppercase tracking-wider">
              <th className="text-left px-6 py-3 font-semibold">Usuario</th>
              <th className="text-left px-4 py-3 font-semibold">Email</th>
              <th className="text-left px-4 py-3 font-semibold">Registrado</th>
              <th className="text-center px-4 py-3 font-semibold">Rol actual</th>
              <th className="text-center px-4 py-3 font-semibold">Cambiar rol</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((u) => (
              <tr
                key={u.user_id}
                className="hover:bg-[#EEF6F6]/50 transition-colors duration-150"
              >
                {/* Avatar + Name */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-[#D9ECC8] flex items-center justify-center">
                      {u.avatar_url ? (
                        <img
                          src={u.avatar_url}
                          alt={u.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="material-icons text-[#006655] text-xl">
                          person
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-[#19322F] leading-tight">
                        {u.name}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="px-4 py-4 text-[#5C706D]">{u.email}</td>

                {/* Date */}
                <td className="px-4 py-4 text-[#5C706D]">
                  {formatDate(u.created_at)}
                </td>

                {/* Current role badge */}
                <td className="px-4 py-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                      u.role === "admin"
                        ? "bg-[#19322F] text-white"
                        : "bg-[#EEF6F6] text-[#5C706D]"
                    }`}
                  >
                    <span className="material-icons text-sm">
                      {u.role === "admin" ? "shield" : "person"}
                    </span>
                    {u.role === "admin" ? "Admin" : "Usuario"}
                  </span>
                </td>

                {/* Role selector */}
                <td className="px-4 py-4 text-center">
                  <div className="inline-flex rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                    <button
                      onClick={() => handleRoleChange(u.user_id, "user")}
                      disabled={isPending || u.role === "user"}
                      className={`px-3 py-1.5 text-xs font-semibold transition-all duration-200 flex items-center gap-1 ${
                        u.role === "user"
                          ? "bg-[#EEF6F6] text-[#19322F] cursor-default"
                          : "bg-white text-[#5C706D] hover:bg-[#EEF6F6] hover:text-[#19322F]"
                      } disabled:opacity-50`}
                    >
                      <span className="material-icons text-sm">person</span>
                      Usuario
                    </button>
                    <button
                      onClick={() => handleRoleChange(u.user_id, "admin")}
                      disabled={isPending || u.role === "admin"}
                      className={`px-3 py-1.5 text-xs font-semibold transition-all duration-200 flex items-center gap-1 border-l border-gray-200 ${
                        u.role === "admin"
                          ? "bg-[#19322F] text-white cursor-default"
                          : "bg-white text-[#5C706D] hover:bg-[#19322F] hover:text-white"
                      } disabled:opacity-50`}
                    >
                      <span className="material-icons text-sm">shield</span>
                      Admin
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-[#5C706D]">
                  <span className="material-icons text-4xl text-gray-200 block mb-2">
                    group_off
                  </span>
                  No se encontraron usuarios
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
