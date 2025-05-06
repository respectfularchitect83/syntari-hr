import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { token, name, password } = await req.json()
    if (!token || !name || !password) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 })
    }
    const invite = await prisma.invite.findUnique({ where: { id: token } })
    if (!invite || invite.status !== 'PENDING' || invite.expiresAt < new Date()) {
      return NextResponse.json({ message: 'Invalid or expired invite.' }, { status: 400 })
    }
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email: invite.email } })
    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists.' }, { status: 400 })
    }
    // Create user
    const hashedPassword = await bcrypt.hash(password, 10)
    await prisma.user.create({
      data: {
        name,
        email: invite.email,
        password: hashedPassword,
        role: invite.role,
        organizationId: invite.organizationId,
        active: true,
      },
    })
    // Mark invite as accepted
    await prisma.invite.update({ where: { id: token }, data: { status: 'ACCEPTED' } })
    // Get the org subdomain
    const org = await prisma.organization.findUnique({ where: { id: invite.organizationId } })
    return NextResponse.json({ message: 'Account created successfully.', subdomain: org?.subdomain }, { status: 200 })
  } catch (error) {
    console.error('Accept invite error:', error)
    return NextResponse.json({ message: 'Failed to accept invite.' }, { status: 500 })
  }
} 