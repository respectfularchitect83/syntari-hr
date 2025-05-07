import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')
  if (!token) {
    return NextResponse.json({ success: false, message: 'Missing token.' }, { status: 400 })
  }
  const verification = await prisma.verificationToken.findUnique({ where: { token } })
  if (!verification) {
    return NextResponse.json({ success: false, message: 'Invalid or expired token.' }, { status: 400 })
  }
  if (verification.expires < new Date()) {
    return NextResponse.json({ success: false, message: 'Token expired.' }, { status: 400 })
  }
  // Mark user as verified
  await prisma.user.update({
    where: { email: verification.identifier },
    data: { emailVerified: new Date() },
  })
  // Delete the token
  await prisma.verificationToken.delete({ where: { token } })
  return NextResponse.json({ success: true, message: 'Email verified successfully.' })
} 