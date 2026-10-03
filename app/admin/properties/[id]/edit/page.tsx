import { notFound } from "next/navigation";
import { getPropertyById, getAllUsers } from "@/app/actions/admin";
import PropertyFormClient from "../../PropertyFormClient";

interface EditPropertyPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Edit Property | Admin",
};

export default async function EditPropertyPage({
  params,
}: EditPropertyPageProps) {
  const { id } = await params;
  const [{ property, error }, { users = [] }] = await Promise.all([
    getPropertyById(id),
    getAllUsers(),
  ]);

  if (error || !property) {
    notFound();
  }

  return <PropertyFormClient mode="edit" property={property} users={users} />;
}
