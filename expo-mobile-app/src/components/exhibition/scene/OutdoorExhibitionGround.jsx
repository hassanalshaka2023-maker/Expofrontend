/* ==========================================================================
 * OutdoorExhibitionGround — a defined outdoor exhibition ground: natural green
 * grass with subtle colour variation (procedural CanvasTexture, no external
 * image), defined exhibition boundaries (stone curb), and separate light
 * foundation pads beneath every real booth so booths never float on the grass.
 * Matte only: high roughness, ~zero metalness, no reflections, no infinite grid.
 * ======================================================================== */

import { useMemo } from "react";
import * as THREE from "three";

/* One procedural grass texture, built once and reused. Base green with soft
 * lighter/darker patches + a few earthy specks — never an artificial neon green. */
function createGrassTexture() {
  if (typeof document === "undefined") return null;
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#6ea24a";
  ctx.fillRect(0, 0, size, size);

  const patches = [
    { c: "rgba(120,176,86,0.55)", n: 260, r: 7 }, // lighter grass
    { c: "rgba(86,140,62,0.5)", n: 260, r: 7 }, // darker grass
    { c: "rgba(150,190,110,0.35)", n: 160, r: 4 }, // sun highlights
    { c: "rgba(122,96,58,0.28)", n: 90, r: 3 }, // earthy specks
  ];
  patches.forEach(({ c, n, r }) => {
    ctx.fillStyle = c;
    for (let i = 0; i < n; i += 1) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const rr = r * (0.5 + Math.random());
      ctx.beginPath();
      ctx.arc(x, y, rr, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  return tex;
}

const grassTexture = createGrassTexture();

const curbMat = new THREE.MeshStandardMaterial({ color: "#cbb98f", roughness: 0.9, metalness: 0.03 });
const padMat = new THREE.MeshStandardMaterial({ color: "#d8c9a2", roughness: 0.92, metalness: 0.02 });
const padEdgeMat = new THREE.MeshStandardMaterial({ color: "#b9a578", roughness: 0.9, metalness: 0.02 });

export default function OutdoorExhibitionGround({ booths = [], width = 46, depth = 42 }) {
  const halfW = width / 2;
  const halfD = depth / 2;

  const grassMat = useMemo(() => {
    const repeats = 12;
    const tex = grassTexture ? grassTexture.clone() : null;
    if (tex) {
      tex.needsUpdate = true;
      tex.repeat.set(repeats, repeats * (depth / width));
    }
    return new THREE.MeshStandardMaterial({
      color: tex ? "#ffffff" : "#6ea24a",
      map: tex,
      roughness: 1,
      metalness: 0,
    });
  }, [width, depth]);

  return (
    <group>
      {/* Large grass ground (extends past the boundary; fog fades the far edge) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow material={grassMat}>
        <planeGeometry args={[width + 40, depth + 40]} />
      </mesh>

      {/* Defined exhibition boundary — a low stone curb around the perimeter */}
      {[
        { p: [0, 0.04, -halfD], a: [width, 0.16, 0.4] },
        { p: [0, 0.04, halfD], a: [width, 0.16, 0.4] },
        { p: [-halfW, 0.04, 0], a: [0.4, 0.16, depth] },
        { p: [halfW, 0.04, 0], a: [0.4, 0.16, depth] },
      ].map((seg, i) => (
        <mesh key={i} position={seg.p} material={curbMat} receiveShadow>
          <boxGeometry args={seg.a} />
        </mesh>
      ))}

      {/* Separate foundation pad beneath every real booth (real coordinates) */}
      {booths.map((booth) => {
        const p = booth && booth.position3D;
        if (!p || typeof p.x !== "number") return null;
        return (
          <group key={booth.boothId || `${p.x}_${p.z}`} position={[p.x, 0, p.z]}>
            <mesh position={[0, 0.015, 0]} receiveShadow material={padEdgeMat}>
              <boxGeometry args={[5.1, 0.05, 5.1]} />
            </mesh>
            <mesh position={[0, 0.03, 0]} receiveShadow material={padMat}>
              <boxGeometry args={[4.8, 0.05, 4.8]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
