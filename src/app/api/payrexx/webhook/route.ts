import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const transaction = body?.transaction
    if (!transaction) return Response.json({ ok: true }, { status: 200 })

    const status = transaction.status
    const email = transaction?.contact?.email
    const firstName = transaction?.contact?.firstname ?? transaction?.contact?.forename ?? ''
    const lastName = transaction?.contact?.lastname ?? transaction?.contact?.surname ?? ''
    const amount = transaction?.amount / 100
    const referenceId = transaction?.referenceId || transaction?.invoice?.referenceId || ''

    if (status !== 'confirmed') return Response.json({ ok: true }, { status: 200 })
    if (!email) return Response.json({ ok: true }, { status: 200 })

    const memberType = amount >= 500 ? 'PARTNER' : 'GOENNER'

    const existing = await prisma.member.findFirst({ where: { email } })

    if (existing) {
      await prisma.member.update({
        where: { id: existing.id },
        data: { memberStatus: 'ACTIVE', memberType, paidAt: new Date() }
      })
    } else {
      await prisma.member.create({
        data: {
          email,
          firstName,
          lastName,
          memberType,
          memberStatus: 'ACTIVE',
          paidAt: new Date(),
          amount,
        }
      })
    }

    void referenceId
    return Response.json({ ok: true }, { status: 200 })
  } catch (err) {
    console.error('Webhook error:', err)
    return Response.json({ error: 'Internal error' }, { status: 500 })
  }
}
