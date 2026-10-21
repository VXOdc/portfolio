import { useEffect, useState } from 'react';
import { PROFILE } from '../data/portfolio';
import { usePrefersReducedMotion } from '../hooks/useMotion';

export default function Preloader({ onDone }) {
  const reduced = usePrefersReducedMotion();
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduced) {
      onDone();
      return undefined;
    }

    let p = 0;
    const id = setInterval(() => {
      p += Math.random() * 18 + 8;
      if (p >= 100) {
        p = 100;
        clearInterval(id);
        setTimeout(() => {
          setDone(true);
          setTimeout(onDone, 900);
        }, 200);
      }
      setProgress(Math.min(p, 100));
    }, 60);

    return () => clearInterval(id);
  }, [onDone, reduced]);

  if (reduced) return null;

  return (
    <div className={`preloader ${done ? 'preloader--done' : ''}`} aria-hidden="true">
      <div className="preloader-inner">
        <p className="preloader-name">{PROFILE.name}</p>
        <div className="preloader-track">
          <div className="preloader-bar" style={{ width: `${progress}%` }} />
        </div>
        <span className="preloader-count">{Math.round(progress)}</span>
      </div>
    </div>
  );
}
