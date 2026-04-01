'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { CheckCircle, Mail } from 'lucide-react'

export default function NewsletterPage() {
  const t = useTranslations('newsletter')
  const [form, setForm] = useState({ email: '', firstName: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/public/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div>
      {/* Hero */}
      <section style={{ background: '#F9FAFB', paddingTop: 'clamp(72px,10vw,128px)', paddingBottom: 'clamp(40px,6vw,72px)', borderBottom: '1px solid #E5E7EB' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(13,31,110,0.08)', border: '1px solid rgba(13,31,110,0.15)', color: '#0D1F6E', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, borderRadius: 6, padding: '4px 12px', marginBottom: 24 }}>
            Newsletter
          </div>
          <h1 style={{ fontSize: 'clamp(32px,5vw,54px)', fontWeight: 800, color: '#0D1F6E', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 auto 16px', maxWidth: 560 }}>
            {t('title')}
          </h1>
          <p style={{ fontSize: 17, color: '#6B7280', maxWidth: 440, lineHeight: 1.75, margin: '0 auto' }}>
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="section" style={{ background: '#ffffff' }}>
        <div className="container" style={{ maxWidth: 520 }}>
          <div className="form-card-padded" style={{
            background: '#F9FAFB',
            border: '1px solid #E5E7EB',
            borderRadius: 16,
            padding: '48px 40px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 12, background: '#EEF2FF',
              border: '1px solid #C7D2FE',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 24, color: '#0D1F6E',
            }}>
              <Mail size={22} strokeWidth={1.75} />
            </div>

            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <CheckCircle size={48} strokeWidth={1.5} style={{ color: '#22c55e', margin: '0 auto 16px', display: 'block' }} />
                <p style={{ fontSize: 18, fontWeight: 600, color: '#0A0F1E', marginBottom: 8 }}>{t('success')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                    {t('firstName')}
                  </label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="form-input"
                    style={{ width: '100%' }}
                    onFocus={e => { e.target.style.borderColor = '#0D1F6E'; e.target.style.boxShadow = '0 0 0 3px rgba(13,31,110,0.08)' }}
                    onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                    {t('email')} *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="form-input"
                    style={{ width: '100%' }}
                    onFocus={e => { e.target.style.borderColor = '#0D1F6E'; e.target.style.boxShadow = '0 0 0 3px rgba(13,31,110,0.08)' }}
                    onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none' }}
                  />
                </div>
                {status === 'error' && (
                  <p style={{ fontSize: 13, color: '#dc2626', margin: 0 }}>{t('error')}</p>
                )}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: 4, opacity: status === 'loading' ? 0.7 : 1 }}
                >
                  {status === 'loading' ? '...' : t('subscribe')}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
