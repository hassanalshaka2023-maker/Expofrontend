// components/Booth3D.jsx - نسخة محسنة بالكامل
import { useRef, useState, useMemo } from 'react';
import { Html, Sparkles } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const statusConfig = {
  Available: { 
    base: '#334155', 
    emissive: '#1e293b', 
    intensity: 0.2,
    glowColor: '#22c55e'
  },
  Pending: { 
    base: '#334155', 
    emissive: '#1e293b', 
    intensity: 0.2,
    glowColor: '#eab308'
  },
  Reserved: { 
    base: '#3b82f6', 
    emissive: '#1d4ed8', 
    intensity: 1.5,
    glowColor: '#3b82f6'
  },
};

export default function Booth3D({ id, position, status, companyDetails, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const glowRef = useRef();
  
  const isReserved = status === 'Reserved';
  const config = statusConfig[status] || statusConfig.Available;

  // أنيميشن النبض للكشك المحجوز
  useFrame(({ clock }) => {
    if (glowRef.current && isReserved) {
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.3;
      glowRef.current.material.emissiveIntensity = 0.5 + pulse * 0.8;
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    setClicked(true);
    setTimeout(() => setClicked(false), 400);
    onSelect({ id, status, companyDetails, position3D: position });
  };

  // تلوين حسب الحالة
  let themeColor = config.base;
  let emissiveColor = config.emissive;
  let emissiveIntensity = config.intensity;

  if (hovered && isReserved) {
    themeColor = '#a855f7';
    emissiveColor = '#7c3aed';
    emissiveIntensity = 2.5;
  } else if (hovered && !isReserved) {
    themeColor = '#475569';
    emissiveColor = '#334155';
    emissiveIntensity = 0.4;
  }

  // عناصر الزينة - ثابتة ما تتغير
  const decorations = useMemo(() => {
    const items = [];
    if (isReserved) {
      const sizes = [0.12, 0.08, 0.15, 0.1, 0.09, 0.13, 0.11, 0.14];
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        items.push({
          position: [Math.cos(angle) * 2.2, 0.1, Math.sin(angle) * 2.2],
          color: i % 2 === 0 ? '#3b82f6' : '#8b5cf6',
          size: sizes[i]
        });
      }
    }
    return items;
  }, [isReserved]);

  return (
    <group>
      {/* ===== HITBOX شفاف ثابت للـ Click ===== */}
      <mesh
        position={[position.x, position.y + 1.5, position.z]}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <boxGeometry args={[4.5, 3.2, 4.5]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* ===== العناصر المرئية ===== */}
      <group position={[position.x, position.y, position.z]}>
        {/* Click ripple effect */}
        {clicked && (
          <mesh position={[0, 0.05, 0]}>
            <ringGeometry args={[2.2, 2.7, 48]} />
            <meshBasicMaterial
              color="#818cf8"
              transparent
              opacity={0.5}
              side={2}
            />
          </mesh>
        )}

        {/* Ground */}
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[4.2, 0.04, 4.2]} />
          <meshStandardMaterial
            color={hovered && isReserved ? '#1e1b4b' : '#090d16'}
            roughness={0.05}
            metalness={0.95}
          />
        </mesh>

        {/* Glow ring under booth */}
        {isReserved && (
          <mesh ref={glowRef} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.8, 2.3, 32]} />
            <meshStandardMaterial
              color="#3b82f6"
              emissive="#3b82f6"
              emissiveIntensity={0.5}
              transparent
              opacity={0.3}
              side={2}
            />
          </mesh>
        )}

        {/* Sparkles للمحجوز */}
        {isReserved && (
          <Sparkles
            count={30}
            scale={[4, 4, 4]}
            size={0.3}
            speed={0.5}
            color="#3b82f6"
          />
        )}

        {/* 4 أعمدة */}
        {[[-1.8, -1.8], [1.8, -1.8], [-1.8, 1.8], [1.8, 1.8]].map((pos, idx) => (
          <group key={idx}>
            <mesh position={[pos[0], 1.5, pos[1]]}>
              <cylinderGeometry args={[0.22, 0.22, 3, 16]} />
              <meshStandardMaterial
                color={themeColor}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity + (isReserved ? 0.5 : 0)}
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
            <mesh position={[pos[0], 3.0, pos[1]]}>
              <cylinderGeometry args={[0.28, 0.22, 0.08, 16]} />
              <meshStandardMaterial
                color={config.glowColor}
                emissive={config.glowColor}
                emissiveIntensity={isReserved ? 2 : 0.5}
              />
            </mesh>
          </group>
        ))}

        {/* الجدار الخلفي */}
        <mesh position={[0, 1.3, -1.8]}>
          <boxGeometry args={[3.4, 2.6, 0.2]} />
          <meshStandardMaterial
            color={hovered && isReserved ? '#1e1b4b' : '#111827'}
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>

        {/* إطار الجدار الخلفي المضيء */}
        {isReserved && (
          <mesh position={[0, 1.3, -1.7]}>
            <boxGeometry args={[3.5, 2.7, 0.05]} />
            <meshStandardMaterial
              color={config.glowColor}
              emissive={config.glowColor}
              emissiveIntensity={0.3}
              transparent
              opacity={0.3}
              wireframe
            />
          </mesh>
        )}

        {/* سقف */}
        <mesh position={[0, 2.9, 0]}>
          <boxGeometry args={[4.2, 0.3, 4.2]} />
          <meshStandardMaterial
            color={hovered && isReserved ? '#1e1b4b' : '#0f172a'}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* إطار السقف النيون */}
        <mesh position={[0, 2.9, 0]}>
          <boxGeometry args={[4.24, 0.32, 4.24]} />
          <meshStandardMaterial
            color={config.glowColor}
            emissive={config.glowColor}
            emissiveIntensity={isReserved ? 2 : 0.5}
            wireframe
          />
        </mesh>

        {/* زينة الأعمدة الصغيرة */}
        {decorations.map((dec, i) => (
          <mesh key={`dec-${i}`} position={dec.position}>
            <sphereGeometry args={[dec.size, 8, 8]} />
            <meshStandardMaterial
              color={dec.color}
              emissive={dec.color}
              emissiveIntensity={0.5}
            />
          </mesh>
        ))}

        {/* رقم الكشك */}
        <Html position={[0, 0.05, 1.6]} center distanceFactor={12}>
          <div className="text-[8px] text-gray-600 font-mono tracking-wider bg-black/50 px-2 py-0.5 rounded border border-gray-800">
            #{id}
          </div>
        </Html>

        {/* اللافتة العلوية - اسم الشركة فقط للمحجوز */}
        <Html position={[0, 3.8, 0]} center distanceFactor={14}>
          <div 
            className={`px-4 py-2 rounded-xl font-black text-[10px] shadow-2xl border backdrop-blur-md select-none tracking-wide text-center ${
              isReserved
                ? 'bg-gradient-to-r from-blue-950/90 to-indigo-950/90 text-blue-400 border-blue-500/40 shadow-blue-500/20 scale-105'
                : 'bg-slate-950/80 text-slate-500 border-slate-800'
            }`}
            style={{
              boxShadow: isReserved ? '0 0 30px rgba(59,130,246,0.2)' : 'none'
            }}
          >
            {isReserved ? (
              <>
                <span className="block text-white font-extrabold text-sm">
                  {companyDetails?.companyName || 'شركة'}
                </span>
                <span className="text-[7px] opacity-70 block mt-0.5 text-blue-300 tracking-wider">
                  {id} • {companyDetails?.category || 'تكنولوجيا'}
                </span>
              </>
            ) : (
              <span className="text-gray-500 text-[9px]">#{id}</span>
            )}
          </div>
        </Html>
      </group>
    </group>
  );
}