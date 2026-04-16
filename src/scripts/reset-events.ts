import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Delete all existing events
  await prisma.event.deleteMany()
  console.log('Alle Events gelöscht.')

  await prisma.event.create({
    data: {
      titleDe: 'Swiss Bosnian Network x Bosnet — After Work Event',
      titleBs: 'Swiss Bosnian Network x Bosnet — After Work Event',
      descriptionDe: 'Zwei Netzwerke. Eine Community. Ein gemeinsamer Abend. Das Swiss Bosnian Network und Bosnet bringen ihre Communities zusammen – für einen After Work im Jack\'s Cevap House.',
      descriptionBs: 'Dvije mreže. Jedna zajednica. Jedna zajednička večer. Swiss Bosnian Network i Bosnet spajaju svoje zajednice – za After Work u Jack\'s Cevap House.',
      date: new Date('2026-04-23T18:30:00'),
      location: "The Jack's House | Restaurant Altstetten, Bernerstrasse Süd 167, Zürich",
      locationUrl: 'https://maps.google.com/?q=Bernerstrasse+Süd+167+Zürich',
      coverImage: '/uploads/event-afterwork-april-2026.png',
      color: '#0D1F6E',
      published: true,
    }
  })

  console.log('✅ Event erstellt: After Work Event April 2026')
}

main().catch(console.error).finally(() => prisma.$disconnect())
