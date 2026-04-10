"use client";

interface StatsOverviewProps {
  stats: Array<{
    label: string;
    value: number | string;
    icon: string;
    bgColor: string;
  }>;
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white p-5 rounded-xl border border-primary/10 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
        >
          <div>
            <p className="text-sm font-medium text-nordic-muted">
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-nordic-dark mt-1">
              {stat.value}
            </p>
          </div>
          <div
            className={`h-10 w-10 rounded-full flex items-center justify-center text-primary ${stat.bgColor}`}
          >
            <span className="material-icons">{stat.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
