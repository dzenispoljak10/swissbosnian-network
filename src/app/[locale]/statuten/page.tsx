import { Link } from '@/i18n/navigation'
import type { Metadata } from 'next'
import React from 'react'

type Props = { params: Promise<{ locale: string }> }

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://swissbosnian-network.ch'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isDe = locale === 'de'
  const title = isDe ? 'Vereinsstatuten – Swiss Bosnian Network' : 'Statut udruženja – Swiss Bosnian Network'
  const description = isDe
    ? 'Die offiziellen Statuten des Swiss Bosnian Network – dem gemeinnützigen Verein für die bosnische Community in der Schweiz.'
    : 'Zvanični statut Swiss Bosnian Network – neprofitnog udruženja za bosansku zajednicu u Švicarskoj.'
  const dePath = '/de/statuten'
  const bsPath = '/bs/statut'
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
    title: 'Statuten',
    subtitle: 'Vereinsstatuten des Swiss Bosnian Network – gemeinnütziger Verein mit Sitz in der Schweiz.',
    ctaTitle: 'Fragen zu den Statuten?',
    ctaSubtitle: 'Wir sind für dich da und beantworten gerne all deine Fragen.',
    ctaButton: 'Kontakt aufnehmen',
    sections: [
      { title: 'Name und Sitz', body: ['Unter dem Namen Swiss Bosnian Network besteht ein gemeinnütziger Verein gemäss Art. 60 ff. ZGB mit Sitz in der Schweiz.', 'Der Verein ist politisch und religiös neutral.'] },
      { title: 'Vereinszweck', body: ['Der Verein bezweckt die Vernetzung und Förderung von Bosnier:innen in der Schweiz. Er fördert den Austausch von Wissen, Erfahrungen und beruflichen Chancen unter seinen Mitgliedern.', 'Der Verein verfolgt keine kommerziellen oder politischen Ziele und strebt keinen Gewinn an.'] },
      { title: 'Mitgliedschaft', body: ['Mitglied des Vereins kann jede natürliche oder juristische Person werden, die die Ziele des Vereins unterstützt.', 'Mitgliedschaftskategorien: Mitglied (kostenlos), Gönner:in (CHF 50.– / Jahr), Partner:in (CHF 500.– / Jahr).', 'Die Aufnahme erfolgt durch Einreichung eines Aufnahmegesuchs. Der Vorstand entscheidet.', 'Die Mitgliedschaft erlischt durch schriftlichen Austritt, Ausschluss oder Tod.'] },
      { title: 'Gönnerschaft und Partnerschaft', body: ['Gönnerbeiträge werden jährlich im Voraus entrichtet und fliessen vollständig in den Vereinszweck.', 'Der Vorstand ist berechtigt, die Beitragshöhe anzupassen.'] },
      { title: 'Organe des Vereins', body: ['Die Organe sind: die Generalversammlung, der Vorstand und die Revisionsstelle (sofern erforderlich).'] },
      { title: 'Generalversammlung', body: ['Die Generalversammlung findet mindestens einmal jährlich statt. Sie wählt den Vorstand, genehmigt Jahresbudget und -bericht, beschliesst über Satzungsänderungen und Auflösung.', 'Einladungen erfolgen mindestens 14 Tage im Voraus. Beschlüsse mit einfachem Mehr.'] },
      { title: 'Vorstand', body: ['Der Vorstand besteht aus mindestens 3 Personen, gewählt für 2 Jahre. Er führt die laufenden Geschäfte und vertritt den Verein nach aussen.', 'Mitglieder: Hamza (Präsident), Jasmina (Vizepräsidentin), Emir (Finanzen), Anesa (Social Media & Events), Dzenan (Aktuar).', 'Beschlüsse mit einfachem Mehr; bei Gleichstand entscheidet der Präsident.'] },
      { title: 'Finanzen', body: ['Der Verein finanziert sich durch Mitgliederbeiträge, Spenden, Sponsoring und Veranstaltungserträge.', 'Das Geschäftsjahr entspricht dem Kalenderjahr. Für Verbindlichkeiten haftet ausschliesslich das Vereinsvermögen.'] },
      { title: 'Auflösung', body: ['Auflösung nur durch ausserordentliche Generalversammlung mit Zweidrittelmehrheit. Das Vermögen geht an eine gemeinnützige Organisation mit ähnlichem Zweck.'] },
      { title: 'Inkrafttreten', body: ['Diese Statuten wurden an der Gründungsversammlung verabschiedet und treten mit sofortiger Wirkung in Kraft.'] },
    ],
  },
  bs: {
    badge: 'Pravno',
    title: 'Statut',
    subtitle: 'Statut udruženja Swiss Bosnian Network – neprofitno udruženje sa sjedištem u Švicarskoj.',
    ctaTitle: 'Pitanja o statutu?',
    ctaSubtitle: 'Tu smo za tebe i rado odgovaramo na sva pitanja.',
    ctaButton: 'Kontaktiraj nas',
    sections: [
      { title: 'Naziv i sjedište', body: ['Pod nazivom Swiss Bosnian Network postoji neprofitno udruženje prema čl. 60 i dalje ZGB-a sa sjedištem u Švicarskoj.', 'Udruženje je politički i vjerski neutralno.'] },
      { title: 'Svrha udruženja', body: ['Udruženje ima za cilj umrežavanje i promoviranje Bosanaca/Bosankinja u Švicarskoj. Potiče razmjenu znanja, iskustava i profesionalnih prilika među članovima.', 'Udruženje ne slijedi komercijalne ili političke ciljeve i ne teži profitu.'] },
      { title: 'Članstvo', body: ['Članom udruženja može postati svaka fizička ili pravna osoba koja podržava ciljeve udruženja.', 'Kategorije članstva: Član (besplatno), Pokrovitelj/Pokroviteljica (CHF 50.– / godišnje), Partner/Partnerica (CHF 500.– / godišnje).', 'Prijem se vrši podnošenjem zahtjeva. Upravni odbor odlučuje o prijemu.', 'Članstvo prestaje pisanim istupom, isključenjem ili smrću.'] },
      { title: 'Pokroviteljstvo i partnerstvo', body: ['Doprinosi pokrovitelja plaćaju se unaprijed godišnje i u cijelosti se koriste za svrhe udruženja.', 'Upravni odbor je ovlašten prilagoditi visinu doprinosa.'] },
      { title: 'Organi udruženja', body: ['Organi udruženja su: Skupština, Upravni odbor i Revizijska komisija (ako je potrebna).'] },
      { title: 'Skupština', body: ['Skupština se održava najmanje jednom godišnje. Bira Upravni odbor, odobrava godišnji budžet i izvještaj, odlučuje o izmjenama statuta i raspuštanju.', 'Pozivi se šalju najmanje 14 dana unaprijed. Odluke se donose prostom većinom.'] },
      { title: 'Upravni odbor', body: ['Upravni odbor se sastoji od najmanje 3 osobe, birane na 2 godine. Vodi tekuće poslove i zastupa udruženje prema vani.', 'Članovi: Hamza (Predsjednik), Jasmina (Potpredsjednica), Emir (Finansije), Anesa (Social Media & Događaji), Dzenan (Aktuar).', 'Odluke prostom većinom; pri izjednačenosti glasa Predsjednik ima odlučujući glas.'] },
      { title: 'Finansije', body: ['Udruženje se finansira putem članarina, donacija, sponzorstava i prihoda od događaja.', 'Poslovna godina odgovara kalendarskoj godini. Za obaveze odgovara isključivo imovina udruženja.'] },
      { title: 'Raspuštanje', body: ['Raspuštanje je moguće samo odlukom vanredne skupštine dvotrecinskom većinom. Imovina pripada neprofitnoj organizaciji sličnih ciljeva.'] },
      { title: 'Stupanje na snagu', body: ['Ovaj statut usvojen je na osnivačkoj skupštini i stupa na snagu s trenutnim dejstvom.'] },
    ],
  },
}

