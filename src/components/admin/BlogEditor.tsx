'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TiptapImage from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { slugify } from '@/lib/utils'
import { Bold, Italic, List, Heading2, ArrowRight, Upload } from 'lucide-react'
import toast from 'react-hot-toast'

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
  titleDe: '', titleBs: '', slug: '', contentDe: '', contentBs: '',
  excerptDe: '', excerptBs: '', coverImage: '', category: '', tags: '',
  metaTitleDe: '', metaDescDe: '', published: false,
}

function TiptapToolbar({ editor }: { editor: ReturnType<typeof useEditor> }) {
  if (!editor) return null
  return (
    <div style={{ display: 'flex', gap: 4, padding: '8px 10px', borderBottom: '1px solid #E5E7EB', background: '#F9FAFB', flexWrap: 'wrap' }}>
      {[
        { label: <Bold size={14} />, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
        { label: <Italic size={14} />, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
        { label: <Heading2 size={14} />, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
        { label: <List size={14} />, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList') },
      ].map((btn, i) => (
        <button
          key={i}
          type="button"
          onClick={btn.action}
          style={{
            padding: '4px 8px', borderRadius: 6, border: 'none', cursor: 'pointer',
            background: btn.active ? '#0D1F6E' : 'transparent',
            color: btn.active ? '#fff' : '#374151',
            display: 'flex', alignItems: 'center',
          }}
        >
          {btn.label}
        </button>
      ))}
    </div>
  )
}

export default function BlogEditor({ initialPost }: { initialPost?: Partial<BlogPost> }) {
  const router = useRouter()
  const [post, setPost] = useState<BlogPost>({ ...emptyPost, ...initialPost })
  const [activeTab, setActiveTab] = useState<'de' | 'bs'>('de')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const editorDe = useEditor({
    extensions: [
      StarterKit,
      TiptapImage,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Inhalt auf Deutsch...' }),
    ],
    content: post.contentDe,
    onUpdate: ({ editor }) => setPost((p) => ({ ...p, contentDe: editor.getHTML() })),
  })

  const editorBs = useEditor({
    extensions: [
      StarterKit,
      TiptapImage,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Sadržaj na bosanskom...' }),
    ],
    content: post.contentBs,
    onUpdate: ({ editor }) => setPost((p) => ({ ...p, contentBs: editor.getHTML() })),
  })

  function handleTitleDeChange(value: string) {
    setPost((p) => ({ ...p, titleDe: value, slug: post.id ? p.slug : slugify(value) }))
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      if (res.ok) {
        const data = await res.json()
        setPost((p) => ({ ...p, coverImage: data.url }))
        toast.success('Bild hochgeladen')
      } else {
        toast.error('Fehler beim Upload')
      }
    } catch {
      toast.error('Netzwerkfehler beim Upload')
    } finally {
      setUploading(false)
    }
  }

  async function handleSave(publish: boolean) {
    if (!post.titleDe) { toast.error('Titel (DE) ist Pflicht'); return }
    setLoading(true)
    try {
      const body = {
        ...post,
        published: publish,
        publishedAt: publish ? new Date().toISOString() : null,
      }
      const url = post.id ? `/api/admin/blog/${post.id}` : '/api/admin/blog'
      const method = post.id ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        toast.success(publish ? 'Veröffentlicht!' : 'Als Entwurf gespeichert')
        router.push('/admin/blog')
        router.refresh()
      } else {
        const data = await res.json()
        toast.error(data.error ?? 'Fehler beim Speichern')
      }
    } catch {
      toast.error('Netzwerkfehler')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Cover-Bild (global, für beide Sprachen) */}
      <div>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>
          Cover-Bild (für beide Sprachen)
        </label>
        {post.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt="Cover"
            style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }}
          />
        )}
        <label style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          border: '2px dashed #E5E7EB', borderRadius: 8, padding: '28px 16px',
          cursor: uploading ? 'not-allowed' : 'pointer', color: '#6B7280', fontSize: 14, fontWeight: 500,
          background: '#F9FAFB',
        }}>
          <Upload size={20} />
          {uploading ? 'Wird hochgeladen...' : post.coverImage ? 'Anderes Bild wählen' : 'Bild auswählen oder hierher ziehen'}
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} disabled={uploading} />
        </label>
      </div>

      {/* Header: Tabs + Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        {/* Language Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #E5E7EB' }}>
          {(['de', 'bs'] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setActiveTab(lang)}
              style={{
                padding: '8px 20px', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer',
                background: activeTab === lang ? '#fff' : 'transparent',
                color: activeTab === lang ? '#0D1F6E' : '#6B7280',
                borderBottom: activeTab === lang ? '2px solid #0D1F6E' : '2px solid transparent',
                fontFamily: 'inherit',
              }}
            >
              {lang === 'de' ? '🇩🇪 Deutsch' : '🇧🇦 Bosnisch'}
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => router.push('/admin/blog')}
            style={{ background: 'transparent', color: '#6B7280', border: 'none', borderRadius: 8, padding: '10px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Abbrechen
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSave(false)}
            style={{ background: 'white', color: '#374151', border: '1px solid #E5E7EB', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, fontFamily: 'inherit' }}
          >
            Als Entwurf speichern
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSave(true)}
            style={{ background: '#0D1F6E', color: 'white', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <span>{loading ? 'Speichern...' : 'Veröffentlichen'}</span>
            {!loading && <ArrowRight size={15} />}
          </button>
        </div>
      </div>

      {/* DE Tab */}
      {activeTab === 'de' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Titel (DE) *</label>
            <input
              type="text"
              required
              value={post.titleDe}
              onChange={(e) => handleTitleDeChange(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 15, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Slug</label>
            <input
              type="text"
              value={post.slug}
              onChange={(e) => setPost((p) => ({ ...p, slug: e.target.value }))}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Auszug (DE)</label>
            <textarea
              rows={2}
              value={post.excerptDe}
              onChange={(e) => setPost((p) => ({ ...p, excerptDe: e.target.value }))}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, resize: 'none', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Inhalt (DE) *</label>
            <div style={{ border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden' }}>
              <TiptapToolbar editor={editorDe} />
              <EditorContent
                editor={editorDe}
                style={{ minHeight: 300, padding: 16 }}
                className="prose prose-sm max-w-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[240px]"
              />
            </div>
          </div>
        </div>
      )}

      {/* BS Tab */}
      {activeTab === 'bs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Naslov (BS)</label>
            <input
              type="text"
              value={post.titleBs}
              onChange={(e) => setPost((p) => ({ ...p, titleBs: e.target.value }))}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 15, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Izvod (BS)</label>
            <textarea
              rows={2}
              value={post.excerptBs}
              onChange={(e) => setPost((p) => ({ ...p, excerptBs: e.target.value }))}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, resize: 'none', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Sadržaj (BS)</label>
            <div style={{ border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden' }}>
              <TiptapToolbar editor={editorBs} />
              <EditorContent
                editor={editorBs}
                style={{ minHeight: 300, padding: 16 }}
                className="prose prose-sm max-w-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[240px]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Common fields */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Kategorie</label>
          <select
            value={post.category}
            onChange={(e) => setPost((p) => ({ ...p, category: e.target.value }))}
            style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', outline: 'none', background: 'white' }}
          >
            <option value="">— Kategorie wählen —</option>
            {['Community', 'Events', 'Business', 'News', 'Allgemein'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Tags (Komma-getrennt)</label>
          <input
            type="text"
            value={post.tags}
            onChange={(e) => setPost((p) => ({ ...p, tags: e.target.value }))}
            placeholder="community, events, news"
            style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>SEO-Titel (DE)</label>
          <input
            type="text"
            value={post.metaTitleDe}
            onChange={(e) => setPost((p) => ({ ...p, metaTitleDe: e.target.value }))}
            style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Meta-Beschreibung (DE)</label>
          <textarea
            rows={2}
            value={post.metaDescDe}
            onChange={(e) => setPost((p) => ({ ...p, metaDescDe: e.target.value }))}
            style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, resize: 'none', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
      </div>
    </div>
  )
}
