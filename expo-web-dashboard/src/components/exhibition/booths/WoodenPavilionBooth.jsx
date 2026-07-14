import { MAT, useBoothInteraction, getBoothPalette } from "../boothKit";
import { BoothBase, Counter, DisplayTable, Planter, RollUpBanner } from "./boothPrimitives";

/* FAMILY — WOODEN PAVILION
 * A warm timber pavilion: wooden posts, a slatted pergola roof (real gaps), a
 * wood back wall, product shelves, counter and planters. Natural and inviting. */
export default function WoodenPavilionBooth(props) {
  const interaction = useBoothInteraction(props);
  const pal = getBoothPalette({ boothId: props.id, position3D: props.position }, props.index);

  const roofSlats = [-1.6, -1.05, -0.5, 0.05, 0.6, 1.15, 1.7];

  return (
    <BoothBase {...props} interaction={interaction} footprint={4.3} height={2.5} signY={2.75} markerRadius={2.5}>
      {/* Deck */}
      <mesh position={[0, 0.06, 0]} material={MAT.wood} receiveShadow>
        <boxGeometry args={[4.1, 0.12, 4.1]} />
      </mesh>

      {/* Timber posts */}
      {[
        [-1.85, -1.85],
        [1.85, -1.85],
        [-1.85, 1.85],
        [1.85, 1.85],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 1.2, z]} material={MAT.woodDark} castShadow>
          <boxGeometry args={[0.16, 2.4, 0.16]} />
        </mesh>
      ))}

      {/* Pergola beams + slatted roof (real gaps) */}
      <mesh position={[-1.85, 2.42, 0]} material={MAT.woodDark}>
        <boxGeometry args={[0.14, 0.14, 3.9]} />
      </mesh>
      <mesh position={[1.85, 2.42, 0]} material={MAT.woodDark}>
        <boxGeometry args={[0.14, 0.14, 3.9]} />
      </mesh>
      {roofSlats.map((z) => (
        <mesh key={z} position={[0, 2.5, z]} material={MAT.woodLight} castShadow>
          <boxGeometry args={[4.0, 0.08, 0.22]} />
        </mesh>
      ))}

      {/* Wood back wall */}
      <mesh position={[0, 1.15, -1.86]} material={MAT.woodLight} castShadow>
        <boxGeometry args={[3.8, 1.95, 0.1]} />
      </mesh>

      {/* Product shelves */}
      {[0.7, 1.2, 1.7].map((y) => (
        <mesh key={y} position={[1.0, y, -1.7]} material={MAT.cream}>
          <boxGeometry args={[1.6, 0.05, 0.4]} />
        </mesh>
      ))}
      {[0.85, 1.35].map((y, i) => (
        <mesh key={y} position={[1.0 + (i ? 0.3 : -0.3), y + 0.12, -1.7]} material={i ? MAT.turquoise : pal.stripeMat}>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
        </mesh>
      ))}

      <Counter position={[-1.0, 0, 1.2]} w={1.6} body={MAT.woodDark} />
      <DisplayTable position={[0.9, 0, 1.2]} top={MAT.cream} />
      <RollUpBanner position={[-1.7, 0.12, -1.3]} accent={pal.stripeMat} />
      <Planter position={[1.85, 0, 1.9]} flower={pal.accent} />
    </BoothBase>
  );
}
