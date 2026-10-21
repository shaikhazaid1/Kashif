import { useAuth } from '../auth/AuthContext.jsx'
import './home.css'

function HomePage() {
  const { user } = useAuth()

  return (
    <main className="home">
      <section className="home__card">
        <p className="home__eyebrow">Signed in as {user.role}</p>
        <h1 className="home__title">Welcome, {user.first_name}</h1>
        <p className="home__text">
          This is your Kashif home page. Link checking and your reports will
          appear here soon.
        </p>
      </section>
    </main>
  )
}

export default HomePage