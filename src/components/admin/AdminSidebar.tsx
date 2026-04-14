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
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react'

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/blog', icon: Newspaper, label: 'Blog / News' },
  { href: '/admin/events', icon: Calendar, label: 'Events' },
  { href: '/admin/newsletter', icon: Send, label: 'Newsletter' },
  { href: '/admin/members', icon: Users, label: 'Mitglieder' },
  { href: '/admin/payments', icon: CreditCard, label: 'Zahlungen' },
  { href: '/admin/settings', icon: Settings, label: 'Einstellungen' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

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
