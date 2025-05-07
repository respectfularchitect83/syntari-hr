import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { Resend } from 'resend'

const prisma = new PrismaClient()
const resend = new Resend(process.env.RESEND_API_KEY)

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 32)
}

async function getUniqueSubdomain(base: string) {
  let subdomain = slugify(base)
  let suffix = 1
  while (await prisma.organization.findUnique({ where: { subdomain } })) {
    subdomain = `${slugify(base)}${suffix}`
    suffix++
  }
  return subdomain
}

export async function POST(req: Request) {
  try {
    const { company, name, email, password } = await req.json()
    if (!company || !name || !email || !password) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 })
    }
    // Check if user/email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ message: 'Email already in use.' }, { status: 400 })
    }
    // Generate unique subdomain
    const subdomain = await getUniqueSubdomain(company)
    // Create organization and user in a transaction
    const hashedPassword = await bcrypt.hash(password, 10)
    const org = await prisma.organization.create({
      data: {
        name: company,
        subdomain,
        users: {
          create: {
            name,
            email,
            password: hashedPassword,
            role: 'OWNER',
            active: true,
            emailVerified: null,
          },
        },
      },
      include: { users: true },
    })
    // Generate verification token
    const token = crypto.randomUUID()
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
      },
    })
    // Send verification email
    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify?token=${token}`
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject: 'Verify your email for Syntari HR',
      html: `<p>Welcome to Syntari HR!</p>
        <p>Your company subdomain: <b>${subdomain}.yourdomain.com</b></p>
        <p>Please verify your email by clicking the link below:</p>
        <p><a href="${verifyUrl}">${verifyUrl}</a></p>
        <p>This link will expire in 24 hours.</p>`
    })
    return NextResponse.json({ message: 'Registration successful. Please check your email to verify your account.', subdomain }, { status: 200 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ message: 'Registration failed.' }, { status: 500 })
  }
} 