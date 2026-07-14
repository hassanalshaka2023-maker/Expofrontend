/* ==========================================================================
 * OutdoorLightingRig — bright, natural daylight for the outdoor exhibition.
 *
 * A blue-sky hemisphere + a warm soft directional "sun" (with controlled soft
 * shadows) + a low warm fill. No black void, no cyan fog, no per-booth lights,
 * no neon bloom. Shadow quality scales with the `quality` prop.
 * ======================================================================== */

const SHADOW_MAP = { high: 2048, medium: 1024, low: 512 };

export default function OutdoorLightingRig({ quality = "high", shadows = true }) {
  const mapSize = SHADOW_MAP[quality] || 1024;

  return (
    <group>
      {/* Sky/ground hemisphere — the base of the bright daylight look */}
      <hemisphereLight args={["#cfe8ff", "#7a8a5c", 0.95]} />
      <ambientLight intensity={0.28} />

      {/* Warm morning/late-afternoon sun with soft shadows */}
      <directionalLight
        position={[18, 30, 16]}
        intensity={1.15}
        color="#fff4e0"
        castShadow={shadows}
        shadow-mapSize-width={mapSize}
        shadow-mapSize-height={mapSize}
        shadow-camera-near={1}
        shadow-camera-far={90}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />

      {/* Soft cool fill from the opposite side (no shadow) so shadows aren't black */}
      <directionalLight position={[-16, 14, -12]} intensity={0.32} color="#dbeeff" />
    </group>
  );
}
