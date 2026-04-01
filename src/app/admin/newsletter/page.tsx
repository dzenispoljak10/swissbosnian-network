import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Users, Mail } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function AdminNewsletterPage() {
  const [lists, campaigns, subscriberCount] = await Promise.all([
    prisma.newsletterList.findMany({
      include: { _count: { select: { subscribers: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.newsletterCampaign.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { _count: { select: { sentEmails: true } } },
    }),
    prisma.newsletterSubscriber.count({ where: { subscribed: true } }),
  ])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Newsletter</h1>
          <p className="text-gray-500 text-sm mt-1">{subscriberCount} aktive Abonnenten</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/newsletter/lists"
            className="border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <Users className="h-4 w-4" />
            Listen
          </Link>
          <Link
            href="/admin/newsletter/new"
            className="bg-brand-blue text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-brand-blue-dark transition-colors"
          >
            <Plus className="h-4 w-4" />
            Neue Kampagne
          </Link>
        </div>
      </div>

      {/* Lists overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {lists.map((list) => (
          <Link
            key={list.id}
            href={`/admin/newsletter/lists/${list.id}`}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-brand-blue/10 p-2 rounded-lg">
                <Users className="h-4 w-4 text-brand-blue" />
              </div>
              <span className="font-semibold text-sm text-neutral-900">{list.name}</span>
            </div>
            <p className="text-2xl font-bold text-brand-blue">{list._count.subscribers}</p>
            <p className="text-xs text-gray-400">Abonnenten</p>
          </Link>
        ))}
      </div>

      {/* Campaigns */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-neutral-900">Kampagnen</h2>
        </div>
        {campaigns.length === 0 ? (
          <div className="text-center py-12 text-gray-400">Noch keine Kampagnen</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3 uppercase tracking-wider">Betreff</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3 uppercase tracking-wider hidden md:table-cell">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3 uppercase tracking-wider hidden md:table-cell">Gesendet</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3 uppercase tracking-wider hidden lg:table-cell">Datum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-sm text-neutral-900">{c.subject}</td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      c.status === 'SENT' ? 'bg-green-100 text-green-700' :
                      c.status === 'DRAFT' ? 'bg-gray-100 text-gray-600' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">{c._count.sentEmails}</td>
                  <td className="px-6 py-4 text-sm text-gray-400 hidden lg:table-cell">{formatDate(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
