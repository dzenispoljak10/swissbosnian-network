import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import EventForm from '@/components/admin/EventForm'

type Props = { params: Promise<{ id: string }> }

export default async function EditEventPage({ params }: Props) {
  const { id } = await params
  const event = await prisma.event.findUnique({ where: { id } })
  if (!event) notFound()

  const serialized = {
    ...event,
    date: event.date.toISOString(),
    endDate: event.endDate?.toISOString() ?? null,
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-8">Event bearbeiten</h1>
      <EventForm event={serialized} />
    </div>
  )
}
