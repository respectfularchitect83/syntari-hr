import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: Request, { params }: { params: { orgId: string } }) {
  // Try to get org_subdomain from cookies
  const cookieHeader = req.headers.get('cookie') || ''
  const match = cookieHeader.match(/org_subdomain=([^;]+)/)
  let orgId = params.orgId
  if (match) {
    const subdomain = decodeURIComponent(match[1])
    const org = await prisma.organization.findUnique({ where: { subdomain } })
    if (org) orgId = org.id
  }
  const users = await prisma.user.findMany({
    where: { organizationId: orgId },
    select: { id: true, name: true, email: true, role: true, active: true },
  })
  return NextResponse.json(users)
} 