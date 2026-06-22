import { GraduationCap } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import type { AuthMode, AuthPayload, ThemeMode } from '../types/forms'

type AuthPanelProps = {
  authMode: AuthMode
  error: string
  saving: boolean
  themeMode: ThemeMode
  onModeChange: (mode: AuthMode) => void
  onToggleTheme: () => void
  onSubmit: (payload: AuthPayload) => Promise<void>
}

export function AuthPanel({
  authMode,
  error,
  saving,
  themeMode,
  onModeChange,
  onToggleTheme,
  onSubmit,
}: AuthPanelProps) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [localError, setLocalError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const cleanName = fullName.trim()
    const cleanEmail = email.trim().toLowerCase()

    if (authMode === 'register' && cleanName.length < 3) {
      setLocalError('El nombre debe tener al menos 3 caracteres.')
      return
    }

    if (!cleanEmail.includes('@')) {
      setLocalError('Ingresa un correo valido.')
      return
    }

    if (password.length < 8) {
      setLocalError('La contrasena debe tener al menos 8 caracteres.')
      return
    }

    if (!/[A-Z]/.test(password)) {
      setLocalError('La contrasena debe incluir al menos una letra mayuscula.')
      return
    }

    if (!/[0-9]/.test(password)) {
      setLocalError('La contrasena debe incluir al menos un numero.')
      return
    }

    if (authMode === 'register' && password !== confirmPassword) {
      setLocalError('Las contrasenas no coinciden.')
      return
    }

    setLocalError('')
    await onSubmit({
      fullName: cleanName,
      email: cleanEmail,
      password,
    })
  }

  return (
    <main className="auth-page" data-theme={themeMode}>
      <button className="auth-theme-button" type="button" onClick={onToggleTheme}>
        {themeMode === 'mono' ? 'Paleta' : 'B/N'}
      </button>

      <section className="auth-panel">
        <div className="brand-mark">
          <GraduationCap size={34} />
        </div>

        <h1>StudyFlow</h1>
        <p className="auth-copy">
          Organiza tus materias, tareas y sesiones de estudio desde un panel claro.
        </p>

        <div className="auth-tabs">
          <button
            className={authMode === 'login' ? 'active' : ''}
            type="button"
            onClick={() => onModeChange('login')}
          >
            Iniciar sesion
          </button>
          <button
            className={authMode === 'register' ? 'active' : ''}
            type="button"
            onClick={() => onModeChange('register')}
          >
            Crear cuenta
          </button>
        </div>

        <form className="form-stack" onSubmit={handleSubmit}>
          {authMode === 'register' && (
            <label>
              Nombre completo
              <input value={fullName} onChange={(event) => setFullName(event.target.value)} />
            </label>
          )}

          <label>
            Correo
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>

          <label>
            Contrasena
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <small className="password-help">
              Minimo 8 caracteres, una mayuscula y un numero.
            </small>
          </label>

          {authMode === 'register' && (
            <label>
              Confirmar contrasena
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </label>
          )}

          {(localError || error) && <p className="error-message">{localError || error}</p>}

          <button className="primary-button" type="submit" disabled={saving}>
            {saving ? 'Procesando...' : authMode === 'login' ? 'Entrar' : 'Registrarme'}
          </button>
        </form>
      </section>
    </main>
  )
}
