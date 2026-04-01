import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  titleDe: z.string().min(1),
  titleBs: z.string().optional(),
  slug: z.string().min(1),
  contentDe: z.string(),
  contentBs: z.string().optional(),
  excerptDe: z.string().optional(),
  excerptBs: z.string().optional(),
  coverImage: z.string().optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
  metaTitleDe: z.string().optional(),
  metaDescDe: z.string().optional(),
  published: z.boolean().default(false),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Ungültige Daten', details: parsed.error }, { status: 400 })
    }

    const post = await prisma.blogPost.create({
      data: {
        ...parsed.data,
        authorId: session.user.id,
        publishedAt: parsed.data.published ? new Date() : null,
      },
    })

    return NextResponse.json(post)
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    if (msg.includes('Unique constraint')) {
      return NextResponse.json({ error: 'Slug bereits vorhanden' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 })
  }
}
