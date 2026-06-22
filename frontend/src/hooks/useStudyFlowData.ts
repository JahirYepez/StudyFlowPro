import { useState } from 'react'
import { apiRequest } from '../api/http'
import { emptyDashboard } from '../config/appDefaults'
import type {
  ActivityLog,
  DashboardSummary,
  Resource,
  StudyGoal,
  StudySession,
  Subject,
  Task,
} from '../types/api'

export function useStudyFlowData(token: string | null) {
  const [dashboard, setDashboard] = useState<DashboardSummary>(emptyDashboard)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [studySessions, setStudySessions] = useState<StudySession[]>([])
  const [studyGoals, setStudyGoals] = useState<StudyGoal[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function loadAppData(activeToken = token) {
    if (!activeToken) return

    setLoading(true)
    setError('')

    try {
      const [
        dashboardData,
        subjectsData,
        tasksData,
        sessionsData,
        goalsData,
        resourcesData,
        activityData,
      ] = await Promise.all([
        apiRequest<DashboardSummary>('/dashboard/summary', { token: activeToken }),
        apiRequest<Subject[]>('/subjects', { token: activeToken }),
        apiRequest<Task[]>('/tasks', { token: activeToken }),
        apiRequest<StudySession[]>('/study-sessions', { token: activeToken }),
        apiRequest<StudyGoal[]>('/study-goals', { token: activeToken }),
        apiRequest<Resource[]>('/resources', { token: activeToken }),
        apiRequest<ActivityLog[]>('/activity-logs', { token: activeToken }),
      ])

      setDashboard(dashboardData)
      setSubjects(subjectsData)
      setTasks(tasksData)
      setStudySessions(sessionsData)
      setStudyGoals(goalsData)
      setResources(resourcesData)
      setActivityLogs(activityData)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo cargar la informacion.')
    } finally {
      setLoading(false)
    }
  }

  function resetAppData() {
    setDashboard(emptyDashboard)
    setSubjects([])
    setTasks([])
    setStudySessions([])
    setStudyGoals([])
    setResources([])
    setActivityLogs([])
  }

  return {
    dashboard,
    subjects,
    tasks,
    studySessions,
    studyGoals,
    resources,
    activityLogs,
    loading,
    error,
    setError,
    loadAppData,
    resetAppData,
  }
}
