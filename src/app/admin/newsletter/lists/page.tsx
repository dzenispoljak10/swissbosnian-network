'use client'

import { useEffect, useState } from 'react'
import { Users, Plus, Pencil, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface NLList {
  id: string
  name: string
  description: string | null
  createdAt: string
  _count: { subscribers: number }
}

export default function NewsletterListsPage() {
  const [lists, setLists] = useState<NLList[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editList, setEditList] = useState<NLList | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  async function load() {
    const res = await fetch('/api/admin/newsletter/lists')
    if (res.ok) setLists(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openCreate() {
    setEditList(null)
    setName('')
    setDescription('')
    setShowModal(true)
  }

  function openEdit(list: NLList) {
    setEditList(list)
    setName(list.name)
    setDescription(list.description ?? '')
    setShowModal(true)
  }

  async function handleSave() {
    if (!name.trim()) { toast.error('Name ist Pflicht.'); return }
    setSaving(true)
    try {
      const url = editList ? `/api/admin/newsletter/lists/${editList.id}` : '/api/admin/newsletter/lists'
      const method = editList ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      })
      if (!res.ok) { toast.error('Fehler beim Speichern.'); return }
      toast.success(editList ? 'Liste aktualisiert.' : 'Liste erstellt.')
      setShowModal(false)
      load()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(list: NLList) {
    if (!confirm(`Liste "${list.name}" wirklich löschen?`)) return
    const res = await fetch(`/api/admin/newsletter/lists/${list.id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Liste gelöscht.'); load() }
    else toast.error('Fehler beim Löschen.')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Newsletter-Listen</h1>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-[#0D1F6E] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#1B3A8C] transition-colors">
          <Plus size={16} /> Neue Liste erstellen
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Laden…</p>
      ) : lists.length === 0 ? (
        <p className="text-gray-400 text-sm">Keine Listen vorhanden.</p>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Beschreibung</th>
                <th className="px-6 py-3 text-center">Abonnenten</th>
                <th className="px-6 py-3">Erstellt</th>
                <th className="px-6 py-3 text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {lists.map(list => (
                <tr key={list.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-neutral-900">
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-[#0D1F6E]" />
                      {list.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{list.description || '—'}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-[#EEF2FF] text-[#0D1F6E] font-bold text-xs px-2 py-1 rounded-full">
                      {list._count.subscribers}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(list.createdAt).toLocaleDateString('de-CH')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/newsletter/lists/${list.id}`}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-[#0D1F6E] transition-colors">
                        <Eye size={15} />
                      </Link>
                      <button onClick={() => openEdit(list)}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-[#0D1F6E] transition-colors">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(list)}
                        className="p-1.5 rounded hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4">
            <h2 className="text-lg font-bold text-neutral-900 mb-6">
              {editList ? 'Liste bearbeiten' : 'Neue Liste erstellen'}
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name *</label>
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="z.B. Mitglieder"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0D1F6E]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Beschreibung</label>
                <input
                  type="text" value={description} onChange={e => setDescription(e.target.value)}
                  placeholder="Optional"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0D1F6E]"
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  Abbrechen
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="px-4 py-2 text-sm font-semibold bg-[#0D1F6E] text-white rounded-lg hover:bg-[#1B3A8C] transition-colors disabled:opacity-60">
                  {saving ? 'Speichern…' : 'Speichern'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
