/* ==========================================================================
 * boothKit — shared HOPEX booth design tokens + logic (no JSX/components).
 *
 * Bright, semi-realistic "outdoor exhibition garden" direction: natural wood,
 * cream/white fabric, warm colours, matte materials (high roughness, near-zero
 * metalness), HOPEX turquoise + gold only as subtle accents. Contains the
 * material palette, per-booth colour selection, the deterministic variant
 * selector, the shared soft contact-shadow texture, and the interaction hook.
 * Visual primitives live in ./booths/boothPrimitives; the small status accents
 * live in STATUS_ACCENT below. No API / reservation / data-fetching logic.
 * ======================================================================== */

import { useState } from "react";
import * as THREE from "three";

const mat = (color, roughness = 0.8, metalness = 0.04, extra = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });

/* --- Shared natural/structural materials (created once, reused everywhere). -- */
export const MAT = {
  woodLight: mat("#c69257"),
  wood: mat("#a9743f"),
  woodDark: mat("#7c5228"),
  woodPost: mat("#93602f"),
  cream: mat("#f1e7cf", 0.72),
  white: mat("#f8f8f2", 0.68),
  offWhite: mat("#eceee6", 0.7),
  fabricRed: mat("#c15a44", 0.78),
  fabricOrange: mat("#e29350", 0.76),
  fabricYellow: mat("#f2c85f", 0.74),
  fabricGreen: mat("#77b05a", 0.76),
  fabricSky: mat("#8ac6e6", 0.7),
  panelBlue: mat("#dfeef6", 0.62),
  counter: mat("#efe6d2", 0.68),
  counterWood: mat("#b07e46", 0.78),
  metalDark: mat("#41505d", 0.5, 0.45),
  metalLight: mat("#c9d2d8", 0.5, 0.4),
  gold: mat("#c9a45a", 0.42, 0.7),
  turquoise: mat("#25b6bd", 0.5, 0.25),
  foliage: mat("#5fa24b", 0.85),
  foliageDark: mat("#4a8a3d", 0.85),
  trunk: mat("#7a5330", 0.9),
  soil: mat("#6b4a2c", 0.95),
  screen: mat("#123b4a", 0.35, 0.2, {
    emissive: new THREE.Color("#1d6f7d"),
    emissiveIntensity: 0.55,
  }),
  glass: new THREE.MeshStandardMaterial({
    color: "#cfeaf3",
    roughness: 0.12,
    metalness: 0.1,
    transparent: true,
    opacity: 0.34,
  }),
};

/* --- Small, coordinated STATUS accents. The booth is NEVER fully coloured by
 *     status — only the sign badge + a subtle base outline use these. --------- */
export const STATUS_ACCENT = {
  Available: {
    accent: "#17b8a6",
    ring: "#17b8a6",
    label: "Available",
    badgeText: "#0c6b60",
    badgeBg: "rgba(23,184,166,0.16)",
    badgeBorder: "rgba(23,184,166,0.65)",
  },
  Pending: {
    accent: "#d59a3c",
    ring: "#d59a3c",
    label: "Pending",
    badgeText: "#7a5410",
    badgeBg: "rgba(213,154,60,0.18)",
    badgeBorder: "rgba(213,154,60,0.65)",
  },
  Reserved: {
    accent: "#c05b52",
    ring: "#c05b52",
    label: "Reserved",
    badgeText: "#7d2f28",
    badgeBg: "rgba(192,91,82,0.18)",
    badgeBorder: "rgba(192,91,82,0.65)",
  },
};

/* Tiny self-illuminating status pucks (2 intensities so hover/selected brighten
 * by swapping the reference — no per-instance material, no per-booth light). */
const makeAccent = (hex, intensity) =>
  new THREE.MeshStandardMaterial({
    color: hex,
    emissive: new THREE.Color(hex),
    emissiveIntensity: intensity,
    roughness: 0.4,
    metalness: 0.2,
  });
