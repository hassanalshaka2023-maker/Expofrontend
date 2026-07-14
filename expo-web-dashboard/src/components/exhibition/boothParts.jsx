/* ==========================================================================
 * boothParts — shared visual primitives used by every booth variant:
 * BoothBase (interaction hitbox + contact shadow + status/selection floor
 * markers + signage slot), BoothSign, and BoothTooltip. Design tokens and the
 * interaction hook live in ./boothKit.
 * ======================================================================== */

import * as THREE from "three";
import { Html } from "@react-three/drei";
import { shadowTexture } from "./boothKit";

const labelStyle = {
  pointerEvents: "none",
  userSelect: "none",
  fontFamily: "Inter, system-ui, sans-serif",
};

/* Consistent booth signage (booth number + company / "Available Booth"). */
export function BoothSign({ id, displayName, statusStyle, accent, y = 2.8 }) {
  return (
    <Html position={[0, y, -1.9]} center distanceFactor={12} zIndexRange={[20, 0]} style={labelStyle}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          padding: "7px 15px",
          borderRadius: 11,
          whiteSpace: "nowrap",
          textAlign: "center",
          background: "rgba(6,16,28,0.82)",
          border: `1px solid ${statusStyle.badgeBorder}`,
          boxShadow: "0 6px 18px rgba(0,0,0,0.4)",
        }}
      >
        <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: "0.05em", color: accent }}>
          {id}
        </span>
        <span style={{ fontSize: 11.5, fontWeight: 600, color: "#e7edf3" }}>{displayName}</span>
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
export function BoothTooltip({ id, statusStyle, displayName, category, accent, y = 3.7 }) {
  return (
    <Html position={[0, y, 0]} center distanceFactor={12} zIndexRange={[30, 0]} style={labelStyle}>
      <div
        style={{
          padding: "6px 12px",
          borderRadius: 9,
          whiteSpace: "nowrap",
          background: "rgba(6,16,28,0.9)",
          border: `1px solid ${statusStyle.badgeBorder}`,
          color: "#e7edf3",
          fontSize: 11.5,
          fontWeight: 600,
          boxShadow: "0 6px 16px rgba(0,0,0,0.45)",
        }}
      >
        <span style={{ color: accent, fontWeight: 800 }}>Booth {id}</span>
        {"  ·  "}
        {statusStyle.label}
        {"  ·  "}
        {displayName}
        {category ? `  ·  ${category}` : ""}
      </div>
    </Html>
  );
}

/* Shared shell for every variant: interaction hitbox, soft contact shadow,
 * status floor marker, selection ring, signage + hover tooltip. The variant
 * supplies only its unique structure via `children`. No per-booth light. */
export function BoothBase({
  id,
  position,
  interaction,
  footprint = 4.4,
  height = 2.4,
  signY = 2.8,
  markerRadius = 2.55,
  children,
}) {
  const { hovered, clicked, selected, isClickable, statusStyle, accent, displayName, category, handlers } =
    interaction;
  const px = position.x;
  const py = position.y;
  const pz = position.z;
  const active = hovered || selected;

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

      {/* Soft contact shadow */}
      {shadowTexture && (
        <mesh position={[px, py + 0.015, pz]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[footprint + 2, footprint + 2]} />
          <meshBasicMaterial map={shadowTexture} transparent opacity={0.85} depthWrite={false} />
        </mesh>
      )}

      {/* Subtle status floor marker */}
      <mesh position={[px, py + 0.04, pz]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[markerRadius, markerRadius + 0.26, 64]} />
        <meshBasicMaterial color={accent} transparent opacity={active ? 0.5 : 0.2} side={THREE.DoubleSide} />
      </mesh>

      {/* Selection ring (controlled, static — no strong pulsing) */}
      {selected && (
        <mesh position={[px, py + 0.06, pz]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[markerRadius - 0.7, markerRadius + 0.55, 64]} />
          <meshBasicMaterial color={accent} transparent opacity={0.45} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Brief click ring */}
      {clicked && (
        <mesh position={[px, py + 0.07, pz]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[markerRadius - 0.5, markerRadius + 0.9, 64]} />
          <meshBasicMaterial color={accent} transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Variant-specific structure + shared signage */}
      <group position={[px, py, pz]}>
        {children}
        <BoothSign id={id} displayName={displayName} statusStyle={statusStyle} accent={accent} y={signY} />
        {hovered && isClickable && (
          <BoothTooltip
            id={id}
            statusStyle={statusStyle}
            displayName={displayName}
            category={category}
            accent={accent}
            y={signY + 0.9}
          />
        )}
      </group>
    </group>
  );
}
