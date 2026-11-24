'use client';

import { useEffect, useState } from 'react';
import { BASE_PATH, NAV_ITEMS } from '@/lib/site';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="wrap nav-inner">
        <a href={`${BASE_PATH}/`} className="wordmark" aria-label="Synodos — home">
          <span className="wordmark-mark" aria-hidden="true" /> SYNODOS
        </a>

        <nav className="nav-links" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={`${BASE_PATH}/${item.href}`}>{item.label}</a>
          ))}
          <a href={`${BASE_PATH}/planner/`}>Planner</a>
        </nav>

        <div className="nav-actions">
          <a href={`${BASE_PATH}/#waitlist`} className="btn btn--primary btn--small nav-cta">
            Join Waitlist <span aria-hidden="true">→</span>
          </a>
          <button
            type="button"
            className="icon-btn menu-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? '×' : '≡'}
          </button>
        </div>
      </div>

      {open && (
        <nav className="mobile-menu" aria-label="Mobile navigation">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={`${BASE_PATH}/${item.href}`} onClick={() => setOpen(false)}>{item.label}</a>
          ))}
          <a href={`${BASE_PATH}/planner/`} onClick={() => setOpen(false)}>Planner</a>
          <a href={`${BASE_PATH}/#waitlist`} onClick={() => setOpen(false)}>Join Waitlist</a>
        </nav>
      )}
    </header>
  );
}
