import { Edit2, Trash2, X } from 'lucide-react'
import type { FormEvent } from 'react'
import type { StudySession, Subject } from '../types/api'

type StudySessionForm = {
  subject_id: string
  duration_minutes: string
  session_date: string
  notes: string
}

type StudySessionsPanelProps = {
  sessions: StudySession[]
  totalSessions: number
  subjects: Subject[]
  saving: boolean
  sessionForm: StudySessionForm
  editingSessionId: string | null
  editingSessionForm: StudySessionForm
  sessionSubjectFilter: string
  onSessionFormChange: (form: StudySessionForm) => void
  onEditingSessionFormChange: (form: StudySessionForm) => void
  onSessionSubjectFilterChange: (subjectId: string) => void
  onCreateSession: (event: FormEvent<HTMLFormElement>) => void
  onStartEditSession: (session: StudySession) => void
  onCancelEditSession: () => void
  onUpdateSession: (event: FormEvent<HTMLFormElement>) => void
  onDeleteSession: (sessionId: string) => void
}

type DatePart = 'day' | 'month' | 'year'

const currentYear = new Date().getFullYear()
const sessionYearOptions = Array.from({ length: 3 }, (_, index) => String(currentYear - index))
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

function formatSessionDate(value: string) {
  const { day, month, year } = getDateParts(value)
  return `${day}/${month}/${year}`
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

type SessionDateSelectsProps = {
  value: string
  onChange: (value: string) => void
}

function SessionDateSelects({ value, onChange }: SessionDateSelectsProps) {
  const { day, month, year } = getDateParts(value)
  const yearForDays = year || String(currentYear)
  const monthForDays = month || '01'
  const dayOptions = Array.from(
    { length: getDaysInMonth(yearForDays, monthForDays) },
    (_, index) => String(index + 1).padStart(2, '0'),
  )

  return (
    <div className="session-date-selects">
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
        {sessionYearOptions.map((yearOption) => (
          <option key={yearOption} value={yearOption}>
            {yearOption}
          </option>
        ))}
      </select>
    </div>
  )
}

export function StudySessionsPanel({
  sessions,
  totalSessions,
  subjects,
  saving,
  sessionForm,
  editingSessionId,
  editingSessionForm,
  sessionSubjectFilter,
  onSessionFormChange,
  onEditingSessionFormChange,
  onSessionSubjectFilterChange,
  onCreateSession,
  onStartEditSession,
  onCancelEditSession,
  onUpdateSession,
  onDeleteSession,
}: StudySessionsPanelProps) {
  const visibleMinutes = sessions.reduce((total, session) => total + session.duration_minutes, 0)

  return (
    <section className="sessions-view">
      <section className="panel">
        <div className="section-heading">
          <h2>Nueva sesion</h2>
          <span>{subjects.length ? 'Registra tiempo real de estudio' : 'Primero crea una materia'}</span>
        </div>

        <form className="session-form" onSubmit={onCreateSession}>
          <select
            value={sessionForm.subject_id}
            onChange={(event) =>
              onSessionFormChange({ ...sessionForm, subject_id: event.target.value })
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
            placeholder="Minutos"
            value={sessionForm.duration_minutes}
            onChange={(event) =>
              onSessionFormChange({ ...sessionForm, duration_minutes: event.target.value })
            }
            min={1}
            max={600}
            required
          />

          <SessionDateSelects
            value={sessionForm.session_date}
            onChange={(sessionDate) =>
              onSessionFormChange({ ...sessionForm, session_date: sessionDate })
            }
          />

          <textarea
            placeholder="Nota breve: tema repasado, avance o dificultad"
            value={sessionForm.notes}
            onChange={(event) => onSessionFormChange({ ...sessionForm, notes: event.target.value })}
            rows={3}
            maxLength={500}
          />

          <button className="primary-button" type="submit" disabled={saving || !subjects.length}>
            Registrar sesion
          </button>
        </form>
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>Historial de estudio</h2>
          <span>
            {visibleMinutes} min visibles de {totalSessions} sesiones
          </span>
        </div>

        <div className="session-toolbar">
          <select
            value={sessionSubjectFilter}
            onChange={(event) => onSessionSubjectFilterChange(event.target.value)}
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
          {sessions.map((session) => {
            const isEditing = editingSessionId === session.id
            const subjectColor = getSubjectColor(subjects, session.subject_id)

            return (
              <article className="list-row editable-row" key={session.id}>
                {isEditing ? (
                  <form className="session-edit-form" onSubmit={onUpdateSession}>
                    <select
                      value={editingSessionForm.subject_id}
                      onChange={(event) =>
                        onEditingSessionFormChange({
                          ...editingSessionForm,
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
                      value={editingSessionForm.duration_minutes}
                      onChange={(event) =>
                        onEditingSessionFormChange({
                          ...editingSessionForm,
                          duration_minutes: event.target.value,
                        })
                      }
                      min={1}
                      max={600}
                      required
                    />

                    <SessionDateSelects
                      value={editingSessionForm.session_date}
                      onChange={(sessionDate) =>
                        onEditingSessionFormChange({
                          ...editingSessionForm,
                          session_date: sessionDate,
                        })
                      }
                    />

                    <textarea
                      value={editingSessionForm.notes}
                      onChange={(event) =>
                        onEditingSessionFormChange({
                          ...editingSessionForm,
                          notes: event.target.value,
                        })
                      }
                      rows={3}
                      maxLength={500}
                    />

                    <div className="row-actions session-edit-actions">
                      <button className="small-action primary" type="submit" disabled={saving}>
                        Guardar
                      </button>
                      <button className="icon-action" type="button" onClick={onCancelEditSession}>
                        <X size={17} />
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="row-main">
                      <div className="task-title-line">
                        <strong>{session.duration_minutes} minutos</strong>
                        <span
                          className="subject-pill colored"
                          style={{
                            backgroundColor: subjectColor,
                            color: getReadableTextColor(subjectColor),
                          }}
                        >
                          {session.subject_name}
                        </span>
                      </div>
                      <small>{formatSessionDate(session.session_date)}</small>
                      {session.notes && <p className="row-description">{session.notes}</p>}
                    </div>

                    <div className="row-actions">
                      <button
                        className="icon-action"
                        type="button"
                        onClick={() => onStartEditSession(session)}
                        aria-label={`Editar sesion de ${session.subject_name}`}
                      >
                        <Edit2 size={17} />
                      </button>
                      <button
                        className="icon-action danger"
                        type="button"
                        onClick={() => onDeleteSession(session.id)}
                        aria-label={`Eliminar sesion de ${session.subject_name}`}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </>
                )}
              </article>
            )
          })}

          {!sessions.length && <p className="empty-state">No hay sesiones para mostrar.</p>}
        </div>
      </section>
    </section>
  )
}
