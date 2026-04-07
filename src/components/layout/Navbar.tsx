'use client'

import React, { useState, useEffect, useRef } from 'react'
import type { ComponentProps } from 'react'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { useTranslations, useLocale } from 'next-intl'

type LocalHref = ComponentProps<typeof Link>['href']
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, ChevronDown,
  Users, Calendar, TrendingUp,
  Shield, FileText,
} from 'lucide-react'
import Image from 'next/image'

// ─── Types ────────────────────────────────────────────────────────────────────

type DropdownKey = 'netzwerk' | 'ueber-uns' | null

// ─── Data ─────────────────────────────────────────────────────────────────────

const navLinks: Array<{ key: string; href: LocalHref; dropdown: DropdownKey }> = [
  { key: 'home',    href: '/',         dropdown: null },
  { key: 'network', href: '/netzwerk', dropdown: 'netzwerk' },
  { key: 'about',   href: '/ueber-uns',dropdown: 'ueber-uns' },
  { key: 'blog',    href: '/news',     dropdown: null },
  { key: 'contact', href: '/kontakt',  dropdown: null },
]

const LANGS = [
  { code: 'de', flag: '🇨🇭', label: 'DE' },
  { code: 'bs', flag: '🇧🇦', label: 'BS' },
] as const

// ─── LangSwitch ───────────────────────────────────────────────────────────────

function LangSwitch({ locale }: { locale: string }) {
  const router = useRouter()
  const pathname = usePathname()

  function switchTo(code: string) {
    // cast: usePathname type includes dynamic templates, but at runtime it's always a filled path
    router.replace(pathname as Parameters<typeof router.replace>[0], { locale: code })
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
      {LANGS.map((lang, i) => (
        <React.Fragment key={lang.code}>
          {i > 0 && (
            <span style={{ color: '#E5E7EB', fontSize: 13, userSelect: 'none' }}>/</span>
          )}
          <button
            onClick={() => switchTo(lang.code)}
            style={{
              background: 'none', border: 'none', padding: '2px 4px',
              cursor: locale === lang.code ? 'default' : 'pointer',
              fontFamily: 'inherit', fontSize: 13,
              fontWeight: locale === lang.code ? 700 : 400,
              color: locale === lang.code ? '#0D1F6E' : '#9CA3AF',
              transition: 'color 0.15s',
              outline: 'none',
            }}
            onMouseEnter={e => { if (locale !== lang.code) e.currentTarget.style.color = '#374151' }}
            onMouseLeave={e => { if (locale !== lang.code) e.currentTarget.style.color = '#9CA3AF' }}
          >
            {lang.label}
          </button>
        </React.Fragment>
      ))}
    </div>
  )
}

// ─── DropdownItem ─────────────────────────────────────────────────────────────

function DropdownItem({
  Icon, href, title, sub,
}: {
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>
  href: LocalHref
  title: string
  sub: string
}) {
  return (
    <Link
      href={href}
      style={{
        display: 'flex', gap: 12, alignItems: 'flex-start',
        padding: '10px', borderRadius: 8,
        textDecoration: 'none',
        transition: 'background 0.12s ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <div style={{
        width: 32, height: 32, borderRadius: 7,
        background: '#EEF2FF', color: '#0D1F6E',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={15} strokeWidth={2} />
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{title}</div>
        <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{sub}</div>
      </div>
    </Link>
  )
}

// ─── ColumnHeading ────────────────────────────────────────────────────────────

function ColHeading({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, color: '#9CA3AF',
      letterSpacing: '0.08em', textTransform: 'uppercase',
      marginBottom: 12,
    }}>
      {children}
    </div>
  )
}

// ─── NetzwerkDropdown ─────────────────────────────────────────────────────────

