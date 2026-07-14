import { sharedMaterials as M, useBoothInteraction } from "./boothKit";
import { BoothBase } from "./boothParts";

/* VARIANT 2 — CORNER BOOTH
 * Back wall + one partial side wall + two open visitor-facing sides, corner
 * reception counter, small product table, vertical company banner, signage. */
export default function CornerExhibitionBooth(props) {
  const interaction = useBoothInteraction(props);
  const accent = interaction.accentMaterial;

  return (
    <BoothBase {...props} interaction={interaction} footprint={4.3} height={2.3} signY={2.7}>
      {/* Raised platform */}
      <mesh position={[0, 0.06, 0]} material={M.charcoal}>
        <boxGeometry args={[4.3, 0.12, 4.3]} />
      </mesh>
      <mesh position={[0, 0.14, 0]} material={M.navy}>
        <boxGeometry args={[4.0, 0.04, 4.0]} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 1.15, -1.9]} material={M.panel}>
        <boxGeometry args={[3.9, 2.0, 0.1]} />
      </mesh>
      <mesh position={[0, 1.15, -1.96]} material={M.frame}>
        <boxGeometry args={[4.1, 2.2, 0.05]} />
      </mesh>

      {/* Partial side wall (only rear half of the left side) — two open sides */}
      <mesh position={[-1.9, 1.15, -1.0]} material={M.charcoal}>
        <boxGeometry args={[0.1, 2.0, 1.9]} />
      </mesh>

      {/* Vertical company banner (tall totem, status accent trim) */}
      <mesh position={[1.75, 1.25, -1.75]} material={M.navy}>
        <boxGeometry args={[0.5, 2.3, 0.14]} />
      </mesh>
      <mesh position={[1.75, 1.25, -1.66]} material={accent}>
        <boxGeometry args={[0.34, 2.0, 0.03]} />
      </mesh>

      {/* Corner reception counter (L-shaped) */}
      <mesh position={[-1.15, 0.55, 1.15]} material={M.navy}>
        <boxGeometry args={[1.5, 0.85, 0.5]} />
      </mesh>
      <mesh position={[-1.55, 0.55, 0.35]} material={M.navy}>
        <boxGeometry args={[0.5, 0.85, 1.1]} />
      </mesh>
      <mesh position={[-1.25, 1.0, 0.95]} material={M.panel}>
        <boxGeometry args={[2.0, 0.07, 1.7]} />
      </mesh>

      {/* Small product table */}
      <mesh position={[1.0, 0.45, 1.0]} material={M.panelSoft}>
        <cylinderGeometry args={[0.45, 0.5, 0.8, 20]} />
      </mesh>
      <mesh position={[1.0, 0.88, 1.0]} material={M.gold}>
        <boxGeometry args={[0.5, 0.05, 0.5]} />
      </mesh>

      {/* Accent strips */}
      <mesh position={[0, 2.08, -1.87]} material={accent}>
        <boxGeometry args={[3.8, 0.05, 0.05]} />
      </mesh>
      <mesh position={[0, 0.15, 1.95]} material={accent}>
        <boxGeometry args={[4.0, 0.04, 0.05]} />
      </mesh>
    </BoothBase>
  );
}
