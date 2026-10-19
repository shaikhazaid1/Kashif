import ZigzagPattern from '../illustrations/ZigzagPattern.jsx'
import '../showcase.css'

function AuthShowcase({ image, imagePosition, title, text }) {
  return (
    <aside className="auth__showcase showcase">
      <img
        className="showcase__photo"
        src={image}
        alt=""
        style={{ objectPosition: imagePosition }}
      />
      <div className="showcase__overlay" />
      <ZigzagPattern className="showcase__pattern" />

      <p className="showcase__brand">Kashif</p>

      <div className="showcase__slide">
        <h2 className="showcase__title">{title}</h2>
        <p className="showcase__text">{text}</p>
      </div>
    </aside>
  )
}

export default AuthShowcase