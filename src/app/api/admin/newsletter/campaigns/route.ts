import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendNewsletterCampaign } from '@/lib/resend'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { subject, previewText, content, footerText, listIds, status, send } = body

  const campaign = await prisma.newsletterCampaign.create({
    data: {
      subject,
      previewText,
      content,
      footerText,
      status: send ? 'SENT' : 'DRAFT',
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
          await sendNewsletterCampaign({ subject, content }, subscriber)
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
