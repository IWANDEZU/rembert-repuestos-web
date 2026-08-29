import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import PosSyncPageClient from "./PosSyncPageClient";

export const dynamic = "force-dynamic";

export default async function PosSyncPage() {
  const session = await getServerSession();

  if (session?.user?.role !== "ADMIN") {
    redirect("/login");
  }

  return <PosSyncPageClient />;
}
