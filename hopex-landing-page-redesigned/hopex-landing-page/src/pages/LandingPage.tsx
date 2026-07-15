import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronDown,
  CircleDashed,
  CircleUserRound,
  ClipboardList,
  DoorOpen,
  Eye,
  Gauge,
  Images,
  Landmark,
  Layers,
  LayoutDashboard,
  LineChart,
  Map,
  Menu,
  MessageSquare,
  Network,
  PieChart,
  QrCode,
  Radar,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Store,
  TrendingUp,
  Users,
  Warehouse,
  X,
  Zap,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import { APP_URLS } from '../config/appUrls';

/* ── Exhibition imagery supplied by the team (public/assets/photo/) ──────── */
const PHOTO = {
  hall: '/assets/photo/photo_5_2026-07-14_16-06-10.jpg', // bright panoramic hall → Hero
  booth: '/assets/photo/photo_1_2026-07-14_16-06-10.jpg', // futuristic white booth → Final Visual
  overhead: '/assets/photo/photo_3_2026-07-14_16-06-10.jpg', // overhead floor → Audience
  aisle: '/assets/photo/photo_2_2026-07-14_16-06-10.jpg', // connected aisle → Before/After
  dramatic: '/assets/photo/photo_4_2026-07-14_16-06-10.jpg', // dramatic lit booth → Showcase
};

