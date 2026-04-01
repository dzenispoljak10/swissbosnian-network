import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Ungültige E-Mail-Adresse' }, { status: 400 })
    }

    const { email, firstName } = parsed.data

    const allList = await prisma.newsletterList.findFirst({
      where: { name: 'Alle Abonnenten' },
    })

    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { subscribed: true, firstName: firstName ?? undefined },
      create: {
        email,
        firstName,
        subscribed: true,
        lists: allList ? { connect: { id: allList.id } } : undefined,
      },
    })

    return NextResponse.json({ success: true, id: subscriber.id })
  } catch (error) {
    console.error('Newsletter subscribe error:', error)
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 })
  }
}
