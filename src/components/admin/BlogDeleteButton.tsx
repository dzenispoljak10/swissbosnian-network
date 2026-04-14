'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function BlogDeleteButton({ postId }: { postId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!confirm('Beitrag wirklich löschen?')) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/blog/${postId}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Beitrag gelöscht')
        router.refresh()
      } else {
        toast.error('Fehler beim Löschen')
      }
    } catch {
      toast.error('Netzwerkfehler')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
      title="Löschen"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  )
}
