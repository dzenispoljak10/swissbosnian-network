import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const admin = await prisma.user.findUnique({ where: { email: 'dzenispoljak@gmail.com' } })
  if (!admin) { console.error('Admin nicht gefunden'); return }

  const existing = await prisma.blogPost.findUnique({ where: { slug: 'afterwork-swiss-bosnian-network-x-bosnet-april-2026' } })
  if (existing) {
    await prisma.blogPost.delete({ where: { slug: 'afterwork-swiss-bosnian-network-x-bosnet-april-2026' } })
  }

  await prisma.blogPost.create({
    data: {
      slug: 'afterwork-swiss-bosnian-network-x-bosnet-april-2026',
      titleDe: 'Swiss Bosnian Network x Bosnet — After Work Event',
      titleBs: 'Swiss Bosnian Network x Bosnet — After Work Event',
      contentDe: `<p>Zwei Netzwerke. Eine Community. Ein gemeinsamer Abend.</p>
<p>Das Swiss Bosnian Network und Bosnet bringen ihre Communities zusammen – für einen After Work im Jack's Cevap House.</p>
<p><strong>Datum:</strong> Donnerstag, 23. April 2026<br/>
<strong>Uhrzeit:</strong> 18:30 Uhr<br/>
<strong>Ort:</strong> The Jack's House | Restaurant Altstetten, Bernerstrasse Süd 167, 8048 Zürich</p>
<p>Komm vorbei, vernetze dich und geniesse den Abend mit Menschen aus beiden Communities. Wir freuen uns auf euch!</p>`,
      contentBs: `<p>Dvije mreže. Jedna zajednica. Jedna zajednička večer.</p>
<p>Swiss Bosnian Network i Bosnet spajaju svoje zajednice – za After Work u Jack's Cevap House.</p>
<p><strong>Datum:</strong> Četvrtak, 23. april 2026<br/>
<strong>Vrijeme:</strong> 18:30<br/>
<strong>Mjesto:</strong> The Jack's House | Restaurant Altstetten, Bernerstrasse Süd 167, 8048 Zürich</p>
<p>Dođi, umreži se i uživaj u večeri s ljudima iz obje zajednice. Radujemo se vašem dolasku!</p>`,
      excerptDe: "Das Swiss Bosnian Network und Bosnet bringen ihre Communities zusammen – für einen After Work im Jack's Cevap House am 23. April 2026.",
      excerptBs: "Swiss Bosnian Network i Bosnet spajaju svoje zajednice – za After Work u Jack's Cevap House, 23. aprila 2026.",
      coverImage: '/uploads/event-afterwork-april-2026.png',
      published: true,
      publishedAt: new Date(),
      category: 'Events',
      tags: 'afterwork, event, bosnet, zürich, community',
      metaTitleDe: 'After Work Event — Swiss Bosnian Network x Bosnet | 23. April 2026',
      metaTitleBs: 'After Work Event — Swiss Bosnian Network x Bosnet | 23. april 2026',
      metaDescDe: "Swiss Bosnian Network und Bosnet laden zum gemeinsamen After Work ins Jack's Cevap House in Zürich Altstetten ein. 23. April 2026, 18:30 Uhr.",
      metaDescBs: "Swiss Bosnian Network i Bosnet pozivaju na zajednički After Work u Jack's Cevap House u Zürichu. 23. april 2026, 18:30.",
      authorId: admin.id,
    }
  })

  console.log('✅ Blog-Post erfolgreich erstellt')
}

main().catch(console.error).finally(() => prisma.$disconnect())
