'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const PRESET_COLORS = [
  { value: '#0D1F6E', label: 'Navy' },
  { value: '#C9960A', label: 'Gold' },
  { value: '#CC1C1C', label: 'Rot' },
  { value: '#22c55e', label: 'Grün' },
  { value: '#8B5CF6', label: 'Lila' },
]

type EventData = {
  id?: string
  titleDe: string
  titleBs: string | null
  descriptionDe: string | null
  descriptionBs: string | null
  date: string
  endDate: string | null
  location: string | null
  locationUrl: string | null
  color: string
  published: boolean
}

function toDatetimeLocal(iso: string | null) {
  if (!iso) return ''
  return iso.slice(0, 16)
}

export default function EventForm({ event }: { event?: EventData }) {
  const router = useRouter()
  const isEdit = !!event?.id

  const [form, setForm] = useState<EventData>({
    titleDe: event?.titleDe ?? '',
    titleBs: event?.titleBs ?? '',
    descriptionDe: event?.descriptionDe ?? '',
    descriptionBs: event?.descriptionBs ?? '',
    date: event?.date ? toDatetimeLocal(event.date) : '',
    endDate: event?.endDate ? toDatetimeLocal(event.endDate) : '',
    location: event?.location ?? '',
    locationUrl: event?.locationUrl ?? '',
    color: event?.color ?? '#0D1F6E',
    published: event?.published ?? true,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(key: keyof EventData, value: string | boolean | null) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.titleDe || !form.date) { setError('Titel und Datum sind Pflichtfelder.'); return }
    setLoading(true)
    setError('')

    const payload = {
      ...form,
      date: new Date(form.date).toISOString(),
      endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
      titleBs: form.titleBs || undefined,
      descriptionDe: form.descriptionDe || undefined,
      descriptionBs: form.descriptionBs || undefined,
      location: form.location || undefined,
      locationUrl: form.locationUrl || undefined,
    }

    const url = isEdit ? `/api/admin/events/${event!.id}` : '/api/admin/events'
    const method = isEdit ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      toast.success('Event gespeichert')
      router.push('/admin/events')
      router.refresh()
    } else {
      const data = await res.json()
      const msg = data.error ?? 'Fehler beim Speichern.'
      setError(msg)
      toast.error(msg)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Titel</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Titel (Deutsch) *</label>
          <input
            type="text"
            value={form.titleDe}
            onChange={e => set('titleDe', e.target.value)}
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
            placeholder="z.B. After-Work Drinks Zürich"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Titel (Bosnisch)</label>
          <input
            type="text"
            value={form.titleBs ?? ''}
            onChange={e => set('titleBs', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
            placeholder="Optionaler bosnischer Titel"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Beschreibung</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Beschreibung (Deutsch)</label>
          <textarea
            value={form.descriptionDe ?? ''}
            onChange={e => set('descriptionDe', e.target.value)}
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue resize-none"
            placeholder="Kurze Beschreibung des Events..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Beschreibung (Bosnisch)</label>
          <textarea
            value={form.descriptionBs ?? ''}
            onChange={e => set('descriptionBs', e.target.value)}
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue resize-none"
            placeholder="Optionaler bosnischer Text..."
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Datum & Ort</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Datum & Uhrzeit *</label>
            <input
              type="datetime-local"
              value={form.date}
              onChange={e => set('date', e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ende (optional)</label>
            <input
              type="datetime-local"
              value={form.endDate ?? ''}
              onChange={e => set('endDate', e.target.value || null)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Ort</label>
          <input
            type="text"
            value={form.location ?? ''}
            onChange={e => set('location', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
            placeholder="z.B. Zürich, Innenstadt"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Google Maps Link (optional)</label>
          <input
            type="url"
            value={form.locationUrl ?? ''}
            onChange={e => set('locationUrl', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
            placeholder="https://maps.google.com/..."
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Farbe & Status</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Farbe</label>
          <div className="flex items-center gap-3 flex-wrap">
            {PRESET_COLORS.map(c => (
              <button
                key={c.value}
                type="button"
                onClick={() => set('color', c.value)}
                style={{ background: c.value }}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${form.color === c.value ? 'border-gray-800 scale-110' : 'border-transparent'}`}
                title={c.label}
              />
            ))}
            <input
              type="color"
              value={form.color}
              onChange={e => set('color', e.target.value)}
              className="w-8 h-8 rounded-full cursor-pointer border border-gray-200"
              title="Benutzerdefinierte Farbe"
            />
            <span className="text-sm text-gray-500 font-mono">{form.color}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => set('published', !form.published)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.published ? 'bg-brand-blue' : 'bg-gray-200'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.published ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
          <label className="text-sm font-medium text-gray-700">
            {form.published ? 'Aktiv (sichtbar im Kalender)' : 'Entwurf (nicht öffentlich)'}
          </label>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-brand-blue text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-brand-blue-dark transition-colors disabled:opacity-50"
        >
          {loading ? 'Wird gespeichert...' : isEdit ? 'Änderungen speichern' : 'Event erstellen'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/events')}
          className="px-6 py-2.5 rounded-xl font-semibold text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Abbrechen
        </button>
      </div>
    </form>
  )
}
