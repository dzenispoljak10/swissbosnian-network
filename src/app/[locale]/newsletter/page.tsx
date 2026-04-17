import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }> }

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://swissbosnian-network.ch'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isDe = locale === 'de'

  const title = isDe
    ? 'Newsletter abonnieren – Swiss Bosnian Network'
    : 'Pretplatite se na Newsletter – Swiss Bosnian Network'

  const description = isDe
    ? 'Abonniere den Swiss Bosnian Network Newsletter und bleib über Events, Neuigkeiten und Mitgliedervorteile der bosnischen Community in der Schweiz informiert.'
    : 'Pretplatite se na Swiss Bosnian Network newsletter i budite informisani o događajima, novostima i povlasticama bosanske zajednice u Švicarskoj.'

  const path = '/newsletter'
  const canonical = `${BASE}/${locale}${path}`

  return {
    title,
    description,
    keywords: isDe
      ? 'Swiss Bosnian Network Newsletter, bosnische Community Schweiz Newsletter, Events aktuell Bosnier'
      : 'Swiss Bosnian Network newsletter, bosanska zajednica Švicarska novosti',
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

export { default } from './NewsletterPageClient'
