import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

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
          },
        },
      },
      include: { users: true },
    })
    return NextResponse.json({ message: 'Registration successful.', subdomain }, { status: 200 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ message: 'Registration failed.' }, { status: 500 })
  }
} 