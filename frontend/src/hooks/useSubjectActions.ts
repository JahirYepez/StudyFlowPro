import type { Dispatch, FormEvent, SetStateAction } from 'react'
import { apiRequest } from '../api/http'
import { createSubjectForm } from '../config/appDefaults'
import type { Subject } from '../types/api'
import type { NewSubjectForm } from '../types/forms'

type SubjectActionsParams = {
  token: string | null
  subjectForm: NewSubjectForm
  editingSubjectId: number | null
  editingSubjectForm: NewSubjectForm
  setSubjectForm: Dispatch<SetStateAction<NewSubjectForm>>
  setEditingSubjectId: Dispatch<SetStateAction<number | null>>
  setEditingSubjectForm: Dispatch<SetStateAction<NewSubjectForm>>
  setSaving: Dispatch<SetStateAction<boolean>>
  setError: (message: string) => void
  loadAppData: (activeToken?: string | null) => Promise<void>
}

export function useSubjectActions({
  token,
  subjectForm,
  editingSubjectId,
  editingSubjectForm,
  setSubjectForm,
  setEditingSubjectId,
  setEditingSubjectForm,
  setSaving,
  setError,
  loadAppData,
}: SubjectActionsParams) {
  async function handleCreateSubject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!token) return

    setSaving(true)
    setError('')

    try {
      await apiRequest<Subject>('/subjects', {
        method: 'POST',
        token,
        body: subjectForm,
      })

      setSubjectForm(createSubjectForm())
      await loadAppData(token)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo crear la materia.')
    } finally {
      setSaving(false)
    }
  }

  function handleStartEditSubject(subject: Subject) {
    setEditingSubjectId(subject.id)
    setEditingSubjectForm({
      name: subject.name,
      color: subject.color,
    })
  }

  function handleCancelEditSubject() {
    setEditingSubjectId(null)
    setEditingSubjectForm(createSubjectForm())
  }

  async function handleUpdateSubject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!token || !editingSubjectId) return

    setSaving(true)
    setError('')

    try {
      await apiRequest<Subject>(`/subjects/${editingSubjectId}`, {
        method: 'PATCH',
        token,
        body: editingSubjectForm,
      })

      handleCancelEditSubject()
      await loadAppData(token)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo actualizar la materia.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteSubject(subjectId: number) {
    if (!token) return

    const confirmed = window.confirm('Deseas eliminar esta materia?')
    if (!confirmed) return

    setSaving(true)
    setError('')

    try {
      await apiRequest<void>(`/subjects/${subjectId}`, {
        method: 'DELETE',
        token,
      })

      await loadAppData(token)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo eliminar la materia.')
    } finally {
      setSaving(false)
    }
  }

  return {
    handleCreateSubject,
    handleStartEditSubject,
    handleCancelEditSubject,
    handleUpdateSubject,
    handleDeleteSubject,
  }
}
