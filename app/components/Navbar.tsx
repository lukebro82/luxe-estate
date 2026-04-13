import Link from "next/link";
import LanguageSelector from "./LanguageSelector";
import { getDictionary, getLocale } from "@/app/utils/i18n";
import UserMenu from "./UserMenu";
import { createClient } from "@/utils/supabase/server";

export default async function Navbar() {
  const dict = await getDictionary();
  const locale = await getLocale();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();
    isAdmin = roleData?.role === "admin";
  }

  return (
    <nav className="sticky top-0 z-50 bg-background-light/95  backdrop-blur-md border-b border-nordic-dark/10 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link
            href="/"
            className="shrink-0 flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-nordic-dark flex items-center justify-center">
              <span className="material-icons text-white text-lg">
                apartment
              </span>
            </div>
            <span className="text-xl font-semibold tracking-tight text-nordic-dark ">
              LuxeEstate
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <a
              className="text-mosque font-medium text-sm border-b-2 border-mosque px-1 py-1"
              href="/"
            >
              {dict.navbar.all}
            </a>
            <a
              className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all"
              href="#"
            >
              {dict.navbar.buy}
            </a>
            <a
              className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all"
              href="#"
            >
              {dict.navbar.rent}
            </a>
            <a
              className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all"
              href="#"
            >
              {dict.navbar.savedHomes}
            </a>
          </div>
          <div className="flex items-center space-x-6">
            <LanguageSelector currentLocale={locale} />
            <button className="text-nordic-dark hover:text-mosque   transition-colors">
              <span className="material-icons">search</span>
            </button>
            <button className="text-nordic-dark hover:text-mosque   transition-colors relative">
              <span className="material-icons">notifications_none</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-background-light "></span>
            </button>
            <UserMenu
              user={user}
              signInText={dict.navbar.signIn}
              isAdmin={isAdmin}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
