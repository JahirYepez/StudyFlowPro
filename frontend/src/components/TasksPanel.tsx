import { CheckCircle2, Edit2, RotateCcw, Trash2, X } from 'lucide-react'
import type { FormEvent } from 'react'
import type { Subject, Task } from '../types/api'

type TaskForm = {
  title: string
  description: string
  subject_id: string
  priority: 'low' | 'medium' | 'high'
  due_date: string
}

type TaskPriorityFilter = 'all' | 'low' | 'medium' | 'high'
type DatePart = 'day' | 'month' | 'year'

type TasksPanelProps = {
  tasks: Task[]
  totalTasks: number
  subjects: Subject[]
  saving: boolean
  taskForm: TaskForm
  editingTaskId: number | null
  editingTaskForm: TaskForm
  taskSubjectFilter: string
  taskPriorityFilter: TaskPriorityFilter
  showPendingTasks: boolean
  showCompletedTasks: boolean
  onTaskFormChange: (form: TaskForm) => void
  onEditingTaskFormChange: (form: TaskForm) => void
  onTaskSubjectFilterChange: (subjectId: string) => void
  onTaskPriorityFilterChange: (priority: TaskPriorityFilter) => void
  onShowPendingTasksChange: (show: boolean) => void
  onShowCompletedTasksChange: (show: boolean) => void
  onCreateTask: (event: FormEvent<HTMLFormElement>) => void
  onStartEditTask: (task: Task) => void
  onCancelEditTask: () => void
  onUpdateTask: (event: FormEvent<HTMLFormElement>) => void
  onDeleteTask: (taskId: number) => void
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

const currentYear = new Date().getFullYear()
const yearOptions = Array.from({ length: 21 }, (_, index) => String(currentYear + index))
const monthOptions = [
  { value: '01', label: 'Enero' },
  { value: '02', label: 'Febrero' },
  { value: '03', label: 'Marzo' },
  { value: '04', label: 'Abril' },
  { value: '05', label: 'Mayo' },
  { value: '06', label: 'Junio' },
  { value: '07', label: 'Julio' },
  { value: '08', label: 'Agosto' },
  { value: '09', label: 'Septiembre' },
  { value: '10', label: 'Octubre' },
  { value: '11', label: 'Noviembre' },
  { value: '12', label: 'Diciembre' },
]

function getDateParts(value: string) {
  const [year = '', month = '', day = ''] = value ? value.split('-') : []

  return { day, month, year }
}

function getDaysInMonth(year: string, month: string) {
  return new Date(Number(year), Number(month), 0).getDate()
}

function buildDateValue(currentValue: string, part: DatePart, nextValue: string) {
  if (!nextValue) {
    return ''
  }

  const parts = getDateParts(currentValue)
  const year = part === 'year' ? nextValue : parts.year || String(currentYear)
  const month = part === 'month' ? nextValue : parts.month || '01'
  const maxDay = getDaysInMonth(year, month)
  const selectedDay = part === 'day' ? nextValue : parts.day || '01'
  const day = String(Math.min(Number(selectedDay), maxDay)).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function formatTaskDate(value: string | null) {
  if (!value) {
    return ''
  }

  const { day, month, year } = getDateParts(value)
  return `${day}/${month}/${year}`
}

type DateSelectsProps = {
  value: string
  onChange: (value: string) => void
}

function DateSelects({ value, onChange }: DateSelectsProps) {
  const { day, month, year } = getDateParts(value)
  const yearForDays = year || String(currentYear)
  const monthForDays = month || '01'
  const dayOptions = Array.from(
    { length: getDaysInMonth(yearForDays, monthForDays) },
    (_, index) => String(index + 1).padStart(2, '0'),
  )

  return (
    <div className="date-selects">
      <select value={day} onChange={(event) => onChange(buildDateValue(value, 'day', event.target.value))}>
        <option value="">Dia</option>
        {dayOptions.map((dayOption) => (
          <option key={dayOption} value={dayOption}>
            {dayOption}
          </option>
        ))}
      </select>

      <select
        value={month}
        onChange={(event) => onChange(buildDateValue(value, 'month', event.target.value))}
      >
        <option value="">Mes</option>
        {monthOptions.map((monthOption) => (
          <option key={monthOption.value} value={monthOption.value}>
            {monthOption.label}
          </option>
        ))}
      </select>

      <select value={year} onChange={(event) => onChange(buildDateValue(value, 'year', event.target.value))}>
        <option value="">Año</option>
        {yearOptions.map((yearOption) => (
          <option key={yearOption} value={yearOption}>
            {yearOption}
          </option>
        ))}
      </select>

      <button className="small-action" type="button" onClick={() => onChange('')} disabled={!value}>
        Sin fecha
      </button>
    </div>
  )
}

export function TasksPanel({
  tasks,
  totalTasks,
  subjects,
  saving,
  taskForm,
  editingTaskId,
  editingTaskForm,
  taskSubjectFilter,
  taskPriorityFilter,
  showPendingTasks,
  showCompletedTasks,
  onTaskFormChange,
  onEditingTaskFormChange,
  onTaskSubjectFilterChange,
  onTaskPriorityFilterChange,
  onShowPendingTasksChange,
  onShowCompletedTasksChange,
  onCreateTask,
  onStartEditTask,
  onCancelEditTask,
  onUpdateTask,
  onDeleteTask,
  onToggleTaskCompleted,
}: TasksPanelProps) {
  return (
    <>
      <section className="panel">
        <div className="section-heading">
          <h2>Nueva tarea</h2>
          <span>{subjects.length ? 'Asociala a una materia' : 'Primero crea una materia'}</span>
        </div>

        <form className="task-form task-form-wide" onSubmit={onCreateTask}>
          <input
            className="task-title-input"
            placeholder="Titulo de tarea"
            value={taskForm.title}
            onChange={(event) => onTaskFormChange({ ...taskForm, title: event.target.value })}
            minLength={3}
            required
          />

          <div className="task-meta-selects">
            <select
              value={taskForm.subject_id}
              onChange={(event) => onTaskFormChange({ ...taskForm, subject_id: event.target.value })}
              required
            >
              <option value="">Materia</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>

            <select
              value={taskForm.priority}
              onChange={(event) =>
                onTaskFormChange({
                  ...taskForm,
                  priority: event.target.value as TaskForm['priority'],
                })
              }
            >
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
            </select>
          </div>

          <DateSelects
            value={taskForm.due_date}
            onChange={(dueDate) => onTaskFormChange({ ...taskForm, due_date: dueDate })}
          />

          <textarea
            placeholder="Descripcion breve"
            value={taskForm.description}
            onChange={(event) => onTaskFormChange({ ...taskForm, description: event.target.value })}
            rows={3}
          />

          <button className="primary-button" type="submit" disabled={saving || !subjects.length}>
            Crear tarea
          </button>
        </form>
      </section>

      <section id="tasks" className="panel">
        <div className="section-heading">
          <h2>Tareas registradas</h2>
          <span>
            {tasks.length} visibles de {totalTasks}
          </span>
        </div>

        <div className="filter-bar">
          <div className="filter-selects">
            <select
              value={taskSubjectFilter}
              onChange={(event) => onTaskSubjectFilterChange(event.target.value)}
            >
              <option value="all">Todas las materias</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>

            <select
              value={taskPriorityFilter}
              onChange={(event) =>
                onTaskPriorityFilterChange(event.target.value as TaskPriorityFilter)
              }
            >
              <option value="all">Todas las prioridades</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
          </div>

          <div className="status-filter" aria-label="Filtrar por estado">
            <button
              className={showPendingTasks ? 'filter-chip active' : 'filter-chip'}
              type="button"
              onClick={() => onShowPendingTasksChange(!showPendingTasks)}
            >
              Pendientes
            </button>
            <button
              className={showCompletedTasks ? 'filter-chip active' : 'filter-chip'}
              type="button"
              onClick={() => onShowCompletedTasksChange(!showCompletedTasks)}
            >
              Completadas
            </button>
          </div>
        </div>

        <div className="task-list task-list-spaced">
          {tasks.map((task) => {
            const isEditing = editingTaskId === task.id
            const subjectName = getSubjectName(subjects, task.subject_id)
            const subjectColor = getSubjectColor(subjects, task.subject_id)

            return (
              <article
                className={task.completed ? 'task-row editable-row completed-row' : 'task-row editable-row'}
                key={task.id}
              >
                {isEditing ? (
                  <form className="task-edit-form" onSubmit={onUpdateTask}>
                    <input
                      value={editingTaskForm.title}
                      onChange={(event) =>
                        onEditingTaskFormChange({
                          ...editingTaskForm,
                          title: event.target.value,
                        })
                      }
                      minLength={3}
                      required
                    />

                    <select
                      value={editingTaskForm.subject_id}
                      onChange={(event) =>
                        onEditingTaskFormChange({
                          ...editingTaskForm,
                          subject_id: event.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Materia</option>
                      {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name}
                        </option>
                      ))}
                    </select>

                    <select
                      value={editingTaskForm.priority}
                      onChange={(event) =>
                        onEditingTaskFormChange({
                          ...editingTaskForm,
                          priority: event.target.value as TaskForm['priority'],
                        })
                      }
                    >
                      <option value="low">Baja</option>
                      <option value="medium">Media</option>
                      <option value="high">Alta</option>
                    </select>

                    <DateSelects
                      value={editingTaskForm.due_date}
                      onChange={(dueDate) =>
                        onEditingTaskFormChange({
                          ...editingTaskForm,
                          due_date: dueDate,
                        })
                      }
                    />

                    <textarea
                      value={editingTaskForm.description}
                      onChange={(event) =>
                        onEditingTaskFormChange({
                          ...editingTaskForm,
                          description: event.target.value,
                        })
                      }
                      rows={3}
                    />

                    <div className="row-actions task-edit-actions">
                      <button className="small-action primary" type="submit" disabled={saving}>
                        Guardar
                      </button>
                      <button className="icon-action" type="button" onClick={onCancelEditTask}>
                        <X size={17} />
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
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
                          {subjectName}
                        </span>
                      </div>
                      <small>
                        {task.completed ? 'Completada' : 'Pendiente'} - Prioridad{' '}
                        {getPriorityLabel(task.priority)}
                        {task.due_date ? ` - vence ${formatTaskDate(task.due_date)}` : ''}
                      </small>
                      {task.description && <p className="row-description">{task.description}</p>}
                    </div>

                    <div className="row-actions">
                      <button
                        className="icon-action"
                        type="button"
                        onClick={() => onToggleTaskCompleted(task)}
                        aria-label={
                          task.completed ? `Reabrir ${task.title}` : `Completar ${task.title}`
                        }
                      >
                        {task.completed ? <RotateCcw size={17} /> : <CheckCircle2 size={17} />}
                      </button>

                      <button
                        className="icon-action"
                        type="button"
                        onClick={() => onStartEditTask(task)}
                        aria-label={`Editar ${task.title}`}
                      >
                        <Edit2 size={17} />
                      </button>

                      <button
                        className="icon-action danger"
                        type="button"
                        onClick={() => onDeleteTask(task.id)}
                        aria-label={`Eliminar ${task.title}`}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </>
                )}
              </article>
            )
          })}

          {!tasks.length && <p className="empty-state">No hay tareas para los filtros seleccionados.</p>}
        </div>
      </section>
    </>
  )
}
