import { useState } from 'react'
import { apiBaseUrl } from '../config/api.js'
import { supabase, isSupabaseConfigured } from '../lib/supabase.js'
import GoogleIcon from '../components/GoogleIcon.jsx'
import './StaffLogin.css'

function StaffLogin({ onLoginSuccess, onCancel, notice }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const validate = () => {
    const errors = {}
    if (!email.trim()) {
      errors.email = 'Staff email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Enter a valid staff email address.'
    }
    if (!password) {
      errors.password = 'Password is required.'
    }
    return errors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isSubmitting) return
    setErrorMessage('')

    const errors = validate()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setIsSubmitting(true)
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })
        if (error) {
          throw new Error(error.message || 'Invalid staff email or password.')
        }
        if (data?.user) {
          const staffObj = {
            email: data.user.email,
            name: data.user.user_metadata?.name || 'Staff Member',
            role: 'staff',
          }
          onLoginSuccess(staffObj, '')
          return
        }
      }

      const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid staff email or password. Please check your credentials.')
        }
        if (data?.error?.message) {
          throw new Error(data.error.message)
        }
        throw new Error(`Sign in failed (HTTP ${response.status}).`)
      }

      if (data?.status === 'ok' && data.user) {
        onLoginSuccess(data.user, data.csrfToken || '')
      } else {
        throw new Error('The server response did not confirm authentication.')
      }
    } catch (err) {
      setErrorMessage(
        err instanceof TypeError
          ? 'Unable to reach the CampusFind authentication service. Please ensure the backend server is running.'
          : err.message,
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignIn = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setErrorMessage('Supabase is not configured.')
      return
    }
    setIsSubmitting(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      })
      if (error) throw error
    } catch (err) {
      setErrorMessage(err.message || 'Google sign-in could not be initiated.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="staff-login-page">
      <div className="staff-login-container">
        <section className="staff-login-header">
          <span className="staff-login-badge">
            <span className="badge-shield" aria-hidden="true">🛡️</span>
            Staff Portal
          </span>
          <h1>Staff sign in</h1>
          <p>
            Authorized access for campus security personnel and lost-and-found portal administrators.
          </p>
        </section>

        {notice && (
          <div className="staff-login-notice" role="status" aria-live="polite">
            <span aria-hidden="true">ℹ️</span>
            <span>{notice}</span>
          </div>
        )}

        {errorMessage && (
          <div className="staff-login-alert" role="alert" aria-live="assertive">
            <span className="alert-icon" aria-hidden="true">⚠️</span>
            <div className="alert-content">
              <strong>Sign in failed</strong>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <button
            type="button"
            className="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '11px 16px',
              background: '#fff',
              border: '1px solid #dcdcdc',
              borderRadius: '8px',
              fontWeight: '600',
              color: '#3c4043',
              cursor: 'pointer',
              fontSize: '14px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
            }}
          >
            <GoogleIcon size={18} />
            <span>Continue with Google</span>
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              margin: '20px 0 16px',
              color: '#8c959f',
              fontSize: '12px',
            }}
          >
            <div style={{ flex: 1, height: '1px', background: '#e1e4e8' }} />
            <span style={{ padding: '0 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              or sign in with password
            </span>
            <div style={{ flex: 1, height: '1px', background: '#e1e4e8' }} />
          </div>
        </div>

        <form className="staff-login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <label htmlFor="staff-login-email">
              Staff email <span aria-hidden="true">*</span>
            </label>
            <input
              id="staff-login-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }))
                setErrorMessage('')
              }}
              placeholder="e.g. staff@campusfind.edu"
              required
              autoFocus
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? 'staff-email-error' : undefined}
            />
            {fieldErrors.email && (
              <p className="login-field-error" id="staff-email-error">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div className="login-field">
            <label htmlFor="staff-login-password">
              Staff password <span aria-hidden="true">*</span>
            </label>
            <input
              id="staff-login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }))
                setErrorMessage('')
              }}
              placeholder="Enter your staff password"
              required
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={fieldErrors.password ? 'staff-password-error' : undefined}
            />
            {fieldErrors.password && (
              <p className="login-field-error" id="staff-password-error">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <div className="staff-login-actions">
            <button
              className="button button-dark login-submit-button"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Authenticating…' : 'Sign in to Staff Portal'}
            </button>
            {onCancel && (
              <button
                className="button button-outline"
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Back to CampusFind
              </button>
            )}
          </div>
        </form>

        <div className="staff-login-footer">
          <div className="security-notice">
            <span className="security-icon" aria-hidden="true">🔒</span>
            <div>
              <strong>Protected Campus Resource</strong>
              <p>
                Staff sessions use cryptographic token authentication protected by Supabase security policies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StaffLogin
