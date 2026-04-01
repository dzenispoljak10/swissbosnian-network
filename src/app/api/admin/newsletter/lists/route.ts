import { NextResponse } from 'next/server'
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
