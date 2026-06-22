export type User = {
  id: number
  full_name: string
  email: string
  role: string
  created_at: string
}

export type TokenResponse = {
  access_token: string
  token_type: string
  user: User
}

export type DashboardSummary = {
  total_subjects: number
  total_tasks: number
  pending_tasks: number
  completed_tasks: number
  high_priority_pending_tasks: number
  upcoming_tasks: number
  progress_percentage: number
  total_study_sessions: number
  total_study_minutes: number
  total_study_goals: number
  total_goal_minutes: number
  goal_progress_percentage: number
  pending_reminders: number
  upcoming_reminders: number
}

export type Subject = {
  id: number
  name: string
  color: string
  user_id: number
  created_at: string
}

export type TaskCategory = {
  id: number
  name: string
  color: string
  user_id: number
  created_at: string
}

export type Task = {
  id: number
  title: string
  description: string | null
  due_date: string | null
  priority: 'low' | 'medium' | 'high'
  completed: boolean
  user_id: number
  subject_id: number
  category_id: number | null
  created_at: string
}

export type StudySession = {
  id: string
  user_id: number
  subject_id: number
  subject_name: string
  duration_minutes: number
  session_date: string
  notes: string | null
  created_at: string
}

export type StudyGoal = {
  id: number
  title: string
  target_minutes: number
  progress_percentage: number
  deadline: string | null
  user_id: number
  subject_id: number
  created_at: string
}

export type ResourceType = 'article' | 'video' | 'documentation' | 'repository' | 'other'

export type Resource = {
  id: string
  user_id: number
  subject_id: number
  subject_name: string
  title: string
  url: string
  resource_type: ResourceType
  notes: string | null
  created_at: string
}

export type ActivityLog = {
  id: string
  user_id: number
  action: string
  entity: string
  entity_id: string | null
  message: string
  created_at: string
}
