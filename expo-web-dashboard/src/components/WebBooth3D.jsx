import { useState } from 'react';
import ExhibitionBooth from './exhibition/ExhibitionBooth';

/* Master switch for the full exhibition-hall redesign. Set to false to revert
 * every booth to the original OriginalWebBooth3D visuals below. */
export const HALL_REDESIGN_ENABLED = true;

const statusConfig = {
  Available: { 
    base: '#00ffcc', 
    emissive: '#00ffcc', 
    intensity: 0.8, 
    label: '🟢 متاح',
    floorColor: '#00ffcc',
    accentColor: '#00d4aa'
  },
  Pending: { 
    base: '#eab308', 
    emissive: '#ca8a04', 
    intensity: 0.6, 
    label: '🟡 قيد الانتظار',
    floorColor: '#eab308',
    accentColor: '#ca8a04'
  },
  Reserved: { 
    base: '#ef4444', 
    emissive: '#b91c1c', 
    intensity: 0.1, 
    label: '🔴 محجوز',
    floorColor: '#ef4444',
    accentColor: '#dc2626'
  },
};

// Original booth visuals — unchanged. Used by every non-prototype booth.
function OriginalWebBooth3D({ id, position, status, companyDetails, onSelect, allowAllClicks = false }) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const isAvailable = status === 'Available';
  const isClickable = isAvailable || allowAllClicks;
  const config = statusConfig[status] || statusConfig.Available;
  const hasCompany = companyDetails && companyDetails.companyName;

  const handleClick = (e) => {
    e.stopPropagation();
    if (!isClickable) return;
    setClicked(true);
    setTimeout(() => setClicked(false), 300);
    onSelect({ boothId: id, status, companyDetails });
  };

  const handlePointerOver = (e) => {
    e.stopPropagation();
    if (isClickable) {
      setHovered(true);
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'default';
  };

  const glowColor = hovered ? '#818cf8' : config.base;

  return (
    <group>
      {/* ===== INVISIBLE CLICKABLE HITBOX ===== */}
      <mesh
        position={[position.x, position.y + 1, position.z]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[4.5, 2.5, 4.5]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* ===== FLOOR PLATFORM ===== */}
      <mesh position={[position.x, position.y - 0.05, position.z]} receiveShadow>
        <boxGeometry args={[5.2, 0.1, 5.2]} />
        <meshStandardMaterial
          color={config.floorColor}
          emissive={config.floorColor}
          emissiveIntensity={hovered ? 0.4 : 0.15}
          roughness={0.3}
          metalness={0.7}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Floor glow ring */}
      <mesh position={[position.x, position.y - 0.02, position.z]}>
        <ringGeometry args={[2.8, 3.2, 48]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={hovered ? 0.5 : 0.2}
          side={2}
        />
      </mesh>

      {/* ===== MAIN BOOTH STRUCTURE ===== */}
      <group position={[position.x, position.y + 1, position.z]}>
        {/* Back wall */}
        <mesh position={[0, 0.5, -1.8]}>
          <boxGeometry args={[3.6, 1.2, 0.08]} />
          <meshStandardMaterial
            color={hovered ? '#1e1b4b' : '#0f172a'}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Left wall */}
        <mesh position={[-1.8, 0.5, 0]}>
          <boxGeometry args={[0.08, 1.2, 3.6]} />
          <meshStandardMaterial
            color={hovered ? '#1e1b4b' : '#0f172a'}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Right wall */}
        <mesh position={[1.8, 0.5, 0]}>
          <boxGeometry args={[0.08, 1.2, 3.6]} />
          <meshStandardMaterial
            color={hovered ? '#1e1b4b' : '#0f172a'}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Floor inside */}
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[3.5, 0.05, 3.5]} />
          <meshStandardMaterial
            color="#1a1a2e"
            roughness={0.4}
            metalness={0.6}
          />
        </mesh>

        {/* Ceiling / Roof */}
        <mesh position={[0, 1.05, 0]}>
          <boxGeometry args={[3.8, 0.06, 3.8]} />
          <meshStandardMaterial
            color={config.accentColor}
            emissive={config.accentColor}
            emissiveIntensity={hovered ? 0.6 : 0.2}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>

        {/* ===== GLASS FRONT ===== */}
        <mesh position={[0, 0.5, 1.8]}>
          <boxGeometry args={[3.4, 1.0, 0.04]} />
          <meshStandardMaterial
            color={config.base}
            emissive={config.base}
            emissiveIntensity={hovered ? 0.3 : 0.08}
            transparent
            opacity={hovered ? 0.35 : 0.2}
            roughness={0.05}
            metalness={0.95}
          />
        </mesh>

        {/* Glass frame edges */}
        {[-1.7, 1.7].map((x) => (
          <mesh key={x} position={[x, 0.5, 1.8]}>
            <boxGeometry args={[0.06, 1.0, 0.06]} />
            <meshStandardMaterial
              color={config.accentColor}
              emissive={config.accentColor}
              emissiveIntensity={hovered ? 0.8 : 0.3}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        ))}

        {/* ===== CORNER PILLARS ===== */}
        {[
          [-1.8, 0.5, -1.8],
          [1.8, 0.5, -1.8],
          [-1.8, 0.5, 1.8],
          [1.8, 0.5, 1.8]
        ].map((pos, i) => (
          <mesh key={i} position={pos}>
            <boxGeometry args={[0.12, 1.1, 0.12]} />
            <meshStandardMaterial
              color={config.accentColor}
              emissive={config.accentColor}
              emissiveIntensity={hovered ? 0.5 : 0.15}
              metalness={0.95}
              roughness={0.05}
            />
          </mesh>
        ))}

        {/* ===== COMPANY NAME SIGN (if reserved/pending) ===== */}
        {hasCompany && (
          <group position={[0, 1.4, 0]}>
            {/* Sign board */}
            <mesh>
              <boxGeometry args={[3.2, 0.3, 0.06]} />
              <meshStandardMaterial
                color="#0f172a"
                roughness={0.3}
                metalness={0.7}
              />
            </mesh>
            {/* Sign glow */}
            <mesh position={[0, 0, 0.04]}>
              <planeGeometry args={[3.0, 0.2]} />
              <meshBasicMaterial
                color={config.base}
                transparent
                opacity={0.3}
              />
            </mesh>
          </group>
        )}

        {/* ===== STATUS INDICATOR LIGHT ===== */}
        <mesh position={[0, 1.2, 1.85]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial
            color={config.base}
            emissive={config.base}
            emissiveIntensity={hovered ? 2.0 : 0.8}
          />
        </mesh>

        {/* ===== EDGE GLOW LINES ===== */}
        {[
          { pos: [0, 0.5, -1.85], args: [3.6, 0.02, 0.02] },
          { pos: [0, 0.5, 1.85], args: [3.6, 0.02, 0.02] },
          { pos: [-1.85, 0.5, 0], args: [0.02, 0.02, 3.6] },
          { pos: [1.85, 0.5, 0], args: [0.02, 0.02, 3.6] },
        ].map((line, i) => (
          <mesh key={i} position={line.pos}>
            <boxGeometry args={line.args} />
            <meshBasicMaterial
              color={glowColor}
              transparent
              opacity={hovered ? 0.9 : 0.3}
            />
          </mesh>
        ))}
      </group>

      {/* ===== FLOATING INFO LABEL (on hover) ===== */}
      {hovered && isClickable && (
        <group position={[position.x, position.y + 2.8, position.z]}>
          {/* Background panel */}
          <mesh>
            <planeGeometry args={[3.0, 0.5]} />
            <meshBasicMaterial
              color="#0c0e2b"
              transparent
              opacity={0.85}
              side={2}
            />
          </mesh>
          {/* Border */}
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[3.0, 0.5]} />
            <meshBasicMaterial
              color={glowColor}
              transparent
              opacity={0.3}
              wireframe
            />
          </mesh>
        </group>
      )}

      {/* ===== CLICK RIPPLE EFFECT ===== */}
      {clicked && (
        <mesh position={[position.x, position.y + 0.1, position.z]}>
          <ringGeometry args={[2.0, 3.5, 48]} />
          <meshBasicMaterial
            color="#818cf8"
            transparent
            opacity={0.7}
            side={2}
          />
        </mesh>
      )}
    </group>
  );
}

/*
 * Booth dispatcher.
 * With the hall redesign enabled, every booth renders through ExhibitionBooth,
 * which deterministically picks one of the five coordinated variants
 * (standard / corner / island / premium / technology). Props — including the
 * real id, position, status, companyDetails, onSelect, allowAllClicks and the
 * new `selected` flag — are forwarded untouched, so interaction and reservation
 * behaviour are identical to before. This wrapper calls no hooks itself.
 * To revert entirely: set HALL_REDESIGN_ENABLED = false above.
 */
export default function WebBooth3D(props) {
  if (HALL_REDESIGN_ENABLED) {
    return <ExhibitionBooth {...props} />;
  }
  return <OriginalWebBooth3D {...props} />;
}