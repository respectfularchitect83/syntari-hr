import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create an organization
  const org = await prisma.organization.create({
    data: {
      name: 'Acme Corp',
      users: {
        create: [
          {
            email: 'owner@acme.com',
            name: 'Alice Owner',
            role: 'OWNER',
            active: true,
          },
          {
            email: 'admin@acme.com',
            name: 'Bob Admin',
            role: 'ADMIN',
            active: true,
          },
        ],
      },
    },
    include: { users: true },
  })

  console.log('Seeded organization with users:', org)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 