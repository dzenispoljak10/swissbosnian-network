'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { CheckCircle, XCircle, Shield, ArrowRight, Check, Loader2, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { ConcentricCircles } from '@/components/ui/ConcentricCircles'

const ease = [0.4, 0, 0.2, 1] as const

export default function MitmachenPage() {
  const t = useTranslations('mitmachen')
  const locale = useLocale()
  const searchParams = useSearchParams()
  const success = searchParams.get('success')

  const [isMobile, setIsMobile] = useState(false)
  const [modal, setModal] = useState<'GOENNER' | 'PARTNER' | null>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [firstNameError, setFirstNameError] = useState(false)
  const [lastNameError, setLastNameError] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [gatewayError, setGatewayError] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  function openModal(type: 'GOENNER' | 'PARTNER') {
    setFirstName(''); setLastName(''); setEmail('')
    setFirstNameError(false); setLastNameError(false); setEmailError(false)
    setGatewayError(false); setLoading(false)
    setModal(type)
  }

  function closeModal() { setModal(null) }

  async function handleCheckout() {
    let hasError = false
    if (!firstName.trim()) { setFirstNameError(true); hasError = true }
    if (!lastName.trim()) { setLastNameError(true); hasError = true }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError(true); hasError = true }
    if (hasError) return

    setLoading(true)
    setGatewayError(false)
    try {
      const res = await fetch('/api/payrexx/create-gateway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberType: modal, email, firstName, lastName }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setGatewayError(true)
        setLoading(false)
      }
    } catch {
      setGatewayError(true)
      setLoading(false)
    }
  }

  const freeFeatures = t.raw('plans.free.features') as string[]
  const goennerFeatures = t.raw('plans.goenner.features') as string[]
  const partnerFeatures = t.raw('plans.partner.features') as string[]

  // ── Success / Error return from Payrexx ───────────────────────
  if (success === 'true') {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
        <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 16, padding: 'clamp(32px,5vw,48px) clamp(24px,4vw,48px)', textAlign: 'center', maxWidth: 560, width: '100%' }}>
          <CheckCircle size={56} color="#16a34a" style={{ margin: '0 auto 20px', display: 'block' }} />
          <h2 style={{ fontSize: 'clamp(22px,4vw,28px)', fontWeight: 800, color: '#15803d', marginBottom: 12 }}>
            {t('success.title')}
          </h2>
          <p style={{ color: '#166534', fontSize: 16, lineHeight: 1.7, marginBottom: 28 }}>
            {t('success.subtitle')}
          </p>
          <Link href={'/'} style={{ background: '#0D1F6E', color: 'white', padding: '12px 28px', borderRadius: 8, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 15 }}>
            {t('success.cta')} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    )
  }

  if (success === 'false') {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
        <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 16, padding: 'clamp(32px,5vw,48px) clamp(24px,4vw,48px)', textAlign: 'center', maxWidth: 560, width: '100%' }}>
          <XCircle size={56} color="#DC2626" style={{ margin: '0 auto 20px', display: 'block' }} />
          <h2 style={{ fontSize: 'clamp(22px,4vw,28px)', fontWeight: 800, color: '#DC2626', marginBottom: 12 }}>
            {t('error.title')}
          </h2>
          <p style={{ color: '#991B1B', fontSize: 16, lineHeight: 1.7, marginBottom: 28 }}>
            {t('error.subtitle')}
          </p>
          <button onClick={() => window.location.href = `/${locale}/mitmachen`}
            style={{ background: '#DC2626', color: 'white', padding: '12px 28px', borderRadius: 8, fontWeight: 600, border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 15 }}>
            {t('error.cta')} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    )
  }

  // ── Main page ─────────────────────────────────────────────────
  return (
    <div>
      {/* Hero */}
      <section style={{ background: '#0D1F6E', paddingTop: 'clamp(72px,10vw,128px)', paddingBottom: 'clamp(48px,6vw,80px)', position: 'relative', overflow: 'hidden' }}>
        <ConcentricCircles size={600} color="#fff" opacity={0.05} style={{ right: -160, top: -160 }} />
        <ConcentricCircles size={320} color="#fff" opacity={0.04} style={{ left: -60, bottom: -80 }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}
            style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(245,200,0,0.15)', border: '1px solid rgba(245,200,0,0.3)', color: '#F5C800', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: 6, padding: '4px 12px', marginBottom: 24 }}>
            {t('hero.badge')}
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08, ease }}
            style={{ fontSize: 'clamp(32px,5vw,58px)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 auto 20px', maxWidth: 620 }}>
            {t('hero.title')}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25, duration: 0.5 }}
            style={{ fontSize: 18, color: 'rgba(255,255,255,0.65)', maxWidth: 500, lineHeight: 1.75, margin: '0 auto' }}>
            {t('hero.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Pricing */}
      <section className="section" style={{ background: '#F0EEE9' }}>
        <div className="container" style={{ maxWidth: 1060 }}>
          <motion.div
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
            initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 md:grid-cols-3"
            style={{ gap: 20, alignItems: 'stretch' }}>

            {/* Free */}
            <motion.div variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } } }}>
              <div style={{ background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: 16, padding: '36px 32px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>{t('plans.free.name')}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
                  <span style={{ fontSize: 36, fontWeight: 800, color: '#0D1F6E', letterSpacing: '-0.03em', lineHeight: 1 }}>{t('plans.free.price')}</span>
                </div>
                <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.6, marginBottom: 24 }}>{t('plans.free.description')}</p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28, flex: 1 }}>
                  {freeFeatures.map((f, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <Check size={16} style={{ color: '#0D1F6E', flexShrink: 0, marginTop: 1 }} strokeWidth={2.5} />
                      <span style={{ fontSize: 14, color: '#374151', lineHeight: 1.5 }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => {/* free join via newsletter */ window.location.href = `/${locale}#newsletter`}}
                  style={{ width: '100%', height: 48, borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', background: '#F9FAFB', color: '#0D1F6E', border: '1.5px solid #E5E7EB', transition: 'all 0.18s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#EEF2FF'; e.currentTarget.style.borderColor = '#0D1F6E' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.borderColor = '#E5E7EB' }}>
                  {t('plans.free.cta')}
                </button>
              </div>
            </motion.div>

            {/* Gönner */}
            <motion.div variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } } }}>
              <div style={{ background: '#0D1F6E', border: '2px solid rgba(255,255,255,0.15)', borderRadius: 16, padding: '36px 32px', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                <ConcentricCircles size={280} color="#fff" opacity={0.05} style={{ right: -60, bottom: -60 }} />
                <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(245,200,0,0.8)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12, position: 'relative', zIndex: 1 }}>{t('plans.goenner.name')}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8, position: 'relative', zIndex: 1 }}>
                  <span style={{ fontSize: 36, fontWeight: 800, color: '#F5C800', letterSpacing: '-0.03em', lineHeight: 1 }}>{t('plans.goenner.price')}</span>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>{t('plans.goenner.period')}</span>
                </div>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, marginBottom: 24, position: 'relative', zIndex: 1 }}>{t('plans.goenner.description')}</p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28, flex: 1, position: 'relative', zIndex: 1 }}>
                  {goennerFeatures.map((f, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <Check size={16} style={{ color: 'rgba(245,200,0,0.8)', flexShrink: 0, marginTop: 1 }} strokeWidth={2.5} />
                      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => openModal('GOENNER')}
                  style={{ width: '100%', height: 48, borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', background: '#F5C800', color: '#0D1F6E', border: 'none', transition: 'all 0.18s', position: 'relative', zIndex: 1 }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}>
                  {t('plans.goenner.cta')}
                </button>
              </div>
            </motion.div>

            {/* Partner */}
            <motion.div variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } } }}>
              <div style={{ background: '#ffffff', border: '2px solid #F5C800', borderRadius: 16, padding: '36px 32px', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '0 0 0 4px rgba(245,200,0,0.1)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 20, right: 20, background: '#F5C800', color: '#0D1F6E', fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: 999, padding: '3px 10px' }}>BELIEBT</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>{t('plans.partner.name')}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
                  <span style={{ fontSize: 36, fontWeight: 800, color: '#0D1F6E', letterSpacing: '-0.03em', lineHeight: 1 }}>{t('plans.partner.price')}</span>
                  <span style={{ fontSize: 14, color: '#9CA3AF' }}>{t('plans.partner.period')}</span>
                </div>
                <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.6, marginBottom: 24 }}>{t('plans.partner.description')}</p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28, flex: 1 }}>
                  {partnerFeatures.map((f, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <Check size={16} style={{ color: '#0D1F6E', flexShrink: 0, marginTop: 1 }} strokeWidth={2.5} />
                      <span style={{ fontSize: 14, color: '#374151', lineHeight: 1.5 }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => openModal('PARTNER')}
                  style={{ width: '100%', height: 48, borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', background: '#0D1F6E', color: '#ffffff', border: 'none', transition: 'all 0.18s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#1B3A8C'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#0D1F6E'; e.currentTarget.style.transform = 'translateY(0)' }}>
                  {t('plans.partner.cta')}
                </button>
              </div>
            </motion.div>
          </motion.div>

          {/* Security badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 32, color: '#9CA3AF', fontSize: 13 }}>
            <Shield size={16} />
            <span>{t('form.securePayment')}</span>
          </div>
        </div>
      </section>

      {/* FAQ teaser */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div style={{ background: '#F0EEE9', borderRadius: 20, padding: 'clamp(32px,4vw,48px) clamp(24px,4vw,56px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Noch Fragen?</div>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: '#0A0F1E', marginBottom: 8 }}>Alle Antworten in unserem FAQ</h3>
              <p style={{ fontSize: 14, color: '#6B7280', maxWidth: 400, lineHeight: 1.7 }}>Wer steckt hinter dem Netzwerk, wie läuft eine Gönnerschaft ab und was bekomme ich als Partner?</p>
            </div>
            <Link href={'/faq'}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 44, padding: '0 24px', background: '#0D1F6E', color: '#ffffff', borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: 'none', whiteSpace: 'nowrap', transition: 'opacity 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              Zu den FAQs <ArrowRight size={14} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* Checkout Modal */}
      {modal && (
        <div
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}
          style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(10,15,30,0.65)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: isMobile ? 'flex-end' : 'center', justifyContent: 'center' }}>
          <div style={{
            background: '#ffffff',
            borderRadius: isMobile ? '16px 16px 0 0' : 16,
            padding: isMobile ? 24 : 40,
            maxWidth: isMobile ? '100%' : 480,
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 32px 80px rgba(0,0,0,0.2)',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>
                  {modal === 'GOENNER' ? t('plans.goenner.name') : t('plans.partner.name')}
                  {' — '}
                  {modal === 'GOENNER' ? `${t('plans.goenner.price')} ${t('plans.goenner.period')}` : `${t('plans.partner.price')} ${t('plans.partner.period')}`}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0A0F1E', margin: 0 }}>{t('form.title')}</h3>
              </div>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 4, borderRadius: 6, display: 'flex' }}>
                <X size={20} strokeWidth={2} />
              </button>
            </div>

            {/* Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>{t('form.firstName')} *</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={e => { setFirstName(e.target.value); if (e.target.value.trim()) setFirstNameError(false) }}
                  placeholder={t('form.firstNamePlaceholder')}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 9, border: `1.5px solid ${firstNameError ? '#CC1C1C' : '#E5E7EB'}`, background: '#F9FAFB', fontSize: isMobile ? 16 : 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => { e.target.style.borderColor = firstNameError ? '#CC1C1C' : '#0D1F6E'; e.target.style.background = '#fff' }}
                  onBlur={e => { e.target.style.borderColor = firstNameError ? '#CC1C1C' : '#E5E7EB'; e.target.style.background = '#F9FAFB' }}
                />
                {firstNameError && <span style={{ fontSize: 12, color: '#CC1C1C', marginTop: 4, display: 'block' }}>{t('form.required')}</span>}
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>{t('form.lastName')} *</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={e => { setLastName(e.target.value); if (e.target.value.trim()) setLastNameError(false) }}
                  placeholder={t('form.lastNamePlaceholder')}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 9, border: `1.5px solid ${lastNameError ? '#CC1C1C' : '#E5E7EB'}`, background: '#F9FAFB', fontSize: isMobile ? 16 : 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => { e.target.style.borderColor = lastNameError ? '#CC1C1C' : '#0D1F6E'; e.target.style.background = '#fff' }}
                  onBlur={e => { e.target.style.borderColor = lastNameError ? '#CC1C1C' : '#E5E7EB'; e.target.style.background = '#F9FAFB' }}
                />
                {lastNameError && <span style={{ fontSize: 12, color: '#CC1C1C', marginTop: 4, display: 'block' }}>{t('form.required')}</span>}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>{t('form.email')} *</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value)) setEmailError(false) }}
                placeholder={t('form.emailPlaceholder')}
                style={{ width: '100%', padding: '11px 14px', borderRadius: 9, border: `1.5px solid ${emailError ? '#CC1C1C' : '#E5E7EB'}`, background: '#F9FAFB', fontSize: isMobile ? 16 : 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => { e.target.style.borderColor = emailError ? '#CC1C1C' : '#0D1F6E'; e.target.style.background = '#fff' }}
                onBlur={e => { e.target.style.borderColor = emailError ? '#CC1C1C' : '#E5E7EB'; e.target.style.background = '#F9FAFB' }}
              />
              {emailError && <span style={{ fontSize: 12, color: '#CC1C1C', marginTop: 4, display: 'block' }}>{t('form.invalidEmail')}</span>}
            </div>

            {gatewayError && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#DC2626', marginBottom: 16 }}>
                Fehler beim Erstellen des Checkouts. Bitte versuche es erneut.
              </div>
            )}

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={closeModal}
                style={{ flex: 1, minHeight: isMobile ? 52 : 44, borderRadius: 9, border: '1.5px solid #E5E7EB', background: 'transparent', fontSize: isMobile ? 16 : 14, fontWeight: 600, color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}>
                {t('form.cancel')}
              </button>
              <button onClick={handleCheckout} disabled={loading}
                style={{ flex: 2, minHeight: isMobile ? 52 : 44, borderRadius: 9, border: 'none', background: '#0D1F6E', fontSize: isMobile ? 16 : 14, fontWeight: 700, color: '#ffffff', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> {t('form.processing')}</> : <>{modal === 'GOENNER' ? t('plans.goenner.cta') : t('plans.partner.cta')} <ArrowRight size={16} /></>}
              </button>
            </div>

            {/* Security note */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16, color: '#9CA3AF', fontSize: 12 }}>
              <Shield size={13} />
              <span>{t('form.securePayment')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Spinner keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
