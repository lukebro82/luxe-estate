"use client";

import { useState } from "react";
import type { AdminUser } from "@/app/actions/admin";
import { getRoleLabel } from "@/app/utils/roleUtils";
import RoleDropdown from "./RoleDropdown";
import EditUserProfileModal from "./EditUserProfileModal";

interface UserCardProps {
  user: AdminUser & { properties_count?: number; sales_ytd?: string };
  isHighlighted?: boolean;
  onRoleChange?: (userId: string, newRole: "admin" | "user" | "agent") => void;
  onProfileUpdate?: (
    userId: string,
    data: { name: string; phone: string; avatar_url: string },
  ) => Promise<void>;
  dict?: any;
}

const roleColorMap: Record<
  "admin" | "user" | "agent",
  { bg: string; text: string; icon: string }
> = {
  admin: {
    bg: "bg-nordic-dark",
    text: "text-white",
    icon: "shield",
  },
  user: {
    bg: "bg-blue-100",
    text: "text-blue-600",
    icon: "person",
  },
  agent: {
    bg: "bg-green-100",
    text: "text-green-600",
    icon: "support_agent",
  },
};

export default function UserCard({
  user,
  isHighlighted = false,
  onRoleChange,
  onProfileUpdate,
  dict,
}: UserCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const getRoleBadge = () => {
    const roleStyles = roleColorMap[user.role] || roleColorMap.user;
    return {
      ...roleStyles,
      label: getRoleLabel(user.role, dict),
    };
  };

  const roleBadge = getRoleBadge();

  const getStatusDot = () => {
    return "green";
  };

  const statusColor = getStatusDot();
  const statusBgMap: Record<string, string> = {
    green: "bg-[#29bf73]",
    yellow: "bg-[#f5c342]",
    gray: "bg-[#d1d5db]",
  };

  return (
    <>
      <div
        className={`user-card group relative rounded-xl p-5 shadow-sm border transition-all duration-200 ${
          isHighlighted
            ? "bg-hint-green border-primary/30"
            : "bg-white border-gray-100 hover:bg-hint-green"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* User Details */}
          <div className="col-span-12 md:col-span-4 flex items-center w-full">
            <div className="relative shrink-0">
              {user.avatar_url ? (
                <img
                  alt={user.name}
                  className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-xs"
                  src={user.avatar_url}
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-hint-green flex items-center justify-center border-2 border-white text-mosque font-bold">
                  {user.name ? user.name.slice(0, 2).toUpperCase() : "US"}
                </div>
              )}
              <span
                className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ${statusBgMap[statusColor]} ring-2 ring-white`}
              ></span>
            </div>
            <div className="ml-4 overflow-hidden">
              <div className="text-sm font-bold text-nordic-dark truncate flex items-center gap-2">
                <span>{user.name}</span>
                <button
                  type="button"
                  onClick={() => setShowEditModal(true)}
                  title="Editar perfil y teléfono"
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-mosque transition-opacity"
                >
                  <span className="material-icons text-sm">edit</span>
                </button>
              </div>
              <div className="text-xs text-nordic-muted truncate">
                {user.email}
              </div>
              {user.phone ? (
                <div className="text-xs text-mosque font-medium flex items-center gap-1 mt-0.5">
                  <span className="material-icons text-[13px]">phone</span>
                  <span>{user.phone}</span>
                </div>
              ) : (
                <div className="text-[11px] text-gray-400 italic mt-0.5">
                  Sin teléfono configurado
                </div>
              )}
            </div>
          </div>

          {/* Role & Status */}
          <div className="col-span-12 md:col-span-3 w-full flex items-center justify-between md:justify-start gap-4">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${roleBadge.bg} ${roleBadge.text}`}
            >
              <span className="material-icons text-sm mr-1">
                {roleBadge.icon}
              </span>
              {roleBadge.label}
            </span>
            <div className="flex items-center text-[13px] font-medium text-[#8b9d99]">
              <span className="material-icons text-[16px] mr-1.5 text-[#006655]">
                check_circle
              </span>
              {dict?.active || "Active"}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="col-span-12 md:col-span-2 w-full grid grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-nordic-muted">
                {dict?.properties || "Properties"}
              </div>
              <div className="text-sm font-semibold text-nordic-dark">
                {user.properties_count ?? 0}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="col-span-12 md:col-span-3 w-full flex items-center justify-end gap-2 relative">
            <button
              type="button"
              onClick={() => setShowEditModal(true)}
              className="inline-flex items-center px-3 py-2 border border-gray-200 shadow-xs text-xs font-medium rounded-lg text-nordic-dark bg-white hover:bg-gray-50 transition-colors"
            >
              <span className="material-icons text-sm mr-1 text-gray-500">
                edit
              </span>
              Editar Datos
            </button>

            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className={`inline-flex items-center px-3 py-2 border shadow-xs text-xs font-medium rounded-lg transition-colors justify-center ${
                showDropdown
                  ? "bg-[#006655] text-white border-[#006655]"
                  : "bg-white border-gray-200 text-[#19322f] hover:bg-gray-50"
              }`}
            >
              {dict?.changeRole || "Rol"}
              <span className="material-icons text-base ml-1">
                {showDropdown ? "expand_less" : "expand_more"}
              </span>
            </button>

            {showDropdown && (
              <RoleDropdown
                currentRole={user.role}
                onSelectRole={(newRole) => {
                  onRoleChange?.(user.user_id, newRole);
                  setShowDropdown(false);
                }}
                onClose={() => setShowDropdown(false)}
                dict={dict}
              />
            )}
          </div>
        </div>
      </div>

      {showEditModal && onProfileUpdate && (
        <EditUserProfileModal
          user={user}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={onProfileUpdate}
        />
      )}
    </>
  );
}
