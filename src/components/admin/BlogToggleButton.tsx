'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function BlogToggleButton({ postId, published }: { postId: string; published: boolean }) {
  const [isPublished, setIsPublished] = useState(published)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function toggle() {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/blog/${postId}/toggle`, { method: 'PATCH' })
      if (res.ok) {
        setIsPublished(!isPublished)
        toast.success(isPublished ? 'Als Entwurf gespeichert' : 'Veröffentlicht')
        router.refresh()
      } else {
        toast.error('Fehler beim Aktualisieren')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-all ${
        isPublished
          ? 'bg-green-100 text-green-700 hover:bg-green-200'
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
      }`}
    >
      {isPublished ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
      {isPublished ? 'Veröffentlicht' : 'Entwurf'}
    </button>
  )
}
