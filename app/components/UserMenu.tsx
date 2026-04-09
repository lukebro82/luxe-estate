"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

interface UserMenuProps {
  user: any;
  signInText: string;
  isAdmin?: boolean;
}

export default function UserMenu({ user, signInText, isAdmin }: UserMenuProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  if (!user) {
    return (
      <Link href="/login" className="flex items-center gap-2 pl-2 border-l border-nordic-dark/10 ml-2 text-sm font-medium hover:text-mosque transition-colors text-nordic-dark">
        {signInText}
      </Link>
    );
  }

  const avatarUrl = user.user_metadata?.avatar_url || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 pl-2 border-l border-nordic-dark/10 ml-2"
      >
        <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent hover:ring-mosque transition-all">
          <img alt="Profile" className="w-full h-full object-cover" src={avatarUrl} />
        </div>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1a3833] rounded-lg shadow-soft border border-gray-100 dark:border-primary/20 overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-primary/20">
              <p className="text-sm font-medium text-nordic dark:text-white truncate">
                {user.user_metadata?.name || user.email}
              </p>
            </div>
            {isAdmin && (
              <a
                href="/admin"
                className="block w-full text-left px-4 py-2 text-sm text-nordic-dark hover:bg-gray-50 dark:text-white dark:hover:bg-[#152e2a] transition-colors border-b border-gray-100 dark:border-primary/20"
              >
                Admin Panel
              </a>
            )}
            <button
              onClick={() => {
                setIsOpen(false);
                handleSignOut();
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50 dark:hover:bg-[#152e2a] transition-colors"
            >
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
