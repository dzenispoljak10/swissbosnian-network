'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  GripVertical,
  Trash2,
  Type,
  ImageIcon,
  MousePointer2,
  Minus,
  MoveVertical,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronLeft,
  Send,
  Save,
  Layout,
  AlignJustify,
  Settings,
  Upload,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  Block,
  BlockType,
  GlobalStyles,
  defaultGlobalStyles,
  defaultBlocks,
  createBlock,
  renderNewsletter,
} from '@/lib/email/renderNewsletter'

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface NLList {
  id: string
  name: string
  _count: { subscribers: number }
}

interface NewsletterEditorProps {
  campaignId?: string
  initialSubject?: string
  initialPreviewText?: string
  initialBlocks?: Block[]
  initialGlobalStyles?: GlobalStyles
  initialListIds?: string[]
}

// ─────────────────────────────────────────────
// Block Preview (canvas rendering)
// ─────────────────────────────────────────────
function BlockPreview({ block }: { block: Block }) {
  const d = block.data
  switch (block.type) {
    case 'header':
      return (
        <div style={{ background: (d.bgColor as string) || '#0D1F6E', padding: '24px 32px', textAlign: 'center' }}>
          <div style={{ color: (d.textColor as string) || '#fff', fontSize: 20, fontWeight: 800, lineHeight: 1.3 }}>
            {(d.title as string) || 'Titel'}
          </div>
          {Boolean(d.subtitle) && (
            <div style={{ color: (d.textColor as string) || '#fff', opacity: 0.8, fontSize: 13, marginTop: 4 }}>
              {String(d.subtitle)}
            </div>
          )}
        </div>
      )
    case 'text':
      return (
        <div
          style={{ padding: '16px 32px', textAlign: (d.align as 'left' | 'center' | 'right') || 'left', fontSize: 14, color: '#374151', lineHeight: 1.65 }}
          dangerouslySetInnerHTML={{ __html: (d.content as string) || '<p>Text...</p>' }}
        />
      )
    case 'image':
      return (
        <div style={{ padding: '12px 32px', textAlign: 'center' }}>
          {d.src ? (
            <img src={d.src as string} alt={(d.alt as string) || ''} style={{ maxWidth: '100%', borderRadius: 6 }} />
          ) : (
            <div style={{ height: 80, background: '#F3F4F6', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: 13 }}>
              <ImageIcon size={20} style={{ marginRight: 8 }} /> Bild auswählen
            </div>
          )}
        </div>
      )
    case 'button': {
      const align = (d.align as string) || 'center'
      return (
        <div style={{ padding: '12px 32px', textAlign: align as 'left' | 'center' | 'right' }}>
          <span style={{ display: 'inline-block', background: (d.bgColor as string) || '#0D1F6E', color: (d.textColor as string) || '#fff', padding: (d.size as string) === 'large' ? '14px 36px' : (d.size as string) === 'small' ? '8px 20px' : '11px 28px', borderRadius: 8, fontSize: 14, fontWeight: 600 }}>
            {(d.text as string) || 'Button'}
          </span>
        </div>
      )
    }
    case 'divider':
      return (
        <div style={{ padding: `${(d.spacing as number) || 16}px 32px` }}>
          <hr style={{ border: 'none', borderTop: `${(d.thickness as number) || 1}px solid ${(d.color as string) || '#E5E7EB'}`, margin: 0 }} />
        </div>
      )
    case 'spacer':
      return (
        <div style={{ height: (d.height as number) || 32, position: 'relative', background: 'repeating-linear-gradient(45deg, #F9FAFB 0, #F9FAFB 4px, transparent 4px, transparent 12px)' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D1D5DB', fontSize: 11, fontFamily: 'monospace' }}>
            {(d.height as number) || 32}px
          </div>
        </div>
      )
    case 'footer':
      return (
        <div style={{ background: '#F9FAFB', padding: '16px 32px', textAlign: 'center', borderTop: '1px solid #E5E7EB' }}>
          <div style={{ color: '#6B7280', fontSize: 12 }}>{(d.text as string) || ''}</div>
          {Boolean(d.address) && <div style={{ color: '#9CA3AF', fontSize: 11, marginTop: 2 }}>{String(d.address)}</div>}
          <div style={{ color: '#9CA3AF', fontSize: 11, marginTop: 4, textDecoration: 'underline' }}>
            {(d.unsubscribeText as string) || 'Abonnement kündigen'}
          </div>
        </div>
      )
    default:
      return null
  }
}

// ─────────────────────────────────────────────
// Sortable Block Item
// ─────────────────────────────────────────────
function SortableBlockItem({
  block,
  isSelected,
  onSelect,
  onDelete,
}: {
  block: Block
  isSelected: boolean
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1, position: 'relative' }}
    >
      <div
        onClick={() => onSelect(block.id)}
        style={{
          outline: isSelected ? '2px solid #0D1F6E' : '2px solid transparent',
          outlineOffset: -2,
          cursor: 'pointer',
          position: 'relative',
        }}
      >
        <BlockPreview block={block} />

        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          onClick={e => e.stopPropagation()}
          title="Ziehen um zu sortieren"
          style={{
            position: 'absolute',
            left: 4,
            top: '50%',
            transform: 'translateY(-50%)',
            cursor: 'grab',
            padding: 4,
            background: 'rgba(0,0,0,0.06)',
            borderRadius: 4,
            zIndex: 10,
            display: isSelected ? 'flex' : 'none',
            alignItems: 'center',
          }}
        >
          <GripVertical size={14} color="#9CA3AF" />
        </div>

        {/* Delete button */}
        {isSelected && (
          <button
            onClick={e => { e.stopPropagation(); onDelete(block.id) }}
            style={{
              position: 'absolute',
              right: 4,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(239,68,68,0.1)',
              border: 'none',
              borderRadius: 4,
              padding: 4,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              zIndex: 10,
            }}
          >
            <Trash2 size={14} color="#EF4444" />
          </button>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Block Palette (left panel)
// ─────────────────────────────────────────────
const BLOCK_DEFS: { type: BlockType; label: string; icon: React.ReactNode }[] = [
  { type: 'header', label: 'Header', icon: <Layout size={16} /> },
  { type: 'text', label: 'Text', icon: <Type size={16} /> },
  { type: 'image', label: 'Bild', icon: <ImageIcon size={16} /> },
  { type: 'button', label: 'Button', icon: <MousePointer2 size={16} /> },
  { type: 'divider', label: 'Trennlinie', icon: <Minus size={16} /> },
  { type: 'spacer', label: 'Abstand', icon: <MoveVertical size={16} /> },
  { type: 'footer', label: 'Footer', icon: <AlignJustify size={16} /> },
]

function BlockPalette({ onAdd }: { onAdd: (type: BlockType) => void }) {
  return (
    <div style={{ width: 160, borderRight: '1px solid #E5E7EB', background: '#FAFAFA', padding: 12, overflowY: 'auto', flexShrink: 0 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Blöcke</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {BLOCK_DEFS.map(({ type, label, icon }) => (
          <button
            key={type}
            onClick={() => onAdd(type)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 10px',
              background: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 13,
              color: '#374151',
              fontWeight: 500,
              textAlign: 'left',
              width: '100%',
            }}
          >
            <span style={{ color: '#6B7280' }}>{icon}</span>
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Block Settings Panel (right)
// ─────────────────────────────────────────────
function AlignButtons({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {(['left', 'center', 'right'] as const).map(a => (
        <button
          key={a}
          onClick={() => onChange(a)}
          style={{ flex: 1, padding: '5px 0', border: `1px solid ${value === a ? '#0D1F6E' : '#E5E7EB'}`, borderRadius: 6, background: value === a ? '#0D1F6E' : 'white', color: value === a ? 'white' : '#6B7280', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}
        >
          {a === 'left' ? <AlignLeft size={14} /> : a === 'center' ? <AlignCenter size={14} /> : <AlignRight size={14} />}
        </button>
      ))}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '7px 10px', border: '1px solid #E5E7EB', borderRadius: 7, fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
}

function BlockSettingsPanel({ block, onChange, onImageUpload }: { block: Block; onChange: (data: Record<string, unknown>) => void; onImageUpload: (blockId: string, file: File) => void }) {
  const d = block.data
  const set = (key: string, value: unknown) => onChange({ [key]: value })

  switch (block.type) {
    case 'header':
      return (
        <>
          <Field label="Titel"><input style={inputStyle} value={(d.title as string) || ''} onChange={e => set('title', e.target.value)} /></Field>
          <Field label="Untertitel"><input style={inputStyle} value={(d.subtitle as string) || ''} onChange={e => set('subtitle', e.target.value)} /></Field>
          <Field label="Hintergrund">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="color" value={(d.bgColor as string) || '#0D1F6E'} onChange={e => set('bgColor', e.target.value)} style={{ width: 40, height: 32, padding: 2, border: '1px solid #E5E7EB', borderRadius: 6, cursor: 'pointer' }} />
              <input style={{ ...inputStyle, flex: 1 }} value={(d.bgColor as string) || '#0D1F6E'} onChange={e => set('bgColor', e.target.value)} />
            </div>
          </Field>
          <Field label="Textfarbe">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="color" value={(d.textColor as string) || '#ffffff'} onChange={e => set('textColor', e.target.value)} style={{ width: 40, height: 32, padding: 2, border: '1px solid #E5E7EB', borderRadius: 6, cursor: 'pointer' }} />
              <input style={{ ...inputStyle, flex: 1 }} value={(d.textColor as string) || '#ffffff'} onChange={e => set('textColor', e.target.value)} />
            </div>
          </Field>
        </>
      )
    case 'text':
      return (
        <>
          <Field label="Ausrichtung"><AlignButtons value={(d.align as string) || 'left'} onChange={v => set('align', v)} /></Field>
          <Field label="Inhalt (HTML)">
            <textarea
              value={(d.content as string) || ''}
              onChange={e => set('content', e.target.value)}
              rows={10}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', fontSize: 12, lineHeight: 1.5 }}
            />
          </Field>
        </>
      )
    case 'image':
      return (
        <>
          <Field label="Bild hochladen">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', border: '1px dashed #D1D5DB', borderRadius: 8, cursor: 'pointer', fontSize: 13, color: '#6B7280', background: '#F9FAFB' }}>
              <Upload size={14} /> Bild auswählen
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && onImageUpload(block.id, e.target.files[0])} />
            </label>
          </Field>
          <Field label="Bild-URL"><input style={inputStyle} value={(d.src as string) || ''} onChange={e => set('src', e.target.value)} placeholder="https://..." /></Field>
          <Field label="Alt-Text"><input style={inputStyle} value={(d.alt as string) || ''} onChange={e => set('alt', e.target.value)} /></Field>
          <Field label="Link-URL"><input style={inputStyle} value={(d.link as string) || ''} onChange={e => set('link', e.target.value)} placeholder="https://..." /></Field>
          <Field label="Breite">
            <select value={(d.width as string) || '100%'} onChange={e => set('width', e.target.value)} style={inputStyle}>
              <option value="100%">100%</option>
              <option value="80%">80%</option>
              <option value="60%">60%</option>
              <option value="auto">Auto</option>
            </select>
          </Field>
        </>
      )
    case 'button':
      return (
        <>
          <Field label="Text"><input style={inputStyle} value={(d.text as string) || ''} onChange={e => set('text', e.target.value)} /></Field>
          <Field label="URL"><input style={inputStyle} value={(d.url as string) || ''} onChange={e => set('url', e.target.value)} placeholder="https://..." /></Field>
          <Field label="Hintergrund">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="color" value={(d.bgColor as string) || '#0D1F6E'} onChange={e => set('bgColor', e.target.value)} style={{ width: 40, height: 32, padding: 2, border: '1px solid #E5E7EB', borderRadius: 6, cursor: 'pointer' }} />
              <input style={{ ...inputStyle, flex: 1 }} value={(d.bgColor as string) || '#0D1F6E'} onChange={e => set('bgColor', e.target.value)} />
            </div>
          </Field>
          <Field label="Textfarbe">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="color" value={(d.textColor as string) || '#ffffff'} onChange={e => set('textColor', e.target.value)} style={{ width: 40, height: 32, padding: 2, border: '1px solid #E5E7EB', borderRadius: 6, cursor: 'pointer' }} />
              <input style={{ ...inputStyle, flex: 1 }} value={(d.textColor as string) || '#ffffff'} onChange={e => set('textColor', e.target.value)} />
            </div>
          </Field>
          <Field label="Ausrichtung"><AlignButtons value={(d.align as string) || 'center'} onChange={v => set('align', v)} /></Field>
          <Field label="Größe">
            <div style={{ display: 'flex', gap: 4 }}>
              {(['small', 'medium', 'large'] as const).map(s => (
                <button key={s} onClick={() => set('size', s)} style={{ flex: 1, padding: '5px 0', border: `1px solid ${d.size === s ? '#0D1F6E' : '#E5E7EB'}`, borderRadius: 6, background: d.size === s ? '#0D1F6E' : 'white', color: d.size === s ? 'white' : '#6B7280', cursor: 'pointer', fontSize: 12, fontWeight: 500 }}>
                  {s === 'small' ? 'S' : s === 'medium' ? 'M' : 'L'}
                </button>
              ))}
            </div>
          </Field>
        </>
      )
    case 'divider':
      return (
        <>
          <Field label="Farbe">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="color" value={(d.color as string) || '#E5E7EB'} onChange={e => set('color', e.target.value)} style={{ width: 40, height: 32, padding: 2, border: '1px solid #E5E7EB', borderRadius: 6, cursor: 'pointer' }} />
              <input style={{ ...inputStyle, flex: 1 }} value={(d.color as string) || '#E5E7EB'} onChange={e => set('color', e.target.value)} />
            </div>
          </Field>
          <Field label={`Stärke: ${(d.thickness as number) || 1}px`}>
            <input type="range" min={1} max={6} value={(d.thickness as number) || 1} onChange={e => set('thickness', Number(e.target.value))} style={{ width: '100%' }} />
          </Field>
          <Field label={`Abstand: ${(d.spacing as number) || 16}px`}>
            <input type="range" min={0} max={48} value={(d.spacing as number) || 16} onChange={e => set('spacing', Number(e.target.value))} style={{ width: '100%' }} />
          </Field>
        </>
      )
    case 'spacer':
      return (
        <Field label={`Höhe: ${(d.height as number) || 32}px`}>
          <input type="range" min={8} max={120} value={(d.height as number) || 32} onChange={e => set('height', Number(e.target.value))} style={{ width: '100%' }} />
        </Field>
      )
    case 'footer':
      return (
        <>
          <Field label="Footer-Text"><input style={inputStyle} value={(d.text as string) || ''} onChange={e => set('text', e.target.value)} /></Field>
          <Field label="Adresse"><input style={inputStyle} value={(d.address as string) || ''} onChange={e => set('address', e.target.value)} /></Field>
          <Field label="Abmelde-Text"><input style={inputStyle} value={(d.unsubscribeText as string) || ''} onChange={e => set('unsubscribeText', e.target.value)} /></Field>
        </>
      )
    default:
      return null
  }
}

// ─────────────────────────────────────────────
// Global Settings Panel (right, no block selected)
// ─────────────────────────────────────────────
function GlobalSettingsPanel({
  globalStyles,
  onGlobalStylesChange,
  previewText,
  onPreviewTextChange,
  lists,
  selectedListIds,
  onListToggle,
  testEmail,
  onTestEmailChange,
  onTestSend,
}: {
  globalStyles: GlobalStyles
  onGlobalStylesChange: (gs: GlobalStyles) => void
  previewText: string
  onPreviewTextChange: (v: string) => void
  lists: NLList[]
  selectedListIds: string[]
  onListToggle: (id: string) => void
  testEmail: string
  onTestEmailChange: (v: string) => void
  onTestSend: () => void
}) {
  const setStyle = (key: keyof GlobalStyles, value: string | number) =>
    onGlobalStylesChange({ ...globalStyles, [key]: value })

  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
        <Settings size={14} /> Kampagnen-Einstellungen
      </div>

      <Field label="Vorschautext">
        <input style={inputStyle} value={previewText} onChange={e => onPreviewTextChange(e.target.value)} placeholder="Kurze Vorschau im Postfach..." />
      </Field>

      <div style={{ height: 1, background: '#F3F4F6', margin: '14px 0' }} />
      <div style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Design</div>

      <Field label="Schriftart">
        <select value={globalStyles.fontFamily} onChange={e => setStyle('fontFamily', e.target.value)} style={inputStyle}>
          <option value="Arial, sans-serif">Arial</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="'Helvetica Neue', sans-serif">Helvetica Neue</option>
          <option value="Trebuchet MS, sans-serif">Trebuchet MS</option>
          <option value="Verdana, sans-serif">Verdana</option>
        </select>
      </Field>
      <Field label="Hintergrund">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="color" value={globalStyles.backgroundColor} onChange={e => setStyle('backgroundColor', e.target.value)} style={{ width: 40, height: 32, padding: 2, border: '1px solid #E5E7EB', borderRadius: 6, cursor: 'pointer' }} />
          <input style={{ ...inputStyle, flex: 1 }} value={globalStyles.backgroundColor} onChange={e => setStyle('backgroundColor', e.target.value)} />
        </div>
      </Field>
      <Field label="Inhalt-Hintergrund">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="color" value={globalStyles.contentBgColor} onChange={e => setStyle('contentBgColor', e.target.value)} style={{ width: 40, height: 32, padding: 2, border: '1px solid #E5E7EB', borderRadius: 6, cursor: 'pointer' }} />
          <input style={{ ...inputStyle, flex: 1 }} value={globalStyles.contentBgColor} onChange={e => setStyle('contentBgColor', e.target.value)} />
        </div>
      </Field>
      <Field label="Hauptfarbe">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="color" value={globalStyles.primaryColor} onChange={e => setStyle('primaryColor', e.target.value)} style={{ width: 40, height: 32, padding: 2, border: '1px solid #E5E7EB', borderRadius: 6, cursor: 'pointer' }} />
          <input style={{ ...inputStyle, flex: 1 }} value={globalStyles.primaryColor} onChange={e => setStyle('primaryColor', e.target.value)} />
        </div>
      </Field>

      <div style={{ height: 1, background: '#F3F4F6', margin: '14px 0' }} />
      <div style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Listen</div>

      {lists.length === 0 ? (
        <p style={{ fontSize: 13, color: '#9CA3AF' }}>Keine Listen vorhanden</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {lists.map(list => (
            <label key={list.id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={selectedListIds.includes(list.id)} onChange={() => onListToggle(list.id)} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{list.name}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>{list._count.subscribers} Abonnenten</div>
              </div>
            </label>
          ))}
        </div>
      )}

      <div style={{ height: 1, background: '#F3F4F6', margin: '14px 0' }} />
      <div style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Test-E-Mail</div>

      <Field label="E-Mail-Adresse">
        <input style={inputStyle} type="email" value={testEmail} onChange={e => onTestEmailChange(e.target.value)} placeholder="test@example.com" />
      </Field>
      <button
        onClick={onTestSend}
        disabled={!testEmail}
        style={{ width: '100%', padding: '8px 12px', border: '1px solid #0D1F6E', borderRadius: 8, background: 'white', color: '#0D1F6E', fontSize: 13, fontWeight: 600, cursor: testEmail ? 'pointer' : 'not-allowed', opacity: testEmail ? 1 : 0.5 }}
      >
        Test senden
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────
// Main NewsletterEditor
// ─────────────────────────────────────────────
export default function NewsletterEditor({
  campaignId,
  initialSubject = '',
  initialPreviewText = '',
  initialBlocks,
  initialGlobalStyles,
  initialListIds = [],
}: NewsletterEditorProps) {
  const router = useRouter()
  const [subject, setSubject] = useState(initialSubject)
  const [previewText, setPreviewText] = useState(initialPreviewText)
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks ?? defaultBlocks)
  const [globalStyles, setGlobalStyles] = useState<GlobalStyles>(initialGlobalStyles ?? defaultGlobalStyles)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [lists, setLists] = useState<NLList[]>([])
  const [selectedListIds, setSelectedListIds] = useState<string[]>(initialListIds)
  const [loading, setLoading] = useState(false)
  const [showSendModal, setShowSendModal] = useState(false)
  const [testEmail, setTestEmail] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  useEffect(() => {
    fetch('/api/admin/newsletter/lists').then(r => r.json()).then(data => setLists(Array.isArray(data) ? data : []))
  }, [])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setBlocks(prev => {
        const oldIndex = prev.findIndex(b => b.id === active.id)
        const newIndex = prev.findIndex(b => b.id === over.id)
        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }

  function addBlock(type: BlockType) {
    const newBlock = createBlock(type)
    setBlocks(prev => [...prev, newBlock])
    setSelectedBlockId(newBlock.id)
  }

  function deleteBlock(id: string) {
    setBlocks(prev => prev.filter(b => b.id !== id))
    if (selectedBlockId === id) setSelectedBlockId(null)
  }

  function updateBlock(id: string, data: Record<string, unknown>) {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, data: { ...b.data, ...data } } : b))
  }

  const handleImageUpload = useCallback(async (blockId: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) {
        updateBlock(blockId, { src: data.url })
        toast.success('Bild hochgeladen')
      }
    } catch {
      toast.error('Upload fehlgeschlagen')
    }
  }, [])

  async function save(send = false) {
    if (!subject.trim()) { toast.error('Bitte Betreff eingeben'); return }
    if (send && selectedListIds.length === 0) { toast.error('Bitte mindestens eine Liste auswählen'); return }
    setLoading(true)
    try {
      const html = renderNewsletter(blocks, globalStyles, { subject, previewText })
      const body = {
        subject,
        previewText,
        content: html,
        blocks,
        globalStyles,
        listIds: selectedListIds,
        send,
        status: send ? 'SENT' : 'DRAFT',
      }
      const url = campaignId
        ? `/api/admin/newsletter/campaigns/${campaignId}`
        : '/api/admin/newsletter/campaigns'
      const method = campaignId ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Fehler beim Speichern')
        return
      }
      if (send) {
        toast.success('Newsletter gesendet!')
        setShowSendModal(false)
        router.push('/admin/newsletter')
      } else {
        toast.success('Entwurf gespeichert')
        if (!campaignId && data.id) {
          router.replace(`/admin/newsletter/${data.id}/edit`)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  async function sendTestEmail() {
    if (!testEmail) return
    try {
      const html = renderNewsletter(blocks, globalStyles, { subject, previewText })
      const res = await fetch('/api/admin/newsletter/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail, subject, content: html }),
      })
      if (res.ok) toast.success('Test-E-Mail gesendet!')
      else toast.error('Fehler beim Senden')
    } catch {
      toast.error('Fehler beim Senden')
    }
  }

  const selectedBlock = blocks.find(b => b.id === selectedBlockId) ?? null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)', minHeight: 600 }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <Link href="/admin/newsletter" style={{ color: '#6B7280', display: 'flex', alignItems: 'center' }}>
          <ChevronLeft size={20} />
        </Link>
        <input
          value={subject}
          onChange={e => setSubject(e.target.value)}
          placeholder="Betreff der Kampagne eingeben..."
          style={{ flex: 1, padding: '9px 14px', border: '1px solid #E5E7EB', borderRadius: 9, fontSize: 15, fontFamily: 'inherit', outline: 'none', fontWeight: 500 }}
        />
        <button
          onClick={() => save(false)}
          disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', border: '1px solid #E5E7EB', borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: 'white', color: '#374151', whiteSpace: 'nowrap' }}
        >
          <Save size={14} />
          {loading ? '...' : 'Entwurf'}
        </button>
        <button
          onClick={() => setShowSendModal(true)}
          disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 20px', background: '#0D1F6E', color: 'white', border: 'none', borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          <Send size={14} /> Senden
        </button>
      </div>

      {/* 3-column editor */}
      <div style={{ display: 'flex', flex: 1, border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden', background: '#F9FAFB', minHeight: 0 }}>
        {/* Left: Block Palette */}
        <BlockPalette onAdd={addBlock} />

        {/* Center: Canvas */}
        <div
          style={{ flex: 1, padding: 24, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          onClick={e => { if (e.target === e.currentTarget) setSelectedBlockId(null) }}
        >
          <div style={{ width: '100%', maxWidth: 620 }}>
            <div style={{ marginBottom: 8, color: '#9CA3AF', fontSize: 11, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1 }}>
              600px Email-Vorschau
            </div>
            <div
              style={{ background: globalStyles.contentBgColor, borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}
              onClick={e => { if (e.target === e.currentTarget) setSelectedBlockId(null) }}
            >
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                  {blocks.map(block => (
                    <SortableBlockItem
                      key={block.id}
                      block={block}
                      isSelected={selectedBlockId === block.id}
                      onSelect={setSelectedBlockId}
                      onDelete={deleteBlock}
                    />
                  ))}
                </SortableContext>
              </DndContext>
              {blocks.length === 0 && (
                <div style={{ padding: 60, textAlign: 'center', color: '#9CA3AF', fontSize: 14 }}>
                  Klicke links auf einen Block-Typ um zu beginnen
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Settings */}
        <div style={{ width: 264, borderLeft: '1px solid #E5E7EB', background: 'white', overflowY: 'auto', padding: 16, flexShrink: 0 }}>
          {selectedBlock ? (
            <>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'space-between' }}>
                <span>{BLOCK_DEFS.find(b => b.type === selectedBlock.type)?.label || 'Block'}</span>
                <button onClick={() => setSelectedBlockId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: 11 }}>✕</button>
              </div>
              <BlockSettingsPanel
                block={selectedBlock}
                onChange={data => updateBlock(selectedBlock.id, data)}
                onImageUpload={handleImageUpload}
              />
            </>
          ) : (
            <GlobalSettingsPanel
              globalStyles={globalStyles}
              onGlobalStylesChange={setGlobalStyles}
              previewText={previewText}
              onPreviewTextChange={setPreviewText}
              lists={lists}
              selectedListIds={selectedListIds}
              onListToggle={id => setSelectedListIds(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id])}
              testEmail={testEmail}
              onTestEmailChange={setTestEmail}
              onTestSend={sendTestEmail}
            />
          )}
        </div>
      </div>

      {/* Send Modal */}
      {showSendModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 32, width: 420, maxWidth: '90vw' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: '#0F172A', margin: '0 0 8px' }}>Newsletter senden</h3>
            <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 20, margin: '0 0 20px' }}>
              Betreff: <strong>{subject || '(kein Betreff)'}</strong>
            </p>
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: '#374151' }}>An Listen senden:</p>
              {lists.length === 0 ? (
                <p style={{ fontSize: 13, color: '#9CA3AF' }}>Keine Listen vorhanden</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {lists.map(list => (
                    <label key={list.id} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={selectedListIds.includes(list.id)}
                        onChange={() => setSelectedListIds(prev => prev.includes(list.id) ? prev.filter(l => l !== list.id) : [...prev, list.id])}
                      />
                      <span style={{ fontSize: 14, color: '#374151' }}>{list.name}</span>
                      <span style={{ fontSize: 12, color: '#9CA3AF' }}>({list._count.subscribers})</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowSendModal(false)}
                style={{ padding: '9px 18px', border: '1px solid #E5E7EB', borderRadius: 9, cursor: 'pointer', background: 'white', fontSize: 14, fontWeight: 500 }}
              >
                Abbrechen
              </button>
              <button
                onClick={() => save(true)}
                disabled={loading || selectedListIds.length === 0}
                style={{ padding: '9px 20px', background: '#0D1F6E', color: 'white', border: 'none', borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: selectedListIds.length === 0 ? 'not-allowed' : 'pointer', opacity: selectedListIds.length === 0 ? 0.5 : 1 }}
              >
                {loading ? 'Senden...' : `Senden (${selectedListIds.length} Liste${selectedListIds.length !== 1 ? 'n' : ''})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
