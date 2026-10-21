import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../AuthContext.jsx'

function GuestRoute() {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <p className="page-status" role="status">Loading…</p>
  }

  if (user) {
    const destination = location.state?.from ?? '/home'
    return <Navigate to={destination} replace />
  }

  return <Outlet />
}

export default GuestRoute