const ACCENT_MAT = {
  Available: makeAccent("#17b8a6", 0.85),
  Pending: makeAccent("#d59a3c", 0.8),
  Reserved: makeAccent("#c05b52", 0.7),
};
const ACCENT_MAT_BRIGHT = {
  Available: makeAccent("#17b8a6", 1.7),
  Pending: makeAccent("#d59a3c", 1.6),
  Reserved: makeAccent("#c05b52", 1.4),
};

/* --- Per-booth colour palettes (bright, controlled). Chosen deterministically
 *     from the boothId so the same booth always looks the same, for every role,
 *     and is independent of status. -------------------------------------------- */
const PALETTES = [
  { canopy: "#f4ecd6", accent: "#c15a44", trim: MAT.fabricRed }, // cream + terracotta
  { canopy: "#f8f8f2", accent: "#8ac6e6", trim: MAT.fabricSky }, // white + sky
  { canopy: "#f2c85f", accent: "#a9743f", trim: MAT.fabricYellow }, // warm yellow + wood
  { canopy: "#e29350", accent: "#7c5228", trim: MAT.fabricOrange }, // soft orange
  { canopy: "#f1e7cf", accent: "#77b05a", trim: MAT.fabricGreen }, // cream + green
  { canopy: "#dfeef6", accent: "#25b6bd", trim: MAT.fabricSky }, // pale blue + turquoise
];
const CANOPY_MATS = PALETTES.map((p) => mat(p.canopy, 0.74, 0.03));

export function hashString(key) {
  const str = String(key || "");
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

/* Returns { canopy(hex), canopyMat, accent(hex), stripeMat } for a booth. */
export function getBoothPalette(booth, index = 0) {
  const key = (booth && booth.boothId) || String(index);
  const i = hashString(key) % PALETTES.length;
  return {
    ...PALETTES[i],
    canopyMat: CANOPY_MATS[i],
    stripeMat: PALETTES[i].trim,
  };
}

/* ==========================================================================
 * getBoothVisualVariant — deterministic, stable variant selection across the
 * six coordinated booth families. Priority:
 *   1. Real, stable position3D coordinates classify the exhibition zone.
 *   2. Stable hash of the real boothId as a fallback.
 * The same booth always resolves to the same family across refreshes and for
 * every role, and never depends on status/reservation. No Math.random.
 * ======================================================================== */
const FAMILIES = [
  "garden-canopy",
  "colorful-market",
  "modern-trade",
  "wooden-pavilion",
  "premium",
  "open-island",
];

export function getBoothVisualVariant(booth, index = 0) {
  const pos = (booth && booth.position3D) || {};
  const x = typeof pos.x === "number" ? pos.x : null;
  const z = typeof pos.z === "number" ? pos.z : null;

  if (x !== null && z !== null) {
    const ax = Math.abs(x);
    const az = Math.abs(z);
    const outer = ax >= 10;
    const center = ax <= 6;

    if (center && az <= 4) return "open-island"; // central walk-around core
    if (center && z < 0) return "modern-trade"; // central-back tech zone
    if (outer && z >= 10) return "premium"; // front outer corners
    if (outer && z <= -10) return "wooden-pavilion"; // back outer corners
    if (outer && z >= 2) return "colorful-market"; // outer mid-front rows
    if (outer && z < 2) return "garden-canopy"; // outer mid-back rows
  }

  return FAMILIES[hashString((booth && booth.boothId) || String(index)) % FAMILIES.length];
}

/* --- Shared soft blob-shadow texture (one cheap contact shadow per booth). -- */
function createShadowTexture() {
  if (typeof document === "undefined") return null;
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(40,30,15,0.42)");
  g.addColorStop(0.65, "rgba(40,30,15,0.14)");
  g.addColorStop(1, "rgba(40,30,15,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}
export const shadowTexture = createShadowTexture();

/* ==========================================================================
 * useBoothInteraction — one hover/click/selection implementation shared by all
 * families. Behaviour is identical to the original booth:
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
