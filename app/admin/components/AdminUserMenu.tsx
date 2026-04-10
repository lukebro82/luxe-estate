"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface AdminUserMenuProps {
  name: string;
  avatarUrl: string;
}

export default function AdminUserMenu({ name, avatarUrl }: AdminUserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 focus:outline-none hover:opacity-80 transition-opacity"
      >
        <div className="text-right">
          <p className="text-sm font-semibold text-[#19322F] leading-tight">
            {name}
          </p>
          <p className="text-xs text-[#006655] font-medium">Administrador</p>
        </div>
        <img
          src={avatarUrl}
          alt={name}
          className="w-9 h-9 rounded-full ring-2 ring-[#006655]/30 object-cover"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 overflow-hidden">
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 font-medium"
          >
            <span className="material-icons text-[18px]">logout</span>
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
