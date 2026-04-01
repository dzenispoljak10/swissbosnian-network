import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Edit, Trash2 } from 'lucide-react'
import EventDeleteButton from '@/components/admin/EventDeleteButton'

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({ orderBy: { date: 'asc' } })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Events</h1>
        <Link
          href="/admin/events/new"
          className="bg-brand-blue text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-brand-blue-dark transition-colors"
        >
          <Plus className="h-4 w-4" />
          Neues Event
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {events.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="font-medium">Noch keine Events</p>
            <p className="text-sm mt-1">Erstelle dein erstes Event mit dem Button oben.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 px-6 py-4 uppercase tracking-wider">Datum</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-6 py-4 uppercase tracking-wider">Titel</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-6 py-4 uppercase tracking-wider hidden md:table-cell">Ort</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-6 py-4 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {events.map(event => (
                <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                    {new Date(event.date).toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    <div className="text-xs text-gray-400">
                      {new Date(event.date).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: event.color, flexShrink: 0, display: 'inline-block' }} />
                      <div>
                        <p className="font-medium text-sm text-neutral-900">{event.titleDe}</p>
                        {event.titleBs && <p className="text-xs text-gray-400">{event.titleBs}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                    {event.location ?? '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${event.published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {event.published ? 'Aktiv' : 'Entwurf'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 justify-end">
                      <Link href={`/admin/events/${event.id}/edit`} className="text-brand-blue hover:text-brand-blue-dark transition-colors">
                        <Edit className="h-4 w-4" />
                      </Link>
                      <EventDeleteButton eventId={event.id} />
                    </div>
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
