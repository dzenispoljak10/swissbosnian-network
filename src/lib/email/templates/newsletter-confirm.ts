import { htmlToText } from '@/lib/email/htmlToText'

export type Locale = 'de' | 'bs'

export type ConfirmEmailData = {
  firstName: string
  confirmUrl: string
}

const FONT = `-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,sans-serif`
const BRAND = '#0D1F6E'
const ACCENT = '#F5C800'
const BORDER = '#E5E7EB'
const MUTED = '#6B7280'
const BG = '#F9FAFB'

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const i18n = {
  de: {
    subject: 'Bitte bestätige deine Newsletter-Anmeldung',
    greeting: (n: string) => `Hallo ${n},`,
    intro: 'vielen Dank für dein Interesse am Newsletter des Swiss Bosnian Network. Bitte bestätige deine Anmeldung, indem du auf den folgenden Button klickst:',
    button: 'Anmeldung bestätigen',
    fallbackHint: 'Falls der Button nicht funktioniert, kopiere diesen Link in deinen Browser:',
    validity: 'Der Bestätigungslink ist 7 Tage gültig.',
    notRequested: 'Falls du dich nicht für unseren Newsletter angemeldet hast, kannst du diese E-Mail einfach ignorieren – ohne Bestätigung erfolgt keine Anmeldung.',
    closing: 'Beste Grüsse,',
    team: 'Das Team von Swiss Bosnian Network',
    footer: 'Swiss Bosnian Network · Schweiz · info@swissbosnian-network.ch',
  },
  bs: {
    subject: 'Molimo potvrdi prijavu na newsletter',
    greeting: (n: string) => `Pozdrav ${n},`,
    intro: 'hvala ti na interesovanju za newsletter Swiss Bosnian Network-a. Molimo potvrdi svoju prijavu klikom na dugme ispod:',
    button: 'Potvrdi prijavu',
    fallbackHint: 'Ako dugme ne radi, kopiraj ovaj link u svoj preglednik:',
    validity: 'Link za potvrdu vrijedi 7 dana.',
    notRequested: 'Ako se nisi prijavio/la na naš newsletter, jednostavno ignoriši ovu poruku – bez potvrde se prijava ne aktivira.',
    closing: 'Lijep pozdrav,',
    team: 'Tim Swiss Bosnian Network',
    footer: 'Swiss Bosnian Network · Švicarska · info@swissbosnian-network.ch',
  },
} as const

export function confirmationRequestSubject(locale: Locale): string {
  return i18n[locale].subject
}

export function confirmationRequestHtml(d: ConfirmEmailData, locale: Locale): string {
  const t = i18n[locale]
  const name = escapeHtml(d.firstName.trim() || (locale === 'bs' ? 'tamo' : 'dort'))
  const url = d.confirmUrl

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:${BG};font-family:${FONT};color:#0F172A;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};">
    <tr><td align="center" style="padding:24px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;border:1px solid ${BORDER};overflow:hidden;">
        <tr><td style="background:${BRAND};padding:24px 32px;">
          <div style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.01em;">Swiss Bosnian <span style="color:${ACCENT};">Network</span></div>
        </td></tr>
        <tr><td style="padding:36px 32px 8px;">
          <p style="margin:0 0 12px;font-size:15px;color:#0F172A;">${t.greeting(name)}</p>
          <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#374151;">${t.intro}</p>
          <div style="text-align:center;margin:0 0 28px;">
            <a href="${url}" style="display:inline-block;background:${BRAND};color:#ffffff;text-decoration:none;border-radius:10px;padding:14px 36px;font-size:15px;font-weight:700;font-family:${FONT};">${t.button}</a>
          </div>
          <p style="margin:0 0 8px;font-size:12px;color:${MUTED};">${t.fallbackHint}</p>
          <p style="margin:0 0 24px;font-size:12px;word-break:break-all;"><a href="${url}" style="color:${BRAND};">${escapeHtml(url)}</a></p>
          <div style="border-top:1px solid ${BORDER};padding-top:20px;">
            <p style="margin:0 0 10px;font-size:13px;color:${MUTED};">${t.validity}</p>
            <p style="margin:0 0 18px;font-size:13px;color:${MUTED};line-height:1.6;">${t.notRequested}</p>
          </div>
          <p style="margin:0;font-size:14px;color:#374151;">${t.closing}<br /><strong>${t.team}</strong></p>
        </td></tr>
        <tr><td style="background:${BG};padding:18px 32px;border-top:1px solid ${BORDER};">
          <div style="font-size:12px;color:${MUTED};text-align:center;">${t.footer}</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

export function confirmationRequestText(d: ConfirmEmailData, locale: Locale): string {
  return htmlToText(confirmationRequestHtml(d, locale))
}
