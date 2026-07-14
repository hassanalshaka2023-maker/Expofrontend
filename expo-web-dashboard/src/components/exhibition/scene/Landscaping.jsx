/* ==========================================================================
 * Landscaping — lightweight natural decoration: trees, grass tufts (both
 * instanced), plus lamp posts, benches and waste bins built from shared
 * geometries/materials. Everything is placed in the grass margins and path
 * borders so it never blocks a path, a booth entrance, a click target, or the
 * camera. Decorative density scales down on tablet/mobile. Deterministic layout
 * (seeded hash, no Math.random at render), no external 3D models.
 * ======================================================================== */

import { useMemo } from "react";
import * as THREE from "three";
import { Instances, Instance } from "@react-three/drei";

/* Shared geometries + materials (module scope — created once) */
const trunkGeo = new THREE.CylinderGeometry(0.18, 0.24, 1.5, 8);
const foliageGeo = new THREE.SphereGeometry(1.05, 12, 10);
const tuftGeo = new THREE.ConeGeometry(0.18, 0.5, 6);

const trunkMat = new THREE.MeshStandardMaterial({ color: "#7a5330", roughness: 0.9 });
const foliageMat = new THREE.MeshStandardMaterial({ color: "#5aa048", roughness: 0.85 });
const foliageMat2 = new THREE.MeshStandardMaterial({ color: "#6fb356", roughness: 0.85 });
const tuftMat = new THREE.MeshStandardMaterial({ color: "#6ca84c", roughness: 0.9 });
const lampPoleMat = new THREE.MeshStandardMaterial({ color: "#40505c", roughness: 0.5, metalness: 0.4 });
const lampHeadMat = new THREE.MeshStandardMaterial({
  color: "#fff2cf",
  emissive: new THREE.Color("#ffd98a"),
  emissiveIntensity: 0.5,
  roughness: 0.4,
});
const benchWoodMat = new THREE.MeshStandardMaterial({ color: "#b07d45", roughness: 0.82 });
const benchLegMat = new THREE.MeshStandardMaterial({ color: "#4a5560", roughness: 0.5, metalness: 0.4 });
const binMat = new THREE.MeshStandardMaterial({ color: "#3f6b57", roughness: 0.7 });

/* Deterministic pseudo-random in [0,1) from two coordinates */
function hash2(a, b) {
  const s = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453;
  return s - Math.floor(s);
}

/* Trees kept to the grass margins, well outside the booth ring + boundary. */
const TREE_SPOTS = [
  [-21, 17], [21, 17], [-21, 6], [21, 6], [-21, -6], [21, -6], [-21, -17], [21, -17],
  [-13, 20], [13, 20], [0, 20.5], [-6, -20], [6, -20], [0, -21],
];

function Trees({ count }) {
  const spots = TREE_SPOTS.slice(0, count);
  return (
    <group>
      <Instances range={spots.length} geometry={trunkGeo} material={trunkMat} castShadow>
        {spots.map((s, i) => (
          <Instance key={`t${i}`} position={[s[0], 0.75, s[1]]} />
        ))}
      </Instances>
      <Instances range={spots.length} geometry={foliageGeo} material={foliageMat} castShadow>
        {spots.map((s, i) => (
          <Instance
            key={`f${i}`}
            position={[s[0], 1.95, s[1]]}
            scale={0.85 + hash2(s[0], s[1]) * 0.6}
          />
        ))}
      </Instances>
      <Instances range={spots.length} geometry={foliageGeo} material={foliageMat2} castShadow>
        {spots.map((s, i) => (
          <Instance
            key={`f2${i}`}
            position={[s[0] + 0.4, 2.5, s[1] + 0.2]}
            scale={0.55 + hash2(s[1], s[0]) * 0.4}
          />
        ))}
      </Instances>
    </group>
  );
}

function GrassTufts({ perBorder }) {
  const points = useMemo(() => {
    const pts = [];
    const borders = [16, 8, -8, -16];
    borders.forEach((z, bi) => {
      for (let i = 0; i < perBorder; i += 1) {
        const x = -15 + (i + 0.5) * (30 / perBorder);
        const j = hash2(x + bi * 3.7, z);
        const side = z >= 0 ? 1 : -1;
        pts.push([x + (j - 0.5) * 1.2, side * (z >= 0 ? 2.0 : 2.0), z]);
      }
    });
    return pts;
  }, [perBorder]);

  return (
    <Instances range={points.length} geometry={tuftGeo} material={tuftMat}>
      {points.map((p, i) => (
        <Instance
          key={i}
          position={[p[0], 0.2, p[2] + (p[1] > 0 ? 1.9 : -1.9)]}
          scale={0.7 + hash2(p[0], p[2]) * 0.7}
        />
      ))}
    </Instances>
  );
}

function LampPost({ position }) {
  const [x, , z] = position;
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 1.4, 0]} material={lampPoleMat} castShadow>
        <cylinderGeometry args={[0.07, 0.09, 2.8, 8]} />
      </mesh>
      <mesh position={[0, 2.85, 0]} material={lampHeadMat}>
        <boxGeometry args={[0.32, 0.28, 0.32]} />
      </mesh>
    </group>
  );
}

function Bench({ position, rotation = 0 }) {
  const [x, , z] = position;
  return (
    <group position={[x, 0, z]} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.45, 0]} material={benchWoodMat} castShadow>
        <boxGeometry args={[1.7, 0.1, 0.5]} />
      </mesh>
      <mesh position={[0, 0.72, -0.2]} material={benchWoodMat}>
        <boxGeometry args={[1.7, 0.44, 0.08]} />
      </mesh>
      {[-0.7, 0.7].map((dx) => (
        <mesh key={dx} position={[dx, 0.22, 0]} material={benchLegMat}>
          <boxGeometry args={[0.1, 0.44, 0.46]} />
        </mesh>
      ))}
    </group>
  );
}

function Bin({ position }) {
  const [x, , z] = position;
  return (
    <mesh position={[x, 0.4, z]} material={binMat} castShadow>
      <cylinderGeometry args={[0.28, 0.24, 0.8, 12]} />
    </mesh>
  );
}

export default function Landscaping({ quality = "high" }) {
  const treeCount = quality === "low" ? 6 : quality === "medium" ? 10 : TREE_SPOTS.length;
  const tuftPerBorder = quality === "low" ? 3 : quality === "medium" ? 6 : 8;
  const showFurniture = quality !== "low";

  return (
    <group>
      <Trees count={treeCount} />
      <GrassTufts perBorder={tuftPerBorder} />

      {/* Lamp posts along the main path borders */}
      {[
        [-2.4, 0, 13], [2.4, 0, 13], [-2.4, 0, 0], [2.4, 0, 0], [-2.4, 0, -13], [2.4, 0, -13],
      ].map((p, i) => (
        <LampPost key={i} position={p} />
      ))}

      {/* Rest areas: benches near the front promenade + a back rest area */}
      {showFurniture && (
        <>
          <Bench position={[-6, 0, 17.6]} />
          <Bench position={[6, 0, 17.6]} />
          <Bench position={[0, 0, -18]} rotation={Math.PI} />
          <Bin position={[3.0, 0, 8]} />
          <Bin position={[-3.0, 0, -8]} />
        </>
      )}
    </group>
  );
}
