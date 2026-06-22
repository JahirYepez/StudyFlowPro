import { Edit2, ExternalLink, Trash2, X } from 'lucide-react'
import type { FormEvent } from 'react'
import type { Resource, ResourceType, Subject } from '../types/api'

type ResourceForm = {
  title: string
  subject_id: string
  url: string
  resource_type: ResourceType
  notes: string
}

type ResourceTypeFilter = ResourceType | 'all'

type ResourcesPanelProps = {
  resources: Resource[]
  totalResources: number
  subjects: Subject[]
  saving: boolean
  resourceForm: ResourceForm
  editingResourceId: string | null
  editingResourceForm: ResourceForm
  resourceSubjectFilter: string
  resourceTypeFilter: ResourceTypeFilter
  onResourceFormChange: (form: ResourceForm) => void
  onEditingResourceFormChange: (form: ResourceForm) => void
  onResourceSubjectFilterChange: (subjectId: string) => void
  onResourceTypeFilterChange: (type: ResourceTypeFilter) => void
  onCreateResource: (event: FormEvent<HTMLFormElement>) => void
  onStartEditResource: (resource: Resource) => void
  onCancelEditResource: () => void
  onUpdateResource: (event: FormEvent<HTMLFormElement>) => void
  onDeleteResource: (resourceId: string) => void
}

const resourceTypes: Array<{ value: ResourceType; label: string }> = [
  { value: 'article', label: 'Articulo' },
  { value: 'video', label: 'Video' },
  { value: 'documentation', label: 'Documentacion' },
  { value: 'repository', label: 'Repositorio' },
  { value: 'other', label: 'Otro' },
]

const httpsUrlPattern = 'https://.+'

