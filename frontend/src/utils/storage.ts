import type { User } from '../types/api'
import type { ThemeMode } from '../types/forms'

const TOKEN_KEY = 'studyflow_token'
const USER_KEY = 'studyflow_user'
const THEME_KEY = 'studyflow_theme'

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser(): User | null {
  const storedUser = localStorage.getItem(USER_KEY)
  return storedUser ? JSON.parse(storedUser) : null
}

export function getStoredTheme(): ThemeMode {
  return (localStorage.getItem(THEME_KEY) as ThemeMode) || 'mono'
}

export function saveTheme(themeMode: ThemeMode) {
  localStorage.setItem(THEME_KEY, themeMode)
}

export function saveAuthSession(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
