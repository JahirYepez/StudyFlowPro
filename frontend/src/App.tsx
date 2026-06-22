import './styles/App.css'
import { ActivityPanel } from './components/ActivityPanel'
import { AuthPanel } from './components/AuthPanel'
import { DashboardCards } from './components/DashboardCards'
import { DashboardTasksPanel } from './components/DashboardTasksPanel'
import { ResourcesPanel } from './components/ResourcesPanel'
import { Sidebar } from './components/Sidebar'
import { StudyGoalsPanel } from './components/StudyGoalsPanel'
import { StudySessionsPanel } from './components/StudySessionsPanel'
import { SubjectsPanel } from './components/SubjectsPanel'
import { TasksPanel } from './components/TasksPanel'
import { useStudyFlowApp } from './hooks/useStudyFlowApp'

function App() {
  const app = useStudyFlowApp()

  if (!app.isAuthenticated || !app.currentUser) {
    return (
      <AuthPanel
        authMode={app.authMode}
        error={app.error}
        saving={app.saving}
        themeMode={app.themeMode}
        onModeChange={app.setAuthMode}
        onToggleTheme={() => app.setThemeMode((current) => (current === 'mono' ? 'palette' : 'mono'))}
        onSubmit={app.handleAuth}
      />
    )
  }

  return (
    <main className="app-shell" data-theme={app.themeMode}>
      <Sidebar activeView={app.activeView} onViewChange={app.setActiveView} onLogout={app.handleLogout} />

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Panel academico</p>
            <h1>{app.viewTitle}</h1>
          </div>

          <div className="topbar-actions">
            <button className="ghost-button" type="button" onClick={() => app.loadAppData()}>
              Actualizar
            </button>
            <button
              className="theme-button"
              type="button"
              onClick={() => app.setThemeMode((current) => (current === 'mono' ? 'palette' : 'mono'))}
            >
              {app.themeMode === 'mono' ? 'Paleta' : 'B/N'}
            </button>
          </div>
        </header>

        {app.error && <p className="error-message wide">{app.error}</p>}

        {app.activeView === 'dashboard' && (
          <>
            <section className="dashboard-group dashboard-summary-group">
              <div className="dashboard-group-heading">
                <h2>Resumen academico</h2>
                <span>Estado general del proyecto</span>
              </div>
              <DashboardCards dashboard={app.dashboard} subjects={app.subjects} />
            </section>

            <section className="dashboard-group dashboard-tasks-group">
              <div className="dashboard-group-heading">
                <h2>Estado de tareas</h2>
                <span>Pendientes y completadas recientes</span>
              </div>
              <section className="dashboard-task-grid">
                <DashboardTasksPanel
                  title="Tareas pendientes"
                  emptyMessage="No hay tareas pendientes por ahora."
                  loading={app.loading}
                  saving={app.saving}
                  tasks={app.pendingTasks}
                  subjects={app.subjects}
                  actionLabel="Completar"
                  actionType="complete"
                  onToggleTaskCompleted={app.handleToggleTaskCompleted}
                />
                <DashboardTasksPanel
                  title="Tareas completadas"
                  emptyMessage="Aun no hay tareas completadas."
                  loading={app.loading}
                  saving={app.saving}
                  tasks={app.completedTasks}
                  subjects={app.subjects}
                  actionLabel="Reabrir"
                  actionType="reopen"
                  onToggleTaskCompleted={app.handleToggleTaskCompleted}
                />
              </section>
            </section>
          </>
        )}

        {app.activeView === 'subjects' && (
          <SubjectsPanel
            subjects={app.subjects}
            saving={app.saving}
            subjectForm={app.subjectForm}
            editingSubjectId={app.editingSubjectId}
            editingSubjectForm={app.editingSubjectForm}
            onSubjectFormChange={app.setSubjectForm}
            onEditingSubjectFormChange={app.setEditingSubjectForm}
            onCreateSubject={app.handleCreateSubject}
            onStartEditSubject={app.handleStartEditSubject}
            onCancelEditSubject={app.handleCancelEditSubject}
            onUpdateSubject={app.handleUpdateSubject}
            onDeleteSubject={app.handleDeleteSubject}
          />
        )}

        {app.activeView === 'tasks' && (
          <section className="tasks-view">
            <TasksPanel
              tasks={app.filteredTasks}
              totalTasks={app.tasks.length}
              subjects={app.subjects}
              saving={app.saving}
              taskForm={app.taskForm}
              editingTaskId={app.editingTaskId}
              editingTaskForm={app.editingTaskForm}
              taskSubjectFilter={app.taskSubjectFilter}
              taskPriorityFilter={app.taskPriorityFilter}
              showPendingTasks={app.showPendingTasks}
              showCompletedTasks={app.showCompletedTasks}
              onTaskFormChange={app.setTaskForm}
              onEditingTaskFormChange={app.setEditingTaskForm}
              onTaskSubjectFilterChange={app.setTaskSubjectFilter}
              onTaskPriorityFilterChange={app.setTaskPriorityFilter}
              onShowPendingTasksChange={app.setShowPendingTasks}
              onShowCompletedTasksChange={app.setShowCompletedTasks}
              onCreateTask={app.handleCreateTask}
              onStartEditTask={app.handleStartEditTask}
              onCancelEditTask={app.handleCancelEditTask}
              onUpdateTask={app.handleUpdateTask}
              onDeleteTask={app.handleDeleteTask}
              onToggleTaskCompleted={app.handleToggleTaskCompleted}
            />
          </section>
        )}

        {app.activeView === 'sessions' && (
          <StudySessionsPanel
            sessions={app.filteredStudySessions}
            totalSessions={app.studySessions.length}
            subjects={app.subjects}
            saving={app.saving}
            sessionForm={app.sessionForm}
            editingSessionId={app.editingSessionId}
            editingSessionForm={app.editingSessionForm}
            sessionSubjectFilter={app.sessionSubjectFilter}
            onSessionFormChange={app.setSessionForm}
            onEditingSessionFormChange={app.setEditingSessionForm}
            onSessionSubjectFilterChange={app.setSessionSubjectFilter}
            onCreateSession={app.handleCreateSession}
            onStartEditSession={app.handleStartEditSession}
            onCancelEditSession={app.handleCancelEditSession}
            onUpdateSession={app.handleUpdateSession}
            onDeleteSession={app.handleDeleteSession}
          />
        )}

        {app.activeView === 'goals' && (
          <StudyGoalsPanel
            goals={app.filteredStudyGoals}
            totalGoals={app.studyGoals.length}
            subjects={app.subjects}
            saving={app.saving}
            goalForm={app.goalForm}
            editingGoalId={app.editingGoalId}
            editingGoalForm={app.editingGoalForm}
            goalSubjectFilter={app.goalSubjectFilter}
            onGoalFormChange={app.setGoalForm}
            onEditingGoalFormChange={app.setEditingGoalForm}
            onGoalSubjectFilterChange={app.setGoalSubjectFilter}
            onCreateGoal={app.handleCreateGoal}
            onStartEditGoal={app.handleStartEditGoal}
            onCancelEditGoal={app.handleCancelEditGoal}
            onUpdateGoal={app.handleUpdateGoal}
            onDeleteGoal={app.handleDeleteGoal}
            onUpdateGoalProgress={app.handleUpdateGoalProgress}
          />
        )}

        {app.activeView === 'resources' && (
          <ResourcesPanel
            resources={app.filteredResources}
            totalResources={app.resources.length}
            subjects={app.subjects}
            saving={app.saving}
            resourceForm={app.resourceForm}
            editingResourceId={app.editingResourceId}
            editingResourceForm={app.editingResourceForm}
            resourceSubjectFilter={app.resourceSubjectFilter}
            resourceTypeFilter={app.resourceTypeFilter}
            onResourceFormChange={app.setResourceForm}
            onEditingResourceFormChange={app.setEditingResourceForm}
            onResourceSubjectFilterChange={app.setResourceSubjectFilter}
            onResourceTypeFilterChange={app.setResourceTypeFilter}
            onCreateResource={app.handleCreateResource}
            onStartEditResource={app.handleStartEditResource}
            onCancelEditResource={app.handleCancelEditResource}
            onUpdateResource={app.handleUpdateResource}
            onDeleteResource={app.handleDeleteResource}
          />
        )}

        {app.activeView === 'activity' && (
          <ActivityPanel
            logs={app.filteredActivityLogs}
            totalLogs={app.activityLogs.length}
            actionFilter={app.activityActionFilter}
            entityFilter={app.activityEntityFilter}
            onActionFilterChange={app.setActivityActionFilter}
            onEntityFilterChange={app.setActivityEntityFilter}
          />
        )}
      </section>
    </main>
  )
}

export default App
