import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  ChevronDown,
  CircleUserRound,
  ClipboardCheck,
  DoorOpen,
  Eye,
  Layers,
  LayoutDashboard,
  LineChart,
  Map,
  Menu,
  QrCode,
  Radar,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Store,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedBackdrop from '../components/AnimatedBackdrop';
import InteractiveHeroBackground from '../components/InteractiveHeroBackground';
import Reveal from '../components/Reveal';
import { APP_URLS } from '../config/appUrls';

const navLinks = [
  { href: '#platform', label: 'Platform' },
  { href: '#admin', label: 'Admin' },
  { href: '#investor', label: 'Investor' },
  { href: '#visitor', label: 'Visitor' },
  { href: '#future', label: 'Future Vision' },
  { href: '#contact', label: 'Contact' },
];

const capabilities = [
  {
    icon: Building2,
    title: 'Exhibition Management',
    description: 'Create, publish, and control every exhibition from one intelligent workspace.',
  },
  {
    icon: Map,
    title: 'Interactive Venue Mapping',
    description: 'Turn any hall into a searchable digital map with halls, booths, and facilities.',
  },
  {
    icon: Store,
    title: 'Booth Reservations',
    description: 'Give investors a clear, guided journey to discover and reserve booths.',
  },
  {
    icon: QrCode,
    title: 'QR-Powered Access',
    description: 'Secure, frictionless entry for employees and visitors through protected QR codes.',
  },
  {
    icon: BarChart3,
    title: 'Operational Analytics',
    description: 'Turn daily activity into clear reports across teams, halls, and events.',
  },
  {
    icon: Eye,
    title: 'Visitor Experience',
    description: 'Help every visitor find their way with an intuitive, account-free journey.',
  },
];

const adminFeatures = [
  'Create and publish exhibitions',
  'Configure halls and exhibition spaces',
  'Manage booths and availability',
  'Control investor reservations',
  'Manage employees and assignments',
  'Monitor QR attendance',
  'Review exhibition reports',
  'Manage multiple exhibitions from one account',
];

const investorFeatures = [
  'Browse available exhibition booths',
  'View booth size, location, price, and status',
  'Submit booth reservation requests',
  'Track reservation approval',
  'Create a company profile',
  'Showcase products and services',
  'Improve visibility inside the interactive map',
  'Connect directly with exhibition visitors',
];

const visitorSteps = [
  'Scan the exhibition QR code',
  'Open the public interactive map',
  'Search for companies, investors, and booths',
  'View entrances, exits, facilities, and important areas',
  'Select a destination',
  'Follow the visual route to the selected booth',
];

const ecosystemFlow = [
  { icon: LayoutDashboard, title: 'Admin', copy: 'Creates and configures the exhibition.' },
  { icon: Store, title: 'Investor', copy: 'Reserves a booth and builds a profile.' },
  { icon: ClipboardCheck, title: 'Employee', copy: 'Supports operations with QR attendance.' },
  { icon: Eye, title: 'Visitor', copy: 'Scans the QR code and explores the map.' },
];

const valueCards = [
  { icon: Zap, title: 'Operational Efficiency', copy: 'Replace disconnected workflows with one unified exhibition platform.' },
  { icon: Layers, title: 'Scalable Infrastructure', copy: 'Support multiple exhibitions, venues, investors, and visitors through one expandable system.' },
  { icon: Sparkles, title: 'New Digital Opportunities', copy: 'Create value through booth reservations, company visibility, digital services, and enhanced visitor engagement.' },
  { icon: LineChart, title: 'Data-Driven Decisions', copy: 'Transform exhibition activity into useful operational and visitor insights.' },
  { icon: Map, title: 'Improved Visitor Experience', copy: 'Make large exhibitions easier to understand, navigate, and explore.' },
  { icon: TrendingUp, title: 'Stronger Investor Visibility', copy: 'Help participating companies present their brands, locations, products, and services more effectively.' },
];

const roadmap = [
  {
    status: 'In Development',
    icon: Layers,
    title: 'Create Without Limits',
    copy: 'Organizers will be able to create multiple exhibitions with custom dimensions, layouts, halls, zones, and booth configurations.',
  },
  {
    status: 'Future',
    icon: Radar,
    title: 'Understand Visitor Movement',
    copy: 'Real-time location intelligence can help organizers understand movement patterns and improve the way visitors experience large exhibition spaces.',
  },
  {
    status: 'Future',
    icon: Zap,
    title: 'Detect Congestion Before It Becomes a Problem',
    copy: 'Live heat maps and congestion insights will help organizers respond faster, improve safety, and optimize the exhibition layout.',
  },
  {
    status: 'Future',
    icon: Smartphone,
    title: 'HOPEX in Every Pocket',
    copy: 'A dedicated mobile application will give organizers, investors, employees, and visitors faster access to the HOPEX ecosystem.',
  },
];

