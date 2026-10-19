import { useEffect, useState } from 'react'

function App() {
  const [health, setHealth] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setHealth(data))
      .catch(() => setError('Cannot reach the backend.'))
  }, [])

  return (
    <main>
      <h1>Kashif</h1>
      {error && <p>{error}</p>}
      {health && (
        <p>
          Backend: {health.status} | Database: {health.database}
        </p>
      )}
    </main>
  )
}

export default App