export default async function StatutenPage({ params }: Props) {
  const { locale } = await params
  const c = locale === 'bs' ? content.bs : content.de

  return (
    <div>
      <section style={{ background: '#F9FAFB', paddingTop: 'clamp(72px,10vw,128px)', paddingBottom: 'clamp(40px,6vw,72px)', borderBottom: '1px solid #E5E7EB' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(13,31,110,0.08)', border: '1px solid rgba(13,31,110,0.15)', color: '#0D1F6E', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, borderRadius: 6, padding: '4px 12px', marginBottom: 24 }}>
            {c.badge}
          </div>
          <h1 style={{ fontSize: 'clamp(32px,5vw,54px)', fontWeight: 800, color: '#0D1F6E', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 auto 16px', maxWidth: 560 }}>{c.title}</h1>
          <p style={{ fontSize: 17, color: '#6B7280', maxWidth: 480, lineHeight: 1.75, margin: '0 auto' }}>{c.subtitle}</p>
        </div>
      </section>

      <section className="section" style={{ background: '#ffffff' }}>
        <div className="container" style={{ maxWidth: 800 }}>
          {c.sections.map((s, i) => (
            <div key={s.title} style={{ marginBottom: i === c.sections.length - 1 ? 0 : 48, paddingBottom: i === c.sections.length - 1 ? 0 : 48, borderBottom: i === c.sections.length - 1 ? 'none' : '1px solid #F3F4F6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 36, height: 36, background: '#0D1F6E', color: '#F5C800', borderRadius: 8, fontSize: 13, fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0D1F6E', margin: 0 }}>{s.title}</h2>
              </div>
              <div style={{ paddingLeft: 52, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {s.body.map((p, j) => <p key={j} style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, margin: 0 }}>{p}</p>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: '#0D1F6E', padding: '64px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 80% 50%, rgba(45,82,184,0.35), transparent)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(22px,3vw,34px)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: 12 }}>{c.ctaTitle}</h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', maxWidth: 420, margin: '0 auto 32px', lineHeight: 1.7 }}>{c.ctaSubtitle}</p>
          <Link href="/kontakt" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#F5C800', color: '#0D1F6E', fontWeight: 700, fontSize: 15, padding: '12px 28px', borderRadius: 8, textDecoration: 'none' }}>
            {c.ctaButton}
          </Link>
        </div>
      </section>
    </div>
  )
}
