import { NextRequest } from 'next/server'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { memberType, email, firstName, lastName } = await req.json()

    if (!email || !firstName || !lastName) {
      return Response.json({ error: 'Alle Felder sind Pflicht.' }, { status: 400 })
    }

    const amounts: Record<string, number> = {
      GOENNER: 50,
      PARTNER: 500,
    }

    const purposes: Record<string, string> = {
      GOENNER: 'Gönner-Mitgliedschaft Swiss Bosnian Network',
      PARTNER: 'Partner-Mitgliedschaft Swiss Bosnian Network',
    }

    const amount = amounts[memberType]
    if (!amount) return Response.json({ error: 'Ungültiger Typ' }, { status: 400 })

    const referenceId = `sbn-${memberType.toLowerCase()}-${Date.now()}`
    const instance = process.env.PAYREXX_INSTANCE
    const apiKey = process.env.PAYREXX_API_KEY

    if (!instance || !apiKey) {
      return Response.json({ error: 'Payrexx nicht konfiguriert.' }, { status: 500 })
    }

    const params = new URLSearchParams()
    params.append('amount', String(amount * 100))
    params.append('currency', 'CHF')
    params.append('purpose', purposes[memberType])
    params.append('successRedirect', `https://www.swissbosnian-network.ch/de/mitmachen?success=true`)
    params.append('failedRedirect', `https://www.swissbosnian-network.ch/de/mitmachen?success=false`)
    params.append('referenceId', referenceId)
    params.append('fields[email][value]', email)
    params.append('fields[email][mandatory]', '1')
    params.append('fields[forename][value]', firstName)
    params.append('fields[forename][mandatory]', '1')
    params.append('fields[surname][value]', lastName)
    params.append('fields[surname][mandatory]', '1')

    const signature = crypto
      .createHmac('sha256', apiKey)
      .update(params.toString())
      .digest('base64')
    params.append('ApiSignature', signature)

    const response = await fetch(
      `https://api.payrexx.com/v1.0/Gateway/?instance=${instance}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      }
    )

    const data = await response.json()

    if (!data?.data?.[0]?.link) {
      console.error('Payrexx error:', JSON.stringify(data))
      return Response.json({ error: 'Fehler beim Erstellen des Checkouts' }, { status: 500 })
    }

    return Response.json({ url: data.data[0].link, referenceId })
  } catch (err) {
    console.error('Create gateway error:', err)
    return Response.json({ error: 'Interner Fehler' }, { status: 500 })
  }
}
