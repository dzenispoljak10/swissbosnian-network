import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { z } from 'zod'
import { resend } from '@/lib/resend'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import {
  confirmationRequestHtml,
  confirmationRequestText,
  confirmationRequestSubject,
  type Locale,
} from '@/lib/email/templates/newsletter-confirm'

const schema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().max(100).optional(),
  email: z.string().email().max(200),
  locale: z.enum(['de', 'bs']).optional(),
})

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000

function newToken(): string {
  return randomBytes(32).toString('hex')
}

async function sendConfirmation(
  email: string,
  firstName: string,
  token: string,
  locale: Locale
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM
  if (!apiKey || apiKey === 're_placeholder' || !from) {
    console.warn(`[newsletter] Resend not configured – confirmation email to ${email} skipped`)
    return
  }
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'https://swissbosnian-network.ch'
  const confirmUrl = `${base}/api/public/newsletter/confirm?token=${token}`

  await resend.emails.send({
    from,
    to: email,
    replyTo: process.env.RESEND_REPLY_TO ?? undefined,
    subject: confirmationRequestSubject(locale),
    html: confirmationRequestHtml({ firstName, confirmUrl }, locale),
    text: confirmationRequestText({ firstName, confirmUrl }, locale),
  })
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  const { allowed, waitMinutes } = checkRateLimit(ip, {
    bucket: 'newsletter-subscribe',
    windowMs: 10 * 60 * 1000,
    maxAttempts: 3,
  })
  if (!allowed) {
    return NextResponse.json(
      { error: `Zu viele Anfragen. Bitte versuche es in ${waitMinutes} Minuten erneut.` },
      { status: 429 }
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Ungültige Eingabe.' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Alle Felder sind Pflicht.' }, { status: 400 })
  }

  const { firstName, lastName = '', email, locale = 'de' } = parsed.data
  const lc: Locale = locale
  const normalizedEmail = email.toLowerCase().trim()

  try {
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, confirmed: true, subscribed: true, firstName: true },
    })

    if (existing && existing.confirmed && existing.subscribed) {
      return NextResponse.json(
        { success: true, status: 'already_subscribed' },
        { status: 200 }
      )
    }

    const token = newToken()
    const expiresAt = new Date(Date.now() + TOKEN_TTL_MS)

    if (existing) {
      // Re-send confirmation: not confirmed yet, or confirmed but unsubscribed.
      await prisma.newsletterSubscriber.update({
        where: { id: existing.id },
        data: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          locale: lc,
          confirmToken: token,
          confirmTokenExpiresAt: expiresAt,
          // We do NOT flip subscribed/confirmed here — that only happens
          // once the user clicks the confirmation link.
        },
      })
    } else {
      const allList = await prisma.newsletterList.findFirst({
        where: { id: 'all-subscribers' },
        select: { id: true },
      })
      await prisma.newsletterSubscriber.create({
        data: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: normalizedEmail,
          locale: lc,
          subscribed: false,
          confirmed: false,
          confirmToken: token,
          confirmTokenExpiresAt: expiresAt,
          lists: allList ? { connect: { id: allList.id } } : undefined,
        },
      })
    }

    try {
      await sendConfirmation(normalizedEmail, firstName.trim(), token, lc)
    } catch (mailErr) {
      console.error('[newsletter] confirmation mail failed:', mailErr)
    }

    return NextResponse.json(
      { success: true, status: 'confirmation_sent' },
      { status: 201 }
    )
  } catch (error) {
    console.error('[newsletter] subscribe error:', error)
    return NextResponse.json({ error: 'Fehler beim Speichern.' }, { status: 500 })
  }
}
