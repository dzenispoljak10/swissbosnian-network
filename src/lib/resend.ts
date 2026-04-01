import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY ?? 're_placeholder')

export async function sendWelcomeEmail(email: string, name: string, memberType: string) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_placeholder') {
    console.log(`[Email skipped - no RESEND_API_KEY] Welcome email to ${email}`)
    return
  }
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: 'Willkommen beim Swiss Bosnian Network!',
    html: `<h1>Willkommen, ${name}!</h1><p>Deine Mitgliedschaft als ${memberType} ist jetzt aktiv.</p>`,
  })
}

export async function sendNewsletterCampaign(
  campaign: { subject: string; content: string },
  subscriber: { email: string; firstName?: string | null; unsubscribeToken: string }
) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_placeholder') {
    console.log(`[Email skipped - no RESEND_API_KEY] Newsletter to ${subscriber.email}`)
    return
  }
  const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/newsletter/unsubscribe?token=${subscriber.unsubscribeToken}`
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: subscriber.email,
    subject: campaign.subject,
    html: `${campaign.content}<hr><p style="font-size:12px"><a href="${unsubscribeUrl}">Abmelden</a></p>`,
  })
}
