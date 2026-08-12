import { useState } from 'react'
import type { Course, GradeEntry } from '../types'

interface Props {
  isDark: boolean
  courses: Course[]
  grades: GradeEntry[]
  onGradesChange: (g: GradeEntry[]) => void
}

const CATEGORIES = ['exam', 'quiz', 'assignment', 'project', 'lab'] as const
const EMPTY_GRADE = { courseId: '', name: '', category: 'assignment' as GradeEntry['category'], score: 0, maxScore: 100, date: new Date().toISOString().split('T')[0] }

function glass(isDark: boolean) {
  return {
    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.62)',
    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.8)',
    backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
    borderRadius: 16, boxShadow: isDark ? '0 4px 32px rgba(0,0,0,0.25)' : '0 4px 24px rgba(30,60,120,0.07)',
  }
}

function Sparkline({ values, color, isDark }: { values: number[]; color: string; isDark: boolean }) {
  if (values.length < 2) return null
  const w = 100, h = 32
  const min = Math.min(...values) - 5
  const max = Math.max(...values) + 5
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w
    const y = h - ((v - min) / (max - min)) * h
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      <circle cx={pts.split(' ').at(-1)!.split(',')[0]} cy={pts.split(' ').at(-1)!.split(',')[1]} r="3" fill={color} />
    </svg>
  )
}

