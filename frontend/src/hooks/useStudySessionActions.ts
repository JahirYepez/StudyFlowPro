import type { Dispatch, FormEvent, SetStateAction } from 'react'
import { apiRequest } from '../api/http'
import { createStudySessionForm } from '../config/appDefaults'
import type { StudySession } from '../types/api'
import type { NewStudySessionForm } from '../types/forms'

type StudySessionActionsParams = {
  token: string | null
  sessionForm: NewStudySessionForm
  editingSessionId: string | null
  editingSessionForm: NewStudySessionForm
  setSessionForm: Dispatch<SetStateAction<NewStudySessionForm>>
  setEditingSessionId: Dispatch<SetStateAction<string | null>>
  setEditingSessionForm: Dispatch<SetStateAction<NewStudySessionForm>>
  setSaving: Dispatch<SetStateAction<boolean>>
  setError: (message: string) => void
  loadAppData: (activeToken?: string | null) => Promise<void>
}

export function useStudySessionActions({
  token,
  sessionForm,
  editingSessionId,
  editingSessionForm,
  setSessionForm,
  setEditingSessionId,
  setEditingSessionForm,
  setSaving,
  setError,
  loadAppData,
}: StudySessionActionsParams) {
  async function handleCreateSession(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!token) return

    setSaving(true)
    setError('')

    try {
      await apiRequest<StudySession>('/study-sessions', {
        method: 'POST',
        token,
        body: {
          subject_id: Number(sessionForm.subject_id),
          duration_minutes: Number(sessionForm.duration_minutes),
          session_date: sessionForm.session_date,
          notes: sessionForm.notes || null,
        },
      })

      setSessionForm(createStudySessionForm())
      await loadAppData(token)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo registrar la sesion.')
    } finally {
      setSaving(false)
    }
  }

  function handleStartEditSession(session: StudySession) {
    setEditingSessionId(session.id)
    setEditingSessionForm({
      subject_id: String(session.subject_id),
      duration_minutes: String(session.duration_minutes),
      session_date: session.session_date,
      notes: session.notes ?? '',
    })
  }

  function handleCancelEditSession() {
    setEditingSessionId(null)
    setEditingSessionForm(createStudySessionForm())
  }

  async function handleUpdateSession(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!token || !editingSessionId) return

    setSaving(true)
    setError('')

    try {
      await apiRequest<StudySession>(`/study-sessions/${editingSessionId}`, {
        method: 'PATCH',
        token,
        body: {
          subject_id: Number(editingSessionForm.subject_id),
          duration_minutes: Number(editingSessionForm.duration_minutes),
          session_date: editingSessionForm.session_date,
          notes: editingSessionForm.notes || null,
        },
      })

      handleCancelEditSession()
      await loadAppData(token)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo actualizar la sesion.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteSession(sessionId: string) {
    if (!token) return

    const confirmed = window.confirm('Deseas eliminar esta sesion de estudio?')
    if (!confirmed) return

    setSaving(true)
    setError('')

    try {
      await apiRequest<void>(`/study-sessions/${sessionId}`, {
        method: 'DELETE',
        token,
      })

      await loadAppData(token)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo eliminar la sesion.')
    } finally {
      setSaving(false)
    }
  }

  return {
    handleCreateSession,
    handleStartEditSession,
    handleCancelEditSession,
    handleUpdateSession,
    handleDeleteSession,
  }
}
