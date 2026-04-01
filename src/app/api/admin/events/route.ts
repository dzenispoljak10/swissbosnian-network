import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  titleDe: z.string().min(1),
  titleBs: z.string().optional(),
  descriptionDe: z.string().optional(),
  descriptionBs: z.string().optional(),
  date: z.string(),
  endDate: z.string().optional().nullable(),
  location: z.string().optional(),
  locationUrl: z.string().optional(),
  color: z.string().default('#0D1F6E'),
  published: z.boolean().default(true),
})

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const events = await prisma.event.findMany({ orderBy: { date: 'desc' } })
  return NextResponse.json(events)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Ungültige Daten', details: parsed.error }, { status: 400 })
    }

    const { date, endDate, ...rest } = parsed.data
    const event = await prisma.event.create({
      data: {
        ...rest,
        date: new Date(date),
        endDate: endDate ? new Date(endDate) : null,
      },
    })
    return NextResponse.json(event)
  } catch {
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 })
  }
}
