import { sharedMaterials as M, useBoothInteraction } from "./boothKit";
import { BoothBase } from "./boothParts";

/* VARIANT 4 — PREMIUM BOOTH
 * Refined version of the approved prototype: raised platform, premium back wall
 * + side wall, reception desk, large display screen, product display area,
 * stronger (but controlled) branding with subtle gold accents and more depth.
 * Used only for a limited number of booths. */
export default function PremiumExhibitionBooth(props) {
  const interaction = useBoothInteraction(props);
  const accent = interaction.accentMaterial;

  return (
    <BoothBase
      {...props}
      interaction={interaction}
      footprint={4.4}
      height={2.6}
      signY={3.0}
      markerRadius={2.6}
    >
      {/* Raised platform (double-tier for depth) */}
      <mesh position={[0, 0.08, 0]} material={M.charcoal}>
        <boxGeometry args={[4.5, 0.16, 4.5]} />
      </mesh>
      <mesh position={[0, 0.19, 0]} material={M.navy}>
        <boxGeometry args={[4.0, 0.06, 4.0]} />
      </mesh>

      {/* Premium back wall + navy frame + gold trim */}
      <mesh position={[0, 1.25, -2.0]} material={M.panel}>
        <boxGeometry args={[4.2, 2.2, 0.1]} />
      </mesh>
      <mesh position={[0, 1.25, -2.07]} material={M.frame}>
        <boxGeometry args={[4.4, 2.45, 0.06]} />
      </mesh>
      <mesh position={[0, 2.15, -1.94]} material={M.gold}>
        <boxGeometry args={[4.0, 0.05, 0.04]} />
      </mesh>

      {/* Header sign band */}
      <mesh position={[0, 2.42, -2.0]} material={M.navy}>
        <boxGeometry args={[4.2, 0.42, 0.16]} />
      </mesh>

      {/* One side wall + slim front pillar */}
      <mesh position={[-2.0, 1.25, -0.2]} material={M.charcoal}>
        <boxGeometry args={[0.1, 2.2, 3.6]} />
      </mesh>
      <mesh position={[-2.0, 1.25, 1.7]} material={M.navy}>
        <boxGeometry args={[0.14, 2.4, 0.14]} />
      </mesh>

      {/* Large display screen */}
      <mesh position={[0.75, 1.35, -1.92]} material={M.frame}>
        <boxGeometry args={[1.85, 1.15, 0.06]} />
      </mesh>
      <mesh position={[0.75, 1.35, -1.88]} material={M.screen}>
        <boxGeometry args={[1.65, 0.95, 0.03]} />
      </mesh>

      {/* Reception desk */}
      <mesh position={[-1.0, 0.62, 1.3]} material={M.navy}>
        <boxGeometry args={[1.7, 0.9, 0.55]} />
      </mesh>
      <mesh position={[-1.0, 1.09, 1.3]} material={M.panel}>
        <boxGeometry args={[1.85, 0.08, 0.68]} />
      </mesh>
      <mesh position={[-1.0, 0.8, 1.585]} material={accent}>
        <boxGeometry args={[1.5, 0.05, 0.02]} />
      </mesh>

      {/* Product display area */}
      <mesh position={[1.15, 0.55, 1.15]} material={M.panelSoft}>
        <cylinderGeometry args={[0.34, 0.4, 0.95, 24]} />
      </mesh>
      <mesh position={[1.15, 1.18, 1.15]} material={M.navy}>
        <boxGeometry args={[0.42, 0.34, 0.42]} />
      </mesh>
      <mesh position={[1.15, 1.37, 1.15]} material={M.gold}>
        <boxGeometry args={[0.24, 0.06, 0.24]} />
      </mesh>

      {/* Controlled accent light strips (status colour) */}
      <mesh position={[0, 2.16, -1.95]} material={accent}>
        <boxGeometry args={[4.0, 0.05, 0.05]} />
      </mesh>
      <mesh position={[0, 0.2, 2.0]} material={accent}>
        <boxGeometry args={[4.3, 0.04, 0.05]} />
      </mesh>
      <mesh position={[-1.96, 1.25, 1.62]} material={accent}>
        <boxGeometry args={[0.05, 1.9, 0.05]} />
      </mesh>
    </BoothBase>
  );
}
