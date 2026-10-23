import { Navigate, Route, Routes } from 'react-router'
import TopBar from './components/TopBar.jsx'
import GuestRoute from './features/auth/components/GuestRoute.jsx'
import ProtectedRoute from './features/auth/components/ProtectedRoute.jsx'
import LoginPage from './features/auth/LoginPage.jsx'
import RegisterPage from './features/auth/RegisterPage.jsx'
import HomePage from './features/home/HomePage.jsx'
import MfaPage from './features/auth/MfaPage.jsx'

function App() {
  return (
    <>
      <TopBar />
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/mfa" element={<MfaPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  )
}

export default App