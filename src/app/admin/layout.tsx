import { SessionProvider } from 'next-auth/react'
import { auth } from '@/lib/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'

export const metadata = {
  title: 'Admin | Swiss Bosnian Network',
}

function formatDateDE(date: Date): string {
  return date.toLocaleDateString('de-CH', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const userName = session?.user?.name ?? 'Admin'
  const today = formatDateDE(new Date())

  return (
    <SessionProvider>
      <div style={{ minHeight: '100vh', background: '#F9FAFB' }}>
        <AdminSidebar />
        <div style={{ marginLeft: 240, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          {/* Top Bar */}
          <div style={{
            background: '#ffffff',
            borderBottom: '1px solid #E5E7EB',
            padding: '16px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>
              Willkommen, <span style={{ color: '#0D1F6E' }}>{userName}</span>
            </span>
            <span style={{ fontSize: 13, color: '#6B7280' }}>{today}</span>
          </div>
          {/* Main content */}
          <main style={{ flex: 1, padding: 32, overflow: 'auto' }}>
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  )
}
