/* ==========================================================================
 * SharedMapControls — one OrbitControls configuration for every role: smooth
 * damping, practical zoom limits, no going below the ground or flipping upside
 * down, touch-friendly (one-finger rotate, two-finger pinch-zoom/pan). Registers
 * a "reset view" callback with the parent so the same default composition can be
 * restored from any role's UI.
 * ======================================================================== */

import { useEffect, useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

export default function SharedMapControls({
  target = [0, 1.5, 0],
  position = [0, 22, 32],
  minDistance = 9,
  maxDistance = 62,
  enablePan = true,
  registerReset,
}) {
  const controls = useRef();
  const { camera } = useThree();

  useEffect(() => {
    if (!registerReset) return undefined;
    registerReset(() => {
      camera.position.set(position[0], position[1], position[2]);
      if (controls.current) {
        controls.current.target.set(target[0], target[1], target[2]);
        controls.current.update();
      }
    });
    return () => registerReset(null);
    // position/target are stable arrays from the parent's defaults
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerReset, camera]);

  return (
    <OrbitControls
      ref={controls}
      target={target}
      enablePan={enablePan}
      enableDamping
      dampingFactor={0.08}
      minDistance={minDistance}
      maxDistance={maxDistance}
      minPolarAngle={0.12}
      maxPolarAngle={Math.PI / 2.15}
      makeDefault
    />
  );
}
