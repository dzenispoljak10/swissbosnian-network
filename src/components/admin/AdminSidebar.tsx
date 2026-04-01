'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  FileText,
  Mail,
  Users,
  CreditCard,
  Settings,
  LogOut,
  ExternalLink,
  Calendar,
} from 'lucide-react'

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/blog', icon: FileText, label: 'Blog' },
  { href: '/admin/events', icon: Calendar, label: 'Events' },
  { href: '/admin/newsletter', icon: Mail, label: 'Newsletter' },
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
        <div className="navbar-logo">
          Swiss Bosnian <span>Network</span>
        </div>
        <p className="admin-sidebar-sub">Admin Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`admin-nav-item${isActive ? ' active' : ''}`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-3 space-y-0.5 border-t border-white/[0.06]">
        <Link
          href="/de"
          target="_blank"
          className="admin-nav-item"
        >
          <ExternalLink className="h-4 w-4" />
          Website anzeigen
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="admin-nav-item admin-nav-logout w-full"
        >
          <LogOut className="h-4 w-4" />
          Abmelden
        </button>
      </div>
    </aside>
  )
}
