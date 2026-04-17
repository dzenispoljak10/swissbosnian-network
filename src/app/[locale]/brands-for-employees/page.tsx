import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }> }

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://swissbosnian-network.ch'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isDe = locale === 'de'

  const title = isDe
    ? 'Mitarbeitervorteile & Partnermarken – Swiss Bosnian Network'
    : 'Povlastice za zaposlene & Partnerske marke – Swiss Bosnian Network'

  const description = isDe
    ? 'Entdecke exklusive Partnermarken und Mitarbeitervorteile im Swiss Bosnian Network. Nachhaltige Kooperationen für die bosnische Business-Community in der Schweiz.'
    : 'Otkrijte ekskluzivne partnerske marke i povlastice za zaposlene u Swiss Bosnian Network. Suradnje za bosansku poslovnu zajednicu u Švicarskoj.'

  const dePath = '/de/brands-for-employees'
  const bsPath = '/bs/pogodnosti-za-clanove'
  const canonical = `${BASE}${isDe ? dePath : bsPath}`

  return {
    title,
    description,
    keywords: isDe
      ? 'Mitarbeitervorteile bosnische Unternehmen Schweiz, Swiss Bosnian Partnermarken, Unternehmensvorteile Community, Brands for Employees'
      : 'Povlastice za zaposlene bosanska zajednica Švicarska, Swiss Bosnian partnerske marke, pogodnosti',
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

export { default } from './BrandsPageClient'
