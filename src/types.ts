export type Theme = 'light' | 'dark'
export type View = 'overview' | 'assignments' | 'grades' | 'workout' | 'calendar'

export interface Assignment {
  id: string
  title: string
  course: string
  dueDate: string
  dueTime: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in-progress' | 'completed'
  notes: string
}

export interface Course {
  id: string
  name: string
  code: string
  color: string
  target: number
}

export interface GradeEntry {
  id: string
  courseId: string
  name: string
  category: 'exam' | 'quiz' | 'assignment' | 'project' | 'lab'
  score: number
  maxScore: number
  date: string
}

export interface Exercise {
  name: string
  sets: number
  reps?: number
  weight?: number
  duration?: number
}

export interface Workout {
  id: string
  date: string
  name: string
  type: 'strength' | 'cardio' | 'flexibility' | 'sports'
  exercises: Exercise[]
  notes: string
  duration: number
}
