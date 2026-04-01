import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export default async function AdminMembersPage() {
  const members = await prisma.member.findMany({
    orderBy: { joinedAt: 'desc' },
    include: { _count: { select: { payments: true } } },
  })

  const statusColors: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-700',
    PENDING: 'bg-yellow-100 text-yellow-700',
    EXPIRED: 'bg-red-100 text-red-700',
    CANCELLED: 'bg-gray-100 text-gray-600',
  }

  const typeColors: Record<string, string> = {
    MITGLIED: 'bg-gray-100 text-gray-700',
    GOENNER: 'bg-brand-blue/10 text-brand-blue',
    PARTNER: 'bg-brand-gold/20 text-amber-700',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Mitglieder</h1>
          <p className="text-gray-500 text-sm mt-1">{members.length} total</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {members.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p>Noch keine Mitglieder</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 px-6 py-4 uppercase tracking-wider">Name</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-6 py-4 uppercase tracking-wider hidden md:table-cell">Typ</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-6 py-4 uppercase tracking-wider">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-6 py-4 uppercase tracking-wider hidden lg:table-cell">Beitritt</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-sm text-neutral-900">{member.firstName} {member.lastName}</p>
                    <p className="text-xs text-gray-400">{member.email}</p>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${typeColors[member.memberType] ?? 'bg-gray-100 text-gray-600'}`}>
                      {member.memberType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusColors[member.memberStatus] ?? 'bg-gray-100 text-gray-600'}`}>
                      {member.memberStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 hidden lg:table-cell">
                    {formatDate(member.joinedAt)}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/members/${member.id}`}
                      className="text-xs text-brand-blue hover:underline font-medium"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
