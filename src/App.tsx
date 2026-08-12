import { useState, useCallback, useEffect } from 'react'
import type { Theme, View, Assignment, GradeEntry, Workout } from './types'
import { initialAssignments, initialCourses, initialGrades, initialWorkouts } from './data'
import Overview from './views/Overview'
import Assignments from './views/Assignments'
import Grades from './views/Grades'
import WorkoutView from './views/Workout'
import Calendar from './views/Calendar'

// — Icons —
const HomeIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)
const ListIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
    <circle cx="3" cy="6" r="1" fill="currentColor"/><circle cx="3" cy="12" r="1" fill="currentColor"/><circle cx="3" cy="18" r="1" fill="currentColor"/>
  </svg>
)
const ChartIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
)
const FitnessIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
  </svg>
)
const CalIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)
const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
)

const NAV_ITEMS: { id: View; label: string; icon: React.ReactNode; badge?: (a: Assignment[]) => number }[] = [
  { id: 'overview', label: 'Overview', icon: <HomeIcon /> },
  { id: 'assignments', label: 'Assignments', icon: <ListIcon />, badge: (a) => a.filter(x => x.status !== 'completed').length },
  { id: 'grades', label: 'Grades', icon: <ChartIcon /> },
  { id: 'workout', label: 'Fitness', icon: <FitnessIcon /> },
  { id: 'calendar', label: 'Calendar', icon: <CalIcon /> },
]

