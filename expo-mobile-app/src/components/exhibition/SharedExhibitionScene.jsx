/* ==========================================================================
 * SharedExhibitionScene — the ONE interactive exhibition scene reused by every
 * role (Admin / Investor / public Visitor). It owns the <Canvas>, the bright
 * outdoor daylight, the grass ground, the walking paths, the entrance / exits /
 * information point, the landscaping, the real booths, and the camera controls.
 *
 * It contains only visual geometry + selection wiring — NO role business logic
 * (no reservation, no admin actions, no data fetching). Roles differ only by:
 *   - `mode` ("admin" | "investor" | "visitor") — reserved for future per-mode
 *      visual tweaks; geometry is identical across modes by design.
 *   - which real `booths` array they pass (from the same source),
 *   - the selection callbacks they wire up,
 *   - the UI they render AROUND the scene.
 *
 * Booth geometry, coordinates, numbers, designs, status markers, grass, paths,
 * lighting and camera are therefore identical for all three roles.
 * ======================================================================== */

import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { RotateCcw } from "lucide-react";
import ExhibitionBooth from "./ExhibitionBooth";
import OutdoorLightingRig from "./scene/OutdoorLightingRig";
import OutdoorExhibitionGround from "./scene/OutdoorExhibitionGround";
import ExhibitionPaths from "./scene/ExhibitionPaths";
import Landscaping from "./scene/Landscaping";
import ExhibitionEntrance from "./scene/ExhibitionEntrance";
import ExhibitionExit from "./scene/ExhibitionExit";
import InformationPoint from "./scene/InformationPoint";
import SharedMapControls from "./scene/SharedMapControls";
import RouteToBooth from "./scene/RouteToBooth";

const SKY = "#c4e0f2";

function detectQuality() {
  if (typeof window === "undefined") return "high";
  const w = window.innerWidth;
  if (w <= 640) return "low";
  if (w <= 1024) return "medium";
  return "high";
}

const SharedExhibitionScene = forwardRef(function SharedExhibitionScene(
  {
    booths = [],
    mode = "visitor",
    exhibitionName = "HOPEX EXPO",
    selectedBoothId = null,
    onSelectBooth,
    showResetButton = true,
    routeToBoothId = null,
  },
  ref
) {
  const [quality, setQuality] = useState(detectQuality);
  const resetFnRef = useRef(null);

  useEffect(() => {
    let frame;
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setQuality(detectQuality()));
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frame);
    };
  }, []);

  const registerReset = useCallback((fn) => {
    resetFnRef.current = fn;
  }, []);

  const resetView = useCallback(() => {
    if (resetFnRef.current) resetFnRef.current();
  }, []);

  useImperativeHandle(ref, () => ({ resetView }), [resetView]);

  const shadows = quality !== "low";
  const dpr = useMemo(() => [1, quality === "low" ? 1.5 : 2], [quality]);

  const handleSelect = useCallback(
    (info) => {
      if (onSelectBooth) onSelectBooth(info);
    },
    [onSelectBooth]
  );

  // Resolve the walking-route target (the selected booth's real 3D position)
  // so the scene can draw guidance from the entrance to it.
  const routeTarget = useMemo(() => {
    if (!routeToBoothId) return null;
    const b = booths.find((booth) => booth && booth.boothId === routeToBoothId);
    return b && b.position3D && typeof b.position3D.x === "number" ? b.position3D : null;
  }, [routeToBoothId, booths]);

  return (
    <div data-mode={mode} style={{ position: "relative", width: "100%", height: "100%" }}>
      <Canvas
        shadows={shadows}
        dpr={dpr}
        camera={{ position: [0, 22, 32], fov: 45 }}
        gl={{ antialias: quality !== "low", powerPreference: "high-performance" }}
        style={{ touchAction: "none", background: SKY }}
      >
        <color attach="background" args={[SKY]} />
        <fog attach="fog" args={[SKY, 52, 120]} />

        <OutdoorLightingRig quality={quality} shadows={shadows} />
        <OutdoorExhibitionGround booths={booths} />
        <ExhibitionPaths />
        <ExhibitionEntrance exhibitionName={exhibitionName} />
        <ExhibitionExit />
        <InformationPoint />
        <Landscaping quality={quality} />

        {booths.map((booth, index) => {
          const p = booth && booth.position3D;
          if (!p || typeof p.x !== "number") return null;
          return (
            <ExhibitionBooth
              key={booth.boothId}
              index={index}
              id={booth.boothId}
              position={p}
              status={booth.status}
              companyDetails={booth.companyDetails}
              selected={selectedBoothId === booth.boothId}
              onSelect={handleSelect}
              allowAllClicks
            />
          );
        })}

        {routeTarget && <RouteToBooth target={routeTarget} />}

        <SharedMapControls registerReset={registerReset} />
      </Canvas>

      {showResetButton && (
        <button type="button" onClick={resetView} className="scene-reset-btn" aria-label="Reset view">
          <RotateCcw size={15} />
          <span>Reset View</span>
        </button>
      )}

      <style>{`
        .scene-reset-btn {
          position: absolute;
          left: 16px;
          bottom: 16px;
          z-index: 6;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          min-height: 40px;
          padding: 0 14px;
          border-radius: 12px;
          border: 1px solid rgba(37,182,189,0.4);
          background: rgba(255,255,255,0.9);
          color: #14606a;
          font-size: 12px;
          font-weight: 700;
          box-shadow: 0 6px 18px rgba(30,50,60,0.16);
          backdrop-filter: blur(6px);
          transition: transform .15s ease, box-shadow .2s ease;
        }
        .scene-reset-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 24px rgba(30,50,60,0.22);
        }
        .scene-reset-btn:active { transform: translateY(0); }
      `}</style>
    </div>
  );
});

export default SharedExhibitionScene;
