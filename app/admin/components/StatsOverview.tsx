"use client";

interface StatsOverviewProps {
  stats: Array<{
    label: string;
    value: number | string;
    icon: string;
    bgColor: string;
    iconColor?: string;
  }>;
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center justify-between"
        >
          <div className="flex flex-col">
            <p className="text-[13px] font-medium text-nordic-muted mb-1">
              {stat.label}
            </p>
            <p className="text-[28px] font-bold text-nordic-dark leading-none">
              {stat.value}
            </p>
          </div>
          <div
            className={`h-[42px] w-[42px] shrink-0 rounded-full flex items-center justify-center ${stat.iconColor || "text-primary"} ${stat.bgColor}`}
          >
            <span className="material-icons text-[22px]">{stat.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
