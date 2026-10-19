import { useEffect, useState } from 'react'
import { SHOWCASE_SLIDES } from '../showcaseContent.js'
import '../showcase.css'

const SLIDE_DURATION_MS = 4000

function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function AuthShowcase() {
    const [activeIndex, setActiveIndex] = useState(0)
    const [isPaused, setIsPaused] = useState(false)

    useEffect(() => {
        if (isPaused || prefersReducedMotion()) return

        const timer = setTimeout(() => {
            setActiveIndex((current) => (current + 1) % SHOWCASE_SLIDES.length)
        }, SLIDE_DURATION_MS)

        return () => clearTimeout(timer)
    }, [activeIndex, isPaused])

    const activeSlide = SHOWCASE_SLIDES[activeIndex]

    return (
        <aside
            className="auth__showcase showcase"
            aria-roledescription="carousel"
            aria-label="About Kashif"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
        >
            {SHOWCASE_SLIDES.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`showcase__media ${index === activeIndex ? 'showcase__media--active' : ''}`}
                >
                    {slide.fit === 'contain' && (
                        <img className="showcase__backdrop" src={slide.image} alt="" />
                    )}
                    <img
                        className="showcase__photo"
                        src={slide.image}
                        alt=""
                        style={{
                            objectPosition: slide.imagePosition,
                            objectFit: slide.fit ?? 'cover',
                        }}
                    />
                </div>
            ))}
            <div className="showcase__overlay" />

            <div className="showcase__slide">
                <p className="showcase__brand">Kashif</p>

                <div
                    key={activeSlide.id}
                    className="showcase__caption"
                    aria-live={isPaused ? 'polite' : 'off'}
                >
                    <h2 className="showcase__title">{activeSlide.title}</h2>
                    <p className="showcase__text">{activeSlide.text}</p>
                </div>

                <div className="showcase__dots">
                    {SHOWCASE_SLIDES.map((slide, index) => (
                        <button
                            key={slide.id}
                            type="button"
                            className={`showcase__dot ${index === activeIndex ? 'showcase__dot--active' : ''}`}
                            aria-label={`Show slide ${index + 1} of ${SHOWCASE_SLIDES.length}`}
                            aria-current={index === activeIndex}
                            onClick={() => setActiveIndex(index)}
                        />
                    ))}
                </div>
            </div>
        </aside>
    )
}

export default AuthShowcase