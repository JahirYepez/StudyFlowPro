import { CheckCircle2, RotateCcw } from 'lucide-react'
import type { Subject, Task } from '../types/api'

type DashboardTasksPanelProps = {
  title: string
  emptyMessage: string
  loading: boolean
  saving: boolean
  tasks: Task[]
  subjects: Subject[]
  actionLabel: string
  actionType: 'complete' | 'reopen'
  onToggleTaskCompleted: (task: Task) => void
}

function getPriorityLabel(priority: Task['priority']) {
  const labels = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
  }

  return labels[priority]
}

function getSubjectName(subjects: Subject[], subjectId: number) {
  return subjects.find((subject) => subject.id === subjectId)?.name ?? 'Sin materia'
}

function getSubjectColor(subjects: Subject[], subjectId: number) {
  return subjects.find((subject) => subject.id === subjectId)?.color ?? '#111111'
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

function formatTaskDate(value: string | null) {
  if (!value) {
    return ''
  }

  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}

export function DashboardTasksPanel({
  title,
  emptyMessage,
  loading,
  saving,
  tasks,
  subjects,
  actionLabel,
  actionType,
  onToggleTaskCompleted,
}: DashboardTasksPanelProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <h2>{title}</h2>
        <span>{loading ? 'Cargando...' : `${tasks.length} visibles`}</span>
      </div>

      <div className="task-list">
        {tasks.map((task) => {
          const subjectColor = getSubjectColor(subjects, task.subject_id)

          return (
            <article className="task-row dashboard-task-row" key={task.id}>
              <div className="row-main">
                <div className="task-title-line">
                  <strong>{task.title}</strong>
                  <span
                    className="subject-pill colored"
                    style={{
                      backgroundColor: subjectColor,
                      color: getReadableTextColor(subjectColor),
                    }}
                  >
                    {getSubjectName(subjects, task.subject_id)}
                  </span>
                </div>

                <small>
                  Prioridad {getPriorityLabel(task.priority)}
                  {task.due_date ? ` - vence ${formatTaskDate(task.due_date)}` : ''}
                </small>
                {task.description && <p className="row-description">{task.description}</p>}
              </div>

              <button
                className="dashboard-task-action"
                type="button"
                onClick={() => onToggleTaskCompleted(task)}
                disabled={saving}
              >
                {actionType === 'complete' ? <CheckCircle2 size={17} /> : <RotateCcw size={17} />}
                {actionLabel}
              </button>
            </article>
          )
        })}

        {!tasks.length && <p className="empty-state">{emptyMessage}</p>}
      </div>
    </section>
  )
}
