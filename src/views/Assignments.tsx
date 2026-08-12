import { useState } from 'react'
import type { Assignment, Course } from '../types'

interface Props {
  isDark: boolean
  assignments: Assignment[]
  courses: Course[]
  onChange: (assignments: Assignment[]) => void
}

const EMPTY: Omit<Assignment, 'id'> = {
  title: '', course: 'cs301', dueDate: '', dueTime: '23:59',
  priority: 'medium', status: 'pending', notes: '',
}

function glass(isDark: boolean) {
  return {
    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.62)',
    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.8)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: 16,
    boxShadow: isDark ? '0 4px 32px rgba(0,0,0,0.25)' : '0 4px 24px rgba(30,60,120,0.07)',
  }
}

export default function Assignments({ isDark, assignments, courses, onChange }: Props) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all')
  const [priority, setPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<Assignment, 'id'>>(EMPTY)

  const text = isDark ? 'rgba(232,234,242,1)' : 'rgba(15,17,25,1)'
  const muted = isDark ? 'rgba(140,155,190,1)' : 'rgba(80,100,140,0.7)'
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)'
  const inputBorder = isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(200,215,240,0.7)'

  const filtered = assignments.filter(a => {
    if (filter !== 'all' && a.status !== filter) return false
    if (priority !== 'all' && a.priority !== priority) return false
    if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }).sort((a, b) => a.dueDate.localeCompare(b.dueDate))

  const toggle = (id: string) => {
    onChange(assignments.map(a => a.id === id
      ? { ...a, status: a.status === 'completed' ? 'pending' : 'completed' }
      : a
    ))
  }

  const remove = (id: string) => onChange(assignments.filter(a => a.id !== id))

  const openAdd = () => { setForm(EMPTY); setEditId(null); setShowForm(true) }
  const openEdit = (a: Assignment) => { const { id: _, ...rest } = a; setForm(rest); setEditId(a.id); setShowForm(true) }

  const submit = () => {
    if (!form.title.trim() || !form.dueDate) return
    if (editId) {
      onChange(assignments.map(a => a.id === editId ? { ...form, id: editId } : a))
    } else {
      onChange([...assignments, { ...form, id: crypto.randomUUID() }])
    }
    setShowForm(false)
  }

  const priorityColor = (p: string) => ({ high: '#C0504A', medium: '#B07D4E', low: isDark ? 'rgba(150,160,185,0.6)' : 'rgba(80,100,140,0.45)' })[p] || muted
  const statusColor = (s: string) => ({ completed: '#5E9E85', 'in-progress': '#4D7FA8', pending: muted })[s] || muted

  const daysUntil = (date: string) => {
    const diff = Math.ceil((new Date(date).getTime() - new Date().setHours(0,0,0,0)) / 86400000)
    if (diff === 0) return 'Today'
    if (diff === 1) return 'Tomorrow'
    if (diff < 0) return `${Math.abs(diff)}d ago`
    return `${diff}d`
  }

  const inputStyle = {
    background: inputBg, border: inputBorder, borderRadius: 10, padding: '8px 12px',
    color: text, fontFamily: 'Inter, sans-serif', fontSize: 13, outline: 'none',
    width: '100%', boxSizing: 'border-box' as const,
  }

  const btnStyle = (active: boolean, color?: string) => ({
    padding: '5px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
    fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 500,
    background: active ? (color || '#4D7FA8') : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(30,60,120,0.06)'),
    color: active ? '#fff' : muted,
    transition: 'all 0.15s ease',
  })

  return (
    <div style={{ padding: '32px 36px', animation: 'fadeSlideIn 0.4s ease both' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <div>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: muted, letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>
            {assignments.filter(a => a.status === 'completed').length} / {assignments.length} completed
          </p>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 34, fontWeight: 300, margin: '4px 0 0', color: text, letterSpacing: '-0.02em' }}>
            Assignments
          </h1>
        </div>
        <button
          onClick={openAdd}
          style={{
            padding: '10px 20px', borderRadius: 12, border: 'none', cursor: 'pointer',
            background: '#4D7FA8', color: '#fff', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500,
            boxShadow: '0 4px 16px rgba(77,127,168,0.35)', transition: 'transform 0.15s ease',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
        >
          + Add assignment
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search assignments…"
          style={{ ...inputStyle, width: 200 }}
        />
        <div style={{ display: 'flex', gap: 4, ...glass(isDark), padding: 4 }}>
          {(['all', 'pending', 'in-progress', 'completed'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={btnStyle(filter === f)}>
              {f === 'all' ? 'All' : f === 'in-progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4, ...glass(isDark), padding: 4 }}>
          {(['all', 'high', 'medium', 'low'] as const).map(p => (
            <button key={p} onClick={() => setPriority(p)} style={btnStyle(priority === p, priorityColor(p))}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Assignment list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 860 }}>
        {filtered.length === 0 && (
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: muted, textAlign: 'center', padding: '40px 0' }}>
            No assignments match your filters.
          </p>
        )}
        {filtered.map(a => {
          const course = courses.find(c => c.id === a.course)
          const done = a.status === 'completed'
          return (
            <div
              key={a.id}
              style={{
                ...glass(isDark),
                padding: '14px 18px',
                display: 'flex', alignItems: 'flex-start', gap: 14,
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                opacity: done ? 0.65 : 1,
              }}
              onMouseEnter={e => { if (!done) (e.currentTarget as HTMLElement).style.transform = 'translateX(3px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateX(0)' }}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggle(a.id)}
                style={{
                  width: 22, height: 22, borderRadius: 6, flexShrink: 0, cursor: 'pointer',
                  border: done ? 'none' : `1.5px solid ${priorityColor(a.priority)}`,
                  background: done ? '#5E9E85' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s ease', marginTop: 1,
                }}
              >
                {done && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                    <polyline points="2,6 5,9 10,3" />
                  </svg>
                )}
              </button>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{
                    fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 500, color: text,
                    textDecoration: done ? 'line-through' : 'none',
                  }}>{a.title}</span>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                      color: daysUntil(a.dueDate) === 'Today' ? '#B07D4E' : daysUntil(a.dueDate).includes('ago') ? '#C0504A' : muted
                    }}>{daysUntil(a.dueDate)}</span>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: priorityColor(a.priority) }} />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: course?.color || '#888' }} />
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: muted }}>{course?.code}</span>
                  </div>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: statusColor(a.status) }}>
                    {a.status === 'in-progress' ? 'In progress' : a.status}
                  </span>
                  {a.notes && <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{a.notes}</span>}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => openEdit(a)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: muted, padding: 4, borderRadius: 6, fontSize: 12 }}>
                  ✎
                </button>
                <button onClick={() => remove(a.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: muted, padding: 4, borderRadius: 6, fontSize: 14 }}>
                  ×
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(30,50,100,0.2)',
          backdropFilter: 'blur(8px)',
        }} onClick={() => setShowForm(false)}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              ...glass(isDark), padding: '32px', width: 480, borderRadius: 20,
              animation: 'fadeSlideIn 0.2s ease both',
            }}
          >
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 400, color: text, margin: '0 0 20px' }}>
              {editId ? 'Edit assignment' : 'New assignment'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: muted, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Title</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} placeholder="Assignment title" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: muted, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Course</label>
                  <select value={form.course} onChange={e => setForm({ ...form, course: e.target.value })}
                    style={{ ...inputStyle, appearance: 'none' }}>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.code}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: muted, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Priority</label>
                  <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as Assignment['priority'] })}
                    style={{ ...inputStyle, appearance: 'none' }}>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: muted, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Due date</label>
                  <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: muted, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Due time</label>
                  <input type="time" value={form.dueTime} onChange={e => setForm({ ...form, dueTime: e.target.value })} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: muted, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Assignment['status'] })}
                  style={{ ...inputStyle, appearance: 'none' }}>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: muted, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Notes</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                  style={{ ...inputStyle, height: 70, resize: 'none' }} placeholder="Optional notes…" />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
                <button onClick={() => setShowForm(false)} style={{ ...btnStyle(false), padding: '10px 18px' }}>Cancel</button>
                <button onClick={submit} style={{ padding: '10px 22px', borderRadius: 10, border: 'none', cursor: 'pointer', background: '#4D7FA8', color: '#fff', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500 }}>
                  {editId ? 'Save changes' : 'Add assignment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
