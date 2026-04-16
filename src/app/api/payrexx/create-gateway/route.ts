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

    const successUrl = `https://www.swissbosnian-network.ch/de/mitmachen?success=true`
    const failedUrl = `https://www.swissbosnian-network.ch/de/mitmachen?success=false`

    const paramsForSignature = new URLSearchParams()
    paramsForSignature.append('amount', String(amount * 100))
    paramsForSignature.append('currency', 'CHF')
    paramsForSignature.append('purpose', purposes[memberType])
    paramsForSignature.append('successRedirect', successUrl)
    paramsForSignature.append('failedRedirect', failedUrl)
    paramsForSignature.append('referenceId', referenceId)
    paramsForSignature.append('fields[email][value]', email)
    paramsForSignature.append('fields[email][mandatory]', '1')
    paramsForSignature.append('fields[forename][value]', firstName)
    paramsForSignature.append('fields[forename][mandatory]', '1')
    paramsForSignature.append('fields[surname][value]', lastName)
    paramsForSignature.append('fields[surname][mandatory]', '1')

    const queryString = paramsForSignature.toString()
    const signature = crypto
      .createHmac('sha256', apiKey)
      .update(queryString)
      .digest('base64')

    const finalParams = new URLSearchParams(queryString)
    finalParams.append('ApiSignature', signature)

    console.log('Payrexx request params:', queryString)

    const response = await fetch(
      `https://api.payrexx.com/v1.0/Gateway/?instance=${instance}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: finalParams.toString(),
      }
    )

    console.log('Payrexx response status:', response.status)

    const data = await response.json()

    console.log('Payrexx response body:', JSON.stringify(data))

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
