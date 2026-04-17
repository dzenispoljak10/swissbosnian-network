import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://swissbosnian-network.ch'

// Each entry: [internal route key, de path, bs path, priority, changefreq]
const staticRoutes: [string, string, string, number, MetadataRoute.Sitemap[number]['changeFrequency']][] = [
  ['home',                '',                        '',                           1.0,  'weekly'],
  ['netzwerk',            '/netzwerk',               '/mreza',                     0.9,  'weekly'],
  ['mitmachen',           '/mitmachen',              '/pridruzi-se',               0.9,  'monthly'],
  ['news',                '/news',                   '/vijesti',                   0.8,  'daily'],
  ['ueber-uns',           '/ueber-uns',              '/o-nama',                    0.7,  'monthly'],
  ['kontakt',             '/kontakt',                '/kontakt',                   0.7,  'monthly'],
  ['faq',                 '/faq',                    '/cesto-pitanja',             0.6,  'monthly'],
  ['brands-for-employees','/brands-for-employees',   '/pogodnosti-za-clanove',     0.6,  'monthly'],
  ['newsletter',          '/newsletter',             '/newsletter',                0.5,  'monthly'],
  ['statuten',            '/statuten',               '/statut',                    0.4,  'yearly'],
  ['impressum',           '/impressum',              '/impressum',                 0.3,  'yearly'],
  ['agbs',                '/agbs',                   '/uvjeti',                    0.3,  'yearly'],
  ['datenschutz',         '/datenschutz',            '/zastita-podataka',          0.3,  'yearly'],
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []
  const now = new Date()

  for (const [, dePath, bsPath, priority, changeFrequency] of staticRoutes) {
    entries.push({
      url: `${BASE}/de${dePath}`,
      lastModified: now,
      priority,
      changeFrequency,
      alternates: {
        languages: {
          de: `${BASE}/de${dePath}`,
          bs: `${BASE}/bs${bsPath}`,
        },
      },
    })
    entries.push({
      url: `${BASE}/bs${bsPath}`,
      lastModified: now,
      priority,
      changeFrequency,
      alternates: {
        languages: {
          de: `${BASE}/de${dePath}`,
          bs: `${BASE}/bs${bsPath}`,
        },
      },
    })
  }

  // Dynamic blog posts
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
    orderBy: { publishedAt: 'desc' },
  })

  for (const post of posts) {
    const dePath = `/news/${post.slug}`
    const bsPath = `/vijesti/${post.slug}`
    entries.push({
      url: `${BASE}/de${dePath}`,
      lastModified: post.updatedAt,
      priority: 0.7,
      changeFrequency: 'weekly',
      alternates: {
        languages: {
          de: `${BASE}/de${dePath}`,
          bs: `${BASE}/bs${bsPath}`,
        },
      },
    })
    entries.push({
      url: `${BASE}/bs${bsPath}`,
      lastModified: post.updatedAt,
      priority: 0.7,
      changeFrequency: 'weekly',
      alternates: {
        languages: {
          de: `${BASE}/de${dePath}`,
          bs: `${BASE}/bs${bsPath}`,
        },
      },
    })
  }

  return entries
}
