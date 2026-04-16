import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  const listId = searchParams.get('listId') || ''
  const status = searchParams.get('status') || ''

  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: {
      AND: [
        search ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' } },
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
          ]
        } : {},
        listId ? { lists: { some: { id: listId } } } : {},
        status === 'active' ? { subscribed: true } : status === 'inactive' ? { subscribed: false } : {},
      ]
    },
    include: {
      lists: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(subscribers)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { firstName, lastName, email, listIds } = await req.json()
  if (!firstName?.trim() || !lastName?.trim() || !email?.trim()) {
    return NextResponse.json({ error: 'Alle Felder sind Pflicht.' }, { status: 400 })
  }

  const existing = await prisma.newsletterSubscriber.findUnique({ where: { email: email.toLowerCase().trim() } })
  if (existing) return NextResponse.json({ error: 'E-Mail bereits vorhanden.' }, { status: 409 })

  const subscriber = await prisma.newsletterSubscriber.create({
    data: {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      lists: listIds?.length ? { connect: listIds.map((id: string) => ({ id })) } : undefined,
    },
    include: { lists: { select: { id: true, name: true } } },
  })
  return NextResponse.json(subscriber, { status: 201 })
}
