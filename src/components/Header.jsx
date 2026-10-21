import { useEffect, useState } from 'react';
import { NAV_LINKS, PROFILE } from '../data/portfolio';
import { useMagnetic } from '../hooks/useMotion';

function NavLink({ href, label }) {
  const ref = useMagnetic(0.28);

  return (
    <a ref={ref} href={href} className="nav-link magnetic" data-cursor={label}>
      {label}
    </a>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const emailRef = useMagnetic(0.22);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <header className={`site-header ${scrolled ? 'site-header--scrolled' : ''}`}>
      <div className="site-header-inner">
        <a href="#" className="site-logo" data-cursor="Home">
          {PROFILE.name}
        </a>

        <nav className="site-nav" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>

        <a
          ref={emailRef}
          href={`mailto:${PROFILE.email}`}
          className="header-cta magnetic"
          data-cursor="Email"
        >
          Email
          <svg viewBox="0 0 10 10" aria-hidden="true">
            <path d="M2 8L8 2M8 2H3M8 2V7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        <button
          type="button"
          className="menu-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>

      <div className={`mobile-nav ${menuOpen ? 'mobile-nav--open' : ''}`}>
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </a>
        ))}
        <a href={`mailto:${PROFILE.email}`} onClick={() => setMenuOpen(false)}>
          Email Me
        </a>
      </div>
    </header>
  );
}
