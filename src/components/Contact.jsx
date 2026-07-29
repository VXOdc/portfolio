import { PROFILE } from '../data/portfolio';
import { useMagnetic, useReveal } from '../hooks/useMotion';

export default function Contact() {
  const { ref, visible } = useReveal(0.12);
  const emailRef = useMagnetic(0.25);
  const credlyRef = useMagnetic(0.25);

  return (
    <section id="contact" className="section contact-section" ref={ref}>
      <div className={`section-inner contact-inner ${visible ? 'is-visible' : ''}`}>
        <p className="section-eyebrow reveal-item">Get in touch</p>
        <h2 className="contact-title reveal-item">
          Let&apos;s build something
          <br />
          worth shipping.
        </h2>
        <p className="contact-sub reveal-item">
          Open to collaborations, internships, and interesting engineering problems.
        </p>

        <div className="contact-actions reveal-item">
          <a
            ref={emailRef}
            href={`mailto:${PROFILE.email}`}
            className="btn-primary magnetic"
            data-cursor="Email"
          >
            {PROFILE.email}
            <svg viewBox="0 0 10 10" aria-hidden="true">
              <path d="M2 8L8 2M8 2H3M8 2V7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a
            ref={credlyRef}
            href={PROFILE.credly}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
            data-cursor="Credly"
          >
            Credly Profile
          </a>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div>
          <p className="footer-name">{PROFILE.name}</p>
          <p className="footer-note">Made with passion in Cupertino</p>
        </div>
        <div className="footer-links">
          <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" data-cursor="GitHub">
            GitHub
          </a>
          <a href={`mailto:${PROFILE.email}`} data-cursor="Email">
            Email
          </a>
          <a href={PROFILE.credly} target="_blank" rel="noopener noreferrer" data-cursor="Credly">
            Credly
          </a>
        </div>
        <p className="footer-copy">&copy; {new Date().getFullYear()} {PROFILE.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
