import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  const data: Record<string, unknown> = {}
  if (typeof body.subscribed === 'boolean') data.subscribed = body.subscribed
  if (body.addListId) data.lists = { connect: { id: body.addListId } }
  if (body.removeListId) data.lists = { disconnect: { id: body.removeListId } }

  const subscriber = await prisma.newsletterSubscriber.update({
    where: { id },
    data,
    include: { lists: { select: { id: true, name: true } } },
  })
  return NextResponse.json(subscriber)
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await prisma.newsletterSubscriber.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
