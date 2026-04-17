import * as crypto from 'crypto'

const instance = 'swissbosnian-network'
const apiKey = process.env.PAYREXX_API_KEY!

async function test(label: string, purpose: string) {
  const p = new URLSearchParams()
  p.append('amount', '5000')
  p.append('currency', 'CHF')
  p.append('purpose', purpose)
  p.append('successRedirect', 'https://www.swissbosnian-network.ch/de/mitmachen?success=true')
  p.append('failedRedirect', 'https://www.swissbosnian-network.ch/de/mitmachen?success=false')
  p.append('referenceId', 'test-123')
  p.append('fields[email][value]', 'test@test.ch')
  p.append('fields[email][mandatory]', '1')
  p.append('fields[forename][value]', 'Test')
  p.append('fields[forename][mandatory]', '1')
  p.append('fields[surname][value]', 'User')
  p.append('fields[surname][mandatory]', '1')

  const qs = p.toString()
  const signature = crypto.createHmac('sha256', apiKey).update(qs).digest('base64')
  const final = new URLSearchParams(qs)
  final.append('ApiSignature', signature)

  const res = await fetch(`https://api.payrexx.com/v1.0/Gateway/?instance=${instance}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: final.toString(),
  })
  const data = await res.json()
  const status = data.status === 'success' ? `✅ OK — ${data.data?.[0]?.link}` : `❌ ${data.message}`
  console.log(`[${label}] ${res.status} | ${status}`)
}

async function main() {
  await test('GOENNER purpose', 'Goenner-Mitgliedschaft-SBN')
  await test('PARTNER purpose', 'Partner-Mitgliedschaft-SBN')
}

main()
