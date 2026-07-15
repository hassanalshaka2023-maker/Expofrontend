import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Building2,
  CheckCircle,
  ChevronDown,
  HelpCircle,
  MapPin,
  MousePointer2,
  RefreshCw,
  Sparkles,
  XCircle,
} from "lucide-react";
import { webApi } from "../services/api";
import SharedExhibitionScene from "../components/exhibition/SharedExhibitionScene";
import BoothRatingSummary from "../components/BoothRatingSummary";
import Button from "../components/ui/Button";
import { BoothSkeleton, PanelSkeleton } from "../components/ui/Skeleton";

const spring = {
  type: "spring",
  stiffness: 280,
  damping: 27,
};

function AnimatedNumber({ value }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const from = displayValue;
    const to = Number(value) || 0;
    const startedAt = performance.now();
    const duration = 620;
    let frameId;

    const animate = (currentTime) => {
      const progress = Math.min((currentTime - startedAt) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.round(from + (to - from) * easedProgress));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [value]);

  return <>{displayValue.toLocaleString("en-US")}</>;
}

function BoothStatusBadge({ status, size = "sm" }) {
  const config = {
    Available: {
      text: "Available",
      className: "status-available",
    },
    Pending: {
      text: "Pending",
      className: "status-pending",
    },
    Reserved: {
      text: "Reserved",
      className: "status-reserved",
    },
  };

  const current = config[status] || config.Available;

  return (
    <span
      className={`booth-status ${current.className} ${
        size === "md" ? "booth-status-md" : ""
      }`}
    >
      <motion.span
        className="status-dot"
        animate={{ opacity: [1, 0.35, 1], scale: [1, 0.72, 1] }}
        transition={{ duration: 1.7, repeat: Infinity }}
      />
      {current.text}
    </span>
  );
}

function DecorativeParticles() {
  return (
    <div className="admin-particles" aria-hidden="true">
      {Array.from({ length: 20 }).map((_, index) => (
        <motion.span
          key={index}
          style={{
            "--particle-x": `${4 + ((index * 29) % 92)}%`,
            "--particle-y": `${6 + ((index * 43) % 84)}%`,
          }}
          animate={{
            y: [10, -15, 10],
            opacity: [0.06, 0.78, 0.06],
            scale: [0.68, 1.28, 0.68],
          }}
          transition={{
            duration: 4 + (index % 4),
            delay: (index % 7) * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function BoothDetailCard({ booth, onApprove, onReject, onClose }) {
  const details = booth.companyDetails || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96, filter: "blur(7px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -14, scale: 0.97, filter: "blur(4px)" }}
      transition={spring}
      className="booth-detail"
    >
      <div className="booth-detail-header">
        <div>
          <motion.h3
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 }}
          >
            <Building2 />
            Booth {booth.boothId}
          </motion.h3>

          <BoothStatusBadge status={booth.status} size="md" />
        </div>

        <motion.button
          type="button"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="detail-close"
        >
          ×
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        whileHover={{ y: -4 }}
        className="company-card"
      >
        <div className="company-orb company-orb-cyan" />
        <div className="company-orb company-orb-gold" />

        <motion.div
          className="company-shimmer"
          initial={{ x: "-140%" }}
          animate={{ x: "140%" }}
          transition={{ duration: 4.2, repeat: Infinity, repeatDelay: 2 }}
        />

        <div className="company-main">
          <motion.div
            whileHover={{ rotate: 4, scale: 1.05 }}
            className="company-icon"
          >
            <Building2 />
          </motion.div>

          <div className="company-copy">
            <span>Investor Company</span>
            <strong>{details.companyName || "—"}</strong>
          </div>
        </div>

        <div className="company-grid">
          <motion.div whileHover={{ y: -2 }} className="company-info-box">
            <span>Category</span>
            <strong>
              <Sparkles />
              {details.category || "Not specified"}
            </strong>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} className="company-info-box">
            <span>Location</span>
            <strong>
              <MapPin />
              Exhibition Hall
            </strong>
          </motion.div>
        </div>

        <div className="company-description">
          <span>Business Description</span>
          <p>{details.description || "No description available."}</p>
        </div>
      </motion.div>

      <BoothRatingSummary
        ratingSum={booth.ratingSum || 0}
        ratingCount={booth.ratingCount || 0}
      />

      {booth.status === "Pending" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="booth-actions"
        >
          <Button
            variant="success"
            onClick={() => onApprove(booth.boothId)}
            size="md"
            className="!rounded-xl"
          >
            <CheckCircle className="h-4 w-4" />
            Approve Reservation
          </Button>

          <Button
            variant="danger"
            onClick={() => onReject(booth.boothId)}
            size="md"
            className="!rounded-xl"
          >
            <XCircle className="h-4 w-4" />
            Reject Request
          </Button>
        </motion.div>
      )}

      {booth.status === "Available" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="status-message status-message-available"
        >
          This booth is available and waiting for investors.
        </motion.div>
      )}

      {booth.status === "Reserved" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="status-message status-message-reserved"
        >
          This booth is already reserved and cannot be modified.
        </motion.div>
      )}
    </motion.div>
  );
}

