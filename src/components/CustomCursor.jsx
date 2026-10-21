import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../hooks/useMotion';

export default function CustomCursor() {
  const reduced = usePrefersReducedMotion();
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const raf = useRef(0);
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState('');
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const wide = window.innerWidth >= 768;
    setEnabled(fine && wide && !reduced);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return undefined;

    document.body.classList.add('custom-cursor-active');

    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const tick = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.14;
      ring.current.y += (pos.current.y - ring.current.y) * 0.14;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      }
      raf.current = requestAnimationFrame(tick);
    };

    const onOver = (e) => {
      const target = e.target.closest('[data-cursor]');
      if (!target) {
        setActive(false);
        setLabel('');
        return;
      }
      setActive(true);
      setLabel(target.getAttribute('data-cursor') || '');
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', onOver);
    raf.current = requestAnimationFrame(tick);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(raf.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className={`cursor-ring ${active ? 'cursor-ring--active' : ''}`} aria-hidden="true">
        {label && (
          <span ref={labelRef} className="cursor-label">
            {label}
          </span>
        )}
      </div>
    </>
  );
}
