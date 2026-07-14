import { useEffect, useRef, type CSSProperties } from 'react';
import './InteractiveHeroBackground.css';

/**
 * Soft, very low-opacity light particles that drift behind the HOPEX logo.
 * Count is reduced on small screens via CSS (see .hero-bg-particle nth-child
 * rules). Placement is deterministic so it stays stable across re-renders.
 */
function FloatingParticles({ count }: { count: number }) {
  return (
    <div className="hero-bg-particles" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => {
        const style: CSSProperties = {
          left: `${(index * 37) % 100}%`,
          top: `${(index * 53) % 96}%`,
          animationDelay: `${(index % 8) * -1.1}s`,
          animationDuration: `${9 + (index % 6)}s`,
        };
        return (
          <span
            key={index}
            className="hero-bg-particle"
            data-accent={index % 5 === 0 ? 'true' : undefined}
            style={style}
          />
        );
      })}
    </div>
  );
}

/** Soft cursor-following light. Position is driven by CSS variables the parent
 * updates through requestAnimationFrame — no React state on pointer move. */
function MouseGlow() {
  return <div className="hero-bg-mouse-glow" aria-hidden="true" />;
}

/**
 * InteractiveHeroBackground
 *
 * The animated, exhibition-inspired background that sits behind the HOPEX logo
 * in the landing hero. Everything is CSS transforms/opacity/gradients; the only
 * JS is a single rAF-throttled pointer handler that writes CSS variables for a
 * soft mouse-follow glow and a very small parallax. Respects reduced motion.
 */
export default function InteractiveHeroBackground() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReducedMotion) return;

    let raf = 0;
    let targetX = 50;
    let targetY = 50;
    let currentX = 50;
    let currentY = 50;

    const tick = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      node.style.setProperty('--hero-glow-x', `${currentX.toFixed(2)}%`);
      node.style.setProperty('--hero-glow-y', `${currentY.toFixed(2)}%`);
      node.style.setProperty('--hero-px', (currentX / 100 - 0.5).toFixed(3));
      node.style.setProperty('--hero-py', (currentY / 100 - 0.5).toFixed(3));

      if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      targetX = (event.clientX / window.innerWidth) * 100;
      targetY = (event.clientY / window.innerHeight) * 100;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="hero-bg" ref={rootRef} aria-hidden="true">
      <div className="hero-bg-base" />
      <div className="hero-bg-grid" />

      <div className="hero-bg-blob hero-bg-blob-cyan" />
      <div className="hero-bg-blob hero-bg-blob-teal" />
      <div className="hero-bg-blob hero-bg-blob-gold" />

      <div className="hero-bg-floorplan">
        <span className="floorplan-line line-1" />
        <span className="floorplan-line line-2" />
        <span className="floorplan-line line-3" />
        <span className="floorplan-node node-1" />
        <span className="floorplan-node node-2" />
      </div>

      <div className="hero-bg-shapes">
        <span className="hero-bg-shape shape-ring" />
        <span className="hero-bg-shape shape-square" />
        <span className="hero-bg-shape shape-diamond" />
      </div>

      <FloatingParticles count={22} />
      <MouseGlow />

      <div className="hero-bg-vignette" />
    </div>
  );
}
