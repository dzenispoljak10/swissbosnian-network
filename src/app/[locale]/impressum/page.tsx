import { Link } from '@/i18n/navigation'
import type { Metadata } from 'next'
import React from 'react'

type Props = { params: Promise<{ locale: string }> }

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://swissbosnian-network.ch'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isDe = locale === 'de'
  const title = 'Impressum – Swiss Bosnian Network'
  const description = isDe
    ? 'Impressum des Swiss Bosnian Network – gemeinnütziger Verein mit Sitz in der Schweiz.'
    : 'Impressum Swiss Bosnian Network – neprofitno udruženje sa sjedištem u Švicarskoj.'
  const path = '/impressum'
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${locale}${path}`,
      languages: { de: `${BASE}/de${path}`, bs: `${BASE}/bs${path}` },
    },
    openGraph: { title, description, siteName: 'Swiss Bosnian Network', type: 'website' },
  }
}

const content = {
  de: {
    badge: 'Rechtliches',
    title: 'Impressum',
    blocks: [
      {
        title: 'Verein',
        rows: [
          { label: 'Name', value: 'Swiss Bosnian Network' },
          { label: 'Rechtsform', value: 'Gemeinnütziger Verein (Art. 60 ff. ZGB)' },
          { label: 'Sitz', value: 'Schweiz' },
        ],
      },
      {
        title: 'Kontakt',
        emailRow: { label: 'E-Mail', email: 'info@swissbosnian-network.ch' },
      },
      {
        title: 'Verantwortlich für den Inhalt',
        rows: [
          { label: 'Funktion', value: 'Vorstand Swiss Bosnian Network' },
        ],
        emailRow: { label: 'E-Mail', email: 'info@swissbosnian-network.ch' },
      },
      {
        title: 'Haftungsausschluss',
        para: 'Der Verein übernimmt keinerlei Gewähr für die Aktualität, Korrektheit, Vollständigkeit oder Qualität der bereitgestellten Informationen. Haftungsansprüche gegen den Verein, die sich auf Schäden materieller oder ideeller Art beziehen, welche durch die Nutzung oder Nichtnutzung der dargebotenen Informationen verursacht wurden, sind grundsätzlich ausgeschlossen.',
      },
      {
        title: 'Urheberrecht',
        para: 'Alle auf dieser Website veröffentlichten Inhalte (Texte, Bilder, Grafiken) unterliegen dem Urheberrecht des Swiss Bosnian Network oder der jeweiligen Rechteinhaber. Eine Verwendung ohne ausdrückliche schriftliche Genehmigung ist nicht gestattet.',
        last: true,
      },
    ],
    ctaTitle: 'Fragen oder Anliegen?',
    ctaSubtitle: 'Wir freuen uns über deine Nachricht.',
    ctaButton: 'Kontakt aufnehmen',
  },
  bs: {
    badge: 'Pravno',
    title: 'Impressum',
    blocks: [
      {
        title: 'Udruženje',
        rows: [
          { label: 'Naziv', value: 'Swiss Bosnian Network' },
          { label: 'Pravna forma', value: 'Neprofitno udruženje (čl. 60 i dalje ZGB)' },
          { label: 'Sjedište', value: 'Švicarska' },
        ],
      },
      {
        title: 'Kontakt',
        emailRow: { label: 'E-mail', email: 'info@swissbosnian-network.ch' },
      },
      {
        title: 'Odgovoran za sadržaj',
        rows: [
          { label: 'Funkcija', value: 'Upravni odbor Swiss Bosnian Network' },
        ],
        emailRow: { label: 'E-mail', email: 'info@swissbosnian-network.ch' },
      },
      {
        title: 'Odricanje odgovornosti',
        para: 'Udruženje ne preuzima nikakvu garanciju za aktualnost, ispravnost, potpunost ili kvalitet pruženih informacija. Zahtjevi za odgovornost prema Udruženju koji se odnose na materijalne ili nematerijalne štete nastale korištenjem ili nekorištenjem ponuđenih informacija, u principu su isključeni.',
      },
      {
        title: 'Autorska prava',
        para: 'Svi sadržaji objavljeni na ovoj web stranici (tekstovi, slike, grafike) podliježu autorskim pravima Swiss Bosnian Network ili odgovarajućih nositelja prava. Korištenje bez izričitog pisanog odobrenja nije dozvoljeno.',
        last: true,
      },
    ],
    ctaTitle: 'Pitanja ili nedoumice?',
    ctaSubtitle: 'Radujemo se vašoj poruci.',
    ctaButton: 'Kontaktiraj nas',
  },
}

export default async function ImpressumPage({ params }: Props) {
  const { locale } = await params
  const c = locale === 'bs' ? content.bs : content.de

  return (
    <div>
      <section style={{ background: '#F9FAFB', paddingTop: 'clamp(72px,10vw,128px)', paddingBottom: 'clamp(40px,6vw,72px)', borderBottom: '1px solid #E5E7EB' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(13,31,110,0.08)', border: '1px solid rgba(13,31,110,0.15)', color: '#0D1F6E', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, borderRadius: 6, padding: '4px 12px', marginBottom: 24 }}>
            {c.badge}
          </div>
          <h1 style={{ fontSize: 'clamp(32px,5vw,54px)', fontWeight: 800, color: '#0D1F6E', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 auto 16px', maxWidth: 560 }}>
            {c.title}
          </h1>
        </div>
      </section>

      <section className="section" style={{ background: '#ffffff' }}>
        <div className="container" style={{ maxWidth: 800 }}>
          {c.blocks.map((block) => (
            <ImpressumBlock key={block.title} title={block.title} last={block.last}>
              {'rows' in block && block.rows && block.rows.map((r) => (
                <Row key={r.label} label={r.label} value={r.value} />
              ))}
              {'emailRow' in block && block.emailRow && (
                <Row label={block.emailRow.label}>
                  <a href={`mailto:${block.emailRow.email}`} style={{ color: '#0D1F6E', textDecoration: 'none', fontWeight: 500 }}>
                    {block.emailRow.email}
                  </a>
                </Row>
              )}
              {'para' in block && block.para && (
                <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85 }}>{block.para}</p>
              )}
            </ImpressumBlock>
          ))}
        </div>
      </section>

      <section style={{ background: '#0D1F6E', padding: '64px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 80% 50%, rgba(45,82,184,0.35), transparent)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(20px,3vw,30px)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: 12 }}>
            {c.ctaTitle}
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', maxWidth: 380, margin: '0 auto 32px', lineHeight: 1.7 }}>
            {c.ctaSubtitle}
          </p>
          <Link href="/kontakt" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#F5C800', color: '#0D1F6E', fontWeight: 700, fontSize: 15, padding: '12px 28px', borderRadius: 8, textDecoration: 'none' }}>
            {c.ctaButton}
          </Link>
        </div>
      </section>
    </div>
  )
}

function ImpressumBlock({ title, children, last }: { title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div style={{ marginBottom: last ? 0 : 48, paddingBottom: last ? 0 : 48, borderBottom: last ? 'none' : '1px solid #F3F4F6' }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0D1F6E', marginBottom: 20 }}>{title}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {children}
      </div>
    </div>
  )
}

function Row({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div className="legal-row" style={{ display: 'flex', gap: 16, fontSize: 15 }}>
      <span className="legal-label" style={{ color: '#9CA3AF', fontWeight: 600, minWidth: 180, flexShrink: 0 }}>{label}</span>
      <span style={{ color: '#374151' }}>{children ?? value}</span>
    </div>
  )
}
