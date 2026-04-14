'use client'

import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CampaignDeleteButton({ id }: { id: string }) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm('Kampagne wirklich löschen?')) return
    try {
      const res = await fetch(`/api/admin/newsletter/campaigns/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Kampagne gelöscht')
        router.refresh()
      } else {
        toast.error('Fehler beim Löschen')
      }
    } catch {
      toast.error('Fehler beim Löschen')
    }
  }

  return (
    <button
      onClick={handleDelete}
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', color: '#EF4444', display: 'flex', alignItems: 'center' }}
      title="Löschen"
    >
      <Trash2 size={15} />
    </button>
  )
}
