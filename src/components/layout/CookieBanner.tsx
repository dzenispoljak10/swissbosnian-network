'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X, ShieldCheck } from 'lucide-react'
import {
  readConsent,
  saveConsent,
  OPEN_PREFS_EVENT,
  type ConsentChoices,
} from '@/lib/cookieConsent'

type Phase = 'hidden' | 'banner' | 'preferences'

const ease = [0.4, 0, 0.2, 1] as const
const BRAND = '#0D1F6E'
const BRAND_DARK = '#0A1858'
const ACCENT = '#F5C800'
const BORDER = '#E5E7EB'
const MUTED = '#6B7280'
const SURFACE = '#F9FAFB'

export default function CookieBanner() {
  const t = useTranslations('cookieBanner')
  const [phase, setPhase] = useState<Phase>('hidden')
  const [choices, setChoices] = useState<ConsentChoices>({
    functional: true,
    analytics: false,
  })

  useEffect(() => {
    const c = readConsent()
    if (c.decided) {
      setChoices(c.choices)
    } else {
      const t = setTimeout(() => setPhase('banner'), 450)
      return () => clearTimeout(t)
    }
  }, [])

  useEffect(() => {
    function onOpen() {
      const c = readConsent()
      if (c.decided) setChoices(c.choices)
      setPhase('preferences')
    }
    window.addEventListener(OPEN_PREFS_EVENT, onOpen)
    return () => window.removeEventListener(OPEN_PREFS_EVENT, onOpen)
  }, [])

  useEffect(() => {
    if (phase !== 'preferences') return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setPhase((p) => (p === 'preferences' ? 'banner' : p))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase])

  function decide(c: ConsentChoices) {
    saveConsent(c)
    setChoices(c)
    setPhase('hidden')
  }

  return (
    <AnimatePresence>
      {phase !== 'hidden' && (
        <motion.div
          key="cookie-banner"
          role="dialog"
          aria-modal="false"
          aria-labelledby="cookie-banner-title"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24, transition: { duration: 0.2, ease } }}
          transition={{ duration: 0.4, ease }}
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            padding: '12px clamp(12px, 3vw, 24px) max(12px, env(safe-area-inset-bottom))',
            display: 'flex',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              pointerEvents: 'auto',
              width: '100%',
              maxWidth: phase === 'preferences' ? 720 : 760,
              background: '#ffffff',
              border: `1px solid ${BORDER}`,
              borderRadius: 16,
              boxShadow: '0 16px 48px rgba(13,31,110,0.14), 0 2px 8px rgba(13,31,110,0.06)',
              overflow: 'hidden',
            }}
          >
            {phase === 'banner' ? (
              <BannerView t={t} onDecide={decide} onOpenPrefs={() => setPhase('preferences')} />
            ) : (
              <PreferencesView
                t={t}
                choices={choices}
                onChange={setChoices}
                onSave={() => decide(choices)}
                onAcceptAll={() => decide({ functional: true, analytics: true })}
                onClose={() => {
                  // If the user closes without saving and never decided before, keep
                  // banner visible so they're nudged to choose.
                  const prev = readConsent()
                  setPhase(prev.decided ? 'hidden' : 'banner')
                }}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─────────────────────────────────────────────────────────
// Banner (compact)
// ─────────────────────────────────────────────────────────

function BannerView({
  t,
  onDecide,
  onOpenPrefs,
}: {
  t: ReturnType<typeof useTranslations>
  onDecide: (c: ConsentChoices) => void
  onOpenPrefs: () => void
}) {
  return (
    <div style={{ padding: 'clamp(20px, 3vw, 28px)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 12 }}>
        <div
          style={{
            flexShrink: 0,
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'rgba(13,31,110,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: BRAND,
          }}
        >
          <Cookie size={20} strokeWidth={1.75} />
        </div>
        <div style={{ flex: 1 }}>
          <h2
            id="cookie-banner-title"
            style={{
              margin: '2px 0 6px',
              fontSize: 16,
              fontWeight: 700,
              color: '#0F172A',
              letterSpacing: '-0.01em',
            }}
          >
            {t('title')}
          </h2>
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.65, color: MUTED }}>
            {t('body')}{' '}
            <Link
              href="/datenschutz"
              style={{ color: BRAND, textDecoration: 'underline', textUnderlineOffset: 2 }}
            >
              {t('linkPrivacy')}
            </Link>
            .
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
          marginTop: 16,
        }}
      >
        <SecondaryButton onClick={() => onDecide({ functional: false, analytics: false })}>
          {t('btnReject')}
        </SecondaryButton>
        <SecondaryButton onClick={onOpenPrefs}>{t('btnCustomize')}</SecondaryButton>
        <PrimaryButton onClick={() => onDecide({ functional: true, analytics: true })}>
          {t('btnAccept')}
        </PrimaryButton>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Preferences (expanded)
// ─────────────────────────────────────────────────────────

function PreferencesView({
  t,
  choices,
  onChange,
  onSave,
  onAcceptAll,
  onClose,
}: {
  t: ReturnType<typeof useTranslations>
  choices: ConsentChoices
  onChange: (c: ConsentChoices) => void
  onSave: () => void
  onAcceptAll: () => void
  onClose: () => void
}) {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px clamp(20px,3vw,28px) 8px',
        }}
      >
        <h2
          id="cookie-banner-title"
          style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.01em' }}
        >
          {t('prefsTitle')}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={t('close')}
          style={{
            border: 0,
            background: 'transparent',
            color: MUTED,
            cursor: 'pointer',
            width: 32,
            height: 32,
            borderRadius: 8,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.15s, color 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = SURFACE
            e.currentTarget.style.color = '#0F172A'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = MUTED
          }}
        >
          <X size={18} strokeWidth={2} />
        </button>
      </div>

      <p
        style={{
          margin: '0 clamp(20px,3vw,28px) 16px',
          fontSize: 13.5,
          color: MUTED,
          lineHeight: 1.65,
        }}
      >
        {t('prefsBody')}{' '}
        <Link
          href="/datenschutz"
          style={{ color: BRAND, textDecoration: 'underline', textUnderlineOffset: 2 }}
        >
          {t('linkPrivacy')}
        </Link>
        .
      </p>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          padding: '0 clamp(20px,3vw,28px)',
          marginBottom: 8,
        }}
      >
        <Category
          title={t('catEssentialTitle')}
          body={t('catEssentialBody')}
          checked
          locked
          lockedHint={t('alwaysOn')}
          icon={<ShieldCheck size={16} strokeWidth={1.75} />}
        />
        <Category
          title={t('catFunctionalTitle')}
          body={t('catFunctionalBody')}
          checked={choices.functional}
          onToggle={(v) => onChange({ ...choices, functional: v })}
        />
        <Category
          title={t('catAnalyticsTitle')}
          body={t('catAnalyticsBody')}
          checked={choices.analytics}
          onToggle={(v) => onChange({ ...choices, analytics: v })}
        />
      </div>

      <div
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
          padding: '16px clamp(20px,3vw,28px) clamp(20px,3vw,24px)',
          background: SURFACE,
          borderTop: `1px solid ${BORDER}`,
          marginTop: 12,
        }}
      >
        <SecondaryButton onClick={onSave}>{t('btnSave')}</SecondaryButton>
        <PrimaryButton onClick={onAcceptAll}>{t('btnAccept')}</PrimaryButton>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Bits
