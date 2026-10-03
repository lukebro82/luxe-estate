import { getAllUsers } from "@/app/actions/admin";
import PropertyFormClient from "../PropertyFormClient";

export const metadata = {
  title: "Add New Property | Admin",
};

export default async function NewPropertyPage() {
  const { users = [] } = await getAllUsers();
  return <PropertyFormClient mode="create" users={users} />;
}
