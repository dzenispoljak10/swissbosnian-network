import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendNewsletterCampaign } from '@/lib/resend'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const campaigns = await prisma.newsletterCampaign.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { sentEmails: true } },
      lists: { select: { id: true, name: true } },
    },
  })
  return NextResponse.json(campaigns)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { subject, previewText, content, footerText, blocks, globalStyles, listIds, status, send } = body

  const campaign = await prisma.newsletterCampaign.create({
    data: {
      subject,
      previewText,
      content: content ?? '',
      footerText,
      ...(blocks !== undefined && { blocks }),
      ...(globalStyles !== undefined && { globalStyles }),
      status: send ? 'SENT' : (status ?? 'DRAFT'),
      sentAt: send ? new Date() : null,
      lists: listIds?.length ? { connect: listIds.map((id: string) => ({ id })) } : undefined,
    },
    include: {
      lists: { include: { subscribers: { where: { subscribed: true } } } },
    },
  })

  if (send && listIds?.length) {
    const sentEmails = new Set<string>()
    for (const list of campaign.lists) {
      for (const subscriber of list.subscribers) {
        if (sentEmails.has(subscriber.email)) continue
        sentEmails.add(subscriber.email)
        try {
          await sendNewsletterCampaign({ subject, content: content ?? '' }, subscriber)
          await prisma.newsletterSent.create({
            data: { campaignId: campaign.id, subscriberId: subscriber.id },
          })
        } catch (err) {
          console.error(`Failed to send to ${subscriber.email}:`, err)
        }
      }
    }
  }

  return NextResponse.json(campaign)
}
