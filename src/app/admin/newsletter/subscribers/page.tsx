'use client'

import { useEffect, useState, useRef } from 'react'
import { Search, Download, Upload, UserMinus, Trash2, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import Papa from 'papaparse'

interface NLList {
  id: string
  name: string
}

interface Subscriber {
  id: string
  firstName: string
  lastName: string
  email: string
  subscribed: boolean
  createdAt: string
  lists: { id: string; name: string }[]
}

export default function NewsletterSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [lists, setLists] = useState<NLList[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterList, setFilterList] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  // Import modal
  const [showImport, setShowImport] = useState(false)
  const [importRows, setImportRows] = useState<{ firstName: string; lastName: string; email: string }[]>([])
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // List dropdown for subscriber
  const [listDropdown, setListDropdown] = useState<string | null>(null)

  async function load() {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (filterList) params.set('listId', filterList)
    if (filterStatus) params.set('status', filterStatus)
    const res = await fetch(`/api/admin/newsletter/subscribers?${params}`)
    if (res.ok) setSubscribers(await res.json())
    setLoading(false)
  }

  async function loadLists() {
    const res = await fetch('/api/admin/newsletter/lists')
    if (res.ok) setLists(await res.json())
  }

  useEffect(() => { loadLists() }, [])
  useEffect(() => {
    setLoading(true)
    const t = setTimeout(load, 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filterList, filterStatus])

  async function handleUnsubscribe(sub: Subscriber) {
    const res = await fetch(`/api/admin/newsletter/subscribers/${sub.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscribed: false }),
    })
    if (res.ok) { toast.success('Abgemeldet.'); load() }
    else toast.error('Fehler.')
  }

  async function handleDelete(sub: Subscriber) {
    if (!confirm(`${sub.firstName} ${sub.lastName} wirklich löschen?`)) return
    const res = await fetch(`/api/admin/newsletter/subscribers/${sub.id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Gelöscht.'); load() }
    else toast.error('Fehler.')
  }

  async function handleAddToList(sub: Subscriber, listId: string) {
    const res = await fetch(`/api/admin/newsletter/subscribers/${sub.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ addListId: listId }),
    })
    if (res.ok) { toast.success('Liste hinzugefügt.'); load() }
    else toast.error('Fehler.')
    setListDropdown(null)
  }

  async function handleRemoveFromList(sub: Subscriber, listId: string) {
    const res = await fetch(`/api/admin/newsletter/subscribers/${sub.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ removeListId: listId }),
    })
    if (res.ok) { toast.success('Aus Liste entfernt.'); load() }
    else toast.error('Fehler.')
    setListDropdown(null)
  }

  function handleExport() {
    const csv = Papa.unparse(subscribers.map(s => ({
      Vorname: s.firstName,
      Nachname: s.lastName,
      Email: s.email,
      Listen: s.lists.map(l => l.name).join(', '),
      Datum: new Date(s.createdAt).toLocaleDateString('de-CH'),
    })))
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'newsletter-abonnenten.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImportFile(file)
    Papa.parse<Record<string, string>>(file, {
      header: true, skipEmptyLines: true,
      complete: (result) => {
        const rows = result.data.map(r => ({
          firstName: r.firstName || r.Vorname || '',
          lastName: r.lastName || r.Nachname || '',
          email: r.email || r.Email || '',
        })).filter(r => r.email)
        setImportRows(rows)
      }
    })
  }

  async function handleImport() {
    if (importRows.length === 0) return
    setImporting(true)
    let imported = 0, skipped = 0
    for (const row of importRows) {
      try {
        const res = await fetch('/api/public/newsletter/subscribe', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(row),
        })
        if (res.status === 201) imported++
        else skipped++
      } catch { skipped++ }
    }
    setImporting(false)
    setShowImport(false)
    setImportRows([])
    setImportFile(null)
    toast.success(`${imported} importiert, ${skipped} übersprungen.`)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Abonnenten</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowImport(true)}
            className="flex items-center gap-2 border border-gray-200 text-gray-700 text-sm font-semibold px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <Upload size={14} /> CSV importieren
          </button>
          <button onClick={handleExport}
            className="flex items-center gap-2 border border-gray-200 text-gray-700 text-sm font-semibold px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={14} /> Als CSV exportieren
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Name oder E-Mail suchen…"
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0D1F6E]"
          />
        </div>
        <select value={filterList} onChange={e => setFilterList(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0D1F6E] text-gray-700">
          <option value="">Alle Listen</option>
          {lists.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0D1F6E] text-gray-700">
          <option value="">Alle Status</option>
          <option value="active">Aktiv</option>
          <option value="inactive">Abgemeldet</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Laden…</p>
      ) : subscribers.length === 0 ? (
        <p className="text-gray-400 text-sm">Keine Abonnenten gefunden.</p>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Vorname</th>
                <th className="px-6 py-3">Nachname</th>
                <th className="px-6 py-3">E-Mail</th>
                <th className="px-6 py-3">Listen</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Datum</th>
                <th className="px-6 py-3 text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map(sub => (
                <tr key={sub.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 font-medium text-neutral-900">{sub.firstName}</td>
                  <td className="px-6 py-3 font-medium text-neutral-900">{sub.lastName}</td>
                  <td className="px-6 py-3 text-gray-600">{sub.email}</td>
                  <td className="px-6 py-3">
                    <div className="relative inline-block">
                      <button onClick={() => setListDropdown(listDropdown === sub.id ? null : sub.id)}
                        className="flex items-center gap-1 text-xs text-gray-600 hover:text-[#0D1F6E] border border-gray-200 rounded px-2 py-1">
                        {sub.lists.length > 0 ? sub.lists.map(l => l.name).join(', ') : 'Keine'}
                        <ChevronDown size={12} />
                      </button>
                      {listDropdown === sub.id && (
                        <div className="absolute z-10 top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[160px]">
                          {lists.map(l => {
                            const inList = sub.lists.some(sl => sl.id === l.id)
                            return (
                              <button key={l.id}
                                onClick={() => inList ? handleRemoveFromList(sub, l.id) : handleAddToList(sub, l.id)}
                                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 flex items-center gap-2 ${inList ? 'text-[#0D1F6E] font-semibold' : 'text-gray-600'}`}>
                                {inList ? '✓ ' : ''}{l.name}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${sub.subscribed ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {sub.subscribed ? 'Aktiv' : 'Abgemeldet'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-400 text-xs">
                    {new Date(sub.createdAt).toLocaleDateString('de-CH')}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {sub.subscribed && (
                        <button onClick={() => handleUnsubscribe(sub)} title="Abmelden"
                          className="p-1.5 rounded hover:bg-orange-50 text-gray-400 hover:text-orange-500 transition-colors">
                          <UserMinus size={14} />
                        </button>
                      )}
                      <button onClick={() => handleDelete(sub)} title="Löschen"
                        className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CSV Import Modal */}
      {showImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg mx-4">
            <h2 className="text-lg font-bold text-neutral-900 mb-4">CSV importieren</h2>
            <p className="text-sm text-gray-500 mb-4">
              Erwartete Spalten: <code className="bg-gray-100 px-1 rounded">firstName</code>,{' '}
              <code className="bg-gray-100 px-1 rounded">lastName</code>,{' '}
              <code className="bg-gray-100 px-1 rounded">email</code>
            </p>
            <input ref={fileRef} type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
            <button onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-200 rounded-xl py-6 text-sm text-gray-500 hover:border-[#0D1F6E] hover:text-[#0D1F6E] transition-colors mb-4">
              {importFile ? importFile.name : '+ CSV-Datei auswählen'}
            </button>

            {importRows.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-600 mb-2">Vorschau ({importRows.length} Zeilen):</p>
                <div className="bg-gray-50 rounded-lg overflow-hidden text-xs">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500">
                        <th className="px-3 py-2 text-left">Vorname</th>
                        <th className="px-3 py-2 text-left">Nachname</th>
                        <th className="px-3 py-2 text-left">E-Mail</th>
                      </tr>
                    </thead>
                    <tbody>
                      {importRows.slice(0, 5).map((r, i) => (
                        <tr key={i} className="border-b border-gray-100">
                          <td className="px-3 py-1.5">{r.firstName}</td>
                          <td className="px-3 py-1.5">{r.lastName}</td>
                          <td className="px-3 py-1.5">{r.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {importRows.length > 5 && (
                    <p className="px-3 py-2 text-gray-400">… und {importRows.length - 5} weitere</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button onClick={() => { setShowImport(false); setImportRows([]); setImportFile(null) }}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                Abbrechen
              </button>
              <button onClick={handleImport} disabled={importing || importRows.length === 0}
                className="px-4 py-2 text-sm font-semibold bg-[#0D1F6E] text-white rounded-lg hover:bg-[#1B3A8C] transition-colors disabled:opacity-60">
                {importing ? 'Importieren…' : `${importRows.length} importieren`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Close dropdown on outside click */}
      {listDropdown && (
        <div className="fixed inset-0 z-0" onClick={() => setListDropdown(null)} />
      )}
    </div>
  )
}
