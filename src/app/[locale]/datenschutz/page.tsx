import { Link } from '@/i18n/navigation'
import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Datenschutz — Swiss Bosnian Network',
  description: 'Datenschutzerklärung des Swiss Bosnian Network.',
}

type Props = { params: Promise<{ locale: string }> }

const content = {
  de: {
    badge: 'Rechtliches',
    title: 'Datenschutzerklärung',
    subtitle: 'Informationen zum Umgang mit deinen personenbezogenen Daten beim Swiss Bosnian Network.',
    ctaTitle: 'Fragen zum Datenschutz?',
    ctaSubtitle: 'Wir beantworten gerne all deine Fragen.',
    ctaButton: 'Kontakt aufnehmen',
    datenschutzLink: '/datenschutz',
    sections: [
      {
        number: '1',
        title: 'Verantwortliche Stelle',
        intro: 'Verantwortlich für die Datenverarbeitung auf dieser Website ist:',
        orgCard: true,
        orgName: 'Swiss Bosnian Network',
        orgType: 'Gemeinnütziger Verein · Schweiz',
        orgEmail: 'info@swissbosnian-network.ch',
      },
      {
        number: '2',
        title: 'Welche Daten wir erheben',
        intro: 'Wir erheben und verarbeiten personenbezogene Daten nur, soweit dies für die Nutzung unserer Website und unserer Dienstleistungen erforderlich ist. Dazu gehören:',
        items: [
          { label: 'Kontaktformular:', text: 'Name, E-Mail-Adresse, Betreff und Nachricht' },
          { label: 'Mitgliedschaft:', text: 'Vorname, Nachname, E-Mail-Adresse, optional Telefon und Unternehmen' },
          { label: 'Newsletter:', text: 'E-Mail-Adresse, optional Vorname' },
          { label: 'Technische Daten:', text: 'IP-Adresse, Browsertyp, Zugriffszeit (Server-Logs)' },
        ],
      },
      {
        number: '3',
        title: 'Zweck der Datenverarbeitung',
        intro: 'Deine Daten werden ausschliesslich für folgende Zwecke verwendet:',
        items: [
          { text: 'Bearbeitung von Kontaktanfragen und Mitgliedsanträgen' },
          { text: 'Versand des Newsletters (nur mit ausdrücklicher Einwilligung)' },
          { text: 'Verwaltung der Vereinsmitgliedschaft' },
          { text: 'Betrieb und Sicherheit der Website' },
        ],
      },
      {
        number: '4',
        title: 'Rechtsgrundlage',
        intro: 'Die Verarbeitung deiner Daten erfolgt auf Grundlage des schweizerischen Datenschutzgesetzes (DSG) sowie der Datenschutz-Grundverordnung (DSGVO), soweit anwendbar:',
        items: [
          { text: 'Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) — z.B. für den Newsletter' },
          { text: 'Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO) — z.B. für die Mitgliedschaft' },
          { text: 'Berechtigte Interessen (Art. 6 Abs. 1 lit. f DSGVO) — z.B. für den Betrieb der Website' },
        ],
      },
      {
        number: '5',
        title: 'Datenweitergabe',
        intro: 'Wir geben deine personenbezogenen Daten nicht an Dritte weiter, ausser:',
        items: [
          { text: 'dies ist zur Vertragserfüllung notwendig' },
          { text: 'wir gesetzlich dazu verpflichtet sind' },
          { text: 'du ausdrücklich eingewilligt hast' },
        ],
        outro: 'Für den E-Mail-Versand setzen wir Resend ein, einen Dienst der Resend Inc. (USA), mit dem ein Datenverarbeitungsvertrag besteht.',
        outroHighlight: 'Resend',
      },
      {
        number: '6',
        title: 'Cookies und Tracking',
        paras: [
          'Diese Website verwendet keine Tracking-Cookies von Drittanbietern und kein Google Analytics oder vergleichbare Dienste.',
          'Es können technisch notwendige Session-Cookies gesetzt werden, die für die Funktion der Website erforderlich sind. Diese werden nach dem Schliessen des Browsers gelöscht.',
        ],
      },
      {
        number: '7',
        title: 'Aufbewahrungsdauer',
        intro: 'Personenbezogene Daten werden nur so lange gespeichert, wie dies für den jeweiligen Zweck erforderlich ist:',
        items: [
          { label: 'Kontaktanfragen:', text: 'bis zur abschliessenden Bearbeitung' },
          { label: 'Mitgliedsdaten:', text: 'für die Dauer der Mitgliedschaft und gesetzliche Aufbewahrungsfristen' },
          { label: 'Newsletter:', text: 'bis zur Abmeldung' },
          { label: 'Server-Logs:', text: 'maximal 30 Tage' },
        ],
      },
      {
        number: '8',
        title: 'Deine Rechte',
        intro: 'Du hast jederzeit das Recht auf:',
        items: [
          { label: 'Auskunft', text: 'über die von uns gespeicherten Daten' },
          { label: 'Berichtigung', text: 'unrichtiger Daten' },
          { label: 'Löschung', text: 'deiner Daten (sofern keine gesetzliche Aufbewahrungspflicht besteht)' },
          { label: 'Einschränkung', text: 'der Verarbeitung' },
          { label: 'Datenübertragbarkeit', text: '' },
          { label: 'Widerspruch', text: 'gegen die Verarbeitung' },
        ],
        contactText: 'Für die Ausübung deiner Rechte wende dich bitte an:',
        contactEmail: 'info@swissbosnian-network.ch',
      },
      {
        number: '9',
        title: 'Änderungen dieser Erklärung',
        paras: [
          'Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen, um sie stets den aktuellen rechtlichen Anforderungen zu entsprechen oder Änderungen unserer Dienstleistungen widerzuspiegeln.',
          'Stand: April 2025',
        ],
        last: true,
      },
    ],
  },
  bs: {
    badge: 'Pravno',
    title: 'Izjava o zaštiti podataka',
    subtitle: 'Informacije o rukovanju vašim ličnim podacima u Swiss Bosnian Network.',
    ctaTitle: 'Pitanja o zaštiti podataka?',
    ctaSubtitle: 'Rado odgovaramo na sva vaša pitanja.',
    ctaButton: 'Kontaktiraj nas',
    datenschutzLink: '/datenschutz',
    sections: [
      {
        number: '1',
        title: 'Odgovorna strana',
        intro: 'Za obradu podataka na ovoj web stranici odgovoran je:',
        orgCard: true,
        orgName: 'Swiss Bosnian Network',
        orgType: 'Neprofitno udruženje · Švicarska',
        orgEmail: 'info@swissbosnian-network.ch',
      },
      {
        number: '2',
        title: 'Koje podatke prikupljamo',
        intro: 'Prikupljamo i obrađujemo lične podatke samo u mjeri u kojoj je to neophodno za korištenje naše web stranice i usluga. To uključuje:',
        items: [
          { label: 'Kontakt forma:', text: 'Ime, e-mail adresa, predmet i poruka' },
          { label: 'Članstvo:', text: 'Ime, prezime, e-mail adresa, opciono telefon i kompanija' },
          { label: 'Newsletter:', text: 'E-mail adresa, opciono ime' },
          { label: 'Tehnički podaci:', text: 'IP adresa, tip preglednika, vrijeme pristupa (server logovi)' },
        ],
      },
      {
        number: '3',
        title: 'Svrha obrade podataka',
        intro: 'Vaši podaci se koriste isključivo u sljedeće svrhe:',
        items: [
          { text: 'Obrada upita za kontakt i zahtjeva za članstvo' },
          { text: 'Slanje newslettera (samo uz izričitu saglasnost)' },
          { text: 'Upravljanje članstvom u udruženju' },
          { text: 'Rad i sigurnost web stranice' },
        ],
      },
      {
        number: '4',
        title: 'Pravna osnova',
        intro: 'Obrada vaših podataka vrši se na osnovu švicarskog Zakona o zaštiti podataka (DSG) i Opće uredbe o zaštiti podataka (GDPR), u mjeri u kojoj se primjenjuje:',
        items: [
          { text: 'Saglasnost (čl. 6 st. 1 lit. a GDPR) — npr. za newsletter' },
          { text: 'Izvršenje ugovora (čl. 6 st. 1 lit. b GDPR) — npr. za članstvo' },
          { text: 'Legitimni interesi (čl. 6 st. 1 lit. f GDPR) — npr. za rad web stranice' },
        ],
      },
      {
        number: '5',
        title: 'Prosljeđivanje podataka',
        intro: 'Vaše lične podatke ne prosljeđujemo trećim stranama, osim:',
        items: [
          { text: 'ako je to neophodno za izvršenje ugovora' },
          { text: 'ako smo zakonski obavezani' },
          { text: 'ako ste dali izričitu saglasnost' },
        ],
        outro: 'Za slanje e-pošte koristimo Resend, uslugu kompanije Resend Inc. (SAD), s kojom postoji ugovor o obradi podataka.',
        outroHighlight: 'Resend',
      },
      {
        number: '6',
        title: 'Kolačići i praćenje',
        paras: [
          'Ova web stranica ne koristi kolačiće trećih strana za praćenje niti Google Analytics ili slične usluge.',
          'Mogu se postaviti tehnički neophodni session kolačići, koji su potrebni za funkcioniranje web stranice. Oni se brišu nakon zatvaranja preglednika.',
        ],
      },
      {
        number: '7',
        title: 'Rok čuvanja',
        intro: 'Lični podaci se čuvaju samo onoliko dugo koliko je potrebno za odgovarajuću svrhu:',
        items: [
          { label: 'Upiti za kontakt:', text: 'do završetka obrade' },
          { label: 'Podaci članova:', text: 'za trajanje članstva i zakonske rokove čuvanja' },
          { label: 'Newsletter:', text: 'do odjave' },
          { label: 'Server logovi:', text: 'maksimalno 30 dana' },
        ],
      },
      {
        number: '8',
        title: 'Vaša prava',
        intro: 'U svakom trenutku imate pravo na:',
        items: [
          { label: 'Uvid', text: 'u podatke koje čuvamo o vama' },
          { label: 'Ispravak', text: 'netačnih podataka' },
          { label: 'Brisanje', text: 'vaših podataka (ako ne postoji zakonska obaveza čuvanja)' },
          { label: 'Ograničenje', text: 'obrade' },
          { label: 'Prenosivost podataka', text: '' },
          { label: 'Prigovor', text: 'na obradu' },
        ],
        contactText: 'Za ostvarivanje svojih prava obratite se na:',
        contactEmail: 'info@swissbosnian-network.ch',
      },
      {
        number: '9',
        title: 'Izmjene ove izjave',
        paras: [
          'Zadržavamo pravo da po potrebi prilagodimo ovu izjavu o zaštiti podataka kako bismo je uskladili s aktualnim zakonskim zahtjevima ili promjenama naših usluga.',
          'Stanje: April 2025',
        ],
        last: true,
      },
    ],
  },
}

