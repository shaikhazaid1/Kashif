import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { register } from './authApi.js'
import './auth.css'
import PasswordInput from './components/PasswordInput.jsx'
import PasswordStrength from './components/PasswordStrength.jsx'
import AuthShowcase from './components/AuthShowcase.jsx'

function RegisterPage() {
    const navigate = useNavigate()
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword
    const showMismatch = confirmPassword.length > 0 && password !== confirmPassword

    async function handleSubmit(event) {
        event.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        setIsSubmitting(true)
        try {
            await register({ firstName, lastName, email, phone, password })
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

                    <div className="auth__row">
                        <div className="field">
                            <label className="field__label" htmlFor="firstName">First name</label>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                className="input"
                                autoComplete="given-name"
                                minLength={2}
                                maxLength={75}
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>

                        <div className="field">
                            <label className="field__label" htmlFor="lastName">Last name</label>
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                className="input"
                                autoComplete="family-name"
                                minLength={2}
                                maxLength={75}
                                required
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
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
                        <label className="field__label" htmlFor="phone">Mobile number</label>
                        <div className="input-group">
                            <span className="input-group__prefix" aria-hidden="true">+973</span>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                inputMode="numeric"
                                className="input input-group__field"
                                autoComplete="tel-national"
                                placeholder="3XXXXXXX"
                                pattern="[0-9]{8}"
                                maxLength={8}
                                required
                                aria-describedby="phone-hint"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label className="field__label" htmlFor="password">Password</label>
                        <PasswordInput
                            id="password"
                            name="password"
                            autoComplete="new-password"
                            minLength={12}
                            maxLength={128}
                            required
                            aria-describedby="password-strength"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <PasswordStrength id="password-strength" password={password} />
                    </div>

                    <div className="field">
                        <label className="field__label" htmlFor="confirmPassword">
                            Confirm password
                        </label>
                        <PasswordInput
                            id="confirmPassword"
                            name="confirmPassword"
                            autoComplete="new-password"
                            required
                            aria-invalid={showMismatch}
                            aria-describedby="confirm-password-status"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {confirmPassword && (
                            <span
                                id="confirm-password-status"
                                className={passwordsMatch ? 'field__success' : 'field__error'}
                                aria-live="polite"
                            >
                                {passwordsMatch ? '✓ Passwords match' : '✕ Passwords do not match'}
                            </span>
                        )}
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
                  <AuthShowcase />
        </div>
    )
}

export default RegisterPage