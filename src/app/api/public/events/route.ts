import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const yearParam = searchParams.get('year')
  const monthParam = searchParams.get('month') // 0-indexed

  const now = new Date()
  const year = yearParam ? parseInt(yearParam) : now.getFullYear()
  const month = monthParam !== null ? parseInt(monthParam) : now.getMonth()

  const start = new Date(year, month, 1)
  const end = new Date(year, month + 1, 0, 23, 59, 59)

  const events = await prisma.event.findMany({
    where: { date: { gte: start, lte: end }, published: true },
    orderBy: { date: 'asc' },
  })

  return NextResponse.json(events)
}
