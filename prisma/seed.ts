import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await hash('admin123', 10)
  
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@mosti.gov.my' },
    update: {},
    create: {
      email: 'admin@mosti.gov.my',
      password: hashedPassword,
      name: 'Admin MOSTI',
      role: 'super_admin',
    },
  })

  console.log('✅ Admin user created:')
  console.log('   Email: admin@mosti.gov.my')
  console.log('   Password: admin123')
  console.log('')
  console.log('⚠️  Please change the password after first login!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
