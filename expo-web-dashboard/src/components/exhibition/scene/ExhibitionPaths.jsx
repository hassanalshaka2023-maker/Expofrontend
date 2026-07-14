/* ==========================================================================
 * ExhibitionPaths — real pedestrian paths through the grass. A wide central
 * path (front→back) plus front / mid / back cross promenades, all placed in the
 * verified clear gaps between the real booth rows so they never cross a booth
 * structure. Light stone paving (procedural texture, no external image), warm
 * wooden aprons, a welcome carpet in front of the premium corner booths, and a
 * couple of direction signs. HOPEX turquoise appears only as subtle inlays.
 * ======================================================================== */

import * as THREE from "three";
import { Html } from "@react-three/drei";

function createPavingTexture() {
  if (typeof document === "undefined") return null;
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#d8d2c2";
  ctx.fillRect(0, 0, size, size);
  // subtle stone tiles with soft tone variation + seams
  const tiles = 4;
  const step = size / tiles;
  const tones = ["#ded8c9", "#d2ccbb", "#e3ddce", "#cec7b4"];
  for (let r = 0; r < tiles; r += 1) {
    for (let c = 0; c < tiles; c += 1) {
      ctx.fillStyle = tones[(r * 3 + c) % tones.length];
      ctx.fillRect(c * step + 1.5, r * step + 1.5, step - 3, step - 3);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

const pavingTex = createPavingTexture();
const makePaving = (repX, repZ) => {
  const t = pavingTex ? pavingTex.clone() : null;
  if (t) {
    t.needsUpdate = true;
    t.repeat.set(repX, repZ);
  }
  return new THREE.MeshStandardMaterial({
    color: t ? "#ffffff" : "#d8d2c2",
    map: t,
    roughness: 0.96,
    metalness: 0.02,
  });
};

const stoneMat = makePaving(6, 6);
const woodDeckMat = new THREE.MeshStandardMaterial({ color: "#b98a52", roughness: 0.82, metalness: 0.03 });
const carpetMat = new THREE.MeshStandardMaterial({ color: "#2a9aa0", roughness: 0.9, metalness: 0.02 });
const carpetTrimMat = new THREE.MeshStandardMaterial({ color: "#c9a45a", roughness: 0.6, metalness: 0.5 });
const inlayMat = new THREE.MeshStandardMaterial({
  color: "#25b6bd",
  emissive: new THREE.Color("#25b6bd"),
  emissiveIntensity: 0.25,
  roughness: 0.6,
  metalness: 0.2,
});
const signPostMat = new THREE.MeshStandardMaterial({ color: "#7c5228", roughness: 0.85 });
const signBoardMat = new THREE.MeshStandardMaterial({ color: "#f3ecd8", roughness: 0.7 });

const Y = 0.05; // path surface height (above grass, below booth decks)

function DirectionSign({ position, rotation = [0, 0, 0], label }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.85, 0]} material={signPostMat} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 1.7, 8]} />
      </mesh>
      <mesh position={[0.35, 1.5, 0]} material={signBoardMat} castShadow>
        <boxGeometry args={[1.0, 0.34, 0.06]} />
      </mesh>
      <Html position={[0.35, 1.5, 0.05]} center distanceFactor={16} zIndexRange={[6, 0]}>
        <div
          style={{
            pointerEvents: "none",
            userSelect: "none",
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.08em",
            color: "#2a6f74",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
      </Html>
    </group>
  );
}

export default function ExhibitionPaths() {
  return (
    <group>
      {/* Wide central path (front → back) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, Y, 0]} receiveShadow material={stoneMat}>
        <planeGeometry args={[3.0, 40]} />
      </mesh>
      {/* Turquoise centre inlays down the main path (subtle direction accents) */}
      {[-14, -9, -4, 1, 6, 11, 16].map((z) => (
        <mesh key={z} rotation={[-Math.PI / 2, 0, 0]} position={[0, Y + 0.01, z]} material={inlayMat}>
          <planeGeometry args={[0.16, 1.1]} />
        </mesh>
      ))}

      {/* Cross promenades placed in the clear gaps between booth rows */}
      {[16, 8, -8, -16].map((z) => (
        <mesh key={z} rotation={[-Math.PI / 2, 0, 0]} position={[0, Y, z]} receiveShadow material={stoneMat}>
          <planeGeometry args={[34, z === 16 ? 3.4 : 3.0]} />
        </mesh>
      ))}

      {/* Wooden welcome apron at the main entrance */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, Y + 0.005, 19.2]} receiveShadow material={woodDeckMat}>
        <planeGeometry args={[11, 4]} />
      </mesh>

      {/* Welcome carpets in front of the two premium corner booths (B1 / B5) */}
      {[-12, 12].map((x) => (
        <group key={x}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x, Y + 0.008, 15.0]} material={carpetTrimMat}>
            <planeGeometry args={[4.4, 2.3] } />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x, Y + 0.012, 15.0]} material={carpetMat}>
            <planeGeometry args={[4.0, 1.9]} />
          </mesh>
        </group>
      ))}

      {/* Direction signs at the main intersections */}
      <DirectionSign position={[2.2, 0, 8]} label="Booths →" />
      <DirectionSign position={[2.2, 0, -8]} rotation={[0, Math.PI, 0]} label="Exit →" />
    </group>
  );
}
