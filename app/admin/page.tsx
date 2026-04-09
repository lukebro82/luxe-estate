import StatsCard from "./components/StatsCard";
import { getAdminStats } from "@/app/actions/admin";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#19322F] tracking-tight">
          Dashboard
        </h1>
        <p className="text-[#5C706D] mt-1">
          Resumen general de LuxeEstate
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        <StatsCard
          title="Propiedades totales"
          value={stats.totalProperties}
          icon="apartment"
          color="green"
          subtitle="En el sistema"
        />
        <StatsCard
          title="Propiedades destacadas"
          value={stats.featuredProperties}
          icon="star"
          color="teal"
          subtitle="Visibles en portada"
        />
        <StatsCard
          title="Usuarios registrados"
          value={stats.totalUsers}
          icon="group"
          color="emerald"
          subtitle="Cuentas activas"
        />
        <StatsCard
          title="Administradores"
          value={stats.totalAdmins}
          icon="shield"
          color="cyan"
          subtitle="Con acceso total"
        />
      </div>

      {/* Quick access cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <a
          href="/admin/properties"
          className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#006655]/20 transition-all duration-300 flex items-center gap-5"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#D9ECC8]/60 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <span className="material-icons text-3xl text-[#006655]">apartment</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#19322F]">Gestionar propiedades</h2>
            <p className="text-sm text-[#5C706D]">
              Ver, buscar y marcar propiedades destacadas
            </p>
          </div>
          <span className="material-icons text-[#5C706D] ml-auto group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </a>

        <a
          href="/admin/users"
          className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#006655]/20 transition-all duration-300 flex items-center gap-5"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#006655]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <span className="material-icons text-3xl text-[#006655]">manage_accounts</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#19322F]">Gestionar usuarios</h2>
            <p className="text-sm text-[#5C706D]">
              Cambiar roles y ver usuarios registrados
            </p>
          </div>
          <span className="material-icons text-[#5C706D] ml-auto group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </a>
      </div>
    </div>
  );
}