export default function Grades({ isDark, courses, grades, onGradesChange }: Props) {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<{ courseId: string; name: string; category: GradeEntry['category']; score: number; maxScore: number; date: string }>({ ...EMPTY_GRADE, courseId: courses[0]?.id || '' })
  const [editId, setEditId] = useState<string | null>(null)

  const text = isDark ? 'rgba(232,234,242,1)' : 'rgba(15,17,25,1)'
  const muted = isDark ? 'rgba(140,155,190,1)' : 'rgba(80,100,140,0.7)'
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)'
  const inputBorder = isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(200,215,240,0.7)'

  const courseAvg = (cid: string) => {
    const cg = grades.filter(g => g.courseId === cid)
    if (!cg.length) return null
    return cg.reduce((s, g) => s + (g.score / g.maxScore) * 100, 0) / cg.length
  }

  const overallGPA = () => {
    if (!grades.length) return 0
    return grades.reduce((s, g) => s + (g.score / g.maxScore) * 100, 0) / grades.length
  }

  const courseGrades = (cid: string) => grades.filter(g => g.courseId === cid).sort((a, b) => a.date.localeCompare(b.date))

  const gradeColor = (pct: number) => {
    if (pct >= 90) return '#5E9E85'
    if (pct >= 80) return '#4D7FA8'
    if (pct >= 70) return '#B07D4E'
    return '#C0504A'
  }

  const openAdd = (courseId?: string) => {
    setForm({ ...EMPTY_GRADE, courseId: courseId || courses[0]?.id || '', date: new Date().toISOString().split('T')[0] })
    setEditId(null); setShowForm(true)
  }

  const openEdit = (g: GradeEntry) => {
    setForm({ courseId: g.courseId, name: g.name, category: g.category, score: g.score, maxScore: g.maxScore, date: g.date })
    setEditId(g.id); setShowForm(true)
  }

  const submit = () => {
    if (!form.name.trim() || !form.courseId) return
    if (editId) {
      onGradesChange(grades.map(g => g.id === editId ? { ...form, id: editId } : g))
    } else {
      onGradesChange([...grades, { ...form, id: crypto.randomUUID() }])
    }
    setShowForm(false)
  }

  const remove = (id: string) => onGradesChange(grades.filter(g => g.id !== id))

  const inputStyle = {
    background: inputBg, border: inputBorder, borderRadius: 10, padding: '8px 12px',
    color: text, fontFamily: 'Inter, sans-serif', fontSize: 13, outline: 'none',
    width: '100%', boxSizing: 'border-box' as const,
  }

  const displayedCourses = selectedCourse ? courses.filter(c => c.id === selectedCourse) : courses

  return (
    <div style={{ padding: '32px 36px', animation: 'fadeSlideIn 0.4s ease both' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <div>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: muted, letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>
            Semester average
          </p>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 34, fontWeight: 300, margin: '4px 0 0', color: text, letterSpacing: '-0.02em' }}>
            <span style={{ color: gradeColor(overallGPA()) }}>{overallGPA().toFixed(1)}%</span>
            <span style={{ fontSize: 20, fontWeight: 300, marginLeft: 12 }}>across {courses.length} courses</span>
          </h1>
        </div>
        <button onClick={() => openAdd()}
          style={{ padding: '10px 20px', borderRadius: 12, border: 'none', cursor: 'pointer', background: '#5E9E85', color: '#fff', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500, boxShadow: '0 4px 16px rgba(94,158,133,0.35)' }}>
          + Add grade
        </button>
      </div>

      {/* Course filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {[null, ...courses.map(c => c.id)].map(id => {
          const c = id ? courses.find(x => x.id === id) : null
          const active = selectedCourse === id
          return (
            <button key={id ?? 'all'} onClick={() => setSelectedCourse(id)}
              style={{
                padding: '5px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                background: active ? (c?.color || '#4D7FA8') : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(30,60,120,0.06)'),
                color: active ? '#fff' : muted, fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 500,
              }}>
              {c?.code ?? 'All courses'}
            </button>
          )
        })}
      </div>

      {/* Course cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 860 }}>
        {displayedCourses.map(course => {
          const avg = courseAvg(course.id)
          const cg = courseGrades(course.id)
          const trend = cg.map(g => (g.score / g.maxScore) * 100)
          const pct = avg ?? 0

          return (
            <div key={course.id} style={{ ...glass(isDark), padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: course.color }} />
                  <div>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: muted, letterSpacing: '0.1em' }}>{course.code}</span>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 500, color: text, margin: '2px 0 0' }}>{course.name}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  {trend.length >= 2 && <Sparkline values={trend} color={course.color} isDark={isDark} />}
                  <div style={{ textAlign: 'right' }}>
                    {avg !== null ? (
                      <>
                        <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 28, fontWeight: 500, color: gradeColor(pct) }}>{pct.toFixed(1)}%</span>
                        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: muted, margin: '1px 0 0' }}>
                          target {course.target}% · {pct >= course.target ? '✓ on track' : `${(course.target - pct).toFixed(1)}% gap`}
                        </p>
                      </>
                    ) : (
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: muted }}>No grades</span>
                    )}
                  </div>
                  <button onClick={() => openAdd(course.id)}
                    style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${course.color}40`, cursor: 'pointer', background: 'transparent', color: course.color, fontFamily: 'Inter, sans-serif', fontSize: 12 }}>
                    + Add
                  </button>
                </div>
              </div>

              {/* grade entries */}
              {cg.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {cg.map(g => {
                    const gpct = (g.score / g.maxScore) * 100
                    return (
                      <div key={g.id} style={{
                        display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', borderRadius: 10,
                        background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.5)',
                        border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(200,215,240,0.4)',
                      }}>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: text, flex: 1 }}>{g.name}</span>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: muted, textTransform: 'capitalize' }}>{g.category}</span>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: muted }}>{g.date}</span>
                        <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 15, fontWeight: 500, color: gradeColor(gpct), minWidth: 52, textAlign: 'right' }}>
                          {g.score}/{g.maxScore}
                        </span>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: gradeColor(gpct), minWidth: 40, textAlign: 'right' }}>
                          {gpct.toFixed(0)}%
                        </span>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button onClick={() => openEdit(g)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: muted, fontSize: 12, padding: 3 }}>✎</button>
                          <button onClick={() => remove(g.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: muted, fontSize: 14, padding: 3 }}>×</button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Modal */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(30,50,100,0.2)', backdropFilter: 'blur(8px)',
        }} onClick={() => setShowForm(false)}>
          <div onClick={e => e.stopPropagation()} style={{ ...glass(isDark), padding: '32px', width: 460, borderRadius: 20, animation: 'fadeSlideIn 0.2s ease both' }}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 400, color: text, margin: '0 0 20px' }}>
              {editId ? 'Edit grade' : 'New grade'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: muted, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Assessment name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} placeholder="Midterm Exam" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: muted, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Course</label>
                  <select value={form.courseId} onChange={e => setForm({ ...form, courseId: e.target.value })} style={{ ...inputStyle, appearance: 'none' }}>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.code}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: muted, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as GradeEntry['category'] })} style={{ ...inputStyle, appearance: 'none' }}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: muted, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Score</label>
                  <input type="number" value={form.score} onChange={e => setForm({ ...form, score: +e.target.value })} style={inputStyle} min="0" />
                </div>
                <div>
                  <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: muted, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Max score</label>
                  <input type="number" value={form.maxScore} onChange={e => setForm({ ...form, maxScore: +e.target.value })} style={inputStyle} min="1" />
                </div>
                <div>
                  <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: muted, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Grade</label>
                  <div style={{ ...inputStyle, color: gradeColor((form.score / form.maxScore) * 100), fontFamily: 'Outfit, sans-serif', fontSize: 15, fontWeight: 500 }}>
                    {((form.score / form.maxScore) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              <div>
                <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: muted, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Date</label>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={inputStyle} />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
                <button onClick={() => setShowForm(false)} style={{ padding: '10px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(30,60,120,0.07)', color: muted, fontFamily: 'Inter, sans-serif', fontSize: 13 }}>Cancel</button>
                <button onClick={submit} style={{ padding: '10px 22px', borderRadius: 10, border: 'none', cursor: 'pointer', background: '#5E9E85', color: '#fff', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500 }}>
                  {editId ? 'Save changes' : 'Add grade'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
