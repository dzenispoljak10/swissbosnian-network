import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Admin User
  const hashedPassword = await bcrypt.hash('Bosna123!', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'dzenispoljak@gmail.com' },
    update: {},
    create: {
      email: 'dzenispoljak@gmail.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'SUPER_ADMIN',
    },
  })

  console.log('✅ Admin user:', admin.email)

  // Newsletter Lists
  await prisma.newsletterList.upsert({
    where: { id: 'all-subscribers' },
    update: {},
    create: { id: 'all-subscribers', name: 'Alle Abonnenten', description: 'Alle Newsletter-Abonnenten' },
  })

  await prisma.newsletterList.upsert({
    where: { id: 'members' },
    update: {},
    create: { id: 'members', name: 'Mitglieder', description: 'Aktive Mitglieder des Vereins' },
  })

  await prisma.newsletterList.upsert({
    where: { id: 'goenner' },
    update: {},
    create: { id: 'goenner', name: 'Gönner & Partner', description: 'Gönner:innen und Partner:innen' },
  })

  console.log('✅ Newsletter lists created')

  // Sample Blog Post
  await prisma.blogPost.upsert({
    where: { slug: 'willkommen-beim-swiss-bosnian-network' },
    update: {},
    create: {
      slug: 'willkommen-beim-swiss-bosnian-network',
      titleDe: 'Willkommen beim Swiss Bosnian Network',
      titleBs: 'Dobrodošli u Swiss Bosnian Network',
      contentDe:
        '<h2>Ein neues Kapitel beginnt</h2><p>Das Swiss Bosnian Network wurde gegründet, um die bosnische Community in der Schweiz zu vernetzen und zu stärken. Wir freuen uns, dir diese neue Plattform vorzustellen.</p><p>Unser Ziel ist es, einen Ort des Austauschs zu schaffen – für Unternehmer:innen, Fachkräfte und Privatpersonen, die etwas bewegen möchten.</p>',
      contentBs:
        '<h2>Počinje novo poglavlje</h2><p>Swiss Bosnian Network je osnovan kako bi umrežio i ojačao bosansku zajednicu u Švicarskoj. Radujemo se što ti predstavljamo ovu novu platformu.</p>',
      excerptDe:
        'Das Swiss Bosnian Network wurde gegründet, um die bosnische Community in der Schweiz zu vernetzen.',
      excerptBs: 'Swiss Bosnian Network je osnovan kako bi umrežio bosansku zajednicu u Švicarskoj.',
      published: true,
      publishedAt: new Date(),
      coverImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80',
      category: 'Community',
      tags: 'community,netzwerk,launch',
      authorId: admin.id,
      metaTitleDe: 'Willkommen beim Swiss Bosnian Network',
      metaDescDe: 'Das Swiss Bosnian Network vernetzt die bosnische Community in der Schweiz.',
    },
  })

  console.log('✅ Sample blog post created')

  // Sample Events
  const currentMonth = new Date()
  const existingEvents = await prisma.event.count()
  if (existingEvents === 0) {
    await prisma.event.createMany({
      data: [
        {
          titleDe: 'After-Work Drinks Zürich',
          titleBs: 'After-Work Zürich',
          descriptionDe: 'Networking und Austausch bei einem entspannten After-Work Event in Zürich.',
          date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 10, 18, 0),
          location: 'Zürich, Innenstadt',
          color: '#0D1F6E',
          published: true,
        },
        {
          titleDe: 'Business Treffen Bern',
          descriptionDe: 'Gemeinsames Business-Meeting mit Speaker-Session.',
          date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 18, 17, 30),
          location: 'Bern',
          color: '#C9960A',
          published: true,
        },
        {
          titleDe: 'Community Event Basel',
          descriptionDe: 'Offenes Community-Treffen für alle Mitglieder.',
          date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 25, 19, 0),
          location: 'Basel',
          color: '#0D1F6E',
          published: true,
        },
      ],
    })
  }

  console.log('✅ Sample events created')
  console.log('\n🎉 Seed complete!')
  console.log('Admin login: dzenispoljak@gmail.com / Bosna123!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
