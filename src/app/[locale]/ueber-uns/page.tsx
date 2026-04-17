import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }> }

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://swissbosnian-network.ch'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isDe = locale === 'de'

  const title = isDe
    ? 'Über uns – Swiss Bosnian Network'
    : 'O nama – Swiss Bosnian Network'

  const description = isDe
    ? 'Erfahre mehr über das Swiss Bosnian Network – unsere Mission, Vision und das Team hinter dem gemeinnützigen Verein für die bosnische Community in der Schweiz.'
    : 'Saznajte više o Swiss Bosnian Network – naša misija, vizija i tim iza neprofitnog udruženja za bosansku zajednicu u Švicarskoj.'

  const dePath = '/de/ueber-uns'
  const bsPath = '/bs/o-nama'
  const canonical = `${BASE}${isDe ? dePath : bsPath}`

  return {
    title,
    description,
    keywords: isDe
      ? 'Swiss Bosnian Network Über uns, bosnischer Verein Schweiz, Mission bosnische Community, Team Swiss Bosnian Network'
      : 'Swiss Bosnian Network o nama, bosansko udruženje Švicarska, misija bosanska zajednica',
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

export { default } from './AboutPageClient'