export default function App() {
  const [theme, setTheme] = useState<Theme>(() =>
    (localStorage.getItem('cjt-theme') as Theme) || 'dark'
  )
  const [view, setView] = useState<View>('overview')
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments)
  const [grades, setGrades] = useState<GradeEntry[]>(initialGrades)
  const [workouts, setWorkouts] = useState<Workout[]>(initialWorkouts)
  const [cursor, setCursor] = useState({ x: 0.4, y: 0.3 })
  const [navHovered, setNavHovered] = useState(false)

  const courses = initialCourses

  useEffect(() => { localStorage.setItem('cjt-theme', theme) }, [theme])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setCursor({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight })
  }, [])

  const isDark = theme === 'dark'

  const bg = isDark
    ? `radial-gradient(ellipse 90% 70% at ${cursor.x * 100}% ${cursor.y * 100}%, rgba(55,95,140,0.07) 0%, transparent 65%), linear-gradient(135deg, #0C0D14 0%, #0E1018 60%, #0C0F18 100%)`
    : `radial-gradient(ellipse 90% 70% at ${cursor.x * 100}% ${cursor.y * 100}%, rgba(77,127,168,0.06) 0%, transparent 65%), linear-gradient(135deg, #F0F4FB 0%, #EDF3FB 60%, #F2F0F8 100%)`

  const navBg = isDark
    ? 'rgba(15,17,26,0.75)'
    : 'rgba(240,244,251,0.8)'
  const navBorder = isDark
    ? '1px solid rgba(255,255,255,0.07)'
    : '1px solid rgba(200,215,245,0.7)'

  const text = isDark ? 'rgba(232,234,242,1)' : 'rgba(15,17,25,1)'
  const muted = isDark ? 'rgba(130,145,180,0.9)' : 'rgba(80,100,140,0.7)'

  const pendingCount = assignments.filter(a => a.status !== 'completed').length

  return (
    <div
      data-theme={theme}
      onMouseMove={handleMouseMove}
      style={{
        minHeight: '100vh', height: '100vh', display: 'flex', overflow: 'hidden',
        background: bg,
        transition: 'background-color 0.6s ease',
        color: text,
        fontFamily: 'Inter, sans-serif',
        position: 'relative',
      }}
    >
      {/* Atmospheric grain overlay */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        opacity: isDark ? 0.018 : 0.012,
        backgroundRepeat: 'repeat',
      }} />

      {/* Nav sidebar */}
      <nav
        onMouseEnter={() => setNavHovered(true)}
        onMouseLeave={() => setNavHovered(false)}
        style={{
          position: 'relative', zIndex: 10,
          width: navHovered ? 196 : 64,
          minHeight: '100vh',
          background: navBg,
          borderRight: navBorder,
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          display: 'flex', flexDirection: 'column',
          padding: '24px 0',
          transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* Logo mark */}
        <div style={{ padding: '0 16px 28px', display: 'flex', alignItems: 'center', gap: 12, overflow: 'hidden' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10, flexShrink: 0,
            background: isDark
              ? 'radial-gradient(circle at 35% 30%, rgba(130,175,220,0.9), rgba(77,127,168,0.5))'
              : 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95), rgba(130,170,220,0.7))',
            boxShadow: '0 2px 12px rgba(77,127,168,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke={isDark ? 'rgba(255,255,255,0.9)' : 'rgba(77,127,168,0.9)'} strokeWidth="1.5"/>
              <circle cx="12" cy="12" r="4" fill={isDark ? 'rgba(255,255,255,0.7)' : 'rgba(77,127,168,0.7)'}/>
            </svg>
          </div>
          {navHovered && (
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 14, fontWeight: 500, color: text, whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>
              Journey
            </span>
          )}
        </div>

        {/* Nav items */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, padding: '0 8px' }}>
          {NAV_ITEMS.map(item => {
            const active = view === item.id
            const badge = item.badge?.(assignments)
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                title={!navHovered ? item.label : undefined}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: active
                    ? (isDark ? 'rgba(77,127,168,0.18)' : 'rgba(77,127,168,0.1)')
                    : 'transparent',
                  color: active ? '#4D7FA8' : muted,
                  transition: 'all 0.15s ease',
                  textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden',
                  position: 'relative',
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(30,60,120,0.05)' }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                <span style={{ flexShrink: 0, display: 'flex' }}>{item.icon}</span>
                {navHovered && (
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: active ? 500 : 400 }}>
                    {item.label}
                  </span>
                )}
                {badge != null && badge > 0 && (
                  <span style={{
                    position: navHovered ? 'static' : 'absolute', top: 6, right: 6,
                    marginLeft: navHovered ? 'auto' : 0,
                    background: '#4D7FA8', color: '#fff', borderRadius: 10,
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 500,
                    padding: '1px 6px', minWidth: 18, textAlign: 'center',
                    lineHeight: '16px',
                  }}>{badge}</span>
                )}
              </button>
            )
          })}
        </div>

        {/* Theme toggle */}
        <div style={{ padding: '0 8px' }}>
          <button
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
              borderRadius: 10, border: 'none', cursor: 'pointer', width: '100%',
              background: 'transparent', color: muted, transition: 'all 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(30,60,120,0.05)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
          >
            <span style={{ flexShrink: 0, display: 'flex' }}>
              {isDark ? <SunIcon /> : <MoonIcon />}
            </span>
            {navHovered && (
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, whiteSpace: 'nowrap' }}>
                {isDark ? 'Light mode' : 'Dark mode'}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        {view === 'overview' && (
          <Overview
            isDark={isDark}
            assignments={assignments}
            courses={courses}
            grades={grades}
            workouts={workouts}
            onNavigate={(v) => setView(v as View)}
          />
        )}
        {view === 'assignments' && (
          <Assignments
            isDark={isDark}
            assignments={assignments}
            courses={courses}
            onChange={setAssignments}
          />
        )}
        {view === 'grades' && (
          <Grades
            isDark={isDark}
            courses={courses}
            grades={grades}
            onGradesChange={setGrades}
          />
        )}
        {view === 'workout' && (
          <WorkoutView
            isDark={isDark}
            workouts={workouts}
            onChange={setWorkouts}
          />
        )}
        {view === 'calendar' && (
          <Calendar
            isDark={isDark}
            assignments={assignments}
            courses={courses}
            workouts={workouts}
          />
        )}
      </main>
    </div>
  )
}
