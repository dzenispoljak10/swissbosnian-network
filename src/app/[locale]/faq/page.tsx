'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ChevronDown, ArrowRight, MessageCircle } from 'lucide-react'
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

export default function FAQPage() {
  const t = useTranslations('faq')
  const locale = useLocale()
  const items = t.raw('items') as Array<{ q: string; a: string }>
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div>
      {/* Hero */}
      <section style={{ background: '#0D1F6E', paddingTop: 'clamp(72px,10vw,128px)', paddingBottom: 'clamp(48px,6vw,80px)', position: 'relative', overflow: 'hidden' }}>
        <ConcentricCircles size={600} color="#fff" opacity={0.05} style={{ right: -160, top: -160 }} />
        <ConcentricCircles size={320} color="#fff" opacity={0.04} style={{ left: -60, bottom: -80 }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}
            style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(245,200,0,0.15)', border: '1px solid rgba(245,200,0,0.3)', color: '#F5C800', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: 6, padding: '4px 12px', marginBottom: 24 }}>
            FAQ
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08, ease }}
            style={{ fontSize: 'clamp(32px,5vw,58px)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em', lineHeight: 1.1, maxWidth: 640, margin: '0 0 20px' }}>
            {t('title')}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25, duration: 0.5 }}
            style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', maxWidth: 480, lineHeight: 1.75 }}>
            Alles Wichtige zum Swiss Bosnian Network auf einen Blick.
          </motion.p>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <FadeUp>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {items.map((item, i) => {
                const isOpen = openIndex === i
                return (
                  <div key={i} style={{ borderRadius: 16, border: `1.5px solid ${isOpen ? '#0D1F6E' : '#E5E7EB'}`, background: isOpen ? '#F8FAFF' : '#ffffff', overflow: 'hidden', transition: 'border-color 0.2s, background 0.2s' }}>
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', fontSize: 16, fontWeight: 600, color: isOpen ? '#0D1F6E' : '#0A0F1E', transition: 'color 0.15s', gap: 16 }}>
                      <span>{item.q}</span>
                      <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25, ease }}
                        style={{ display: 'flex', flexShrink: 0, color: isOpen ? '#0D1F6E' : '#9CA3AF' }}>
                        <ChevronDown size={18} strokeWidth={2} />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease }}
                          style={{ overflow: 'hidden' }}>
                          <p style={{ fontSize: 15, color: '#6B7280', lineHeight: 1.8, padding: '0 24px 24px' }}>{item.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </FadeUp>

          {/* Kontakt CTA */}
          <FadeUp delay={0.15}>
            <div style={{ background: '#0D1F6E', borderRadius: 20, padding: '36px 40px', marginTop: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', position: 'relative', overflow: 'hidden' }}>
              <ConcentricCircles size={260} color="#fff" opacity={0.06} style={{ right: -60, top: '50%', transform: 'translateY(-50%)' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <MessageCircle size={18} style={{ color: '#F5C800' }} strokeWidth={1.75} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#F5C800', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Noch eine Frage?</span>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>Wir helfen gerne weiter.</h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.65 }}>Schreib uns direkt — wir melden uns schnell.</p>
              </div>
              <Link href={"/kontakt"}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 44, padding: '0 24px', background: '#F5C800', color: '#0D1F6E', borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0, position: 'relative', zIndex: 1, transition: 'opacity 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                Kontakt aufnehmen <ArrowRight size={14} strokeWidth={2.5} />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  )
}
