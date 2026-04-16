import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const list = await prisma.newsletterList.findUnique({
    where: { id },
    include: {
      subscribers: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          subscribed: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!list) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(list)
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { name, description } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: 'Name ist Pflicht.' }, { status: 400 })

  const list = await prisma.newsletterList.update({
    where: { id },
    data: { name: name.trim(), description: description?.trim() || null },
  })
  return NextResponse.json(list)
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await prisma.newsletterList.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
