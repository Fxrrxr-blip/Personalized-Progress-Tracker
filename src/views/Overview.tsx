import { useState, useRef } from 'react'
import type { Assignment, Course, GradeEntry, Workout } from '../types'

interface Props {
  isDark: boolean
  assignments: Assignment[]
  courses: Course[]
  grades: GradeEntry[]
  workouts: Workout[]
  onNavigate: (v: string) => void
}

function JourneyCore({ isDark, ap, gp, fp }: { isDark: boolean; ap: number; gp: number; fp: number }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovering, setHovering] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const size = 220
  const cx = size / 2
  const r1 = 100, r2 = 84, r3 = 68, r4 = 52

  const arc = (r: number, p: number) => {
    const c = 2 * Math.PI * r
    return `${c * Math.max(0, Math.min(1, p))} ${c}`
  }

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const nx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
    const ny = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
    setTilt({ x: ny * -7, y: nx * 7 })
  }

  const glass = isDark
    ? 'radial-gradient(circle at 38% 30%, rgba(140,185,230,0.9), rgba(77,127,168,0.6) 55%, rgba(20,35,65,0.85))'
    : 'radial-gradient(circle at 38% 30%, rgba(255,255,255,0.97), rgba(160,200,235,0.75) 55%, rgba(77,127,168,0.45))'

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => { setHovering(false); setTilt({ x: 0, y: 0 }) }}
      style={{
        width: size, height: size, position: 'relative', cursor: 'default', userSelect: 'none',
        transform: `perspective(700px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: hovering ? 'transform 0.08s ease' : 'transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94)',
      }}
    >
      {/* ambient glow */}
      <div style={{
        position: 'absolute', inset: '-30%', borderRadius: '50%',
        background: isDark
          ? 'radial-gradient(circle, rgba(77,127,168,0.14) 0%, transparent 65%)'
          : 'radial-gradient(circle, rgba(77,127,168,0.09) 0%, transparent 65%)',
        filter: 'blur(24px)',
        animation: 'pulseSoft 4.5s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      {/* static track rings */}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: 'absolute', inset: 0 }}>
        {[r1, r2, r3, r4].map((r, i) => (
          <circle key={i} cx={cx} cy={cx} r={r} fill="none"
            stroke={isDark ? 'rgba(255,255,255,0.07)' : 'rgba(30,60,120,0.07)'}
            strokeWidth="1.5"
          />
        ))}
      </svg>

      {/* progress arcs */}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: 'absolute', inset: 0 }}>
        {/* assignment arc */}
        <circle cx={cx} cy={cx} r={r2} fill="none" stroke="#4D7FA8" strokeWidth="2.5"
          strokeLinecap="round" strokeDasharray={arc(r2, ap)} transform={`rotate(-90 ${cx} ${cx})`}
          style={{ transition: 'stroke-dasharray 1.4s cubic-bezier(0.4,0,0.2,1)' }}
        />
        {/* grade arc */}
        <circle cx={cx} cy={cx} r={r3} fill="none" stroke="#5E9E85" strokeWidth="2.5"
          strokeLinecap="round" strokeDasharray={arc(r3, gp)} transform={`rotate(-90 ${cx} ${cx})`}
          style={{ transition: 'stroke-dasharray 1.4s cubic-bezier(0.4,0,0.2,1) 0.1s' }}
        />
        {/* fitness arc */}
        <circle cx={cx} cy={cx} r={r4} fill="none" stroke="#B07D4E" strokeWidth="2.5"
          strokeLinecap="round" strokeDasharray={arc(r4, fp)} transform={`rotate(-90 ${cx} ${cx})`}
          style={{ transition: 'stroke-dasharray 1.4s cubic-bezier(0.4,0,0.2,1) 0.2s' }}
        />
      </svg>

      {/* slow outer orbital ring */}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
        style={{ position: 'absolute', inset: 0, animation: 'orbitSpin 40s linear infinite' }}
      >
        <circle cx={cx} cy={cx} r={r1} fill="none"
          stroke={isDark ? 'rgba(77,127,168,0.35)' : 'rgba(77,127,168,0.22)'}
          strokeWidth="1" strokeDasharray="4 18"
        />
      </svg>

      {/* inner slow ring */}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
        style={{ position: 'absolute', inset: 0, animation: 'orbitSpinReverse 25s linear infinite' }}
      >
        <circle cx={cx} cy={cx} r={r1 - 6} fill="none"
          stroke={isDark ? 'rgba(77,127,168,0.15)' : 'rgba(77,127,168,0.1)'}
          strokeWidth="1" strokeDasharray="2 28"
        />
      </svg>

      {/* core sphere */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 58, height: 58, borderRadius: '50%',
        background: glass,
        boxShadow: isDark
          ? '0 0 28px rgba(77,127,168,0.45), 0 0 56px rgba(77,127,168,0.15), inset 0 1px 2px rgba(255,255,255,0.35)'
          : '0 0 18px rgba(77,127,168,0.3), 0 0 36px rgba(77,127,168,0.1), inset 0 1px 2px rgba(255,255,255,0.9)',
      }}>
        <div style={{
          position: 'absolute', top: '14%', left: '18%',
          width: '36%', height: '28%', borderRadius: '50%',
          background: 'rgba(255,255,255,0.65)', filter: 'blur(4px)',
        }} />
      </div>

      {/* ring labels */}
      <div style={{ position: 'absolute', right: -72, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { color: '#4D7FA8', label: 'Tasks', pct: ap },
          { color: '#5E9E85', label: 'Grades', pct: gp },
          { color: '#B07D4E', label: 'Fitness', pct: fp },
        ].map(({ color, label, pct }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
              color: isDark ? 'rgba(200,210,230,0.65)' : 'rgba(30,50,90,0.55)',
              whiteSpace: 'nowrap',
            }}>{label} {Math.round(pct * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function glass(isDark: boolean, extra?: string) {
  const base = isDark
    ? 'rgba(255,255,255,0.04)'
    : 'rgba(255,255,255,0.62)'
  const border = isDark
    ? '1px solid rgba(255,255,255,0.08)'
    : '1px solid rgba(255,255,255,0.8)'
  return {
    background: base,
    border,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: 20,
    boxShadow: isDark
      ? '0 4px 32px rgba(0,0,0,0.25)'
      : '0 4px 24px rgba(30,60,120,0.07)',
    ...(extra ? {} : {}),
  }
}

export default function Overview({ isDark, assignments, courses, grades, workouts, onNavigate }: Props) {
  const completed = assignments.filter(a => a.status === 'completed').length
  const total = assignments.length
  const ap = total > 0 ? completed / total : 0

  const gp = grades.length > 0
    ? grades.reduce((s, g) => s + g.score / g.maxScore, 0) / grades.length
    : 0

  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7)
  const recentW = workouts.filter(w => new Date(w.date) >= weekAgo)
  const fp = Math.min(recentW.length / 5, 1)

  const avgGrade = gp * 100

  const today = new Date().toISOString().split('T')[0]
  const upcoming = assignments
    .filter(a => a.status !== 'completed' && a.dueDate >= today)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4)

  const courseAvg = (courseId: string) => {
    const cg = grades.filter(g => g.courseId === courseId)
    if (!cg.length) return null
    return Math.round(cg.reduce((s, g) => s + (g.score / g.maxScore) * 100, 0) / cg.length)
  }

  const priorityColor = (p: string) => {
    if (p === 'high') return '#C0504A'
    if (p === 'medium') return '#B07D4E'
    return isDark ? 'rgba(150,160,185,0.7)' : 'rgba(80,100,140,0.5)'
  }

  const daysUntil = (date: string) => {
    const diff = Math.ceil((new Date(date).getTime() - new Date().setHours(0,0,0,0)) / 86400000)
    if (diff === 0) return 'Today'
    if (diff === 1) return 'Tomorrow'
    if (diff < 0) return 'Overdue'
    return `${diff}d`
  }

  const lastWorkout = workouts.sort((a, b) => b.date.localeCompare(a.date))[0]

  const streak = (() => {
    let s = 0
    const sorted = [...workouts].sort((a, b) => b.date.localeCompare(a.date))
    let cursor = new Date(); cursor.setHours(0,0,0,0)
    for (const w of sorted) {
      const wd = new Date(w.date); wd.setHours(0,0,0,0)
      const diff = Math.round((cursor.getTime() - wd.getTime()) / 86400000)
      if (diff <= 1) { s++; cursor = wd }
      else break
    }
    return s
  })()

  const text = isDark ? 'rgba(232,234,242,1)' : 'rgba(15,17,25,1)'
  const muted = isDark ? 'rgba(140,155,190,1)' : 'rgba(80,100,140,0.7)'

  return (
    <div style={{ padding: '32px 36px', animation: 'fadeSlideIn 0.4s ease both' }}>
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: muted, letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 34, fontWeight: 300, margin: '4px 0 0', color: text, letterSpacing: '-0.02em' }}>
          Your Journey
        </h1>
      </div>

      {/* bento grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1.6fr) minmax(0,1fr)',
        gridTemplateRows: 'auto auto',
        gap: 16,
        maxWidth: 900,
      }}>
        {/* Journey Core card */}
        <div style={{ ...glass(isDark), padding: '36px 32px', display: 'flex', alignItems: 'center', gap: 40, gridRow: '1', gridColumn: '1' }}>
          <JourneyCore isDark={isDark} ap={ap} gp={gp} fp={fp} />
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, fontWeight: 500, color: muted, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 12px' }}>Journey Core</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Tasks completed', value: `${completed} / ${total}`, sub: `${Math.round(ap * 100)}%`, color: '#4D7FA8' },
                { label: 'Semester GPA', value: avgGrade.toFixed(1) + '%', sub: 'avg across courses', color: '#5E9E85' },
                { label: 'Weekly fitness', value: `${recentW.length} workouts`, sub: `${streak}d streak`, color: '#B07D4E' },
              ].map(({ label, value, sub, color }) => (
                <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: muted }}>{label}</span>
                    <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18, fontWeight: 500, color, letterSpacing: '-0.02em' }}>{value}</span>
                  </div>
                  <div style={{ height: 2, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(30,60,120,0.06)', borderRadius: 2, marginTop: 5 }}>
                    <div style={{ height: '100%', width: `${color === '#4D7FA8' ? ap * 100 : color === '#5E9E85' ? gp * 100 : fp * 100}%`, background: color, borderRadius: 2, transition: 'width 1.2s ease' }} />
                  </div>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: muted }}>{sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Today panel */}
        <div style={{ ...glass(isDark), padding: '24px', gridRow: '1', gridColumn: '2', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 13, fontWeight: 500, color: muted, margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Upcoming</p>
          {upcoming.length === 0 && (
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: muted, margin: 0 }}>All clear — nothing pending.</p>
          )}
          {upcoming.map(a => {
            const course = courses.find(c => c.id === a.course)
            return (
              <div key={a.id} style={{
                padding: '10px 12px', borderRadius: 12,
                background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.5)',
                border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(200,215,240,0.5)',
                cursor: 'pointer',
              }}
                onClick={() => onNavigate('assignments')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 500, color: text, lineHeight: 1.4, flex: 1, marginRight: 8 }}>{a.title}</span>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                    color: daysUntil(a.dueDate) === 'Overdue' ? '#C0504A' : daysUntil(a.dueDate) === 'Today' ? '#B07D4E' : muted,
                    whiteSpace: 'nowrap',
                  }}>{daysUntil(a.dueDate)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: course?.color || '#888', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: muted }}>{course?.code}</span>
                  <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: priorityColor(a.priority) }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Courses row */}
        <div style={{ gridRow: '2', gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
          {courses.map(course => {
            const avg = courseAvg(course.id)
            const diff = avg !== null ? avg - course.target : null
            return (
              <div key={course.id}
                onClick={() => onNavigate('grades')}
                style={{
                  ...glass(isDark),
                  padding: '18px 20px',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: course.color }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: muted }}>{course.code}</span>
                </div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500, color: text, margin: '0 0 8px', lineHeight: 1.3 }}>{course.name}</p>
                {avg !== null ? (
                  <>
                    <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 500, color: course.color }}>{avg}%</span>
                    {diff !== null && (
                      <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: diff >= 0 ? '#5E9E85' : '#C0504A', margin: '2px 0 0' }}>
                        {diff >= 0 ? '+' : ''}{diff}% target
                      </p>
                    )}
                  </>
                ) : (
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: muted }}>No grades yet</span>
                )}
              </div>
            )
          })}

          {/* Last workout mini card */}
          {lastWorkout && (
            <div
              onClick={() => onNavigate('workout')}
              style={{ ...glass(isDark), padding: '18px 20px', cursor: 'pointer', borderLeft: `3px solid #B07D4E` }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
            >
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: muted, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Last workout</p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500, color: text, margin: '0 0 4px' }}>{lastWorkout.name}</p>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#B07D4E' }}>{lastWorkout.duration}min · {lastWorkout.exercises.length} exercises</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
