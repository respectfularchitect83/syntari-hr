import { getSession } from "@/lib/auth/session"
import { redirect, cookies } from "next/navigation"
import TeamManagement from "@/components/dashboard/team-management"
import { PrismaClient } from "@prisma/client"

export default async function TeamPage() {
  const session = await getSession()
  if (!session?.user) {
    redirect("/auth/signin")
  }
  // Get org_subdomain from cookies
  const cookieStore = cookies()
  const subdomain = cookieStore.get("org_subdomain")?.value
  let org = null
  if (subdomain) {
    const prisma = new PrismaClient()
    org = await prisma.organization.findUnique({ where: { subdomain } })
  }
  return <TeamManagement session={session} org={org} />
} 