import { MAT, useBoothInteraction, getBoothPalette } from "../boothKit";
import { BoothBase, Counter, ScreenPanel, Flag } from "./boothPrimitives";

/* FAMILY — MODERN TRADE
 * A clean contemporary stand: white panel back wall, a light glass front, flat
 * canopy roof, a large display screen and a sleek reception counter. HOPEX
 * turquoise appears only as a thin accent line. */
export default function ModernTradeBooth(props) {
  const interaction = useBoothInteraction(props);
  const pal = getBoothPalette({ boothId: props.id, position3D: props.position }, props.index);

  return (
    <BoothBase {...props} interaction={interaction} footprint={4.2} height={2.5} signY={2.75} markerRadius={2.5}>
      {/* Deck */}
      <mesh position={[0, 0.06, 0]} material={MAT.offWhite} receiveShadow>
        <boxGeometry args={[4.1, 0.12, 4.1]} />
      </mesh>

      {/* White panel back wall + header band */}
      <mesh position={[0, 1.2, -1.9]} material={MAT.white} castShadow>
        <boxGeometry args={[3.9, 2.4, 0.1]} />
      </mesh>
      <mesh position={[0, 2.25, -1.84]} material={pal.stripeMat}>
        <boxGeometry args={[3.9, 0.3, 0.04]} />
      </mesh>
      <mesh position={[0, 1.9, -1.83]} material={MAT.turquoise}>
        <boxGeometry args={[3.5, 0.05, 0.03]} />
      </mesh>

      {/* One glass side wall (light, semi-transparent) */}
      <mesh position={[-1.9, 1.2, 0]} material={MAT.glass}>
        <boxGeometry args={[0.06, 2.2, 3.6]} />
      </mesh>
      {[-1.9, -1.9].map((x, i) => (
        <mesh key={i} position={[x, 1.2, i === 0 ? -1.75 : 1.75]} material={MAT.metalLight}>
          <boxGeometry args={[0.08, 2.4, 0.08]} />
        </mesh>
      ))}

      {/* Flat canopy roof */}
      <mesh position={[0, 2.5, -0.1]} material={MAT.white} castShadow>
        <boxGeometry args={[4.1, 0.1, 3.6]} />
      </mesh>

      {/* Large display screen + sleek counter */}
      <ScreenPanel position={[0.55, 1.35, -1.82]} w={1.8} h={1.1} />
      <Counter position={[-0.9, 0, 1.2]} w={1.7} top={MAT.white} body={MAT.metalLight} />
      <mesh position={[-0.9, 0.8, 1.5]} material={MAT.turquoise}>
        <boxGeometry args={[1.6, 0.05, 0.02]} />
      </mesh>

      <Flag position={[1.9, 0, 1.6]} color={pal.accent} h={2.2} />
    </BoothBase>
  );
}
