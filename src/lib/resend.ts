import { Resend } from 'resend'
import { htmlToText } from '@/lib/email/htmlToText'

export const resend = new Resend(process.env.RESEND_API_KEY ?? 're_placeholder')

function isConfigured(): boolean {
  const key = process.env.RESEND_API_KEY
  return Boolean(key && key !== 're_placeholder')
}

function from(): string {
  return process.env.RESEND_FROM ?? 'info@swissbosnian-network.ch'
}

function replyTo(): string | undefined {
  return process.env.RESEND_REPLY_TO ?? undefined
}

export async function sendWelcomeEmail(email: string, name: string, memberType: string) {
  if (!isConfigured()) {
    console.log(`[Email skipped - no RESEND_API_KEY] Welcome email to ${email}`)
    return
  }
  const html = `<h1>Willkommen, ${name}!</h1><p>Deine Mitgliedschaft als ${memberType} ist jetzt aktiv.</p>`
  await resend.emails.send({
    from: from(),
    to: email,
    replyTo: replyTo(),
    subject: 'Willkommen beim Swiss Bosnian Network!',
    html,
    text: htmlToText(html),
  })
}

export async function sendNewsletterCampaign(
  campaign: { subject: string; content: string },
  subscriber: { email: string; firstName?: string | null; unsubscribeToken: string }
) {
  if (!isConfigured()) {
    console.log(`[Email skipped - no RESEND_API_KEY] Newsletter to ${subscriber.email}`)
    return
  }
  const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/public/newsletter/unsubscribe?token=${subscriber.unsubscribeToken}`
  const html = `${campaign.content}<hr /><p style="font-size:12px;color:#6B7280;">Du erhältst diese E-Mail, weil du dich für den Newsletter des Swiss Bosnian Network angemeldet hast. <a href="${unsubscribeUrl}" style="color:#6B7280;">Vom Newsletter abmelden</a>.</p>`
  await resend.emails.send({
    from: from(),
    to: subscriber.email,
    replyTo: replyTo(),
    subject: campaign.subject,
    html,
    text: htmlToText(html),
    headers: {
      'List-Unsubscribe': `<${unsubscribeUrl}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  })
}
