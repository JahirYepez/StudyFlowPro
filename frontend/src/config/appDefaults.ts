import type { ActiveView } from '../components/Sidebar'
import type { DashboardSummary } from '../types/api'
import type {
  NewResourceForm,
  NewStudyGoalForm,
  NewStudySessionForm,
  NewSubjectForm,
  NewTaskForm,
} from '../types/forms'

const DEFAULT_SUBJECT_COLOR = '#9E6899'

export const emptyDashboard: DashboardSummary = {
  total_subjects: 0,
  total_tasks: 0,
  pending_tasks: 0,
  completed_tasks: 0,
  high_priority_pending_tasks: 0,
  upcoming_tasks: 0,
  progress_percentage: 0,
  total_study_sessions: 0,
  total_study_minutes: 0,
  total_study_goals: 0,
  total_goal_minutes: 0,
  goal_progress_percentage: 0,
  pending_reminders: 0,
  upcoming_reminders: 0,
}

export const viewTitles: Record<ActiveView, string> = {
  dashboard: 'Dashboard',
  subjects: 'Materias',
  tasks: 'Tareas',
  sessions: 'Sesiones de estudio',
  goals: 'Metas de estudio',
  resources: 'Recursos',
  activity: 'Actividad reciente',
}

export function getTodayDate() {
  return new Date().toISOString().slice(0, 10)
}

export function createSubjectForm(): NewSubjectForm {
  return {
    name: '',
    color: DEFAULT_SUBJECT_COLOR,
  }
}

export function createTaskForm(): NewTaskForm {
  return {
    title: '',
    description: '',
    subject_id: '',
    priority: 'medium',
    due_date: '',
  }
}

export function createStudySessionForm(): NewStudySessionForm {
  return {
    subject_id: '',
    duration_minutes: '',
    session_date: getTodayDate(),
    notes: '',
  }
}

export function createStudyGoalForm(): NewStudyGoalForm {
  return {
    title: '',
    subject_id: '',
    target_minutes: '',
    deadline: '',
  }
}

export function createResourceForm(): NewResourceForm {
  return {
    title: '',
    subject_id: '',
    url: '',
    resource_type: 'other',
    notes: '',
  }
}