export default async function DatenschutzPage({ params }: Props) {
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
            <DSection key={s.number} number={s.number} title={s.title} last={s.last}>
              {'orgCard' in s && s.orgCard ? (
                <>
                  <p>{s.intro}</p>
                  <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 12, padding: '16px 20px', marginTop: 4 }}>
                    <p style={{ fontWeight: 700, color: '#0D1F6E', marginBottom: 4 }}>{s.orgName}</p>
                    <p>{s.orgType}</p>
                    <a href={`mailto:${s.orgEmail}`} style={{ color: '#0D1F6E', textDecoration: 'none', fontWeight: 500 }}>{s.orgEmail}</a>
                  </div>
                </>
              ) : 'paras' in s && s.paras ? (
                s.paras.map((p, i) => <p key={i}>{p}</p>)
              ) : (
                <>
                  {'intro' in s && s.intro && <p>{s.intro}</p>}
                  {'items' in s && s.items && (
                    <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {s.items.map((item, i) => (
                        <li key={i}>
                          {'label' in item && item.label && <strong>{item.label} </strong>}
                          {item.text}
                        </li>
                      ))}
                    </ul>
                  )}
                  {'outro' in s && s.outro && <p>{s.outro}</p>}
                  {'contactText' in s && s.contactText && (
                    <p>
                      {s.contactText}{' '}
                      <a href={`mailto:${'contactEmail' in s ? s.contactEmail : ''}`} style={{ color: '#0D1F6E', textDecoration: 'none', fontWeight: 500 }}>
                        {'contactEmail' in s ? s.contactEmail : ''}
                      </a>
                    </p>
                  )}
                </>
              )}
            </DSection>
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

function DSection({ number, title, children, last }: { number: string; title: string; children: React.ReactNode; last?: boolean }) {
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
