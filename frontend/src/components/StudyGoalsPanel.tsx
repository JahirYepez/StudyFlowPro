import { Edit2, Trash2, X } from 'lucide-react'
import type { FormEvent } from 'react'
import type { StudyGoal, Subject } from '../types/api'

type StudyGoalForm = {
  title: string
  subject_id: string
  target_minutes: string
  deadline: string
}

type StudyGoalsPanelProps = {
  goals: StudyGoal[]
  totalGoals: number
  subjects: Subject[]
  saving: boolean
  goalForm: StudyGoalForm
  editingGoalId: number | null
  editingGoalForm: StudyGoalForm
  goalSubjectFilter: string
  onGoalFormChange: (form: StudyGoalForm) => void
  onEditingGoalFormChange: (form: StudyGoalForm) => void
  onGoalSubjectFilterChange: (subjectId: string) => void
  onCreateGoal: (event: FormEvent<HTMLFormElement>) => void
  onStartEditGoal: (goal: StudyGoal) => void
  onCancelEditGoal: () => void
  onUpdateGoal: (event: FormEvent<HTMLFormElement>) => void
  onDeleteGoal: (goalId: number) => void
  onUpdateGoalProgress: (goal: StudyGoal, nextProgress: number) => void
}

type DatePart = 'day' | 'month' | 'year'

const currentYear = new Date().getFullYear()
const deadlineYears = Array.from({ length: 21 }, (_, index) => String(currentYear + index))
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

function formatDate(value: string | null) {
  if (!value) {
    return 'Sin fecha limite'
  }

  const { day, month, year } = getDateParts(value)
  return `${day}/${month}/${year}`
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

type DeadlineSelectsProps = {
  value: string
  onChange: (value: string) => void
}

function DeadlineSelects({ value, onChange }: DeadlineSelectsProps) {
  const { day, month, year } = getDateParts(value)
  const yearForDays = year || String(currentYear)
  const monthForDays = month || '01'
  const dayOptions = Array.from(
    { length: getDaysInMonth(yearForDays, monthForDays) },
    (_, index) => String(index + 1).padStart(2, '0'),
  )

  return (
    <div className="goal-date-selects">
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
        <option value="">Anio</option>
        {deadlineYears.map((yearOption) => (
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

export function StudyGoalsPanel({
  goals,
  totalGoals,
  subjects,
  saving,
  goalForm,
  editingGoalId,
  editingGoalForm,
  goalSubjectFilter,
  onGoalFormChange,
  onEditingGoalFormChange,
  onGoalSubjectFilterChange,
  onCreateGoal,
  onStartEditGoal,
  onCancelEditGoal,
  onUpdateGoal,
  onDeleteGoal,
  onUpdateGoalProgress,
}: StudyGoalsPanelProps) {
  return (
    <section className="goals-view">
      <section className="panel">
        <div className="section-heading">
          <h2>Nueva meta</h2>
          <span>{subjects.length ? 'Define un objetivo medible' : 'Primero crea una materia'}</span>
        </div>

        <form className="goal-form" onSubmit={onCreateGoal}>
          <input
            placeholder="Titulo de la meta"
            value={goalForm.title}
            onChange={(event) => onGoalFormChange({ ...goalForm, title: event.target.value })}
            minLength={3}
            maxLength={140}
            required
          />

          <div className="goal-meta-selects">
            <select
              value={goalForm.subject_id}
              onChange={(event) => onGoalFormChange({ ...goalForm, subject_id: event.target.value })}
              required
            >
              <option value="">Materia</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Minutos objetivo"
              value={goalForm.target_minutes}
              onChange={(event) => onGoalFormChange({ ...goalForm, target_minutes: event.target.value })}
              min={1}
              max={60000}
              required
            />
          </div>

          <DeadlineSelects
            value={goalForm.deadline}
            onChange={(deadline) => onGoalFormChange({ ...goalForm, deadline })}
          />

          <button className="primary-button" type="submit" disabled={saving || !subjects.length}>
            Crear meta
          </button>
        </form>
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>Metas registradas</h2>
          <span>
            {goals.length} visibles de {totalGoals}
          </span>
        </div>

        <div className="session-toolbar">
          <select
            value={goalSubjectFilter}
            onChange={(event) => onGoalSubjectFilterChange(event.target.value)}
          >
            <option value="all">Todas las materias</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        <div className="list task-list-spaced">
          {goals.map((goal) => {
            const isEditing = editingGoalId === goal.id
            const subjectName = getSubjectName(subjects, goal.subject_id)
            const subjectColor = getSubjectColor(subjects, goal.subject_id)
            const progress = goal.progress_percentage

            return (
              <article className="list-row editable-row" key={goal.id}>
                {isEditing ? (
                  <form className="goal-edit-form" onSubmit={onUpdateGoal}>
                    <input
                      value={editingGoalForm.title}
                      onChange={(event) =>
                        onEditingGoalFormChange({
                          ...editingGoalForm,
                          title: event.target.value,
                        })
                      }
                      minLength={3}
                      maxLength={140}
                      required
                    />

                    <select
                      value={editingGoalForm.subject_id}
                      onChange={(event) =>
                        onEditingGoalFormChange({
                          ...editingGoalForm,
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

                    <input
                      type="number"
                      value={editingGoalForm.target_minutes}
                      onChange={(event) =>
                        onEditingGoalFormChange({
                          ...editingGoalForm,
                          target_minutes: event.target.value,
                        })
                      }
                      min={1}
                      max={60000}
                      required
                    />

                    <DeadlineSelects
                      value={editingGoalForm.deadline}
                      onChange={(deadline) =>
                        onEditingGoalFormChange({
                          ...editingGoalForm,
                          deadline,
                        })
                      }
                    />

                    <div className="row-actions goal-edit-actions">
                      <button className="small-action primary" type="submit" disabled={saving}>
                        Guardar
                      </button>
                      <button className="icon-action" type="button" onClick={onCancelEditGoal}>
                        <X size={17} />
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="row-main">
                      <div className="task-title-line">
                        <strong>{goal.title}</strong>
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

                      <small>{goal.target_minutes} min objetivo - {formatDate(goal.deadline)}</small>

                      <div className="goal-progress" aria-label={`Progreso ${progress}%`}>
                        <span style={{ width: `${progress}%` }} />
                      </div>
                      <div className="goal-progress-controls">
                        <button
                          className="small-action"
                          type="button"
                          disabled={saving || progress <= 0}
                          onClick={() => onUpdateGoalProgress(goal, progress - 5)}
                        >
                          -5%
                        </button>
                        <p className="row-description">{progress}% completado</p>
                        <button
                          className="small-action"
                          type="button"
                          disabled={saving || progress >= 100}
                          onClick={() => onUpdateGoalProgress(goal, progress + 5)}
                        >
                          +5%
                        </button>
                      </div>
                    </div>

                    <div className="row-actions">
                      <button
                        className="icon-action"
                        type="button"
                        onClick={() => onStartEditGoal(goal)}
                        aria-label={`Editar ${goal.title}`}
                      >
                        <Edit2 size={17} />
                      </button>
                      <button
                        className="icon-action danger"
                        type="button"
                        onClick={() => onDeleteGoal(goal.id)}
                        aria-label={`Eliminar ${goal.title}`}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </>
                )}
              </article>
            )
          })}

          {!goals.length && <p className="empty-state">No hay metas para mostrar.</p>}
        </div>
      </section>
    </section>
  )
}
