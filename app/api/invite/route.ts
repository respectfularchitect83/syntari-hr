import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { randomBytes } from 'crypto'
import { Resend } from 'resend'

const prisma = new PrismaClient()
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { email, role, organizationId, invitedBy } = await req.json()
    if (!email || !role || !organizationId || !invitedBy) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 })
    }
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists.' }, { status: 400 })
    }
    // Create invite token
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days
    const invite = await prisma.invite.create({
      data: {
        email,
        role,
        organizationId,
        invitedBy,
        status: 'PENDING',
        createdAt: new Date(),
        expiresAt,
        id: token,
      },
    })
    // Get org subdomain
    const org = await prisma.organization.findUnique({ where: { id: organizationId } })
    // Send invite email
    if (org?.subdomain) {
      const inviteUrl = `https://${org.subdomain}.yourdomain.com/auth/accept-invite?token=${token}`
      await resend.emails.send({
        from: 'noreply@yourdomain.com',
        to: email,
        subject: `You're invited to join ${org.name} on SyntariHR!`,
        html: `<p>You have been invited to join <b>${org.name}</b> as <b>${role}</b>.<br />
          Click <a href="${inviteUrl}">here</a> to accept your invite and set your password.<br /><br />
          Or copy and paste this link in your browser:<br />
          <code>${inviteUrl}</code><br /><br />
          This invite will expire in 7 days.</p>`
      })
    }
    return NextResponse.json({ message: 'Invite sent successfully.' }, { status: 200 })
  } catch (error) {
    console.error('Invite error:', error)
    return NextResponse.json({ message: 'Failed to send invite.' }, { status: 500 })
  }
} 