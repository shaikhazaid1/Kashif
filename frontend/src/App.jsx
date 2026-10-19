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

            <div className="field">
        <label className="field__label" htmlFor="demo-email">Email</label>
        <input id="demo-email" className="input" type="email" placeholder="name@example.com" />
      </div>
      <button className="btn btn--primary">Sign in</button>
      <button className="btn btn--secondary">Cancel</button>
    </main>
  )
}

export default App