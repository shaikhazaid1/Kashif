import { Navigate, Route, Routes } from 'react-router'
import TopBar from './components/TopBar.jsx'
import LoginPage from './features/auth/LoginPage.jsx'
import RegisterPage from './features/auth/RegisterPage.jsx'

function App() {
  return (
    <>
      <TopBar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  )
}

export default App