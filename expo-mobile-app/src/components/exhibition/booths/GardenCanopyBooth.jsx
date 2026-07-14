import { MAT, useBoothInteraction, getBoothPalette } from "../boothKit";
import { BoothBase, Counter, DisplayTable, Planter, Flag } from "./boothPrimitives";

/* FAMILY — GARDEN CANOPY
 * A welcoming fabric tent canopy on natural-wood posts, a soft back wall, a
 * reception counter, display table and flower planters. The canopy colour comes
 * from the booth's deterministic palette (never from status). */
export default function GardenCanopyBooth(props) {
  const interaction = useBoothInteraction(props);
  const pal = getBoothPalette({ boothId: props.id, position3D: props.position }, props.index);
  const post = MAT.woodPost;

  return (
    <BoothBase {...props} interaction={interaction} footprint={4.2} height={2.4} signY={2.55} markerRadius={2.45}>
      {/* Wooden deck */}
      <mesh position={[0, 0.06, 0]} material={MAT.woodLight} receiveShadow>
        <boxGeometry args={[4.0, 0.12, 4.0]} />
      </mesh>

      {/* Corner posts */}
      {[
        [-1.75, -1.75],
        [1.75, -1.75],
        [-1.75, 1.75],
        [1.75, 1.75],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 1.15, z]} material={post} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 2.3, 10]} />
        </mesh>
      ))}

      {/* Soft back wall + one side wall (open, welcoming front) */}
      <mesh position={[0, 1.05, -1.82]} material={MAT.cream} castShadow>
        <boxGeometry args={[3.7, 1.8, 0.1]} />
      </mesh>
      <mesh position={[-1.78, 1.05, -0.4]} material={MAT.offWhite}>
        <boxGeometry args={[0.09, 1.8, 2.7]} />
      </mesh>

      {/* Fabric tent canopy (deterministic palette colour) */}
      <mesh position={[0, 2.65, 0]} rotation={[0, Math.PI / 4, 0]} material={pal.canopyMat} castShadow>
        <coneGeometry args={[3.0, 0.8, 4]} />
      </mesh>
      {/* Hanging valance trim (accent) */}
      {[
        [0, -1.95],
        [0, 1.95],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 2.28, z]} material={pal.stripeMat}>
          <boxGeometry args={[4.0, 0.22, 0.05]} />
        </mesh>
      ))}

      {/* Reception counter + display table */}
      <Counter position={[-0.85, 0, 1.15]} w={1.5} />
      <DisplayTable position={[1.0, 0, 1.0]} top={MAT.cream} />

      {/* Flower planters + a small flag */}
      <Planter position={[-1.75, 0, 1.85]} flower={pal.accent} />
      <Planter position={[1.75, 0, 1.85]} flower="#f2c85f" />
      <Flag position={[1.95, 0, -1.6]} color="#25b6bd" h={2.0} />
    </BoothBase>
  );
}
