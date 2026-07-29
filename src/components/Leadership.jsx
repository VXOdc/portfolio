import { LEADERSHIP } from '../data/portfolio';
import { useReveal } from '../hooks/useMotion';

export default function Leadership() {
  const { ref, visible } = useReveal(0.1);

  return (
    <section id="leadership" className="section leadership-section" ref={ref}>
      <div className={`section-inner ${visible ? 'is-visible' : ''}`}>
        <div className="section-head reveal-item">
          <p className="section-eyebrow">Community</p>
          <h2 className="section-title">Leadership</h2>
        </div>

        {LEADERSHIP.map((item) => (
          <article key={item.org} className="leadership-card reveal-item">
            <div className="leadership-top">
              <div>
                <h3>{item.role}</h3>
                <p className="leadership-org">{item.org}</p>
              </div>
              <span className="leadership-period">{item.period}</span>
            </div>
            <p className="leadership-desc">{item.desc}</p>
            <div className="leadership-tags">
              {item.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
