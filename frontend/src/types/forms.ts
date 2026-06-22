import type { ResourceType } from './api'

export type AuthMode = 'login' | 'register'
export type ThemeMode = 'palette' | 'mono'

export type AuthPayload = {
  fullName: string
  email: string
  password: string
}

export type NewSubjectForm = {
  name: string
  color: string
}

export type NewTaskForm = {
  title: string
  description: string
  subject_id: string
  priority: 'low' | 'medium' | 'high'
  due_date: string
}

export type NewStudySessionForm = {
  subject_id: string
  duration_minutes: string
  session_date: string
  notes: string
}

export type NewStudyGoalForm = {
  title: string
  subject_id: string
  target_minutes: string
  deadline: string
}

export type NewResourceForm = {
  title: string
  subject_id: string
  url: string
  resource_type: ResourceType
  notes: string
}

export type TaskPriorityFilter = 'all' | 'low' | 'medium' | 'high'
export type ResourceTypeFilter = ResourceType | 'all'
export type ActivityFilter = 'all' | 'create' | 'update' | 'delete' | 'complete'

export type EntityFilter =
  | 'all'
  | 'subject'
  | 'task'
  | 'study_session'
  | 'study_goal'
  | 'resource'
  | 'auth'
