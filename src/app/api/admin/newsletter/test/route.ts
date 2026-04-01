import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { resend } from '@/lib/resend'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { email, subject, content } = await req.json()

  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_placeholder') {
    return NextResponse.json({ error: 'Resend not configured', message: 'Test skipped - no API key' })
  }

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: `[TEST] ${subject}`,
    html: content,
  })

  return NextResponse.json({ success: true })
}
