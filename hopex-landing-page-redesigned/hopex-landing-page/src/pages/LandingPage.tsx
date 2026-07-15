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
  Eye,
  Gauge,
  Images,
  Layers,
  LayoutDashboard,
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
  Store,
  TrendingUp,
  Users,
  X,
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
  { href: '#audience', label: 'User Roles' },
  { href: '#insights', label: 'Insights' },
  { href: '#investor', label: 'Investor' },
  { href: '#visitor', label: 'Visitor' },
  { href: '#contact', label: 'Contact' },
];

const capabilities = [
  {
    icon: Map,
    title: 'Interactive 3D Exhibition Map',
    description: 'Explore HOPEX EXPO through one shared 3D map for admins, investors, and visitors.',
  },
  {
    icon: Store,
    title: 'Booth Management',
    description: 'Monitor all 12 booths, check their status, and review investor reservation requests.',
  },
  {
    icon: Building2,
    title: 'Investor Booth Reservations',
    description: 'Let investors view booth details, submit company requests, and track approval status.',
  },
  {
    icon: QrCode,
    title: 'Employee QR Attendance',
    description: 'Generate personal employee QR codes and record work check-in and check-out times.',
  },
  {
    icon: BadgeCheck,
    title: 'Booth Ratings',
    description: 'Collect visitor ratings and show each booth average score and total review count.',
  },
  {
    icon: Eye,
    title: 'Visitor Navigation',
    description: 'Help visitors search for companies, view booth details, and follow routes without an account.',
  },
];

const targetAudiences = [
  {
    icon: ClipboardList,
    title: 'Exhibition Organizing Companies',
    copy: 'Coordinate events that bring together booths, exhibitors, staff, and visitors through one connected platform.',
  },
  {
    icon: Building2,
    title: 'Conference & Convention Centers',
    copy: 'Support clearer booth operations, team access, visitor navigation, and exhibition services across the venue.',
  },
  {
    icon: Users,
    title: 'Event Management Organizations',
    copy: 'Manage events with exhibitors, booths, employees, and visitors through a structured digital experience.',
  },
];

const hopexPlans = [
  {
    icon: Store,
    title: 'Pay Per Exhibition',
    description: 'A flexible plan based on the exhibition size, number of booths, staff, exhibitors, and visitors.',
  },
  {
    icon: Map,
    title: 'Exhibition Setup',
    description: 'We prepare the interactive map, booths, exhibitor data, branding, and team access.',
  },
  {
    icon: BadgeCheck,
    title: 'Premium Exhibitor Services',
    description: 'Boost booth visibility with featured placement, better search results, images, videos, and promotional offers.',
  },
  {
    icon: BarChart3,
    title: 'Advanced Reports',
    description: 'Get clear insights into booth visits, visitor activity, ratings, and overall exhibition performance.',
  },
];

const audiences = [
  {
    icon: LayoutDashboard,
    title: 'Admin',
    copy: 'Control booth status, review reservation requests, manage employees, and monitor attendance and ratings.',
  },
  {
    icon: Building2,
    title: 'Investor',
    copy: 'Explore available booths, submit a company reservation request, and follow its approval status.',
  },
  {
    icon: Eye,
    title: 'Visitor',
    copy: 'Search the interactive map, discover companies, follow routes, and rate booths without an account.',
  },
  {
    icon: ClipboardList,
    title: 'Employee',
    copy: 'Use a personal QR code to record work check-in and check-out through the employee web app.',
  },
];

const showcaseImages = [
  { src: PHOTO.hall, title: 'HOPEX EXPO Hall', tag: 'Exhibition Overview' },
  { src: PHOTO.booth, title: 'Interactive Booth Experience', tag: '12 Booths' },
  { src: PHOTO.overhead, title: 'Shared 3D Floor Map', tag: 'One Connected Map' },
  { src: PHOTO.aisle, title: 'Guided Visitor Navigation', tag: 'Search & Routes' },
  { src: PHOTO.dramatic, title: 'Company Discovery', tag: 'Details & Ratings' },
];

