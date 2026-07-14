/* ==========================================================================
 * boothKit — shared HOPEX booth design tokens + logic (no JSX/components).
 *
 * Material palette, status accents, the deterministic variant selector, the
 * shared soft-shadow texture, and the interaction hook. Visual primitives
 * (BoothBase / BoothSign / BoothTooltip) live in ./boothParts. Purely
 * presentational data — no API / reservation / data-fetching logic.
 * ======================================================================== */

import { useState } from "react";
import * as THREE from "three";

/* --- Status accents. Muted on purpose: never a full green/orange/red booth. -- */
export const STATUS_ACCENT = {
  Available: {
    accent: "#20d8dc",
    label: "Available",
    badgeText: "#8ff4f4",
    badgeBg: "rgba(32,216,220,0.14)",
    badgeBorder: "rgba(32,216,220,0.55)",
  },
  Pending: {
    accent: "#d9a94a",
    label: "Pending",
    badgeText: "#f1d193",
    badgeBg: "rgba(217,169,74,0.14)",
    badgeBorder: "rgba(217,169,74,0.55)",
  },
  Reserved: {
    accent: "#c05b52",
    label: "Reserved",
    badgeText: "#e7a9a1",
    badgeBg: "rgba(192,91,82,0.16)",
    badgeBorder: "rgba(192,91,82,0.55)",
  },
};

/* --- Shared neutral materials (created once, reused by every booth). -------- */
export const sharedMaterials = {
  navy: new THREE.MeshStandardMaterial({ color: "#0b1b2e", roughness: 0.62, metalness: 0.3 }),
  charcoal: new THREE.MeshStandardMaterial({ color: "#171b22", roughness: 0.78, metalness: 0.18 }),
  panel: new THREE.MeshStandardMaterial({ color: "#e7edf3", roughness: 0.55, metalness: 0.08 }),
  panelSoft: new THREE.MeshStandardMaterial({ color: "#aeb9c5", roughness: 0.6, metalness: 0.1 }),
  frame: new THREE.MeshStandardMaterial({ color: "#243244", roughness: 0.5, metalness: 0.42 }),
  gold: new THREE.MeshStandardMaterial({ color: "#c9a45a", roughness: 0.4, metalness: 0.8 }),
  screen: new THREE.MeshStandardMaterial({
    color: "#04222b",
    roughness: 0.25,
    metalness: 0.4,
    emissive: new THREE.Color("#0c3d47"),
    emissiveIntensity: 0.75,
  }),
};

/* Shared self-illuminating accent materials per status, at two intensities so
 * hover/selected can brighten by swapping the reference — no per-instance
 * material allocation and no per-booth light. */
const makeAccent = (hex, intensity) =>
  new THREE.MeshStandardMaterial({
    color: hex,
    emissive: new THREE.Color(hex),
    emissiveIntensity: intensity,
    roughness: 0.4,
    metalness: 0.3,
  });

const ACCENT_MAT = {
  Available: makeAccent("#20d8dc", 0.9),
  Pending: makeAccent("#d9a94a", 0.85),
  Reserved: makeAccent("#c05b52", 0.7),
};
const ACCENT_MAT_BRIGHT = {
  Available: makeAccent("#20d8dc", 1.95),
  Pending: makeAccent("#d9a94a", 1.8),
  Reserved: makeAccent("#c05b52", 1.5),
};

/* --- Shared soft blob-shadow texture (one cheap contact shadow per booth). -- */
function createShadowTexture() {
  if (typeof document === "undefined") return null;
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(0,0,0,0.5)");
  g.addColorStop(0.65, "rgba(0,0,0,0.16)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}
export const shadowTexture = createShadowTexture();

/* ==========================================================================
 * getBoothVisualVariant — deterministic, stable variant selection.
 *
 * Priority (per spec):
 *   1. Real type/dimension data — none exists in the schema, and `category` is
 *      mutable (changes on reserve/reject), so it is NOT used for stability.
 *   2. Real, stable position3D coordinates identify corner / central booths.
 *   3. Stable hash of the real boothId as a fallback.
 *   4. Array index only as the last resort.
 * The same booth always resolves to the same variant across refreshes, and the
 * result never depends on status/reservation state. No Math.random.
 * ======================================================================== */
export function getBoothVisualVariant(booth, index = 0) {
  const pos = (booth && booth.position3D) || {};
  const x = typeof pos.x === "number" ? pos.x : null;
  const z = typeof pos.z === "number" ? pos.z : null;

  if (x !== null && z !== null) {
    const ax = Math.abs(x);
    const az = Math.abs(z);
    if (ax >= 10 && z >= 10) return "premium"; // front outer corners
    if (ax >= 10 && z <= -10) return "corner"; // back outer corners
    if (ax <= 6 && z <= -3) return "technology"; // central-back tech zone
    if (ax <= 6 && az <= 4) return "island"; // central core
    if (ax >= 10) return "standard"; // mid side rows
  }

  const variants = ["standard", "corner", "island", "premium", "technology"];
  const key = (booth && booth.boothId) || String(index);
  let h = 0;
  for (let i = 0; i < key.length; i += 1) {
    h = (h * 31 + key.charCodeAt(i)) >>> 0;
  }
  return variants[h % variants.length];
}

/* ==========================================================================
 * useBoothInteraction — one hover/click/selection implementation shared by all
 * variants. Mirrors the original WebBooth3D behaviour exactly:
 *   - clickable when Available OR allowAllClicks
 *   - onSelect({ boothId, status, companyDetails }) on click
 *   - pointer cursor + hover state
 * ======================================================================== */
export function useBoothInteraction({
  id,
  status,
  companyDetails,
  onSelect,
  allowAllClicks = false,
  selected = false,
}) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const isAvailable = status === "Available";
  const isClickable = isAvailable || allowAllClicks;
  const statusStyle = STATUS_ACCENT[status] || STATUS_ACCENT.Available;
  const companyName =
    companyDetails && companyDetails.companyName ? companyDetails.companyName : "";
  const category =
    companyDetails && companyDetails.category ? companyDetails.category : "";
  const displayName = companyName || "Available Booth";
  const active = hovered || !!selected;
  const accentPool = active ? ACCENT_MAT_BRIGHT : ACCENT_MAT;
  const accentMaterial = accentPool[status] || accentPool.Available;

  const handlers = {
    onClick: (e) => {
      e.stopPropagation();
      if (!isClickable) return;
      setClicked(true);
      setTimeout(() => setClicked(false), 300);
      onSelect({ boothId: id, status, companyDetails });
    },
    onPointerOver: (e) => {
      e.stopPropagation();
      if (isClickable) {
        setHovered(true);
        document.body.style.cursor = "pointer";
      }
    },
    onPointerOut: () => {
      setHovered(false);
      document.body.style.cursor = "default";
    },
  };

  return {
    hovered,
    clicked,
    active,
    selected: !!selected,
    isClickable,
    isAvailable,
    statusStyle,
    accent: statusStyle.accent,
    accentMaterial,
    companyName,
    category,
    displayName,
    handlers,
  };
}
