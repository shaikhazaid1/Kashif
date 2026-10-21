import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../AuthContext.jsx'

function ProtectedRoute() {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <p className="page-status" role="status">Loading…</p>
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export default ProtectedRoute