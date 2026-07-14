/* ==========================================================================
 * RouteToBooth — draws a live walking route from the exhibition entrance to the
 * booth the visitor selected. An L-shaped path (entrance → down the central
 * walkway → across to the booth) rendered as a glowing dashed line with an
 * animated "walking" dot, a start pin at the entrance, and a pulsing
 * destination marker (ring + bobbing pin + label) over the target booth.
 *
 * Purely visual guidance — no data/business logic. Mobile-visitor-only feature.
 * ======================================================================== */

import { useMemo, useRef } from "react";
import { Line, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Fixed start point: the main entrance, on the central walking path (z ~ 18).
const START = new THREE.Vector3(0, 0.12, 18);
const PATH = "#128a90";
const PATH_GLOW = "#7fe3e8";
const DEST = "#c9a45a";

export default function RouteToBooth({ target }) {
  const dotRef = useRef();
  const ringRef = useRef();
  const pinRef = useRef();

  const hasTarget = target && typeof target.x === "number" && typeof target.z === "number";

  // L-shaped route entrance → central walkway → booth, softened into a curve so
  // the animated dot glides naturally around the corner.
  const curve = useMemo(() => {
    if (!hasTarget) return null;
    const y = 0.12;
    const corner = new THREE.Vector3(0, y, target.z);
    const end = new THREE.Vector3(target.x, y, target.z);
    return new THREE.CatmullRomCurve3(
      [START.clone(), corner, end],
      false,
      "catmullrom",
      0.15
    );
  }, [hasTarget, target?.x, target?.z]);

  const linePoints = useMemo(() => (curve ? curve.getPoints(64) : []), [curve]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (curve && dotRef.current) {
      const u = (t * 0.16) % 1;
      const p = curve.getPointAt(u);
      dotRef.current.position.set(p.x, 0.28, p.z);
    }
    if (ringRef.current) {
      const s = 1 + Math.sin(t * 3) * 0.16;
      ringRef.current.scale.set(s, s, s);
      ringRef.current.material.opacity = 0.55 + Math.sin(t * 3) * 0.25;
    }
    if (pinRef.current) {
      pinRef.current.position.y = 3.25 + Math.sin(t * 2.4) * 0.14;
      pinRef.current.rotation.y = t * 1.4;
    }
  });

  if (!curve || !hasTarget) return null;

  const ex = target.x;
  const ez = target.z;

  return (
    <group>
      {/* Soft wide glow underlay + crisp dashed route line */}
      <Line points={linePoints} color={PATH_GLOW} lineWidth={10} transparent opacity={0.14} />
      <Line
        points={linePoints}
        color={PATH}
        lineWidth={4}
        dashed
        dashSize={0.6}
        gapSize={0.34}
        transparent
        opacity={0.96}
      />

      {/* Start pin at the entrance */}
      <mesh position={[START.x, 0.24, START.z]}>
        <sphereGeometry args={[0.24, 18, 18]} />
        <meshStandardMaterial color={PATH} emissive={PATH} emissiveIntensity={1.4} />
      </mesh>

      {/* Animated walking dot gliding toward the booth */}
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.28, 18, 18]} />
        <meshStandardMaterial color="#25b6bd" emissive="#25b6bd" emissiveIntensity={1.9} />
      </mesh>

      {/* Destination — pulsing ground ring */}
      <mesh
        ref={ringRef}
        position={[ex, 0.1, ez]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[1.95, 2.3, 48]} />
        <meshBasicMaterial color={DEST} transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>

      {/* Destination — bobbing floating marker above the booth */}
      <mesh ref={pinRef} position={[ex, 3.25, ez]}>
        <octahedronGeometry args={[0.34, 0]} />
        <meshStandardMaterial color={DEST} emissive={DEST} emissiveIntensity={0.9} />
      </mesh>

      {/* Destination label */}
      <Html position={[ex, 4.0, ez]} center distanceFactor={13} zIndexRange={[40, 0]}>
        <div
          style={{
            pointerEvents: "none",
            userSelect: "none",
            whiteSpace: "nowrap",
            padding: "5px 12px",
            borderRadius: 999,
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.04em",
            color: "#5a3d12",
            background: "rgba(255,240,214,0.96)",
            border: "1px solid rgba(201,164,90,0.9)",
            boxShadow: "0 6px 16px rgba(40,55,70,0.28)",
          }}
        >
          📍 Your destination
        </div>
      </Html>
    </group>
  );
}
