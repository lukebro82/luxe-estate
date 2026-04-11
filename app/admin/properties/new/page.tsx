import PropertyFormClient from "../PropertyFormClient";

export const metadata = {
  title: "Add New Property | Admin",
};

export default function NewPropertyPage() {
  return <PropertyFormClient mode="create" />;
}
