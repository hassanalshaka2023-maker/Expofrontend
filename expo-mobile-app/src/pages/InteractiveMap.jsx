import { useEffect, useState, useCallback, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Line, Html, useTexture } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import confetti from "canvas-confetti";
import * as THREE from "three";
import { expoApi } from "../services/api";
import Booth3D from "../components/Booth3D";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📦 المكونات المستقلة
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function EntranceGate() {
  return (
    <group position={[0, 0, 17]}>
      <mesh position={[0, 2.2, 0]}>
        <boxGeometry args={[6, 0.3, 1]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#3b82f6"
          emissiveIntensity={2}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      <mesh position={[-2.85, 1, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 2, 8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[2.85, 1, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 2, 8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
      </mesh>
      <Html position={[0, 2.7, 0]} center>
        <div className="bg-blue-600/90 text-white font-black text-[9px] px-3 py-1 rounded-lg shadow-lg border border-blue-400/50 select-none backdrop-blur-sm tracking-widest">
          🚪 ENTRANCE
        </div>
      </Html>
    </group>
  );
}

function AdminOffice() {
  return (
    <group position={[-18, 0, 16]}>
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[6, 3, 5]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.6} />
      </mesh>
      <mesh position={[0, 3.01, 0]}>
        <boxGeometry args={[6.05, 0.1, 5.05]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#1d4ed8"
          emissiveIntensity={1.5}
          wireframe
        />
      </mesh>
      <mesh position={[0, 1.5, 2.51]}>
        <boxGeometry args={[5.8, 2.8, 0.05]} />
        <meshStandardMaterial
          color="#0f172a"
          emissive="#1e3a5f"
          emissiveIntensity={0.3}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
      <Html position={[0, 3.8, 0]} center>
        <div className="bg-slate-900/90 text-white font-bold text-[8px] px-2.5 py-1 rounded-lg border border-blue-500/30 whitespace-nowrap shadow-md select-none backdrop-blur-sm">
          🏢 إدارة المعرض
        </div>
      </Html>
    </group>
  );
}

function Restrooms() {
  return (
    <group position={[18, 0, 16]}>
      <mesh position={[0, 1.25, 0]}>
        <boxGeometry args={[5, 2.5, 4]} />
        <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh position={[0, 2.52, 0]}>
        <boxGeometry args={[5.05, 0.05, 4.05]} />
        <meshStandardMaterial
          color="#64748b"
          emissive="#475569"
          emissiveIntensity={0.8}
          wireframe
        />
      </mesh>
      <Html position={[0, 3.2, 0]} center>
        <div className="bg-slate-900/90 text-gray-300 font-bold text-[8px] px-2.5 py-1 rounded-lg border border-slate-700 whitespace-nowrap shadow-md select-none backdrop-blur-sm">
          🚻 دورات المياه
        </div>
      </Html>
    </group>
  );
}

function MainStage() {
  return (
    <group position={[0, 0, -18]}>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[16, 0.6, 4]} />
        <meshStandardMaterial color="#0b0f19" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[16, 6, 0.2]} />
        <meshStandardMaterial
          color="#0b0f19"
          roughness={0.5}
          emissive="#0b0f19"
          emissiveIntensity={0.1}
        />
      </mesh>
      <mesh position={[0, 3, 0.05]}>
        <boxGeometry args={[16.2, 6.2, 0.1]} />
        <meshStandardMaterial
          color="#1d4ed8"
          emissive="#3b82f6"
          emissiveIntensity={2}
          wireframe
        />
      </mesh>
      <Html position={[0, 3, 0.2]} center>
        <div className="text-center font-black text-white select-none pointer-events-none">
          <span className="text-blue-400 block text-[10px] tracking-[0.3em]">
            TECH
          </span>
          <span
            className="text-lg tracking-wider"
            style={{ textShadow: "0 0 20px rgba(59,130,246,0.5)" }}
          >
            EXPO 2025
          </span>
        </div>
      </Html>
    </group>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎨 مكون الأرضية (تم إصلاحه بالكامل)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function FloorFallback() {
  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.02, 0]}
        receiveShadow
      >
        <planeGeometry args={[90, 90]} />
        <meshStandardMaterial
          color="#13233d"
          emissive="#1d4ed8"
          emissiveIntensity={0.12}
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>
      <Grid
        renderOrder={-1}
        position={[0, -0.01, 0]}
        args={[60, 60]}
        cellSize={1}
        cellThickness={0.4}
        cellColor="#1e293b"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#3b82f6"
        fadeDistance={50}
      />
    </group>
  );
}

function CustomFloor() {
  const floorTex = useTexture("/textures/floor.jpg");

  useEffect(() => {
    if (floorTex) {
      floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
      floorTex.repeat.set(15, 15);
    }
  }, [floorTex]);

  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.02, 0]}
        receiveShadow
      >
        <planeGeometry args={[90, 90]} />
        <meshStandardMaterial
          map={floorTex}
          color="#14243c"
          emissive="#1d4ed8"
          emissiveIntensity={0.08}
          roughness={0.5}
          metalness={0.2}
        />
      </mesh>
      <Grid
        renderOrder={-1}
        position={[0, -0.01, 0]}
        args={[60, 60]}
        cellSize={1}
        cellThickness={0.4}
        cellColor="#1e293b"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#3b82f6"
        fadeDistance={50}
      />
    </group>
  );
}