function NetzwerkDropdown({ t }: { t: ReturnType<typeof useTranslations> }) {
  type DropItem = { Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>; href: LocalHref; title: string; sub: string }
  const netzwerkCols: Array<{ heading: string; items: DropItem[] }> = [
    {
      heading: t('dropCommunityHeading'),
      items: [
        { Icon: Users,      href: '/netzwerk',                title: t('dropMembers'),  sub: t('dropMembersSub') },
        { Icon: Calendar,   href: '/news',                    title: t('dropEvents'),   sub: t('dropEventsSub') },
        { Icon: TrendingUp, href: '/netzwerk' as LocalHref,   title: t('dropGrowth'),   sub: t('dropGrowthSub') },
      ],
    },
    {
      heading: t('dropOrgHeading'),
      items: [
        { Icon: Shield,   href: '/ueber-uns',          title: t('dropClub'),     sub: t('dropClubSub') },
        { Icon: Users,    href: '/ueber-uns' as LocalHref, title: t('dropTeam'), sub: t('dropTeamSub') },
        { Icon: FileText, href: '/statuten',            title: t('dropStatutes'), sub: t('dropStatutesSub') },
      ],
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'absolute', top: 'calc(100% + 8px)', left: 0,
        width: 640, zIndex: 100,
        background: '#ffffff',
        borderRadius: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.06)',
        border: '1px solid #E5E7EB',
        padding: 24,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 8,
      }}
    >
      {netzwerkCols.map(col => (
        <div key={col.heading}>
          <ColHeading>{col.heading}</ColHeading>
          {col.items.map(item => (
            <DropdownItem key={item.title} {...item} />
          ))}
        </div>
      ))}

      {/* Column 3 — Featured */}
      <div>
        <ColHeading>{t('dropCurrentHeading')}</ColHeading>
        <Link
          href="/mitmachen"
          style={{
            display: 'block', textDecoration: 'none',
            background: 'linear-gradient(135deg, #0D1F6E, #1B3A8C)',
            borderRadius: 10, padding: 20,
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', marginBottom: 6 }}>
            Swiss Bosnian Network
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5, marginBottom: 14 }}>
            {t('dropCurrentCta')}
          </div>
          <span style={{
            display: 'inline-flex', alignItems: 'center',
            background: '#0D1F6E',
            border: '1px solid rgba(245,200,0,0.5)',
            borderRadius: 5, padding: '3px 8px',
            fontSize: 11, fontWeight: 700, color: '#F5C800',
            letterSpacing: '0.06em',
          }}>
            {t('dropNew')}
          </span>
        </Link>
      </div>
    </motion.div>
  )
}

// ─── UeberUnsDropdown ─────────────────────────────────────────────────────────

