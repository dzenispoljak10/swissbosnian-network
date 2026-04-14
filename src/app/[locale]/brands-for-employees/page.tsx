'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'
import {
  CheckCircle,
  BadgeCheck,
  Banknote,
  Link as LinkIcon,
  Sparkles,
  ShoppingBag,
  RefreshCw,
  Tag,
  ArrowRight,
  Laptop,
  Home,
  Shirt,
  Dumbbell,
  Flower2,
  Plane,
  Smile,
} from 'lucide-react'

const ease = [0.4, 0, 0.2, 1] as const
const COMPANY_ICONS = [Banknote, LinkIcon, BadgeCheck]
const EMPLOYEE_ICONS = [Tag, ShoppingBag, RefreshCw]
const CATEGORY_ICONS = [Laptop, Home, Shirt, Dumbbell, Flower2, Plane, Smile, Sparkles]

function FadeUp({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease }}
      style={style}
    >
      {children}
    </motion.div>
  )
}

export default function BrandsForEmployeesPage() {
  const locale = useLocale()
  const t = useTranslations('bfe')

  const companyBenefits = t.raw('companyBenefits') as Array<{ title: string; body: string }>
  const employeeBenefits = t.raw('employeeBenefits') as Array<{ title: string; body: string }>
  const categories = t.raw('categories') as string[]
  const steps = t.raw('steps') as Array<{ num: string; title: string; body: string }>
  const introChecks = t.raw('introChecks') as string[]

  const [form, setForm] = useState({ firstName: '', lastName: '', company: '', employees: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const body = `Firma: ${form.company}\nAnzahl Mitarbeiter: ${form.employees}\n\n${form.message}`
      const res = await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `${form.firstName} ${form.lastName}`, email: form.email, subject: `Brands for Employees — ${form.company}`, message: body }),
      })
      setStatus(res.ok ? 'success' : 'error')
      if (res.ok) setForm({ firstName: '', lastName: '', company: '', employees: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div>
      {/* ── HERO ── */}
      <section className="hero" style={{ minHeight: 'auto', paddingTop: 'clamp(80px,10vw,140px)', paddingBottom: 'clamp(48px,6vw,80px)' }}>
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 48, alignItems: 'center' }}>
            {/* Left */}
            <div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }} className="badge badge-gold mb-5">
                {t('badge')}
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1, ease }} className="text-white" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
                Brands for Employees.
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={{ fontSize: 18, color: 'rgba(255,255,255,0.72)', marginTop: 16, maxWidth: 560, lineHeight: 1.7 }}>
                {t('heroSubtitle')}
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, ease }} style={{ marginTop: 36, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a href="#anmeldung" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 26px', borderRadius: 8, background: '#C9960A', color: '#0F172A', fontSize: 15, fontWeight: 700, textDecoration: 'none', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(201,150,10,0.35)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
                  {t('heroJoin')} <ArrowRight size={15} />
                </a>
                <Link href={"/mitmachen"} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 26px', borderRadius: 8, border: '1.5px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.08)', color: '#ffffff', fontSize: 15, fontWeight: 600, textDecoration: 'none', transition: 'background 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}>
                  {t('heroMember')}
                </Link>
              </motion.div>
            </div>
            {/* Right — image */}
            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65, delay: 0.2, ease }} className="hidden lg:block">
              <img src="/brands-hero.webp" alt="Brands for Employees" style={{ width: '100%', height: 'auto', borderRadius: 16, boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── INTRO ── */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 64, alignItems: 'center' }}>
            <FadeUp>
              <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.1)' }}>
                <Image src="/brands-hero.webp" alt="Brands for Employees" width={700} height={460} style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
            </FadeUp>
            <FadeUp delay={0.12}>
              <span className="badge badge-navy" style={{ textTransform: 'uppercase', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em' }}>{t('introBadge')}</span>
              <h2 style={{ letterSpacing: '-0.025em', marginTop: 20, marginBottom: 16 }}>{t('introTitle')}</h2>
              <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.85, marginBottom: 20 }}>{t('introBody1')}</p>
              <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.85, marginBottom: 28 }}>{t('introBody2')}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {introChecks.map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CheckCircle size={16} style={{ color: '#1B3A8C', flexShrink: 0 }} />
                    <span style={{ fontSize: 14, color: '#334155' }}>{item}</span>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── COMPANY BENEFITS ── */}
      <section className="section" style={{ background: '#F8FAFC' }}>
        <div className="container">
          <FadeUp style={{ textAlign: 'center', marginBottom: 52 }}>
            <span className="badge badge-navy" style={{ textTransform: 'uppercase', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', display: 'inline-block', marginBottom: 16 }}>{t('companyBadge')}</span>
            <h2 style={{ letterSpacing: '-0.025em' }}>{t('companyTitle')}</h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 24 }}>
            {companyBenefits.map((b, i) => {
              const Icon = COMPANY_ICONS[i]
              return (
                <FadeUp key={b.title} delay={i * 0.1}>
                  <div style={{ background: '#ffffff', border: '1px solid #E2E8F0', borderTop: '3px solid #1B3A8C', borderRadius: 14, padding: '32px 28px', height: '100%', transition: 'transform 0.3s, box-shadow 0.3s' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 24px 56px rgba(27,58,140,0.1)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                      <Icon size={22} style={{ color: '#1B3A8C' }} />
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 10 }}>{b.title}</h3>
                    <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.8 }}>{b.body}</p>
                  </div>
                </FadeUp>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── EMPLOYEE BENEFITS ── */}
      <section className="section" style={{ background: '#0F172A' }}>
        <div className="container">
          <FadeUp style={{ textAlign: 'center', marginBottom: 52 }}>
            <span className="badge badge-gold" style={{ textTransform: 'uppercase', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', display: 'inline-block', marginBottom: 16 }}>{t('employeeBadge')}</span>
            <h2 className="text-white" style={{ letterSpacing: '-0.025em' }}>{t('employeeTitle')}</h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 24 }}>
            {employeeBenefits.map((b, i) => {
              const Icon = EMPLOYEE_ICONS[i]
              return (
                <FadeUp key={b.title} delay={i * 0.1}>
                  <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderTop: '3px solid #F5C800', borderRadius: 14, padding: '32px 28px', height: '100%', transition: 'background 0.25s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(245,200,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                      <Icon size={22} style={{ color: '#F5C800' }} />
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 600, color: '#ffffff', marginBottom: 10 }}>{b.title}</h3>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.8 }}>{b.body}</p>
                  </div>
                </FadeUp>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── KATEGORIEN ── */}
      <section className="section bg-white">
        <div className="container">
          <FadeUp style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="badge badge-gold" style={{ textTransform: 'uppercase', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', display: 'inline-block', marginBottom: 16 }}>{t('sortimentBadge')}</span>
            <h2 style={{ letterSpacing: '-0.025em' }}>{t('sortimentTitle')}</h2>
            <p style={{ fontSize: 16, color: '#64748B', maxWidth: 500, margin: '14px auto 0', lineHeight: 1.75 }}>{t('sortimentSubtitle')}</p>
          </FadeUp>
          <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: 16 }}>
            {categories.map((label, i) => {
              const Icon = CATEGORY_ICONS[i]
              return (
                <FadeUp key={label} delay={i * 0.06}>
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 14, padding: '28px 20px', textAlign: 'center', transition: 'transform 0.25s, box-shadow 0.25s, border-color 0.2s, background 0.2s', cursor: 'default' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(27,58,140,0.1)'; e.currentTarget.style.borderColor = '#1B3A8C'; e.currentTarget.style.background = '#EEF2FF' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = '#F8FAFC' }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                      <Icon size={24} style={{ color: '#1B3A8C' }} />
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{label}</p>
                  </div>
                </FadeUp>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── STEPS ── */}
      <section className="section" style={{ background: '#F8FAFC' }}>
        <div className="container">
          <FadeUp style={{ textAlign: 'center', marginBottom: 52 }}>
            <span className="badge badge-navy" style={{ textTransform: 'uppercase', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', display: 'inline-block', marginBottom: 16 }}>{t('stepsBadge')}</span>
            <h2 style={{ letterSpacing: '-0.025em' }}>{t('stepsTitle')}</h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 24 }}>
            {steps.map((step, i) => (
              <FadeUp key={step.num} delay={i * 0.1}>
                <div style={{ background: '#ffffff', border: '1px solid #E2E8F0', borderRadius: 14, padding: '36px 28px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ fontSize: 56, fontWeight: 800, color: 'rgba(27,58,140,0.06)', position: 'absolute', top: 16, right: 20, lineHeight: 1 }}>{step.num}</div>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: '#1B3A8C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#ffffff', marginBottom: 20 }}>{step.num}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', marginBottom: 10 }}>{step.title}</h3>
                  <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.8 }}>{step.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORM ── */}
      <section id="anmeldung" className="section bg-white">
        <div className="container" style={{ maxWidth: 760 }}>
          <FadeUp style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="badge badge-gold" style={{ textTransform: 'uppercase', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', display: 'inline-block', marginBottom: 16 }}>{t('formBadge')}</span>
            <h2 style={{ letterSpacing: '-0.025em' }}>{t('formTitle')}</h2>
            <p style={{ fontSize: 16, color: '#64748B', maxWidth: 480, margin: '14px auto 0', lineHeight: 1.75 }}>{t('formSubtitle')}</p>
          </FadeUp>
          {status === 'success' ? (
            <FadeUp>
              <div style={{ textAlign: 'center', padding: '56px 32px', background: '#F8FAFC', borderRadius: 16, border: '1px solid #E2E8F0' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <CheckCircle size={32} style={{ color: '#22c55e' }} />
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>{t('formSuccessTitle')}</h3>
                <p style={{ fontSize: 15, color: '#64748B' }}>{t('formSuccessBody')}</p>
              </div>
            </FadeUp>
          ) : (
            <FadeUp>
              <form onSubmit={handleSubmit} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 16, padding: '40px 36px' }}>
                <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 16, marginBottom: 16 }}>
                  <div>
                    <label className="form-label">{t('formFirstName')} *</label>
                    <input type="text" required className="form-input" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
                  </div>
                  <div>
                    <label className="form-label">{t('formLastName')} *</label>
                    <input type="text" required className="form-input" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 16, marginBottom: 16 }}>
                  <div>
                    <label className="form-label">{t('formCompany')} *</label>
                    <input type="text" required className="form-input" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
                  </div>
                  <div>
                    <label className="form-label">{t('formEmployees')} *</label>
                    <input type="number" required min="1" className="form-input" value={form.employees} onChange={e => setForm({ ...form, employees: e.target.value })} />
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label className="form-label">{t('formEmail')} *</label>
                  <input type="email" required className="form-input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label className="form-label">{t('formMessage')}</label>
                  <textarea rows={4} className="form-input" style={{ resize: 'none' }} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder={t('formMessagePlaceholder')} />
                </div>
                {status === 'error' && <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 16 }}>{t('formError')}</p>}
                <button type="submit" disabled={status === 'loading'} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 24px', fontSize: 15, fontWeight: 600, background: '#1B3A8C', color: '#ffffff', border: 'none', borderRadius: 8, cursor: status === 'loading' ? 'not-allowed' : 'pointer', opacity: status === 'loading' ? 0.6 : 1, transition: 'background 0.2s', fontFamily: 'inherit' }}
                  onMouseEnter={e => { if (status !== 'loading') e.currentTarget.style.background = '#132C70' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#1B3A8C' }}>
                  {status === 'loading' ? t('formLoading') : t('formSubmit')}
                  {status !== 'loading' && <ArrowRight size={15} />}
                </button>
              </form>
            </FadeUp>
          )}
        </div>
      </section>
    </div>
  )
}
