'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Eye, Compass, Heart, Shield, ArrowRight } from 'lucide-react'
import { ConcentricCircles } from '@/components/ui/ConcentricCircles'

const ease = [0.4, 0, 0.2, 1] as const

const teamImages = [
  '/team/hamza.jpg',
  '/team/jasmina.jpg',
  '/team/emir.jpg',
  '/team/anesa.jpg',
  '/team/dzenan.jpg',
]

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, ease, delay }}>
      {children}
    </motion.div>
  )
}

const values = [
  { Icon: Heart,   title: 'Offen & inklusiv',      body: 'Jede:r ist willkommen — unabhängig von Herkunft, Alter oder Lebensweg.' },
  { Icon: Shield,  title: 'Politisch neutral',      body: 'Fokus auf das Verbindende, nicht auf das Trennende.' },
  { Icon: Eye,     title: 'Transparent',            body: 'Ehrlichkeit und Offenheit als Basis jeder Zusammenarbeit.' },
  { Icon: Compass, title: 'Zukunftsorientiert',     body: 'Kreative Ideen und digitale Lösungen für eine lebendige Community.' },
]

export default function AboutPage() {
  const t = useTranslations('about')
  const tTeam = useTranslations('team')
  const locale = useLocale()
  const members = tTeam.raw('members') as Array<{ name: string; role: string; bio: string }>

  return (
    <div>
      {/* Hero */}
      <section style={{ background: '#0D1F6E', paddingTop: 'clamp(72px,10vw,128px)', paddingBottom: 'clamp(48px,6vw,80px)', position: 'relative', overflow: 'hidden' }}>
        <ConcentricCircles size={600} color="#fff" opacity={0.05} style={{ right: -160, top: -160 }} />
        <ConcentricCircles size={320} color="#fff" opacity={0.04} style={{ left: -60, bottom: -80 }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}
            style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(245,200,0,0.15)', border: '1px solid rgba(245,200,0,0.3)', color: '#F5C800', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: 6, padding: '4px 12px', marginBottom: 24 }}>
            Über uns
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08, ease }}
            style={{ fontSize: 'clamp(32px,5vw,58px)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em', lineHeight: 1.1, maxWidth: 680, margin: '0 0 20px' }}>
            {t('title')}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25, duration: 0.5 }}
            style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', maxWidth: 520, lineHeight: 1.75 }}>
            {t('subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <FadeUp>
            <div style={{ gap: 20 }} className="grid grid-cols-1 md:grid-cols-2">
              {/* Vision */}
              <div style={{ background: '#F0EEE9', borderRadius: 20, padding: '40px', position: 'relative', overflow: 'hidden' }}>
                <ConcentricCircles size={300} color="#0D1F6E" opacity={0.05} style={{ right: -60, bottom: -60 }} />
                <div style={{ width: 44, height: 44, borderRadius: 10, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, position: 'relative', zIndex: 1 }}>
                  <Eye size={20} style={{ color: '#0D1F6E' }} strokeWidth={1.75} />
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: '#0A0F1E', marginBottom: 12, position: 'relative', zIndex: 1 }}>{t('vision')}</h3>
                <p style={{ fontSize: 15, color: '#6B7280', lineHeight: 1.8, position: 'relative', zIndex: 1 }}>{t('visionText')}</p>
              </div>
              {/* Mission */}
              <div style={{ background: '#0D1F6E', borderRadius: 20, padding: '40px', position: 'relative', overflow: 'hidden' }}>
                <ConcentricCircles size={300} color="#fff" opacity={0.06} style={{ right: -60, bottom: -60 }} />
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, position: 'relative', zIndex: 1 }}>
                  <Compass size={20} style={{ color: '#F5C800' }} strokeWidth={1.75} />
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', marginBottom: 12, position: 'relative', zIndex: 1 }}>{t('mission')}</h3>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, position: 'relative', zIndex: 1 }}>{t('missionText')}</p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Werte */}
      <section className="section" style={{ background: '#F0EEE9' }}>
        <div className="container">
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <span style={{ display: 'inline-flex', background: 'rgba(13,31,110,0.08)', color: '#0D1F6E', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: 6, padding: '4px 12px', marginBottom: 16 }}>
                Unsere Werte
              </span>
              <h2 style={{ fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 800, color: '#0A0F1E', letterSpacing: '-0.025em' }}>
                Was uns ausmacht.
              </h2>
            </div>
          </FadeUp>
          <motion.div
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
            initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
            style={{ gap: 16 }}
            className="grid grid-cols-2 md:grid-cols-4">
            {values.map(({ Icon, title, body }) => (
              <motion.div key={title}
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } } }}
                style={{ background: '#ffffff', borderRadius: 16, padding: '28px 24px', border: '1px solid rgba(0,0,0,0.04)' }}>
                <Icon size={20} style={{ color: '#0D1F6E', marginBottom: 14, display: 'block' }} strokeWidth={1.75} />
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0A0F1E', marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.65 }}>{body}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="section" style={{ background: '#fff' }}>
        <div className="container">
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: 52 }}>
              <span style={{ display: 'inline-flex', background: '#EEF2FF', color: '#0D1F6E', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: 6, padding: '4px 12px', marginBottom: 16 }}>
                Das Team
              </span>
              <h2 style={{ fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 800, color: '#0A0F1E', letterSpacing: '-0.025em' }}>
                {t('team')}
              </h2>
            </div>
          </FadeUp>

          <motion.div
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
            initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
            style={{ gap: 20 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member, i) => (
              <motion.div key={i}
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } } }}
                style={{ background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.25s ease, box-shadow 0.25s ease' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 24px 48px rgba(13,31,110,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
                <div style={{ height: 240, position: 'relative', background: '#F0EEE9', flexShrink: 0 }}>
                  <Image src={teamImages[i % teamImages.length]} alt={member.name} fill
                    style={{ objectFit: 'contain', objectPosition: 'center top', padding: '12px 12px 0' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 40, background: 'linear-gradient(to top, #F0EEE9, transparent)' }} />
                </div>
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: '#0A0F1E', marginBottom: 3 }}>{member.name}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#0D1F6E', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{member.role}</div>
                  <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.75, flex: 1 }}>{member.bio}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#0D1F6E', padding: '80px 24px', position: 'relative', overflow: 'hidden' }}>
        <ConcentricCircles size={500} color="#fff" opacity={0.05} style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }} />
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <FadeUp>
            <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.025em', marginBottom: 16 }}>
              {t('joinText')}
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', marginBottom: 32, lineHeight: 1.75 }}>
              Tritt unserer Community bei und gestalte das Netzwerk aktiv mit.
            </p>
            <Link href={"/mitmachen"}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 48, padding: '0 32px', background: '#F5C800', color: '#0D1F6E', borderRadius: 8, fontWeight: 700, fontSize: 15, textDecoration: 'none', transition: 'opacity 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              {t('joinCta')} <ArrowRight size={15} strokeWidth={2.5} />
            </Link>
          </FadeUp>
        </div>
      </section>
    </div>
  )
}
