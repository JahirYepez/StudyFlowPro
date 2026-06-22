import { Activity, CheckCircle2, Edit2, Plus, Trash2 } from 'lucide-react'
import type { ActivityLog } from '../types/api'
import type { ActivityFilter, EntityFilter } from '../types/forms'

type ActivityPanelProps = {
  logs: ActivityLog[]
  totalLogs: number
  actionFilter: ActivityFilter
  entityFilter: EntityFilter
  onActionFilterChange: (filter: ActivityFilter) => void
  onEntityFilterChange: (filter: EntityFilter) => void
}

const actionOptions: Array<{ value: ActivityFilter; label: string }> = [
  { value: 'all', label: 'Todas las acciones' },
  { value: 'create', label: 'Creacion' },
  { value: 'update', label: 'Actualizacion' },
  { value: 'delete', label: 'Eliminacion' },
  { value: 'complete', label: 'Completadas' },
]

const entityOptions: Array<{ value: EntityFilter; label: string }> = [
  { value: 'all', label: 'Todas las entidades' },
  { value: 'subject', label: 'Materias' },
  { value: 'task', label: 'Tareas' },
  { value: 'study_session', label: 'Sesiones' },
  { value: 'study_goal', label: 'Metas' },
  { value: 'resource', label: 'Recursos' },
  { value: 'auth', label: 'Acceso' },
]

function getActionLabel(action: string) {
  const labels: Record<string, string> = {
    create: 'Creacion',
    update: 'Actualizacion',
    delete: 'Eliminacion',
    complete: 'Completada',
  }

  return labels[action] ?? action
}

function getEntityLabel(entity: string) {
  const labels: Record<string, string> = {
    subject: 'Materia',
    task: 'Tarea',
    study_session: 'Sesion',
    study_goal: 'Meta',
    resource: 'Recurso',
    auth: 'Acceso',
  }

  return labels[entity] ?? entity
}

function getActionIcon(action: string) {
  if (action === 'create') return <Plus size={17} />
  if (action === 'update') return <Edit2 size={17} />
  if (action === 'delete') return <Trash2 size={17} />
  if (action === 'complete') return <CheckCircle2 size={17} />

  return <Activity size={17} />
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function ActivityPanel({
  logs,
  totalLogs,
  actionFilter,
  entityFilter,
  onActionFilterChange,
  onEntityFilterChange,
}: ActivityPanelProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <h2>Actividad reciente</h2>
        <span>
          {logs.length} visibles de {totalLogs}
        </span>
      </div>

      <div className="filter-bar activity-filter-bar">
        <div className="filter-selects">
          <select
            value={entityFilter}
            onChange={(event) => onEntityFilterChange(event.target.value as EntityFilter)}
          >
            {entityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={actionFilter}
            onChange={(event) => onActionFilterChange(event.target.value as ActivityFilter)}
          >
            {actionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="activity-list">
        {logs.map((log) => (
          <article className="activity-row" key={log.id}>
            <span className={`activity-icon action-${log.action}`}>
              {getActionIcon(log.action)}
            </span>

            <div className="row-main">
              <strong>{log.message}</strong>
              <small>
                {getEntityLabel(log.entity)} - {getActionLabel(log.action)} - {formatDateTime(log.created_at)}
              </small>
            </div>
          </article>
        ))}

        {!logs.length && <p className="empty-state">No hay actividad para los filtros seleccionados.</p>}
      </div>
    </section>
  )
}
