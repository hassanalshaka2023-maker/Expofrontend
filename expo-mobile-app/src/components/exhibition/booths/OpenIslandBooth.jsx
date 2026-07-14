import { MAT, useBoothInteraction, getBoothPalette } from "../boothKit";
import { BoothBase, Counter, DisplayTable, Flag, Planter } from "./boothPrimitives";

/* FAMILY — OPEN ISLAND
 * Accessible from all sides: a central branded canopy on four posts with a sign
 * band, a central reception counter, product tables around it, corner flags and
 * planters. No walls — designed to be walked around. */
export default function OpenIslandBooth(props) {
  const interaction = useBoothInteraction(props);
  const pal = getBoothPalette({ boothId: props.id, position3D: props.position }, props.index);

  const corners = [
    [-1.7, -1.7],
    [1.7, -1.7],
    [-1.7, 1.7],
    [1.7, 1.7],
  ];

  return (
    <BoothBase {...props} interaction={interaction} footprint={4.4} height={2.6} signY={3.0} markerRadius={2.6}>
      {/* Low round-feel platform (two slabs) */}
      <mesh position={[0, 0.06, 0]} material={MAT.offWhite} receiveShadow>
        <boxGeometry args={[4.3, 0.12, 4.3]} />
      </mesh>
      <mesh position={[0, 0.14, 0]} material={MAT.cream}>
        <cylinderGeometry args={[2.0, 2.0, 0.06, 32]} />
      </mesh>

      {/* Four posts + flat canopy + sign band (palette colour) */}
      {corners.map(([x, z], i) => (
        <mesh key={i} position={[x, 1.25, z]} material={MAT.metalLight} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 2.5, 10]} />
        </mesh>
      ))}
      <mesh position={[0, 2.55, 0]} material={MAT.white} castShadow>
        <boxGeometry args={[4.2, 0.1, 4.2]} />
      </mesh>
      {/* Sign band under the canopy on all four faces */}
      {[
        [0, 0],
        [Math.PI / 2, 0],
      ].map(([ry], i) => (
        <mesh key={i} position={[0, 2.3, 0]} rotation={[0, ry, 0]} material={pal.canopyMat}>
          <boxGeometry args={[4.2, 0.34, 0.06]} />
        </mesh>
      ))}
      <mesh position={[0, 2.05, 0]} material={MAT.turquoise}>
        <boxGeometry args={[0.24, 0.24, 0.24]} />
      </mesh>

      {/* Central reception counter (open, four-sided access) */}
      <mesh position={[0, 0.6, 0]} material={MAT.cream} castShadow>
        <cylinderGeometry args={[0.85, 0.9, 0.9, 24]} />
      </mesh>
      <mesh position={[0, 1.06, 0]} material={MAT.white}>
        <cylinderGeometry args={[0.98, 0.98, 0.07, 24]} />
      </mesh>
      <mesh position={[0, 0.64, 0]} rotation={[-Math.PI / 2, 0, 0]} material={pal.stripeMat}>
        <ringGeometry args={[0.86, 0.98, 28]} />
      </mesh>

      {/* Product tables on opposite open sides */}
      <DisplayTable position={[1.45, 0, 0.9]} top={pal.canopyMat} />
      <DisplayTable position={[-1.45, 0, -0.9]} top={MAT.cream} />
      <Counter position={[1.35, 0, -1.35]} w={1.1} top={MAT.white} body={MAT.metalLight} />

      {/* Corner flags + planters */}
      <Flag position={[-1.9, 0, 1.9]} color={pal.accent} h={2.1} />
      <Flag position={[1.9, 0, -1.9]} color="#25b6bd" h={2.1} />
      <Planter position={[-1.5, 0, 1.7]} flower={pal.accent} />
      <Planter position={[1.5, 0, 1.7]} flower="#f2c85f" />
    </BoothBase>
  );
}
