'use client'

import type { ComponentProps } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

type LocalHref = ComponentProps<typeof Link>['href']
import { Mail, MapPin, ArrowRight, Zap } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'

const LinkedInSvg = ({ size = 14 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const InstagramSvg = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
)

function AnimatedJoinButton({ href, label }: { href: LocalHref; label: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0,
        fontSize: 14,
        fontWeight: 600,
        color: '#ffffff',
        background: hovered ? '#132C70' : '#1B3A8C',
        borderRadius: 7,
        padding: '10px 18px',
        textDecoration: 'none',
        transition: 'background 0.2s ease, box-shadow 0.2s ease',
        boxShadow: hovered ? '0 4px 14px rgba(27,58,140,0.35)' : 'none',
        overflow: 'hidden',
      }}
    >
      <motion.span
        animate={{ x: hovered ? -4 : 0 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      >
        {label}
      </motion.span>
      <motion.span
        animate={{ x: hovered ? 4 : -4, opacity: hovered ? 1 : 0, width: hovered ? 22 : 0 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        style={{ display: 'inline-flex', alignItems: 'center', overflow: 'hidden', flexShrink: 0 }}
      >
        <ArrowRight size={14} strokeWidth={2.5} />
      </motion.span>
    </Link>
  )
}

const linkStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  color: '#64748B',
  textDecoration: 'none',
  marginBottom: 10,
  transition: 'color 0.15s ease',
}

const headingStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: '#0F172A',
  marginBottom: 16,
}

export default function Footer() {
  const t = useTranslations('footer')

  const menuLinks: Array<{ key: string; href: LocalHref }> = [
    { key: 'home',        href: '/' },
    { key: 'network',     href: '/netzwerk' },
    { key: 'about',       href: '/ueber-uns' },
    { key: 'participate', href: '/mitmachen' },
    { key: 'contact',     href: '/kontakt' },
  ]

  const communityLinks: Array<{ key: string; href: LocalHref }> = [
    { key: 'news',               href: '/news' },
    { key: 'events',             href: '/mitmachen' },
    { key: 'newsletter',         href: '/newsletter' },
    { key: 'faq',                href: '/faq' },
    { key: 'brandsForEmployees', href: '/brands-for-employees' },
  ]

  const legalLinks: Array<{ key: string; href: LocalHref }> = [
    { key: 'imprint',    href: '/impressum' },
    { key: 'agbs',       href: '/agbs' },
    { key: 'statutes',   href: '/statuten' },
    { key: 'datenschutz', href: '/datenschutz' },
  ]

  return (
    <footer style={{ background: '#ffffff', borderTop: '1px solid #E2E8F0' }}>
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '80px 24px 40px' }}>

        {/* 5-column grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1.5fr]"
          style={{ gap: 40 }}
        >

          {/* Col 1 — Contact */}
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', marginBottom: 24, letterSpacing: '-0.02em' }}>
              {t('contactTitle')}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Email */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <Mail size={15} style={{ color: '#1B3A8C', marginTop: 1, flexShrink: 0 }} />
                <div>
                  <a
                    href="mailto:info@swissbosnian-network.ch"
                    style={{ fontSize: 13, color: '#0F172A', fontWeight: 500, textDecoration: 'none', display: 'block', lineHeight: 1.5, transition: 'color 0.15s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#1B3A8C' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#0F172A' }}
                  >
                    info@swissbosnian-network.ch
                  </a>
                  <span style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.5 }}>{t('emailReply')}</span>
                </div>
              </div>

              {/* Location */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <MapPin size={15} style={{ color: '#1B3A8C', marginTop: 1, flexShrink: 0 }} />
                <div>
                  <span style={{ fontSize: 13, color: '#0F172A', fontWeight: 500, display: 'block', lineHeight: 1.5 }}>{t('location')}</span>
                  <span style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.5 }}>{t('nonprofit')}</span>
                </div>
              </div>

              {/* LinkedIn */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ color: '#1B3A8C', marginTop: 1, flexShrink: 0 }}>
                  <LinkedInSvg size={15} />
                </span>
                <a
                  href="https://www.linkedin.com/company/swiss-bosnian-network-official/posts/?feedView=all"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 13, color: '#0F172A', fontWeight: 500, textDecoration: 'none', lineHeight: 1.5, transition: 'color 0.15s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#1B3A8C' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#0F172A' }}
                >
                  linkedin.com/company/swiss-bosnian-network-official
                </a>
              </div>
            </div>

            <p style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.75, marginTop: 28, maxWidth: 320 }}>
              {t('description')}
            </p>
          </div>

          {/* Col 2 — Menü */}
          <div>
            <p style={headingStyle}>{t('menu')}</p>
            <nav>
              {menuLinks.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  style={linkStyle}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#0F172A' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#64748B' }}
                >
                  {t(link.key as Parameters<typeof t>[0])}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3 — Community */}
          <div>
            <p style={headingStyle}>{t('community')}</p>
            <nav>
              {communityLinks.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  style={linkStyle}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#0F172A' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#64748B' }}
                >
                  {t(link.key as Parameters<typeof t>[0])}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 4 — Rechtliches */}
          <div>
            <p style={headingStyle}>{t('legal')}</p>
            <nav>
              {legalLinks.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  style={linkStyle}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#0F172A' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#64748B' }}
                >
                  {t(link.key as Parameters<typeof t>[0])}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 5 — Join */}
          <div>
            <p style={headingStyle}>{t('join')}</p>
            <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7, marginBottom: 20 }}>
              {t('joinBody')}
            </p>
            <AnimatedJoinButton href="/mitmachen" label={t('joinCta')} />
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #E2E8F0', marginTop: 56 }} />

        {/* Bottom bar */}
        <div style={{
          paddingTop: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          {/* Left — logo + copyright + twyne */}
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Swiss Bosnian <span style={{ color: '#1B3A8C' }}>Network</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 5, flexWrap: 'wrap' }}>
              <p style={{ fontSize: 12, color: '#94A3B8' }}>
                {t('copyright')}
              </p>
              <a
                href="https://twyne.ch"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 11,
                  color: '#CBD5E1',
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#94A3B8' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#CBD5E1' }}
              >
                <Zap size={10} strokeWidth={2} />
                Website by twyne.ch
              </a>
            </div>
          </div>

          {/* Right — social circles */}
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              {
                label: 'LinkedIn',
                href: 'https://www.linkedin.com/company/swiss-bosnian-network-official/posts/?feedView=all',
                Icon: () => <LinkedInSvg size={18} />,
              },
              {
                label: 'Instagram',
                href: 'https://www.instagram.com/swissbosniannetwork/',
                Icon: () => <InstagramSvg size={18} />,
              },
            ].map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  border: '1px solid #E2E8F0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#64748B',
                  textDecoration: 'none',
                  transition: 'border-color 0.15s, color 0.15s, background 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#1B3A8C'
                  e.currentTarget.style.color = '#1B3A8C'
                  e.currentTarget.style.background = '#EEF2FF'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E2E8F0'
                  e.currentTarget.style.color = '#64748B'
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
