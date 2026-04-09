import PropertiesTable from "../components/PropertiesTable";
import { getAllAdminProperties } from "@/app/actions/admin";

export default async function AdminPropertiesPage() {
  const properties = await getAllAdminProperties();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#19322F] tracking-tight">
          Propiedades
        </h1>
        <p className="text-[#5C706D] mt-1">
          Gestiona todas las propiedades del sistema
        </p>
      </div>

      <PropertiesTable properties={properties as any} />
    </div>
  );
}
