'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  Newspaper,
  Calendar,
  Send,
  Users,
  CreditCard,
  LogOut,
  ExternalLink,
  List,
  UserCheck,
} from 'lucide-react'

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/blog', icon: Newspaper, label: 'Blog / News' },
  { href: '/admin/events', icon: Calendar, label: 'Events' },
  { href: '/admin/members', icon: Users, label: 'Mitglieder' },
  { href: '/admin/payments', icon: CreditCard, label: 'Zahlungen' },
]

const newsletterItems = [
  { href: '/admin/newsletter', icon: Send, label: 'Kampagnen', exact: true },
  { href: '/admin/newsletter/lists', icon: List, label: 'Listen' },
  { href: '/admin/newsletter/subscribers', icon: UserCheck, label: 'Abonnenten' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  const isNewsletterActive = pathname.startsWith('/admin/newsletter')

  return (
    <aside className="admin-sidebar">
      {/* Logo */}
      <div className="admin-sidebar-logo">
        <div style={{ fontSize: 15, fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
          Swiss Bosnian <span style={{ color: '#F5C800' }}>Network</span>
        </div>
        <p className="admin-sidebar-sub">Admin Dashboard</p>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 0' }}>
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`admin-nav-item${isActive ? ' active' : ''}`}
            >
              <Icon size={16} strokeWidth={1.8} style={{ flexShrink: 0 }} />
              {label}
            </Link>
          )
        })}

        {/* Newsletter group */}
        <div style={{ marginTop: 2 }}>
          <div className={`admin-nav-item${isNewsletterActive ? ' active' : ''}`}
            style={{ cursor: 'default', pointerEvents: 'none' }}>
            <Send size={16} strokeWidth={1.8} style={{ flexShrink: 0 }} />
            Newsletter
          </div>
          {newsletterItems.map(({ href, icon: Icon, label, exact }) => {
            const isActive = exact
              ? pathname === href || pathname === '/admin/newsletter/new' || pathname.startsWith('/admin/newsletter/') && !pathname.startsWith('/admin/newsletter/lists') && !pathname.startsWith('/admin/newsletter/subscribers')
              : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`admin-nav-item${isActive ? ' active' : ''}`}
                style={{ paddingLeft: 36, fontSize: 13 }}
              >
                <Icon size={14} strokeWidth={1.8} style={{ flexShrink: 0 }} />
                {label}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bottom actions */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingBottom: 8 }}>
        <Link href="/de" target="_blank" className="admin-nav-item">
          <ExternalLink size={16} strokeWidth={1.8} />
          Website anzeigen
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="admin-nav-item admin-nav-logout"
          style={{ color: 'rgba(255,255,255,0.45)' }}
        >
          <LogOut size={16} strokeWidth={1.8} />
          Abmelden
        </button>
      </div>
    </aside>
  )
}
