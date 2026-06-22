import { BookOpen, CheckCircle2, Clock3, ListTodo, Target } from 'lucide-react'
import type { DashboardSummary, Subject } from '../types/api'

type DashboardCardsProps = {
  dashboard: DashboardSummary
  subjects: Subject[]
}

function getReadableTextColor(backgroundColor: string) {
  const cleanColor = backgroundColor.replace('#', '')

  if (cleanColor.length !== 6) {
    return '#ffffff'
  }

  const red = Number.parseInt(cleanColor.slice(0, 2), 16)
  const green = Number.parseInt(cleanColor.slice(2, 4), 16)
  const blue = Number.parseInt(cleanColor.slice(4, 6), 16)
  const brightness = (red * 299 + green * 587 + blue * 114) / 1000

  return brightness > 150 ? '#111111' : '#ffffff'
}

export function DashboardCards({ dashboard, subjects }: DashboardCardsProps) {
  const visibleSubjects = subjects.slice(0, 5)
  const remainingSubjects = Math.max(subjects.length - visibleSubjects.length, 0)

  return (
    <section id="dashboard" className="metrics-grid">
      <article className="metric-card subjects-metric-card dashboard-area-subjects">
        <BookOpen size={22} />
        <span>Materias</span>
        <strong>{dashboard.total_subjects}</strong>
        <div className="dashboard-subjects">
          {visibleSubjects.map((subject) => (
            <span
              key={subject.id}
              style={{
                backgroundColor: subject.color,
                color: getReadableTextColor(subject.color),
              }}
            >
              {subject.name}
            </span>
          ))}
          {remainingSubjects > 0 && <span className="more-subjects">+{remainingSubjects}</span>}
          {!subjects.length && <small>Sin materias</small>}
        </div>
      </article>
      <article className="metric-card dashboard-area-pending">
        <ListTodo size={22} />
        <span>Tareas pendientes</span>
        <strong>{dashboard.pending_tasks}</strong>
      </article>
      <article className="metric-card dashboard-area-completed">
        <CheckCircle2 size={22} />
        <span>Tareas completadas</span>
        <strong>{dashboard.completed_tasks}</strong>
      </article>
      <article className="metric-card dashboard-area-task-progress">
        <CheckCircle2 size={22} />
        <span>Progreso tareas</span>
        <strong>{dashboard.progress_percentage}%</strong>
      </article>
      <article className="metric-card dashboard-area-minutes">
        <Clock3 size={22} />
        <span>Minutos estudiados</span>
        <strong>{dashboard.total_study_minutes}</strong>
      </article>
      <article className="metric-card dashboard-area-goals">
        <Target size={22} />
        <span>Progreso metas</span>
        <strong>{dashboard.goal_progress_percentage}%</strong>
      </article>
    </section>
  )
}
