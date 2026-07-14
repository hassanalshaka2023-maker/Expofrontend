import { useEffect, useRef } from "react";
import "./AnimatedLoginBackdrop.css";

/**
 * AnimatedLoginBackdrop
 *
 * Premium, exhibition-inspired animated background for the login page.
 * All motion is CSS (transforms / opacity / gradients). The only JS is a single
 * rAF-throttled pointer handler that writes CSS variables for a soft
 * mouse-follow light and a very small parallax — no React state on pointer move,
 * and it disables itself when the user prefers reduced motion.
 */
export default function AnimatedLoginBackdrop() {
  const rootRef = useRef(null);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let raf = 0;
    let targetX = 50;
    let targetY = 45;
    let currentX = 50;
    let currentY = 45;

    const tick = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      node.style.setProperty("--login-glow-x", `${currentX.toFixed(2)}%`);
      node.style.setProperty("--login-glow-y", `${currentY.toFixed(2)}%`);
      node.style.setProperty("--login-px", (currentX / 100 - 0.5).toFixed(3));
      node.style.setProperty("--login-py", (currentY / 100 - 0.5).toFixed(3));

      if (
        Math.abs(targetX - currentX) > 0.1 ||
        Math.abs(targetY - currentY) > 0.1
      ) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    const onPointerMove = (event) => {
      targetX = (event.clientX / window.innerWidth) * 100;
      targetY = (event.clientY / window.innerHeight) * 100;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="login-bg" ref={rootRef} aria-hidden="true">
      <div className="login-bg-base" />
      <div className="login-bg-grid" />

      <div className="login-bg-blob login-bg-blob-cyan" />
      <div className="login-bg-blob login-bg-blob-teal" />
      <div className="login-bg-blob login-bg-blob-gold" />

      <div className="login-bg-floorplan">
        <span className="login-line login-line-1" />
        <span className="login-line login-line-2" />
        <span className="login-node login-node-1" />
        <span className="login-node login-node-2" />
      </div>

      <div className="login-bg-particles">
        {Array.from({ length: 20 }).map((_, index) => (
          <span
            key={index}
            className="login-bg-particle"
            data-accent={index % 5 === 0 ? "true" : undefined}
            style={{
              left: `${(index * 41) % 100}%`,
              top: `${(index * 57) % 96}%`,
              animationDelay: `${(index % 7) * -1.2}s`,
              animationDuration: `${8 + (index % 5)}s`,
            }}
          />
        ))}
      </div>

      <div className="login-bg-mouse-glow" />
      <div className="login-bg-vignette" />
    </div>
  );
}
