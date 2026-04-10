"use client";

import StatsCard from "./components/StatsCard";

interface AdminDashboardClientProps {
  stats: {
    totalProperties: number;
    featuredProperties: number;
    totalUsers: number;
    totalAdmins: number;
  };
  dict: any;
}

export default function AdminDashboardClient({
  stats,
  dict,
}: AdminDashboardClientProps) {
  const t = dict.admin.dashboard;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#19322F] tracking-tight">
          {t.title}
        </h1>
        <p className="text-[#5C706D] mt-1">{t.subtitle}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        <StatsCard
          title={t.totalProperties}
          value={stats.totalProperties}
          icon="apartment"
          color="green"
          subtitle={t.inTheSystem}
        />
        <StatsCard
          title={t.featuredProperties}
          value={stats.featuredProperties}
          icon="star"
          color="teal"
          subtitle={t.visibleOnHomepage}
        />
        <StatsCard
          title={t.registeredUsers}
          value={stats.totalUsers}
          icon="group"
          color="emerald"
          subtitle={t.activeAccounts}
        />
        <StatsCard
          title={t.administrators}
          value={stats.totalAdmins}
          icon="shield"
          color="cyan"
          subtitle={t.fullAccess}
        />
      </div>
    </div>
  );
}
