import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }> }

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://swissbosnian-network.ch'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isDe = locale === 'de'

  const title = isDe
    ? 'Netzwerk & Events – Swiss Bosnian Network'
    : 'Mreža & Događaji – Swiss Bosnian Network'

  const description = isDe
    ? 'Entdecke exklusive Networking-Events für die bosnische Community in der Schweiz. After-Work, Business Meetings und Community-Treffen in Zürich, Bern und Basel.'
    : 'Otkrijte ekskluzivne networking događaje za bosansku zajednicu u Švicarskoj. Poslovni susreti i community događaji u Zürichu, Bernu i Baselu.'

  const dePath = '/de/netzwerk'
  const bsPath = '/bs/mreza'
  const canonical = `${BASE}${isDe ? dePath : bsPath}`

  return {
    title,
    description,
    keywords: isDe
      ? 'Networking Events Bosnier Schweiz, bosnische Events Zürich Bern Basel, Swiss Bosnian Netzwerk, Community Events'
      : 'Networking događaji Bosanci Švicarska, bosanski eventi Cirih, Swiss Bosnian mreža',
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

export { default } from './NetzwerkPageClient'
