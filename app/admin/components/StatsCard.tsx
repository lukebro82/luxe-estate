interface StatsCardProps {
  title: string;
  value: number | string;
  icon: string;
  color: "green" | "teal" | "emerald" | "cyan";
  subtitle?: string;
}

const colorMap = {
  green: {
    bg: "bg-[#D9ECC8]/60",
    icon: "text-[#006655]",
    accent: "bg-[#006655]",
  },
  teal: {
    bg: "bg-[#006655]/10",
    icon: "text-[#006655]",
    accent: "bg-[#06f9d0]",
  },
  emerald: {
    bg: "bg-emerald-50",
    icon: "text-emerald-600",
    accent: "bg-emerald-500",
  },
  cyan: {
    bg: "bg-cyan-50",
    icon: "text-cyan-600",
    accent: "bg-cyan-500",
  },
};

export default function StatsCard({ title, value, icon, color, subtitle }: StatsCardProps) {
  const c = colorMap[color];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-5 hover:shadow-md transition-shadow duration-300 group">
      <div className={`w-14 h-14 rounded-2xl ${c.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
        <span className={`material-icons text-3xl ${c.icon}`}>{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#5C706D] mb-1">{title}</p>
        <p className="text-3xl font-bold text-[#19322F] tracking-tight">{value}</p>
        {subtitle && (
          <p className="text-xs text-[#5C706D] mt-1">{subtitle}</p>
        )}
      </div>
      <div className={`w-1 h-full min-h-12 rounded-full ${c.accent} opacity-30 self-stretch`} />
    </div>
  );
}
