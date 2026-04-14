import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendNewsletterCampaign } from '@/lib/resend'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const campaign = await prisma.newsletterCampaign.findUnique({
    where: { id },
    include: { lists: { select: { id: true, name: true } } },
  })
  if (!campaign) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(campaign)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { subject, previewText, content, footerText, blocks, globalStyles, listIds, send } = body

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: any = {
    subject,
    previewText,
    content: content ?? '',
    footerText,
    status: send ? 'SENT' : 'DRAFT',
    ...(send && { sentAt: new Date() }),
    ...(listIds !== undefined && { lists: { set: listIds.map((lid: string) => ({ id: lid })) } }),
  }
  if (blocks !== undefined) updateData.blocks = blocks
  if (globalStyles !== undefined) updateData.globalStyles = globalStyles

  const campaign = await prisma.newsletterCampaign.update({
    where: { id },
    data: updateData,
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
          await prisma.newsletterSent.upsert({
            where: { campaignId_subscriberId: { campaignId: id, subscriberId: subscriber.id } },
            create: { campaignId: id, subscriberId: subscriber.id },
            update: {},
          })
        } catch (err) {
          console.error(`Failed to send to ${subscriber.email}:`, err)
        }
      }
    }
  }

  return NextResponse.json(campaign)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await prisma.newsletterSent.deleteMany({ where: { campaignId: id } })
  await prisma.newsletterCampaign.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
