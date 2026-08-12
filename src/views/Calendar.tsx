import { useState } from 'react'
import type { Assignment, Course, Workout } from '../types'

interface Props {
  isDark: boolean
  assignments: Assignment[]
  courses: Course[]
  workouts: Workout[]
}

function glass(isDark: boolean) {
  return {
    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.62)',
    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.8)',
    backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
    borderRadius: 16, boxShadow: isDark ? '0 4px 32px rgba(0,0,0,0.25)' : '0 4px 24px rgba(30,60,120,0.07)',
  }
}

export default function Calendar({ isDark, assignments, courses, workouts }: Props) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const n = new Date()
    return new Date(n.getFullYear(), n.getMonth(), 1)
  })
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  const text = isDark ? 'rgba(232,234,242,1)' : 'rgba(15,17,25,1)'
  const muted = isDark ? 'rgba(140,155,190,1)' : 'rgba(80,100,140,0.7)'

  const today = new Date().toISOString().split('T')[0]
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDow = new Date(year, month, 1).getDay()
  const totalCells = Math.ceil((firstDow + daysInMonth) / 7) * 7

  const dateStr = (day: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  const eventsForDay = (ds: string) => {
    const items: { type: 'assignment' | 'workout'; label: string; color: string; id: string }[] = []
    assignments.filter(a => a.dueDate === ds).forEach(a => {
      const course = courses.find(c => c.id === a.course)
      items.push({ type: 'assignment', label: a.title, color: course?.color || '#4D7FA8', id: a.id })
    })
    workouts.filter(w => w.date === ds).forEach(w => {
      items.push({ type: 'workout', label: w.name, color: '#B07D4E', id: w.id })
    })
    return items
  }

  const selectedEvents = selectedDay ? eventsForDay(selectedDay) : []

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1))

  return (
    <div style={{ padding: '32px 36px', animation: 'fadeSlideIn 0.4s ease both' }}>
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: muted, letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>
          Timeline
        </p>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 34, fontWeight: 300, margin: '4px 0 0', color: text, letterSpacing: '-0.02em' }}>
          Calendar
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16, maxWidth: 900, alignItems: 'start' }}>
        {/* Calendar grid */}
        <div style={{ ...glass(isDark), padding: '24px' }}>
          {/* Month nav */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <button onClick={prevMonth}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: muted, fontSize: 18, padding: '4px 8px', borderRadius: 8 }}>
              ‹
            </button>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18, fontWeight: 400, color: text }}>
              {monthNames[month]} {year}
            </span>
            <button onClick={nextMonth}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: muted, fontSize: 18, padding: '4px 8px', borderRadius: 8 }}>
              ›
            </button>
          </div>

          {/* Day labels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
            {dayNames.map(d => (
              <div key={d} style={{ textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: muted, padding: '4px 0', letterSpacing: '0.05em' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Grid cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {Array.from({ length: totalCells }).map((_, i) => {
              const day = i - firstDow + 1
              const inMonth = day >= 1 && day <= daysInMonth
              const ds = inMonth ? dateStr(day) : null
              const events = ds ? eventsForDay(ds) : []
              const isToday = ds === today
              const isSelected = ds === selectedDay

              return (
                <div
                  key={i}
                  onClick={() => ds && setSelectedDay(isSelected ? null : ds)}
                  style={{
                    minHeight: 56, padding: '6px', borderRadius: 10, cursor: inMonth ? 'pointer' : 'default',
                    background: isSelected
                      ? (isDark ? 'rgba(77,127,168,0.18)' : 'rgba(77,127,168,0.1)')
                      : isToday
                      ? (isDark ? 'rgba(255,255,255,0.07)' : 'rgba(30,60,120,0.06)')
                      : 'transparent',
                    border: isToday
                      ? `1px solid ${isDark ? 'rgba(77,127,168,0.4)' : 'rgba(77,127,168,0.3)'}`
                      : isSelected
                      ? `1px solid rgba(77,127,168,0.5)`
                      : '1px solid transparent',
                    transition: 'background 0.15s ease',
                    opacity: inMonth ? 1 : 0.2,
                  }}
                >
                  <span style={{
                    fontFamily: isToday ? 'Outfit, sans-serif' : 'Inter, sans-serif',
                    fontSize: 13, fontWeight: isToday ? 600 : 400,
                    color: isToday ? '#4D7FA8' : inMonth ? text : muted,
                    display: 'block', marginBottom: 2,
                  }}>
                    {inMonth ? day : ''}
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {events.slice(0, 2).map((ev, j) => (
                      <div key={j} style={{
                        height: 4, borderRadius: 2, background: ev.color, opacity: 0.8,
                      }} />
                    ))}
                    {events.length > 2 && (
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, color: muted }}>+{events.length - 2}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 16, marginTop: 16, paddingTop: 16, borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(200,215,240,0.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 4, borderRadius: 2, background: '#4D7FA8' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: muted }}>Assignments</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 4, borderRadius: 2, background: '#B07D4E' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: muted }}>Workouts</span>
            </div>
          </div>
        </div>

        {/* Day detail panel */}
        <div style={{ ...glass(isDark), padding: '24px', minHeight: 200 }}>
          {selectedDay ? (
            <>
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: muted, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px' }}>Selected</p>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 17, fontWeight: 400, color: text, margin: '0 0 16px' }}>
                {new Date(selectedDay + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              {selectedEvents.length === 0 ? (
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: muted }}>Nothing scheduled.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {selectedEvents.map(ev => (
                    <div key={ev.id} style={{
                      padding: '10px 12px', borderRadius: 10,
                      background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.6)',
                      border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(200,215,240,0.5)',
                      borderLeft: `3px solid ${ev.color}`,
                    }}>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500, color: text, margin: 0 }}>{ev.label}</p>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: muted, textTransform: 'capitalize' }}>{ev.type}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: muted, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>This month</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: muted }}>Assignments due</span>
                  <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 15, fontWeight: 500, color: '#4D7FA8' }}>
                    {assignments.filter(a => a.dueDate.startsWith(`${year}-${String(month+1).padStart(2,'0')}`)).length}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: muted }}>Workouts logged</span>
                  <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 15, fontWeight: 500, color: '#B07D4E' }}>
                    {workouts.filter(w => w.date.startsWith(`${year}-${String(month+1).padStart(2,'0')}`)).length}
                  </span>
                </div>
              </div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: muted, marginTop: 20, lineHeight: 1.6 }}>
                Select a day to see its events.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
