import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { CheckCircle, ArrowRight } from 'lucide-react'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isDe = locale === 'de'
  return {
    title: isDe ? 'Anmeldung bestätigt – Swiss Bosnian Network' : 'Prijava potvrđena – Swiss Bosnian Network',
    robots: { index: false, follow: false },
  }
}

export default function NewsletterConfirmedPage() {
  const t = useTranslations('newsletterConfirmed')

  return (
    <section
      style={{
        background: '#F9FAFB',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: 'clamp(72px,10vw,128px)',
        paddingBottom: 'clamp(48px,6vw,96px)',
      }}
    >
      <div className="container" style={{ maxWidth: 560, textAlign: 'center' }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: '#F0FDF4',
            border: '1px solid #BBF7D0',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
          }}
        >
          <CheckCircle size={28} strokeWidth={1.75} style={{ color: '#22C55E' }} />
        </div>
        <h1
          style={{
            fontSize: 'clamp(28px,4vw,42px)',
            fontWeight: 800,
            color: '#0D1F6E',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            margin: '0 0 16px',
          }}
        >
          {t('title')}
        </h1>
        <p style={{ fontSize: 17, color: '#6B7280', lineHeight: 1.7, margin: '0 0 32px' }}>
          {t('body')}
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            height: 46,
            padding: '0 24px',
            background: '#0D1F6E',
            color: '#ffffff',
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 14,
            textDecoration: 'none',
          }}
        >
          {t('backHome')} <ArrowRight size={14} strokeWidth={2.5} />
        </Link>
      </div>
    </section>
  )
}
