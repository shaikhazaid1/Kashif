import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { QRCodeSVG } from 'qrcode.react'
import { setupMfa, verifyMfa } from './authApi.js'
import { useAuth } from './AuthContext.jsx'
import AuthShowcase from './components/AuthShowcase.jsx'
import './auth.css'
import './mfa.css'

function MfaPage() {
  const location = useLocation()
  const { refreshUser } = useAuth()
  const setupRequired = location.state?.setupRequired === true

  const [setup, setSetup] = useState(null)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const setupRequested = useRef(false)

   useEffect(() => {
    if (!setupRequired || setupRequested.current) return
    setupRequested.current = true

    setupMfa()
      .then(setSetup)
      .catch((err) => setError(err.message))
  }, [setupRequired])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await verifyMfa(code)
      await refreshUser()
    } catch (err) {
      setError(err.message)
      setCode('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth">
      <div className="auth__frame">
        <section className="auth__form-side">
          <h1 className="auth__title">
            {setupRequired ? 'Set up two-step verification' : 'Two-step verification'}
          </h1>
          <p className="auth__subtitle">
            {setupRequired
              ? 'For your security, staff accounts need a second step. It only takes a minute.'
              : 'Enter the 6-digit code from your authenticator app.'}
          </p>

          {setupRequired && setup && (
            <div className="mfa__setup">
                              <ol className="mfa__steps">
                <li>
                  Install <strong>Microsoft Authenticator</strong> on your phone (
                  <a
                    href="https://apps.apple.com/app/microsoft-authenticator/id983156458"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    iPhone
                  </a>
                  {' · '}
                  <a
                    href="https://play.google.com/store/apps/details?id=com.azure.authenticator"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Android
                  </a>
                  ).
                </li>
                <li>
                  Open the app, tap <strong>+</strong>, then choose <strong>Other account</strong>.
                </li>
                <li>Scan the QR code below with your phone.</li>
                <li>Type the 6-digit code that appears in the app.</li>
              </ol>
              <QRCodeSVG
                value={setup.otpauth_uri}
                size={176}
                marginSize={2}
                className="mfa__qr"
                title="Authenticator QR code"
              />
              <p className="mfa__manual">Can't scan it? Enter this key manually:</p>
              <code className="mfa__secret">{setup.secret}</code>
                            <p className="mfa__hint">
                Already use Google Authenticator or another app? It works too.
              </p>
            </div>

        
          )}

          <form className="auth__form" method="post" onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert--error" role="alert">
                {error}
              </div>
            )}

            <div className="field">
              <label className="field__label" htmlFor="code">Verification code</label>
              <input
                id="code"
                name="code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                className="input mfa__code"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            <button
              type="submit"
              className="btn btn--primary btn--block"
              disabled={isSubmitting || code.length !== 6}
            >
              {isSubmitting ? 'Verifying…' : 'Verify'}
            </button>
          </form>

          <p className="auth__switch">
            <Link to="/login">Back to sign in</Link>
          </p>
        </section>

        <AuthShowcase />
      </div>
    </div>
  )
}

export default MfaPage