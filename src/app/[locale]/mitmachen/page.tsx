'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { CheckCircle, ArrowRight, Sparkles, X } from 'lucide-react'
import { ConcentricCircles } from '@/components/ui/ConcentricCircles'

const ease = [0.4, 0, 0.2, 1] as const

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, ease, delay }}>
      {children}
    </motion.div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', borderRadius: 9,
  border: '1.5px solid #E5E7EB', background: '#F9FAFB',
  fontSize: 14, color: '#0A0F1E', fontFamily: 'inherit',
  outline: 'none', transition: 'border-color 0.15s, background 0.15s', boxSizing: 'border-box',
}

function MemberForm({ onClose }: { onClose: () => void }) {
  const t = useTranslations('join.memberForm')
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', company: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/public/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, memberType: 'MITGLIED' }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <CheckCircle size={48} style={{ color: '#22C55E', margin: '0 auto 16px', display: 'block' }} strokeWidth={1.5} />
        <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0A0F1E', marginBottom: 8 }}>{t('success')}</h3>
        <button onClick={onClose} style={{ marginTop: 16, fontSize: 14, fontWeight: 600, color: '#0D1F6E', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
          Schliessen
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0A0F1E' }}>{t('title')}</h3>
        <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 4 }}>
          <X size={18} strokeWidth={2} />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 12 }}>
        {[{ key: 'firstName', label: t('firstName'), required: true }, { key: 'lastName', label: t('lastName'), required: true }].map(({ key, label, required }) => (
          <div key={key}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label} {required && '*'}</label>
            <input type="text" required={required} value={form[key as keyof typeof form]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={inputStyle}
              onFocus={e => { e.target.style.borderColor = '#0D1F6E'; e.target.style.background = '#fff' }}
              onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#F9FAFB' }} />
          </div>
        ))}
      </div>
      {[{ key: 'email', label: t('email'), type: 'email', required: true }, { key: 'phone', label: t('phone'), type: 'tel', required: false }, { key: 'company', label: t('company'), type: 'text', required: false }].map(({ key, label, type, required }) => (
        <div key={key}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label} {required && '*'}</label>
          <input type={type} required={required} value={form[key as keyof typeof form]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={inputStyle}
            onFocus={e => { e.target.style.borderColor = '#0D1F6E'; e.target.style.background = '#fff' }}
            onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#F9FAFB' }} />
        </div>
      ))}
      {status === 'error' && <p style={{ fontSize: 13, color: '#DC2626', background: '#FEF2F2', borderRadius: 8, padding: '10px 14px' }}>{t('error')}</p>}
      <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
        <button type="button" onClick={onClose}
          style={{ flex: 1, height: 44, borderRadius: 9, border: '1.5px solid #E5E7EB', background: 'transparent', fontSize: 14, fontWeight: 600, color: '#374151', cursor: 'pointer', fontFamily: 'inherit', transition: 'border-color 0.15s' }}>
          Abbrechen
        </button>
        <button type="submit" disabled={status === 'loading'}
          style={{ flex: 1, height: 44, borderRadius: 9, border: 'none', background: '#0D1F6E', fontSize: 14, fontWeight: 600, color: '#ffffff', cursor: status === 'loading' ? 'not-allowed' : 'pointer', opacity: status === 'loading' ? 0.7 : 1, fontFamily: 'inherit', transition: 'opacity 0.15s' }}>
          {status === 'loading' ? '...' : t('submit')}
        </button>
      </div>
    </form>
  )
}

