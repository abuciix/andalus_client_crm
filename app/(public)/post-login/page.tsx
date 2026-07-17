import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";

export default async function PostLoginPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  redirect(user.role === "STAFF" ? "/staff/dashboard" : "/portal");
}
