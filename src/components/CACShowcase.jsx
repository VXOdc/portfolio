import { useState } from 'react';
import { PROFILE } from '../data/portfolio';

const YOUTUBE_VIDEO_ID = 'ltoAKhrLTz0';
const YOUTUBE_VIDEO_URL = `https://youtu.be/${YOUTUBE_VIDEO_ID}`;
const THUMBNAILS = [
  `https://i.ytimg.com/vi/${YOUTUBE_VIDEO_ID}/maxresdefault.jpg`,
  `https://i.ytimg.com/vi/${YOUTUBE_VIDEO_ID}/hqdefault.jpg`,
];

export default function CACShowcase() {
  const [playerLoaded, setPlayerLoaded] = useState(false);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);

  return (
    <div className="cac-page">
      <div className="cac-cinema">
        <header className="cac-header">
          <a className="cac-brand" href="/" aria-label={`${PROFILE.name} portfolio home`}>
            <span className="cac-brand__name">Noah Ly</span>
            <span className="cac-brand__divider" aria-hidden="true">/</span>
            <span className="cac-brand__context">Project showcase</span>
          </a>
          <a className="cac-return" href="/">
            <span>Portfolio</span>
            <svg viewBox="0 0 12 12" aria-hidden="true">
              <path d="M2.5 9.5 9.5 2.5M3 2.5h6.5V9" />
            </svg>
          </a>
        </header>

        <main>
          <section className="cac-feature" aria-label="Project demonstration video">
            <div className={`cac-video ${playerLoaded ? 'cac-video--playing' : ''}`}>
              {playerLoaded ? (
                <iframe
                  className="cac-video__iframe"
                  src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0&playsinline=1&vq=hd2160`}
                  title="Noah Ly’s 2026 Congressional App Challenge application demonstration"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <>
                  {thumbnailIndex < THUMBNAILS.length && (
                    <img
                      className="cac-video__poster"
                      src={THUMBNAILS[thumbnailIndex]}
                      alt=""
                      fetchPriority="high"
                      onError={() => setThumbnailIndex((index) => index + 1)}
                    />
                  )}
                  <div className="cac-video__shade" aria-hidden="true" />
                  <div className="cac-video__label" aria-hidden="true">
                    <span className="cac-video__live-dot" />
                    <span>Application walkthrough</span>
                  </div>
                  <button
                    className="cac-video__play"
                    type="button"
                    onClick={() => setPlayerLoaded(true)}
                    aria-label="Play the 2026 Congressional App Challenge application walkthrough"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.5 5.8c0-.8.9-1.3 1.6-.8l9.2 6.2a1 1 0 0 1 0 1.6l-9.2 6.2c-.7.5-1.6 0-1.6-.8V5.8Z" />
                    </svg>
                  </button>
                  <span className="cac-video__hint" aria-hidden="true">Play project demo</span>
                </>
              )}
            </div>
          </section>

          <section className="cac-details" aria-labelledby="cac-title">
            <div className="cac-details__intro">
              <div className="cac-details__title-block">
                <p className="cac-eyebrow">Congressional App Challenge <span>·</span> 2026</p>
                <h1 id="cac-title">Application<br className="cac-title-break" /> showcase</h1>
              </div>
              <div className="cac-details__summary">
                <p>
                  A walkthrough of my application submission to the 2026 Congressional App Challenge.
                  The demonstration is presented here by {PROFILE.name}.
                </p>
                <a className="cac-video-link" href={YOUTUBE_VIDEO_URL} target="_blank" rel="noreferrer">
                  Watch on YouTube
                  <svg viewBox="0 0 12 12" aria-hidden="true">
                    <path d="M2.5 9.5 9.5 2.5M3 2.5h6.5V9" />
                  </svg>
                </a>
              </div>
            </div>

            <dl className="cac-meta">
              <div className="cac-meta__item">
                <dt>Competition</dt>
                <dd>Congressional App Challenge</dd>
              </div>
              <div className="cac-meta__item">
                <dt>Year</dt>
                <dd>2026</dd>
              </div>
              <div className="cac-meta__item">
                <dt>Developer</dt>
                <dd>{PROFILE.name}</dd>
              </div>
            </dl>
          </section>
        </main>

        <footer className="cac-footer">
          <span>NOAH LY <span className="cac-footer__dot">·</span> 2026</span>
          <a href="/">Return to portfolio <span aria-hidden="true">↗</span></a>
        </footer>
      </div>
    </div>
  );
}
