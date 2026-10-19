import { useState } from 'react'
import { login } from './authApi.js'
import { Link, useLocation } from 'react-router'
import './auth.css'

function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const location = useLocation()
    const justRegistered = location.state?.registered === true

    async function handleSubmit(event) {
        event.preventDefault()
        setError('')
        setSuccess('')
        setIsSubmitting(true)

        try {
            const data = await login(email, password)
            setSuccess(`Signed in successfully as ${data.role}.`)
        } catch (err) {
            setError(err.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="auth">
            <section className="auth__form-side">
                <h1 className="auth__title">Welcome back</h1>
                <p className="auth__subtitle">
                    Sign in to check links and follow up on your reports.
                </p>

                <form className="auth__form" method="post" onSubmit={handleSubmit}>
                    {justRegistered && !error && !success && (
                        <div className="alert alert--success" role="status">
                            Account created. Please sign in.
                        </div>
                    )}
                    {error && (
                        <div className="alert alert--error" role="alert">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="alert alert--success" role="status">
                            {success}
                        </div>
                    )}

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
                            placeholder="Your password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn--primary btn--block"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <p className="auth__switch">
                    Don't have an account? <Link to="/register">Create one</Link>
                </p>
            </section>
        </div>
    )
}

export default LoginPage