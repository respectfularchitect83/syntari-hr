import { getSession } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import DashboardPage from "@/components/dashboard/dashboard-page"

export default async function Dashboard() {
  const session = await getSession()
  if (!session?.user) {
    redirect("/auth/signin")
  }
  return <DashboardPage session={session} />
}
