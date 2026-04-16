'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, MapPin, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type CalendarEvent = {
  id: string
  titleDe: string
  titleBs: string | null
  descriptionDe: string | null
  descriptionBs: string | null
  date: string
  endDate: string | null
  location: string | null
  locationUrl: string | null
  coverImage: string | null
  color: string
}

const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

function formatMonthYear(year: number, month: number, locale: string) {
  return new Date(year, month, 1).toLocaleDateString(locale === 'bs' ? 'hr' : 'de-CH', {
    month: 'long',
    year: 'numeric',
  })
}

function formatEventDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleDateString(locale === 'bs' ? 'hr' : 'de-CH', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function EventCalendar({ locale }: { locale: string }) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [activeEvent, setActiveEvent] = useState<{ event: CalendarEvent; x: number; y: number } | null>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/public/events?year=${year}&month=${month}`)
      .then(r => r.json())
      .then((data: CalendarEvent[]) => { setEvents(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [year, month])

  // Close popup on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setActiveEvent(null)
      }
    }
    if (activeEvent) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [activeEvent])

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
    setActiveEvent(null)
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
    setActiveEvent(null)
  }

  // Build calendar grid (42 cells, Mon-first)
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  // Monday=0, Sunday=6
  let startOffset = firstDay.getDay() - 1
  if (startOffset < 0) startOffset = 6

  const cells: Date[] = []
  for (let i = 0; i < startOffset; i++) {
    cells.push(new Date(year, month, -startOffset + i + 1))
  }
  for (let d = 1; d <= lastDay.getDate(); d++) {
    cells.push(new Date(year, month, d))
  }
  while (cells.length < 42) {
    cells.push(new Date(year, month + 1, cells.length - lastDay.getDate() - startOffset + 1))
  }

  function eventsOnDay(date: Date) {
    return events.filter(ev => {
      const d = new Date(ev.date)
      return d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
    })
  }

  function isToday(date: Date) {
    return date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
  }

  function isCurrentMonth(date: Date) {
    return date.getMonth() === month && date.getFullYear() === year
  }

  function handlePillClick(e: React.MouseEvent, event: CalendarEvent) {
    e.stopPropagation()
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const containerRect = (e.currentTarget as HTMLElement).closest('[data-calendar]')?.getBoundingClientRect()
    if (!containerRect) return
    setActiveEvent({
      event,
      x: rect.left - containerRect.left,
      y: rect.bottom - containerRect.top + 4,
    })
  }

  const eventTitle = (ev: CalendarEvent) =>
    locale === 'bs' && ev.titleBs ? ev.titleBs : ev.titleDe
  const eventDesc = (ev: CalendarEvent) =>
    locale === 'bs' && ev.descriptionBs ? ev.descriptionBs : (ev.descriptionDe ?? null)

  return (
    <div style={{ background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: 16, padding: 32, position: 'relative' }} data-calendar="">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <button
          onClick={prevMonth}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 8, border: '1px solid #E5E7EB', background: '#ffffff', cursor: 'pointer', color: '#374151' }}
          aria-label="Vorheriger Monat"
        >
          <ChevronLeft size={18} />
        </button>
        <span style={{ fontSize: 18, fontWeight: 700, color: '#0A0F1E', textTransform: 'capitalize' }}>
          {formatMonthYear(year, month, locale)}
        </span>
        <button
          onClick={nextMonth}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 8, border: '1px solid #E5E7EB', background: '#ffffff', cursor: 'pointer', color: '#374151' }}
          aria-label="Nächster Monat"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Weekday headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 4 }}>
        {WEEKDAYS.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#9CA3AF', padding: '8px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', border: '1px solid #F3F4F6', borderRadius: 8, overflow: 'hidden', opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s' }}>
        {cells.map((date, i) => {
          const dayEvents = eventsOnDay(date)
          const current = isCurrentMonth(date)
          const todayCell = isToday(date)
          return (
            <div
              key={i}
              style={{
                minHeight: 80,
                padding: 8,
                borderRight: (i + 1) % 7 === 0 ? 'none' : '1px solid #F3F4F6',
                borderBottom: i >= 35 ? 'none' : '1px solid #F3F4F6',
                background: '#ffffff',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: todayCell ? 28 : 'auto',
                  height: todayCell ? 28 : 'auto',
                  borderRadius: todayCell ? '50%' : undefined,
                  background: todayCell ? '#0D1F6E' : 'transparent',
                  color: todayCell ? '#ffffff' : current ? '#374151' : '#D1D5DB',
                  fontSize: 13,
                  fontWeight: current ? 500 : 400,
                }}>
                  {date.getDate()}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {dayEvents.map(ev => (
                  <button
                    key={ev.id}
                    onClick={(e) => handlePillClick(e, ev)}
                    style={{
                      background: ev.color,
                      color: '#ffffff',
                      fontSize: 11,
                      fontWeight: 500,
                      borderRadius: 4,
                      padding: '2px 6px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '100%',
                      cursor: 'pointer',
                      border: 'none',
                      textAlign: 'left',
                      width: '100%',
                    }}
                  >
                    {eventTitle(ev)}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Event popup */}
      <AnimatePresence>
        {activeEvent && (
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              left: Math.min(activeEvent.x, window.innerWidth - 280),
              top: activeEvent.y,
              background: '#ffffff',
              border: '1px solid #E5E7EB',
              borderRadius: 12,
              padding: 16,
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              zIndex: 50,
              width: 240,
            }}
          >
            {activeEvent.event.coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={activeEvent.event.coverImage}
                alt={eventTitle(activeEvent.event)}
                style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }}
              />
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {formatEventDate(activeEvent.event.date, locale)}
              </div>
              <button onClick={() => setActiveEvent(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 0, lineHeight: 1 }}>
                <X size={14} />
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: activeEvent.event.color, flexShrink: 0 }} />
              <p style={{ fontSize: 15, fontWeight: 700, color: '#0A0F1E', margin: 0, lineHeight: 1.3 }}>
                {eventTitle(activeEvent.event)}
              </p>
            </div>
            {eventDesc(activeEvent.event) && (
              <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 8px', lineHeight: 1.5 }}>
                {eventDesc(activeEvent.event)}
              </p>
            )}
            {activeEvent.event.location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <MapPin size={12} style={{ color: '#9CA3AF', flexShrink: 0 }} />
                {activeEvent.event.locationUrl ? (
                  <a
                    href={activeEvent.event.locationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 13, color: '#0D1F6E', textDecoration: 'none', fontWeight: 500 }}
                  >
                    {activeEvent.event.location}
                  </a>
                ) : (
                  <span style={{ fontSize: 13, color: '#6B7280' }}>{activeEvent.event.location}</span>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      {events.length > 0 && (
        <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid #F3F4F6' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
            Kommende Events · {events.length}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {events.map(ev => (
              <div
                key={ev.id}
                style={{ padding: '10px 8px', borderBottom: '1px solid #F3F4F6', borderRadius: 8, cursor: 'default' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {ev.coverImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={ev.coverImage}
                    alt={eventTitle(ev)}
                    style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }}
                  />
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500, minWidth: 64 }}>
                    {new Date(ev.date).toLocaleDateString(locale === 'bs' ? 'hr' : 'de-CH', { day: 'numeric', month: 'short' })}
                  </span>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: ev.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#0A0F1E', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {eventTitle(ev)}
                  </span>
                  {ev.location && (
                    <span style={{ fontSize: 12, color: '#9CA3AF', whiteSpace: 'nowrap' }}>{ev.location}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
