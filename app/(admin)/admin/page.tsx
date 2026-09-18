import { redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import CategoryManager from "@/components/admin/category-manager";
import { isAdmin } from "./auth";

export const dynamic = "force-dynamic";

export default async function Admin() {
  if (!(await isAdmin())) redirect("/admin/login");
  return (
    <main>
      <AdminHeader />
      <CategoryManager />
    </main>
  );
}
