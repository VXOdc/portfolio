import { AWARDS } from '../data/portfolio';
import { useReveal } from '../hooks/useMotion';

export default function Awards() {
  const { ref, visible } = useReveal(0.1);

  return (
    <section id="awards" className="section awards-section" ref={ref}>
      <div className={`section-inner ${visible ? 'is-visible' : ''}`}>
        <div className="section-head reveal-item">
          <p className="section-eyebrow">Recognition</p>
          <h2 className="section-title">Awards</h2>
        </div>

        <div className="awards-grid reveal-item">
          {AWARDS.map((award) => (
            <article key={award.title} className="award-card">
              <span className="award-year">{award.year}</span>
              <h3>{award.title}</h3>
              <p>{award.context}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
