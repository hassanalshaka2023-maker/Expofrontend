import * as THREE from "three";
import { Html } from "@react-three/drei";

/* ==========================================================================
 * HallFloor — a defined rectangular exhibition-hall floor with matte premium
 * flooring, lighter walking aisles (one wide main aisle + secondary cross
 * aisles), soft cyan directional lines, muted-gold markers, per-booth floor
 * pads, and subtle zone labels. Replaces the old infinite neon grid.
 *
 * Aisle geometry is chosen to sit in the gaps between the real booth
 * coordinates (no coordinate changes were needed), so aisles never overlap a
 * booth pad. All materials are shared module-scope singletons.
 * ======================================================================== */

const floorMat = {
  base: new THREE.MeshStandardMaterial({
    color: "#0a1420",
    roughness: 0.94,
    metalness: 0.04,
  }),
  pad: new THREE.MeshStandardMaterial({
    color: "#141d2a",
    roughness: 0.85,
    metalness: 0.06,
  }),
  aisle: new THREE.MeshStandardMaterial({
    color: "#1a2536",
    roughness: 0.8,
    metalness: 0.06,
  }),
  trim: new THREE.MeshStandardMaterial({
    color: "#243244",
    roughness: 0.5,
    metalness: 0.45,
  }),
  cyanLine: new THREE.MeshStandardMaterial({
    color: "#20d8dc",
    emissive: new THREE.Color("#20d8dc"),
    emissiveIntensity: 0.7,
    roughness: 0.5,
    metalness: 0.2,
  }),
  goldMark: new THREE.MeshStandardMaterial({
    color: "#c9a45a",
    emissive: new THREE.Color("#c9a45a"),
    emissiveIntensity: 0.4,
    roughness: 0.45,
    metalness: 0.6,
  }),
};

const zoneLabelStyle = {
  pointerEvents: "none",
  userSelect: "none",
  fontFamily: "Inter, system-ui, sans-serif",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.22em",
  color: "rgba(150,209,220,0.75)",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
};

export default function HallFloor({ booths = [], width = 46, depth = 42 }) {
  const halfD = depth / 2;
  const halfW = width / 2;

  return (
    <group>
      {/* Matte hall base slab */}
      <mesh position={[0, -0.06, 0]} receiveShadow material={floorMat.base}>
        <boxGeometry args={[width, 0.12, depth]} />
      </mesh>

      {/* Inset perimeter trim (defines the hall edges) */}
      <mesh position={[0, 0.005, -halfD + 1.2]} material={floorMat.trim}>
        <boxGeometry args={[width - 2, 0.03, 0.14]} />
      </mesh>
      <mesh position={[0, 0.005, halfD - 1.2]} material={floorMat.trim}>
        <boxGeometry args={[width - 2, 0.03, 0.14]} />
      </mesh>
      <mesh position={[-halfW + 1.2, 0.005, 0]} material={floorMat.trim}>
        <boxGeometry args={[0.14, 0.03, depth - 2]} />
      </mesh>
      <mesh position={[halfW - 1.2, 0.005, 0]} material={floorMat.trim}>
        <boxGeometry args={[0.14, 0.03, depth - 2]} />
      </mesh>

      {/* Per-booth floor pads (real coordinates) → clear walking space between */}
      {booths.map((booth) => {
        const p = booth && booth.position3D;
        if (!p || typeof p.x !== "number") return null;
        return (
          <mesh
            key={booth.boothId || `${p.x}_${p.z}`}
            position={[p.x, 0.0, p.z]}
            receiveShadow
            material={floorMat.pad}
          >
            <boxGeometry args={[4.8, 0.04, 4.8]} />
          </mesh>
        );
      })}

      {/* Wide main aisle (runs front→back down the centre) */}
      <mesh position={[0, 0.012, 0]} material={floorMat.aisle}>
        <boxGeometry args={[3, 0.02, depth - 6]} />
      </mesh>
      {/* Secondary cross aisles (between booth rows, in the clear gaps) */}
      <mesh position={[0, 0.012, 8]} material={floorMat.aisle}>
        <boxGeometry args={[width - 6, 0.02, 3]} />
      </mesh>
      <mesh position={[0, 0.012, -8]} material={floorMat.aisle}>
        <boxGeometry args={[width - 6, 0.02, 3]} />
      </mesh>

      {/* Soft cyan directional dashes down the main aisle */}
      {[-14, -10, -6, -2, 2, 6, 10, 14].map((z) => (
        <mesh key={z} position={[0, 0.03, z]} material={floorMat.cyanLine}>
          <boxGeometry args={[0.12, 0.02, 1.1]} />
        </mesh>
      ))}

      {/* Directional chevrons near the entrance (pointing into the hall) */}
      {[16, 13].map((z) => (
        <group key={z} position={[0, 0.03, z]}>
          <mesh position={[-0.35, 0, 0.25]} rotation={[0, Math.PI / 4, 0]} material={floorMat.cyanLine}>
            <boxGeometry args={[0.1, 0.02, 0.85]} />
          </mesh>
          <mesh position={[0.35, 0, 0.25]} rotation={[0, -Math.PI / 4, 0]} material={floorMat.cyanLine}>
            <boxGeometry args={[0.1, 0.02, 0.85]} />
          </mesh>
        </group>
      ))}

      {/* Muted-gold markers at the aisle intersections */}
      {[8, -8].map((z) => (
        <mesh key={z} position={[0, 0.028, z]} material={floorMat.goldMark}>
          <boxGeometry args={[0.5, 0.02, 0.5]} />
        </mesh>
      ))}

      {/* Subtle zone labels */}
      <Html position={[-13, 0.05, 8]} center distanceFactor={26} zIndexRange={[5, 0]}>
        <div style={zoneLabelStyle}>Zone A</div>
      </Html>
      <Html position={[13, 0.05, 8]} center distanceFactor={26} zIndexRange={[5, 0]}>
        <div style={zoneLabelStyle}>Zone B</div>
      </Html>
      <Html position={[0, 0.05, -8]} center distanceFactor={26} zIndexRange={[5, 0]}>
        <div style={zoneLabelStyle}>Zone C</div>
      </Html>
    </group>
  );
}
