import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Newspaper, Calendar, Send, Users, Edit } from 'lucide-react'

export default async function DashboardPage() {
  const [
    blogTotal,
    blogPublished,
    activeEvents,
    newsletterSubs,
    activeMembers,
    recentPosts,
    upcomingEvents,
  ] = await Promise.all([
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { published: true } }),
    prisma.event.count({ where: { published: true } }),
    prisma.newsletterSubscriber.count({ where: { subscribed: true } }),
    prisma.member.count({ where: { memberStatus: 'ACTIVE' } }),
    prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, titleDe: true, published: true, createdAt: true, category: true },
    }),
    prisma.event.findMany({
      where: { date: { gte: new Date() } },
      orderBy: { date: 'asc' },
      take: 5,
      select: { id: true, titleDe: true, date: true, location: true, color: true },
    }),
  ])

  const stats = [
    {
      label: 'Blog Einträge',
      value: blogTotal,
      sub: `${blogPublished} publiziert`,
      icon: Newspaper,
      iconColor: '#0D1F6E',
      iconBg: 'rgba(13,31,110,0.08)',
    },
    {
      label: 'Aktive Events',
      value: activeEvents,
      sub: null,
      icon: Calendar,
      iconColor: '#C9960A',
      iconBg: 'rgba(245,200,0,0.12)',
    },
    {
      label: 'Newsletter Abonnenten',
      value: newsletterSubs,
      sub: null,
      icon: Send,
      iconColor: '#0D1F6E',
      iconBg: 'rgba(13,31,110,0.08)',
    },
    {
      label: 'Aktive Mitglieder',
      value: activeMembers,
      sub: null,
      icon: Users,
      iconColor: '#0D1F6E',
      iconBg: 'rgba(13,31,110,0.08)',
    },
  ]

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', marginBottom: 24 }}>Dashboard</h1>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 32 }}>
        {stats.map(({ label, value, sub, icon: Icon, iconColor, iconBg }) => (
          <div key={label} style={{ background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} style={{ color: iconColor }} />
              </div>
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#0D1F6E', lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>{label}</div>
            {sub && <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 8 }}>{sub}</div>}
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* Recent Blog Posts */}
        <div style={{ background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Neueste Einträge</h2>
            <Link href="/admin/blog/new" style={{ fontSize: 12, fontWeight: 600, color: '#0D1F6E', textDecoration: 'none' }}>+ Neu</Link>
          </div>
          {recentPosts.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>Noch keine Einträge</div>
          ) : (
            <div>
              {recentPosts.map(post => (
                <div key={post.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', borderBottom: '1px solid #F9FAFB' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{post.titleDe}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>
                      {post.createdAt.toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                      background: post.published ? 'rgba(34,197,94,0.1)' : '#F3F4F6',
                      color: post.published ? '#15803d' : '#6B7280',
                    }}>
                      {post.published ? 'Publiziert' : 'Entwurf'}
                    </span>
                    <Link href={`/admin/blog/${post.id}/edit`} style={{ color: '#0D1F6E', lineHeight: 0 }}>
                      <Edit size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div style={{ background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Nächste Events</h2>
            <Link href="/admin/events/new" style={{ fontSize: 12, fontWeight: 600, color: '#0D1F6E', textDecoration: 'none' }}>+ Neu</Link>
          </div>
          {upcomingEvents.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>Keine kommenden Events</div>
          ) : (
            <div>
              {upcomingEvents.map(event => (
                <div key={event.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', borderBottom: '1px solid #F9FAFB' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: event.color, flexShrink: 0, display: 'inline-block' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.titleDe}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>
                      {event.date.toLocaleDateString('de-CH', { weekday: 'short', day: 'numeric', month: 'short' })}
                      {event.location && ` · ${event.location}`}
                    </div>
                  </div>
                  <Link href={`/admin/events/${event.id}/edit`} style={{ color: '#0D1F6E', lineHeight: 0, flexShrink: 0 }}>
                    <Edit size={14} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
