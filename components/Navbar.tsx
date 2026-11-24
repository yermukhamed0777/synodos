'use client';

import { useState } from 'react';
import { NAV_ITEMS } from '@/lib/site';

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a href="#top" className="wordmark" aria-label="Synodos — back to top">
          SYNODOS<span>.</span>
        </a>

        <nav className="nav-links" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <a href="#access" className="btn btn--red nav-cta">
          Get early access <span aria-hidden="true">↗</span>
        </a>

        <button
          type="button"
          className="menu-toggle"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? '×' : '≡'}
        </button>
      </div>

      {open && (
        <nav className="wrap mobile-menu" aria-label="Mobile navigation">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
          <a href="#access" onClick={() => setOpen(false)}>
            Get early access
          </a>
        </nav>
      )}
    </header>
  );
}
