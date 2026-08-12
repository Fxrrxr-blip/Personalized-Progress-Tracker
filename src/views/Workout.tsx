import { useState } from 'react'
import type { Workout, Exercise } from '../types'

interface Props {
  isDark: boolean
  workouts: Workout[]
  onChange: (w: Workout[]) => void
}

type WorkoutForm = { name: string; type: Workout['type']; date: string; duration: number; exercises: Exercise[]; notes: string }
const EMPTY_WORKOUT: WorkoutForm = { name: '', type: 'strength', date: new Date().toISOString().split('T')[0], duration: 45, exercises: [], notes: '' }

function glass(isDark: boolean) {
  return {
    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.62)',
    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.8)',
    backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
    borderRadius: 16, boxShadow: isDark ? '0 4px 32px rgba(0,0,0,0.25)' : '0 4px 24px rgba(30,60,120,0.07)',
  }
}

function WeeklyRing({ count, isDark }: { count: number; isDark: boolean }) {
  const max = 7
  const pct = Math.min(count / max, 1)
  const r = 40, cx = 50, size = 100
  const circ = 2 * Math.PI * r
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke={isDark ? 'rgba(176,125,78,0.15)' : 'rgba(176,125,78,0.1)'} strokeWidth="5" />
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="#B07D4E" strokeWidth="5"
          strokeLinecap="round" strokeDasharray={`${circ * pct} ${circ}`}
          transform={`rotate(-90 ${cx} ${cx})`}
          style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 500, color: '#B07D4E', lineHeight: 1 }}>{count}</span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: isDark ? 'rgba(140,155,190,0.8)' : 'rgba(80,100,140,0.6)' }}>/ wk</span>
      </div>
    </div>
  )
}

