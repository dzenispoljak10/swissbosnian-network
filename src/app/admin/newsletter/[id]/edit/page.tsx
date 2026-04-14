import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import NewsletterEditor from '@/components/admin/newsletter/NewsletterEditor'
import type { Block, GlobalStyles } from '@/lib/email/renderNewsletter'

export default async function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const campaign = await prisma.newsletterCampaign.findUnique({
    where: { id },
    include: { lists: { select: { id: true } } },
  })

  if (!campaign) notFound()

  return (
    <NewsletterEditor
      campaignId={campaign.id}
      initialSubject={campaign.subject}
      initialPreviewText={campaign.previewText ?? ''}
      initialBlocks={(campaign.blocks as unknown as Block[]) ?? undefined}
      initialGlobalStyles={(campaign.globalStyles as unknown as GlobalStyles) ?? undefined}
      initialListIds={campaign.lists.map(l => l.id)}
    />
  )
}
