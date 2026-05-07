export type ConsentChoices = {
  functional: boolean
  analytics: boolean
}

export type Consent =
  | { decided: true; choices: ConsentChoices }
  | { decided: false }

export const COOKIE_NAME = 'sbn-cookie-consent'
const MAX_AGE_SEC = 60 * 60 * 24 * 365 // 1 year
export const OPEN_PREFS_EVENT = 'sbn-open-cookie-prefs'

export function readConsent(): Consent {
  if (typeof document === 'undefined') return { decided: false }
  const match = document.cookie.match(new RegExp('(?:^|; )' + COOKIE_NAME + '=([^;]*)'))
  if (!match) return { decided: false }
  try {
    const v = JSON.parse(decodeURIComponent(match[1])) as Partial<ConsentChoices>
    return {
      decided: true,
      choices: { functional: !!v.functional, analytics: !!v.analytics },
    }
  } catch {
    return { decided: false }
  }
}

export function saveConsent(choices: ConsentChoices) {
  if (typeof document === 'undefined') return
  const value = encodeURIComponent(JSON.stringify(choices))
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${COOKIE_NAME}=${value}; Path=/; Max-Age=${MAX_AGE_SEC}; SameSite=Lax${secure}`
}

export function openCookiePreferences() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(OPEN_PREFS_EVENT))
}
