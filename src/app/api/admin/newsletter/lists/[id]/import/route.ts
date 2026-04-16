import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  subscribers: z.array(
    z.object({
      email: z.string().email(),
      firstName: z.string().default(''),
      lastName: z.string().default(''),
    })
  ),
})

type Params = { params: Promise<{ id: string }> }

export async function POST(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })

  let imported = 0
  let skipped = 0

  const list = await prisma.newsletterList.findUnique({ where: { id } })
  if (!list) return NextResponse.json({ error: 'List not found' }, { status: 404 })

  for (const sub of parsed.data.subscribers) {
    try {
      const existing = await prisma.newsletterSubscriber.findUnique({ where: { email: sub.email } })
      if (existing) {
        // Connect to list if not already connected
        await prisma.newsletterSubscriber.update({
          where: { email: sub.email },
          data: { lists: { connect: { id } } },
        })
        skipped++
      } else {
        await prisma.newsletterSubscriber.create({
          data: {
            email: sub.email,
            firstName: sub.firstName,
            lastName: sub.lastName,
            lists: { connect: { id } },
          },
        })
        imported++
      }
    } catch {
      skipped++
    }
  }

  return NextResponse.json({ imported, skipped })
}
