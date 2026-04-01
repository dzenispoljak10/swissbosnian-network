'use client'

import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

type Post = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  coverImage: string | null
  publishedAt: Date | null
  category: string | null
}

export function PostCard({ post, locale, readMore, formattedDate }: {
  post: Post
  locale: string
  readMore: string
  formattedDate: string
}) {
  return (
    <Link
      href={{ pathname: '/news/[slug]', params: { slug: post.slug } }}
      style={{ display: 'flex', flexDirection: 'column', background: '#ffffff', borderRadius: 20, overflow: 'hidden', textDecoration: 'none', border: '1px solid rgba(0,0,0,0.05)', transition: 'transform 0.25s ease, box-shadow 0.25s ease' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 24px 48px rgba(13,31,110,0.1)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      {post.coverImage ? (
        <div style={{ height: 200, position: 'relative', flexShrink: 0, overflow: 'hidden' }}>
          <Image src={post.coverImage} alt={post.title} fill style={{ objectFit: 'cover' }} />
        </div>
      ) : (
        <div style={{ height: 200, background: 'linear-gradient(135deg, #0D1F6E, #1B3A8C)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 48 }}>📰</span>
        </div>
      )}
      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {post.category && (
          <span style={{ display: 'inline-flex', background: '#EEF2FF', color: '#0D1F6E', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: 5, padding: '3px 8px', marginBottom: 12, alignSelf: 'flex-start' }}>
            {post.category}
          </span>
        )}
        <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0A0F1E', lineHeight: 1.35, marginBottom: 10, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {post.title}
        </h3>
        {post.excerpt && (
          <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.75, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {post.excerpt}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 12, borderTop: '1px solid #F3F4F6' }}>
          {formattedDate && (
            <span style={{ fontSize: 12, color: '#9CA3AF' }}>{formattedDate}</span>
          )}
          <span style={{ fontSize: 13, fontWeight: 600, color: '#0D1F6E', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            {readMore} <ArrowRight size={13} strokeWidth={2.5} />
          </span>
        </div>
      </div>
    </Link>
  )
}
