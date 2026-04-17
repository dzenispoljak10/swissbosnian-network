import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }> }

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://swissbosnian-network.ch'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isDe = locale === 'de'

  const title = isDe
    ? 'Swiss Bosnian Network – Die bosnische Community in der Schweiz'
    : 'Swiss Bosnian Network – Bosanska zajednica u Švicarskoj'

  const description = isDe
    ? 'Das Swiss Bosnian Network vernetzt Bosnier:innen in der Schweiz. Professionelles Netzwerk, exklusive Events und Mitgliedervorteile für die bosnische Diaspora.'
    : 'Swiss Bosnian Network povezuje Bosance u Švicarskoj. Profesionalna mreža, ekskluzivni događaji i povlastice za bosansku dijasporu.'

  return {
    title,
    description,
    keywords: isDe
      ? 'Swiss Bosnian Network, Bosnier Schweiz, bosnische Community Schweiz, Netzwerk Bosnier, Verein Bosnier Schweiz, bosnische Diaspora Schweiz'
      : 'Swiss Bosnian Network, Bosanci Švicarska, bosanska zajednica Švicarska, mreža Bosanci Švicarska',
    alternates: {
      canonical: `${BASE}/${locale}`,
      languages: { de: `${BASE}/de`, bs: `${BASE}/bs` },
    },
    openGraph: {
      title,
      description,
      url: `${BASE}/${locale}`,
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

export { default } from './HomePageClient'
