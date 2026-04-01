import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  memberType: z.enum(['MITGLIED', 'GOENNER', 'PARTNER']).default('MITGLIED'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Ungültige Eingabe' }, { status: 400 })
    }

    const existing = await prisma.member.findUnique({ where: { email: parsed.data.email } })
    if (existing) {
      return NextResponse.json({ error: 'E-Mail bereits registriert' }, { status: 409 })
    }

    const member = await prisma.member.create({
      data: {
        ...parsed.data,
        memberStatus: 'PENDING',
      },
    })

    return NextResponse.json({ success: true, id: member.id })
  } catch (error) {
    console.error('Member create error:', error)
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 })
  }
}
