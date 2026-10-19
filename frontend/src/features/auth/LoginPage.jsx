import './auth.css'

function LoginPage() {
  return (
    <div className="auth">
      <section className="auth__form-side">
        <h1 className="auth__title">Welcome back</h1>
        <p className="auth__subtitle">
          Sign in to check links and follow up on your reports.
        </p>

        <form className="auth__form">
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
            />
          </div>

          <button type="submit" className="btn btn--primary btn--block">
            Sign in
          </button>
        </form>

        <p className="auth__switch">
          Don't have an account? <a href="#">Create one</a>
        </p>
      </section>
    </div>
  )
}

export default LoginPage