function UeberUnsDropdown({ t }: { t: ReturnType<typeof useTranslations> }) {
  type DropItem2 = { Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>; href: LocalHref; title: string; sub: string }
  const ueberUnsItems: DropItem2[] = [
    { Icon: Users,    href: '/ueber-uns' as LocalHref, title: t('dropTeam'),    sub: t('dropTeamSub') },
    { Icon: Shield,   href: '/ueber-uns',              title: t('dropAbout'),   sub: t('dropAboutSub') },
    { Icon: Calendar, href: '/kontakt',                title: t('dropContact'), sub: t('dropContactSub') },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'absolute', top: 'calc(100% + 8px)', left: 0,
        width: 280, zIndex: 100,
        background: '#ffffff',
        borderRadius: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.06)',
        border: '1px solid #E5E7EB',
        padding: 16,
      }}
    >
      <ColHeading>{t('dropAboutHeading')}</ColHeading>
      {ueberUnsItems.map(item => (
        <DropdownItem key={item.title} {...item} />
      ))}
    </motion.div>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export default function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const [activeDropdown, setActiveDropdown] = useState<DropdownKey>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const activeLinkKey = navLinks.find(link => {
    return link.href === '/'
      ? pathname === '/'
      : pathname.startsWith(link.href as string)
  })?.key

  const indicatorKey = hoveredLink ?? activeLinkKey

  useEffect(() => { setMobileOpen(false) }, [pathname])
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function openDropdown(key: DropdownKey) {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setActiveDropdown(key)
  }

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 150)
  }

  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: '#ffffff',
        borderBottom: '1px solid #E5E7EB',
        height: 64,
        transition: 'box-shadow 0.3s ease',
        boxShadow: scrolled ? '0 1px 16px rgba(0,0,0,0.06)' : 'none',
      }}>
        <div style={{
          maxWidth: 1140, margin: '0 auto', padding: '0 24px',
          width: '100%', height: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
        }}>

          {/* Logo */}
          <Link href="/" style={{
            display: 'inline-flex', alignItems: 'center',
            textDecoration: 'none', flexShrink: 0, whiteSpace: 'nowrap',
          }}>
            <Image
              src="/logo.png"
              alt="Swiss Bosnian Network"
              width={140}
              height={32}
              style={{ objectFit: 'contain', height: 32, width: 'auto', display: 'block' }}
              priority
            />
          </Link>

          {/* Center nav links */}
          <div
            className="hidden md:flex items-center"
            style={{ gap: 0 }}
            onMouseLeave={() => {
              setHoveredLink(null)
              scheduleClose()
            }}
          >
            {navLinks.map(link => {
              const isActive = link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href as string)
              const isHighlighted = indicatorKey === link.key
              const hasDropdown = link.dropdown !== null

              return (
                <div
                  key={link.key}
                  style={{ position: 'relative' }}
                  onMouseEnter={() => {
                    setHoveredLink(link.key)
                    cancelClose()
                    openDropdown(link.dropdown)
                  }}
                >
                  <Link
                    href={link.href}
                    style={{
                      position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 3,
                      fontSize: 14, fontWeight: isActive ? 600 : 500,
                      color: isHighlighted ? '#0D1F6E' : '#6B7280',
                      textDecoration: 'none', padding: '20px 14px 18px',
                      letterSpacing: '-0.01em',
                      transition: 'color 0.18s ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {t(link.key)}
                    {hasDropdown && (
                      <motion.span
                        animate={{ rotate: activeDropdown === link.dropdown ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ display: 'flex', color: 'inherit', opacity: 0.6 }}
                      >
                        <ChevronDown size={12} strokeWidth={2.5} />
                      </motion.span>
                    )}
                  </Link>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {activeDropdown === link.dropdown && link.dropdown === 'netzwerk' && (
                      <div
                        onMouseEnter={cancelClose}
                        onMouseLeave={scheduleClose}
                      >
                        <NetzwerkDropdown t={t} />
                      </div>
                    )}
                    {activeDropdown === link.dropdown && link.dropdown === 'ueber-uns' && (
                      <div
                        onMouseEnter={cancelClose}
                        onMouseLeave={scheduleClose}
                      >
                        <UeberUnsDropdown t={t} />
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>

          {/* Right column — desktop: Lang+CTA | mobile: hamburger */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>

            {/* Desktop */}
            <div className="hidden md:flex items-center" style={{ gap: 10 }}>
              <LangSwitch locale={locale} />

              <div style={{ width: 1, height: 16, background: '#E5E7EB', flexShrink: 0 }} />

              <Link href="/mitmachen"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  height: 40, padding: '0 20px',
                  fontSize: 14, fontWeight: 600, color: '#ffffff',
                  background: '#0D1F6E',
                  borderRadius: 7,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  transition: 'background 0.2s, transform 0.2s, box-shadow 0.2s',
                  boxShadow: '0 1px 3px rgba(13,31,110,0.2)',
                  letterSpacing: '-0.01em',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#1B3A8C'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(13,31,110,0.3)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#0D1F6E'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(13,31,110,0.2)'
                }}
              >
                {t('member')} <ArrowRight size={13} strokeWidth={2.5} />
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button className="md:hidden flex flex-col items-center justify-center" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu"
              style={{
                width: 38, height: 38,
                gap: 5, borderRadius: 7,
                border: '1px solid #E5E7EB', background: 'transparent', cursor: 'pointer',
              }}>
              <span style={{
                display: 'block', height: 1.5, width: 16, borderRadius: 2, background: '#374151',
                transition: 'transform 0.25s ease, opacity 0.2s ease',
                transform: mobileOpen ? 'rotate(45deg) translateY(6.5px)' : 'none',
              }} />
              <span style={{
                display: 'block', height: 1.5, width: 16, borderRadius: 2, background: '#374151',
                transition: 'opacity 0.2s ease', opacity: mobileOpen ? 0 : 1,
              }} />
              <span style={{
                display: 'block', height: 1.5, width: 16, borderRadius: 2, background: '#374151',
                transition: 'transform 0.25s ease',
                transform: mobileOpen ? 'rotate(-45deg) translateY(-6.5px)' : 'none',
              }} />
            </button>

          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'fixed', top: 64, left: 0, right: 0, zIndex: 40,
              background: '#fff', borderBottom: '1px solid #E5E7EB',
              boxShadow: '0 8px 32px rgba(0,0,0,0.07)',
            }}
          >
            <div style={{ maxWidth: 1140, margin: '0 auto', padding: '12px 24px 20px' }}>
              {navLinks.map(link => {
                const isActive = link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href as string)
                return (
                  <Link key={link.key} href={link.href}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '11px 12px', borderRadius: 8, marginBottom: 2,
                      fontSize: 15, fontWeight: isActive ? 600 : 500,
                      color: isActive ? '#0D1F6E' : '#374151',
                      background: isActive ? '#EEF2FF' : 'transparent',
                      textDecoration: 'none',
                    }}
                  >
                    {t(link.key)}
                    {isActive && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0D1F6E' }} />}
                  </Link>
                )
              })}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                paddingTop: 14, borderTop: '1px solid #F3F4F6', marginTop: 10,
              }}>
                <LangSwitch locale={locale} />
                <Link href="/mitmachen"
                  style={{
                    fontSize: 14, fontWeight: 600, color: '#fff', background: '#0D1F6E',
                    borderRadius: 7, padding: '9px 20px', textDecoration: 'none',
                  }}>
                  {t('member')}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
