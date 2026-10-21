import { Link } from 'react-router'
import { useTheme } from '../hooks/useTheme.js'
import { useAuth } from '../features/auth/AuthContext.jsx'

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  )
}

function TopBar() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const { user, logout } = useAuth()

  return (
    <header className="topbar">
      <Link to="/" className="topbar__brand">Kashif</Link>

      <div className="topbar__actions">
        {user && (
          <>
            <span className="topbar__user">{user.first_name}</span>
            <button type="button" className="topbar__button" onClick={logout}>
              Sign out
            </button>
          </>
        )}

        <button
          type="button"
          className="topbar__button"
          lang="ar"
          disabled
          title="Arabic is coming soon"
        >
          العربية
        </button>

        <button
          type="button"
          className="topbar__icon-button"
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-pressed={isDark}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </header>
  )
}

export default TopBar