/* ==========================================================================
 * investorBoothDetails — Investor PRESENTATION metadata (frontend-only).
 *
 * Booth Price / Area / Location shown in the Investor side panel are display
 * values maintained here in the frontend. They are NOT persisted by the
 * backend, are NOT part of the GET /booths response, and are NOT used by any
 * booking or reservation calculation. Keys are the real backend booth IDs
 * (B1..B12, see HopexBackend booths.service initializeExpoGrid).
 *
 * Locations are human-readable names derived from the seeded exhibition
 * layout (Right Wing x<0 / Left Wing x>0 / Center Core around the main
 * stage; higher z = closer to the main entrance). Areas are presentation
 * sizes assigned per booth class (the 3D scene uses stylized, non-metric
 * units, so display areas are defined here instead).
 * ======================================================================== */

const investorBoothDetails = {
  // Right Wing (x < 0) — 4 booths
  B1: {
    price: 2500,
    currency: "USD",
    area: 36,
    location: "Right Wing — Front Row, near Main Entrance",
  },
  B2: {
    price: 1200,
    currency: "USD",
    area: 18,
    location: "Right Wing — Central Aisle",
  },
  B3: {
    price: 1200,
    currency: "USD",
    area: 18,
    location: "Right Wing — Back Aisle",
  },
  B4: {
    price: 2000,
    currency: "USD",
    area: 30,
    location: "Right Wing — Back Row",
  },

  // Left Wing (x > 0) — 4 booths
  B5: {
    price: 2500,
    currency: "USD",
    area: 36,
    location: "Left Wing — Front Row, near Main Entrance",
  },
  B6: {
    price: 1200,
    currency: "USD",
    area: 18,
    location: "Left Wing — Central Aisle",
  },
  B7: {
    price: 1200,
    currency: "USD",
    area: 18,
    location: "Left Wing — Back Aisle",
  },
  B8: {
    price: 2000,
    currency: "USD",
    area: 30,
    location: "Left Wing — Back Row",
  },

  // Center Core — around the main stage
  B9: {
    price: 800,
    currency: "USD",
    area: 12,
    location: "Center Core — Main Stage, Right Side",
  },
  B10: {
    price: 800,
    currency: "USD",
    area: 12,
    location: "Center Core — Main Stage, Left Side",
  },
  B11: {
    price: 1500,
    currency: "USD",
    area: 24,
    location: "Center Core — Tech Row, Right Side",
  },
  B12: {
    price: 1500,
    currency: "USD",
    area: 24,
    location: "Center Core — Tech Row, Left Side",
  },
};

/** Metadata for one booth, or null when the booth has no configured entry. */
export function getInvestorBoothDetails(boothId) {
  if (!boothId) return null;
  return investorBoothDetails[boothId] || null;
}

/** "$2,500" via Intl.NumberFormat, or the safe fallback text. */
export function formatBoothPrice(meta) {
  const price = meta && Number(meta.price);
  if (!Number.isFinite(price) || price <= 0) return "Price not assigned";

  const currency = (meta.currency || "USD").toUpperCase();
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    // Unknown currency code: fall back to a plain formatted number + code.
    return `${price.toLocaleString("en-US")} ${currency}`;
  }
}

/** "24 m²" (max one decimal), or the safe fallback text. */
export function formatBoothArea(meta) {
  const area = meta && Number(meta.area);
  if (!Number.isFinite(area) || area <= 0) return "Area not assigned";
  return `${Number(area.toFixed(1)).toLocaleString("en-US")} m²`;
}

/** Human-readable location, or the safe fallback text. */
export function getBoothLocation(meta) {
  const location = meta && meta.location;
  if (typeof location !== "string" || !location.trim()) {
    return "Location not assigned";
  }
  return location.trim();
}

export default investorBoothDetails;
