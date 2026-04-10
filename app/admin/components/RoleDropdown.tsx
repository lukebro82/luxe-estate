"use client";

import { useEffect, useRef } from "react";
import { getRoleLabel } from "@/app/utils/roleUtils";

interface RoleDropdownProps {
  currentRole: "admin" | "user" | "agent";
  onSelectRole: (role: "admin" | "user" | "agent") => void;
  onClose: () => void;
  dict?: any;
}

const roleIconMap: Record<"admin" | "user" | "agent", string> = {
  admin: "shield",
  user: "person",
  agent: "support_agent",
};

export default function RoleDropdown({
  currentRole,
  onSelectRole,
  onClose,
  dict,
}: RoleDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const roles: Array<"admin" | "user" | "agent"> = ["admin", "user", "agent"];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2 w-48 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-[#006655] focus:outline-none overflow-hidden z-50 origin-top-right border border-[#005544]"
    >
      <div className="py-1" role="menu">
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => onSelectRole(role)}
            className={`group flex items-center w-full px-4 py-3 text-[13px] transition-colors ${
              currentRole === role
                ? "bg-[#005547] text-white font-medium"
                : "text-[#b2ccc6] hover:bg-[#005547] hover:text-white"
            }`}
            role="menuitem"
          >
            <span className="material-icons text-base mr-3 opacity-80 group-hover:opacity-100 transition-opacity">
              {roleIconMap[role]}
            </span>
            {getRoleLabel(role, dict)}
          </button>
        ))}
      </div>
    </div>
  );
}
