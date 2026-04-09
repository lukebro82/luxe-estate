"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/properties", label: "Propiedades", icon: "apartment" },
  { href: "/admin/users", label: "Usuarios", icon: "group" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#19322F] flex flex-col z-40 shadow-2xl">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-[#006655] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <span className="material-icons text-white text-xl">apartment</span>
          </div>
          <div>
            <p className="text-white font-semibold text-base leading-tight">LuxeEstate</p>
            <p className="text-white/40 text-xs">Panel Admin</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        <p className="text-white/30 text-xs font-semibold uppercase tracking-widest px-3 mb-4">
          Menú
        </p>
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-[#006655] text-white shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-white/8"
              }`}
            >
              <span
                className={`material-icons text-xl transition-transform duration-200 ${
                  isActive ? "scale-110" : "group-hover:scale-105"
                }`}
              >
                {item.icon}
              </span>
              {item.label}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#06f9d0]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Back to site */}
      <div className="px-4 py-5 border-t border-white/10">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/8 transition-all group"
        >
          <span className="material-icons text-xl group-hover:-translate-x-0.5 transition-transform">
            arrow_back
          </span>
          Volver al sitio
        </Link>
      </div>
    </aside>
  );
}
