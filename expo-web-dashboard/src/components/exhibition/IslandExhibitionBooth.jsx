import { sharedMaterials as M, useBoothInteraction } from "./boothKit";
import { BoothBase } from "./boothParts";

/* VARIANT 3 — ISLAND BOOTH
 * Open access from all sides, central branded structure, product/display
 * platform, two small counters, elevated company sign, controlled lighting.
 * Reserved for a few central booths only. */
export default function IslandExhibitionBooth(props) {
  const interaction = useBoothInteraction(props);
  const accent = interaction.accentMaterial;

  return (
    <BoothBase
      {...props}
      interaction={interaction}
      footprint={4.4}
      height={2.6}
      signY={3.15}
      markerRadius={2.7}
    >
      {/* Raised circular-feel platform (square, chamfered look via two slabs) */}
      <mesh position={[0, 0.06, 0]} material={M.charcoal}>
        <boxGeometry args={[4.4, 0.12, 4.4]} />
      </mesh>
      <mesh position={[0, 0.15, 0]} material={M.navy}>
        <boxGeometry args={[3.6, 0.06, 3.6]} />
      </mesh>

      {/* Central branded tower */}
      <mesh position={[0, 1.4, 0]} material={M.frame}>
        <boxGeometry args={[1.2, 2.6, 1.2]} />
      </mesh>
      {/* Tower accent bands (status colour) */}
      <mesh position={[0, 2.05, 0.61]} material={accent}>
        <boxGeometry args={[1.0, 0.9, 0.03]} />
      </mesh>
      <mesh position={[0, 2.05, -0.61]} material={accent}>
        <boxGeometry args={[1.0, 0.9, 0.03]} />
      </mesh>
      {/* Tower crown */}
      <mesh position={[0, 2.85, 0]} material={M.gold}>
        <boxGeometry args={[1.4, 0.12, 1.4]} />
      </mesh>

      {/* Central product/display platform around the base of the tower */}
      <mesh position={[0, 0.42, 0]} material={M.panelSoft}>
        <cylinderGeometry args={[1.15, 1.25, 0.55, 28]} />
      </mesh>

      {/* Two small counters on opposite open sides */}
      <mesh position={[1.5, 0.5, 1.1]} material={M.navy}>
        <boxGeometry args={[1.2, 0.8, 0.45]} />
      </mesh>
      <mesh position={[1.5, 0.92, 1.1]} material={M.panel}>
        <boxGeometry args={[1.35, 0.06, 0.55]} />
      </mesh>
      <mesh position={[-1.5, 0.5, -1.1]} material={M.navy}>
        <boxGeometry args={[1.2, 0.8, 0.45]} />
      </mesh>
      <mesh position={[-1.5, 0.92, -1.1]} material={M.panel}>
        <boxGeometry args={[1.35, 0.06, 0.55]} />
      </mesh>

      {/* Elevated sign ring accents + platform edge light */}
      <mesh position={[0, 0.17, 0]} rotation={[-Math.PI / 2, 0, 0]} material={accent}>
        <ringGeometry args={[1.7, 1.78, 40]} />
      </mesh>
      <mesh position={[0, 3.0, 0]} material={accent}>
        <boxGeometry args={[1.45, 0.04, 0.04]} />
      </mesh>
    </BoothBase>
  );
}
