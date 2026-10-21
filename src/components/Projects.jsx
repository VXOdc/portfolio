import { useRef } from 'react';
import { PROJECTS } from '../data/portfolio';
import { useReveal } from '../hooks/useMotion';

function ProjectCard({ project, index, featured = false }) {
  const mediaRef = useRef(null);

  const onMove = (e) => {
    if (!mediaRef.current || !project.image) return;
    const rect = mediaRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 16;
    mediaRef.current.style.transform = `scale(1.04) translate(${x}px, ${y}px)`;
  };

  const onLeave = () => {
    if (mediaRef.current) mediaRef.current.style.transform = 'scale(1) translate(0, 0)';
  };

  const inner = (
    <article className={`project-card ${featured ? 'project-card--featured' : ''}`}>
      <div className="project-card-head">
        <span className="project-index">{String(index + 1).padStart(2, '0')}</span>
        <div className="project-meta">
          <h3>{project.title}</h3>
          <span>{project.date}</span>
        </div>
        {project.flagship && <span className="project-badge">Flagship</span>}
      </div>

      {project.image ? (
        <div
          className="project-media"
          onMouseMove={onMove}
          onMouseLeave={onLeave}
        >
          <div
            ref={mediaRef}
            className="project-image"
            style={{ backgroundImage: `url(${project.image})` }}
          />
        </div>
      ) : (
        <div className="project-media project-media--placeholder">
          <span>Embedded Systems</span>
        </div>
      )}

      <p className="project-desc">{project.description}</p>

      {project.tags.length > 0 && (
        <div className="project-tags">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      )}

      {project.url && (
        <span className="project-link">
          Open project
          <svg viewBox="0 0 10 10" aria-hidden="true">
            <path d="M2 8L8 2M8 2H3M8 2V7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    </article>
  );

  if (project.url) {
    return (
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="project-link-wrap"
        data-cursor="View"
      >
        {inner}
      </a>
    );
  }

  return <div className="project-link-wrap">{inner}</div>;
}

export default function Projects() {
  const { ref, visible } = useReveal(0.08);
  const flagship = PROJECTS.find((p) => p.flagship);
  const rest = PROJECTS.filter((p) => !p.flagship);

  return (
    <section id="work" className="section projects-section" ref={ref}>
      <div className={`section-inner ${visible ? 'is-visible' : ''}`}>
        <div className="section-head reveal-item">
          <p className="section-eyebrow">Selected Work</p>
          <h2 className="section-title">Projects built with intention</h2>
        </div>

        {flagship && (
          <div className="reveal-item">
            <ProjectCard project={flagship} index={0} featured />
          </div>
        )}

        <div className="projects-strip">
          {rest.map((project, i) => (
            <div key={project.id} className="reveal-item projects-strip-item">
              <ProjectCard project={project} index={i + 1} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