const beforeList = [
  'Booth information is difficult to find',
  'Reservation requests are handled manually',
  'Booth status is difficult to track',
  'Employee attendance records are scattered',
  'Visitors struggle to locate companies',
  'Booth feedback is difficult to collect',
  'Each role works through a separate experience',
  'Operational information is not connected',
];

const afterList = [
  'One shared interactive 3D map',
  'Clear investor reservation workflow',
  'Visible status for all 12 booths',
  'Admin approval and rejection controls',
  'QR-based employee attendance',
  'Company and booth search for visitors',
  'Guided routes to selected booths',
  'Direct booth ratings and summaries',
];

const adminFeatures = [
  'View all 12 booths on the interactive 3D map',
  'Monitor total, available, pending, and reserved booths',
  'Approve or reject investor reservation requests',
  'Add new employees to the system',
  'Generate a personal QR code for each employee',
  'Review employee check-in and check-out logs',
  'Monitor daily attendance statistics',
  'View booth rating averages and review counts',
];

const investorFeatures = [
  'Create an investor account with a company name',
  'Explore all 12 booths on the shared 3D map',
  'View booth number, location, price, and status',
  'Browse booths that are currently available',
  'Submit a reservation request with company information',
  'Track available, pending, and reserved status',
  'View the booth average rating',
  'View the total number of visitor ratings',
];

const visitorSteps = [
  'Open the public interactive 3D map',
  'Search by company name, booth name, or booth number',
  'Open the selected booth and company details',
  'View the company category and description',
  'Choose a booth as the destination',
  'Follow the visual route and rate the booth after the visit',
];

const ecosystemFlow = [
  { icon: LayoutDashboard, title: 'Admin', copy: 'Controls booths, reservation requests, employees, attendance, and ratings.' },
  { icon: Store, title: 'Investor', copy: 'Explores booths, submits a company request, and tracks approval status.' },
  { icon: ClipboardList, title: 'Employee', copy: 'Uses a personal QR code to record work check-in and check-out.' },
  { icon: Eye, title: 'Visitor', copy: 'Searches companies, follows routes, and rates booths without an account.' },
];

const valueCards = [
  { icon: Map, title: 'One Shared 3D Map', copy: 'Give admins, investors, and visitors one consistent view of HOPEX EXPO.' },
  { icon: Store, title: 'Clear Reservation Workflow', copy: 'Connect booth discovery, company requests, and admin approval in one flow.' },
  { icon: QrCode, title: 'Employee Attendance Records', copy: 'Record employee check-in and check-out through personal QR codes.' },
  { icon: CircleUserRound, title: 'Account-Free Visitor Access', copy: 'Let visitors search, navigate, and discover companies without registration.' },
  { icon: BadgeCheck, title: 'Booth Ratings & Feedback', copy: 'Collect visitor ratings and show averages and review counts for each booth.' },
  { icon: Network, title: 'Connected Role Experiences', copy: 'Keep admins, investors, employees, and visitors connected to the same exhibition.' },
];

