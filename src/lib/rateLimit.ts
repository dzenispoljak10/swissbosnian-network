type Bucket = Map<string, { count: number; lastAttempt: number }>
const buckets = new Map<string, Bucket>()

function getBucket(name: string): Bucket {
  let b = buckets.get(name)
  if (!b) {
    b = new Map()
    buckets.set(name, b)
  }
  return b
}

export type RateLimitOptions = {
  bucket?: string
  windowMs?: number
  maxAttempts?: number
}

export function checkRateLimit(
  ip: string,
  options: RateLimitOptions = {}
): { allowed: boolean; waitMinutes?: number } {
  const bucketName = options.bucket ?? 'default'
  const windowMs = options.windowMs ?? 15 * 60 * 1000
  const maxAttempts = options.maxAttempts ?? 5

  const bucket = getBucket(bucketName)
  const now = Date.now()
  const current = bucket.get(ip)

  if (!current || now - current.lastAttempt > windowMs) {
    bucket.set(ip, { count: 1, lastAttempt: now })
    return { allowed: true }
  }

  if (current.count >= maxAttempts) {
    const waitMs = windowMs - (now - current.lastAttempt)
    return { allowed: false, waitMinutes: Math.ceil(waitMs / 60000) }
  }

  bucket.set(ip, { count: current.count + 1, lastAttempt: now })
  return { allowed: true }
}

export function resetRateLimit(ip: string, bucket: string = 'default') {
  getBucket(bucket).delete(ip)
}

export function getClientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}
