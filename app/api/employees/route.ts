import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Helper to get org by subdomain from cookies
async function getOrgFromRequest(req: Request) {
  const cookieHeader = req.headers.get('cookie') || ''
  const match = cookieHeader.match(/org_subdomain=([^;]+)/)
  if (!match) return null
  const subdomain = decodeURIComponent(match[1])
  return await prisma.organization.findUnique({ where: { subdomain } })
}

export async function GET(req: Request) {
  const org = await getOrgFromRequest(req)
  if (!org) return NextResponse.json([], { status: 200 })
  const employees = await prisma.employee.findMany({
    where: { organizationId: org.id },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(employees)
}

export async function POST(req: Request) {
  const org = await getOrgFromRequest(req)
  if (!org) return NextResponse.json({ error: 'Organization not found' }, { status: 400 })
  const data = await req.json()
  const employee = await prisma.employee.create({
    data: { ...data, organizationId: org.id },
  })
  return NextResponse.json(employee, { status: 201 })
}

export async function PUT(req: Request) {
  const org = await getOrgFromRequest(req)
  if (!org) return NextResponse.json({ error: 'Organization not found' }, { status: 400 })
  const data = await req.json()
  if (!data.id) return NextResponse.json({ error: 'Employee ID required' }, { status: 400 })
  const employee = await prisma.employee.update({
    where: { id: data.id, organizationId: org.id },
    data: { ...data, organizationId: org.id },
  })
  return NextResponse.json(employee)
}

export async function DELETE(req: Request) {
  const org = await getOrgFromRequest(req)
  if (!org) return NextResponse.json({ error: 'Organization not found' }, { status: 400 })
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'Employee ID required' }, { status: 400 })
  await prisma.employee.delete({ where: { id, organizationId: org.id } })
  return NextResponse.json({ success: true })
} 