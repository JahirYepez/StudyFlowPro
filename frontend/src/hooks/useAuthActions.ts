import type { Dispatch, SetStateAction } from 'react'
import { apiRequest } from '../api/http'
import type { ActiveView } from '../components/Sidebar'
import type { TokenResponse, User } from '../types/api'
import type { AuthMode, AuthPayload } from '../types/forms'
import { clearAuthSession, saveAuthSession } from '../utils/storage'

type AuthActionsParams = {
  authMode: AuthMode
  setToken: Dispatch<SetStateAction<string | null>>
  setUser: Dispatch<SetStateAction<User | null>>
  setActiveView: Dispatch<SetStateAction<ActiveView>>
  setSaving: Dispatch<SetStateAction<boolean>>
  setError: (message: string) => void
  resetAppData: () => void
}

export function useAuthActions({
  authMode,
  setToken,
  setUser,
  setActiveView,
  setSaving,
  setError,
  resetAppData,
}: AuthActionsParams) {
  async function handleAuth(payload: AuthPayload) {
    setSaving(true)
    setError('')

    try {
      if (authMode === 'register') {
        await apiRequest<User>('/auth/register', {
          method: 'POST',
          body: {
            full_name: payload.fullName,
            email: payload.email,
            password: payload.password,
          },
        })
      }

      const loginResponse = await apiRequest<TokenResponse>('/auth/login', {
        method: 'POST',
        body: {
          email: payload.email,
          password: payload.password,
        },
      })

      saveAuthSession(loginResponse.access_token, loginResponse.user)

      setToken(loginResponse.access_token)
      setUser(loginResponse.user)
      setActiveView('dashboard')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo iniciar sesion.')
    } finally {
      setSaving(false)
    }
  }

  function handleLogout() {
    clearAuthSession()
    setToken(null)
    setUser(null)
    resetAppData()
    setActiveView('dashboard')
  }

  return {
    handleAuth,
    handleLogout,
  }
}