function ScanVisual() {
  return (
    <div className="scan-visual" aria-hidden="true">
      <div className="scan-phone">
        <div className="scan-frame">
          <span className="scan-corner tl" />
          <span className="scan-corner tr" />
          <span className="scan-corner bl" />
          <span className="scan-corner br" />
          <span className="scan-line" />
          <QrCode size={54} strokeWidth={1.2} />
        </div>
      </div>
      <span className="scan-connector" />
      <div className="scan-map">
        <span className="scan-map-grid" />
        <span className="scan-map-route" />
        <span className="scan-map-pin" />
      </div>
      <div className="scan-result-card">
        <Search size={13} /> Hall A · Booth 14
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [videoReady, setVideoReady] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = ['home', 'platform', 'admin', 'investor', 'visitor', 'future', 'contact'];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0.1 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = heroRef.current;
    if (!node) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const onMove = (event: MouseEvent) => {
      const rect = node.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      node.style.setProperty('--parallax-x', `${x * 18}px`);
      node.style.setProperty('--parallax-y', `${y * 18}px`);
    };

    node.addEventListener('mousemove', onMove);
    return () => node.removeEventListener('mousemove', onMove);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell">
      <header className={`topbar ${scrolled ? 'is-scrolled' : ''}`}>
        <a href="#home" className="brand" aria-label="HOPEX home" onClick={closeMenu}>
          <img src="/assets/hopex-logo.png" alt="HOPEX" />
        </a>

        <button
          className="menu-button"
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <nav className={`nav-links ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={activeSection === item.href.slice(1) ? 'is-active' : ''}
              onClick={closeMenu}
            >
              {item.label}
            </a>
          ))}
          <div className="mobile-nav-actions">
            <Link to="/map" className="button button-ghost" onClick={closeMenu}>Explore map</Link>
            <a
              href={APP_URLS.login}
              className="button button-primary"
              onClick={closeMenu}
              aria-label="Sign in to the HOPEX dashboard"
            >
              Sign in
            </a>
          </div>
        </nav>

        <div className="nav-actions">
          <Link to="/map" className="button button-ghost">Explore map</Link>
          <a
            href={APP_URLS.login}
            className="button button-small button-primary"
            aria-label="Sign in to the HOPEX dashboard"
          >
            Sign in
          </a>
        </div>
      </header>

      <main>
        <section id="home" className="hero" ref={heroRef}>
          <div className="hero-video-wrap" aria-hidden="true">
            <video
              className={`hero-video ${videoReady ? 'is-ready' : ''}`}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              onCanPlay={() => setVideoReady(true)}
              onError={() => setVideoReady(false)}
            >
              <source src="/assets/exhibition-promo.mp4" type="video/mp4" />
            </video>
            <AnimatedBackdrop />
          </div>
          <InteractiveHeroBackground />
          <div className="hero-vignette" aria-hidden="true" />

          <div className="hero-content container">
            <div className="hero-kicker hero-enter hero-enter-one">
              <span className="kicker-dot" />
              Syria's intelligent exhibition ecosystem
            </div>

            <div
              className="hero-logo-wrap hero-enter hero-enter-two"
              style={{ transform: 'translate3d(var(--parallax-x, 0), var(--parallax-y, 0), 0)' }}
            >
              <div className="hero-logo-halo" />
              <div className="hero-logo-float">
                <img src="/assets/hopex-logo.png" alt="HOPEX — The New Era of Exhibitions" className="hero-logo" />
                <span className="hero-logo-sheen" aria-hidden="true" />
              </div>
            </div>

            <h1 className="hero-title hero-enter hero-enter-three">The New Era of Exhibitions.</h1>

            

            <div className="hero-actions hero-enter hero-enter-four">
              <Link to="/login" className="button button-primary button-large">
                Access HOPEX <ArrowRight size={19} />
              </Link>
              <Link to="/map" className="button button-map button-large">
                <Map size={19} /> Explore Interactive Map
              </Link>
            </div>

            <div className="hero-trust hero-enter hero-enter-five">
              <span><BadgeCheck size={16} /> Role-based access</span>
              <span><QrCode size={16} /> QR-powered operations</span>
              <span><Zap size={16} /> Real-time visibility</span>
            </div>
          </div>

          <a className="scroll-cue" href="#platform" aria-label="Scroll to platform overview">
            <span>Discover</span>
            <ChevronDown size={19} />
          </a>
        </section>

        <Reveal className="team-strip">
          <div className="container team-strip-inner">
            <span className="team-strip-line" aria-hidden="true" />
            <p className="team-strip-label">Built by the HOPEX Team</p>
            <ul className="team-strip-names">
              <li>Dani Almhnna</li>
              <li>Ruba Juha</li>
              <li>Hussien Hamdan</li>
              <li>Baraa AlSawah</li>
              <li>Hassan Alshaka</li>
            </ul>
          </div>
        </Reveal>

        <section id="platform" className="section section-capabilities">
          <div className="container">
            <Reveal>
              <div className="section-heading split-heading">
                <div>
                  <span className="eyebrow">One connected platform</span>
                  <h2>One Platform.<br /><span>Every Exhibition Journey.</span></h2>
                </div>
                <p>
                  HOPEX brings exhibition planning, booth management, investor reservations, employee attendance, visitor navigation, and operational intelligence into one connected digital ecosystem.
                </p>
              </div>
            </Reveal>

            <div className="capability-grid">
              {capabilities.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Reveal key={item.title} delay={index * 80}>
                    <article className="capability-card">
                      <div className="card-topline">
                        <div className="icon-box"><Icon size={22} /></div>
                        <span>0{index + 1}</span>
                      </div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      <div className="card-line" />
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section id="admin" className="section portal-section">
          <div className="container portal-grid">
            <Reveal className="portal-copy">
              <span className="eyebrow">Admin command center</span>
              <h2>Create, control, and monitor<br /><span>every exhibition from one place.</span></h2>
              <p>
                The HOPEX Admin experience gives organizers a unified command center for creating exhibitions, defining venue layouts, managing booths, controlling reservations, supervising teams, and reviewing real-time activity.
              </p>
              <ul className="feature-checklist">
                {adminFeatures.map((feature) => (
                  <li key={feature}><ShieldCheck size={15} /> {feature}</li>
                ))}
              </ul>
            </Reveal>

            <Reveal className="portal-visual" delay={120}>
              <Link to="/login" className="portal-gateway gateway-admin" aria-label="Enter Admin portal">
                <div className="gateway-grid" aria-hidden="true" />
                <div className="gateway-lines" aria-hidden="true">
                  <span /><span /><span />
                </div>
                <div className="gateway-body">
                  <div className="gateway-icon"><LayoutDashboard size={28} /></div>
                  <span className="gateway-label">ADMIN</span>
                  <span className="gateway-sub">Enter command center</span>
                  <span className="gateway-arrow"><ArrowRight size={20} /></span>
                </div>
                <div className="floating-status status-live"><span /> LIVE SYNC</div>
                <div className="floating-status status-secure"><BadgeCheck size={15} /> SECURE ACCESS</div>
              </Link>
            </Reveal>
          </div>
        </section>

        <section id="investor" className="section portal-section portal-section-alt">
          <div className="container portal-grid portal-grid-reverse">
            <Reveal className="portal-visual" delay={120}>
              <Link to="/login" className="portal-gateway gateway-investor" aria-label="Enter Investor portal">
                <div className="gateway-floorplan" aria-hidden="true">
                  <span className="plot reserved" />
                  <span className="plot" />
                  <span className="plot reserved" />
                  <span className="plot" />
                  <span className="plot" />
                  <span className="plot reserved" />
                </div>
                <div className="gateway-body">
                  <div className="gateway-icon"><Store size={28} /></div>
                  <span className="gateway-label">INVESTOR</span>
                  <span className="gateway-sub">Enter Investor Portal</span>
                  <span className="gateway-arrow"><ArrowRight size={20} /></span>
                </div>
                <div className="floating-status status-secure investor-chip"><Sparkles size={15} /> COMPANY PROFILE</div>
              </Link>
            </Reveal>

            <Reveal className="portal-copy">
              <span className="eyebrow">Investor experience</span>
              <h2>Discover the right space.<br /><span>Build a stronger presence.</span></h2>
              <p>
                Investors can explore available booths, compare locations and dimensions, submit reservation requests, manage their company profile, and present products directly to exhibition visitors.
              </p>
              <ul className="feature-checklist">
                {investorFeatures.map((feature) => (
                  <li key={feature}><BadgeCheck size={15} /> {feature}</li>
                ))}
              </ul>
              <Link to="/login" className="button button-primary">Enter Investor Portal <ArrowRight size={18} /></Link>
            </Reveal>
          </div>
        </section>

        <section id="visitor" className="section visitor-experience">
          <div className="container visitor-grid">
            <Reveal className="qr-scene">
              <ScanVisual />
            </Reveal>

            <Reveal className="visitor-copy" delay={120}>
              <span className="eyebrow">Smart visitor journey</span>
              <h2>Scan. Navigate.<br /><span>Discover.</span></h2>
              <p>
                Visitors can scan the exhibition QR code using their phone and instantly access the interactive map without creating an account.
              </p>
              <ol className="step-list">
                {visitorSteps.map((step, index) => (
                  <li key={step}><span>{index + 1}</span>{step}</li>
                ))}
              </ol>
              <div className="mini-feature-grid">
                <div><Search /><span><strong>Smart search</strong><small>Find booths and companies quickly.</small></span></div>
                <div><DoorOpen /><span><strong>Easy navigation</strong><small>Locate entrances, exits, and key areas.</small></span></div>
                <div><Store /><span><strong>Booth discovery</strong><small>Explore investors, products, and details.</small></span></div>
                <div><CircleUserRound /><span><strong>No account needed</strong><small>Public access designed for every visitor.</small></span></div>
              </div>
              <Link to="/map" className="button button-primary">Explore as a Visitor <ArrowRight size={18} /></Link>
            </Reveal>
          </div>
        </section>

        <section className="section ecosystem-section">
          <div className="container">
            <Reveal>
              <div className="section-heading centered-heading">
                <span className="eyebrow">Made for the complete ecosystem</span>
                <h2>Four Experiences.<br /><span>One Connected Ecosystem.</span></h2>
                <p>Every role receives a focused experience while remaining connected to the same exhibition data and workflow.</p>
              </div>
            </Reveal>

            <div className="ecosystem-flow">
              {ecosystemFlow.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div className="ecosystem-item-wrap" key={item.title}>
                    <Reveal delay={index * 100}>
                      <article className="ecosystem-card">
                        <div className="ecosystem-icon"><Icon size={22} /></div>
                        <h3>{item.title}</h3>
                        <p>{item.copy}</p>
                      </article>
                    </Reveal>
                    {index < ecosystemFlow.length - 1 && <span className="ecosystem-connector" aria-hidden="true" />}
                  </div>
                );
              })}
            </div>
            <p className="ecosystem-footnote">HOPEX collects operational insights across every step of the journey.</p>
          </div>
        </section>

        <section className="section platform-values">
          <div className="container value-grid">
            <Reveal className="value-statement">
              <span className="eyebrow">Why HOPEX matters</span>
              <h2>More than exhibition management.<br /><span>A scalable digital ecosystem.</span></h2>
            </Reveal>

            <div className="value-cards">
              {valueCards.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Reveal key={item.title} delay={index * 70}>
                    <div className="value-card">
                      <Icon />
                      <strong>{item.title}</strong>
                      <p>{item.copy}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section id="future" className="section future-section">
          <div className="container">
            <Reveal>
              <div className="section-heading centered-heading">
                <span className="eyebrow">Future vision</span>
                <h2>Built for the Next Generation<br /><span>of Exhibitions.</span></h2>
              </div>
            </Reveal>

            <div className="roadmap-grid">
              {roadmap.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Reveal key={item.title} delay={index * 90}>
                    <article className="roadmap-card">
                      <div className="roadmap-top">
                        <div className="icon-box"><Icon size={20} /></div>
                        <span className={`roadmap-status status-${item.status.toLowerCase().replace(' ', '-')}`}>{item.status}</span>
                      </div>
                      <h3>{item.title}</h3>
                      <p>{item.copy}</p>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section id="contact" className="final-cta">
          <div className="cta-grid" aria-hidden="true" />
          <div className="cta-orb" aria-hidden="true" />
          <div className="container">
            <Reveal>
              <div className="cta-card">
                <img src="/assets/hopex-logo.png" alt="HOPEX" />
                <span className="eyebrow">The future starts here</span>
                <h2>Transform Every Exhibition Into<br /><span>a Connected Experience.</span></h2>
                <p>HOPEX is building the digital foundation for exhibitions that are easier to organize, more valuable to investors, and more intuitive for every visitor.</p>
                <div className="cta-actions">
                  <Link to="/login" className="button button-primary button-large">Access the Platform <ArrowRight size={19} /></Link>
                  <Link to="/map" className="button button-ghost button-large"><Map size={19} /> Explore the Interactive Map</Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <img src="/assets/hopex-logo.png" alt="HOPEX" />
            <p>The New Era of Exhibitions.</p>
          </div>
          <div className="footer-links">
            <div><strong>Platform</strong><a href="#platform">Overview</a><Link to="/login">Admin</Link><Link to="/login">Investor</Link></div>
            <div><strong>Explore</strong><Link to="/map">Visitor Map</Link><a href="#future">Future Vision</a></div>
            <div><strong>Contact</strong><a href="mailto:hello@hopex.sy">hello@hopex.sy</a><span>Syria</span></div>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} HOPEX. All rights reserved.</span>
          <span>The New Era of Exhibitions</span>
        </div>
      </footer>
    </div>
  );
}
