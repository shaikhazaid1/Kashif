import { Link } from 'react-router'
import './auth.css'

function RegisterPage() {
  return (
    <div className="auth">
      <section className="auth__form-side">
        <h1 className="auth__title">Create an account</h1>
        <p className="auth__subtitle">The form is coming in the next step.</p>

        <p className="auth__switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </div>
  )
}

export default RegisterPage