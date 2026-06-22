import { useMemo, useState } from 'react'
import type { ActivityLog, Resource, StudyGoal, StudySession, Task } from '../types/api'
import type {
  ActivityFilter,
  EntityFilter,
  ResourceTypeFilter,
  TaskPriorityFilter,
} from '../types/forms'

type StudyFlowFiltersParams = {
  tasks: Task[]
  studySessions: StudySession[]
  studyGoals: StudyGoal[]
  resources: Resource[]
  activityLogs: ActivityLog[]
}

export function useStudyFlowFilters({
  tasks,
  studySessions,
  studyGoals,
  resources,
  activityLogs,
}: StudyFlowFiltersParams) {
  const [taskSubjectFilter, setTaskSubjectFilter] = useState('all')
  const [taskPriorityFilter, setTaskPriorityFilter] = useState<TaskPriorityFilter>('all')
  const [showPendingTasks, setShowPendingTasks] = useState(true)
  const [showCompletedTasks, setShowCompletedTasks] = useState(false)
  const [sessionSubjectFilter, setSessionSubjectFilter] = useState('all')
  const [goalSubjectFilter, setGoalSubjectFilter] = useState('all')
  const [resourceSubjectFilter, setResourceSubjectFilter] = useState('all')
  const [resourceTypeFilter, setResourceTypeFilter] = useState<ResourceTypeFilter>('all')
  const [activityActionFilter, setActivityActionFilter] = useState<ActivityFilter>('all')
  const [activityEntityFilter, setActivityEntityFilter] = useState<EntityFilter>('all')

  const pendingTasks = useMemo(
    () => tasks.filter((task) => !task.completed).slice(0, 5),
    [tasks],
  )
  const completedTasks = useMemo(
    () => tasks.filter((task) => task.completed).slice(0, 5),
    [tasks],
  )

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSubject =
        taskSubjectFilter === 'all' || task.subject_id === Number(taskSubjectFilter)
      const matchesPriority =
        taskPriorityFilter === 'all' || task.priority === taskPriorityFilter
      const matchesStatus =
        (showPendingTasks && !task.completed) || (showCompletedTasks && task.completed)

      return matchesSubject && matchesPriority && matchesStatus
    })
  }, [tasks, taskSubjectFilter, taskPriorityFilter, showPendingTasks, showCompletedTasks])

  const filteredStudySessions = useMemo(() => {
    return studySessions.filter((session) => {
      return sessionSubjectFilter === 'all' || session.subject_id === Number(sessionSubjectFilter)
    })
  }, [studySessions, sessionSubjectFilter])

  const filteredStudyGoals = useMemo(() => {
    return studyGoals.filter((goal) => {
      return goalSubjectFilter === 'all' || goal.subject_id === Number(goalSubjectFilter)
    })
  }, [studyGoals, goalSubjectFilter])

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSubject =
        resourceSubjectFilter === 'all' || resource.subject_id === Number(resourceSubjectFilter)
      const matchesType =
        resourceTypeFilter === 'all' || resource.resource_type === resourceTypeFilter

      return matchesSubject && matchesType
    })
  }, [resources, resourceSubjectFilter, resourceTypeFilter])

  const filteredActivityLogs = useMemo(() => {
    return activityLogs.filter((log) => {
      const matchesAction = activityActionFilter === 'all' || log.action === activityActionFilter
      const matchesEntity = activityEntityFilter === 'all' || log.entity === activityEntityFilter

      return matchesAction && matchesEntity
    })
  }, [activityLogs, activityActionFilter, activityEntityFilter])

  return {
    taskSubjectFilter,
    setTaskSubjectFilter,
    taskPriorityFilter,
    setTaskPriorityFilter,
    showPendingTasks,
    setShowPendingTasks,
    showCompletedTasks,
    setShowCompletedTasks,
    sessionSubjectFilter,
    setSessionSubjectFilter,
    goalSubjectFilter,
    setGoalSubjectFilter,
    resourceSubjectFilter,
    setResourceSubjectFilter,
    resourceTypeFilter,
    setResourceTypeFilter,
    activityActionFilter,
    setActivityActionFilter,
    activityEntityFilter,
    setActivityEntityFilter,
    pendingTasks,
    completedTasks,
    filteredTasks,
    filteredStudySessions,
    filteredStudyGoals,
    filteredResources,
    filteredActivityLogs,
  }
}
