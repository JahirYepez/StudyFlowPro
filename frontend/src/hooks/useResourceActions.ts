import type { Dispatch, FormEvent, SetStateAction } from 'react'
import { apiRequest } from '../api/http'
import { createResourceForm } from '../config/appDefaults'
import type { Resource } from '../types/api'
import type { NewResourceForm } from '../types/forms'

type ResourceActionsParams = {
  token: string | null
  resourceForm: NewResourceForm
  editingResourceId: string | null
  editingResourceForm: NewResourceForm
  setResourceForm: Dispatch<SetStateAction<NewResourceForm>>
  setEditingResourceId: Dispatch<SetStateAction<string | null>>
  setEditingResourceForm: Dispatch<SetStateAction<NewResourceForm>>
  setSaving: Dispatch<SetStateAction<boolean>>
  setError: (message: string) => void
  loadAppData: (activeToken?: string | null) => Promise<void>
}

export function useResourceActions({
  token,
  resourceForm,
  editingResourceId,
  editingResourceForm,
  setResourceForm,
  setEditingResourceId,
  setEditingResourceForm,
  setSaving,
  setError,
  loadAppData,
}: ResourceActionsParams) {
  async function handleCreateResource(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!token) return

    setSaving(true)
    setError('')

    try {
      await apiRequest<Resource>('/resources', {
        method: 'POST',
        token,
        body: {
          title: resourceForm.title,
          subject_id: Number(resourceForm.subject_id),
          url: resourceForm.url,
          resource_type: resourceForm.resource_type,
          notes: resourceForm.notes || null,
        },
      })

      setResourceForm(createResourceForm())
      await loadAppData(token)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo guardar el recurso.')
    } finally {
      setSaving(false)
    }
  }

  function handleStartEditResource(resource: Resource) {
    setEditingResourceId(resource.id)
    setEditingResourceForm({
      title: resource.title,
      subject_id: String(resource.subject_id),
      url: resource.url,
      resource_type: resource.resource_type,
      notes: resource.notes ?? '',
    })
  }

  function handleCancelEditResource() {
    setEditingResourceId(null)
    setEditingResourceForm(createResourceForm())
  }

  async function handleUpdateResource(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!token || !editingResourceId) return

    setSaving(true)
    setError('')

    try {
      await apiRequest<Resource>(`/resources/${editingResourceId}`, {
        method: 'PATCH',
        token,
        body: {
          title: editingResourceForm.title,
          subject_id: Number(editingResourceForm.subject_id),
          url: editingResourceForm.url,
          resource_type: editingResourceForm.resource_type,
          notes: editingResourceForm.notes || null,
        },
      })

      handleCancelEditResource()
      await loadAppData(token)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo actualizar el recurso.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteResource(resourceId: string) {
    if (!token) return

    const confirmed = window.confirm('Deseas eliminar este recurso?')
    if (!confirmed) return

    setSaving(true)
    setError('')

    try {
      await apiRequest<void>(`/resources/${resourceId}`, {
        method: 'DELETE',
        token,
      })

      await loadAppData(token)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo eliminar el recurso.')
    } finally {
      setSaving(false)
    }
  }

  return {
    handleCreateResource,
    handleStartEditResource,
    handleCancelEditResource,
    handleUpdateResource,
    handleDeleteResource,
  }
}