// ─────────────────────────────────────────────────────────

function Category({
  title,
  body,
  checked,
  onToggle,
  locked = false,
  lockedHint,
  icon,
}: {
  title: string
  body: string
  checked: boolean
  onToggle?: (v: boolean) => void
  locked?: boolean
  lockedHint?: string
  icon?: React.ReactNode
}) {
  return (
    <div
      style={{
        border: `1px solid ${BORDER}`,
        borderRadius: 12,
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
        background: locked ? SURFACE : '#ffffff',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          {icon && <span style={{ color: BRAND, display: 'inline-flex' }}>{icon}</span>}
          <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>{title}</span>
          {locked && lockedHint && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: BRAND,
                background: 'rgba(13,31,110,0.08)',
                padding: '2px 8px',
                borderRadius: 999,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              {lockedHint}
            </span>
          )}
        </div>
        <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.55, color: MUTED }}>{body}</p>
      </div>
      <Toggle checked={checked} onChange={onToggle} disabled={locked} />
    </div>
  )
}

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean
  onChange?: (v: boolean) => void
  disabled?: boolean
}) {
  const W = 36
  const H = 20
  const PAD = 2
  const KNOB = H - PAD * 2
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange?.(!checked)}
      style={{
        flexShrink: 0,
        position: 'relative',
        width: W,
        height: H,
        borderRadius: H,
        border: 0,
        padding: 0,
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: checked ? BRAND : '#CBD5E1',
        opacity: disabled ? 0.65 : 1,
        transition: 'background 0.18s ease',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: PAD,
          left: checked ? W - KNOB - PAD : PAD,
          width: KNOB,
          height: KNOB,
          borderRadius: '50%',
          background: '#ffffff',
          boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
          transition: 'left 0.18s ease',
        }}
      />
    </button>
  )
}

function PrimaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        height: 40,
        padding: '0 18px',
        border: 0,
        borderRadius: 10,
        background: BRAND,
        color: '#ffffff',
        fontSize: 13.5,
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'background 0.15s ease, transform 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = BRAND_DARK
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = BRAND
      }}
    >
      {children}
    </button>
  )
}

function SecondaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        height: 40,
        padding: '0 16px',
        border: `1.5px solid ${BORDER}`,
        borderRadius: 10,
        background: '#ffffff',
        color: '#0F172A',
        fontSize: 13.5,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'border-color 0.15s ease, background 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = BRAND
        e.currentTarget.style.background = SURFACE
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = BORDER
        e.currentTarget.style.background = '#ffffff'
      }}
    >
      {children}
    </button>
  )
}

// suppress unused import warning if accent ever needed
void ACCENT
