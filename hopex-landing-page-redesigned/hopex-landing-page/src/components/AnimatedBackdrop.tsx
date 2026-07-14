import { useEffect, useRef } from 'react';

type Point = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  accent: boolean;
};

export default function AnimatedBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let width = 0;
    let height = 0;
    let points: Point[] = [];
    const pointer = { x: 0, y: 0, active: false };

    const createPoints = () => {
      const count = Math.max(28, Math.min(64, Math.floor(width / 24)));
      points = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        radius: Math.random() * 1.35 + 0.45,
        accent: index % 6 === 0,
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      createPoints();
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);

      points.forEach((point, index) => {
        if (!prefersReducedMotion) {
          point.x += point.vx;
          point.y += point.vy;

          if (point.x < -20) point.x = width + 20;
          if (point.x > width + 20) point.x = -20;
          if (point.y < -20) point.y = height + 20;
          if (point.y > height + 20) point.y = -20;

          if (pointer.active) {
            const dx = pointer.x - point.x;
            const dy = pointer.y - point.y;
            const distance = Math.hypot(dx, dy);
            if (distance < 180 && distance > 0) {
              point.x -= (dx / distance) * 0.08;
              point.y -= (dy / distance) * 0.08;
            }
          }
        }

        for (let nextIndex = index + 1; nextIndex < points.length; nextIndex += 1) {
          const nextPoint = points[nextIndex];
          const distance = Math.hypot(point.x - nextPoint.x, point.y - nextPoint.y);
          if (distance < 145) {
            const opacity = (1 - distance / 145) * 0.18;
            context.beginPath();
            context.moveTo(point.x, point.y);
            context.lineTo(nextPoint.x, nextPoint.y);
            context.strokeStyle = point.accent
              ? `rgba(200, 164, 80, ${opacity})`
              : `rgba(19, 213, 211, ${opacity})`;
            context.lineWidth = 0.7;
            context.stroke();
          }
        }

        context.beginPath();
        context.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        context.fillStyle = point.accent
          ? 'rgba(211, 174, 84, 0.72)'
          : 'rgba(34, 226, 221, 0.62)';
        context.fill();
      });

      if (!prefersReducedMotion) frame = window.requestAnimationFrame(draw);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    resize();
    draw();

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove);
    document.documentElement.addEventListener('pointerleave', onPointerLeave);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}
