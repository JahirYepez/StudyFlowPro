import { useState } from 'react'
import {
  createResourceForm,
  createStudyGoalForm,
  createStudySessionForm,
  createSubjectForm,
  createTaskForm,
} from '../config/appDefaults'
import type {
  NewResourceForm,
  NewStudyGoalForm,
  NewStudySessionForm,
  NewSubjectForm,
  NewTaskForm,
} from '../types/forms'

export function useStudyFlowForms() {
  const [subjectForm, setSubjectForm] = useState<NewSubjectForm>(createSubjectForm)
  const [editingSubjectId, setEditingSubjectId] = useState<number | null>(null)
  const [editingSubjectForm, setEditingSubjectForm] = useState<NewSubjectForm>(createSubjectForm)

  const [taskForm, setTaskForm] = useState<NewTaskForm>(createTaskForm)
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null)
  const [editingTaskForm, setEditingTaskForm] = useState<NewTaskForm>(createTaskForm)

  const [sessionForm, setSessionForm] = useState<NewStudySessionForm>(createStudySessionForm)
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null)
  const [editingSessionForm, setEditingSessionForm] =
    useState<NewStudySessionForm>(createStudySessionForm)

  const [goalForm, setGoalForm] = useState<NewStudyGoalForm>(createStudyGoalForm)
  const [editingGoalId, setEditingGoalId] = useState<number | null>(null)
  const [editingGoalForm, setEditingGoalForm] = useState<NewStudyGoalForm>(createStudyGoalForm)

  const [resourceForm, setResourceForm] = useState<NewResourceForm>(createResourceForm)
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null)
  const [editingResourceForm, setEditingResourceForm] = useState<NewResourceForm>(createResourceForm)

  return {
    subjectForm,
    setSubjectForm,
    editingSubjectId,
    setEditingSubjectId,
    editingSubjectForm,
    setEditingSubjectForm,
    taskForm,
    setTaskForm,
    editingTaskId,
    setEditingTaskId,
    editingTaskForm,
    setEditingTaskForm,
    sessionForm,
    setSessionForm,
    editingSessionId,
    setEditingSessionId,
    editingSessionForm,
    setEditingSessionForm,
    goalForm,
    setGoalForm,
    editingGoalId,
    setEditingGoalId,
    editingGoalForm,
    setEditingGoalForm,
    resourceForm,
    setResourceForm,
    editingResourceId,
    setEditingResourceId,
    editingResourceForm,
    setEditingResourceForm,
  }
}
