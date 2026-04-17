'use client'

import type { ComponentProps } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'

type LocalHref = ComponentProps<typeof Link>['href']
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect, useCallback } from 'react'
import {
  ArrowRight, Users, ArrowLeftRight, TrendingUp,
  Heart, Scale, Lightbulb, Shield,
  CheckCircle, Mail, Globe, Calendar,
  Tag, RefreshCw, Building2, Network,
} from 'lucide-react'
import dynamic from 'next/dynamic'
import { ConcentricCircles } from '@/components/ui/ConcentricCircles'
import toast from 'react-hot-toast'

const EuropeMap = dynamic(() => import('@/components/EuropeMap'), { ssr: false })

const ease = [0.4, 0, 0.2, 1] as const

/* ─── FadeUp ─────────────────────────────────────── */
function FadeUp({ children, delay = 0, className, style }: {
  children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease, delay }}
      className={className} style={style}>
      {children}
    </motion.div>
  )
}

/* ─── Animated counter ───────────────────────────── */
function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    let n = 0
    const step = target / (1400 / 16)
    const timer = setInterval(() => {
      n += step
      if (n >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(n))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])
  return <span ref={ref}>{count}{suffix}</span>
}

/* ─── Spotlight card ─────────────────────────────── */
function SpotlightCard({ children, className, style }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
    ref.current.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`)
  }, [])
  return (
    <div ref={ref} onMouseMove={handleMouseMove} className={`card ${className ?? ''}`} style={style}>
      {children}
    </div>
  )
}

/* ─── FAQ Item ───────────────────────────────────── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="faq-item">
      <button className="faq-question" onClick={() => setOpen(!open)}
        style={{ color: open ? '#0D1F6E' : undefined }}>
        <span style={{ paddingRight: 32 }}>{q}</span>
        <span style={{
          fontSize: 22, color: '#0D1F6E', flexShrink: 0,
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
          transform: open ? 'rotate(45deg)' : 'none',
        }}>+</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease }}
            className="overflow-hidden">
            <p className="faq-answer">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Underline link ─────────────────────────────── */
function UnderlineLink({ href, children }: { href: LocalHref; children: React.ReactNode }) {
  return (
    <Link href={href} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontSize: 14, fontWeight: 700, color: '#0A0F1E',
      textDecoration: 'none',
      borderBottom: '1.5px solid #0A0F1E', paddingBottom: 2,
      transition: 'opacity 0.15s',
    }}
    onMouseEnter={e => (e.currentTarget.style.opacity = '0.65')}
    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
    >
      {children} <ArrowRight size={13} strokeWidth={2.5} />
    </Link>
  )
}

/* ─── Main Page ──────────────────────────────────── */
export default function HomePage() {
  const t = useTranslations('home')
  const tFaq = useTranslations('faq')
  const locale = useLocale()
  const [nlFirstName, setNlFirstName] = useState('')
  const [nlLastName, setNlLastName] = useState('')
  const [nlEmail, setNlEmail] = useState('')
  const [nlErrors, setNlErrors] = useState<{ firstName?: string; lastName?: string; email?: string }>({})
  const [nlLoading, setNlLoading] = useState(false)
  const faqItems = tFaq.raw('items') as Array<{ q: string; a: string }>
  const networkFeatures = t.raw('network.features') as string[]
  const bfeFeatures = t.raw('bfe.features') as Array<{ title: string; body: string }>
  const pricingPlans = t.raw('pricing.plans') as Array<{ name: string; price: string; period: string; desc: string; features: string[]; cta: string }>

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault()
    const errors: { firstName?: string; lastName?: string; email?: string } = {}
    if (!nlFirstName.trim()) errors.firstName = 'Vorname ist Pflicht.'
    if (!nlLastName.trim()) errors.lastName = 'Nachname ist Pflicht.'
    if (!nlEmail.trim()) errors.email = 'E-Mail ist Pflicht.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nlEmail)) errors.email = 'Ungültige E-Mail-Adresse.'
    if (Object.keys(errors).length > 0) { setNlErrors(errors); return }
    setNlErrors({})
    setNlLoading(true)
    try {
      const res = await fetch('/api/public/newsletter/subscribe', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: nlFirstName, lastName: nlLastName, email: nlEmail }),
      })
      if (res.status === 201) {
        toast.success('Erfolgreich angemeldet!')
        setNlFirstName(''); setNlLastName(''); setNlEmail('')
      } else if (res.status === 409) {
        toast.error('Diese E-Mail ist bereits angemeldet.')
      } else {
        toast.error('Bitte alle Felder ausfüllen.')
      }
    } catch {
      toast.error('Ein Fehler ist aufgetreten.')
    } finally {
      setNlLoading(false)
    }
  }

  // suppress unused import warnings
  void SpotlightCard; void Users; void ArrowLeftRight; void TrendingUp

  return (
    <div className="flex flex-col">

      {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
      <section style={{
        paddingTop: 64 + 80, paddingBottom: 80,
        background: '#fff',
        position: 'relative',
        minHeight: '88vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}>
        <motion.div
          className="hidden lg:block"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 1.0, delay: 0.2, ease }}
          style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}
        >
          <EuropeMap
            width={900}
            height={700}
            style={{
              position: 'absolute',
              right: -80,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />
        </motion.div>

        <div className="hidden lg:block" style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: '55%', zIndex: 1, pointerEvents: 'none',
          background: 'linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 60%, rgba(255,255,255,0) 100%)',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
          <div style={{ maxWidth: 560 }}>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease }} style={{ marginBottom: 24 }}>
              <span className="badge badge-navy">
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
                {t('hero.badge')}
              </span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease }}
              style={{ color: '#0A0F1E' }}>
              {t('hero.titleLine1')}<br />{t('hero.titleLine2')}{' '}
              <span className="serif-italic" style={{ color: '#0D1F6E', fontWeight: 400 }}>
                {t('hero.titleItalic')}
              </span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease }}
              style={{ fontSize: 18, color: '#374151', maxWidth: 460, marginTop: 20, marginBottom: 36, lineHeight: 1.75 }}>
              {t('hero.subtitle')}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32, ease }}
              style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <Link href={"/mitmachen"} className="btn btn-primary btn-lg">
                {t('hero.ctaJoin')} <ArrowRight size={16} />
              </Link>
              <Link href={"/netzwerk"} className="btn btn-outline btn-lg">
                {t('hero.cta')}
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5, ease }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 36 }}>
              <div style={{ display: 'flex', flexShrink: 0 }}>
                {['#0D1F6E','#1B3A8C','#2D52B8','#C9960A','#CC1C1C'].map((c, i) => (
                  <div key={i} style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: c, border: '2px solid #fff',
                    marginLeft: i > 0 ? -10 : 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: '#fff',
                  }}>
                    {['H','J','E','A','D'][i]}
                  </div>
                ))}
              </div>
              <span style={{ fontSize: 14, color: '#6B7280' }}>
                {t('hero.socialProof')}
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          QUICK LINKS BANNER
      ═══════════════════════════════════════════ */}
      <div style={{ background: '#fff', padding: '80px 24px 32px' }}>
        <FadeUp>
          <div style={{
            background: '#EEF2FF',
            border: '1px solid #C7D2FE',
            borderRadius: 12,
            padding: '20px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: 1140,
            margin: '0 auto',
            position: 'relative',
            overflow: 'hidden',
            flexWrap: 'wrap',
            gap: 16,
          }}>
            <ConcentricCircles size={280} color="#0D1F6E" opacity={0.06}
              style={{ right: -60, top: '50%', transform: 'translateY(-50%)' }} />
            <span style={{ fontSize: 15, fontWeight: 600, color: '#0D1F6E', position: 'relative', zIndex: 1 }}>
              {t('quickLinks.question')}
            </span>
            <div style={{ display: 'flex', gap: 28, alignItems: 'center', position: 'relative', zIndex: 1, flexWrap: 'wrap' }}>
              {([
                { key: 'quickLinks.join', href: '/mitmachen' },
                { key: 'quickLinks.about', href: '/ueber-uns' },
                { key: 'quickLinks.events', href: '/netzwerk' },
              ] as Array<{ key: string; href: LocalHref }>).map(link => (
                <Link key={link.key} href={link.href} style={{
                  fontSize: 14, fontWeight: 600, color: '#0D1F6E',
                  textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5,
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.65')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  {t(link.key as Parameters<typeof t>[0])} <ArrowRight size={14} strokeWidth={2.5} />
                </Link>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>

      {/* ═══════════════════════════════════════════
          SECTION B — FEATURE BLOCK
      ═══════════════════════════════════════════ */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <h2 style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: 800, color: '#0A0F1E', letterSpacing: '-0.025em' }}>
                {t('network.sectionTitle')}
              </h2>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div style={{
              background: '#F0EEE9',
              borderRadius: 20,
              padding: '48px',
              position: 'relative',
              overflow: 'hidden',
              minHeight: 280,
            }}>
              <ConcentricCircles size={480} color="#0D1F6E" opacity={0.07}
                style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }} />

              <div className="hidden lg:block" style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '60%', zIndex: 1, overflow: 'hidden' }}>
                <EuropeMap width={560} height={320} style={{ width: '100%', height: '100%' }} />
              </div>

              <div className="w-full lg:w-2/5" style={{ position: 'relative', zIndex: 2, background: 'inherit' }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0A0F1E', marginBottom: 12 }}>
                  {t('network.heading')}
                </h3>
                <p style={{ fontSize: 15, color: '#6B7280', lineHeight: 1.75, marginBottom: 16 }}>
                  {t('network.body')}
                </p>
                {networkFeatures.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <CheckCircle size={15} style={{ color: '#0D1F6E', flexShrink: 0 }} strokeWidth={2} />
                    <span style={{ fontSize: 14, fontWeight: 500, color: '#0D1F6E' }}>{f}</span>
                  </div>
                ))}
                <div style={{ marginTop: 20 }}>
                  <UnderlineLink href={"/netzwerk"}>{t('network.cta')}</UnderlineLink>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION B2 — PILLARS
      ═══════════════════════════════════════════ */}
      <section style={{ background: '#F9FAFB', padding: '80px 0' }}>
        <div className="container">
          <FadeUp>
            <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800, color: '#0A0F1E', letterSpacing: '-0.025em', maxWidth: 700, marginBottom: 16 }}>
              {t('mission.title')}
            </h2>
            <p style={{ fontSize: 16, color: '#6B7280', lineHeight: 1.8, maxWidth: 680, marginBottom: 48 }}>
              {t('mission.body')}
            </p>
          </FadeUp>

          <motion.div
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
            initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
            style={{ gap: 20 }}
            className="grid grid-cols-1 md:grid-cols-3">
            {[
              { Icon: Users, titleKey: 'pillars.together.title', bodyKey: 'pillars.together.body' },
              { Icon: Network, titleKey: 'pillars.connected.title', bodyKey: 'pillars.connected.body' },
              { Icon: TrendingUp, titleKey: 'pillars.strong.title', bodyKey: 'pillars.strong.body' },
            ].map(({ Icon, titleKey, bodyKey }) => (
              <motion.div
                key={titleKey}
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.42, ease } } }}
                style={{
                  background: '#ffffff',
                  border: '1px solid #E5E7EB',
                  borderRadius: 16,
                  padding: 32,
                  cursor: 'default',
                  transition: 'transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease',
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.borderColor = '#0D1F6E'
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(13,31,110,0.09)'
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = '#E5E7EB'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const x = e.clientX - rect.left
                  const y = e.clientY - rect.top
                  e.currentTarget.style.background = `radial-gradient(circle 180px at ${x}px ${y}px, rgba(13,31,110,0.04), transparent 70%), #ffffff`
                }}
              >
                <div style={{ width: 56, height: 56, background: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={28} strokeWidth={1.5} style={{ color: '#0D1F6E' }} />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0A0F1E', marginTop: 20, marginBottom: 10 }}>{t(titleKey as Parameters<typeof t>[0])}</h3>
                <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.75, margin: 0 }}>{t(bodyKey as Parameters<typeof t>[0])}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Banner */}
          <FadeUp delay={0.1}>
            <div style={{
              background: '#0D1F6E',
              borderRadius: 16,
              padding: '40px 48px',
              marginTop: 48,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 32,
              flexWrap: 'wrap',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <ConcentricCircles size={360} color="#ffffff" opacity={0.05}
                style={{ right: -80, top: '50%', transform: 'translateY(-50%)' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>
                  {t('network.bannerTitle')}
                </h3>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, margin: 0, maxWidth: 520 }}>
                  {t('network.bannerBody')}
                </p>
              </div>
              <Link href={"/netzwerk"}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#F5C800', color: '#0D1F6E', fontWeight: 700, fontSize: 15, padding: '12px 24px', borderRadius: 8, border: 'none', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0, position: 'relative', zIndex: 1, transition: 'opacity 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                {t('network.bannerCta')} <ArrowRight size={14} strokeWidth={2.5} />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION C — TRUST GRID (2×2 Bento)
      ═══════════════════════════════════════════ */}
      <section className="section" style={{ background: '#fff', paddingTop: 0 }}>
        <div className="container">
          <FadeUp>
            <h2 style={{
              textAlign: 'center',
              fontSize: 'clamp(24px,3.5vw,40px)',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              marginBottom: 40,
              color: '#0A0F1E',
            }}>
              {t('trust.title')}
            </h2>
          </FadeUp>

          <motion.div
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
            initial="hidden" whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            style={{ gap: 16, alignItems: 'stretch' }}
            className="grid grid-cols-1 sm:grid-cols-2">

            {/* Card 1 — Two Countries: Beige */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease } } }}
              style={{ display: 'flex' }}>
              <div style={{
                background: '#F0EEE9', borderRadius: 16, padding: '40px',
                position: 'relative', overflow: 'hidden',
                border: '1px solid rgba(0,0,0,0.04)',
                minHeight: 220, flex: 1, display: 'flex', flexDirection: 'column',
              }}>
                <ConcentricCircles size={360} color="#0D1F6E" opacity={0.07}
                  style={{ right: -80, top: '50%', transform: 'translateY(-50%)' }} />
                <Globe size={18} style={{ color: '#0D1F6E', display: 'inline-flex', marginBottom: 12, position: 'relative', zIndex: 1 }} strokeWidth={1.75} />
                <h3 style={{ fontSize: 22, fontWeight: 700, color: '#0A0F1E', lineHeight: 1.25, marginBottom: 12, position: 'relative', zIndex: 1 }}>
                  {t('trust.twoCountriesTitle')}
                </h3>
                <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7, position: 'relative', zIndex: 1, flex: 1 }}>
                  {t('trust.twoCountriesBody')}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 20, position: 'relative', zIndex: 1 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://flagcdn.com/w40/ch.png" width={36} height={24} alt="Schweiz"
                    style={{ borderRadius: 4, objectFit: 'cover', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', display: 'block' }} />
                  <ArrowLeftRight size={18} style={{ color: '#C9960A', flexShrink: 0 }} strokeWidth={1.75} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://flagcdn.com/w40/ba.png" width={36} height={24} alt="Bosnien"
                    style={{ borderRadius: 4, objectFit: 'cover', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', display: 'block' }} />
                </div>
              </div>
            </motion.div>

            {/* Card 2 — Nonprofit: Navy */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease } } }}
              style={{ display: 'flex' }}>
              <div style={{
                background: '#0D1F6E', borderRadius: 16, padding: '40px',
                position: 'relative', overflow: 'hidden',
                minHeight: 220, flex: 1, display: 'flex', flexDirection: 'column',
              }}>
                <ConcentricCircles size={320} color="#ffffff" opacity={0.06}
                  style={{ right: -60, bottom: -60 }} />
                <Shield size={18} style={{ color: '#F5C800', display: 'inline-flex', marginBottom: 12, position: 'relative', zIndex: 1 }} strokeWidth={1.75} />
                <h3 style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', marginBottom: 12, position: 'relative', zIndex: 1, lineHeight: 1.25 }}>
                  {t('trust.nonprofitTitle')}
                </h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 14, position: 'relative', zIndex: 1, lineHeight: 1.7, flex: 1 }}>
                  {t('trust.nonprofitBody')}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, position: 'relative', zIndex: 1 }}>
                  <CheckCircle size={14} style={{ color: '#F5C800', flexShrink: 0 }} strokeWidth={2} />
                  <p style={{ fontSize: 13, color: '#F5C800', fontWeight: 600, margin: 0 }}>
                    {t('trust.nonprofitCheck')}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Card 3 — 15+ Events: Gold */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease } } }}
              style={{ display: 'flex' }}>
              <div style={{
                background: '#F5C800', borderRadius: 16, padding: '36px',
                position: 'relative', overflow: 'hidden',
                minHeight: 220, flex: 1, display: 'flex', flexDirection: 'column',
              }}>
                <ConcentricCircles size={280} color="#0D1F6E" opacity={0.08}
                  style={{ right: -60, top: '50%', transform: 'translateY(-50%)' }} />
                <div style={{ fontSize: 52, fontWeight: 900, color: '#0D1F6E', letterSpacing: '-0.04em', position: 'relative', zIndex: 1, lineHeight: 1 }}>
                  <AnimatedNumber target={15} suffix="+" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'rgba(13,31,110,0.6)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 6, position: 'relative', zIndex: 1 }}>
                  <Calendar size={14} strokeWidth={2} style={{ opacity: 0.7, flexShrink: 0 }} />
                  {t('trust.eventsLabel')}
                </div>
                <p style={{ fontSize: 13, color: 'rgba(13,31,110,0.65)', marginTop: 10, lineHeight: 1.65, position: 'relative', zIndex: 1, flex: 1 }}>
                  {t('trust.eventsBody')}
                </p>
              </div>
            </motion.div>

            {/* Card 4 — 200+ Members: Beige */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease } } }}
              style={{ display: 'flex' }}>
              <div style={{
                background: '#F0EEE9', borderRadius: 16, padding: '36px',
                position: 'relative', overflow: 'hidden',
                border: '1px solid rgba(0,0,0,0.04)',
                minHeight: 220, flex: 1, display: 'flex', flexDirection: 'column',
              }}>
                <ConcentricCircles size={280} color="#0D1F6E" opacity={0.07}
                  style={{ right: -60, top: '50%', transform: 'translateY(-50%)' }} />
                <div style={{ fontSize: 52, fontWeight: 900, color: '#0D1F6E', letterSpacing: '-0.04em', position: 'relative', zIndex: 1, lineHeight: 1 }}>
                  <AnimatedNumber target={200} suffix="+" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 6, position: 'relative', zIndex: 1 }}>
                  <Users size={14} strokeWidth={2} style={{ opacity: 0.7, flexShrink: 0 }} />
                  {t('trust.membersLabel')}
                </div>
                <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 10, lineHeight: 1.65, position: 'relative', zIndex: 1, flex: 1 }}>
                  {t('trust.membersBody')}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION BFE — BRANDS FOR EMPLOYEES
      ═══════════════════════════════════════════ */}
      <section className="section" style={{ background: '#fff', padding: '96px 24px' }}>
        <FadeUp>
          <div style={{
            background: '#0D1F6E',
            borderRadius: 20,
            padding: '64px 0',
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            margin: 0,
          }}>
            <ConcentricCircles size={420} color="#ffffff" opacity={0.05}
              style={{ left: -120, top: -120 }} />
            <ConcentricCircles size={380} color="#ffffff" opacity={0.05}
              style={{ right: -100, bottom: -100 }} />

            <div className="px-6 lg:px-14" style={{ maxWidth: 1140, margin: '0 auto' }}>
            <div
              className="grid grid-cols-1 lg:grid-cols-[1fr_420px]"
              style={{
                gap: 48,
                alignItems: 'center',
                position: 'relative',
                zIndex: 1,
              }}>
              <div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center',
                  background: 'rgba(245,200,0,0.15)',
                  border: '1px solid rgba(245,200,0,0.3)',
                  color: '#F5C800',
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
                  textTransform: 'uppercase' as const,
                  borderRadius: 6, padding: '4px 10px',
                  marginBottom: 20,
                }}>
                  {t('bfe.badge')}
                </span>
                <h2 style={{
                  fontSize: 'clamp(26px,3vw,38px)',
                  fontWeight: 800,
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                  margin: 0,
                }}>
                  {t('bfe.title')}
                </h2>
                <p style={{
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: 16,
                  lineHeight: 1.8,
                  marginTop: 16,
                  marginBottom: 0,
                }}>
                  {t('bfe.body')}
                </p>
                <Link
                  href={"/brands-for-employees"}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    color: '#F5C800', fontWeight: 700, fontSize: 15,
                    marginTop: 24,
                    borderBottom: '1px solid rgba(245,200,0,0.4)',
                    textDecoration: 'none',
                    paddingBottom: 2,
                    transition: 'border-color 0.15s, opacity 0.15s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(245,200,0,0.8)'
                    e.currentTarget.style.opacity = '0.85'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(245,200,0,0.4)'
                    e.currentTarget.style.opacity = '1'
                  }}
                >
                  {t('bfe.cta')} <ArrowRight size={14} strokeWidth={2.5} />
                </Link>
              </div>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brands-hero.webp"
                alt="Brands for Employees"
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  borderRadius: 12,
                  display: 'block',
                }}
              />
            </div>

              <div style={{
                marginTop: 48,
                paddingTop: 48,
                borderTop: '1px solid rgba(255,255,255,0.1)',
              }}>
                <p style={{
                  textAlign: 'center',
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: 12, fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase' as const,
                  marginBottom: 32,
                }}>
                  {t('bfe.featuresLabel')}
                </p>

                <motion.div
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
                  initial="hidden" whileInView="show"
                  viewport={{ once: true, margin: '-40px' }}
                  className="grid grid-cols-1 sm:grid-cols-3"
                  style={{ gap: 14 }}
                >
                  {([
                    { Icon: Tag, idx: 0 },
                    { Icon: RefreshCw, idx: 1 },
                    { Icon: Building2, idx: 2 },
                  ] as const).map(({ Icon, idx }) => (
                    <motion.div
                      key={idx}
                      variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.4, 0, 0.2, 1] } } }}
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 12,
                        padding: 24,
                        cursor: 'default',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
                      }}
                      onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                      }}
                    >
                      <Icon size={18} style={{ color: '#F5C800', marginBottom: 12, display: 'block' }} strokeWidth={1.75} />
                      <h4 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>{bfeFeatures[idx]?.title}</h4>
                      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, margin: 0 }}>{bfeFeatures[idx]?.body}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION D — VALUES
      ═══════════════════════════════════════════ */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <FadeUp>
            <div style={{
              background: '#F5F3EE',
              borderRadius: 20,
              padding: '56px 48px',
              display: 'grid',
              gridTemplateColumns: '1fr 260px',
              gap: 56,
              position: 'relative',
              overflow: 'hidden',
            }}
            className="values-block-grid">
              <ConcentricCircles size={480} color="#0D1F6E" opacity={0.06}
                style={{ left: -100, top: '50%', transform: 'translateY(-50%)' }} />

              <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 28, position: 'relative', zIndex: 1 }}>
                {([
                  { Icon: Heart,     titleKey: 'valuesSection.openTitle',        bodyKey: 'valuesSection.openBody' },
                  { Icon: Scale,     titleKey: 'valuesSection.neutralTitle',     bodyKey: 'valuesSection.neutralBody' },
                  { Icon: Lightbulb, titleKey: 'valuesSection.innovativeTitle',  bodyKey: 'valuesSection.innovativeBody' },
                  { Icon: Shield,    titleKey: 'valuesSection.transparentTitle', bodyKey: 'valuesSection.transparentBody' },
                ] as const).map(({ Icon, titleKey, bodyKey }) => (
                  <div key={titleKey}>
                    <Icon size={20} style={{ color: '#0D1F6E', marginBottom: 10, display: 'block' }} strokeWidth={1.75} />
                    <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0A0F1E', marginBottom: 6 }}>{t(titleKey)}</h4>
                    <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.65, margin: 0 }}>{t(bodyKey)}</p>
                  </div>
                ))}
              </div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                <span className="badge badge-navy" style={{ marginBottom: 16 }}>{t('valuesSection.badge')}</span>
                <h2 style={{ fontSize: 'clamp(24px,3vw,32px)', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em', marginTop: 12 }}>
                  {t('valuesSection.tagline')}
                </h2>
                <p style={{ fontSize: 15, color: '#6B7280', lineHeight: 1.75, marginTop: 14 }}>
                  {t('valuesSection.body')}
                </p>
                <div style={{ marginTop: 24 }}>
                  <UnderlineLink href={"/ueber-uns"}>{t('valuesSection.cta')}</UnderlineLink>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION E — STATS
      ═══════════════════════════════════════════ */}
      <section style={{ background: '#0D1F6E', padding: '72px 0', position: 'relative', overflow: 'hidden' }}>
        <ConcentricCircles size={700} color="#ffffff" opacity={0.04}
          style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <FadeUp>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0 }}
              className="stats-grid">
              {[
                { target: 200, suffix: '+', labelKey: 'stats.membersLabel' },
                { target: 15,  suffix: '+', labelKey: 'stats.eventsLabel' },
                { target: 5,   suffix: '',  labelKey: 'stats.cantonsLabel' },
                { target: 3,   suffix: '',  labelKey: 'stats.yearsLabel' },
              ].map((s, i) => (
                <div key={s.labelKey} style={{
                  textAlign: 'center', padding: '0 24px',
                  borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.1)' : undefined,
                }}>
                  <div className="stats-number">
                    <AnimatedNumber target={s.target} suffix={s.suffix} />
                  </div>
                  <div className="stats-label">{t(s.labelKey as Parameters<typeof t>[0])}</div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION G — PRICING
      ═══════════════════════════════════════════ */}
      <section className="section" style={{ background: '#0D1F6E', position: 'relative', overflow: 'hidden' }}>
        <ConcentricCircles size={600} color="#ffffff" opacity={0.03}
          style={{ right: -150, top: '50%', transform: 'translateY(-50%)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <FadeUp>
            <div className="section-heading" style={{ marginBottom: 48 }}>
              <span className="badge badge-dark" style={{ marginBottom: 20 }}>{t('pricing.badge')}</span>
              <h2 style={{ color: '#fff' }}>
                {t('pricing.title')}<br />
                <span className="serif-italic" style={{ color: '#F5C800', fontWeight: 400 }}>{t('pricing.titleItalic')}</span>
              </h2>
            </div>
          </FadeUp>

          <motion.div
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden" whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
            style={{ gap: 20, maxWidth: 900, margin: '0 auto' }}
            className="grid grid-cols-1 sm:grid-cols-3">
            {pricingPlans.map((plan, idx) => (
              <motion.div key={plan.name}
                variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } } }}>
                <div className={`pricing-card${idx === 1 ? ' featured' : ''}`}>
                  {idx === 1 && (
                    <div style={{
                      position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)',
                      background: '#F5C800', borderRadius: '0 0 8px 8px',
                      padding: '3px 14px', fontSize: 10, fontWeight: 700,
                      color: '#0A0F1E', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                    }}>{t('pricing.popular')}</div>
                  )}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{plan.name}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span style={{ fontSize: 32, fontWeight: 800, color: '#0A0F1E', letterSpacing: '-0.03em', lineHeight: 1 }}>{plan.price}</span>
                      {plan.period && <span style={{ fontSize: 13, color: '#6B7280' }}>{plan.period}</span>}
                    </div>
                    <p style={{ fontSize: 13, color: '#6B7280', marginTop: 8, lineHeight: 1.6 }}>{plan.desc}</p>
                  </div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 22 }}>
                    {plan.features.map(f => (
                      <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CheckCircle size={14} style={{ color: '#0D1F6E', flexShrink: 0 }} strokeWidth={2} />
                        <span style={{ fontSize: 13, color: '#374151' }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={"/mitmachen"}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '100%', padding: '10px 0', borderRadius: 8,
                      fontSize: 14, fontWeight: 600, textDecoration: 'none',
                      background: idx === 1 ? '#0D1F6E' : 'transparent',
                      color: idx === 1 ? '#fff' : '#0D1F6E',
                      border: idx === 1 ? 'none' : '1.5px solid #C7D2FE',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      if (idx === 1) { e.currentTarget.style.background = '#1B3A8C' }
                      else { e.currentTarget.style.background = '#EEF2FF'; e.currentTarget.style.borderColor = '#0D1F6E' }
                    }}
                    onMouseLeave={e => {
                      if (idx === 1) { e.currentTarget.style.background = '#0D1F6E' }
                      else { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#C7D2FE' }
                    }}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION H — FAQ
      ═══════════════════════════════════════════ */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <FadeUp>
            <div className="section-heading">
              <span className="badge badge-navy" style={{ marginBottom: 16 }}>FAQ</span>
              <h2>{tFaq('title')}</h2>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            {faqItems.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
          </FadeUp>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION I — NEWSLETTER
      ═══════════════════════════════════════════ */}
      <section className="section-sm" style={{ background: '#F9FAFB' }}>
        <div className="container">
          <FadeUp>
            <div style={{
              background: '#fff', border: '1px solid #E5E7EB', borderRadius: 20,
              padding: 'clamp(40px,5vw,64px) clamp(24px,4vw,56px)',
              maxWidth: 820, margin: '0 auto', textAlign: 'center',
              position: 'relative', overflow: 'hidden',
            }}>
              <ConcentricCircles size={400} color="#0D1F6E" opacity={0.04}
                style={{ right: -100, top: '50%', transform: 'translateY(-50%)' }} />
              <div style={{
                width: 48, height: 48, borderRadius: 10, background: '#EEF2FF',
                border: '1px solid #C7D2FE',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px', color: '#0D1F6E', position: 'relative', zIndex: 1,
              }}>
                <Mail size={20} strokeWidth={1.75} />
              </div>
              <span className="badge badge-navy" style={{ marginBottom: 16, position: 'relative', zIndex: 1 }}>Newsletter</span>
              <h2 style={{ fontSize: 'clamp(22px,3vw,34px)', marginTop: 12, position: 'relative', zIndex: 1 }}>
                {t('newsletter.tagline')}
              </h2>
              <p style={{ color: '#6B7280', marginTop: 10, maxWidth: 380, margin: '10px auto 0', position: 'relative', zIndex: 1 }}>
                {t('newsletter.body2')}
              </p>

              <form onSubmit={handleNewsletter}
                style={{ maxWidth: 640, margin: '28px auto 0', position: 'relative', zIndex: 1 }}
                noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: 10, marginBottom: 10 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <input
                      type="text" value={nlFirstName}
                      onChange={e => setNlFirstName(e.target.value)}
                      placeholder="Vorname"
                      className="form-input"
                      style={{ borderColor: nlErrors.firstName ? '#EF4444' : undefined }}
                      onFocus={e => { e.target.style.borderColor = nlErrors.firstName ? '#EF4444' : '#0D1F6E'; e.target.style.boxShadow = '0 0 0 3px rgba(13,31,110,0.08)' }}
                      onBlur={e => { e.target.style.borderColor = nlErrors.firstName ? '#EF4444' : '#E5E7EB'; e.target.style.boxShadow = 'none' }}
                    />
                    {nlErrors.firstName && <span style={{ fontSize: 12, color: '#EF4444' }}>{nlErrors.firstName}</span>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <input
                      type="text" value={nlLastName}
                      onChange={e => setNlLastName(e.target.value)}
                      placeholder="Nachname"
                      className="form-input"
                      style={{ borderColor: nlErrors.lastName ? '#EF4444' : undefined }}
                      onFocus={e => { e.target.style.borderColor = nlErrors.lastName ? '#EF4444' : '#0D1F6E'; e.target.style.boxShadow = '0 0 0 3px rgba(13,31,110,0.08)' }}
                      onBlur={e => { e.target.style.borderColor = nlErrors.lastName ? '#EF4444' : '#E5E7EB'; e.target.style.boxShadow = 'none' }}
                    />
                    {nlErrors.lastName && <span style={{ fontSize: 12, color: '#EF4444' }}>{nlErrors.lastName}</span>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <input
                      type="email" value={nlEmail}
                      onChange={e => setNlEmail(e.target.value)}
                      placeholder="deine@email.ch"
                      className="form-input"
                      style={{ borderColor: nlErrors.email ? '#EF4444' : undefined }}
                      onFocus={e => { e.target.style.borderColor = nlErrors.email ? '#EF4444' : '#0D1F6E'; e.target.style.boxShadow = '0 0 0 3px rgba(13,31,110,0.08)' }}
                      onBlur={e => { e.target.style.borderColor = nlErrors.email ? '#EF4444' : '#E5E7EB'; e.target.style.boxShadow = 'none' }}
                    />
                    {nlErrors.email && <span style={{ fontSize: 12, color: '#EF4444' }}>{nlErrors.email}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
                  <button type="submit" disabled={nlLoading}
                    className="btn btn-primary"
                    style={{ whiteSpace: 'nowrap', opacity: nlLoading ? 0.6 : 1 }}>
                    {nlLoading ? '...' : 'Abonnieren'}
                  </button>
                </div>
              </form>
            </div>
          </FadeUp>
        </div>
      </section>

    </div>
  )
}
