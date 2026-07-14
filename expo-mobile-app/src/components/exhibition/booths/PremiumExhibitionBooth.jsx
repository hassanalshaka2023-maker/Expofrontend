import { MAT, useBoothInteraction, getBoothPalette } from "../boothKit";
import { BoothBase, Counter, ScreenPanel, DisplayTable, Flag, Planter } from "./boothPrimitives";

/* FAMILY — PREMIUM EXHIBITION
 * The flagship stand: a raised double-tier platform, a cream back wall with a
 * gold header band and turquoise trim, a large screen, a reception desk, a
 * product pedestal, a flat canopy and paired flags. Refined, not neon. */
export default function PremiumExhibitionBooth(props) {
  const interaction = useBoothInteraction(props);
  const pal = getBoothPalette({ boothId: props.id, position3D: props.position }, props.index);

  return (
    <BoothBase {...props} interaction={interaction} footprint={4.5} height={2.7} signY={3.0} markerRadius={2.65}>
      {/* Raised double-tier platform */}
      <mesh position={[0, 0.09, 0]} material={MAT.cream} receiveShadow castShadow>
        <boxGeometry args={[4.6, 0.18, 4.6]} />
      </mesh>
      <mesh position={[0, 0.21, 0]} material={MAT.offWhite}>
        <boxGeometry args={[4.1, 0.06, 4.1]} />
      </mesh>

      {/* Cream back wall + gold header band + turquoise trim */}
      <mesh position={[0, 1.35, -2.0]} material={MAT.white} castShadow>
        <boxGeometry args={[4.3, 2.5, 0.12]} />
      </mesh>
      <mesh position={[0, 2.5, -1.93]} material={MAT.gold}>
        <boxGeometry args={[4.3, 0.4, 0.05]} />
      </mesh>
      <mesh position={[0, 2.1, -1.92]} material={MAT.turquoise}>
        <boxGeometry args={[3.9, 0.05, 0.03]} />
      </mesh>

      {/* Side wall + slim front pillar */}
      <mesh position={[-2.05, 1.35, -0.2]} material={MAT.offWhite} castShadow>
        <boxGeometry args={[0.1, 2.5, 3.6]} />
      </mesh>
      <mesh position={[-2.05, 1.4, 1.8]} material={MAT.gold}>
        <boxGeometry args={[0.14, 2.6, 0.14]} />
      </mesh>

      {/* Flat canopy roof */}
      <mesh position={[0, 2.75, -0.15]} material={MAT.cream} castShadow>
        <boxGeometry args={[4.6, 0.12, 3.8]} />
      </mesh>

      {/* Large screen, reception desk (turquoise edge), product pedestal */}
      <ScreenPanel position={[0.8, 1.5, -1.9]} w={1.9} h={1.2} />
      <Counter position={[-1.0, 0.15, 1.35]} w={1.8} top={MAT.white} body={MAT.cream} />
      <mesh position={[-1.0, 0.98, 1.66]} material={MAT.turquoise}>
        <boxGeometry args={[1.7, 0.05, 0.02]} />
      </mesh>
      <DisplayTable position={[1.2, 0.15, 1.2]} top={MAT.gold} />
      <mesh position={[1.2, 1.18, 1.2]} material={MAT.gold}>
        <boxGeometry args={[0.24, 0.24, 0.24]} />
      </mesh>

      <Flag position={[-1.9, 0.15, 1.9]} color={pal.accent} h={2.3} />
      <Flag position={[1.9, 0.15, 1.9]} color="#25b6bd" h={2.3} />
      <Planter position={[0, 0.15, 2.05]} flower={pal.accent} />
    </BoothBase>
  );
}
