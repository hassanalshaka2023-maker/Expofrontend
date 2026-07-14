import { Html } from "@react-three/drei";
import { sharedMaterials as M } from "./boothKit";
import HallFloor from "./HallFloor";

/* ==========================================================================
 * ExhibitionHallScene — the venue "shell" that wraps the booths: hall floor +
 * aisles, lighting rig, main entrance, exit, and an information desk. It renders
 * only visual scene elements (no backend records, no navigation logic). Drop it
 * inside the existing <Canvas>, in place of the old <Grid>. The booths continue
 * to be mapped by the page, so all data/interaction stays untouched.
 * ======================================================================== */

const HALL_WIDTH = 46;
const HALL_DEPTH = 42;

const venueLabelStyle = {
  pointerEvents: "none",
  userSelect: "none",
  fontFamily: "Inter, system-ui, sans-serif",
  whiteSpace: "nowrap",
};

/* Soft, controlled lighting: hemisphere + ambient fill + one main directional +
 * two low accent points (cyan/gold). No per-booth lights. */
function LightingRig() {
  return (
    <group>
      <hemisphereLight args={["#bfe9ee", "#0a1420", 0.55]} />
      <ambientLight intensity={0.32} />
      <directionalLight position={[12, 26, 10]} intensity={1.05} color="#ffffff" />
      <pointLight position={[-15, 13, 11]} intensity={0.5} color="#20d8dc" distance={70} decay={1.5} />
      <pointLight position={[15, 11, -9]} intensity={0.42} color="#d99145" distance={70} decay={1.5} />
    </group>
  );
}

function HallEntrance() {
  const z = HALL_DEPTH / 2 - 1.5; // front boundary
  return (
    <group position={[0, 0, z]}>
      {/* Arch posts */}
      <mesh position={[-3.2, 1.6, 0]} material={M.frame}>
        <boxGeometry args={[0.35, 3.2, 0.35]} />
      </mesh>
      <mesh position={[3.2, 1.6, 0]} material={M.frame}>
        <boxGeometry args={[0.35, 3.2, 0.35]} />
      </mesh>
      {/* Beam */}
      <mesh position={[0, 3.35, 0]} material={M.navy}>
        <boxGeometry args={[7.2, 0.5, 0.4]} />
      </mesh>
      {/* Gold trim on the beam */}
      <mesh position={[0, 3.08, 0.21]} material={M.gold}>
        <boxGeometry args={[7.0, 0.05, 0.03]} />
      </mesh>
      <Html position={[0, 3.35, 0.25]} center distanceFactor={16} zIndexRange={[10, 0]} style={venueLabelStyle}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: "0.16em",
            color: "#8ff4f4",
            textTransform: "uppercase",
          }}
        >
          Main Entrance
        </div>
      </Html>
    </group>
  );
}

function HallExit() {
  const z = -HALL_DEPTH / 2 + 1.5; // back boundary
  return (
    <group position={[-14, 0, z]}>
      <mesh position={[0, 1.4, 0]} material={M.frame}>
        <boxGeometry args={[0.25, 2.8, 0.25]} />
      </mesh>
      <mesh position={[0, 2.55, 0]} material={M.navy}>
        <boxGeometry args={[2.0, 0.55, 0.18]} />
      </mesh>
      <Html position={[0, 2.55, 0.12]} center distanceFactor={15} zIndexRange={[10, 0]} style={venueLabelStyle}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: "0.18em",
            color: "#d7e2ec",
            textTransform: "uppercase",
          }}
        >
          Exit
        </div>
      </Html>
    </group>
  );
}

function InformationDesk() {
  return (
    <group position={[8, 0, 15]}>
      {/* Small info counter (deliberately smaller than any booth) */}
      <mesh position={[0, 0.5, 0]} material={M.navy}>
        <cylinderGeometry args={[1.0, 1.05, 1.0, 24]} />
      </mesh>
      <mesh position={[0, 1.03, 0]} material={M.panel}>
        <cylinderGeometry args={[1.15, 1.15, 0.08, 24]} />
      </mesh>
      {/* Info totem */}
      <mesh position={[0, 1.9, 0]} material={M.frame}>
        <boxGeometry args={[0.5, 1.5, 0.12]} />
      </mesh>
      <Html position={[0, 1.95, 0.1]} center distanceFactor={15} zIndexRange={[10, 0]} style={venueLabelStyle}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.14em",
            color: "#8ff4f4",
            background: "rgba(6,16,28,0.7)",
            borderRadius: 8,
            padding: "3px 9px",
          }}
        >
          INFO
        </div>
      </Html>
    </group>
  );
}

export default function ExhibitionHallScene({ booths = [] }) {
  return (
    <group>
      <LightingRig />
      <HallFloor booths={booths} width={HALL_WIDTH} depth={HALL_DEPTH} />
      <HallEntrance />
      <HallExit />
      <InformationDesk />
    </group>
  );
}
