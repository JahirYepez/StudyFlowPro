import { Edit2, Plus, Trash2, X } from 'lucide-react'
import type { FormEvent } from 'react'
import type { Subject } from '../types/api'

type SubjectForm = {
  name: string
  color: string
}

type SubjectsPanelProps = {
  subjects: Subject[]
  saving: boolean
  subjectForm: SubjectForm
  editingSubjectId: number | null
  editingSubjectForm: SubjectForm
  onSubjectFormChange: (form: SubjectForm) => void
  onEditingSubjectFormChange: (form: SubjectForm) => void
  onCreateSubject: (event: FormEvent<HTMLFormElement>) => void
  onStartEditSubject: (subject: Subject) => void
  onCancelEditSubject: () => void
  onUpdateSubject: (event: FormEvent<HTMLFormElement>) => void
  onDeleteSubject: (subjectId: number) => void
}

const subjectColors = [
  '#111111',
  '#5B3765',
  '#9E6899',
  '#BA88AE',
  '#D6A8C4',
  '#C85C8E',
  '#8E44AD',
  '#4A6FA5',
  '#2F80ED',
  '#2D9CDB',
  '#219653',
  '#6FCF97',
  '#F2C94C',
  '#F2994A',
  '#EB5757',
  '#7A7A7A',
]

type ColorSwatchesProps = {
  value: string
  onChange: (color: string) => void
  label: string
}

function ColorSwatches({ value, onChange, label }: ColorSwatchesProps) {
  return (
    <div className="color-swatches" aria-label={label}>
      {subjectColors.map((color) => (
        <button
          className={value.toLowerCase() === color.toLowerCase() ? 'color-swatch active' : 'color-swatch'}
          key={color}
          type="button"
          style={{ backgroundColor: color }}
          onClick={() => onChange(color)}
          aria-label={`Seleccionar color ${color}`}
        />
      ))}
    </div>
  )
}

export function SubjectsPanel({
  subjects,
  saving,
  subjectForm,
  editingSubjectId,
  editingSubjectForm,
  onSubjectFormChange,
  onEditingSubjectFormChange,
  onCreateSubject,
  onStartEditSubject,
  onCancelEditSubject,
  onUpdateSubject,
  onDeleteSubject,
}: SubjectsPanelProps) {
  return (
    <section id="subjects" className="panel">
      <div className="section-heading">
        <h2>Materias</h2>
        <span>{subjects.length} registradas</span>
      </div>

      <form className="subject-form" onSubmit={onCreateSubject}>
        <input
          placeholder="Nueva materia"
          value={subjectForm.name}
          onChange={(event) =>
            onSubjectFormChange({ ...subjectForm, name: event.target.value })
          }
          minLength={2}
          required
        />

        <ColorSwatches
          value={subjectForm.color}
          onChange={(color) => onSubjectFormChange({ ...subjectForm, color })}
          label="Colores disponibles para la materia"
        />

        <button className="primary-button" type="submit" disabled={saving}>
          <Plus size={18} />
          Crear materia
        </button>
      </form>

      <div className="list">
        {subjects.map((subject) => {
          const isEditing = editingSubjectId === subject.id

          return (
            <article className="list-row editable-row" key={subject.id}>
              <span className="subject-dot" style={{ backgroundColor: subject.color }} />

              {isEditing ? (
                <form className="edit-subject-form" onSubmit={onUpdateSubject}>
                  <input
                    value={editingSubjectForm.name}
                    onChange={(event) =>
                      onEditingSubjectFormChange({
                        ...editingSubjectForm,
                        name: event.target.value,
                      })
                    }
                    minLength={2}
                    required
                  />

                  <ColorSwatches
                    value={editingSubjectForm.color}
                    onChange={(color) =>
                      onEditingSubjectFormChange({
                        ...editingSubjectForm,
                        color,
                      })
                    }
                    label="Colores disponibles para editar la materia"
                  />

                  <div className="row-actions">
                    <button className="small-action primary" type="submit" disabled={saving}>
                      Guardar
                    </button>
                    <button className="icon-action" type="button" onClick={onCancelEditSubject}>
                      <X size={17} />
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="row-main">
                    <strong>{subject.name}</strong>
                    <small>Creada el {new Date(subject.created_at).toLocaleDateString()}</small>
                  </div>

                  <div className="row-actions">
                    <button
                      className="icon-action"
                      type="button"
                      onClick={() => onStartEditSubject(subject)}
                      aria-label={`Editar ${subject.name}`}
                    >
                      <Edit2 size={17} />
                    </button>
                    <button
                      className="icon-action danger"
                      type="button"
                      onClick={() => onDeleteSubject(subject.id)}
                      aria-label={`Eliminar ${subject.name}`}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </>
              )}
            </article>
          )
        })}

        {!subjects.length && <p className="empty-state">Aun no hay materias registradas.</p>}
      </div>
    </section>
  )
}
