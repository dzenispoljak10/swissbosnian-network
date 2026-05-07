import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const SUCCESS_PATHS: Record<'de' | 'bs', string> = {
  de: '/de/newsletter/bestaetigt',
  bs: '/bs/newsletter/potvrdjen',
}
const FAIL_PATHS: Record<'de' | 'bs', string> = {
  de: '/de/newsletter/bestaetigung-fehlgeschlagen',
  bs: '/bs/newsletter/potvrda-neuspjesna',
}

function pickLocale(value: string | null | undefined): 'de' | 'bs' {
  return value === 'bs' ? 'bs' : 'de'
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const token = url.searchParams.get('token')
  const base = process.env.NEXT_PUBLIC_APP_URL ?? url.origin

  if (!token) {
    return NextResponse.redirect(`${base}${FAIL_PATHS.de}`, { status: 303 })
  }

  const subscriber = await prisma.newsletterSubscriber.findUnique({
    where: { confirmToken: token },
    select: {
      id: true,
      locale: true,
      confirmTokenExpiresAt: true,
      confirmed: true,
    },
  })

  const locale = pickLocale(subscriber?.locale)

  if (!subscriber) {
    return NextResponse.redirect(`${base}${FAIL_PATHS[locale]}`, { status: 303 })
  }

  // Token already consumed? Treat as success — idempotent for users who
  // click the link twice.
  if (subscriber.confirmed) {
    return NextResponse.redirect(`${base}${SUCCESS_PATHS[locale]}`, { status: 303 })
  }

  const expired =
    !subscriber.confirmTokenExpiresAt ||
    subscriber.confirmTokenExpiresAt.getTime() < Date.now()

  if (expired) {
    return NextResponse.redirect(`${base}${FAIL_PATHS[locale]}`, { status: 303 })
  }

  try {
    await prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: {
        confirmed: true,
        subscribed: true,
        confirmToken: null,
        confirmTokenExpiresAt: null,
      },
    })
  } catch (err) {
    console.error('[newsletter/confirm] update failed:', err)
    return NextResponse.redirect(`${base}${FAIL_PATHS[locale]}`, { status: 303 })
  }

  return NextResponse.redirect(`${base}${SUCCESS_PATHS[locale]}`, { status: 303 })
}