const roadmap = [
  {
    status: 'Future',
    icon: Layers,
    title: 'Multiple Exhibition Management',
    copy: 'Extend HOPEX beyond HOPEX EXPO to support multiple exhibitions, venues, halls, and booth layouts.',
  },
  {
    status: 'Future',
    icon: Radar,
    title: 'Advanced Visitor Analytics',
    copy: 'Add deeper visitor movement and engagement insights to help organizers improve future exhibition experiences.',
  },
  {
    status: 'Future',
    icon: BadgeCheck,
    title: 'Digital Tickets & Online Payments',
    copy: 'Introduce optional digital tickets and secure online payment workflows for future exhibitions.',
  },
  {
    status: 'Future',
    icon: Smartphone,
    title: 'Multilingual Mobile Experience',
    copy: 'Expand mobile access with notifications, more languages, and richer tools for every HOPEX role.',
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
              From Scattered Tasks to<br />
              <span>One Connected Experience.</span>
            </h2>
            <p>See how booth reservations, employee attendance, visitor navigation, and ratings become easier to manage in one place.</p>
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
              <h3>Disconnected exhibition tasks</h3>
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
              <h3>One connected HOPEX experience</h3>
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
          <Search size={54} strokeWidth={1.2} />
        </div>
      </div>
      <span className="scan-connector" />
      <div className="scan-map">
        <span className="scan-map-grid" />
        <span className="scan-map-route" />
        <span className="scan-map-pin" />
      </div>
      <div className="scan-result-card">
        <Search size={13} /> Company Search · Booth 12
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
              One connected exhibition experience
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

            <h1 className="hero-title hero-enter hero-enter-three">One Platform. Every Role Connected.</h1>

            <p className="hero-copy hero-enter hero-enter-four">
              HOPEX connects booth management, investor reservations, employee attendance, and visitor navigation
              inside HOPEX EXPO through one shared interactive 3D experience.
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
              <span><BadgeCheck size={16} /> Four connected roles</span>
              <span><QrCode size={16} /> Employee QR attendance</span>
              <span><Map size={16} /> Account-free visitor map</span>
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
                  <span className="eyebrow">One connected exhibition</span>
                  <h2>One Platform.<br /><span>Every Role Connected.</span></h2>
                </div>
                <p>
                  HOPEX connects booth management, investor reservations, employee attendance, visitor navigation,
                  and booth ratings inside one shared HOPEX EXPO experience.
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

        {/* Target Audience — organizations HOPEX is designed for. */}
        <section id="target-audience" className="section audience-section">
          <div className="audience-photo" style={{ backgroundImage: `url(${PHOTO.overhead})` }} aria-hidden="true" />
          <div className="container">
            <Reveal>
              <div className="section-heading centered-heading">
                <span className="eyebrow">Target audience</span>
                <h2>Designed for Organizations That<br /><span>Bring Exhibitions to Life.</span></h2>
                <p>HOPEX supports the companies, venues, and organizations responsible for managing events with booths, exhibitors, staff, and visitors.</p>
              </div>
            </Reveal>

            <div className="audience-grid">
              {targetAudiences.map((item, index) => {
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

        {/* Target Audience — who HOPEX is built for. */}
        <section id="audience" className="section audience-section">
          <div className="audience-photo" style={{ backgroundImage: `url(${PHOTO.overhead})` }} aria-hidden="true" />
          <div className="container">
            <Reveal>
              <div className="section-heading centered-heading">
                <span className="eyebrow">Four connected user roles</span>
                <h2>Built for Every Role in<br /><span>HOPEX EXPO.</span></h2>
                <p>Each role receives a focused experience while staying connected to the same booths, requests, attendance, and visitor journey.</p>
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

        {/* HOPEX plans and services. */}
        <section id="plans" className="section section-capabilities">
          <div className="container">
            <Reveal>
              <div className="section-heading split-heading">
                <div>
                  <span className="eyebrow">Plans & solutions</span>
                  <h2>Flexible Plans.<br /><span>Practical HOPEX Services.</span></h2>
                </div>
                <p>Choose the level of support that fits your exhibition, from complete setup to premium exhibitor visibility and advanced reporting.</p>
              </div>
            </Reveal>

            <div className="capability-grid">
              {hopexPlans.map((item, index) => {
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

        {/* Animated exhibition image-panel showcase. */}
        <section id="showcase" className="section showcase-panels-section">
          <div className="container">
            <Reveal>
              <div className="section-heading centered-heading">
                <span className="eyebrow"><Images size={14} /> Inside the experience</span>
                <h2>Inside the HOPEX EXPO Experience.</h2>
                <p>Explore the hall, booth spaces, shared 3D map, visitor routes, and company discovery experience.</p>
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
              <span className="eyebrow">Admin dashboard</span>
              <h2>Control Every Booth.<br /><span>Keep Operations Connected.</span></h2>
              <p>
                The HOPEX Admin dashboard gives the manager one place to view all 12 booths, review investor
                requests, manage employees, monitor QR attendance, and follow booth ratings.
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
                  <span className="gateway-sub">Enter Admin Dashboard</span>
                  <span className="gateway-arrow"><ArrowRight size={20} /></span>
                </div>
                <div className="floating-status status-live"><span /> 12 BOOTHS</div>
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
                <div className="floating-status status-secure investor-chip"><BadgeCheck size={15} /> BOOTH REQUESTS</div>
              </Link>
            </Reveal>

            <Reveal className="portal-copy">
              <span className="eyebrow">Investor dashboard</span>
              <h2>Explore the Right Booth.<br /><span>Submit a Clear Request.</span></h2>
              <p>
                Investors can create an account with their company name, explore available booths on the shared
                3D map, view price and status, submit a reservation request, and follow its approval state.
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
              <span className="eyebrow">Account-free visitor experience</span>
              <h2>Search. Navigate.<br /><span>Discover.</span></h2>
              <p>
                Visitors can open the interactive 3D map, search for a company or booth, view its information,
                follow a clear route, and submit a rating without creating an account.
              </p>
              <ol className="step-list">
                {visitorSteps.map((step, index) => (
                  <li key={step}><span>{index + 1}</span>{step}</li>
                ))}
              </ol>
              <div className="mini-feature-grid">
                <div><Search /><span><strong>Smart search</strong><small>Find companies and booths by name or number.</small></span></div>
                <div><Map /><span><strong>Guided routes</strong><small>Follow a clear route to the selected booth.</small></span></div>
                <div><BadgeCheck /><span><strong>Visitor ratings</strong><small>Rate booths from one to five stars.</small></span></div>
                <div><CircleUserRound /><span><strong>No account needed</strong><small>Open the visitor map without registration.</small></span></div>
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
                <span className="eyebrow">Four roles, one exhibition</span>
                <h2>Four Experiences.<br /><span>One Connected HOPEX EXPO.</span></h2>
                <p>Admin, investor, employee, and visitor experiences stay connected to the same exhibition and booth information.</p>
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
            <p className="ecosystem-footnote">HOPEX connects booth status, reservations, attendance, navigation, and ratings across one exhibition journey.</p>
          </div>
        </section>

        <section className="section platform-values">
          <div className="container value-grid">
            <Reveal className="value-statement">
              <span className="eyebrow">Why HOPEX matters</span>
              <h2>One Exhibition. Four Roles.<br /><span>One Connected Experience.</span></h2>
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
                <h2>Designed to Grow Beyond<br /><span>HOPEX EXPO.</span></h2>
                <p>These capabilities are planned for future development and are not part of the current platform.</p>
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
                <span className="eyebrow">One connected exhibition experience</span>
                <h2>Bring Every Part of<br /><span>HOPEX EXPO Together.</span></h2>
                <p>From booth reservations and employee attendance to visitor navigation and ratings, HOPEX connects every role in one exhibition experience.</p>
                <div className="cta-actions">
                  <a href="mailto:hello@hopex.sy" className="button button-primary button-large">Start a Conversation <ArrowRight size={19} /></a>
                  <Link to="/login" className="button button-ghost button-large"><LayoutDashboard size={19} /> Access HOPEX</Link>
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
              <h2>One Exhibition.<br /><span>Every Role Connected.</span></h2>
              <p>12 booths. Four roles. One shared 3D experience.</p>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <img src="/assets/hopex-logo.png" alt="HOPEX" />
            <p className="footer-tagline">One Platform. Every Role Connected.</p>
            <p>One connected platform for managing booths, investors, employees, and visitors inside HOPEX EXPO.</p>
          </div>
          <div className="footer-links">
            <div>
              <strong>Platform</strong>
              <a href="#platform">Features</a>
              <a href="#audience">User Roles</a>
              <Link to="/login">Admin Dashboard</Link>
              <Link to="/login">Investor Dashboard</Link>
              <Link to="/map">Visitor Map</Link>
              <a href="#future">Future Vision</a>
            </div>
            <div>
              <strong>Experience</strong>
              <Link to="/map">Interactive 3D Map</Link>
              <a href="#admin">Booth Management</a>
              <a href="#investor">Booth Reservations</a>
              <a href="#audience">Employee QR Attendance</a>
              <a href="#visitor">Visitor Navigation</a>
            </div>
            <div>
              <strong>Contact</strong>
              <a href="mailto:hello@hopex.sy">hello@hopex.sy</a>
              <span>Syria</span>
            </div>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© 2026 HOPEX. One connected exhibition experience.</span>
          <span>HOPEX EXPO</span>
        </div>
      </footer>
    </div>
  );
}