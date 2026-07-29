import { useState } from 'react';
import AIChatBubble from './components/AIChat.jsx';
import CustomCursor from './components/CustomCursor.jsx';
import Preloader from './components/Preloader.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Projects from './components/Projects.jsx';
import Certifications from './components/Certifications.jsx';
import Awards from './components/Awards.jsx';
import Leadership from './components/Leadership.jsx';
import Contact, { Footer } from './components/Contact.jsx';
import { usePrefersReducedMotion } from './hooks/useMotion';

export default function App() {
  const reduced = usePrefersReducedMotion();
  const [ready, setReady] = useState(reduced);

  return (
    <>
      {!ready && <Preloader onDone={() => setReady(true)} />}

      <div className={`site-shell ${ready ? 'site-shell--ready' : ''}`}>
        <CustomCursor />
        <div className="site-noise" aria-hidden="true" />
        <Header />
        <main>
          <Hero />
          <Projects />
          <Certifications />
          <Awards />
          <Leadership />
          <Contact />
        </main>
        <Footer />
        <AIChatBubble />
      </div>
    </>
  );
}
