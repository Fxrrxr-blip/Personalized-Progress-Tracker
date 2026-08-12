import type { Assignment, Course, GradeEntry, Workout } from './types'

const today = new Date()
const d = (offset: number) => {
  const dt = new Date(today)
  dt.setDate(dt.getDate() + offset)
  return dt.toISOString().split('T')[0]
}

export const initialCourses: Course[] = [
  { id: 'cs301', name: 'Algorithms', code: 'CS 301', color: '#4D7FA8', target: 90 },
  { id: 'math241', name: 'Linear Algebra', code: 'MATH 241', color: '#7B68A8', target: 85 },
  { id: 'eng210', name: 'Technical Writing', code: 'ENG 210', color: '#B07D4E', target: 88 },
  { id: 'phys212', name: 'Mechanics', code: 'PHYS 212', color: '#5E9E85', target: 82 },
  { id: 'cs385', name: 'Software Engineering', code: 'CS 385', color: '#9E6E7B', target: 92 },
]

export const initialAssignments: Assignment[] = [
  { id: 'a1', title: 'Algorithm Analysis — Assignment 3', course: 'cs301', dueDate: d(2), dueTime: '23:59', priority: 'high', status: 'pending', notes: 'Cover dynamic programming & greedy algorithms' },
  { id: 'a2', title: 'Linear Algebra Problem Set 8', course: 'math241', dueDate: d(5), dueTime: '23:59', priority: 'medium', status: 'in-progress', notes: 'Eigenvalues and eigenvectors chapter' },
  { id: 'a3', title: 'Technical Writing Draft 2', course: 'eng210', dueDate: d(-1), dueTime: '17:00', priority: 'high', status: 'completed', notes: 'Revised introduction and methodology' },
  { id: 'a4', title: 'Physics Lab Report: Pendulum', course: 'phys212', dueDate: d(3), dueTime: '23:59', priority: 'medium', status: 'pending', notes: 'Include error analysis and uncertainty' },
  { id: 'a5', title: 'Software Architecture Diagrams', course: 'cs385', dueDate: d(8), dueTime: '23:59', priority: 'low', status: 'pending', notes: 'UML class + sequence diagrams for group project' },
  { id: 'a6', title: 'Midterm Exam Review Guide', course: 'cs301', dueDate: d(11), dueTime: '09:00', priority: 'high', status: 'pending', notes: 'Chapters 5–9, focus on graph algorithms' },
  { id: 'a7', title: 'Sprint 2 Group Presentation', course: 'cs385', dueDate: d(-3), dueTime: '14:00', priority: 'high', status: 'completed', notes: 'Demo day — all features live' },
  { id: 'a8', title: 'Mechanics Problem Set 5', course: 'phys212', dueDate: d(-5), dueTime: '23:59', priority: 'medium', status: 'completed', notes: 'Torque and rotational motion' },
]

export const initialGrades: GradeEntry[] = [
  { id: 'g1', courseId: 'cs301', name: 'Midterm Exam', category: 'exam', score: 88, maxScore: 100, date: d(-30) },
  { id: 'g2', courseId: 'cs301', name: 'Assignment 1', category: 'assignment', score: 95, maxScore: 100, date: d(-45) },
  { id: 'g3', courseId: 'cs301', name: 'Quiz 3', category: 'quiz', score: 42, maxScore: 50, date: d(-14) },
  { id: 'g4', courseId: 'math241', name: 'Midterm Exam', category: 'exam', score: 79, maxScore: 100, date: d(-28) },
  { id: 'g5', courseId: 'math241', name: 'Problem Set 7', category: 'assignment', score: 47, maxScore: 50, date: d(-7) },
  { id: 'g6', courseId: 'eng210', name: 'Essay 1', category: 'assignment', score: 91, maxScore: 100, date: d(-21) },
  { id: 'g7', courseId: 'eng210', name: 'Presentation', category: 'project', score: 87, maxScore: 100, date: d(-10) },
  { id: 'g8', courseId: 'phys212', name: 'Lab Report 3', category: 'lab', score: 38, maxScore: 50, date: d(-5) },
  { id: 'g9', courseId: 'phys212', name: 'Quiz 2', category: 'quiz', score: 22, maxScore: 30, date: d(-12) },
  { id: 'g10', courseId: 'cs385', name: 'Sprint 1 Review', category: 'project', score: 93, maxScore: 100, date: d(-15) },
  { id: 'g11', courseId: 'cs385', name: 'Architecture Quiz', category: 'quiz', score: 18, maxScore: 20, date: d(-8) },
]

export const initialWorkouts: Workout[] = [
  {
    id: 'w1', date: d(-1), name: 'Upper Body Power', type: 'strength', duration: 55,
    exercises: [
      { name: 'Bench Press', sets: 4, reps: 8, weight: 155 },
      { name: 'Pull-ups', sets: 3, reps: 10 },
      { name: 'Shoulder Press', sets: 3, reps: 10, weight: 105 },
      { name: 'Tricep Dips', sets: 3, reps: 12 },
    ],
    notes: 'Felt strong — PR on shoulder press'
  },
  {
    id: 'w2', date: d(-3), name: 'Leg Day', type: 'strength', duration: 60,
    exercises: [
      { name: 'Back Squat', sets: 4, reps: 6, weight: 225 },
      { name: 'Romanian Deadlift', sets: 3, reps: 8, weight: 185 },
      { name: 'Leg Press', sets: 3, reps: 12, weight: 320 },
      { name: 'Calf Raises', sets: 4, reps: 15, weight: 135 },
    ],
    notes: ''
  },
  {
    id: 'w3', date: d(-5), name: 'Full Body HIIT', type: 'cardio', duration: 35,
    exercises: [
      { name: 'Burpees', sets: 4, reps: 15 },
      { name: 'Box Jumps', sets: 3, reps: 12 },
      { name: 'Battle Ropes', sets: 4, duration: 1 },
    ],
    notes: 'Intense — heart rate peaked at 178bpm'
  },
  {
    id: 'w4', date: d(-6), name: 'Morning Run', type: 'cardio', duration: 40,
    exercises: [{ name: '5K Run', sets: 1, duration: 28 }],
    notes: 'Consistent pace, 5:36/km'
  },
  {
    id: 'w5', date: d(-9), name: 'Push / Pull', type: 'strength', duration: 65,
    exercises: [
      { name: 'Deadlift', sets: 4, reps: 5, weight: 275 },
      { name: 'Push Press', sets: 3, reps: 8, weight: 115 },
      { name: 'Bent-over Row', sets: 4, reps: 8, weight: 145 },
    ],
    notes: 'New deadlift PR at 275 lbs'
  },
]
