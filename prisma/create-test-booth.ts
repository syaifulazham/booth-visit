import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create a test booth with specific hashcode
  const booth = await prisma.booth.upsert({
    where: { hashcode: 'bpkej9mifm4q46b9599iv' },
    update: {},
    create: {
      boothName: 'Test Booth - MyDigital',
      ministry: 'Kementerian Sains, Teknologi dan Inovasi (MOSTI)',
      agency: 'MyDigital Corporation',
      abbreviationName: 'MDC',
      hashcode: 'bpkej9mifm4q46b9599iv',
      qrCodeGenerated: true,
      picName: 'Ahmad Ibrahim',
      picPhone: '03-88889999',
      picEmail: 'ahmad@mydigital.gov.my',
    },
  })

  console.log('Test booth created:', booth)
  console.log('\nVisit URL:', `http://localhost:3000/visit/booth/${booth.hashcode}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
