import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }> }

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://swissbosnian-network.ch'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isDe = locale === 'de'

  const title = isDe
    ? 'Mitglied werden – Swiss Bosnian Network'
    : 'Pridruži se – Swiss Bosnian Network'

  const description = isDe
    ? 'Werde Mitglied beim Swiss Bosnian Network und vernetze dich mit der bosnischen Community in der Schweiz. Flexible Mitgliedschaftspläne für Einzelpersonen und Unternehmen.'
    : 'Postani član Swiss Bosnian Network i poveži se s bosanskom zajednicom u Švicarskoj. Fleksibilni planovi članarine za pojedince i kompanije.'

  const dePath = '/de/mitmachen'
  const bsPath = '/bs/pridruzi-se'
  const canonical = `${BASE}${isDe ? dePath : bsPath}`

  return {
    title,
    description,
    keywords: isDe
      ? 'Swiss Bosnian Network Mitglied werden, bosnischer Verein Schweiz beitreten, Mitgliedschaft Community Bosnier, Mitgliedsbeitrag'
      : 'Swiss Bosnian Network članstvo, bosansko udruženje Švicarska pridruži se, članarina',
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

export { default } from './MitmachenPageClient'