export default function MitmachenPage() {
  const t = useTranslations('join')
  const locale = useLocale()
  const [showMemberForm, setShowMemberForm] = useState(false)
  const [stripeLoading, setStripeLoading] = useState<string | null>(null)

  const memberFeatures = t.raw('member.features') as string[]
  const goennerFeatures = t.raw('goenner.features') as string[]
  const partnerFeatures = t.raw('partner.features') as string[]

  async function handleStripeCheckout(memberType: 'GOENNER' | 'PARTNER') {
    setStripeLoading(memberType)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberType }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert(data.error || 'Stripe nicht konfiguriert.')
    } catch {
      alert('Fehler beim Verbinden mit Stripe.')
    } finally {
      setStripeLoading(null)
    }
  }

  const plans = [
    {
      key: 'member',
      title: t('member.title'),
      price: t('member.price'),
      features: memberFeatures,
      cta: t('member.cta'),
      highlighted: false,
      badge: null,
      onCta: () => setShowMemberForm(true),
      loading: false,
    },
    {
      key: 'goenner',
      title: t('goenner.title'),
      price: t('goenner.price'),
      features: goennerFeatures,
      cta: t('goenner.cta'),
      highlighted: true,
      badge: 'Beliebteste Wahl',
      onCta: () => handleStripeCheckout('GOENNER'),
      loading: stripeLoading === 'GOENNER',
    },
    {
      key: 'partner',
      title: t('partner.title'),
      price: t('partner.price'),
      features: partnerFeatures,
      cta: t('partner.cta'),
      highlighted: false,
      badge: null,
      onCta: () => handleStripeCheckout('PARTNER'),
      loading: stripeLoading === 'PARTNER',
    },
  ]

  return (
    <div>
      {/* Hero */}
      <section style={{ background: '#0D1F6E', paddingTop: 'clamp(72px,10vw,128px)', paddingBottom: 'clamp(48px,6vw,80px)', position: 'relative', overflow: 'hidden' }}>
        <ConcentricCircles size={600} color="#fff" opacity={0.05} style={{ right: -160, top: -160 }} />
        <ConcentricCircles size={320} color="#fff" opacity={0.04} style={{ left: -60, bottom: -80 }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}
            style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(245,200,0,0.15)', border: '1px solid rgba(245,200,0,0.3)', color: '#F5C800', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: 6, padding: '4px 12px', marginBottom: 24 }}>
            Mitgliedschaft
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08, ease }}
            style={{ fontSize: 'clamp(32px,5vw,58px)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 auto 20px', maxWidth: 620 }}>
            {t('title')}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25, duration: 0.5 }}
            style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', maxWidth: 480, lineHeight: 1.75, margin: '0 auto' }}>
            {t('subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Pricing */}
      <section className="section" style={{ background: '#F0EEE9' }}>
        <div className="container" style={{ maxWidth: 1020 }}>
          <motion.div
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
            initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
            style={{ gap: 20, alignItems: 'start' }}
            className="grid grid-cols-1 md:grid-cols-3">
            {plans.map(plan => (
              <motion.div key={plan.key}
                variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } } }}
                style={{
                  background: plan.highlighted ? '#0D1F6E' : '#ffffff',
                  borderRadius: 20,
                  padding: '36px 32px',
                  position: 'relative',
                  overflow: 'hidden',
                  border: plan.highlighted ? '2px solid #F5C800' : '1px solid rgba(0,0,0,0.05)',
                  display: 'flex', flexDirection: 'column',
                  transform: plan.highlighted ? 'scale(1.03)' : 'none',
                  boxShadow: plan.highlighted ? '0 32px 64px rgba(13,31,110,0.25)' : 'none',
                  zIndex: plan.highlighted ? 2 : 1,
                }}>
                {plan.highlighted && <ConcentricCircles size={300} color="#fff" opacity={0.06} style={{ right: -60, bottom: -60 }} />}
                {plan.badge && (
                  <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', display: 'inline-flex', alignItems: 'center', gap: 5, background: '#F5C800', color: '#0D1F6E', borderRadius: 999, padding: '4px 14px', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', zIndex: 3 }}>
                    <Sparkles size={12} strokeWidth={2} />
                    {plan.badge}
                  </div>
                )}
                <h3 style={{ fontSize: 22, fontWeight: 700, color: plan.highlighted ? '#ffffff' : '#0A0F1E', marginBottom: 8, position: 'relative', zIndex: 1 }}>{plan.title}</h3>
                <div style={{ fontSize: 28, fontWeight: 900, color: plan.highlighted ? '#F5C800' : '#0D1F6E', letterSpacing: '-0.03em', marginBottom: 24, position: 'relative', zIndex: 1 }}>
                  {plan.price}
                </div>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 28, flex: 1, position: 'relative', zIndex: 1 }}>
                  {plan.features.map((f, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <CheckCircle size={15} style={{ color: plan.highlighted ? 'rgba(245,200,0,0.8)' : '#0D1F6E', flexShrink: 0, marginTop: 1 }} strokeWidth={2} />
                      <span style={{ fontSize: 13, color: plan.highlighted ? 'rgba(255,255,255,0.85)' : '#374151', lineHeight: 1.5 }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={plan.onCta} disabled={plan.loading}
                  style={{ width: '100%', height: 44, borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: plan.loading ? 'not-allowed' : 'pointer', opacity: plan.loading ? 0.7 : 1, fontFamily: 'inherit', transition: 'all 0.2s', position: 'relative', zIndex: 1, border: plan.highlighted ? '1.5px solid rgba(255,255,255,0.25)' : '1.5px solid #0D1F6E', background: plan.highlighted ? 'rgba(255,255,255,0.1)' : '#0D1F6E', color: '#ffffff' }}
                  onMouseEnter={e => { if (!plan.loading) { e.currentTarget.style.background = plan.highlighted ? 'rgba(255,255,255,0.2)' : '#1B3A8C'; e.currentTarget.style.transform = 'translateY(-1px)' } }}
                  onMouseLeave={e => { e.currentTarget.style.background = plan.highlighted ? 'rgba(255,255,255,0.1)' : '#0D1F6E'; e.currentTarget.style.transform = 'translateY(0)' }}>
                  {plan.loading ? '...' : plan.cta}
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ teaser */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <FadeUp>
            <div className="faq-teaser-card" style={{ background: '#F0EEE9', borderRadius: 20, padding: '48px 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Noch Fragen?</div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: '#0A0F1E', marginBottom: 8 }}>Alle Antworten in unserem FAQ</h3>
                <p style={{ fontSize: 14, color: '#6B7280', maxWidth: 400, lineHeight: 1.7 }}>
                  Wer steckt hinter dem Netzwerk, wie läuft eine Gönnerschaft ab und was bekomme ich als Partner?
                </p>
              </div>
              <Link href={"/faq"}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 44, padding: '0 24px', background: '#0D1F6E', color: '#ffffff', borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: 'none', whiteSpace: 'nowrap', transition: 'opacity 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                Zu den FAQs <ArrowRight size={14} strokeWidth={2.5} />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {showMemberForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(10,15,30,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={e => { if (e.target === e.currentTarget) setShowMemberForm(false) }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease }}
              style={{ background: '#ffffff', borderRadius: 20, padding: '36px', maxWidth: 480, width: '100%', boxShadow: '0 32px 80px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
              <MemberForm onClose={() => setShowMemberForm(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