function StatCard({ type, label, value, icon, delay }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -6, scale: 1.025 }}
      className={`admin-stat-card admin-stat-${type}`}
    >
      <div className="admin-stat-glow" />
      <div className="admin-stat-shine" />

      <div className="admin-stat-icon">{icon}</div>

      <div className="admin-stat-copy">
        <span>{label}</span>
        <strong>
          <AnimatedNumber value={value} />
        </strong>
      </div>

      <div className="admin-stat-line">
        <span />
      </div>
    </motion.article>
  );
}

function MiniLegend() {
  const items = [
    { className: "legend-available", label: "Available" },
    { className: "legend-pending", label: "Pending" },
    { className: "legend-reserved", label: "Reserved" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.28 }}
      className="booth-legend"
    >
      {items.map((item, index) => (
        <div key={item.label}>
          <motion.span
            className={item.className}
            animate={{ opacity: [1, 0.42, 1], scale: [1, 0.76, 1] }}
            transition={{
              duration: 1.7,
              delay: index * 0.24,
              repeat: Infinity,
            }}
          />
          <small>{item.label}</small>
        </div>
      ))}
    </motion.div>
  );
}

export default function AdminBoothsManager() {
  const [booths, setBooths] = useState([]);
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);
  const [showStats, setShowStats] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let mounted = true;

    webApi
      .getBooths()
      .then((data) => {
        if (mounted) {
          setBooths(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setError("Failed to load booths.");
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const reloadData = useCallback(async () => {
    setRefreshing(true);

    try {
      const data = await webApi.getBooths();
      setBooths(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to refresh booths.");
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleAction = async (action, boothId) => {
    setActionLoading(boothId);

    try {
      if (action === "approve") {
        await webApi.approveBooth(boothId);
      } else {
        await webApi.rejectBooth(boothId);
      }

      setSelectedBooth(null);
      await reloadData();
    } catch (err) {
      setError(err.response?.data?.message || "The operation failed.");
    } finally {
      setActionLoading(null);
    }
  };

  const stats = useMemo(
    () => ({
      total: booths.length,
      available: booths.filter((booth) => booth.status === "Available").length,
      pending: booths.filter((booth) => booth.status === "Pending").length,
      reserved: booths.filter((booth) => booth.status === "Reserved").length,
    }),
    [booths],
  );

  // Latest full record for the selected booth (carries the live visitor-rating
  // totals; the click payload from the scene does not include them).
  const selectedFull =
    selectedBooth && booths.find((b) => b.boothId === selectedBooth.boothId);

  if (loading) {
    return (
      <div className="admin-loading-layout">
        <div className="admin-loading-canvas">
          <BoothSkeleton />
        </div>
        <div className="admin-loading-panel">
          <PanelSkeleton />
        </div>

        <style>{`
          .admin-loading-layout {
            width: 100%;
            min-height: 100vh;
            display: flex;
            background: var(--hx-bg, #eef4fb);
          }

          .admin-loading-canvas {
            flex: 1;
            min-width: 0;
          }

          .admin-loading-panel {
            width: 440px;
            border-left: 1px solid rgba(11, 147, 166, 0.2);
            background: #ffffff;
          }

          @media (max-width: 920px) {
            .admin-loading-layout {
              flex-direction: column;
            }

            .admin-loading-canvas {
              height: 50vh;
            }

            .admin-loading-panel {
              width: 100%;
              min-height: 420px;
              border-left: 0;
              border-top: 1px solid rgba(11, 147, 166, 0.2);
            }
          }
        `}</style>
      </div>
    );
  }

  if (error && booths.length === 0) {
    return (
      <div className="admin-error-page">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: "blur(7px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          className="admin-error-content"
        >
          <motion.div
            animate={{
              boxShadow: [
                "0 0 0 rgba(214,69,69,0)",
                "0 0 30px rgba(214,69,69,.2)",
                "0 0 0 rgba(214,69,69,0)",
              ],
            }}
            transition={{ duration: 2.4, repeat: Infinity }}
            className="admin-error-icon"
          >
            <HelpCircle />
          </motion.div>

          <h2>Something went wrong</h2>
          <p>{error}</p>

          <Button onClick={() => window.location.reload()} variant="primary">
            Try Again
          </Button>
        </motion.div>

        <style>{`
          .admin-error-page {
            width: 100%;
            min-height: 100vh;
            display: grid;
            place-items: center;
            padding: 32px;
            background: var(--hx-bg, #eef4fb);
            font-family: Inter, sans-serif;
          }

          .admin-error-content {
            max-width: 440px;
            text-align: center;
          }

          .admin-error-icon {
            width: 82px;
            height: 82px;
            margin: 0 auto 24px;
            display: grid;
            place-items: center;
            border: 1px solid rgba(214, 69, 69, 0.3);
            border-radius: 22px;
            color: #d64545;
            background: rgba(214, 69, 69, 0.08);
          }

          .admin-error-icon svg {
            width: 40px;
            height: 40px;
          }

          .admin-error-content h2 {
            margin: 0 0 10px;
            color: var(--hx-text, #0d2338);
          }

          .admin-error-content p {
            margin: 0 0 24px;
            color: var(--hx-muted, #55697d);
          }
        `}</style>
      </div>
    );
  }

  return (
    <section className="admin-booths-page" dir="ltr">
      <div className="admin-booths-background" aria-hidden="true">
        <div className="admin-grid-background" />
        <div className="admin-orb admin-orb-cyan" />
        <div className="admin-orb admin-orb-gold" />
        <DecorativeParticles />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.72, ease: [0.2, 0.8, 0.2, 1] }}
        className="booths-canvas-section"
      >
        <div className="canvas-wave-lines" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="canvas-toolbar">
          <motion.div
            initial={{ opacity: 0, x: -22, filter: "blur(5px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.14 }}
            className="canvas-info-card"
          >
            <motion.div
              className="canvas-info-shimmer"
              initial={{ x: "-140%" }}
              animate={{ x: "140%" }}
              transition={{ duration: 4.5, repeat: Infinity, repeatDelay: 2 }}
            />

            <strong>
              <MapPin />
              Interactive Booth Hall
            </strong>

            <p>
              <MousePointer2 />
              Drag to rotate · Click a booth to manage it
            </p>
          </motion.div>

          <MiniLegend />
        </div>

        <motion.button
          type="button"
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.96 }}
          onClick={reloadData}
          disabled={refreshing}
          className="canvas-refresh"
        >
          <span className="canvas-refresh-ring" />
          <RefreshCw className={refreshing ? "refreshing" : ""} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </motion.button>

        <AnimatePresence>
          {actionLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="action-loading-overlay"
            >
              <div className="action-loader">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <motion.span
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <Building2 />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Shared, identical exhibition scene (same one the Investor and public
            Visitor see). Admin business logic stays outside the scene. */}
        <SharedExhibitionScene
          mode="admin"
          booths={booths}
          exhibitionName="HOPEX EXPO"
          selectedBoothId={selectedBooth?.boothId}
          onSelectBooth={setSelectedBooth}
        />

        <motion.div
          className="canvas-bottom-light"
          animate={{ opacity: [0.25, 1, 0.25], scaleX: [0.4, 1, 0.4] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </motion.div>

      <motion.aside
        initial={{ opacity: 0, x: 30, filter: "blur(7px)" }}
        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.62, delay: 0.12 }}
        className="booths-control-panel"
      >
        <div className="panel-orb panel-orb-cyan" />
        <div className="panel-orb panel-orb-gold" />

        <header className="control-panel-header">
          <div className="panel-title-row">
            <h2>
              <Activity />
              Booth Control
            </h2>

            <motion.button
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setShowStats((value) => !value)}
              className="stats-toggle"
            >
              <ChevronDown className={showStats ? "expanded" : ""} />
            </motion.button>
          </div>

          <AnimatePresence initial={false}>
            {showStats && (
              <motion.div
                initial={{ height: 0, opacity: 0, y: -8 }}
                animate={{ height: "auto", opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -8 }}
                transition={{ duration: 0.36 }}
                className="admin-stats-grid"
              >
                <StatCard
                  type="cyan"
                  label="Total Booths"
                  value={stats.total}
                  icon={<Building2 />}
                  delay={0.05}
                />

                <StatCard
                  type="green"
                  label="Available"
                  value={stats.available}
                  icon={<span className="simple-stat-dot" />}
                  delay={0.11}
                />

                <StatCard
                  type="gold"
                  label="Pending"
                  value={stats.pending}
                  icon={<span className="simple-stat-dot" />}
                  delay={0.17}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        <div className="control-panel-content">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -8 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -8 }}
                className="admin-error-message"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {selectedBooth ? (
              <BoothDetailCard
                key={selectedBooth.boothId}
                booth={selectedFull || selectedBooth}
                onApprove={(id) => handleAction("approve", id)}
                onReject={(id) => handleAction("reject", id)}
                onClose={() => setSelectedBooth(null)}
              />
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 16, filter: "blur(5px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                className="admin-empty-state"
              >
                <div className="empty-booth-orbit">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 9,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />

                  <motion.span
                    animate={{ rotate: -360 }}
                    transition={{
                      duration: 13,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />

                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Building2 />
                  </motion.div>
                </div>

                <h3>Select a Booth</h3>

                <p>
                  Click any booth in the 3D map to review investor information
                  and approve or reject reservation requests.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <footer className="control-panel-footer">
          <span>{booths.length.toLocaleString("en-US")} booths</span>
          <span className="footer-separator" />
          <span>{stats.pending.toLocaleString("en-US")} pending approval</span>
        </footer>
      </motion.aside>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Montserrat:wght@400;500;600;700&display=swap');

        * {
          box-sizing: border-box;
        }

        .admin-booths-page {
          width: 100%;
          min-height: 100vh;
          position: relative;
          display: flex;
          overflow: hidden;
          color: var(--hx-text, #0d2338);
          background: var(--hx-bg, #eef4fb);
          font-family: 'Inter', sans-serif;
          isolation: isolate;
        }

        .admin-booths-background {
          position: fixed;
          inset: 0;
          z-index: -1;
          overflow: hidden;
          pointer-events: none;
        }

        .admin-grid-background {
          position: absolute;
          inset: 0;
          opacity: 0.5;
          background-image:
            linear-gradient(rgba(11,147,166,.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(11,147,166,.05) 1px, transparent 1px);
          background-size: 78px 78px;
          animation: adminGridMove 32s linear infinite;
        }

        .admin-orb,
        .panel-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(110px);
          pointer-events: none;
        }

        .admin-orb-cyan {
          width: 520px;
          height: 520px;
          right: -180px;
          top: 100px;
          opacity: .16;
          background: #17d9d4;
          animation: adminCyanOrb 15s ease-in-out infinite alternate;
        }

        .admin-orb-gold {
          width: 420px;
          height: 420px;
          left: -170px;
          bottom: -120px;
          opacity: .14;
          background: #e6be6a;
          animation: adminGoldOrb 13s ease-in-out infinite alternate;
        }

        .admin-particles {
          position: absolute;
          inset: 0;
        }

        .admin-particles span {
          position: absolute;
          left: var(--particle-x);
          top: var(--particle-y);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #d2aa55;
          box-shadow: 0 0 11px rgba(210,170,85,.6);
        }

        .booths-canvas-section {
          min-width: 0;
          height: 100vh;
          position: relative;
          flex: 1;
          overflow: hidden;
          background:
            radial-gradient(circle at 70% 20%, rgba(10, 162, 180, .1), transparent 35%),
            var(--hx-bg, #eef4fb);
        }

        .canvas-wave-lines {
          width: 68%;
          height: 140px;
          position: absolute;
          left: 18%;
          top: 100px;
          z-index: 1;
          pointer-events: none;
          opacity: .52;
        }

        .canvas-wave-lines span {
          position: absolute;
          width: 100%;
          height: 64px;
          border-top: 1px solid rgba(169,121,31,.26);
          border-radius: 50%;
          animation: adminLightLineMove 6s ease-in-out infinite;
        }

        .canvas-wave-lines span:nth-child(2) {
          top: 20px;
          opacity: .55;
          animation-delay: -1.2s;
        }

        .canvas-wave-lines span:nth-child(3) {
          top: 40px;
          opacity: .28;
          animation-delay: -2.4s;
        }

        .canvas-toolbar {
          position: absolute;
          left: 22px;
          top: 22px;
          z-index: 10;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .canvas-info-card {
          min-width: 300px;
          position: relative;
          overflow: hidden;
          padding: 16px 18px;
          border: 1px solid rgba(11,147,166,.3);
          border-radius: 18px;
          background:
            linear-gradient(145deg, rgba(255,255,255,.92), rgba(243,248,253,.88));
          backdrop-filter: blur(20px);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.9),
            0 18px 42px rgba(20,55,95,.12);
        }

        .canvas-info-shimmer,
        .company-shimmer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(120deg, transparent 20%, rgba(11,147,166,.06), transparent 70%);
        }

        .canvas-info-card strong {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 9px;
          color: var(--hx-text, #0d2338);
          font-size: 15px;
        }

        .canvas-info-card strong svg {
          width: 19px;
          height: 19px;
          color: var(--hx-cyan, #0b93a6);
        }

        .canvas-info-card p {
          margin: 8px 0 0;
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 7px;
          color: var(--hx-muted, #55697d);
          font-size: 11px;
        }

        .canvas-info-card p svg {
          width: 14px;
          height: 14px;
          color: #b0832e;
        }

        .booth-legend {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 11px 15px;
          border: 1px solid var(--hx-line, rgba(14,55,92,.12));
          border-radius: 15px;
          background: rgba(255,255,255,.88);
          backdrop-filter: blur(18px);
        }

        .booth-legend > div {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .booth-legend span {
          width: 9px;
          height: 9px;
          border-radius: 50%;
        }

        .booth-legend small {
          color: var(--hx-muted, #55697d);
          font-size: 10px;
        }

        .legend-available {
          background: #16d8a0;
          box-shadow: 0 0 10px rgba(22,216,160,.7);
        }

        .legend-pending {
          background: #e3a04f;
          box-shadow: 0 0 10px rgba(227,160,79,.7);
        }

        .legend-reserved {
          background: #ff7059;
          box-shadow: 0 0 10px rgba(255,112,89,.7);
        }

        .canvas-refresh {
          min-height: 52px;
          position: absolute;
          right: 22px;
          top: 22px;
          z-index: 10;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 0 20px;
          overflow: hidden;
          border: 1px solid rgba(210,170,85,.6);
          border-radius: 16px;
          color: var(--hx-navy, #0c3455);
          background:
            linear-gradient(145deg, #ffffff, #f3f8fd);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.9),
            0 14px 32px rgba(20,55,95,.12);
          font-weight: 700;
          cursor: pointer;
          transition: .35s ease;
        }

        .canvas-refresh:hover {
          border-color: rgba(169,121,31,.8);
          box-shadow:
            0 20px 38px rgba(20,55,95,.18),
            0 0 25px rgba(210,170,85,.2);
        }

        .canvas-refresh svg {
          width: 19px;
          height: 19px;
        }

        .canvas-refresh .refreshing {
          animation: adminSpin .75s linear infinite;
        }

        .canvas-refresh-ring {
          width: 64px;
          height: 64px;
          position: absolute;
          right: -22px;
          border: 1px solid transparent;
          border-top-color: rgba(178,134,45,.5);
          border-radius: 50%;
          animation: adminSpin 7s linear infinite;
        }

        .action-loading-overlay {
          position: absolute;
          inset: 0;
          z-index: 20;
          display: grid;
          place-items: center;
          background: rgba(238,244,251,.72);
          backdrop-filter: blur(8px);
        }

        .action-loader {
          width: 98px;
          height: 98px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .action-loader span {
          position: absolute;
          inset: 0;
          border: 1px solid transparent;
          border-top-color: #0aa2b4;
          border-right-color: rgba(178,134,45,.55);
          border-radius: 50%;
        }

        .action-loader span:nth-child(2) {
          inset: 17px;
          border-top-color: transparent;
          border-right-color: transparent;
          border-bottom-color: rgba(10,162,180,.7);
          border-left-color: #b0832e;
        }

        .action-loader svg {
          width: 30px;
          height: 30px;
          color: #0aa2b4;
        }

        .canvas-bottom-light {
          height: 1px;
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 5;
          background:
            linear-gradient(90deg, transparent, rgba(10,162,180,.65), rgba(210,170,85,.55), transparent);
        }

        .booths-control-panel {
          width: 440px;
          height: 100vh;
          position: relative;
          display: flex;
          flex: 0 0 auto;
          flex-direction: column;
          overflow: hidden;
          border-left: 1px solid var(--hx-line, rgba(14,55,92,.12));
          background:
            linear-gradient(180deg, rgba(255,255,255,.96), rgba(243,248,253,.98));
          backdrop-filter: blur(24px);
          box-shadow: -22px 0 50px rgba(20,55,95,.1);
        }

        .panel-orb-cyan {
          width: 240px;
          height: 240px;
          right: -90px;
          top: -80px;
          opacity: .14;
          background: #17d9d4;
        }

        .panel-orb-gold {
          width: 220px;
          height: 220px;
          left: -90px;
          bottom: -90px;
          opacity: .12;
          background: #e6be6a;
        }

        .control-panel-header {
          position: relative;
          z-index: 2;
          padding: 24px;
          border-bottom: 1px solid var(--hx-line-soft, rgba(14,55,92,.07));
        }

        .panel-title-row {
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .panel-title-row h2 {
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--hx-text, #0d2338);
          font-size: 18px;
        }

        .panel-title-row h2 svg {
          width: 20px;
          height: 20px;
          color: var(--hx-cyan, #0b93a6);
        }

        .stats-toggle {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border: 1px solid var(--hx-line, rgba(14,55,92,.12));
          border-radius: 13px;
          color: var(--hx-muted, #55697d);
          background: var(--hx-panel-strong, #ffffff);
          cursor: pointer;
          transition: .3s ease;
        }

        .stats-toggle:hover {
          color: var(--hx-text, #0d2338);
          border-color: rgba(11,147,166,.35);
        }

        .stats-toggle svg {
          width: 18px;
          height: 18px;
          transition: transform .3s ease;
        }

        .stats-toggle svg.expanded {
          transform: rotate(180deg);
        }

        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          overflow: hidden;
        }

        .admin-stat-card {
          --stat-color: #0b93a6;
          --stat-rgb: 11,147,166;
          min-width: 0;
          min-height: 118px;
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          overflow: hidden;
          padding: 15px 12px 22px;
          border: 1px solid rgba(var(--stat-rgb),.3);
          border-radius: 16px;
          background:
            linear-gradient(145deg, #ffffff, #f3f8fd);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.9),
            0 14px 30px rgba(20,55,95,.08);
          transition: .35s ease;
        }

        .admin-stat-card:hover {
          border-color: rgba(var(--stat-rgb),.6);
          box-shadow:
            0 20px 35px rgba(20,55,95,.14),
            0 0 24px rgba(var(--stat-rgb),.12);
        }

        .admin-stat-green {
          --stat-color: #0f9d76;
          --stat-rgb: 15,157,118;
        }

        .admin-stat-gold {
          --stat-color: #b0832e;
          --stat-rgb: 176,131,46;
        }

        .admin-stat-glow {
          width: 110px;
          height: 110px;
          position: absolute;
          left: -65px;
          top: -65px;
          border-radius: 50%;
          background: rgba(var(--stat-rgb),.13);
          filter: blur(35px);
        }

        .admin-stat-shine {
          position: absolute;
          inset: 0;
          opacity: 0;
          background:
            linear-gradient(120deg, transparent 20%, rgba(var(--stat-rgb),.08), transparent 70%);
          transform: translateX(-120%);
        }

        .admin-stat-card:hover .admin-stat-shine {
          opacity: 1;
          animation: adminShine .9s ease;
        }

        .admin-stat-icon {
          width: 40px;
          height: 40px;
          position: relative;
          z-index: 2;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          border: 1px solid rgba(var(--stat-rgb),.3);
          border-radius: 12px;
          color: var(--stat-color);
          background: rgba(var(--stat-rgb),.1);
        }

        .admin-stat-icon svg {
          width: 20px;
          height: 20px;
        }

        .admin-stat-copy {
          min-width: 0;
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .admin-stat-copy span {
          color: var(--hx-muted-strong, #3c516a);
          font-size: 9px;
          font-weight: 700;
          line-height: 1.3;
          text-transform: uppercase;
        }

        .admin-stat-copy strong {
          color: var(--hx-text, #0d2338);
          font-size: 22px;
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }

        .simple-stat-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: currentColor;
          box-shadow: 0 0 12px currentColor;
        }

        .admin-stat-line {
          height: 1px;
          position: absolute;
          left: 12px;
          right: 12px;
          bottom: 12px;
          background:
            linear-gradient(90deg, transparent, rgba(var(--stat-rgb),.35), transparent);
        }

        .admin-stat-line span {
          width: 7px;
          height: 7px;
          position: absolute;
          top: -3px;
          border-radius: 50%;
          background: var(--stat-color);
          box-shadow: 0 0 12px rgba(var(--stat-rgb),.8);
          animation: adminScanMove 4s ease-in-out infinite;
        }

        .control-panel-content {
          position: relative;
          z-index: 2;
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          scrollbar-width: thin;
          scrollbar-color: rgba(10,162,180,.4) rgba(13,35,56,.05);
        }

        .control-panel-content::-webkit-scrollbar {
          width: 7px;
        }

        .control-panel-content::-webkit-scrollbar-track {
          background: rgba(13,35,56,.05);
        }

        .control-panel-content::-webkit-scrollbar-thumb {
          border-radius: 999px;
          background:
            linear-gradient(180deg, rgba(10,162,180,.45), rgba(210,170,85,.4));
        }

        .admin-error-message {
          margin-bottom: 18px;
          padding: 13px;
          border: 1px solid rgba(214,69,69,.3);
          border-radius: 13px;
          color: #b4372a;
          background: rgba(214,69,69,.08);
          text-align: center;
          font-size: 12px;
        }

        .booth-detail {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .booth-detail-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .booth-detail-header h3 {
          margin: 0 0 10px;
          display: flex;
          align-items: center;
          gap: 9px;
          color: var(--hx-text, #0d2338);
          font-size: 18px;
        }

        .booth-detail-header h3 svg {
          width: 20px;
          height: 20px;
          color: var(--hx-cyan, #0b93a6);
        }

        .detail-close {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border: 1px solid var(--hx-line, rgba(14,55,92,.12));
          border-radius: 50%;
          color: var(--hx-muted, #55697d);
          background: var(--hx-panel-strong, #ffffff);
          font-size: 20px;
          cursor: pointer;
          transition: .3s ease;
        }

        .detail-close:hover {
          color: var(--hx-text, #0d2338);
          border-color: rgba(11,147,166,.35);
        }

        .booth-status {
          width: fit-content;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 11px;
          border: 1px solid;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 700;
        }

        .booth-status-md {
          padding: 7px 13px;
          font-size: 11px;
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: currentColor;
          box-shadow: 0 0 10px currentColor;
        }

        .status-available {
          color: #067a53;
          border-color: rgba(15,157,118,.3);
          background: rgba(15,157,118,.1);
        }

        .status-pending {
          color: #a9791f;
          border-color: rgba(169,121,31,.3);
          background: rgba(210,170,85,.14);
        }

        .status-reserved {
          color: #b4372a;
          border-color: rgba(214,69,69,.28);
          background: rgba(214,69,69,.08);
        }

        .company-card {
          position: relative;
          overflow: hidden;
          padding: 20px;
          border: 1px solid rgba(11,147,166,.25);
          border-radius: 20px;
          background:
            linear-gradient(145deg, #ffffff, #f3f8fd);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.9),
            0 18px 40px rgba(20,55,95,.1);
        }

        .company-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
          pointer-events: none;
        }

        .company-orb-cyan {
          width: 130px;
          height: 130px;
          right: -55px;
          top: -55px;
          background: rgba(23,217,212,.14);
        }

        .company-orb-gold {
          width: 120px;
          height: 120px;
          left: -55px;
          bottom: -55px;
          background: rgba(210,170,85,.12);
        }

        .company-main {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .company-icon {
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          border: 1px solid rgba(11,147,166,.3);
          border-radius: 15px;
          color: var(--hx-cyan, #0b93a6);
          background:
            linear-gradient(145deg, rgba(23,217,212,.14), rgba(210,170,85,.08));
        }

        .company-icon svg {
          width: 25px;
          height: 25px;
        }

        .company-copy {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .company-copy span,
        .company-info-box > span,
        .company-description > span {
          color: var(--hx-gold, #a9791f);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
        }

        .company-copy strong {
          overflow: hidden;
          color: var(--hx-text, #0d2338);
          font-size: 16px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .company-grid {
          position: relative;
          z-index: 2;
          margin-top: 16px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 11px;
        }

        .company-info-box {
          padding: 13px;
          border: 1px solid var(--hx-line-soft, rgba(14,55,92,.07));
          border-radius: 13px;
          background: rgba(13,35,56,.03);
        }

        .company-info-box strong {
          margin-top: 7px;
          display: flex;
          align-items: center;
          gap: 7px;
          color: #33475a;
          font-size: 11px;
        }

        .company-info-box strong svg {
          width: 13px;
          height: 13px;
          color: var(--hx-cyan, #0b93a6);
        }

        .company-description {
          position: relative;
          z-index: 2;
          margin-top: 11px;
          padding: 13px;
          border: 1px solid var(--hx-line-soft, rgba(14,55,92,.07));
          border-radius: 13px;
          background: rgba(13,35,56,.04);
        }

        .company-description p {
          margin: 8px 0 0;
          color: var(--hx-muted, #55697d);
          font-size: 12px;
          line-height: 1.65;
        }

        .booth-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .status-message {
          padding: 15px;
          border: 1px solid;
          border-radius: 13px;
          text-align: center;
          font-size: 12px;
          font-weight: 700;
        }

        .status-message-available {
          color: #067a53;
          border-color: rgba(15,157,118,.25);
          background: rgba(15,157,118,.08);
        }

        .status-message-reserved {
          color: #b4372a;
          border-color: rgba(214,69,69,.22);
          background: rgba(214,69,69,.06);
        }

        .admin-empty-state {
          min-height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 10px;
          text-align: center;
        }

        .empty-booth-orbit {
          width: 108px;
          height: 108px;
          position: relative;
          display: grid;
          place-items: center;
          margin-bottom: 26px;
        }

        .empty-booth-orbit > span {
          position: absolute;
          inset: 0;
          border: 1px solid transparent;
          border-top-color: #0aa2b4;
          border-right-color: rgba(178,134,45,.45);
          border-radius: 50%;
        }

        .empty-booth-orbit > span:nth-child(2) {
          inset: 15px;
          border-top-color: transparent;
          border-right-color: transparent;
          border-bottom-color: rgba(10,162,180,.5);
          border-left-color: #b0832e;
        }

        .empty-booth-orbit > div {
          width: 66px;
          height: 66px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(11,147,166,.3);
          border-radius: 19px;
          color: var(--hx-cyan, #0b93a6);
          background:
            linear-gradient(145deg, rgba(23,217,212,.12), rgba(210,170,85,.07));
          box-shadow: 0 0 28px rgba(23,217,212,.12);
        }

        .empty-booth-orbit svg {
          width: 36px;
          height: 36px;
        }

        .admin-empty-state h3 {
          margin: 0 0 10px;
          color: var(--hx-text, #0d2338);
          font-size: 17px;
        }

        .admin-empty-state p {
          max-width: 310px;
          margin: 0;
          color: #7a8ea0;
          font-size: 12px;
          line-height: 1.65;
        }

        .control-panel-footer {
          min-height: 54px;
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border-top: 1px solid var(--hx-line-soft, rgba(14,55,92,.07));
          color: rgba(85,105,125,.7);
          font-size: 10px;
        }

        .footer-separator {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #d2aa55;
          box-shadow: 0 0 8px rgba(210,170,85,.6);
        }

        @keyframes adminGridMove {
          to { transform: translate(78px, 78px); }
        }

        @keyframes adminCyanOrb {
          to { transform: translate(-80px, 70px) scale(1.13); }
        }

        @keyframes adminGoldOrb {
          to { transform: translate(90px, -70px) scale(1.1); }
        }

        @keyframes adminLightLineMove {
          0%,100% { transform: translateX(-3%) scaleX(.97); opacity: .3; }
          50% { transform: translateX(3%) scaleX(1.04); opacity: 1; }
        }

        @keyframes adminSpin {
          to { transform: rotate(360deg); }
        }

        @keyframes adminShine {
          to { transform: translateX(120%); }
        }

        @keyframes adminScanMove {
          0%,100% { left: 0; opacity: .35; }
          50% { left: calc(100% - 7px); opacity: 1; }
        }

        @media (max-width: 1180px) {
          .booths-control-panel {
            width: 400px;
          }

          .admin-stats-grid {
            grid-template-columns: 1fr;
          }

          .admin-stat-card {
            min-height: 78px;
          }
        }

        @media (max-width: 920px) {
          .admin-booths-page {
            flex-direction: column;
            overflow: visible;
          }

          .booths-canvas-section {
            width: 100%;
            height: 52vh;
            min-height: 480px;
            flex: none;
          }

          .booths-control-panel {
            width: 100%;
            height: auto;
            min-height: 560px;
            border-top: 1px solid var(--hx-line, rgba(14,55,92,.12));
            border-left: 0;
          }

          .admin-stats-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 650px) {
          .booths-canvas-section {
            min-height: 540px;
          }

          .canvas-toolbar {
            left: 14px;
            right: 14px;
            top: 14px;
          }

          .canvas-info-card {
            min-width: 0;
            width: calc(100vw - 28px);
          }

          .booth-legend {
            width: fit-content;
            max-width: 100%;
            gap: 10px;
          }

          .canvas-refresh {
            right: 14px;
            top: 174px;
          }

          .control-panel-header,
          .control-panel-content {
            padding: 18px;
          }

          .admin-stats-grid {
            grid-template-columns: 1fr;
          }

          .company-grid,
          .booth-actions {
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: .001ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </section>
  );
}
