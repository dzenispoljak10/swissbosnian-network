import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Users, ArrowLeft } from 'lucide-react'

export default async function NewsletterListsPage() {
  const lists = await prisma.newsletterList.findMany({
    include: { _count: { select: { subscribers: true } } },
    orderBy: { createdAt: 'asc' },
  })

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/newsletter" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900">Newsletter-Listen</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {lists.map((list) => (
          <Link
            key={list.id}
            href={`/admin/newsletter/lists/${list.id}`}
            className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
          >
            <div className="bg-brand-blue/10 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
              <Users className="h-5 w-5 text-brand-blue" />
            </div>
            <h3 className="font-bold text-neutral-900">{list.name}</h3>
            {list.description && <p className="text-sm text-gray-500 mt-1">{list.description}</p>}
            <p className="text-3xl font-bold text-brand-blue mt-4">{list._count.subscribers}</p>
            <p className="text-xs text-gray-400">Abonnenten</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
