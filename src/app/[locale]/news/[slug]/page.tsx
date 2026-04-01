import { prisma } from '@/lib/prisma'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { formatDate } from '@/lib/utils'

type Props = { params: Promise<{ locale: string; slug: string }> }

export default async function BlogDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })

  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true },
    include: { author: { select: { name: true } } },
  })

  if (!post) notFound()

  const title = locale === 'bs' && post.titleBs ? post.titleBs : post.titleDe
  const content = locale === 'bs' && post.contentBs ? post.contentBs : post.contentDe
  const isTranslated = locale === 'bs' && !!post.contentBs

  return (
    <div>
      {post.coverImage && (
        <div className="relative h-72 lg:h-96 w-full">
          <Image src={post.coverImage} alt={title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 to-transparent" />
        </div>
      )}
      <section className={`${!post.coverImage ? 'bg-brand-blue text-white py-24' : '-mt-16 relative z-10'} px-4`}>
        <div className="max-w-4xl mx-auto">
          {!post.coverImage && (
            <>
              {post.category && (
                <span className="text-xs font-semibold text-brand-gold bg-brand-gold/20 px-3 py-1 rounded-full">
                  {post.category}
                </span>
              )}
              <h1 className="text-3xl lg:text-5xl font-bold text-white mt-4 mb-4">{title}</h1>
            </>
          )}
          {post.coverImage && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {post.category && (
                <span className="text-xs font-semibold text-brand-blue bg-brand-blue/10 px-3 py-1 rounded-full">
                  {post.category}
                </span>
              )}
              <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 mt-4 mb-3">{title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
                {post.author.name && <span>{post.author.name}</span>}
                {post.publishedAt && (
                  <span>{t('published')} {formatDate(post.publishedAt)}</span>
                )}
              </div>
              {locale === 'bs' && !post.contentBs && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-sm text-yellow-800">
                  {t('notAvailable')}
                </div>
              )}
              <div
                className="prose prose-gray max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          )}
        </div>
      </section>
      {!post.coverImage && (
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
              {post.author.name && <span>{post.author.name}</span>}
              {post.publishedAt && (
                <span>{t('published')} {formatDate(post.publishedAt)}</span>
              )}
            </div>
            {locale === 'bs' && !post.contentBs && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-sm text-yellow-800">
                {t('notAvailable')}
              </div>
            )}
            <div
              className="prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </section>
      )}
      <div className="border-t border-gray-100 py-8 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-brand-blue font-semibold hover:text-brand-blue-dark"
          >
            ← {t('backToBlog')}
          </Link>
        </div>
      </div>
    </div>
  )
}
