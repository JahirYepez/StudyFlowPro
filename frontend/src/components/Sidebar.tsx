import { Activity, BookOpen, Clock3, FolderOpen, GraduationCap, LayoutDashboard, ListTodo, LogOut, Target } from 'lucide-react'

export type ActiveView = 'dashboard' | 'subjects' | 'tasks' | 'sessions' | 'goals' | 'resources' | 'activity'

type SidebarProps = {
  activeView: ActiveView
  onViewChange: (view: ActiveView) => void
  onLogout: () => void
}

export function Sidebar({ activeView, onViewChange, onLogout }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <GraduationCap size={28} />
        <span>StudyFlow</span>
      </div>

      <nav>
        <button
          className={activeView === 'dashboard' ? 'sidebar-nav-button active' : 'sidebar-nav-button'}
          type="button"
          onClick={() => onViewChange('dashboard')}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </button>

        <button
          className={activeView === 'subjects' ? 'sidebar-nav-button active' : 'sidebar-nav-button'}
          type="button"
          onClick={() => onViewChange('subjects')}
        >
          <BookOpen size={18} />
          Materias
        </button>

        <button
          className={activeView === 'tasks' ? 'sidebar-nav-button active' : 'sidebar-nav-button'}
          type="button"
          onClick={() => onViewChange('tasks')}
        >
          <ListTodo size={18} />
          Tareas
        </button>

        <button
          className={activeView === 'sessions' ? 'sidebar-nav-button active' : 'sidebar-nav-button'}
          type="button"
          onClick={() => onViewChange('sessions')}
        >
          <Clock3 size={18} />
          Sesiones
        </button>

        <button
          className={activeView === 'goals' ? 'sidebar-nav-button active' : 'sidebar-nav-button'}
          type="button"
          onClick={() => onViewChange('goals')}
        >
          <Target size={18} />
          Metas
        </button>

        <button
          className={activeView === 'resources' ? 'sidebar-nav-button active' : 'sidebar-nav-button'}
          type="button"
          onClick={() => onViewChange('resources')}
        >
          <FolderOpen size={18} />
          Recursos
        </button>

        <button
          className={activeView === 'activity' ? 'sidebar-nav-button active' : 'sidebar-nav-button'}
          type="button"
          onClick={() => onViewChange('activity')}
        >
          <Activity size={18} />
          Actividad
        </button>
      </nav>

      <button className="logout-button" type="button" onClick={onLogout}>
        <LogOut size={18} />
        Salir
      </button>
    </aside>
  )
}
