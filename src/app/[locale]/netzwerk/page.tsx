'use client'

import { motion, useInView } from 'framer-motion'
import { Link } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useRef } from 'react'
import { Wifi, Coffee, Mic, CheckCircle, ArrowRight, Users, Zap, Globe } from 'lucide-react'
import { ConcentricCircles } from '@/components/ui/ConcentricCircles'

const ease = [0.4, 0, 0.2, 1] as const
const FORMAT_BG = ['#F0EEE9', '#0D1F6E', '#F5C800'] as const
const FORMAT_DARK = [false, true, false]
const FORMAT_ICONS = [Wifi, Coffee, Mic]
const WHY_ICONS = [Users, Globe, Zap, CheckCircle]

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, ease, delay }}>
      {children}
    </motion.div>
  )
}

export default function NetzwerkPage() {
  const locale = useLocale()
  const t = useTranslations('netzwerk')

  const stats = t.raw('stats') as Array<{ value: string; label: string }>
  const formats = t.raw('formats') as Array<{ title: string; subtitle: string; description: string }>
  const memberFeatures = t.raw('memberFeatures') as string[]
  const goennerFeatures = t.raw('goennerFeatures') as string[]
  const whyItems = t.raw('whyItems') as Array<{ title: string; body: string }>

  return (
    <div>
      {/* Hero */}
      <section style={{ background: '#0D1F6E', paddingTop: 'clamp(72px,10vw,128px)', paddingBottom: 'clamp(48px,6vw,80px)', position: 'relative', overflow: 'hidden' }}>
        <ConcentricCircles size={600} color="#fff" opacity={0.05} style={{ right: -160, top: -160 }} />
        <ConcentricCircles size={360} color="#fff" opacity={0.04} style={{ left: -80, bottom: -80 }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}
            style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(245,200,0,0.15)', border: '1px solid rgba(245,200,0,0.3)', color: '#F5C800', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: 6, padding: '4px 12px', marginBottom: 24 }}>
            {t('heroBadge')}
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08, ease }}
            style={{ fontSize: 'clamp(32px,5vw,58px)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em', lineHeight: 1.1, maxWidth: 680, margin: '0 0 20px', whiteSpace: 'pre-line' }}>
            {t('heroTitle')}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25, duration: 0.5 }}
            style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', maxWidth: 520, lineHeight: 1.75, marginBottom: 36 }}>
            {t('heroSubtitle')}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.4 }}
            style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href={"/mitmachen"}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 44, padding: '0 24px', background: '#F5C800', color: '#0D1F6E', borderRadius: 8, fontWeight: 700, fontSize: 15, textDecoration: 'none', transition: 'opacity 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              {t('heroJoin')} <ArrowRight size={15} strokeWidth={2.5} />
            </Link>
            <Link href={"/kontakt"}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 44, padding: '0 24px', background: 'rgba(255,255,255,0.1)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, fontWeight: 600, fontSize: 15, textDecoration: 'none', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}>
              {t('heroLearn')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: '#F0EEE9', padding: '32px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0 }} className="stats-grid">
            {stats.map((s, i) => (
              <div key={s.label} style={{ textAlign: 'center', padding: '20px 16px', borderRight: i < stats.length - 1 ? '1px solid rgba(0,0,0,0.08)' : 'none' }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: '#0D1F6E', letterSpacing: '-0.04em', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formate */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <span style={{ display: 'inline-flex', background: '#EEF2FF', color: '#0D1F6E', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: 6, padding: '4px 12px', marginBottom: 16 }}>
                {t('formatsBadge')}
              </span>
              <h2 style={{ fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 800, color: '#0A0F1E', letterSpacing: '-0.025em', maxWidth: 560, margin: '0 auto' }}>
                {t('formatsTitle')}
              </h2>
            </div>
          </FadeUp>
          <motion.div
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
            initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
            style={{ gap: 20 }}
            className="grid grid-cols-1 md:grid-cols-3">
            {formats.map(({ title, subtitle, description }, idx) => {
              const Icon = FORMAT_ICONS[idx]
              const bg = FORMAT_BG[idx]
              const dark = FORMAT_DARK[idx]
              return (
                <motion.div key={title}
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } } }}
                  style={{ background: bg, borderRadius: 20, padding: '36px 32px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {dark && <ConcentricCircles size={280} color="#fff" opacity={0.06} style={{ right: -60, bottom: -60 }} />}
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: dark ? 'rgba(255,255,255,0.12)' : bg === '#F5C800' ? 'rgba(13,31,110,0.1)' : '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                    <Icon size={20} style={{ color: dark ? '#F5C800' : '#0D1F6E' }} strokeWidth={1.75} />
                  </div>
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <h3 style={{ fontSize: 19, fontWeight: 700, color: dark ? '#ffffff' : '#0A0F1E', marginBottom: 4 }}>{title}</h3>
                    <p style={{ fontSize: 12, fontWeight: 600, color: dark ? '#F5C800' : '#0D1F6E', marginBottom: 12, opacity: dark ? 1 : 0.8 }}>{subtitle}</p>
                    <p style={{ fontSize: 14, color: dark ? 'rgba(255,255,255,0.65)' : bg === '#F5C800' ? 'rgba(13,31,110,0.7)' : '#6B7280', lineHeight: 1.75 }}>{description}</p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Mitgliedschaft */}
      <section id="mitgliedschaft" className="section" style={{ background: '#F0EEE9' }}>
        <div className="container">
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <span style={{ display: 'inline-flex', background: 'rgba(13,31,110,0.08)', color: '#0D1F6E', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: 6, padding: '4px 12px', marginBottom: 16 }}>
                {t('membershipBadge')}
              </span>
              <h2 style={{ fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 800, color: '#0A0F1E', letterSpacing: '-0.025em' }}>
                {t('membershipTitle')}
              </h2>
              <p style={{ fontSize: 16, color: '#6B7280', maxWidth: 480, margin: '12px auto 0', lineHeight: 1.75 }}>
                {t('membershipSubtitle')}
              </p>
            </div>
          </FadeUp>
          <div style={{ gap: 20, maxWidth: 800, margin: '0 auto' }} className="grid grid-cols-1 md:grid-cols-2">
            {/* Free */}
            <FadeUp>
              <div style={{ background: '#ffffff', borderRadius: 20, padding: '36px 32px', border: '1px solid rgba(0,0,0,0.05)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <span style={{ display: 'inline-flex', background: '#EEF2FF', color: '#0D1F6E', fontSize: 12, fontWeight: 700, borderRadius: 6, padding: '4px 10px', marginBottom: 20 }}>
                  {t('memberBadge')}
                </span>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0A0F1E', marginBottom: 8 }}>{t('memberTitle')}</h3>
                <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 20, lineHeight: 1.7 }}>{t('memberDesc')}</p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28, flex: 1 }}>
                  {memberFeatures.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <CheckCircle size={15} style={{ color: '#0D1F6E', flexShrink: 0 }} strokeWidth={2} />
                      <span style={{ fontSize: 14, color: '#374151' }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href={"/mitmachen"}
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, height: 44, borderRadius: 8, border: '1.5px solid #0D1F6E', color: '#0D1F6E', fontWeight: 600, fontSize: 14, textDecoration: 'none', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#0D1F6E'; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#0D1F6E' }}>
                  {t('memberCta')} <ArrowRight size={14} strokeWidth={2.5} />
                </Link>
              </div>
            </FadeUp>
            {/* Gönner */}
            <FadeUp delay={0.1}>
              <div style={{ background: '#0D1F6E', borderRadius: 20, padding: '36px 32px', position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <ConcentricCircles size={280} color="#fff" opacity={0.06} style={{ right: -60, bottom: -60 }} />
                <span style={{ display: 'inline-flex', background: 'rgba(245,200,0,0.15)', border: '1px solid rgba(245,200,0,0.3)', color: '#F5C800', fontSize: 12, fontWeight: 700, borderRadius: 6, padding: '4px 10px', marginBottom: 20, position: 'relative', zIndex: 1 }}>
                  {t('goennerBadge')}
                </span>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', marginBottom: 8, position: 'relative', zIndex: 1 }}>{t('goennerTitle')}</h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', marginBottom: 20, lineHeight: 1.7, position: 'relative', zIndex: 1 }}>{t('goennerDesc')}</p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28, flex: 1, position: 'relative', zIndex: 1 }}>
                  {goennerFeatures.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <CheckCircle size={15} style={{ color: 'rgba(245,200,0,0.7)', flexShrink: 0 }} strokeWidth={2} />
                      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href={"/mitmachen"}
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, height: 44, borderRadius: 8, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#ffffff', fontWeight: 600, fontSize: 14, textDecoration: 'none', transition: 'background 0.2s', position: 'relative', zIndex: 1 }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}>
                  {t('goennerCta')} <ArrowRight size={14} strokeWidth={2.5} />
                </Link>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Warum SBN */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <FadeUp>
            <div style={{ gap: 48, alignItems: 'center' }} className="grid grid-cols-1 md:grid-cols-2">
              <div>
                <span style={{ display: 'inline-flex', background: '#EEF2FF', color: '#0D1F6E', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: 6, padding: '4px 12px', marginBottom: 20 }}>
                  {t('whyBadge')}
                </span>
                <h2 style={{ fontSize: 'clamp(22px,3vw,36px)', fontWeight: 800, color: '#0A0F1E', letterSpacing: '-0.025em', lineHeight: 1.2, marginBottom: 16 }}>
                  {t('whyTitle')}
                </h2>
                <p style={{ fontSize: 16, color: '#6B7280', lineHeight: 1.8, marginBottom: 24 }}>
                  {t('whyBody')}
                </p>
                <Link href={"/ueber-uns"}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#0D1F6E', fontWeight: 700, fontSize: 15, textDecoration: 'none', borderBottom: '2px solid #EEF2FF', paddingBottom: 2, transition: 'border-color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#0D1F6E')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#EEF2FF')}>
                  {t('whyCta')} <ArrowRight size={14} strokeWidth={2.5} />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 16 }}>
                {whyItems.map(({ title, body }, idx) => {
                  const Icon = WHY_ICONS[idx]
                  return (
                    <div key={title} style={{ background: '#F9FAFB', borderRadius: 14, padding: '20px', border: '1px solid rgba(0,0,0,0.05)' }}>
                      <Icon size={18} style={{ color: '#0D1F6E', marginBottom: 10, display: 'block' }} strokeWidth={1.75} />
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0A0F1E', marginBottom: 4 }}>{title}</div>
                      <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6 }}>{body}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#0D1F6E', padding: '80px 24px', position: 'relative', overflow: 'hidden' }}>
        <ConcentricCircles size={500} color="#fff" opacity={0.05} style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }} />
        <div style={{ maxWidth: 580, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <FadeUp>
            <h2 style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.025em', marginBottom: 16 }}>
              {t('ctaTitle')}
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', marginBottom: 32, lineHeight: 1.75 }}>
              {t('ctaSubtitle')}
            </p>
            <Link href={"/mitmachen"}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 48, padding: '0 32px', background: '#F5C800', color: '#0D1F6E', borderRadius: 8, fontWeight: 700, fontSize: 15, textDecoration: 'none', transition: 'opacity 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              {t('ctaButton')} <ArrowRight size={15} strokeWidth={2.5} />
            </Link>
          </FadeUp>
        </div>
      </section>
    </div>
  )
}
