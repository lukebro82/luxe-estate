"use client";

import { useState, useTransition } from "react";
import { updateUserRole, type AdminUser } from "@/app/actions/admin";
import UserCard from "../components/UserCard";

interface AdminUsersClientProps {
  initialUsers: AdminUser[];
  loadError?: string;
  dict: any;
}

export default function AdminUsersClient({
  initialUsers,
  loadError,
  dict,
}: AdminUsersClientProps) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user" | "agent">("all");
  const [isPending, startTransition] = useTransition();

  const t = dict.admin;

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole =
      roleFilter === "all" ||
      (roleFilter === "admin" && u.role === "admin") ||
      (roleFilter === "user" && u.role === "user") ||
      (roleFilter === "agent" && u.role === "agent");

    return matchesSearch && matchesRole;
  });

  const handleRoleChange = (userId: string, newRole: "admin" | "user" | "agent") => {
    startTransition(async () => {
      const result = await updateUserRole(userId, newRole);
      if (!result.error) {
        setUsers((prev) =>
          prev.map((u) => (u.user_id === userId ? { ...u, role: newRole } : u)),
        );
      }
    });
  };

  const tabs = [
    { id: "all", label: t.users.allUsers, icon: "people" },
    { id: "admin", label: t.users.administrators, icon: "shield" },
    { id: "user", label: t.users.users, icon: "person" },
    { id: "agent", label: t.users.agents, icon: "support_agent" },
  ];

  return (
    <div>
      {loadError && (
        <div className="mb-6 px-6 py-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-900">
          <span className="font-semibold">{t.users.errorLoading}: </span>
          {loadError}
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-nordic-dark tracking-tight">
            {t.users.title}
          </h1>
          <p className="text-nordic-muted mt-1">{t.users.subtitle}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative group w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-icons text-nordic-muted group-focus-within:text-primary text-xl">
                search
              </span>
            </div>
            <input
              type="text"
              placeholder={t.users.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 rounded-lg bg-white text-nordic-dark shadow-sm border border-gray-200 placeholder-nordic-muted/50 focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm"
            />
          </div>
          <button className="inline-flex items-center justify-center px-4 py-2.5 border border-primary text-sm font-medium rounded-lg text-primary bg-transparent hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors whitespace-nowrap">
            <span className="material-icons text-lg mr-2">add</span>
            {t.users.addUser}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mt-8 flex gap-6 border-b border-nordic-muted/10 overflow-x-auto mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setRoleFilter(tab.id as "all" | "admin" | "user" | "agent")}
            className={`pb-3 text-sm font-semibold transition-colors whitespace-nowrap flex items-center gap-2 ${
              roleFilter === tab.id
                ? "text-primary border-b-2 border-primary"
                : "text-nordic-muted hover:text-nordic-dark"
            }`}
          >
            <span className="material-icons text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Users Grid */}
      <div className="space-y-4">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <span className="material-icons text-5xl text-nordic-muted/20 mb-3">
              people_outline
            </span>
            <p className="text-nordic-muted">{t.users.noUsers}</p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <UserCard
              key={user.user_id}
              user={user}
              isHighlighted={user.role === "admin"}
              onRoleChange={handleRoleChange}
              dict={t.common}
            />
          ))
        )}
      </div>
    </div>
  );
}
