'use client';

import { useEffect } from 'react';

/**
 * Progressive scroll choreography.
 * Elements are only hidden once JS is running, so a no-JS visitor still sees everything.
 */
export function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(
        'main > section:not(.hero), .feature-strip, .section-head, .step-cell, .vision-point, .glass-card, .about-grid > *'
      )
    ).filter((el) => !el.closest('.hero'));

    targets.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.setProperty('--reveal-delay', `${Math.min(i % 4, 3) * 90}ms`);
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--in');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
    );

    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
