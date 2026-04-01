import { prisma } from '@/lib/prisma'
import { Users, FileText, Mail, CreditCard } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default async function DashboardPage() {
  const [memberCount, subscriberCount, postCount, payments] = await Promise.all([
    prisma.member.count({ where: { memberStatus: 'ACTIVE' } }),
    prisma.newsletterSubscriber.count({ where: { subscribed: true } }),
    prisma.blogPost.count({ where: { published: true } }),
    prisma.payment.findMany({
      where: {
        status: 'COMPLETED',
        createdAt: { gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) },
      },
      select: { amount: true },
    }),
  ])

  const monthlyRevenue = payments.reduce((sum, p) => sum + p.amount, 0)

  const recentMembers = await prisma.member.findMany({
    orderBy: { joinedAt: 'desc' },
    take: 5,
    select: { firstName: true, lastName: true, email: true, memberType: true, memberStatus: true, joinedAt: true },
  })

  const stats = [
    { label: 'Aktive Mitglieder', value: memberCount, icon: Users, color: 'text-brand-blue', bg: 'bg-brand-blue/10' },
    { label: 'Newsletter-Abonnenten', value: subscriberCount, icon: Mail, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Veröffentlichte Beiträge', value: postCount, icon: FileText, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Einnahmen (30 Tage)', value: formatCurrency(monthlyRevenue), icon: CreditCard, color: 'text-amber-600', bg: 'bg-amber-100' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500 font-medium">{label}</span>
              <div className={`${bg} p-2 rounded-xl`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
            </div>
            <div className="text-3xl font-bold text-neutral-900">{value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-lg text-neutral-900 mb-4">Neue Mitglieder</h2>
        {recentMembers.length === 0 ? (
          <p className="text-gray-400 text-sm">Noch keine Mitglieder</p>
        ) : (
          <div className="space-y-3">
            {recentMembers.map((m, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="font-medium text-sm text-neutral-900">{m.firstName} {m.lastName}</p>
                  <p className="text-xs text-gray-400">{m.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded-full font-medium">
                    {m.memberType}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    m.memberStatus === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {m.memberStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
