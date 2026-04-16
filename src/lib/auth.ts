import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { headers } from 'next/headers'
import { checkRateLimit, resetRateLimit } from './rateLimit'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const headersList = await headers()
        const ip = headersList.get('x-forwarded-for') ?? headersList.get('x-real-ip') ?? 'unknown'
        const { allowed, waitMinutes } = checkRateLimit(ip)

        if (!allowed) {
          throw new Error(`Zu viele Versuche. Bitte warte ${waitMinutes} Minuten.`)
        }

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        })
        if (!user) return null

        const valid = await bcrypt.compare(parsed.data.password, user.password)
        if (!valid) return null

        resetRateLimit(ip)
        return { id: user.id, email: user.email, name: user.name, role: user.role }
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      session.user.role = token.role as string
      session.user.id = token.id as string
      return session
    },
  },
  session: { strategy: 'jwt' },
})
