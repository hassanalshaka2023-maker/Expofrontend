/* ==========================================================================
 * ExhibitionExit — clear exit markers at the back of the grounds (and one on a
 * side), each a slim post + a green EXIT sign board with a directional arrow.
 * Purely visual.
 * ======================================================================== */

import * as THREE from "three";
import { Html } from "@react-three/drei";
import { MAT } from "../boothKit";

const exitBoardMat = new THREE.MeshStandardMaterial({ color: "#2f9e5b", roughness: 0.6 });

function ExitMarker({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 1.35, 0]} material={MAT.metalLight} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 2.7, 8]} />
      </mesh>
      <mesh position={[0, 2.55, 0]} material={exitBoardMat} castShadow>
        <boxGeometry args={[1.7, 0.55, 0.1]} />
      </mesh>
      <Html position={[0, 2.55, 0.08]} center distanceFactor={15} zIndexRange={[10, 0]}>
        <div
          style={{
            pointerEvents: "none",
            userSelect: "none",
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: "0.2em",
            color: "#ffffff",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          Exit →
        </div>
      </Html>
    </group>
  );
}

export default function ExhibitionExit() {
  return (
    <group>
      <ExitMarker position={[-11, 0, -19.5]} />
      <ExitMarker position={[11, 0, -19.5]} />
      <ExitMarker position={[-21, 0, -2]} rotation={[0, Math.PI / 2, 0]} />
    </group>
  );
}
