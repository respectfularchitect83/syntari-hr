import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create an organization
  const org = await prisma.organization.create({
    data: {
      name: 'Acme Corp',
      subdomain: 'acme',
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
      employees: {
        create: [
          {
            firstName: 'Sarah',
            lastName: 'Johnson',
            email: 'sarah.johnson@acme.com',
            phone: '+27 82 123 4567',
            photo: null,
            birthday: new Date('1990-05-15'),
            idPassport: '1234567890',
            address: '123 Main St',
            city: 'Cape Town',
            state: 'Western Cape',
            zipCode: '8001',
            country: 'South Africa',
            department: 'Human Resources',
            position: 'HR Manager',
            hireDate: new Date('2018-01-10'),
            manager: 'David Chen',
            status: 'Active',
            workSchedule: 'Monday to Friday',
            isRemote: false,
            notes: 'Top performer',
            emergencyContactName: 'John Johnson',
            emergencyContactRelationship: 'Spouse',
            emergencyContactPhone: '+27 82 987 6543',
            bankName: 'FNB',
            accountNumber: '123456789',
            routingSwiftNumber: 'FIRNZAJJ',
            socialSecurityNumber: 'SSN123456',
            taxId: 'TX123456',
          },
          {
            firstName: 'Michael',
            lastName: 'Smith',
            email: 'michael.smith@acme.com',
            phone: '+264 81 123 4567',
            photo: null,
            birthday: new Date('1985-09-20'),
            idPassport: 'A987654321',
            address: '456 Independence Ave',
            city: 'Windhoek',
            state: 'Khomas',
            zipCode: '10001',
            country: 'Namibia',
            department: 'Engineering',
            position: 'Software Engineer',
            hireDate: new Date('2020-03-01'),
            manager: 'Sarah Johnson',
            status: 'Active',
            workSchedule: 'Monday to Friday',
            isRemote: true,
            notes: '',
            emergencyContactName: 'Anna Smith',
            emergencyContactRelationship: 'Sister',
            emergencyContactPhone: '+264 81 987 6543',
            bankName: 'Bank Windhoek',
            accountNumber: '987654321',
            routingSwiftNumber: 'BWLINANX',
            socialSecurityNumber: 'SSN654321',
            taxId: 'TX654321',
          },
        ],
      },
    },
    include: { users: true, employees: true },
  })

  console.log('Seeded organization with users and employees:', org)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 