'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Send } from 'lucide-react'
import Link from 'next/link'

type NewsletterList = { id: string; name: string; _count: { subscribers: number } }

export default function NewCampaignPage() {
  const router = useRouter()
  const [lists, setLists] = useState<NewsletterList[]>([])
  const [form, setForm] = useState({
    subject: '',
    previewText: '',
    content: '',
    footerText: 'Swiss Bosnian Network | info@swissbosnian-network.ch',
    listIds: [] as string[],
  })
  const [loading, setLoading] = useState(false)
  const [testEmail, setTestEmail] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/newsletter/lists')
      .then((r) => r.json())
      .then(setLists)
  }, [])

  function toggleList(id: string) {
    setForm((f) => ({
      ...f,
      listIds: f.listIds.includes(id) ? f.listIds.filter((l) => l !== id) : [...f.listIds, id],
    }))
  }

  async function handleSave(publish = false) {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/newsletter/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, status: publish ? 'SENT' : 'DRAFT', send: publish }),
      })
      const data = await res.json()
      if (res.ok) {
        router.push('/admin/newsletter')
      } else {
        setError(data.error ?? 'Fehler')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleTestSend() {
    if (!testEmail) return
    setLoading(true)
    try {
      await fetch('/api/admin/newsletter/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail, subject: form.subject, content: form.content }),
      })
      alert('Test-E-Mail gesendet!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/newsletter" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900">Neue Kampagne</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Betreff *</label>
              <input
                type="text"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vorschautext</label>
              <input
                type="text"
                value={form.previewText}
                onChange={(e) => setForm({ ...form, previewText: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Inhalt (HTML) *</label>
              <textarea
                required
                rows={12}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none text-sm font-mono"
                placeholder="<h1>Newsletter Titel</h1><p>Inhalt...</p>"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Footer-Text</label>
              <input
                type="text"
                value={form.footerText}
                onChange={(e) => setForm({ ...form, footerText: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
              />
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={() => handleSave(false)}
              disabled={loading}
              className="px-6 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-70"
            >
              Als Entwurf speichern
            </button>
            <button
              onClick={() => {
                if (form.listIds.length === 0) {
                  setError('Bitte mindestens eine Liste auswählen')
                  return
                }
                if (confirm(`Newsletter an ${form.listIds.length} Liste(n) senden?`)) {
                  handleSave(true)
                }
              }}
              disabled={loading || !form.subject || !form.content}
              className="flex-1 bg-brand-blue text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-brand-blue-dark disabled:opacity-70 flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" />
              {loading ? 'Senden...' : 'Newsletter senden'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Lists */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">An Listen senden</h3>
            {lists.length === 0 ? (
              <p className="text-gray-400 text-sm">Keine Listen vorhanden</p>
            ) : (
              <div className="space-y-3">
                {lists.map((list) => (
                  <label key={list.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.listIds.includes(list.id)}
                      onChange={() => toggleList(list.id)}
                      className="h-4 w-4 text-brand-blue rounded"
                    />
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{list.name}</p>
                      <p className="text-xs text-gray-400">{list._count.subscribers} Abonnenten</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Test Send */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">Test-E-Mail</h3>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="test@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
            <button
              onClick={handleTestSend}
              disabled={loading || !testEmail}
              className="w-full border border-brand-blue text-brand-blue py-2 rounded-xl text-sm font-semibold hover:bg-brand-blue hover:text-white transition-colors disabled:opacity-70"
            >
              Test senden
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
