import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(_req: Request, { params }: { params: { orgId: string } }) {
  const invites = await prisma.invite.findMany({
    where: { organizationId: params.orgId },
    select: { id: true, email: true, role: true, status: true, createdAt: true, expiresAt: true },
  })
  return NextResponse.json(invites)
} 