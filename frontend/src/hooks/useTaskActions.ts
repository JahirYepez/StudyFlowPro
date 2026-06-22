import type { Dispatch, FormEvent, SetStateAction } from 'react'
import { apiRequest } from '../api/http'
import { createTaskForm } from '../config/appDefaults'
import type { Task } from '../types/api'
import type { NewTaskForm } from '../types/forms'

type TaskActionsParams = {
  token: string | null
  taskForm: NewTaskForm
  editingTaskId: number | null
  editingTaskForm: NewTaskForm
  setTaskForm: Dispatch<SetStateAction<NewTaskForm>>
  setEditingTaskId: Dispatch<SetStateAction<number | null>>
  setEditingTaskForm: Dispatch<SetStateAction<NewTaskForm>>
  setSaving: Dispatch<SetStateAction<boolean>>
  setError: (message: string) => void
  loadAppData: (activeToken?: string | null) => Promise<void>
}

export function useTaskActions({
  token,
  taskForm,
  editingTaskId,
  editingTaskForm,
  setTaskForm,
  setEditingTaskId,
  setEditingTaskForm,
  setSaving,
  setError,
  loadAppData,
}: TaskActionsParams) {
  async function handleCreateTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!token) return

    setSaving(true)
    setError('')

    try {
      await apiRequest<Task>('/tasks', {
        method: 'POST',
        token,
        body: {
          title: taskForm.title,
          description: taskForm.description || null,
          subject_id: Number(taskForm.subject_id),
          priority: taskForm.priority,
          due_date: taskForm.due_date || null,
        },
      })

      setTaskForm(createTaskForm())
      await loadAppData(token)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo crear la tarea.')
    } finally {
      setSaving(false)
    }
  }

  function handleStartEditTask(task: Task) {
    setEditingTaskId(task.id)
    setEditingTaskForm({
      title: task.title,
      description: task.description ?? '',
      subject_id: String(task.subject_id),
      priority: task.priority,
      due_date: task.due_date ?? '',
    })
  }

  function handleCancelEditTask() {
    setEditingTaskId(null)
    setEditingTaskForm(createTaskForm())
  }

  async function handleUpdateTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!token || !editingTaskId) return

    setSaving(true)
    setError('')

    try {
      await apiRequest<Task>(`/tasks/${editingTaskId}`, {
        method: 'PATCH',
        token,
        body: {
          title: editingTaskForm.title,
          description: editingTaskForm.description || null,
          subject_id: Number(editingTaskForm.subject_id),
          priority: editingTaskForm.priority,
          due_date: editingTaskForm.due_date || null,
        },
      })

      handleCancelEditTask()
      await loadAppData(token)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo actualizar la tarea.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteTask(taskId: number) {
    if (!token) return

    const confirmed = window.confirm('Deseas eliminar esta tarea?')
    if (!confirmed) return

    setSaving(true)
    setError('')

    try {
      await apiRequest<void>(`/tasks/${taskId}`, {
        method: 'DELETE',
        token,
      })

      await loadAppData(token)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo eliminar la tarea.')
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleTaskCompleted(task: Task) {
    if (!token) return

    setSaving(true)
    setError('')

    try {
      await apiRequest<Task>(`/tasks/${task.id}`, {
        method: 'PATCH',
        token,
        body: {
          completed: !task.completed,
        },
      })

      await loadAppData(token)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo actualizar la tarea.')
    } finally {
      setSaving(false)
    }
  }

  return {
    handleCreateTask,
    handleStartEditTask,
    handleCancelEditTask,
    handleUpdateTask,
    handleDeleteTask,
    handleToggleTaskCompleted,
  }
}
