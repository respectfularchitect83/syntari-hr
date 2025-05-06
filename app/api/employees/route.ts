import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: Request) {
  // Get org_subdomain from cookies
  const cookieHeader = req.headers.get('cookie') || ''
  const match = cookieHeader.match(/org_subdomain=([^;]+)/)
  if (!match) {
    return NextResponse.json([], { status: 200 })
  }
  const subdomain = decodeURIComponent(match[1])
  const org = await prisma.organization.findUnique({ where: { subdomain } })
  if (!org) {
    return NextResponse.json([], { status: 200 })
  }
  const employees = await prisma.user.findMany({
    where: { organizationId: org.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      // Add more fields as needed for your EmployeeCard
    },
  })
  return NextResponse.json(employees)
} 