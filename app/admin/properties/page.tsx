import { getAllAdminProperties } from "@/app/actions/admin";
import AdminPropertiesClient from "./AdminPropertiesClient";
import { getDictionary } from "@/app/utils/i18n";

export default async function AdminPropertiesPage() {
  const properties = await getAllAdminProperties();
  const dict = await getDictionary();

  return (
    <div>
      <AdminPropertiesClient properties={properties as any} dict={dict} />
    </div>
  );
}