function HybridFloor({ useTexture: enableTexture = false }) {
  if (enableTexture) {
    return (
      <Suspense fallback={<FloorFallback />}>
        <CustomFloor />
      </Suspense>
    );
  }

  return <FloorFallback />;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🧭 خط التوجيه (تم إصلاحه)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function DirectionLine({ selectedBooth, startPoint = null }) {
  if (!selectedBooth?.position3D) return null;

  const p = selectedBooth.position3D;

  let start;
  if (startPoint) {
    start = startPoint;
  } else {
    start = [0, 0.05, 17];
  }

  const midZ = p.z > 0 ? p.z + 3 : p.z - 3;
  const midPoint = [0, 0.05, midZ];
  const endPoint = [p.x, 0.05, p.z];

  return (
    <group>
      <Line
        points={[start, midPoint, endPoint]}
        color="#00ffff"
        lineWidth={6}
        dashed
        dashSize={0.8}
        gapSize={0.5}
      />

      <mesh position={[start[0], 0.1, start[2]]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={2}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* نقطة النهاية */}
      <mesh position={[endPoint[0], 0.1, endPoint[2]]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={2}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📋 الشريط السفلي (تم إصلاحه مع التقييم والمسار)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function BottomInfoSheet({
  booth,
  onClose,
  onDirections,
  userRating,
  setUserRating,
}) {
  const isReserved = booth?.status === "Reserved";
  const details = booth?.companyDetails || {};

  const handleRating = async (star) => {
    setUserRating(star);
    
    // إرسال التقييم إلى السيرفر
    try {
      await expoApi.rateBooth(booth.id, star);
      
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.4 },
        colors: ["#ffd700", "#ff6b6b", "#4ecdc4", "#45b7d1"],
      });
    } catch (err) {
      console.error('فشل إرسال التقييم:', err);
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 bg-gray-950/95 backdrop-blur-xl border-t border-white/10 rounded-t-3xl p-6 shadow-2xl pb-8 animate-slide-up">
      <div className="w-10 h-1 bg-white/10 rounded-full mx-auto mb-5" />

      <div className="flex items-start justify-between mb-4">
        <div className="space-y-1">
          <span
            className={`text-[10px] px-2.5 py-1 rounded-lg font-bold border ${
              isReserved
                ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                : "bg-slate-500/10 text-slate-400 border-slate-500/20"
            }`}
          >
            {isReserved ? "🔵 جناح شركة معتمد" : "⚪ كشك شاغر"}
          </span>
          <h2 className="text-white text-lg font-black mt-2">
            الكشك {booth?.id}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-500 hover:bg-white/10 hover:text-white transition-colors text-sm"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] rounded-2xl border border-white/10 p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/20 flex items-center justify-center text-xl flex-shrink-0">
              🏢
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">
                الشركة المستثمرة
              </p>
              <p className="text-white font-bold text-base truncate">
                {details.companyName || "—"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/[0.03] rounded-xl p-3 border border-white/5">
              <p className="text-[9px] text-gray-500 font-medium mb-0.5">
                التخصص
              </p>
              <p className="text-gray-200 text-xs font-semibold">
                {details.category || "غير محدد"}
              </p>
            </div>
            <div className="bg-white/[0.03] rounded-xl p-3 border border-white/5">
              <p className="text-[9px] text-gray-500 font-medium mb-0.5">
                رقم الكشك
              </p>
              <p className="text-gray-200 text-xs font-semibold">{booth?.id}</p>
            </div>
          </div>

          {details.description && (
            <div className="bg-white/[0.02] rounded-xl p-3 border border-white/5">
              <p className="text-[9px] text-gray-500 font-medium mb-1">الوصف</p>
              <p className="text-gray-300 text-xs leading-relaxed">
                {details.description}
              </p>
            </div>
          )}
        </div>

        {/* ⭐ نظام التقييم */}
        <div className="bg-gradient-to-r from-amber-500/5 to-yellow-500/5 rounded-xl p-4 border border-amber-500/20">
          <p className="text-[10px] text-gray-400 mb-3 text-center font-medium">
            ⭐ قيّم تجربتك بزيارة هذا الجناح:
          </p>
          <div className="flex flex-row-reverse justify-center gap-3">
            {[5, 4, 3, 2, 1].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRating(star)}
                className={`text-3xl transition-all duration-200 hover:scale-125 ${
                  star <= userRating
                    ? "text-amber-400"
                    : "text-gray-600 hover:text-gray-400"
                }`}
              >
                ★
              </button>
            ))}
          </div>
          {userRating > 0 && (
            <p className="text-center text-[10px] text-amber-400/80 mt-2 font-medium">
              ⭐ تقييمك: {userRating} {userRating === 1 ? "نجمة" : "نجوم"}
            </p>
          )}
        </div>

        {/* 🎯 زر التوجيه */}
        <button
          onClick={onDirections}
          className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-3"
        >
          <span className="text-lg">🎯</span>
          أرشدني إلى هذا الكشك
        </button>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎯 Skeleton Loader
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function SkeletonLoader() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#020617] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-gray-400 text-sm font-medium">
          جاري تحميل الخريطة...
        </p>
        <div className="mt-4 flex gap-2 justify-center">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-12 h-8 rounded-lg bg-white/5 animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ════════════════════════════════════════════════════════
// الصفحة الرئيسية (النسخة المدمجة والمصلحة)
// ════════════════════════════════════════════════════════
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function InteractiveMap() {
  const [booths, setBooths] = useState([]);
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDirections, setShowDirections] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userStartPoint, setUserStartPoint] = useState(null);
  const [useTextureFloor, setUseTextureFloor] = useState(false);

  useEffect(() => {
    let mounted = true;

    const urlParams = new URLSearchParams(window.location.search);
    const standPoint = urlParams.get("from");

    if (standPoint === "Restroom") {
      setUserStartPoint([16, 0.05, -12]);
    } else if (standPoint === "Admin") {
      setUserStartPoint([-18, 0.05, 16]);
    } else {
      setUserStartPoint([0, 0.05, 17]);
    }

    const textureMode = urlParams.get("texture");
    if (textureMode === "true") {
      setUseTextureFloor(true);
    }

    expoApi
      .getBooths()
      .then((data) => {
        if (mounted) {
          setBooths(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setError("فشل في تحميل الخريطة");
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleClose = useCallback(() => {
    setSelectedBooth(null);
    setShowDirections(false);
    setUserRating(0);
  }, []);

  const handleDirections = useCallback(() => {
    setShowDirections(true);
  }, []);

  const handleBoothSelect = useCallback((boothInfo) => {
    setSelectedBooth(boothInfo);
    setShowDirections(false);
    setUserRating(0);

    if (boothInfo.status === "Reserved") {
      confetti({
        particleCount: 130,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#3b82f6", "#00ffcc", "#f59e0b", "#a855f7", "#ff6b6b"],
      });

      setTimeout(() => {
        confetti({
          particleCount: 70,
          spread: 100,
          origin: { y: 0.4 },
          colors: ["#ffd700", "#ff6b6b", "#4ecdc4"],
        });
      }, 300);
    }
  }, []);

  if (error && booths.length === 0) {
    return (
      <div className="relative w-screen h-screen overflow-hidden bg-[#020617] flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-white font-black text-lg mb-2">تعذر التحميل</h2>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-lg"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#020617] m-0 p-0 flex flex-col">
      {/* ═══ 1. لوحة الرسم ثلاثية الأبعاد ═══ */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Canvas
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            position: "absolute",
            top: 0,
            left: 0,
          }}
          camera={{ position: [0, 15, 20], fov: 45 }}
        >
          <color attach="background" args={["#020617"]} />

          <ambientLight intensity={0.4} />
          <pointLight position={[10, 20, 10]} intensity={1.5} color="#38bdf8" />
          <directionalLight
            position={[-10, 20, -10]}
            intensity={0.8}
            color="#38bdf8"
          />

          {/* الأرضية الهجينة */}
          <HybridFloor useTexture={useTextureFloor} />

          <EntranceGate />
          <AdminOffice />
          <Restrooms />
          <MainStage />

          {booths.map((booth) => (
            <Booth3D
              key={booth.boothId}
              id={booth.boothId}
              position={booth.position3D}
              status={booth.status}
              companyDetails={booth.companyDetails}
              onSelect={handleBoothSelect}
            />
          ))}

          {selectedBooth && (
            <DirectionLine
              selectedBooth={selectedBooth}
              startPoint={userStartPoint}
            />
          )}

          <OrbitControls
            maxPolarAngle={Math.PI / 2.1}
            minDistance={8}
            maxDistance={45}
          />

          <EffectComposer>
            <Bloom
              intensity={1.5}
              luminanceThreshold={0.15}
              luminanceSmoothing={0.9}
            />
          </EffectComposer>
        </Canvas>
      </div>

      {/* ═══ 2. العنوان العلوي ═══ */}
      <div className="absolute top-4 left-4 right-4 z-10 pointer-events-none">
        <div className="bg-gray-950/80 backdrop-blur-xl rounded-2xl px-5 py-3 border border-white/10 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
              <span className="text-white font-black text-xs">T</span>
            </div>
            <div className="flex-1">
              <h1 className="text-white font-bold text-sm">
                🗺️ الخريطة التفاعلية
              </h1>
              <p className="text-gray-500 text-[9px] mt-0.5">
                معرض تك إكسبو - انقر على كشك لاستكشافه
                {userStartPoint && (
                  <span className="text-blue-400 ml-2">
                    •📍 نقطة البداية:{" "}
                    {userStartPoint[2] === 17
                      ? "البوابة"
                      : userStartPoint[2] === -12
                        ? "دورات المياه"
                        : "الإدارة"}
                  </span>
                )}
              </p>
            </div>
            <div className="text-[8px] px-2 py-1 rounded bg-white/5 text-gray-400 border border-white/5">
              {useTextureFloor ? "🖼️ Texture" : "🔲 Grid"}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ 3. الشريط السفلي ═══ */}
      {selectedBooth && (
        <BottomInfoSheet
          booth={selectedBooth}
          onClose={handleClose}
          onDirections={handleDirections}
          userRating={userRating}
          setUserRating={setUserRating}
        />
      )}
    </div>
  );
}