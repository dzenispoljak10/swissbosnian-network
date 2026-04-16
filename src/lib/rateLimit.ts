const attempts = new Map<string, { count: number; lastAttempt: number }>()

export function checkRateLimit(ip: string): { allowed: boolean; waitMinutes?: number } {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000
  const maxAttempts = 5

  const current = attempts.get(ip)

  if (!current) {
    attempts.set(ip, { count: 1, lastAttempt: now })
    return { allowed: true }
  }

  if (now - current.lastAttempt > windowMs) {
    attempts.set(ip, { count: 1, lastAttempt: now })
    return { allowed: true }
  }

  if (current.count >= maxAttempts) {
    const waitMs = windowMs - (now - current.lastAttempt)
    const waitMinutes = Math.ceil(waitMs / 60000)
    return { allowed: false, waitMinutes }
  }

  attempts.set(ip, { count: current.count + 1, lastAttempt: now })
  return { allowed: true }
}

export function resetRateLimit(ip: string) {
  attempts.delete(ip)
}