export default function Workout({ isDark, workouts, onChange }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<WorkoutForm>(EMPTY_WORKOUT)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [editId, setEditId] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  const text = isDark ? 'rgba(232,234,242,1)' : 'rgba(15,17,25,1)'
  const muted = isDark ? 'rgba(140,155,190,1)' : 'rgba(80,100,140,0.7)'
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)'
  const inputBorder = isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(200,215,240,0.7)'

  const sorted = [...workouts].sort((a, b) => b.date.localeCompare(a.date))

  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7)
  const recentCount = workouts.filter(w => new Date(w.date) >= weekAgo).length

  const streak = (() => {
    let s = 0
    const dates = [...new Set(sorted.map(w => w.date))].sort((a, b) => b.localeCompare(a))
    let cursor = new Date(); cursor.setHours(0,0,0,0)
    for (const dateStr of dates) {
      const wd = new Date(dateStr); wd.setHours(0,0,0,0)
      const diff = Math.round((cursor.getTime() - wd.getTime()) / 86400000)
      if (diff <= 1) { s++; cursor = wd }
      else break
    }
    return s
  })()

  const totalVol = workouts.reduce((sum, w) =>
    sum + w.exercises.reduce((s, e) => s + (e.sets || 0) * (e.reps || 1) * (e.weight || 1), 0), 0
  )

  const inputStyle = {
    background: inputBg, border: inputBorder, borderRadius: 10, padding: '8px 12px',
    color: text, fontFamily: 'Inter, sans-serif', fontSize: 13, outline: 'none',
    width: '100%', boxSizing: 'border-box' as const,
  }

  const openAdd = () => {
    setForm({ ...EMPTY_WORKOUT, date: new Date().toISOString().split('T')[0], exercises: [] })
    setExercises([{ name: '', sets: 3, reps: 10 }])
    setEditId(null); setShowForm(true)
  }

  const openEdit = (w: Workout) => {
    const { id: _, exercises: ex, ...rest } = w
    setForm({ ...rest, exercises: ex }); setExercises(ex.map(e => ({ ...e })))
    setEditId(w.id); setShowForm(true)
  }

  const submit = () => {
    if (!form.name.trim()) return
    const filteredEx = exercises.filter(e => e.name.trim())
    if (editId) {
      onChange(workouts.map(w => w.id === editId ? { ...form, id: editId, exercises: filteredEx } : w))
    } else {
      onChange([...workouts, { ...form, id: crypto.randomUUID(), exercises: filteredEx }])
    }
    setShowForm(false)
  }

  const updateExercise = (i: number, field: keyof Exercise, value: string | number) => {
    setExercises(ex => ex.map((e, idx) => idx === i ? { ...e, [field]: value } : e))
  }

  const typeColor = (t: string) => ({ strength: '#B07D4E', cardio: '#C0504A', flexibility: '#5E9E85', sports: '#4D7FA8' })[t] || muted
  const typeLabel = (t: string) => ({ strength: 'Strength', cardio: 'Cardio', flexibility: 'Flexibility', sports: 'Sports' })[t] || t

  const daysAgo = (date: string) => {
    const diff = Math.round((new Date().setHours(0,0,0,0) - new Date(date).getTime()) / 86400000)
    if (diff === 0) return 'Today'
    if (diff === 1) return 'Yesterday'
    return `${diff}d ago`
  }

  return (
    <div style={{ padding: '32px 36px', animation: 'fadeSlideIn 0.4s ease both' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <div>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: muted, letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>
            {workouts.length} sessions logged
          </p>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 34, fontWeight: 300, margin: '4px 0 0', color: text, letterSpacing: '-0.02em' }}>
            Fitness
          </h1>
        </div>
        <button onClick={openAdd}
          style={{ padding: '10px 20px', borderRadius: 12, border: 'none', cursor: 'pointer', background: '#B07D4E', color: '#fff', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500, boxShadow: '0 4px 16px rgba(176,125,78,0.35)' }}>
          + Log workout
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 1fr', gap: 14, marginBottom: 24, maxWidth: 720 }}>
        <div style={{ ...glass(isDark), padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <WeeklyRing count={recentCount} isDark={isDark} />
        </div>
        {[
          { label: 'Streak', value: `${streak}d`, sub: 'current' },
          { label: 'Total sessions', value: workouts.length.toString(), sub: 'all time' },
          { label: 'Volume', value: (totalVol / 1000).toFixed(1) + 'k', sub: 'lbs · all time' },
        ].map(({ label, value, sub }) => (
          <div key={label} style={{ ...glass(isDark), padding: '20px 22px' }}>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: muted, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>{label}</p>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 28, fontWeight: 500, color: '#B07D4E' }}>{value}</span>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: muted, margin: '4px 0 0' }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Workout history */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 860 }}>
        {sorted.map(w => (
          <div key={w.id} style={{
            ...glass(isDark), overflow: 'hidden',
            borderLeft: `3px solid ${typeColor(w.type)}`,
          }}>
            <div
              style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
              onClick={() => setExpanded(expanded === w.id ? null : w.id)}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 500, color: text }}>{w.name}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: typeColor(w.type), textTransform: 'uppercase' }}>{typeLabel(w.type)}</span>
                </div>
                <div style={{ display: 'flex', gap: 14 }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: muted }}>{daysAgo(w.date)}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: muted }}>{w.duration} min</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: muted }}>{w.exercises.length} exercises</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button onClick={e => { e.stopPropagation(); openEdit(w) }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: muted, fontSize: 13, padding: '4px 6px', borderRadius: 6 }}>✎</button>
                <button onClick={e => { e.stopPropagation(); onChange(workouts.filter(x => x.id !== w.id)) }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: muted, fontSize: 16, padding: '4px 6px', borderRadius: 6 }}>×</button>
                <span style={{ color: muted, fontSize: 12, transform: expanded === w.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>▾</span>
              </div>
            </div>

            {expanded === w.id && (
              <div style={{ padding: '0 20px 16px', borderTop: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(200,215,240,0.4)' }}>
                {w.notes && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: muted, margin: '12px 0 10px', fontStyle: 'italic' }}>{w.notes}</p>}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 12 }}>
                  {w.exercises.map((ex, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '6px 0', borderBottom: i < w.exercises.length - 1 ? (isDark ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(200,215,240,0.3)') : 'none' }}>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: text, flex: 1 }}>{ex.name}</span>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: muted }}>
                        {ex.sets} × {ex.reps ? `${ex.reps} reps` : `${ex.duration} min`}
                        {ex.weight ? ` @ ${ex.weight} lbs` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(30,50,100,0.2)', backdropFilter: 'blur(8px)',
          overflowY: 'auto', padding: '20px 0',
        }} onClick={() => setShowForm(false)}>
          <div onClick={e => e.stopPropagation()} style={{ ...glass(isDark), padding: '32px', width: 520, borderRadius: 20, animation: 'fadeSlideIn 0.2s ease both', margin: 'auto' }}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 400, color: text, margin: '0 0 20px' }}>
              {editId ? 'Edit workout' : 'Log workout'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: muted, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Workout name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} placeholder="Upper Body, Leg Day…" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: muted, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as Workout['type'] })} style={{ ...inputStyle, appearance: 'none' }}>
                    <option value="strength">Strength</option>
                    <option value="cardio">Cardio</option>
                    <option value="flexibility">Flexibility</option>
                    <option value="sports">Sports</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: muted, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Date</label>
                  <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: muted, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Duration (min)</label>
                  <input type="number" value={form.duration} onChange={e => setForm({ ...form, duration: +e.target.value })} style={inputStyle} min="1" />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Exercises</label>
                  <button onClick={() => setExercises([...exercises, { name: '', sets: 3, reps: 10 }])}
                    style={{ padding: '3px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(30,60,120,0.07)', color: muted, fontFamily: 'Inter, sans-serif', fontSize: 11 }}>
                    + Add
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {exercises.map((ex, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 60px 60px 70px 30px', gap: 6, alignItems: 'center' }}>
                      <input value={ex.name} onChange={e => updateExercise(i, 'name', e.target.value)} style={{ ...inputStyle, fontSize: 12 }} placeholder="Exercise name" />
                      <input type="number" value={ex.sets} onChange={e => updateExercise(i, 'sets', +e.target.value)} style={{ ...inputStyle, fontSize: 12, textAlign: 'center' }} placeholder="Sets" min="1" />
                      <input type="number" value={ex.reps ?? ''} onChange={e => updateExercise(i, 'reps', +e.target.value)} style={{ ...inputStyle, fontSize: 12, textAlign: 'center' }} placeholder="Reps" min="1" />
                      <input type="number" value={ex.weight ?? ''} onChange={e => updateExercise(i, 'weight', +e.target.value)} style={{ ...inputStyle, fontSize: 12, textAlign: 'center' }} placeholder="lbs" min="0" />
                      <button onClick={() => setExercises(exercises.filter((_, j) => j !== i))}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: muted, fontSize: 16 }}>×</button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: muted, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Notes</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                  style={{ ...inputStyle, height: 60, resize: 'none' }} placeholder="How did it go?" />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
                <button onClick={() => setShowForm(false)} style={{ padding: '10px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(30,60,120,0.07)', color: muted, fontFamily: 'Inter, sans-serif', fontSize: 13 }}>Cancel</button>
                <button onClick={submit} style={{ padding: '10px 22px', borderRadius: 10, border: 'none', cursor: 'pointer', background: '#B07D4E', color: '#fff', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500 }}>
                  {editId ? 'Save changes' : 'Log workout'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