const navLinks = [
  { href: '#platform', label: 'Platform' },
  { href: '#audience', label: 'Audience' },
  { href: '#insights', label: 'Insights' },
  { href: '#investor', label: 'Investor' },
  { href: '#visitor', label: 'Visitor' },
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

const audiences = [
  {
    icon: ClipboardList,
    title: 'Exhibition Organizers',
    copy: 'Plan exhibitions, manage operations, coordinate exhibitors, and keep visibility across the full event lifecycle.',
  },
  {
    icon: Building2,
    title: 'Exhibition Companies',
    copy: 'Operate multiple events through one connected platform with clearer workflows, reporting, and team coordination.',
  },
  {
    icon: Warehouse,
    title: 'Venue & Hall Managers',
    copy: 'Improve space planning, booth allocation, navigation, and operational control across venues.',
  },
  {
    icon: Store,
    title: 'Exhibitors & Brands',
    copy: 'Manage participation, booth information, visibility, and exhibition opportunities more efficiently.',
  },
  {
    icon: TrendingUp,
    title: 'Investors & Partners',
    copy: 'Explore exhibition opportunities, review project information, and gain clearer business visibility.',
  },
  {
    icon: Eye,
    title: 'Visitors',
    copy: 'Discover exhibitions, navigate interactive maps, locate booths, and enjoy a more connected experience.',
  },
  {
    icon: Landmark,
    title: 'Government & Industry',
    copy: 'Support the modernization, visibility, and long-term growth of the exhibition sector.',
  },
];

const showcaseImages = [
  { src: PHOTO.hall, title: 'Connected Exhibition Halls', tag: 'Venue Overview' },
  { src: PHOTO.booth, title: 'Premium Booth Experiences', tag: 'Exhibitor Space' },
  { src: PHOTO.overhead, title: 'Full-Floor Visibility', tag: 'Operations' },
  { src: PHOTO.aisle, title: 'Guided Visitor Journeys', tag: 'Navigation' },
  { src: PHOTO.dramatic, title: 'Standout Brand Moments', tag: 'Engagement' },
];

const beforeList = [
  'Scattered spreadsheets and documents',
  'Disconnected communication channels',
  'Manual booth and exhibitor coordination',
  'Limited operational visibility',
  'Difficult visitor navigation',
  'Delayed, inconsistent reports',
  'Fragmented investor and exhibitor experiences',
  'Decisions based on incomplete data',
];

const afterList = [
  'One connected operational platform',
  'Centralized exhibition information',
  'Clearer booth and exhibitor management',
  'Interactive exhibition maps',
  'Structured communication workflows',
  'Faster access to reports',
  'Clearer opportunities for investors and exhibitors',
  'Better-informed decision-making',
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
  'View entrances, exits, facilities, and key areas',
  'Select a destination',
  'Follow the visual route to the selected booth',
];

const ecosystemFlow = [
  { icon: LayoutDashboard, title: 'Admin', copy: 'Creates and configures the exhibition.' },
  { icon: Store, title: 'Investor', copy: 'Reserves a booth and builds a profile.' },
  { icon: ClipboardList, title: 'Employee', copy: 'Supports operations with QR attendance.' },
  { icon: Eye, title: 'Visitor', copy: 'Scans the QR code and explores the map.' },
];

const valueCards = [
  { icon: Zap, title: 'Operational Efficiency', copy: 'Replace disconnected workflows with one unified exhibition platform.' },
  { icon: Layers, title: 'Scalable Infrastructure', copy: 'Support multiple exhibitions, venues, investors, and visitors through one expandable system.' },
  { icon: Sparkles, title: 'New Digital Opportunities', copy: 'Create value through booth reservations, company visibility, and richer visitor engagement.' },
  { icon: LineChart, title: 'Data-Driven Decisions', copy: 'Turn exhibition activity into useful operational and visitor insight.' },
  { icon: Map, title: 'Better Visitor Experience', copy: 'Make large exhibitions easier to understand, navigate, and explore.' },
  { icon: TrendingUp, title: 'Stronger Investor Visibility', copy: 'Help companies present brands, locations, products, and services more effectively.' },
];

const roadmap = [
  {
    status: 'In Development',
    icon: Layers,
    title: 'Create Without Limits',
    copy: 'Organizers will build multiple exhibitions with custom dimensions, layouts, halls, zones, and booth configurations.',
  },
  {
    status: 'Future',
    icon: Radar,
    title: 'Understand Visitor Movement',
    copy: 'Location intelligence will help organizers understand movement patterns and improve how visitors experience large spaces.',
  },
  {
    status: 'Future',
    icon: Zap,
    title: 'Detect Congestion Early',
    copy: 'Live heat maps and congestion insight will help organizers respond faster and optimize the exhibition layout.',
  },
  {
    status: 'Future',
    icon: Smartphone,
    title: 'HOPEX in Every Pocket',
    copy: 'A dedicated mobile app will give organizers, investors, employees, and visitors faster access to HOPEX.',
  },
];

/* ── Illustrative analytics data (Platform Preview — not real results) ──── */
const kpis = [
  { icon: Store, label: 'Booth Occupancy', value: 82, suffix: '%', note: 'of mapped booths' },
  { icon: BadgeCheck, label: 'Confirmed Exhibitors', value: 46, suffix: '', note: 'across sectors' },
  { icon: Users, label: 'Visitor Check-ins', value: 1240, suffix: '', note: 'via QR access' },
  { icon: MessageSquare, label: 'Open Inquiries', value: 28, suffix: '', note: 'awaiting follow-up' },
];

const weeklyActivity = [
  { d: 'Mon', v: 62 },
  { d: 'Tue', v: 74 },
  { d: 'Wed', v: 58 },
  { d: 'Thu', v: 88 },
  { d: 'Fri', v: 96 },
  { d: 'Sat', v: 71 },
  { d: 'Sun', v: 44 },
];

const categories = [
  { label: 'Technology', pct: 38, color: 'var(--cyan-bright)' },
  { label: 'Industrial', pct: 27, color: 'var(--gold-soft)' },
  { label: 'Services', pct: 21, color: 'var(--violet)' },
  { label: 'Startups', pct: 14, color: 'var(--magenta)' },
];

const opStatus = [
  { label: 'Floor plan finalized', pct: 100 },
  { label: 'Exhibitor onboarding', pct: 78 },
  { label: 'Booth assignments', pct: 64 },
  { label: 'QR access setup', pct: 90 },
];

/* ── Small in-view helper: fires once when the node scrolls into view ───── */
function useInView<T extends Element>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Count-up number that only animates once, in view, and never for reduced
   motion. Values here are illustrative (see the Platform Preview label). */
function CountUp({ end, suffix = '', duration = 1400 }: { end: number; suffix?: string; duration?: number }) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.5);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) {
      setValue(end);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(end * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, end, duration]);

  return (
    <span ref={ref}>
      {Math.round(value).toLocaleString()}
      {suffix}
    </span>
  );
}

/* Animated SVG donut — segments draw in when scrolled into view. */
function Donut({ data }: { data: { label: string; pct: number; color: string }[] }) {
  const { ref, inView } = useInView<SVGSVGElement>(0.4);
  const r = 52;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg
      ref={ref}
      viewBox="0 0 140 140"
      className="donut"
      role="img"
      aria-label={`Exhibitor category distribution: ${data.map((d) => `${d.label} ${d.pct} percent`).join(', ')}.`}
    >
      <circle cx="70" cy="70" r={r} className="donut-track" fill="none" strokeWidth="16" />
      <g transform="rotate(-90 70 70)">
        {data.map((seg) => {
          const len = (seg.pct / 100) * c;
          const node = (
            <circle
              key={seg.label}
              cx="70"
              cy="70"
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth="16"
              strokeDasharray={`${inView ? len - 3 : 0} ${c}`}
              strokeDashoffset={-offset}
              style={{ transition: 'stroke-dasharray 1s var(--ease)' }}
            />
          );
          offset += len;
          return node;
        })}
      </g>
    </svg>
  );
}

