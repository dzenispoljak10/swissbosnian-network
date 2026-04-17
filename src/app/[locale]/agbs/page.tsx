import { Link } from '@/i18n/navigation'
import type { Metadata } from 'next'
import React from 'react'

type Props = { params: Promise<{ locale: string }> }

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://swissbosnian-network.ch'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isDe = locale === 'de'
  const title = isDe ? 'Allgemeine Geschäftsbedingungen – Swiss Bosnian Network' : 'Uvjeti korištenja – Swiss Bosnian Network'
  const description = isDe
    ? 'Allgemeine Geschäftsbedingungen des Swiss Bosnian Network für Mitglieder und Nutzer der Plattform.'
    : 'Uvjeti korištenja Swiss Bosnian Network za članove i korisnike platforme.'
  const dePath = '/de/agbs'
  const bsPath = '/bs/uvjeti'
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}${isDe ? dePath : bsPath}`,
      languages: { de: `${BASE}${dePath}`, bs: `${BASE}${bsPath}` },
    },
    openGraph: { title, description, siteName: 'Swiss Bosnian Network', type: 'website' },
  }
}

const content = {
  de: {
    badge: 'Rechtliches',
    title: 'Allgemeine Geschäftsbedingungen',
    subtitle: 'Nutzungsbedingungen für die Mitgliedschaft und Dienstleistungen des Swiss Bosnian Network.',
    ctaTitle: 'Fragen zu den AGB?',
    ctaSubtitle: 'Wir helfen dir gerne weiter.',
    ctaButton: 'Kontakt aufnehmen',
    datenschutzLabel: 'Datenschutzerklärung',
    sections: [
      {
        number: '1', title: 'Geltungsbereich',
        paras: [
          'Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Mitgliedschaften, Dienstleistungen und Angebote des Swiss Bosnian Network (nachfolgend «Verein»), einem gemeinnützigen Verein mit Sitz in der Schweiz.',
          'Mit der Nutzung der Website oder der Beantragung einer Mitgliedschaft stimmt die betroffene Person diesen AGB zu.',
        ],
      },
      {
        number: '2', title: 'Mitgliedschaft',
        intro: 'Die Mitgliedschaft im Swiss Bosnian Network steht allen natürlichen Personen offen, die die Ziele des Vereins unterstützen. Es bestehen folgende Kategorien:',
        items: [
          { label: 'Mitglied (kostenlos)', text: '— Zugang zu offenen Events, digitalen Inhalten und der Community' },
          { label: 'Gönner:in (CHF 50.– / Jahr)', text: '— Alle Mitgliedervorteile plus exklusive Partnerangebote' },
          { label: 'Partner:in (CHF 500.– / Jahr)', text: '— Alle Gönnervorteile plus Sichtbarkeit auf Plattform und Social Media' },
        ],
        outro: 'Der Vorstand entscheidet über die Aufnahme neuer Mitglieder. Es besteht kein Rechtsanspruch auf Aufnahme.',
      },
      {
        number: '3', title: 'Beiträge und Zahlungen',
        paras: [
          'Jahresbeiträge für Gönner:innen und Partner:innen werden jährlich im Voraus fällig. Bei Beitritt im Laufe des Jahres wird der Beitrag anteilig berechnet.',
          'Die Zahlungsabwicklung erfolgt über sichere Drittanbieter (Stripe). Der Verein speichert keine Kreditkartendaten.',
          'Bereits geleistete Beiträge werden bei Austritt oder Ausschluss nicht zurückerstattet, sofern kein gesetzlicher Anspruch besteht.',
        ],
      },
      {
        number: '4', title: 'Kündigung der Mitgliedschaft',
        paras: [
          'Die Mitgliedschaft kann jederzeit schriftlich per E-Mail an info@swissbosnian-network.ch gekündigt werden.',
          'Bei kostenpflichtigen Mitgliedschaften gilt eine Kündigungsfrist von 30 Tagen zum Ende des jeweiligen Abrechnungszeitraums.',
          'Der Vorstand behält sich vor, Mitglieder bei schwerwiegendem Verstoss gegen die Vereinsinteressen oder diese AGB auszuschliessen.',
        ],
        emailIn3: true,
      },
      {
        number: '5', title: 'Nutzung der Plattform',
        intro: 'Die Nutzung der Website und der Vereinsangebote ist ausschliesslich für private und berufliche Zwecke gestattet, die mit den Vereinszielen vereinbar sind. Untersagt ist insbesondere:',
        items: [
          { text: 'Verbreitung rechtswidriger, beleidigender oder diskriminierender Inhalte' },
          { text: 'Kommerzielle Werbung ohne Genehmigung des Vorstands' },
          { text: 'Verwendung der Mitgliederdaten für eigene Zwecke' },
          { text: 'Politische oder religiöse Propaganda' },
        ],
      },
      {
        number: '6', title: 'Haftung',
        paras: [
          'Der Verein haftet nicht für Schäden, die durch die Nutzung oder Nichtnutzung der angebotenen Inhalte entstehen, sofern kein nachweisbares Verschulden des Vereins vorliegt.',
          'Für Inhalte verlinkter externer Websites übernimmt der Verein keine Haftung. Die Verantwortung liegt ausschliesslich beim jeweiligen Betreiber.',
        ],
      },
      {
        number: '7', title: 'Datenschutz',
        datenschutzSection: true,
        text: 'Der Umgang mit personenbezogenen Daten richtet sich nach unserer',
        textAfter: ', die Bestandteil dieser AGB ist.',
      },
      {
        number: '8', title: 'Änderungen der AGB',
        paras: [
          'Der Verein behält sich vor, diese AGB jederzeit zu ändern. Mitglieder werden über wesentliche Änderungen per E-Mail informiert. Die fortgesetzte Nutzung der Angebote nach Bekanntgabe der Änderungen gilt als Zustimmung.',
        ],
      },
      {
        number: '9', title: 'Anwendbares Recht und Gerichtsstand',
        paras: [
          'Es gilt schweizerisches Recht. Gerichtsstand ist der Sitz des Vereins in der Schweiz.',
          'Stand: April 2025',
        ],
        last: true,
      },
    ],
  },
  bs: {
    badge: 'Pravno',
    title: 'Opći uvjeti poslovanja',
    subtitle: 'Uvjeti korištenja za članstvo i usluge Swiss Bosnian Network.',
    ctaTitle: 'Pitanja o OUP-u?',
    ctaSubtitle: 'Rado vam pomažemo.',
    ctaButton: 'Kontaktiraj nas',
    datenschutzLabel: 'Izjavi o zaštiti podataka',
    sections: [
      {
        number: '1', title: 'Područje primjene',
        paras: [
          'Ovi Opći uvjeti poslovanja (OUP) važe za sva članstva, usluge i ponude Swiss Bosnian Network (u daljem tekstu „Udruženje"), neprofitnog udruženja sa sjedištem u Švicarskoj.',
          'Korištenjem web stranice ili podnošenjem zahtjeva za članstvo, dotična osoba prihvata ove OUP.',
        ],
      },
      {
        number: '2', title: 'Članstvo',
        intro: 'Članstvo u Swiss Bosnian Network otvoreno je svim fizičkim osobama koje podržavaju ciljeve Udruženja. Postoje sljedeće kategorije:',
        items: [
          { label: 'Član (besplatno)', text: '— Pristup otvorenim događajima, digitalnim sadržajima i zajednici' },
          { label: 'Pokrovitelj/Pokroviteljica (CHF 50.– / godišnje)', text: '— Sve pogodnosti člana plus ekskluzivne partnerske ponude' },
          { label: 'Partner/Partnerica (CHF 500.– / godišnje)', text: '— Sve pogodnosti pokrovitelja plus vidljivost na platformi i društvenim mrežama' },
        ],
        outro: 'Upravni odbor odlučuje o prijemu novih članova. Ne postoji pravno pravo na prijem.',
      },
      {
        number: '3', title: 'Doprinosi i plaćanja',
        paras: [
          'Godišnji doprinosi za pokrovitelje i partnere dospijevaju unaprijed jednom godišnje. Pri pristupanju tokom godine, doprinos se obračunava proporcionalno.',
          'Plaćanje se vrši putem sigurnih trećih davatelja usluga (Stripe). Udruženje ne pohranjuje podatke o kreditnim karticama.',
          'Već uplaćeni doprinosi se ne vraćaju pri istupanju ili isključenju, osim ako postoji zakonski zahtjev.',
        ],
      },
      {
        number: '4', title: 'Otkaz članstva',
        paras: [
          'Članstvo se može otkazati u bilo koje vrijeme pismeno putem e-pošte na info@swissbosnian-network.ch.',
          'Za plaćena članstva važi otkazni rok od 30 dana do kraja odgovarajućeg obračunskog perioda.',
          'Upravni odbor zadržava pravo isključenja članova u slučaju ozbiljnog kršenja interesa Udruženja ili ovih OUP.',
        ],
        emailIn3: true,
      },
      {
        number: '5', title: 'Korištenje platforme',
        intro: 'Korištenje web stranice i ponuda Udruženja dozvoljeno je isključivo u privatne i profesionalne svrhe koje su u skladu s ciljevima Udruženja. Posebno je zabranjeno:',
        items: [
          { text: 'Širenje nezakonitih, uvredljivih ili diskriminirajućih sadržaja' },
          { text: 'Komercijalno oglašavanje bez odobrenja Upravnog odbora' },
          { text: 'Korištenje podataka članova u vlastite svrhe' },
          { text: 'Politička ili vjerska propaganda' },
        ],
      },
      {
        number: '6', title: 'Odgovornost',
        paras: [
          'Udruženje ne odgovara za štete nastale korištenjem ili nekorištenjem ponuđenih sadržaja, osim ako postoji dokaziva krivica Udruženja.',
          'Za sadržaje povezanih vanjskih web stranica Udruženje ne preuzima odgovornost. Odgovornost snosi isključivo odgovarajući operater.',
        ],
      },
      {
        number: '7', title: 'Zaštita podataka',
        datenschutzSection: true,
        text: 'Rukovanje ličnim podacima regulirano je našom',
        textAfter: ', koja je sastavni dio ovih OUP.',
      },
      {
        number: '8', title: 'Izmjene OUP-a',
        paras: [
          'Udruženje zadržava pravo izmjene ovih OUP u bilo koje vrijeme. Članovi će biti obaviješteni o bitnim izmjenama putem e-pošte. Nastavak korištenja ponuda nakon objave izmjena smatra se suglasnošću.',
        ],
      },
      {
        number: '9', title: 'Mjerodavno pravo i nadležnost suda',
        paras: [
          'Primjenjuje se švicarsko pravo. Nadležni sud je sud prema sjedištu Udruženja u Švicarskoj.',
          'Stanje: April 2025',
        ],
        last: true,
      },
    ],
  },
}

export default async function AGBsPage({ params }: Props) {
  const { locale } = await params
  const c = locale === 'bs' ? content.bs : content.de

  return (
    <div>
      <section style={{ background: '#F9FAFB', paddingTop: 'clamp(72px,10vw,128px)', paddingBottom: 'clamp(40px,6vw,72px)', borderBottom: '1px solid #E5E7EB' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(13,31,110,0.08)', border: '1px solid rgba(13,31,110,0.15)', color: '#0D1F6E', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, borderRadius: 6, padding: '4px 12px', marginBottom: 24 }}>
            {c.badge}
          </div>
          <h1 style={{ fontSize: 'clamp(32px,5vw,54px)', fontWeight: 800, color: '#0D1F6E', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 auto 16px', maxWidth: 600 }}>
            {c.title}
          </h1>
          <p style={{ fontSize: 17, color: '#6B7280', maxWidth: 520, lineHeight: 1.75, margin: '0 auto' }}>
            {c.subtitle}
          </p>
        </div>
      </section>

      <section className="section" style={{ background: '#ffffff' }}>
        <div className="container" style={{ maxWidth: 800 }}>
          {c.sections.map((s) => (
            <AGBSection key={s.number} number={s.number} title={s.title} last={s.last}>
              {'datenschutzSection' in s && s.datenschutzSection ? (
                <p>
                  {s.text}{' '}
                  <Link href="/datenschutz" style={{ color: '#0D1F6E', textDecoration: 'none', fontWeight: 500 }}>
                    {c.datenschutzLabel}
                  </Link>
                  {s.textAfter}
                </p>
              ) : 'paras' in s && s.paras ? (
                s.paras.map((p, i) => {
                  if ('emailIn3' in s && s.emailIn3 && i === 0) {
                    const parts = p.split('info@swissbosnian-network.ch')
                    return (
                      <p key={i}>
                        {parts[0]}
                        <a href="mailto:info@swissbosnian-network.ch" style={{ color: '#0D1F6E', textDecoration: 'none', fontWeight: 500 }}>
                          info@swissbosnian-network.ch
                        </a>
                        {parts[1]}
                      </p>
                    )
                  }
                  return <p key={i}>{p}</p>
                })
              ) : (
                <>
                  {'intro' in s && s.intro && <p>{s.intro}</p>}
                  {'items' in s && s.items && (
                    <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {s.items.map((item, i) => (
                        <li key={i}>
                          {'label' in item && item.label && <strong>{item.label}</strong>}
                          {' '}{item.text}
                        </li>
                      ))}
                    </ul>
                  )}
                  {'outro' in s && s.outro && <p>{s.outro}</p>}
                </>
              )}
            </AGBSection>
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

function AGBSection({ number, title, children, last }: { number: string; title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div style={{ marginBottom: last ? 0 : 48, paddingBottom: last ? 0 : 48, borderBottom: last ? 'none' : '1px solid #F3F4F6' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 36, height: 36, background: '#0D1F6E', color: '#F5C800', borderRadius: 8, fontSize: 13, fontWeight: 800, flexShrink: 0 }}>
          {number}
        </span>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0D1F6E', margin: 0 }}>{title}</h2>
      </div>
      <div style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, display: 'flex', flexDirection: 'column', gap: 12, paddingLeft: 52 }}>
        {children}
      </div>
    </div>
  )
}
