import { NAV_ITEMS, SITE } from '@/lib/site';

export function Footer() {
  return (
    <footer className="footer" id="about">
      <div className="wrap">
        <div className="footer-top">
          <a href="#top" className="wordmark" aria-label="Synodos — back to top">
            <span className="wordmark-mark" aria-hidden="true" /> SYNODOS
          </a>
          <nav className="footer-links" aria-label="Footer navigation">
            {NAV_ITEMS.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
            <a href="#waitlist">Waitlist</a>
            <a href="mailto:hello@synodos.app">Contact</a>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {SITE.name}</span>
          <span>{SITE.tagline}</span>
          <span>Before · During · After</span>
        </div>
      </div>
    </footer>
  );
}
