import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }> }

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://swissbosnian-network.ch'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isDe = locale === 'de'

  const title = isDe
    ? 'Häufige Fragen (FAQ) – Swiss Bosnian Network'
    : 'Često postavljana pitanja (FAQ) – Swiss Bosnian Network'

  const description = isDe
    ? 'Antworten auf die häufigsten Fragen zum Swiss Bosnian Network – Mitgliedschaft, Events, Mitgliedervorteile und die bosnische Community in der Schweiz.'
    : 'Odgovori na najčešće postavljana pitanja o Swiss Bosnian Network – članstvo, događaji i bosanska zajednica u Švicarskoj.'

  const dePath = '/de/faq'
  const bsPath = '/bs/cesto-pitanja'
  const canonical = `${BASE}${isDe ? dePath : bsPath}`

  return {
    title,
    description,
    keywords: isDe
      ? 'Swiss Bosnian Network FAQ, häufige Fragen bosnische Community Schweiz, Mitgliedschaft Fragen, Events FAQ'
      : 'Swiss Bosnian Network FAQ, pitanja bosanska zajednica Švicarska, često pitanja',
    alternates: {
      canonical,
      languages: { de: `${BASE}${dePath}`, bs: `${BASE}${bsPath}` },
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

export { default } from './FaqPageClient'
