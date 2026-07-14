/* ==========================================================================
 * ExhibitionEntrance — a welcoming main entrance arch at the front of the
 * grounds: timber posts, a cream beam with a gold trim + the exhibition name,
 * decorative flags, flanking flower planters and a small greeting desk. Purely
 * visual (no backend records). The exhibition name is passed in as a prop.
 * ======================================================================== */

import * as THREE from "three";
import { Html } from "@react-three/drei";
import { MAT } from "../boothKit";

const flagColors = ["#25b6bd", "#c9a45a", "#e29350", "#77b05a", "#c15a44"];
const flagMats = flagColors.map(
  (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.7, side: THREE.DoubleSide })
);
const flowerMat = new THREE.MeshStandardMaterial({ color: "#e0664f", roughness: 0.8 });

export default function ExhibitionEntrance({ exhibitionName = "HOPEX EXPO", z = 19.5 }) {
  return (
    <group position={[0, 0, z]}>
      {/* Timber posts */}
      {[-4.2, 4.2].map((x) => (
        <mesh key={x} position={[x, 1.7, 0]} material={MAT.wood} castShadow>
          <boxGeometry args={[0.4, 3.4, 0.4]} />
        </mesh>
      ))}

      {/* Cream beam + gold trim */}
      <mesh position={[0, 3.55, 0]} material={MAT.cream} castShadow>
        <boxGeometry args={[9.2, 0.75, 0.5]} />
      </mesh>
      <mesh position={[0, 3.18, 0.26]} material={MAT.gold}>
        <boxGeometry args={[9.0, 0.07, 0.04]} />
      </mesh>

      {/* Exhibition name on the beam */}
      <Html position={[0, 3.55, 0.28]} center distanceFactor={18} zIndexRange={[12, 0]}>
        <div
          style={{
            pointerEvents: "none",
            userSelect: "none",
            fontFamily: "Montserrat, Inter, system-ui, sans-serif",
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: "0.14em",
            color: "#1f3346",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          {exhibitionName}
        </div>
      </Html>
      <Html position={[0, 3.02, 0.28]} center distanceFactor={26} zIndexRange={[12, 0]}>
        <div
          style={{
            pointerEvents: "none",
            userSelect: "none",
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.34em",
            color: "#2a6f74",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          Welcome
        </div>
      </Html>

      {/* Decorative flags on top of the beam */}
      {[-3.4, -1.7, 0, 1.7, 3.4].map((x, i) => (
        <group key={x} position={[x, 3.95, 0]}>
          <mesh position={[0, 0.35, 0]} material={MAT.metalLight}>
            <cylinderGeometry args={[0.03, 0.03, 0.9, 6]} />
          </mesh>
          <mesh position={[0.22, 0.62, 0]} material={flagMats[i % flagMats.length]}>
            <planeGeometry args={[0.4, 0.28]} />
          </mesh>
        </group>
      ))}

      {/* Flanking flower planters */}
      {[-4.9, 4.9].map((x) => (
        <group key={x} position={[x, 0, 0.6]}>
          <mesh position={[0, 0.3, 0]} material={MAT.woodDark} castShadow>
            <boxGeometry args={[1.0, 0.6, 1.0]} />
          </mesh>
          <mesh position={[0, 0.62, 0]} material={MAT.foliage}>
            <boxGeometry args={[0.9, 0.14, 0.9]} />
          </mesh>
          {[-0.25, 0.25].map((dx) =>
            [-0.25, 0.25].map((dz) => (
              <mesh key={`${dx}_${dz}`} position={[dx, 0.78, dz]} material={flowerMat}>
                <sphereGeometry args={[0.13, 8, 8]} />
              </mesh>
            ))
          )}
        </group>
      ))}

      {/* Small greeting desk just inside the entrance */}
      <group position={[2.6, 0, -1.4]}>
        <mesh position={[0, 0.5, 0]} material={MAT.counterWood} castShadow>
          <boxGeometry args={[1.8, 1.0, 0.6]} />
        </mesh>
        <mesh position={[0, 1.02, 0]} material={MAT.cream}>
          <boxGeometry args={[1.95, 0.08, 0.72]} />
        </mesh>
      </group>
    </group>
  );
}
