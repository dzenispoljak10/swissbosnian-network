'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, MapPin, ExternalLink } from 'lucide-react'

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

function formatDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleDateString(locale === 'bs' ? 'hr' : 'de-CH', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })
}

export default function EventCalendar({ locale }: { locale: string }) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [popup, setPopup] = useState<{ event: CalendarEvent; x: number; y: number } | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Mobile detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Fetch events
  useEffect(() => {
    setLoading(true)
    fetch(`/api/public/events?year=${year}&month=${month}`)
      .then(r => r.json())
      .then((data: CalendarEvent[]) => { setEvents(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [year, month])

  // Close popup on outside click
  useEffect(() => {
    const handler = () => setPopup(null)
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
    setPopup(null)
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
    setPopup(null)
  }

  // Calendar grid
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
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
    setPopup({ event, x: rect.left, y: rect.bottom + 8 })
  }

  const eventTitle = (ev: CalendarEvent) =>
    locale === 'bs' && ev.titleBs ? ev.titleBs : ev.titleDe

  const monthLabel = formatMonthYear(year, month, locale)

  // ─── MOBILE VIEW ─────────────────────────────────────────────
  if (isMobile) {
    return (
      <div style={{ background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: 16, padding: 24, opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
        {/* Month nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <button
            onClick={prevMonth}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', color: '#374151' }}
            aria-label="Vorheriger Monat"
          >
            <ChevronLeft size={18} />
          </button>
          <span style={{ fontWeight: 700, fontSize: 18, color: '#0A0F1E', textTransform: 'capitalize' }}>{monthLabel}</span>
          <button
            onClick={nextMonth}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', color: '#374151' }}
            aria-label="Nächster Monat"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {events.length === 0 ? (
          <p style={{ color: '#9CA3AF', textAlign: 'center', padding: '32px 0', fontSize: 15 }}>
            Keine Events in diesem Monat
          </p>
        ) : (
          events.map(ev => (
            <div key={ev.id} style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, padding: 16, marginBottom: 12 }}>
              {ev.coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ev.coverImage} alt={eventTitle(ev)} style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }} />
              )}
              <div style={{ fontSize: 12, color: '#0D1F6E', fontWeight: 700, marginBottom: 4 }}>
                {new Date(ev.date).toLocaleDateString(locale === 'bs' ? 'hr' : 'de-CH', { weekday: 'short', day: 'numeric', month: 'long' })} — {formatTime(ev.date)} Uhr
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0A0F1E', marginBottom: 8 }}>{eventTitle(ev)}</div>
              {ev.location && (
                <div style={{ fontSize: 13, color: '#6B7280', display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                  <MapPin size={13} style={{ flexShrink: 0, marginTop: 2 }} /> {ev.location}
                </div>
              )}
              {ev.locationUrl && (
                <a href={ev.locationUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 10, fontSize: 13, fontWeight: 600, color: '#0D1F6E', textDecoration: 'none' }}>
                  <ExternalLink size={13} /> Maps öffnen
                </a>
              )}
            </div>
          ))
        )}
      </div>
    )
  }

  // ─── DESKTOP VIEW ─────────────────────────────────────────────
  return (
    <div style={{ background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: 16, padding: 32, opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
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
          {monthLabel}
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

      {/* Calendar grid — fixed cell heights, pills absolutely positioned */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', border: '1px solid #F3F4F6', borderRadius: 8, overflow: 'hidden' }}>
        {cells.map((date, i) => {
          const dayEvents = eventsOnDay(date)
          const current = isCurrentMonth(date)
          const todayCell = isToday(date)
          return (
            <div
              key={i}
              style={{
                height: 80,
                borderRight: (i + 1) % 7 === 0 ? 'none' : '1px solid #F3F4F6',
                borderBottom: i >= 35 ? 'none' : '1px solid #F3F4F6',
                background: '#ffffff',
                position: 'relative',
                overflow: 'visible',
              }}
            >
              {/* Day number — top centre */}
              <div style={{ position: 'absolute', top: 8, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: todayCell ? 26 : 'auto',
                  height: todayCell ? 26 : 'auto',
                  borderRadius: todayCell ? '50%' : undefined,
                  background: todayCell ? '#0D1F6E' : 'transparent',
                  color: todayCell ? '#ffffff' : current ? '#374151' : '#D1D5DB',
                  fontSize: 12,
                  fontWeight: current ? 500 : 400,
                }}>
                  {date.getDate()}
                </span>
              </div>

              {/* Event pills — absolutely at bottom */}
              {dayEvents.map((ev, evIdx) => (
                <button
                  key={ev.id}
                  onClick={(e) => handlePillClick(e, ev)}
                  style={{
                    position: 'absolute',
                    bottom: 4 + evIdx * 20,
                    left: 2,
                    right: 2,
                    fontSize: 10,
                    fontWeight: 600,
                    color: '#ffffff',
                    background: ev.color || '#0D1F6E',
                    borderRadius: 4,
                    padding: '2px 6px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    border: 'none',
                    textAlign: 'left',
                    zIndex: 10,
                  }}
                >
                  {eventTitle(ev)}
                </button>
              ))}
            </div>
          )
        })}
      </div>

      {/* Fixed popup */}
      {popup && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: 'fixed',
            left: Math.min(popup.x, typeof window !== 'undefined' ? window.innerWidth - 300 : popup.x),
            top: popup.y,
            zIndex: 1000,
            background: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: 12,
            padding: 20,
            width: 280,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }}
        >
          {popup.event.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={popup.event.coverImage}
              alt={eventTitle(popup.event)}
              style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }}
            />
          )}
          <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
            {formatDate(popup.event.date, locale)}
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0A0F1E', marginBottom: 8, lineHeight: 1.3 }}>
            {eventTitle(popup.event)}
          </div>
          {popup.event.location && (
            <div style={{ fontSize: 13, color: '#6B7280', display: 'flex', gap: 6, alignItems: 'flex-start' }}>
              <MapPin size={13} style={{ flexShrink: 0, marginTop: 2 }} />
              {popup.event.location}
            </div>
          )}
          {popup.event.locationUrl && (
            <a
              href={popup.event.locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 12, fontSize: 13, fontWeight: 600, color: '#0D1F6E', textDecoration: 'none' }}
            >
              <ExternalLink size={13} /> Auf Maps öffnen
            </a>
          )}
        </div>
      )}

      {/* Event list below calendar */}
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
