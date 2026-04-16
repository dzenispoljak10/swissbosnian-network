import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const lists = await prisma.newsletterList.findMany({
    include: { _count: { select: { subscribers: true } } },
    orderBy: { name: 'asc' },
  })
  return NextResponse.json(lists)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, description } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: 'Name ist Pflicht.' }, { status: 400 })

  const list = await prisma.newsletterList.create({
    data: { name: name.trim(), description: description?.trim() || null },
  })
  return NextResponse.json(list, { status: 201 })
}
