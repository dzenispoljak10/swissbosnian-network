import { prisma } from '@/lib/prisma'
import { formatDate, formatCurrency } from '@/lib/utils'

export default async function AdminPaymentsPage() {
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: 'desc' },
    include: { member: { select: { firstName: true, lastName: true, email: true } } },
  })

  const total = payments
    .filter((p) => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Zahlungen</h1>
          <p className="text-gray-500 text-sm mt-1">
            Gesamt: <strong>{formatCurrency(total)}</strong> ({payments.length} Transaktionen)
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {payments.length === 0 ? (
          <div className="text-center py-16 text-gray-400">Keine Zahlungen</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 px-6 py-4 uppercase tracking-wider">Mitglied</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-6 py-4 uppercase tracking-wider hidden md:table-cell">Typ</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-6 py-4 uppercase tracking-wider">Betrag</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-6 py-4 uppercase tracking-wider">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-6 py-4 uppercase tracking-wider hidden lg:table-cell">Datum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-neutral-900">
                      {payment.member.firstName} {payment.member.lastName}
                    </p>
                    <p className="text-xs text-gray-400">{payment.member.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">{payment.memberType}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-neutral-900">{formatCurrency(payment.amount)}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      payment.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                      payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 hidden lg:table-cell">
                    {formatDate(payment.createdAt)}
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
