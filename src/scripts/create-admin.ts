import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('Bosna!123', 12)

  const existing = await prisma.user.findUnique({ where: { email: 'info@swissbosnian-network.ch' } })
  if (existing) {
    await prisma.user.update({
      where: { email: 'info@swissbosnian-network.ch' },
      data: { password: hashedPassword, name: 'Admin' }
    })
    console.log('✅ Admin aktualisiert')
  } else {
    await prisma.user.create({
      data: {
        email: 'info@swissbosnian-network.ch',
        name: 'Admin',
        password: hashedPassword,
        role: 'ADMIN',
      }
    })
    console.log('✅ Admin erstellt')
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
