/* ==========================================================================
 * boothPrimitives — shared visual primitives used by every booth family.
 *
 *  - BoothBase: interaction hitbox + soft contact shadow + subtle status base
 *    outline + selection/click rings + signage slot. The family supplies only
 *    its unique structure via `children`.
 *  - BoothSign / BoothTooltip: bright, readable signage using only real data.
 *  - Small reusable parts (Post, Planter, Flag, Counter, RollUpBanner,
 *    ScreenPanel, DisplayTable) so each family stays short and consistent.
 *
 * Design tokens + interaction hook live in ../boothKit. No data/API logic.
 * ======================================================================== */

import * as THREE from "three";
import { Html } from "@react-three/drei";
import { MAT, shadowTexture } from "../boothKit";

const labelStyle = {
  pointerEvents: "none",
  userSelect: "none",
  fontFamily: "Inter, system-ui, sans-serif",
};

/* Bright booth sign: booth number + company (or "Available Booth") + status. */
export function BoothSign({ id, displayName, statusStyle, y = 2.8 }) {
  return (
    <Html position={[0, y, -1.9]} center distanceFactor={12} zIndexRange={[20, 0]} style={labelStyle}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          padding: "6px 14px",
          borderRadius: 12,
          whiteSpace: "nowrap",
          textAlign: "center",
          background: "rgba(255,255,255,0.94)",
          border: "1px solid rgba(28,52,74,0.14)",
          boxShadow: "0 6px 16px rgba(40,55,70,0.22)",
        }}
      >
        <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: "0.04em", color: "#1f3346" }}>
          {id}
        </span>
        <span style={{ fontSize: 11.5, fontWeight: 600, color: "#41556a" }}>{displayName}</span>
        <span
          style={{
            marginTop: 1,
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.09em",
            textTransform: "uppercase",
            color: statusStyle.badgeText,
            background: statusStyle.badgeBg,
            border: `1px solid ${statusStyle.badgeBorder}`,
            borderRadius: 999,
            padding: "1px 8px",
          }}
        >
          {statusStyle.label}
        </span>
      </div>
    </Html>
  );
}

/* Concise hover tooltip using only real data. */
export function BoothTooltip({ id, statusStyle, displayName, category, y = 3.7 }) {
  return (
    <Html position={[0, y, 0]} center distanceFactor={12} zIndexRange={[30, 0]} style={labelStyle}>
      <div
        style={{
          padding: "6px 12px",
          borderRadius: 9,
          whiteSpace: "nowrap",
          background: "rgba(23,38,54,0.92)",
          border: `1px solid ${statusStyle.badgeBorder}`,
          color: "#f2f6fa",
          fontSize: 11.5,
          fontWeight: 600,
          boxShadow: "0 6px 16px rgba(0,0,0,0.35)",
        }}
      >
        <span style={{ color: statusStyle.accent, fontWeight: 800 }}>Booth {id}</span>
        {"  ·  "}
        {statusStyle.label}
        {"  ·  "}
        {displayName}
        {category ? `  ·  ${category}` : ""}
      </div>
    </Html>
  );
}

/* Shared shell: interaction hitbox, soft contact shadow, subtle status base
 * outline, selection ring, signage + hover tooltip. `children` = family form. */
