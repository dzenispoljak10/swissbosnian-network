import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { formatDate, formatCurrency } from '@/lib/utils'

type Props = { params: Promise<{ id: string }> }

export default async function MemberDetailPage({ params }: Props) {
  const { id } = await params
  const member = await prisma.member.findUnique({
    where: { id },
    include: { payments: { orderBy: { createdAt: 'desc' } } },
  })
  if (!member) notFound()

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/members" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900">{member.firstName} {member.lastName}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-neutral-900 mb-4">Mitgliedsdaten</h2>
          <dl className="space-y-3">
            {[
              ['E-Mail', member.email],
              ['Telefon', member.phone ?? '—'],
              ['Unternehmen', member.company ?? '—'],
              ['Typ', member.memberType],
              ['Status', member.memberStatus],
              ['Beigetreten', formatDate(member.joinedAt)],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between text-sm">
                <dt className="text-gray-500">{label}</dt>
                <dd className="font-medium text-neutral-900">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-neutral-900 mb-4">Zahlungshistorie</h2>
          {member.payments.length === 0 ? (
            <p className="text-gray-400 text-sm">Keine Zahlungen</p>
          ) : (
            <div className="space-y-3">
              {member.payments.map((payment) => (
                <div key={payment.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{formatCurrency(payment.amount)}</p>
                    <p className="text-xs text-gray-400">{formatDate(payment.createdAt)}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    payment.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {payment.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
