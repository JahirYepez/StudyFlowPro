import { useEffect, useState } from 'react'
import type { ActiveView } from '../components/Sidebar'
import { viewTitles } from '../config/appDefaults'
import type { User } from '../types/api'
import type { AuthMode, ThemeMode } from '../types/forms'
import { getStoredTheme, getStoredToken, getStoredUser, saveTheme } from '../utils/storage'
import { useAuthActions } from './useAuthActions'
import { useResourceActions } from './useResourceActions'
import { useStudyFlowData } from './useStudyFlowData'
import { useStudyFlowFilters } from './useStudyFlowFilters'
import { useStudyFlowForms } from './useStudyFlowForms'
import { useStudyGoalActions } from './useStudyGoalActions'
import { useStudySessionActions } from './useStudySessionActions'
import { useSubjectActions } from './useSubjectActions'
import { useTaskActions } from './useTaskActions'

export function useStudyFlowApp() {
  const [token, setToken] = useState(getStoredToken)
  const [user, setUser] = useState<User | null>(getStoredUser)
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [themeMode, setThemeMode] = useState<ThemeMode>(getStoredTheme)
  const [activeView, setActiveView] = useState<ActiveView>('dashboard')
  const [saving, setSaving] = useState(false)

  const data = useStudyFlowData(token)
  const forms = useStudyFlowForms()
  const filters = useStudyFlowFilters({
    tasks: data.tasks,
    studySessions: data.studySessions,
    studyGoals: data.studyGoals,
    resources: data.resources,
    activityLogs: data.activityLogs,
  })

  const sharedActionParams = {
    token,
    setSaving,
    setError: data.setError,
    loadAppData: data.loadAppData,
  }

  const authActions = useAuthActions({
    authMode,
    setToken,
    setUser,
    setActiveView,
    setSaving,
    setError: data.setError,
    resetAppData: data.resetAppData,
  })

  const subjectActions = useSubjectActions({
    ...sharedActionParams,
    subjectForm: forms.subjectForm,
    editingSubjectId: forms.editingSubjectId,
    editingSubjectForm: forms.editingSubjectForm,
    setSubjectForm: forms.setSubjectForm,
    setEditingSubjectId: forms.setEditingSubjectId,
    setEditingSubjectForm: forms.setEditingSubjectForm,
  })

  const taskActions = useTaskActions({
    ...sharedActionParams,
    taskForm: forms.taskForm,
    editingTaskId: forms.editingTaskId,
    editingTaskForm: forms.editingTaskForm,
    setTaskForm: forms.setTaskForm,
    setEditingTaskId: forms.setEditingTaskId,
    setEditingTaskForm: forms.setEditingTaskForm,
  })

  const sessionActions = useStudySessionActions({
    ...sharedActionParams,
    sessionForm: forms.sessionForm,
    editingSessionId: forms.editingSessionId,
    editingSessionForm: forms.editingSessionForm,
    setSessionForm: forms.setSessionForm,
    setEditingSessionId: forms.setEditingSessionId,
    setEditingSessionForm: forms.setEditingSessionForm,
  })

  const goalActions = useStudyGoalActions({
    ...sharedActionParams,
    goalForm: forms.goalForm,
    editingGoalId: forms.editingGoalId,
    editingGoalForm: forms.editingGoalForm,
    setGoalForm: forms.setGoalForm,
    setEditingGoalId: forms.setEditingGoalId,
    setEditingGoalForm: forms.setEditingGoalForm,
  })

  const resourceActions = useResourceActions({
    ...sharedActionParams,
    resourceForm: forms.resourceForm,
    editingResourceId: forms.editingResourceId,
    editingResourceForm: forms.editingResourceForm,
    setResourceForm: forms.setResourceForm,
    setEditingResourceId: forms.setEditingResourceId,
    setEditingResourceForm: forms.setEditingResourceForm,
  })

  useEffect(() => {
    if (token) {
      data.loadAppData(token)
    }
  }, [token])

  useEffect(() => {
    saveTheme(themeMode)
  }, [themeMode])

  return {
    authMode,
    setAuthMode,
    themeMode,
    setThemeMode,
    activeView,
    setActiveView,
    ...data,
    ...forms,
    ...filters,
    saving,
    isAuthenticated: Boolean(token && user),
    currentUser: user,
    viewTitle: viewTitles[activeView],
    ...authActions,
    ...subjectActions,
    ...taskActions,
    ...sessionActions,
    ...goalActions,
    ...resourceActions,
  }
}
