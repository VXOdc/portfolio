import { MARQUEE_ITEMS, PROFILE } from '../data/portfolio';
import { useMagnetic, useReveal } from '../hooks/useMotion';

export default function Hero() {
  const { ref, visible } = useReveal(0.1);
  const ctaRef = useMagnetic(0.3);

  return (
    <section className="hero" ref={ref}>
      <div className="hero-grid" aria-hidden="true" />

      <div className={`hero-content ${visible ? 'is-visible' : ''}`}>
        <p className="section-eyebrow reveal-item">Portfolio — {PROFILE.location}</p>

        <h1 className="hero-title reveal-item">
          <span className="hero-line">Noah</span>
          <span className="hero-line hero-line--accent">Ly</span>
        </h1>

        <p className="hero-tagline reveal-item">{PROFILE.tagline}</p>
        <p className="hero-bio reveal-item">{PROFILE.bio}</p>

        <div className="hero-actions reveal-item">
          <a
            ref={ctaRef}
            href="#work"
            className="btn-primary magnetic"
            data-cursor="Explore"
          >
            View Work
            <svg viewBox="0 0 10 10" aria-hidden="true">
              <path d="M2 8L8 2M8 2H3M8 2V7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="btn-ghost" data-cursor="GitHub">
            GitHub
          </a>
        </div>
      </div>

      <div className="hero-sticker hero-sticker--one reveal-item" aria-hidden="true">
        <span>AI</span>
      </div>
      <div className="hero-sticker hero-sticker--two reveal-item" aria-hidden="true">
        <span>Build</span>
      </div>
      <div className="hero-sticker hero-sticker--three reveal-item" aria-hidden="true">
        <span>Ship</span>
      </div>

      <Marquee />
    </section>
  );
}

function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="marquee-wrap" aria-hidden="true">
      <div className="marquee-track">
        {items.map((item, i) => (
          <span key={`${item}-${i}`} className="marquee-item">
            {item}
            <span className="marquee-dot" />
          </span>
        ))}
      </div>
    </div>
  );
}
