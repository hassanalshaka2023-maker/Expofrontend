import { MAT, useBoothInteraction, getBoothPalette } from "../boothKit";
import { BoothBase, Counter, DisplayTable, RollUpBanner, Planter } from "./boothPrimitives";

/* FAMILY — COLORFUL MARKET
 * A market-stall look: a striped sloped awning (palette colour alternating with
 * white), wooden frame, fully open front, produce-style display tables and a
 * roll-up banner. Bright and friendly. */
export default function ColorfulMarketBooth(props) {
  const interaction = useBoothInteraction(props);
  const pal = getBoothPalette({ boothId: props.id, position3D: props.position }, props.index);

  const slats = [-1.5, -0.9, -0.3, 0.3, 0.9, 1.5];

  return (
    <BoothBase {...props} interaction={interaction} footprint={4.2} height={2.3} signY={2.6} markerRadius={2.45}>
      {/* Deck */}
      <mesh position={[0, 0.06, 0]} material={MAT.woodLight} receiveShadow>
        <boxGeometry args={[4.0, 0.12, 4.0]} />
      </mesh>

      {/* Wooden frame posts */}
      {[
        [-1.8, -1.8],
        [1.8, -1.8],
        [-1.8, 1.4],
        [1.8, 1.4],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 1.1, z]} material={MAT.wood} castShadow>
          <boxGeometry args={[0.14, 2.2, 0.14]} />
        </mesh>
      ))}

      {/* Back wall */}
      <mesh position={[0, 1.15, -1.82]} material={MAT.cream} castShadow>
        <boxGeometry args={[3.7, 1.9, 0.1]} />
      </mesh>

      {/* Striped sloped awning over the open front */}
      <group position={[0, 2.15, 1.2]} rotation={[-0.32, 0, 0]}>
        {slats.map((x, i) => (
          <mesh key={x} position={[x, 0, 0]} material={i % 2 === 0 ? pal.canopyMat : MAT.white} castShadow>
            <boxGeometry args={[0.6, 0.06, 2.4]} />
          </mesh>
        ))}
        {/* Scalloped front trim */}
        <mesh position={[0, -0.05, 1.2]} material={pal.stripeMat}>
          <boxGeometry args={[3.7, 0.26, 0.05]} />
        </mesh>
      </group>

      {/* Open-front display tables with a few "products" */}
      <Counter position={[-1.0, 0, 0.9]} w={1.5} body={MAT.wood} />
      <DisplayTable position={[1.0, 0, 0.7]} top={MAT.offWhite} />
      {[-0.2, 0.1, 0.4].map((dx, i) => (
        <mesh key={dx} position={[1.0 + dx, 1.02, 0.7]} material={i === 1 ? MAT.turquoise : pal.stripeMat}>
          <boxGeometry args={[0.16, 0.16, 0.16]} />
        </mesh>
      ))}

      <RollUpBanner position={[1.55, 0.12, -1.4]} accent={pal.stripeMat} />
      <Planter position={[-1.85, 0, 1.7]} flower={pal.accent} />
    </BoothBase>
  );
}
