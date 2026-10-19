import PearlIllustration from '../illustrations/PearlIllustration.jsx'
import ZigzagPattern from '../illustrations/ZigzagPattern.jsx'
import '../showcase.css'

function AuthShowcase() {
  return (
    <aside className="auth__showcase showcase">
      <ZigzagPattern className="showcase__pattern" />

      <p className="showcase__brand">Kashif</p>

      <div className="showcase__slide">
        <PearlIllustration className="showcase__art" />
        <h2 className="showcase__title">Not every shiny link is real.</h2>
        <p className="showcase__text">
          Like a pearl diver telling a real pearl from a fake, Kashif helps
          you check a link before you trust it.
        </p>
      </div>
    </aside>
  )
}

export default AuthShowcase