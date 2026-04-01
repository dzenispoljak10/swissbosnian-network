import { NextRequest, NextResponse } from 'next/server'
import { stripe, STRIPE_PRICES } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const { memberType } = await req.json()

    if (!['GOENNER', 'PARTNER'].includes(memberType)) {
      return NextResponse.json({ error: 'Ungültiger Mitgliedstyp' }, { status: 400 })
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY ?? ''
    if (!stripeKey || stripeKey === 'sk_test_placeholder') {
      return NextResponse.json(
        { error: 'Stripe nicht konfiguriert. Bitte STRIPE_SECRET_KEY in .env.local setzen.' },
        { status: 503 }
      )
    }

    const priceId = memberType === 'GOENNER' ? STRIPE_PRICES.GOENNER : STRIPE_PRICES.PARTNER

    if (!priceId) {
      return NextResponse.json(
        { error: 'Stripe Price nicht konfiguriert.' },
        { status: 503 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/de/mitmachen?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/de/mitmachen?cancelled=true`,
      metadata: { memberType },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'Stripe Fehler' }, { status: 500 })
  }
}
