import { CERTS, PROFILE } from '../data/portfolio';
import { useReveal } from '../hooks/useMotion';

export default function Certifications() {
  const { ref, visible } = useReveal(0.1);

  return (
    <section id="certs" className="section certs-section" ref={ref}>
      <div className={`section-inner ${visible ? 'is-visible' : ''}`}>
        <div className="section-head reveal-item">
          <p className="section-eyebrow">Credentials</p>
          <h2 className="section-title">Certifications</h2>
          <a href={PROFILE.credly} target="_blank" rel="noopener noreferrer" className="section-link" data-cursor="Verify">
            View on Credly
            <svg viewBox="0 0 10 10" aria-hidden="true">
              <path d="M2 8L8 2M8 2H3M8 2V7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        <ul className="cert-list reveal-item">
          {CERTS.map((cert, i) => (
            <li key={cert.title} className="cert-row" style={{ '--i': i }}>
              <div className="cert-main">
                {cert.icon && (
                  <img src={cert.icon} alt="" className="cert-icon" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                )}
                <div>
                  <p className="cert-title">{cert.title}</p>
                  <p className="cert-issuer">{cert.issuer}</p>
                </div>
              </div>
              <div className="cert-side">
                {cert.verify && (
                  <a href={cert.verify} target="_blank" rel="noopener noreferrer" data-cursor="Verify">
                    Verify
                  </a>
                )}
                <span>{cert.date}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
