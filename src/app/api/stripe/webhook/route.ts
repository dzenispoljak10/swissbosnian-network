import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { sendWelcomeEmail } from '@/lib/resend'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET === 'whsec_placeholder') {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 400 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature error:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const memberType = session.metadata?.memberType as string
    const customerEmail = session.customer_details?.email
    const customerName = session.customer_details?.name

    if (customerEmail && memberType) {
      const nameParts = (customerName ?? '').split(' ')
      const firstName = nameParts[0] ?? ''
      const lastName = nameParts.slice(1).join(' ')

      const member = await prisma.member.upsert({
        where: { email: customerEmail },
        update: {
          memberStatus: 'ACTIVE',
          memberType,
          stripeCustomerId: session.customer as string,
        },
        create: {
          email: customerEmail,
          firstName,
          lastName,
          memberType,
          memberStatus: 'ACTIVE',
          stripeCustomerId: session.customer as string,
        },
      })

      await prisma.payment.create({
        data: {
          memberId: member.id,
          stripeSessionId: session.id,
          stripePaymentId: session.payment_intent as string,
          amount: session.amount_total ?? 0,
          currency: session.currency ?? 'chf',
          status: 'COMPLETED',
          memberType,
        },
      })

      await sendWelcomeEmail(customerEmail, customerName ?? firstName, memberType)
    }
  }

  return NextResponse.json({ received: true })
}
