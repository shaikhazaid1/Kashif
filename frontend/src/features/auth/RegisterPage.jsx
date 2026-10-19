import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { register } from './authApi.js'
import './auth.css'

function RegisterPage() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsSubmitting(true)
    try {
      await register(fullName, email, password)
      navigate('/login', { state: { registered: true } })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth">
      <section className="auth__form-side">
        <h1 className="auth__title">Create an account</h1>
        <p className="auth__subtitle">
          Register to check suspicious links and track your reports.
        </p>

        <form className="auth__form" method="post" onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert--error" role="alert">
              {error}
            </div>
          )}

          <div className="field">
            <label className="field__label" htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              className="input"
              autoComplete="name"
              minLength={2}
              maxLength={150}
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="input"
              placeholder="name@example.com"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="input"
              autoComplete="new-password"
              minLength={12}
              maxLength={128}
              required
              aria-describedby="password-hint"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span id="password-hint" className="field__hint">
              At least 12 characters.
            </span>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="confirmPassword">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="input"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn--primary btn--block"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="auth__switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </div>
  )
}

export default RegisterPage