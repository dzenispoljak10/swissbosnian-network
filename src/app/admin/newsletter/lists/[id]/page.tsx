'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Upload } from 'lucide-react'
import Papa from 'papaparse'

type Subscriber = {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  subscribed: boolean
  createdAt: string
}

export default function NewsletterListDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [listName, setListName] = useState('')
  const [loading, setLoading] = useState(true)
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<Array<{ email: string; firstName: string; lastName: string }>>([])
  const [importStatus, setImportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [importResult, setImportResult] = useState<{ imported: number; skipped: number } | null>(null)

  useEffect(() => {
    fetch(`/api/admin/newsletter/lists/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setListName(data.name ?? '')
        setSubscribers(data.subscribers ?? [])
        setLoading(false)
      })
  }, [id])

  function handleCsvChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCsvFile(file)
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data as Record<string, string>[]
        setPreview(
          rows.slice(0, 5).map((row) => ({
            email: row.email ?? row.Email ?? row.EMAIL ?? '',
            firstName: row.firstName ?? row.first_name ?? row.Vorname ?? '',
            lastName: row.lastName ?? row.last_name ?? row.Nachname ?? '',
          }))
        )
      },
    })
  }

  async function handleImport() {
    if (!csvFile) return
    setImportStatus('loading')
    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data as Record<string, string>[]
        const subscribers = rows
          .map((row) => ({
            email: (row.email ?? row.Email ?? row.EMAIL ?? '').trim().toLowerCase(),
            firstName: row.firstName ?? row.first_name ?? row.Vorname ?? '',
            lastName: row.lastName ?? row.last_name ?? row.Nachname ?? '',
          }))
          .filter((r) => r.email.includes('@'))

        try {
          const res = await fetch(`/api/admin/newsletter/lists/${id}/import`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subscribers }),
          })
          const data = await res.json()
          setImportResult(data)
          setImportStatus('success')
          setCsvFile(null)
          setPreview([])
          // Refresh subscriber list
          fetch(`/api/admin/newsletter/lists/${id}`)
            .then((r) => r.json())
            .then((data) => setSubscribers(data.subscribers ?? []))
        } catch {
          setImportStatus('error')
        }
      },
    })
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/newsletter/lists" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900">{listName || 'Liste'}</h1>
        <span className="bg-brand-blue/10 text-brand-blue text-sm font-semibold px-3 py-1 rounded-full">
          {subscribers.length} Abonnenten
        </span>
      </div>

      {/* CSV Import */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
        <h2 className="font-bold text-neutral-900 mb-4">CSV-Import</h2>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 bg-neutral-50 border border-gray-200 px-4 py-2.5 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors text-sm font-medium">
            <Upload className="h-4 w-4" />
            CSV-Datei auswählen
            <input type="file" accept=".csv" onChange={handleCsvChange} className="hidden" />
          </label>
          {csvFile && <span className="text-sm text-gray-500">{csvFile.name}</span>}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Spalten: <code>email</code> (Pflicht), <code>firstName</code>, <code>lastName</code>
        </p>

        {preview.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Vorschau ({preview.length} Zeilen):</p>
            <div className="bg-gray-50 rounded-xl overflow-hidden text-xs">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left px-3 py-2 font-semibold text-gray-600">Email</th>
                    <th className="text-left px-3 py-2 font-semibold text-gray-600">Vorname</th>
                    <th className="text-left px-3 py-2 font-semibold text-gray-600">Nachname</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, i) => (
                    <tr key={i} className="border-t border-gray-200">
                      <td className="px-3 py-2 text-gray-600">{row.email}</td>
                      <td className="px-3 py-2 text-gray-600">{row.firstName}</td>
                      <td className="px-3 py-2 text-gray-600">{row.lastName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={handleImport}
              disabled={importStatus === 'loading'}
              className="mt-4 bg-brand-blue text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-brand-blue-dark transition-colors disabled:opacity-70"
            >
              {importStatus === 'loading' ? 'Importieren...' : 'Jetzt importieren'}
            </button>
          </div>
        )}

        {importStatus === 'success' && importResult && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
            ✅ {importResult.imported} importiert, {importResult.skipped} übersprungen
          </div>
        )}
        {importStatus === 'error' && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800">
            Fehler beim Import
          </div>
        )}
      </div>

      {/* Subscribers table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-neutral-900">Abonnenten</h2>
        </div>
        {loading ? (
          <div className="text-center py-8 text-gray-400">Laden...</div>
        ) : subscribers.length === 0 ? (
          <div className="text-center py-12 text-gray-400">Keine Abonnenten</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Name</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Datum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-gray-700">{sub.email}</td>
                  <td className="px-6 py-3 text-gray-600 hidden md:table-cell">
                    {sub.firstName} {sub.lastName}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      sub.subscribed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {sub.subscribed ? 'Aktiv' : 'Abgemeldet'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-400 text-xs hidden lg:table-cell">
                    {new Date(sub.createdAt).toLocaleDateString('de-CH')}
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
