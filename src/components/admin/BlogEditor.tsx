'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { slugify } from '@/lib/utils'
import { Bold, Italic, List, Heading2, Image as ImageIcon, Link as LinkIcon } from 'lucide-react'

type BlogPost = {
  id?: string
  titleDe: string
  titleBs: string
  slug: string
  contentDe: string
  contentBs: string
  excerptDe: string
  excerptBs: string
  coverImage: string
  category: string
  tags: string
  metaTitleDe: string
  metaDescDe: string
  published: boolean
}

const emptyPost: BlogPost = {
  titleDe: '',
  titleBs: '',
  slug: '',
  contentDe: '',
  contentBs: '',
  excerptDe: '',
  excerptBs: '',
  coverImage: '',
  category: '',
  tags: '',
  metaTitleDe: '',
  metaDescDe: '',
  published: false,
}

function TiptapToolbar({ editor }: { editor: ReturnType<typeof useEditor> }) {
  if (!editor) return null
  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-xl">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1.5 rounded ${editor.isActive('bold') ? 'bg-brand-blue text-white' : 'hover:bg-gray-200'}`}
      >
        <Bold className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1.5 rounded ${editor.isActive('italic') ? 'bg-brand-blue text-white' : 'hover:bg-gray-200'}`}
      >
        <Italic className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-1.5 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-brand-blue text-white' : 'hover:bg-gray-200'}`}
      >
        <Heading2 className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1.5 rounded ${editor.isActive('bulletList') ? 'bg-brand-blue text-white' : 'hover:bg-gray-200'}`}
      >
        <List className="h-4 w-4" />
      </button>
    </div>
  )
}

export default function BlogEditor({ initialPost }: { initialPost?: Partial<BlogPost> }) {
  const router = useRouter()
  const [post, setPost] = useState<BlogPost>({ ...emptyPost, ...initialPost })
  const [activeTab, setActiveTab] = useState<'de' | 'bs'>('de')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const editorDe = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Inhalt auf Deutsch...' }),
    ],
    content: post.contentDe,
    onUpdate: ({ editor }) => setPost((p) => ({ ...p, contentDe: editor.getHTML() })),
  })

  const editorBs = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Sadržaj na bosanskom...' }),
    ],
    content: post.contentBs,
    onUpdate: ({ editor }) => setPost((p) => ({ ...p, contentBs: editor.getHTML() })),
  })

  function handleTitleDeChange(value: string) {
    setPost((p) => ({
      ...p,
      titleDe: value,
      slug: post.id ? p.slug : slugify(value),
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const url = post.id ? `/api/admin/blog/${post.id}` : '/api/admin/blog'
      const method = post.id ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      })
      if (res.ok) {
        router.push('/admin/blog')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error ?? 'Fehler beim Speichern')
      }
    } catch {
      setError('Netzwerkfehler')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Language Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {(['de', 'bs'] as const).map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => setActiveTab(lang)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === lang
                ? 'bg-white border border-b-white border-gray-200 text-brand-blue -mb-px'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {lang === 'de' ? '🇩🇪 Deutsch' : '🇧🇦 Bosnisch'}
          </button>
        ))}
      </div>

      {/* DE Tab */}
      {activeTab === 'de' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titel (DE) *</label>
            <input
              type="text"
              required
              value={post.titleDe}
              onChange={(e) => handleTitleDeChange(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input
              type="text"
              value={post.slug}
              onChange={(e) => setPost((p) => ({ ...p, slug: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Auszug (DE)</label>
            <textarea
              rows={2}
              value={post.excerptDe}
              onChange={(e) => setPost((p) => ({ ...p, excerptDe: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Inhalt (DE) *</label>
            <div className="border border-gray-300 rounded-xl overflow-hidden">
              <TiptapToolbar editor={editorDe} />
              <EditorContent
                editor={editorDe}
                className="prose prose-sm max-w-none min-h-[200px] p-4 focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[200px]"
              />
            </div>
          </div>
        </div>
      )}

      {/* BS Tab */}
      {activeTab === 'bs' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Naslov (BS)</label>
            <input
              type="text"
              value={post.titleBs}
              onChange={(e) => setPost((p) => ({ ...p, titleBs: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Izvod (BS)</label>
            <textarea
              rows={2}
              value={post.excerptBs}
              onChange={(e) => setPost((p) => ({ ...p, excerptBs: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sadržaj (BS)</label>
            <div className="border border-gray-300 rounded-xl overflow-hidden">
              <TiptapToolbar editor={editorBs} />
              <EditorContent
                editor={editorBs}
                className="prose prose-sm max-w-none min-h-[200px] p-4 focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[200px]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Common fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cover-Bild URL</label>
          <input
            type="url"
            value={post.coverImage}
            onChange={(e) => setPost((p) => ({ ...p, coverImage: e.target.value }))}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kategorie</label>
          <input
            type="text"
            value={post.category}
            onChange={(e) => setPost((p) => ({ ...p, category: e.target.value }))}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags (Komma-getrennt)</label>
          <input
            type="text"
            value={post.tags}
            onChange={(e) => setPost((p) => ({ ...p, tags: e.target.value }))}
            placeholder="community, events, news"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">SEO-Titel (DE)</label>
          <input
            type="text"
            value={post.metaTitleDe}
            onChange={(e) => setPost((p) => ({ ...p, metaTitleDe: e.target.value }))}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Meta-Beschreibung (DE)</label>
        <textarea
          rows={2}
          value={post.metaDescDe}
          onChange={(e) => setPost((p) => ({ ...p, metaDescDe: e.target.value }))}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none text-sm"
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="published"
          checked={post.published}
          onChange={(e) => setPost((p) => ({ ...p, published: e.target.checked }))}
          className="h-4 w-4 text-brand-blue rounded"
        />
        <label htmlFor="published" className="text-sm font-medium text-gray-700">
          Sofort veröffentlichen
        </label>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.push('/admin/blog')}
          className="px-6 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          Abbrechen
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-brand-blue text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-brand-blue-dark disabled:opacity-70 transition-colors"
        >
          {loading ? 'Speichern...' : 'Beitrag speichern'}
        </button>
      </div>
    </form>
  )
}
