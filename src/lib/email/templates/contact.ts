import { htmlToText } from '@/lib/email/htmlToText'

export type ContactData = {
  name: string
  email: string
  subject?: string
  message: string
  receivedAt: Date
}

export type Locale = 'de' | 'bs'

const FONT = `-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,sans-serif`
const BRAND = '#0D1F6E'
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

function nl2br(s: string): string {
  return escapeHtml(s).replace(/\n/g, '<br />')
}

function formatDate(d: Date, locale: Locale): string {
  return d.toLocaleString(locale === 'bs' ? 'bs-BA' : 'de-CH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function shell(inner: string, footer: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:${BG};font-family:${FONT};color:#0F172A;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};">
    <tr><td align="center" style="padding:24px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;border:1px solid ${BORDER};overflow:hidden;">
        <tr><td style="background:${BRAND};padding:24px 32px;">
          <div style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.01em;">Swiss Bosnian <span style="color:#F5C800;">Network</span></div>
        </td></tr>
        ${inner}
        <tr><td style="background:${BG};padding:20px 32px;border-top:1px solid ${BORDER};">
          <div style="font-size:12px;color:${MUTED};line-height:1.6;">${footer}</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ─────────────────────────────────────────────────────────
// Notification email (to admin) — German only
// ─────────────────────────────────────────────────────────

export function notificationEmailHtml(d: ContactData): string {
  const subject = d.subject?.trim() ? escapeHtml(d.subject) : '<em style="color:#9CA3AF;">(kein Betreff)</em>'
  const inner = `
    <tr><td style="padding:32px;">
      <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#0F172A;">Neue Kontaktanfrage</h1>
      <p style="margin:0 0 24px;font-size:14px;color:${MUTED};">Eingegangen am ${escapeHtml(formatDate(d.receivedAt, 'de'))}</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px;">
        <tr><td style="padding:8px 0;width:100px;font-size:13px;color:${MUTED};font-weight:600;">Name</td><td style="padding:8px 0;font-size:14px;color:#0F172A;">${escapeHtml(d.name)}</td></tr>
        <tr><td style="padding:8px 0;font-size:13px;color:${MUTED};font-weight:600;">E-Mail</td><td style="padding:8px 0;font-size:14px;"><a href="mailto:${escapeHtml(d.email)}" style="color:${BRAND};text-decoration:none;">${escapeHtml(d.email)}</a></td></tr>
        <tr><td style="padding:8px 0;font-size:13px;color:${MUTED};font-weight:600;vertical-align:top;">Betreff</td><td style="padding:8px 0;font-size:14px;color:#0F172A;">${subject}</td></tr>
      </table>
      <div style="background:${BG};border:1px solid ${BORDER};border-radius:8px;padding:16px 20px;">
        <div style="font-size:11px;font-weight:700;color:${MUTED};text-transform:uppercase;letter-spacing:0.06em;margin-bottom:10px;">Nachricht</div>
        <div style="font-size:14px;line-height:1.7;color:#0F172A;">${nl2br(d.message)}</div>
      </div>
      <p style="margin:24px 0 0;font-size:13px;color:${MUTED};">Antworte direkt auf diese E-Mail – sie geht an <strong>${escapeHtml(d.email)}</strong>.</p>
    </td></tr>
  `
  return shell(inner, 'Diese Nachricht wurde über das Kontaktformular auf swissbosnian-network.ch gesendet.')
}

export function notificationEmailText(d: ContactData): string {
  return htmlToText(notificationEmailHtml(d))
}

// ─────────────────────────────────────────────────────────
// Auto-confirmation (to sender) — DE / BS
// ─────────────────────────────────────────────────────────

const i18n = {
  de: {
    subject: 'Wir haben deine Nachricht erhalten – Swiss Bosnian Network',
    title: 'Vielen Dank für deine Nachricht!',
    intro: 'Wir haben deine Anfrage erhalten und melden uns so bald wie möglich bei dir.',
    copyLabel: 'Deine Nachricht',
    fieldSubject: 'Betreff',
    noSubject: '(kein Betreff)',
    receivedOn: 'Eingegangen am',
    closing: 'Beste Grüsse,',
    team: 'Das Team von Swiss Bosnian Network',
    footer: 'Diese E-Mail wurde automatisch versendet, weil du das Kontaktformular auf swissbosnian-network.ch ausgefüllt hast. Antworten an diese Mail werden gelesen.',
    imprint: 'Swiss Bosnian Network · Schweiz · info@swissbosnian-network.ch',
  },
  bs: {
    subject: 'Primili smo tvoju poruku – Swiss Bosnian Network',
    title: 'Hvala ti na poruci!',
    intro: 'Primili smo tvoj upit i javit ćemo se što je prije moguće.',
    copyLabel: 'Tvoja poruka',
    fieldSubject: 'Predmet',
    noSubject: '(bez predmeta)',
    receivedOn: 'Primljeno',
    closing: 'Lijep pozdrav,',
    team: 'Tim Swiss Bosnian Network',
    footer: 'Ova e-mail poruka je automatski poslana jer si ispunio/la kontakt formu na swissbosnian-network.ch. Odgovori na ovu poruku se čitaju.',
    imprint: 'Swiss Bosnian Network · Švicarska · info@swissbosnian-network.ch',
  },
} as const

export function confirmationEmailSubject(locale: Locale): string {
  return i18n[locale].subject
}

export function confirmationEmailHtml(d: ContactData, locale: Locale): string {
  const t = i18n[locale]
  const subject = d.subject?.trim() ? escapeHtml(d.subject) : `<em style="color:#9CA3AF;">${t.noSubject}</em>`
  const inner = `
    <tr><td style="padding:32px;">
      <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#0F172A;letter-spacing:-0.01em;">${t.title}</h1>
      <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#374151;">${t.intro}</p>
      <div style="background:${BG};border:1px solid ${BORDER};border-radius:8px;padding:18px 20px;margin-bottom:24px;">
        <div style="font-size:11px;font-weight:700;color:${MUTED};text-transform:uppercase;letter-spacing:0.06em;margin-bottom:12px;">${t.copyLabel}</div>
        <div style="font-size:13px;color:${MUTED};margin-bottom:6px;"><strong style="color:#374151;">${t.fieldSubject}:</strong> ${subject}</div>
        <div style="font-size:13px;color:${MUTED};margin-bottom:14px;">${escapeHtml(t.receivedOn)}: ${escapeHtml(formatDate(d.receivedAt, locale))}</div>
        <div style="font-size:14px;line-height:1.7;color:#0F172A;border-top:1px solid ${BORDER};padding-top:14px;">${nl2br(d.message)}</div>
      </div>
      <p style="margin:0;font-size:14px;color:#374151;">${t.closing}<br /><strong>${t.team}</strong></p>
    </td></tr>
  `
  return shell(inner, `${t.footer}<br /><br />${t.imprint}`)
}

export function confirmationEmailText(d: ContactData, locale: Locale): string {
  return htmlToText(confirmationEmailHtml(d, locale))
}
