import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email } = await req.json()

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim()) {
      return Response.json({ error: 'Alle Felder sind Pflicht.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return Response.json({ error: 'Ungültige E-Mail-Adresse.' }, { status: 400 })
    }

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: email.toLowerCase().trim() }
    })

    if (existing) {
      return Response.json({ error: 'Diese E-Mail ist bereits angemeldet.' }, { status: 409 })
    }

    const allList = await prisma.newsletterList.findFirst({
      where: { id: 'all-subscribers' }
    })

    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        lists: allList ? { connect: { id: allList.id } } : undefined,
      }
    })

    return Response.json({ success: true, id: subscriber.id }, { status: 201 })
  } catch (error) {
    console.error('Newsletter subscribe error:', error)
    return Response.json({ error: 'Fehler beim Speichern.' }, { status: 500 })
  }
}