export function BoothBase({
  id,
  position,
  interaction,
  footprint = 4.4,
  height = 2.4,
  signY = 2.8,
  markerRadius = 2.5,
  children,
}) {
  const { hovered, clicked, selected, isClickable, statusStyle, displayName, category, handlers } =
    interaction;
  const px = position.x;
  const py = position.y;
  const pz = position.z;
  const active = hovered || selected;
  const ring = statusStyle.ring;

  return (
    <group>
      {/* Invisible interaction hitbox (same behaviour as the original booth) */}
      <mesh
        position={[px, py + height / 2, pz]}
        onClick={handlers.onClick}
        onPointerOver={handlers.onPointerOver}
        onPointerOut={handlers.onPointerOut}
      >
        <boxGeometry args={[footprint + 0.4, height, footprint + 0.4]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Soft contact shadow on the grass */}
      {shadowTexture && (
        <mesh position={[px, py + 0.02, pz]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[footprint + 2, footprint + 2]} />
          <meshBasicMaterial map={shadowTexture} transparent opacity={0.8} depthWrite={false} />
        </mesh>
      )}

      {/* Subtle status base outline (small — never a fully coloured booth) */}
      <mesh position={[px, py + 0.05, pz]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[markerRadius, markerRadius + 0.16, 64]} />
        <meshBasicMaterial color={ring} transparent opacity={active ? 0.55 : 0.28} side={THREE.DoubleSide} />
      </mesh>

      {/* Selection ring (controlled, static — no aggressive pulsing) */}
      {selected && (
        <mesh position={[px, py + 0.07, pz]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[markerRadius - 0.55, markerRadius - 0.35, 64]} />
          <meshBasicMaterial color={ring} transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Brief click ring */}
      {clicked && (
        <mesh position={[px, py + 0.08, pz]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[markerRadius - 0.3, markerRadius + 0.6, 64]} />
          <meshBasicMaterial color={ring} transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Family-specific structure + shared signage */}
      <group position={[px, py, pz]}>
        {children}
        <BoothSign id={id} displayName={displayName} statusStyle={statusStyle} y={signY} />
        {hovered && isClickable && (
          <BoothTooltip
            id={id}
            statusStyle={statusStyle}
            displayName={displayName}
            category={category}
            y={signY + 0.9}
          />
        )}
      </group>
    </group>
  );
}

/* ---- Small reusable parts (all local to a booth's origin group) ---------- */

export function Post({ position, h = 2.2, r = 0.09, material = MAT.woodPost }) {
  return (
    <mesh position={position} material={material} castShadow>
      <cylinderGeometry args={[r, r, h, 10]} />
    </mesh>
  );
}

export function Counter({ position = [0, 0, 0], w = 1.6, top = MAT.counter, body = MAT.counterWood }) {
  const [x, y, z] = position;
  return (
    <group>
      <mesh position={[x, y + 0.45, z]} material={body} castShadow>
        <boxGeometry args={[w, 0.9, 0.55]} />
      </mesh>
      <mesh position={[x, y + 0.92, z]} material={top}>
        <boxGeometry args={[w + 0.14, 0.07, 0.66]} />
      </mesh>
    </group>
  );
}

export function DisplayTable({ position = [0, 0, 0], top = MAT.cream }) {
  const [x, y, z] = position;
  return (
    <group>
      <mesh position={[x, y + 0.42, z]} material={MAT.metalLight}>
        <cylinderGeometry args={[0.09, 0.09, 0.84, 8]} />
      </mesh>
      <mesh position={[x, y + 0.86, z]} material={top}>
        <cylinderGeometry args={[0.42, 0.42, 0.08, 20]} />
      </mesh>
    </group>
  );
}

export function ScreenPanel({ position = [0, 1.3, -1.85], w = 1.5, h = 0.95 }) {
  const [x, y, z] = position;
  return (
    <group>
      <mesh position={[x, y, z]} material={MAT.metalDark}>
        <boxGeometry args={[w + 0.12, h + 0.12, 0.05]} />
      </mesh>
      <mesh position={[x, y, z + 0.03]} material={MAT.screen}>
        <boxGeometry args={[w, h, 0.03]} />
      </mesh>
    </group>
  );
}

export function RollUpBanner({ position = [0, 0, 0], accent = MAT.turquoise }) {
  const [x, y, z] = position;
  return (
    <group>
      <mesh position={[x, y + 0.05, z]} material={MAT.metalLight}>
        <boxGeometry args={[0.7, 0.08, 0.35]} />
      </mesh>
      <mesh position={[x, y + 1.05, z]} material={MAT.white}>
        <boxGeometry args={[0.62, 2.0, 0.03]} />
      </mesh>
      <mesh position={[x, y + 1.65, z + 0.02]} material={accent}>
        <boxGeometry args={[0.5, 0.5, 0.02]} />
      </mesh>
    </group>
  );
}

/* Cached tint materials so hover re-renders never allocate/leak GPU materials. */
const tintCache = new Map();
function tintMaterial(color, extra) {
  const key = `${color}|${extra ? "ds" : ""}`;
  let m = tintCache.get(key);
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color, roughness: 0.8, ...extra });
    tintCache.set(key, m);
  }
  return m;
}

/* Planter box with a few low flower puffs. */
export function Planter({ position = [0, 0, 0], flower = "#e0664f" }) {
  const [x, y, z] = position;
  const flowerMat = tintMaterial(flower);
  return (
    <group>
      <mesh position={[x, y + 0.22, z]} material={MAT.woodDark} castShadow>
        <boxGeometry args={[0.9, 0.44, 0.5]} />
      </mesh>
      <mesh position={[x, y + 0.42, z]} material={MAT.foliage}>
        <boxGeometry args={[0.8, 0.16, 0.42]} />
      </mesh>
      {[-0.26, 0, 0.26].map((dx) => (
        <mesh key={dx} position={[x + dx, y + 0.56, z]} material={flowerMat}>
          <sphereGeometry args={[0.12, 8, 8]} />
        </mesh>
      ))}
    </group>
  );
}

/* Small decorative flag on a slim pole. */
export function Flag({ position = [0, 0, 0], color = "#25b6bd", h = 1.9 }) {
  const [x, y, z] = position;
  const flagMat = tintMaterial(color, { side: THREE.DoubleSide });
  return (
    <group>
      <mesh position={[x, y + h / 2, z]} material={MAT.metalLight}>
        <cylinderGeometry args={[0.03, 0.03, h, 6]} />
      </mesh>
      <mesh position={[x + 0.28, y + h - 0.28, z]} material={flagMat}>
        <planeGeometry args={[0.52, 0.34]} />
      </mesh>
    </group>
  );
}
