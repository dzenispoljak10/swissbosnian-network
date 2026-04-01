'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Mail, MapPin, ArrowRight, CheckCircle } from 'lucide-react'
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
  width: '100%',
  padding: '12px 16px',
  borderRadius: 10,
  border: '1.5px solid #E5E7EB',
  background: '#F9FAFB',
  fontSize: 14,
  color: '#0A0F1E',
  fontFamily: 'inherit',
  outline: 'none',
  transition: 'border-color 0.15s, background 0.15s',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: '#374151',
  marginBottom: 6,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
}

export default function KontaktPage() {
  const t = useTranslations('contact')
  const locale = useLocale()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'success' : 'error')
      if (res.ok) setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div>
      {/* Hero */}
      <section style={{ background: '#0D1F6E', paddingTop: 'clamp(72px,10vw,128px)', paddingBottom: 'clamp(48px,6vw,80px)', position: 'relative', overflow: 'hidden' }}>
        <ConcentricCircles size={600} color="#fff" opacity={0.05} style={{ right: -160, top: -160 }} />
        <ConcentricCircles size={320} color="#fff" opacity={0.04} style={{ left: -60, bottom: -80 }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}
            style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(245,200,0,0.15)', border: '1px solid rgba(245,200,0,0.3)', color: '#F5C800', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: 6, padding: '4px 12px', marginBottom: 24 }}>
            Kontakt
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08, ease }}
            style={{ fontSize: 'clamp(32px,5vw,58px)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em', lineHeight: 1.1, maxWidth: 600, margin: '0 0 20px' }}>
            {t('title')}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25, duration: 0.5 }}
            style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', maxWidth: 480, lineHeight: 1.75 }}>
            {t('subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div style={{ gap: 56, alignItems: 'flex-start' }} className="grid grid-cols-1 lg:grid-cols-[1fr_2fr]">

            {/* Info */}
            <FadeUp>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0A0F1E', marginBottom: 4 }}>So erreichst du uns</h3>
                {[
                  { Icon: Mail, label: 'E-Mail', value: 'info@swissbosnian-network.ch', href: 'mailto:info@swissbosnian-network.ch' },
                  { Icon: MapPin, label: 'Standort', value: 'Schweiz', href: undefined },
                ].map(({ Icon, label, value, href }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={17} style={{ color: '#0D1F6E' }} strokeWidth={1.75} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
                      {href
                        ? <a href={href} style={{ fontSize: 14, color: '#0A0F1E', fontWeight: 500, textDecoration: 'none', transition: 'color 0.15s' }} onMouseEnter={e => (e.currentTarget.style.color = '#0D1F6E')} onMouseLeave={e => (e.currentTarget.style.color = '#0A0F1E')}>{value}</a>
                        : <span style={{ fontSize: 14, color: '#0A0F1E', fontWeight: 500 }}>{value}</span>
                      }
                    </div>
                  </div>
                ))}

                {/* CTA Card */}
                <div style={{ background: '#0D1F6E', borderRadius: 16, padding: '24px', marginTop: 8, position: 'relative', overflow: 'hidden' }}>
                  <ConcentricCircles size={200} color="#fff" opacity={0.07} style={{ right: -40, bottom: -40 }} />
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', marginBottom: 8, position: 'relative', zIndex: 1 }}>Noch kein Mitglied?</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 16, lineHeight: 1.6, position: 'relative', zIndex: 1 }}>Werde Teil der Community — kostenlos.</div>
                  <Link href={"/mitmachen"}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 700, color: '#F5C800', textDecoration: 'none', position: 'relative', zIndex: 1 }}>
                    Jetzt beitreten <ArrowRight size={13} strokeWidth={2.5} />
                  </Link>
                </div>
              </div>
            </FadeUp>

            {/* Form */}
            <FadeUp delay={0.1}>
              {status === 'success' ? (
                <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 20, padding: '48px', textAlign: 'center' }}>
                  <CheckCircle size={40} style={{ color: '#22C55E', margin: '0 auto 16px', display: 'block' }} strokeWidth={1.5} />
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0A0F1E', marginBottom: 8 }}>{t('success')}</h3>
                  <p style={{ fontSize: 14, color: '#6B7280' }}>Wir melden uns so schnell wie möglich.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 16 }}>
                    <div>
                      <label style={labelStyle}>{t('name')} *</label>
                      <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = '#0D1F6E'; e.target.style.background = '#fff' }}
                        onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#F9FAFB' }} />
                    </div>
                    <div>
                      <label style={labelStyle}>{t('email')} *</label>
                      <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = '#0D1F6E'; e.target.style.background = '#fff' }}
                        onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#F9FAFB' }} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>{t('subject')}</label>
                    <input type="text" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = '#0D1F6E'; e.target.style.background = '#fff' }}
                      onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#F9FAFB' }} />
                  </div>
                  <div>
                    <label style={labelStyle}>{t('message')} *</label>
                    <textarea required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={6}
                      style={{ ...inputStyle, resize: 'vertical', minHeight: 140 }}
                      onFocus={e => { e.target.style.borderColor = '#0D1F6E'; e.target.style.background = '#fff' }}
                      onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#F9FAFB' }} />
                  </div>
                  {status === 'error' && (
                    <p style={{ fontSize: 13, color: '#DC2626', background: '#FEF2F2', borderRadius: 8, padding: '10px 14px' }}>{t('error')}</p>
                  )}
                  <button type="submit" disabled={status === 'loading'}
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 48, padding: '0 32px', background: '#0D1F6E', color: '#ffffff', borderRadius: 10, fontWeight: 600, fontSize: 15, border: 'none', cursor: status === 'loading' ? 'not-allowed' : 'pointer', opacity: status === 'loading' ? 0.7 : 1, fontFamily: 'inherit', transition: 'opacity 0.15s, transform 0.15s', alignSelf: 'flex-start' }}
                    onMouseEnter={e => { if (status !== 'loading') { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)' } }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = status === 'loading' ? '0.7' : '1'; e.currentTarget.style.transform = 'translateY(0)' }}>
                    {status === 'loading' ? 'Senden...' : t('send')} {status !== 'loading' && <ArrowRight size={15} strokeWidth={2.5} />}
                  </button>
                </form>
              )}
            </FadeUp>
          </div>
        </div>
      </section>
    </div>
  )
}
