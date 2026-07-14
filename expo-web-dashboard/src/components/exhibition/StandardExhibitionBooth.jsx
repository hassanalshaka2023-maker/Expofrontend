import { sharedMaterials as M, useBoothInteraction } from "./boothKit";
import { BoothBase } from "./boothParts";

/* VARIANT 1 — STANDARD BOOTH
 * Back wall + one side wall + open front, reception counter, one display panel,
 * booth number/company sign, subtle accent light strip. Used for regular booths. */
export default function StandardExhibitionBooth(props) {
  const interaction = useBoothInteraction(props);
  const accent = interaction.accentMaterial;

  return (
    <BoothBase {...props} interaction={interaction} footprint={4.2} height={2.2} signY={2.65}>
      {/* Raised platform */}
      <mesh position={[0, 0.06, 0]} material={M.charcoal}>
        <boxGeometry args={[4.2, 0.12, 4.2]} />
      </mesh>
      <mesh position={[0, 0.14, 0]} material={M.navy}>
        <boxGeometry args={[3.9, 0.04, 3.9]} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 1.1, -1.85]} material={M.panel}>
        <boxGeometry args={[3.8, 1.9, 0.1]} />
      </mesh>
      <mesh position={[0, 1.1, -1.91]} material={M.frame}>
        <boxGeometry args={[4.0, 2.1, 0.05]} />
      </mesh>

      {/* One side wall (left); front + right open */}
      <mesh position={[-1.85, 1.1, -0.2]} material={M.charcoal}>
        <boxGeometry args={[0.1, 1.9, 3.2]} />
      </mesh>

      {/* Display panel on the back wall */}
      <mesh position={[0.55, 1.2, -1.78]} material={M.screen}>
        <boxGeometry args={[1.5, 0.9, 0.04]} />
      </mesh>

      {/* Reception counter (near the open front) */}
      <mesh position={[-0.9, 0.55, 1.15]} material={M.navy}>
        <boxGeometry args={[1.5, 0.85, 0.5]} />
      </mesh>
      <mesh position={[-0.9, 1.0, 1.15]} material={M.panel}>
        <boxGeometry args={[1.65, 0.07, 0.62]} />
      </mesh>

      {/* Accent light strips (status colour, self-illuminating) */}
      <mesh position={[0, 1.98, -1.82]} material={accent}>
        <boxGeometry args={[3.7, 0.05, 0.05]} />
      </mesh>
      <mesh position={[0, 0.15, 1.85]} material={accent}>
        <boxGeometry args={[3.9, 0.04, 0.05]} />
      </mesh>
    </BoothBase>
  );
}
