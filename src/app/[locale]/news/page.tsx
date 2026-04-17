import { prisma } from '@/lib/prisma'
import { getTranslations } from 'next-intl/server'
import { formatDate } from '@/lib/utils'
import { PostCard } from './PostCard'
import EventCalendar from '@/components/EventCalendar'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }> }

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://swissbosnian-network.ch'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isDe = locale === 'de'

  const title = isDe
    ? 'News & Blog – Swiss Bosnian Network'
    : 'Vijesti & Blog – Swiss Bosnian Network'

  const description = isDe
    ? 'Aktuelle News, Berichte und Beiträge der bosnischen Community in der Schweiz. Bleib informiert mit dem Swiss Bosnian Network Blog.'
    : 'Aktuelne vijesti, izvještaji i tekstovi bosanske zajednice u Švicarskoj. Swiss Bosnian Network blog.'

  const dePath = '/de/news'
  const bsPath = '/bs/vijesti'
  const canonical = `${BASE}${isDe ? dePath : bsPath}`

  return {
    title,
    description,
    keywords: isDe
      ? 'Swiss Bosnian Network News, bosnische Community Schweiz aktuell, Blog Bosnier Schweiz, Beiträge Community'
      : 'Swiss Bosnian Network vijesti, bosanska zajednica Švicarska, blog Bosanci Švicarska',
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

export default async function BlogPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })

  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true, slug: true,
      titleDe: true, titleBs: true,
      excerptDe: true, excerptBs: true,
      coverImage: true, publishedAt: true, category: true,
    },
  })

  return (
    <div>
      {/* Hero */}
      <section style={{ background: '#0D1F6E', paddingTop: 'clamp(72px,10vw,128px)', paddingBottom: 'clamp(48px,6vw,80px)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 80% 50%, rgba(45,82,184,0.3), transparent)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(245,200,0,0.15)', border: '1px solid rgba(245,200,0,0.3)', color: '#F5C800', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, borderRadius: 6, padding: '4px 12px', marginBottom: 24 }}>
            News & Community
          </div>
          <h1 style={{ fontSize: 'clamp(32px,5vw,58px)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 auto 20px', maxWidth: 600 }}>
            News
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', maxWidth: 480, lineHeight: 1.75, margin: '0 auto' }}>
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Events Calendar */}
      <section style={{ padding: 'clamp(48px,6vw,80px) 0 clamp(28px,4vw,40px)', background: '#F0EEE9' }}>
        <div className="container">
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(13,31,110,0.08)', border: '1px solid rgba(13,31,110,0.15)', color: '#0D1F6E', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, borderRadius: 6, padding: '4px 12px', marginBottom: 16 }}>
              Events & Termine
            </div>
            <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800, color: '#0A0F1E', letterSpacing: '-0.025em', margin: '0 0 8px' }}>
              Community Events
            </h2>
            <p style={{ color: '#6B7280', fontSize: 16, margin: 0 }}>
              Alle Events und Termine des Swiss Bosnian Network auf einen Blick.
            </p>
          </div>
          <EventCalendar locale={locale} />
        </div>
      </section>

      <div className="container" style={{ borderTop: '1px solid #E5E0D8', margin: '0 auto' }} />

      {/* Posts */}
      <section className="section" style={{ background: '#F0EEE9' }}>
        <div className="container">
          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#9CA3AF' }}>
              <div style={{ fontSize: 56, marginBottom: 20 }}>📝</div>
              <p style={{ fontSize: 18, fontWeight: 600 }}>{t('noPost')}</p>
              <p style={{ fontSize: 14, marginTop: 8 }}>Schau bald wieder vorbei.</p>
            </div>
          ) : (
            <div style={{ gap: 24 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {posts.map(post => {
                const title = locale === 'bs' && post.titleBs ? post.titleBs : post.titleDe
                const excerpt = locale === 'bs' && post.excerptBs ? post.excerptBs : (post.excerptDe ?? null)
                const formattedDate = post.publishedAt
                  ? formatDate(post.publishedAt, locale === 'bs' ? 'hr' : 'de-CH')
                  : ''
                return (
                  <PostCard
                    key={post.id}
                    post={{ id: post.id, slug: post.slug, title, excerpt, coverImage: post.coverImage, publishedAt: post.publishedAt, category: post.category }}
                    locale={locale}
                    readMore={t('readMore')}
                    formattedDate={formattedDate}
                  />
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
