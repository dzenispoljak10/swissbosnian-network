import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const PATHS: Record<'de' | 'bs', string> = {
  de: '/de/newsletter/abgemeldet',
  bs: '/bs/newsletter/odjavljen',
}

function pickLocale(value: string | null): 'de' | 'bs' {
  return value === 'bs' ? 'bs' : 'de'
}

async function handle(req: NextRequest) {
  const url = new URL(req.url)
  const token = url.searchParams.get('token')
  const queryLocale = pickLocale(url.searchParams.get('lang'))

  if (token) {
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { unsubscribeToken: token },
      select: { id: true, subscribed: true },
    })
    if (subscriber && subscriber.subscribed) {
      try {
        await prisma.newsletterSubscriber.update({
          where: { id: subscriber.id },
          data: { subscribed: false },
        })
      } catch (err) {
        console.error('[unsubscribe] update failed:', err)
      }
    }
  }

  const base = process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin
  return NextResponse.redirect(`${base}${PATHS[queryLocale]}`, { status: 303 })
}

export async function GET(req: NextRequest) {
  return handle(req)
}

// Gmail/Outlook one-click unsubscribe sends a POST per RFC 8058
export async function POST(req: NextRequest) {
  return handle(req)
}
