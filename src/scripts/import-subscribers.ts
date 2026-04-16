import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const allList = await prisma.newsletterList.findFirst({ where: { id: 'all-subscribers' } })

  const subscribers = [
    { firstName: 'Anur',     lastName: 'Ajkunic',      email: 'anuranur88@gmail.com' },
    { firstName: 'Kenan',    lastName: 'Filan',         email: 'filan.k@hotmail.com' },
    { firstName: 'Elvis',    lastName: 'Mujagic',       email: 'elvis.mujagic@gmail.com' },
    { firstName: 'Salih',    lastName: 'Osmanbasic',    email: 'flex222@hotmail.ch' },
    { firstName: 'Aleksa',   lastName: 'Tatic',         email: 'aleksa.tatic@gmail.com' },
    { firstName: 'Saud',     lastName: 'Tadzic',        email: 'saud.tadzic@gmail.com' },
    { firstName: 'Ena',      lastName: 'Muratbegovic',  email: 'ena.muratbegovic@gmail.com' },
    { firstName: 'Hamid',    lastName: 'Isic',          email: 'hamid.isic@solutio.ba' },
    { firstName: 'Elvir',    lastName: 'Jahic',         email: 'elvir.jahic@hotmail.com' },
    { firstName: 'Ibrahim',  lastName: 'Gagulic',       email: 'ibrahim_gagulic@hotmail.com' },
    { firstName: 'Berin',    lastName: 'Sadikovic',     email: 'berin_sadikovic@gmx.net' },
    { firstName: 'Suad',     lastName: 'Tadzic',        email: 'suad.tadzic@powex.swiss' },
    { firstName: 'Adem',     lastName: 'Hasic',         email: 'adem.hasic1@outlook.com' },
    { firstName: 'Mario',    lastName: 'Tipura',        email: 'mario.tipura@gmail.com' },
    { firstName: 'Emina',    lastName: 'Suljic',        email: 'emisul86@gmail.com' },
    { firstName: 'Dzenis',   lastName: 'Poljak',        email: 'dzenispoljak@gmail.com' },
    { firstName: 'Anesa',    lastName: 'Kumalic',       email: 'anesa.kumalic@hotmail.com' },
    { firstName: 'Emir',     lastName: 'Besic',         email: 'emir_zizou@hotmail.com' },
    { firstName: 'Jasmina',  lastName: 'Sistek',        email: 'jasmina.sistek@outlook.com' },
  ]

  let imported = 0
  let skipped = 0

  for (const sub of subscribers) {
    const email = sub.email.toLowerCase().trim()
    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } })

    if (existing) {
      skipped++
      continue
    }

    await prisma.newsletterSubscriber.create({
      data: {
        firstName: sub.firstName.trim(),
        lastName: sub.lastName.trim(),
        email,
        subscribed: true,
        lists: allList ? { connect: { id: allList.id } } : undefined,
      }
    })
    imported++
  }

  console.log(`✅ Importiert: ${imported}, Übersprungen (Duplikate): ${skipped}`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
