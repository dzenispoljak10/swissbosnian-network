import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import type { Metadata } from 'next'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://swissbosnian-network.ch'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isDe = locale === 'de'

  return {
    metadataBase: new URL(BASE),
    title: {
      template: '%s | Swiss Bosnian Network',
      default: 'Swiss Bosnian Network',
    },
    description: isDe
      ? 'Das Swiss Bosnian Network vernetzt Bosnier:innen in der Schweiz. Professionelles Netzwerk, exklusive Events und Mitgliedervorteile für die bosnische Diaspora.'
      : 'Swiss Bosnian Network povezuje Bosance u Švicarskoj. Profesionalna mreža, ekskluzivni događaji i povlastice za bosansku dijasporu.',
    alternates: {
      canonical: `${BASE}/${locale}`,
      languages: {
        de: `${BASE}/de`,
        bs: `${BASE}/bs`,
      },
    },
    openGraph: {
      siteName: 'Swiss Bosnian Network',
      locale: isDe ? 'de_CH' : 'bs_BA',
      type: 'website',
      images: [
        {
          url: `${BASE}/logo.png`,
          width: 512,
          height: 512,
          alt: 'Swiss Bosnian Network',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@swissbosnian',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Swiss Bosnian Network',
  url: BASE,
  logo: `${BASE}/logo.png`,
  description: 'Das Swiss Bosnian Network vernetzt Bosnier:innen in der Schweiz – gemeinnütziger Verein für Networking, Events und Community.',
  foundingDate: '2022',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'CH',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'info@swissbosnian-network.ch',
    contactType: 'customer support',
    availableLanguage: ['German', 'Bosnian'],
  },
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'de' | 'bs')) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </NextIntlClientProvider>
  )
}
