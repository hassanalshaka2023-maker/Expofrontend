/* ==========================================================================
 * InformationPoint — a public information kiosk near the entrance: a round
 * counter, an "INFORMATION" totem with a public map symbol, and nearby planters
 * and a bench. Deliberately smaller than any booth. Purely visual.
 * ======================================================================== */

import * as THREE from "three";
import { Html } from "@react-three/drei";
import { MAT } from "../boothKit";

const flowerMat = new THREE.MeshStandardMaterial({ color: "#f2c85f", roughness: 0.8 });

export default function InformationPoint({ position = [9, 0, 17.5] }) {
  return (
    <group position={position}>
      {/* Round info counter */}
      <mesh position={[0, 0.5, 0]} material={MAT.white} castShadow>
        <cylinderGeometry args={[0.95, 1.0, 1.0, 24]} />
      </mesh>
      <mesh position={[0, 1.03, 0]} material={MAT.turquoise}>
        <cylinderGeometry args={[1.1, 1.1, 0.08, 24]} />
      </mesh>

      {/* Info totem + "i" symbol */}
      <mesh position={[0, 1.95, 0]} material={MAT.metalLight} castShadow>
        <boxGeometry args={[0.55, 1.6, 0.14]} />
      </mesh>
      <Html position={[0, 2.35, 0.09]} center distanceFactor={13} zIndexRange={[10, 0]}>
        <div
          style={{
            pointerEvents: "none",
            userSelect: "none",
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 22,
            fontWeight: 900,
            color: "#25b6bd",
          }}
        >
          i
        </div>
      </Html>
      <Html position={[0, 1.55, 0.09]} center distanceFactor={20} zIndexRange={[10, 0]}>
        <div
          style={{
            pointerEvents: "none",
            userSelect: "none",
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: "0.16em",
            color: "#1f3346",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          Information
        </div>
      </Html>

      {/* Nearby planters */}
      {[-1.6, 1.6].map((x) => (
        <group key={x} position={[x, 0, 0.4]}>
          <mesh position={[0, 0.24, 0]} material={MAT.woodDark}>
            <boxGeometry args={[0.7, 0.48, 0.7]} />
          </mesh>
          <mesh position={[0, 0.52, 0]} material={flowerMat}>
            <sphereGeometry args={[0.24, 10, 10]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