function BeforeAfterSection() {
  const [mode, setMode] = useState<'before' | 'after'>('after');
  return (
    <section id="transform" className="section compare-section">
      <div className="container">
        <Reveal>
          <div className="section-heading centered-heading">
            <span className="eyebrow">The HOPEX difference</span>
            <h2>
              From Fragmented Operations to<br />
              <span>One Connected Platform.</span>
            </h2>
            <p>See how exhibition operations change when scattered, manual workflows become a single connected experience.</p>
          </div>
        </Reveal>

        <Reveal>
          <div className="compare-toggle" role="tablist" aria-label="Before or after HOPEX">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'before'}
              className={mode === 'before' ? 'is-active is-before' : ''}
              onClick={() => setMode('before')}
            >
              <CircleDashed size={16} /> Before HOPEX
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'after'}
              className={mode === 'after' ? 'is-active is-after' : ''}
              onClick={() => setMode('after')}
            >
              <Network size={16} /> After HOPEX
            </button>
          </div>
        </Reveal>

        <div className={`compare-grid mode-${mode}`}>
          <Reveal className="compare-col compare-before">
            <div className="compare-head">
              <span className="compare-badge before"><CircleDashed size={15} /> Before</span>
              <h3>Disconnected exhibition operations</h3>
            </div>
            <ul>
              {beforeList.map((item) => (
                <li key={item}>
                  <X size={15} /> {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="compare-arrow" aria-hidden="true">
            <span className="compare-arrow-line" />
            <ArrowRight size={22} />
          </div>

          <Reveal className="compare-col compare-after" delay={120}>
            <div
              className="compare-photo"
              style={{ backgroundImage: `url(${PHOTO.aisle})` }}
              aria-hidden="true"
            />
            <div className="compare-head">
              <span className="compare-badge after"><Network size={15} /> After</span>
              <h3>One connected exhibition platform</h3>
            </div>
            <ul>
              {afterList.map((item) => (
                <li key={item}>
                  <CheckCircle2 size={15} /> {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ImagePanel({ src, title, tag }: { src: string; title: string; tag: string }) {
  return (
    <button type="button" className="panel-tile" style={{ backgroundImage: `url(${src})` }} aria-label={title}>
      <span className="panel-shade" aria-hidden="true" />
      <span className="panel-meta">
        <small>{tag}</small>
        <strong>{title}</strong>
      </span>
    </button>
  );
}

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
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = ['home', 'platform', 'audience', 'insights', 'investor', 'visitor', 'contact'];
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
    if (prefersReducedMotion()) return;

    const onMove = (event: MouseEvent) => {
      const rect = node.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      node.style.setProperty('--parallax-x', `${x * 16}px`);
      node.style.setProperty('--parallax-y', `${y * 16}px`);
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
            <a href={APP_URLS.login} className="button button-primary" onClick={closeMenu} aria-label="Sign in to the HOPEX dashboard">
              Sign in
            </a>
          </div>
        </nav>

        <div className="nav-actions">
          <Link to="/map" className="button button-ghost">Explore map</Link>
          <a href={APP_URLS.login} className="button button-small button-primary" aria-label="Sign in to the HOPEX dashboard">
            Sign in
          </a>
        </div>
      </header>

      <main>
        <section id="home" className="hero" ref={heroRef}>
          <div className="hero-photo-wrap" aria-hidden="true">
            <img className="hero-photo" src={PHOTO.hall} alt="" fetchPriority="high" decoding="async" />
            <div className="hero-photo-veil" />
            <span className="hero-beam" />
            <span className="hero-orb hero-orb-a" />
            <span className="hero-orb hero-orb-b" />
            <span className="hero-floorgrid" />
          </div>
          <div className="hero-vignette" aria-hidden="true" />

          <div className="hero-content container">
            <div className="hero-kicker hero-enter hero-enter-one">
              <span className="kicker-dot" />
              The intelligent exhibition ecosystem
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

            <p className="hero-copy hero-enter hero-enter-four">
              HOPEX connects exhibition operations, exhibitors, investors, and visitors in one bright,
              intelligent platform — from planning to the show floor.
            </p>

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
                  HOPEX brings exhibition planning, booth management, investor reservations, employee
                  attendance, visitor navigation, and operational insight into one connected ecosystem.
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

        {/* Target Audience — who HOPEX is built for. */}
        <section id="audience" className="section audience-section">
          <div className="audience-photo" style={{ backgroundImage: `url(${PHOTO.overhead})` }} aria-hidden="true" />
          <div className="container">
            <Reveal>
              <div className="section-heading centered-heading">
                <span className="eyebrow">Made for the whole ecosystem</span>
                <h2>Built for Every Side of<br /><span>the Exhibition Ecosystem.</span></h2>
                <p>HOPEX connects the people, teams, and businesses responsible for creating successful exhibition experiences.</p>
              </div>
            </Reveal>

            <div className="audience-grid">
              {audiences.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Reveal key={item.title} delay={index * 70}>
                    <article className="audience-card">
                      <span className="audience-number">0{index + 1}</span>
                      <div className="audience-icon"><Icon size={22} /></div>
                      <h3>{item.title}</h3>
                      <p>{item.copy}</p>
                      <span className="audience-arrow"><ArrowUpRight size={18} /></span>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Animated exhibition image-panel showcase. */}
        <section id="showcase" className="section showcase-panels-section">
          <div className="container">
            <Reveal>
              <div className="section-heading centered-heading">
                <span className="eyebrow"><Images size={14} /> Inside the experience</span>
                <h2>A Premium Exhibition Showcase.</h2>
                <p>Real exhibition spaces, presented as an interactive panel gallery. Hover or focus a panel to expand it.</p>
              </div>
            </Reveal>
            <Reveal>
              <div className="panel-strip">
                {showcaseImages.map((item) => (
                  <ImagePanel key={item.title} src={item.src} title={item.title} tag={item.tag} />
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section id="admin" className="section portal-section">
          <div className="container portal-grid">
            <Reveal className="portal-copy">
              <span className="eyebrow">Admin command center</span>
              <h2>Create, control, and monitor<br /><span>every exhibition from one place.</span></h2>
              <p>
                The HOPEX Admin experience gives organizers a unified command center for creating exhibitions,
                defining layouts, managing booths, controlling reservations, supervising teams, and reviewing
                real-time activity.
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
                Investors can explore available booths, compare locations and dimensions, submit reservation
                requests, manage their company profile, and present products directly to visitors.
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
                Visitors scan the exhibition QR code with their phone and instantly open the interactive map —
                no account needed.
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
                <div><CircleUserRound /><span><strong>No account needed</strong><small>Public access for every visitor.</small></span></div>
              </div>
              <Link to="/map" className="button button-primary">Explore as a Visitor <ArrowRight size={18} /></Link>
            </Reveal>
          </div>
        </section>

        <BeforeAfterSection />

        {/* Reports & analytics — illustrative Platform Preview. */}
        <section id="insights" className="section analytics-section">
          <div className="container">
            <Reveal>
              <div className="section-heading split-heading">
                <div>
                  <span className="eyebrow"><Activity size={14} /> Reports & analytics</span>
                  <h2>Turn Exhibition Activity Into<br /><span>Clear Business Insight.</span></h2>
                </div>
                <p>
                  HOPEX brings operational information, participation activity, booth status, and visitor
                  engagement into structured, readable reports.
                </p>
              </div>
            </Reveal>

            <Reveal>
              <div className="preview-flag">
                <Gauge size={15} /> Platform Preview — illustrative data, not real business results
              </div>
            </Reveal>

            <div className="kpi-row">
              {kpis.map((kpi, index) => {
                const Icon = kpi.icon;
                return (
                  <Reveal key={kpi.label} delay={index * 70}>
                    <div className="kpi-card">
                      <div className="kpi-top">
                        <span className="kpi-icon"><Icon size={18} /></span>
                        <span className="kpi-trend"><TrendingUp size={13} /> live</span>
                      </div>
                      <strong className="kpi-value"><CountUp end={kpi.value} suffix={kpi.suffix} /></strong>
                      <span className="kpi-label">{kpi.label}</span>
                      <small className="kpi-note">{kpi.note}</small>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            <div className="analytics-grid">
              <Reveal className="chart-card chart-bars">
                <div className="chart-head">
                  <h3><BarChart3 size={17} /> Weekly Visitor Check-ins</h3>
                  <span className="chart-tag">Illustrative</span>
                </div>
                <div className="bars" role="img" aria-label="Illustrative weekly visitor check-ins, Monday to Sunday, peaking on Friday.">
                  {weeklyActivity.map((bar) => (
                    <div className="bar-col" key={bar.d}>
                      <span className="bar" style={{ '--h': `${bar.v}%` } as CSSProperties} />
                      <small>{bar.d}</small>
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal className="chart-card chart-donut" delay={90}>
                <div className="chart-head">
                  <h3><PieChart size={17} /> Exhibitor Categories</h3>
                  <span className="chart-tag">Illustrative</span>
                </div>
                <div className="donut-wrap">
                  <div className="donut-holder">
                    <Donut data={categories} />
                    <div className="donut-center"><strong>4</strong><small>sectors</small></div>
                  </div>
                  <ul className="donut-legend">
                    {categories.map((cat) => (
                      <li key={cat.label}>
                        <span className="legend-dot" style={{ background: cat.color }} />
                        {cat.label}
                        <b>{cat.pct}%</b>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal className="chart-card chart-status" delay={140}>
                <div className="chart-head">
                  <h3><CheckCircle2 size={17} /> Operational Readiness</h3>
                  <span className="chart-tag">Illustrative</span>
                </div>
                <ul className="progress-list">
                  {opStatus.map((op) => (
                    <li key={op.label}>
                      <div className="progress-top">
                        <span>{op.label}</span>
                        <b><CountUp end={op.pct} suffix="%" /></b>
                      </div>
                      <span className="progress-track">
                        <span className="progress-fill" style={{ '--p': `${op.pct}%` } as CSSProperties} />
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="section ecosystem-section">
          <div className="container">
            <Reveal>
              <div className="section-heading centered-heading">
                <span className="eyebrow">Made for the complete ecosystem</span>
                <h2>Four Experiences.<br /><span>One Connected Ecosystem.</span></h2>
                <p>Every role gets a focused experience while staying connected to the same exhibition data and workflow.</p>
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
            <p className="ecosystem-footnote">HOPEX collects operational insight across every step of the journey.</p>
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
                <span className="eyebrow">Let's build together</span>
                <h2>Partner With HOPEX to Build Smarter,<br /><span>More Connected Exhibitions.</span></h2>
                <p>Partner with HOPEX to build smarter, more connected exhibition experiences — easier to organize, more valuable to investors, and more intuitive for every visitor.</p>
                <div className="cta-actions">
                  <a href="mailto:hello@hopex.sy" className="button button-primary button-large">Start a Conversation <ArrowRight size={19} /></a>
                  <Link to="/login" className="button button-ghost button-large"><LayoutDashboard size={19} /> Explore the Platform</Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Final visual — cinematic closing statement. */}
        <section className="final-visual" aria-label="HOPEX vision">
          <div className="final-visual-photo" style={{ backgroundImage: `url(${PHOTO.booth})` }} aria-hidden="true" />
          <div className="final-visual-veil" aria-hidden="true" />
          <div className="final-visual-grid" aria-hidden="true" />
          <div className="final-visual-beam" aria-hidden="true" />
          <div className="final-visual-orb final-visual-orb-a" aria-hidden="true" />
          <div className="final-visual-orb final-visual-orb-b" aria-hidden="true" />
          <div className="container final-visual-inner">
            <Reveal className="final-visual-content">
              <div className="final-visual-logo">
                <span className="final-visual-halo" aria-hidden="true" />
                <img src="/assets/hopex-logo.png" alt="HOPEX" />
              </div>
              <h2>Lead the Future<br /><span>of Exhibitions.</span></h2>
              <p>Smarter operations. Stronger visibility. Better experiences.</p>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <img src="/assets/hopex-logo.png" alt="HOPEX" />
            <p className="footer-tagline">The New Era of Exhibitions.</p>
            <p>A connected platform for modern exhibition operations and experiences.</p>
          </div>
          <div className="footer-links">
            <div>
              <strong>Platform</strong>
              <a href="#platform">Platform</a>
              <Link to="/login">Admin</Link>
              <Link to="/login">Investor</Link>
              <Link to="/map">Visitor</Link>
              <a href="#future">Future Vision</a>
              <a href="#contact">Contact</a>
            </div>
            <div>
              <strong>Business</strong>
              <a href="#contact">Partnership</a>
              <a href="#contact">Product Demo</a>
              <a href="#contact">Exhibition Pilot</a>
            </div>
            <div>
              <strong>Contact</strong>
              <a href="mailto:hello@hopex.sy">hello@hopex.sy</a>
              <span>Syria</span>
            </div>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© 2026 HOPEX. Building the future of connected exhibitions.</span>
          <span>The New Era of Exhibitions</span>
        </div>
      </footer>
    </div>
  );
}
