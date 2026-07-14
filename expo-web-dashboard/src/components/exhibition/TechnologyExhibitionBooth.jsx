import { sharedMaterials as M, useBoothInteraction } from "./boothKit";
import { BoothBase } from "./boothParts";

/* VARIANT 5 — TECHNOLOGY BOOTH
 * Clean geometric frame, digital display panels, minimal reception desk, light
 * strips, open front, small product pedestal, cyan lighting accents. Modern but
 * restrained (not a video-game look). */
export default function TechnologyExhibitionBooth(props) {
  const interaction = useBoothInteraction(props);
  const accent = interaction.accentMaterial;

  return (
    <BoothBase {...props} interaction={interaction} footprint={4.2} height={2.4} signY={2.85}>
      {/* Platform */}
      <mesh position={[0, 0.06, 0]} material={M.charcoal}>
        <boxGeometry args={[4.2, 0.12, 4.2]} />
      </mesh>
      <mesh position={[0, 0.14, 0]} material={M.navy}>
        <boxGeometry args={[3.8, 0.04, 3.8]} />
      </mesh>

      {/* Open geometric frame: four corner posts + top rails */}
      {[
        [-1.85, -1.85],
        [1.85, -1.85],
        [-1.85, 1.85],
        [1.85, 1.85],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 1.15, z]} material={M.frame}>
          <boxGeometry args={[0.1, 2.3, 0.1]} />
        </mesh>
      ))}
      {/* Top rails (frame) */}
      <mesh position={[0, 2.28, -1.85]} material={M.frame}>
        <boxGeometry args={[3.8, 0.1, 0.1]} />
      </mesh>
      <mesh position={[0, 2.28, 1.85]} material={M.frame}>
        <boxGeometry args={[3.8, 0.1, 0.1]} />
      </mesh>
      <mesh position={[-1.85, 2.28, 0]} material={M.frame}>
        <boxGeometry args={[0.1, 0.1, 3.8]} />
      </mesh>
      <mesh position={[1.85, 2.28, 0]} material={M.frame}>
        <boxGeometry args={[0.1, 0.1, 3.8]} />
      </mesh>

      {/* Digital display panels on the back (two screens) */}
      <mesh position={[-0.85, 1.35, -1.8]} material={M.screen}>
        <boxGeometry args={[1.3, 1.1, 0.05]} />
      </mesh>
      <mesh position={[0.85, 1.35, -1.8]} material={M.screen}>
        <boxGeometry args={[1.3, 1.1, 0.05]} />
      </mesh>

      {/* Minimal reception desk */}
      <mesh position={[0, 0.5, 1.35]} material={M.navy}>
        <boxGeometry args={[1.6, 0.8, 0.45]} />
      </mesh>
      <mesh position={[0, 0.92, 1.35]} material={M.panel}>
        <boxGeometry args={[1.75, 0.06, 0.55]} />
      </mesh>

      {/* Small product pedestal */}
      <mesh position={[1.2, 0.5, -0.4]} material={M.panelSoft}>
        <cylinderGeometry args={[0.3, 0.34, 0.9, 20]} />
      </mesh>
      <mesh position={[1.2, 1.05, -0.4]} material={M.frame}>
        <boxGeometry args={[0.36, 0.28, 0.36]} />
      </mesh>

      {/* Cyan/status light strips along the frame */}
      <mesh position={[0, 2.28, -1.8]} material={accent}>
        <boxGeometry args={[3.7, 0.05, 0.05]} />
      </mesh>
      <mesh position={[-1.8, 1.15, 1.8]} material={accent}>
        <boxGeometry args={[0.06, 2.1, 0.06]} />
      </mesh>
      <mesh position={[1.8, 1.15, 1.8]} material={accent}>
        <boxGeometry args={[0.06, 2.1, 0.06]} />
      </mesh>
      <mesh position={[0, 0.15, 1.85]} material={accent}>
        <boxGeometry args={[3.8, 0.04, 0.05]} />
      </mesh>
    </BoothBase>
  );
}
