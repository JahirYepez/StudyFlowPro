import type { Dispatch, FormEvent, SetStateAction } from 'react'
import { apiRequest } from '../api/http'
import { createStudyGoalForm } from '../config/appDefaults'
import type { StudyGoal } from '../types/api'
import type { NewStudyGoalForm } from '../types/forms'

type StudyGoalActionsParams = {
  token: string | null
  goalForm: NewStudyGoalForm
  editingGoalId: number | null
  editingGoalForm: NewStudyGoalForm
  setGoalForm: Dispatch<SetStateAction<NewStudyGoalForm>>
  setEditingGoalId: Dispatch<SetStateAction<number | null>>
  setEditingGoalForm: Dispatch<SetStateAction<NewStudyGoalForm>>
  setSaving: Dispatch<SetStateAction<boolean>>
  setError: (message: string) => void
  loadAppData: (activeToken?: string | null) => Promise<void>
}

export function useStudyGoalActions({
  token,
  goalForm,
  editingGoalId,
  editingGoalForm,
  setGoalForm,
  setEditingGoalId,
  setEditingGoalForm,
  setSaving,
  setError,
  loadAppData,
}: StudyGoalActionsParams) {
  async function handleCreateGoal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!token) return

    setSaving(true)
    setError('')

    try {
      await apiRequest<StudyGoal>('/study-goals', {
        method: 'POST',
        token,
        body: {
          title: goalForm.title,
          subject_id: Number(goalForm.subject_id),
          target_minutes: Number(goalForm.target_minutes),
          deadline: goalForm.deadline || null,
        },
      })

      setGoalForm(createStudyGoalForm())
      await loadAppData(token)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo crear la meta.')
    } finally {
      setSaving(false)
    }
  }

  function handleStartEditGoal(goal: StudyGoal) {
    setEditingGoalId(goal.id)
    setEditingGoalForm({
      title: goal.title,
      subject_id: String(goal.subject_id),
      target_minutes: String(goal.target_minutes),
      deadline: goal.deadline ?? '',
    })
  }

  function handleCancelEditGoal() {
    setEditingGoalId(null)
    setEditingGoalForm(createStudyGoalForm())
  }

  async function handleUpdateGoal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!token || !editingGoalId) return

    setSaving(true)
    setError('')

    try {
      await apiRequest<StudyGoal>(`/study-goals/${editingGoalId}`, {
        method: 'PATCH',
        token,
        body: {
          title: editingGoalForm.title,
          subject_id: Number(editingGoalForm.subject_id),
          target_minutes: Number(editingGoalForm.target_minutes),
          deadline: editingGoalForm.deadline || null,
        },
      })

      handleCancelEditGoal()
      await loadAppData(token)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo actualizar la meta.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteGoal(goalId: number) {
    if (!token) return

    const confirmed = window.confirm('Deseas eliminar esta meta de estudio?')
    if (!confirmed) return

    setSaving(true)
    setError('')

    try {
      await apiRequest<void>(`/study-goals/${goalId}`, {
        method: 'DELETE',
        token,
      })

      await loadAppData(token)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo eliminar la meta.')
    } finally {
      setSaving(false)
    }
  }

  return {
    handleCreateGoal,
    handleStartEditGoal,
    handleCancelEditGoal,
    handleUpdateGoal,
    handleDeleteGoal,
  }
}
