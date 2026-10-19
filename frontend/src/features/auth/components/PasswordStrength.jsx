import {
  PASSWORD_MIN_LENGTH,
  getPasswordChecks,
  getPasswordStrength,
} from '../passwordStrength.js'

const STRENGTH_LABELS = {
  weak: 'Weak',
  medium: 'Medium',
  strong: 'Strong',
}

function PasswordStrength({ id, password }) {
  if (!password) {
    return (
      <span id={id} className="field__hint">
        At least {PASSWORD_MIN_LENGTH} characters.
      </span>
    )
  }

  const strength = getPasswordStrength(password)
  const checks = getPasswordChecks(password)

  return (
    <div id={id} className="password-strength">
      <div className="password-strength__meter">
        <div className="password-strength__track">
          <div className={`password-strength__fill password-strength__fill--${strength}`} />
        </div>
        <span
          className={`password-strength__label password-strength__label--${strength}`}
          aria-live="polite"
        >
          {STRENGTH_LABELS[strength]}
        </span>
      </div>

      <ul className="password-strength__checks">
        {checks.map((check) => (
          <li
            key={check.id}
            className={`password-strength__check ${check.met ? 'password-strength__check--met' : ''}`}
          >
            <span aria-hidden="true">{check.met ? '✓' : '○'}</span>
            <span>{check.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PasswordStrength