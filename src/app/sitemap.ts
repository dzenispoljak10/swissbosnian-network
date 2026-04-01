import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://swissbosnian-network.ch'
const locales = ['de', 'bs']

const staticPages = [
  '',
  '/ueber-uns',
  '/mitmachen',
  '/kontakt',
  '/faq',
  '/news',
  '/newsletter',
  '/statuten',
  '/impressum',
  '/agbs',
  '/datenschutz',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  // Static pages
  for (const page of staticPages) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        alternates: {
          languages: Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}${page}`])),
        },
      })
    }
  }

  // Blog posts
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  })

  for (const post of posts) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}/news/${post.slug}`,
        lastModified: post.updatedAt,
        alternates: {
          languages: Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}/news/${post.slug}`])),
        },
      })
    }
  }

  return entries
}