function getResourceTypeLabel(type: ResourceType) {
  return resourceTypes.find((resourceType) => resourceType.value === type)?.label ?? 'Otro'
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

export function ResourcesPanel({
  resources,
  totalResources,
  subjects,
  saving,
  resourceForm,
  editingResourceId,
  editingResourceForm,
  resourceSubjectFilter,
  resourceTypeFilter,
  onResourceFormChange,
  onEditingResourceFormChange,
  onResourceSubjectFilterChange,
  onResourceTypeFilterChange,
  onCreateResource,
  onStartEditResource,
  onCancelEditResource,
  onUpdateResource,
  onDeleteResource,
}: ResourcesPanelProps) {
  return (
    <section className="resources-view">
      <section className="panel">
        <div className="section-heading">
          <h2>Nuevo recurso</h2>
          <span>{subjects.length ? 'Guarda material de apoyo por materia' : 'Primero crea una materia'}</span>
        </div>

        <form className="resource-form" onSubmit={onCreateResource}>
          <input
            placeholder="Titulo del recurso"
            value={resourceForm.title}
            onChange={(event) => onResourceFormChange({ ...resourceForm, title: event.target.value })}
            minLength={3}
            maxLength={140}
            required
          />

          <div className="resource-meta-selects">
            <select
              value={resourceForm.subject_id}
              onChange={(event) => onResourceFormChange({ ...resourceForm, subject_id: event.target.value })}
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
              value={resourceForm.resource_type}
              onChange={(event) =>
                onResourceFormChange({
                  ...resourceForm,
                  resource_type: event.target.value as ResourceType,
                })
              }
            >
              {resourceTypes.map((resourceType) => (
                <option key={resourceType.value} value={resourceType.value}>
                  {resourceType.label}
                </option>
              ))}
            </select>
          </div>

          <input
            type="url"
            placeholder="https://ejemplo.com/recurso"
            value={resourceForm.url}
            onChange={(event) => onResourceFormChange({ ...resourceForm, url: event.target.value })}
            pattern={httpsUrlPattern}
            title="El enlace debe iniciar con https://"
            required
          />
          <small className="field-help">Usa enlaces seguros, por ejemplo: https://github.com/...</small>

          <textarea
            placeholder="Nota breve: para que sirve o que tema cubre"
            value={resourceForm.notes}
            onChange={(event) => onResourceFormChange({ ...resourceForm, notes: event.target.value })}
            rows={3}
            maxLength={500}
          />

          <button className="primary-button" type="submit" disabled={saving || !subjects.length}>
            Guardar recurso
          </button>
        </form>
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>Recursos guardados</h2>
          <span>
            {resources.length} visibles de {totalResources}
          </span>
        </div>

        <div className="filter-bar">
          <div className="filter-selects">
            <select
              value={resourceSubjectFilter}
              onChange={(event) => onResourceSubjectFilterChange(event.target.value)}
            >
              <option value="all">Todas las materias</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>

            <select
              value={resourceTypeFilter}
              onChange={(event) => onResourceTypeFilterChange(event.target.value as ResourceTypeFilter)}
            >
              <option value="all">Todos los tipos</option>
              {resourceTypes.map((resourceType) => (
                <option key={resourceType.value} value={resourceType.value}>
                  {resourceType.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="list task-list-spaced">
          {resources.map((resource) => {
            const isEditing = editingResourceId === resource.id
            const subjectColor = getSubjectColor(subjects, resource.subject_id)

            return (
              <article className="list-row editable-row" key={resource.id}>
                {isEditing ? (
                  <form className="resource-edit-form" onSubmit={onUpdateResource}>
                    <input
                      value={editingResourceForm.title}
                      onChange={(event) =>
                        onEditingResourceFormChange({
                          ...editingResourceForm,
                          title: event.target.value,
                        })
                      }
                      minLength={3}
                      maxLength={140}
                      required
                    />

                    <select
                      value={editingResourceForm.subject_id}
                      onChange={(event) =>
                        onEditingResourceFormChange({
                          ...editingResourceForm,
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
                      value={editingResourceForm.resource_type}
                      onChange={(event) =>
                        onEditingResourceFormChange({
                          ...editingResourceForm,
                          resource_type: event.target.value as ResourceType,
                        })
                      }
                    >
                      {resourceTypes.map((resourceType) => (
                        <option key={resourceType.value} value={resourceType.value}>
                          {resourceType.label}
                        </option>
                      ))}
                    </select>

                    <input
                      type="url"
                      value={editingResourceForm.url}
                      onChange={(event) =>
                        onEditingResourceFormChange({
                          ...editingResourceForm,
                          url: event.target.value,
                        })
                      }
                      pattern={httpsUrlPattern}
                      title="El enlace debe iniciar con https://"
                      required
                    />

                    <textarea
                      value={editingResourceForm.notes}
                      onChange={(event) =>
                        onEditingResourceFormChange({
                          ...editingResourceForm,
                          notes: event.target.value,
                        })
                      }
                      rows={3}
                      maxLength={500}
                    />

                    <div className="row-actions resource-edit-actions">
                      <button className="small-action primary" type="submit" disabled={saving}>
                        Guardar
                      </button>
                      <button className="icon-action" type="button" onClick={onCancelEditResource}>
                        <X size={17} />
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="row-main">
                      <div className="task-title-line">
                        <a
                          className="resource-title-link"
                          href={resource.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {resource.title}
                        </a>
                        <span
                          className="subject-pill colored"
                          style={{
                            backgroundColor: subjectColor,
                            color: getReadableTextColor(subjectColor),
                          }}
                        >
                          {resource.subject_name}
                        </span>
                      </div>
                      <small>{getResourceTypeLabel(resource.resource_type)}</small>
                      {resource.notes && <p className="row-description">{resource.notes}</p>}
                    </div>

                    <div className="row-actions">
                      <a
                        className="icon-action"
                        href={resource.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Abrir ${resource.title}`}
                      >
                        <ExternalLink size={17} />
                      </a>
                      <button
                        className="icon-action"
                        type="button"
                        onClick={() => onStartEditResource(resource)}
                        aria-label={`Editar ${resource.title}`}
                      >
                        <Edit2 size={17} />
                      </button>
                      <button
                        className="icon-action danger"
                        type="button"
                        onClick={() => onDeleteResource(resource.id)}
                        aria-label={`Eliminar ${resource.title}`}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </>
                )}
              </article>
            )
          })}

          {!resources.length && <p className="empty-state">No hay recursos para mostrar.</p>}
        </div>
      </section>
    </section>
  )
}
