"use client";

import { useState } from "react";
import type { AdminUser } from "@/app/actions/admin";
import { getRoleLabel } from "@/app/utils/roleUtils";
import RoleDropdown from "./RoleDropdown";

interface UserCardProps {
  user: AdminUser & { properties_count?: number; sales_ytd?: string };
  isHighlighted?: boolean;
  onRoleChange?: (userId: string, newRole: "admin" | "user" | "agent") => void;
  dict?: any;
}

const roleColorMap: Record<"admin" | "user" | "agent", Record<string, string>> = {
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
  dict,
}: UserCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const getRoleBadge = () => {
    const roleStyles = roleColorMap[user.role] || roleColorMap.user;
    return {
      ...roleStyles,
      label: getRoleLabel(user.role, dict),
    };
  };

  const roleBadge = getRoleBadge();

  const getStatusDot = () => {
    // For now, default to active. Later can be dynamic from additional user fields
    return "green";
  };

  const statusColor = getStatusDot();
  const statusBgMap: Record<string, string> = {
    green: "bg-green-400",
    yellow: "bg-yellow-400",
    gray: "bg-gray-400",
  };

  return (
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
                className="h-12 w-12 rounded-full object-cover border-2 border-white"
                src={user.avatar_url}
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-hint-green flex items-center justify-center border-2 border-white">
                <span className="material-icons text-primary text-lg">
                  person
                </span>
              </div>
            )}
            <span
              className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ${statusBgMap[statusColor]} ring-2 ring-white`}
            ></span>
          </div>
          <div className="ml-4 overflow-hidden">
            <div className="text-sm font-bold text-nordic-dark truncate">
              {user.name}
            </div>
            <div className="text-xs text-nordic-muted truncate">
              {user.email}
            </div>
            <div className="mt-1 text-[10px] px-2 py-0.5 inline-block bg-white/50 rounded text-nordic-muted">
              ID: #{user.user_id.split("-")[0].toUpperCase()}
            </div>
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
          <div className="flex items-center text-xs text-nordic-muted">
            <span className="material-icons text-sm mr-1 text-primary">
              check_circle
            </span>
            {dict?.active || "Active"}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="col-span-12 md:col-span-3 w-full grid grid-cols-2 gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-nordic-muted">
              {dict?.properties || "Properties"}
            </div>
            <div className="text-sm font-semibold text-nordic-dark">
              {user.properties_count ?? 0}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-nordic-muted">
              {dict?.salesYTD || "Sales (YTD)"}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="col-span-12 md:col-span-2 w-full flex justify-end relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="inline-flex items-center px-4 py-2 border border-nordic-muted/20 bg-white shadow-sm text-xs font-medium rounded-lg text-nordic-dark hover:bg-nordic-dark hover:text-white focus:outline-none transition-colors w-full md:w-auto justify-center group-hover:bg-white group-hover:shadow-sm"
          >
            {dict?.changeRole || "Change Role"}
            <span className="material-icons text-base ml-2">
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
  );
}
