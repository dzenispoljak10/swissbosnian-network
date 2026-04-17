import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }> }

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://swissbosnian-network.ch'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isDe = locale === 'de'

  const title = isDe
    ? 'Kontakt – Swiss Bosnian Network'
    : 'Kontakt – Swiss Bosnian Network'

  const description = isDe
    ? 'Nimm Kontakt mit dem Swiss Bosnian Network auf. Wir freuen uns über deine Nachricht und beantworten all deine Fragen zur bosnischen Community in der Schweiz.'
    : 'Kontaktirajte Swiss Bosnian Network. Radujemo se vašoj poruci i odgovorit ćemo na sva vaša pitanja o bosanskoj zajednici u Švicarskoj.'

  const path = '/kontakt'
  const canonical = `${BASE}/${locale}${path}`

  return {
    title,
    description,
    keywords: isDe
      ? 'Swiss Bosnian Network Kontakt, bosnischer Verein Schweiz Anfrage, Kontaktformular Community'
      : 'Swiss Bosnian Network kontakt, bosansko udruženje Švicarska upiti',
    alternates: {
      canonical,
      languages: { de: `${BASE}/de${path}`, bs: `${BASE}/bs${path}` },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Swiss Bosnian Network',
      locale: isDe ? 'de_CH' : 'bs_BA',
      type: 'website',
      images: [{ url: `${BASE}/logo.png`, width: 512, height: 512, alt: 'Swiss Bosnian Network' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${BASE}/logo.png`],
    },
  }
}

export { default } from './KontaktPageClient'
