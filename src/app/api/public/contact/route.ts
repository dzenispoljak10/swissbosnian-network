import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { resend } from '@/lib/resend'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import {
  notificationEmailHtml,
  notificationEmailText,
  confirmationEmailHtml,
  confirmationEmailText,
  confirmationEmailSubject,
  type ContactData,
  type Locale,
} from '@/lib/email/templates/contact'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(200),
  subject: z.string().max(200).optional(),
  message: z.string().min(10).max(5000),
  locale: z.enum(['de', 'bs']).optional(),
})

const ADMIN_TO = 'info@swissbosnian-network.ch'

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  const { allowed, waitMinutes } = checkRateLimit(ip, {
    bucket: 'contact',
    windowMs: 10 * 60 * 1000,
    maxAttempts: 5,
  })
  if (!allowed) {
    return NextResponse.json(
      { error: `Zu viele Anfragen. Bitte versuche es in ${waitMinutes} Minuten erneut.` },
      { status: 429 }
    )
  }

  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Ungültige Eingabe' }, { status: 400 })
    }

    const { name, email, subject, message, locale = 'de' } = parsed.data
    const lc: Locale = locale

    const created = await prisma.contactMessage.create({
      data: { name, email, subject, message },
    })

    const data: ContactData = {
      name,
      email,
      subject,
      message,
      receivedAt: created.createdAt,
    }

    const apiKey = process.env.RESEND_API_KEY
    const from = process.env.RESEND_FROM
    const replyToDefault = process.env.RESEND_REPLY_TO

    if (!apiKey || apiKey === 're_placeholder' || !from) {
      console.warn('[contact] Resend not configured – skipping mail dispatch')
      return NextResponse.json({ success: true })
    }

    const sends: Promise<unknown>[] = [
      resend.emails.send({
        from,
        to: ADMIN_TO,
        replyTo: email,
        subject: `[Kontaktformular] Neue Nachricht von ${name}`,
        html: notificationEmailHtml(data),
        text: notificationEmailText(data),
      }),
      resend.emails.send({
        from,
        to: email,
        replyTo: replyToDefault ?? ADMIN_TO,
        subject: confirmationEmailSubject(lc),
        html: confirmationEmailHtml(data, lc),
        text: confirmationEmailText(data, lc),
      }),
    ]

    const results = await Promise.allSettled(sends)
    results.forEach((r, idx) => {
      if (r.status === 'rejected') {
        console.error(`[contact] mail ${idx === 0 ? 'notification' : 'confirmation'} failed:`, r.reason)
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[contact] error:', error)
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 })
  }
}
