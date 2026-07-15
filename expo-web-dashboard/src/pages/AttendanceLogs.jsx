import { useEffect, useMemo, useRef, useState } from "react";
import { webApi } from "../services/api";

const RefreshIcon = ({ spinning = false }) => (
  <svg
    className={spinning ? "spinning" : ""}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path d="M20 7v5h-5" />
    <path d="M4 17v-5h5" />
    <path d="M6.1 9a7 7 0 0 1 11.5-2.5L20 9M4 15l2.4 2.5A7 7 0 0 0 17.9 15" />
  </svg>
);

const DocumentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6M8 13h8M8 17h6" />
  </svg>
);

const EnterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <path d="m10 17 5-5-5-5M15 12H3" />
  </svg>
);

const ExitIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="m16 17 5-5-5-5M21 12H9" />
  </svg>
);

const TableIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="4" y="4" width="14" height="16" rx="2" />
    <path d="M8 2h12v16M8 8h6M8 12h6" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

function AnimatedNumber({ value }) {
  const [displayValue, setDisplayValue] = useState(0);
  const previousValue = useRef(0);

  useEffect(() => {
    const from = previousValue.current;
    const to = Number(value) || 0;
    const startedAt = performance.now();
    // Reduced motion: the real final value lands on the very first frame.
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? 1
      : 620;
    let frameId;

    const animate = (currentTime) => {
      const progress = Math.min((currentTime - startedAt) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.round(from + (to - from) * easedProgress));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        previousValue.current = to;
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [value]);

  return <>{displayValue.toLocaleString("en-US")}</>;
}

function MetricCard({ type, icon, title, value, badge, children, delay }) {
  return (
    <article
      className={`metric-card metric-card-${type}`}
      style={{ "--card-delay": `${delay}ms` }}
    >
      <div className="metric-card-glow" />
      <div className="metric-card-shine" />

      <div className="metric-icon">{icon}</div>

      <div className="metric-content">
        <span className="metric-title">{title}</span>
        <strong className="metric-number">{value}</strong>
      </div>

      {badge && <span className="metric-badge">{badge}</span>}
      {children}

      <div className="metric-line">
        <span />
      </div>
    </article>
  );
}

export default function AttendanceLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [lastSync, setLastSync] = useState(null);

  const updateLogs = async ({ manual = false } = {}) => {
    if (manual) setRefreshing(true);

    try {
      const response = await webApi.getAttendanceLogs();
      setLogs(Array.isArray(response) ? response : []);
      setLastSync(new Date());
      setSecondsLeft(10);
    } catch (error) {
      console.error("Failed to fetch attendance logs:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const fetchInitialData = async () => {
      try {
        const response = await webApi.getAttendanceLogs();

        if (mounted) {
          setLogs(Array.isArray(response) ? response : []);
          setLastSync(new Date());
          setSecondsLeft(10);
        }
      } catch (error) {
        console.error("Failed to fetch attendance logs:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchInitialData();
    const refreshInterval = setInterval(fetchInitialData, 10000);

    return () => {
      mounted = false;
      clearInterval(refreshInterval);
    };
  }, []);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setSecondsLeft((currentValue) =>
        currentValue <= 1 ? 10 : currentValue - 1,
      );
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  const totalActions = logs.length;

  const totalCheckIns = useMemo(
    () => logs.filter((log) => log.actionType === "check-in").length,
    [logs],
  );

  const totalCheckOuts = totalActions - totalCheckIns;

  const formattedSyncTime = lastSync
    ? lastSync.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    : "--:--:--";

  if (loading) {
    return (
      <div className="attendance-loader">
        <div className="loader-rings">
          <span />
          <span />
          <span />
          <DocumentIcon />
        </div>
        <p>Synchronizing attendance records...</p>

        <style>{`
          .attendance-loader {
            min-height: 620px;
            display: grid;
            place-content: center;
            justify-items: center;
            gap: 20px;
            color: var(--hx-muted, #55697d);
            font-family: 'Inter', sans-serif;
            background: var(--hx-bg, #eef4fb);
          }

          .loader-rings {
            width: 115px;
            height: 115px;
            position: relative;
            display: grid;
            place-items: center;
          }

          .loader-rings > span {
            position: absolute;
            inset: 0;
            border-radius: 50%;
            border: 1px solid transparent;
            border-top-color: #0aa2b4;
            border-right-color: rgba(178,134,45,.5);
            animation: loaderSpin 2.2s linear infinite;
          }

          .loader-rings > span:nth-child(2) {
            inset: 13px;
            animation-duration: 1.6s;
            animation-direction: reverse;
          }

          .loader-rings > span:nth-child(3) {
            inset: 27px;
            animation-duration: 1.1s;
          }

          .loader-rings svg {
            width: 34px;
            height: 34px;
            stroke: #0aa2b4;
            stroke-width: 1.5;
          }

          @keyframes loaderSpin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <section className="attendance-page">
      <div className="hero-section">
        <div className="hero-copy">
          <div className="hero-decoration">
            <span className="hero-diamond" />
            <span className="hero-line" />
          </div>

          <h1>
            <span>Attendance</span>
            <em>Hub</em>
          </h1>

          <p>Real-time monitoring &amp; logs</p>
        </div>

        <div className="hero-light-lines" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        {/* Decorative cinematic exhibition panel (visual only, wide screens) */}
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-visual-frame">
            <img
              src="/assets/exhibition-hub.jpg"
              alt=""
              loading="lazy"
              draggable="false"
            />
            <span className="hero-visual-sweep" />
          </div>
          <span className="hero-visual-halo" />
          <span className="hero-visual-base" />
        </div>

        <div className="hero-controls">
          <div className="live-sync-block">
            <div className="live-sync-pill">
              <span className="live-orbit" />
              <span className="live-dot" />
              
              <strong>Live Sync</strong>
            </div>

            <div className="sync-time">
              <strong>{formattedSyncTime}</strong>
            </div>
          </div>

          <div className="refresh-control">
            <span className="refresh-ring refresh-ring-one" />
            <span className="refresh-ring refresh-ring-two" />
            <span className="refresh-spark spark-one" />
            <span className="refresh-spark spark-two" />

            <button
              type="button"
              className="refresh-button"
              onClick={() => updateLogs({ manual: true })}
              disabled={refreshing}
            >
              <RefreshIcon spinning={refreshing} />
              <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="metrics-grid">
        <MetricCard
          type="cyan"
          icon={<DocumentIcon />}
          title="Total Actions Today"
          value={<AnimatedNumber value={totalActions} />}
          badge={`↑ ${totalActions === 0 ? 0 : Math.min(totalActions * 2, 99)}%`}
          delay={60}
        />

        <MetricCard
          type="green"
          icon={<EnterIcon />}
          title="Check-ins"
          value={<AnimatedNumber value={totalCheckIns} />}
          delay={125}
        />

        <MetricCard
          type="coral"
          icon={<ExitIcon />}
          title="Check-outs"
          value={<AnimatedNumber value={totalCheckOuts} />}
          delay={190}
        />

        <MetricCard
          type="gold"
          icon={
            <div className="live-icon">
              <span />
              <strong>LIVE</strong>
            </div>
          }
          title="Auto-refresh"
          value={`${secondsLeft}s`}
          delay={255}
        >
          <div
            className="countdown-ring"
            style={{ "--countdown-angle": `${secondsLeft * 36}deg` }}
          >
            <span />
          </div>
        </MetricCard>
      </div>

      <div className="records-panel">
        <div className="records-header">
          <div>
            <span className="records-title-icon">
              <TableIcon />
            </span>
            <h2>Attendance Records</h2>
          </div>

          <span className="records-count">
            {logs.length.toLocaleString("en-US")} entries
          </span>
        </div>

        <div className="table-wrapper">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Email</th>
                <th>Action</th>
                <th>Timestamp</th>
              </tr>
            </thead>

            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="empty-cell">
                    <div className="empty-state">
                      <div className="empty-particles" aria-hidden="true">
                        {Array.from({ length: 16 }).map((_, index) => (
                          <span
                            key={index}
                            style={{
                              "--particle-x": `${12 + ((index * 19) % 76)}%`,
                              "--particle-y": `${8 + ((index * 31) % 72)}%`,
                              "--particle-delay": `${(index % 7) * -0.5}s`,
                            }}
                          />
                        ))}
                      </div>

                      <div className="empty-document">
                        <DocumentIcon />
                        <span />
                      </div>

                      <h3>No attendance records found for today.</h3>
                      <p>
                        Records will appear here once employees scan their QR
                        codes.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log, index) => {
                  const isCheckIn = log.actionType === "check-in";

                  return (
                    <tr
                      key={log._id || `${log.timestamp}-${index}`}
                      className="record-row"
                      style={{ "--row-delay": `${index * 50}ms` }}
                    >
                      <td>
                        <div className="employee-cell">
                          <span className="employee-avatar">
                            {log.staffId?.name?.charAt(0)?.toUpperCase() || "?"}
                          </span>
                          <strong>
                            {log.staffId?.name || "Unknown employee"}
                          </strong>
                        </div>
                      </td>

                      <td className="email-cell">
                        {log.staffId?.email || "---"}
                      </td>

                      <td>
                        <span
                          className={`action-badge ${
                            isCheckIn ? "check-in" : "check-out"
                          }`}
                        >
                          <span />
                          {isCheckIn ? "Check-in" : "Check-out"}
                        </span>
                      </td>

                      <td>
                        <span className="timestamp-cell">
                          <ClockIcon />
                          {log.timestamp
                            ? new Date(log.timestamp).toLocaleString("en-US", {
                                hour12: true,
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              })
                            : "---"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .attendance-page {
          position: relative;
          padding: 48px 0 10px;
          color: var(--hx-text, #0d2338);
          font-family: 'Inter', sans-serif;
          background:
            radial-gradient(circle at 14% 8%, rgba(10,162,180,.07), transparent 30%),
            radial-gradient(circle at 90% 20%, rgba(210,170,85,.05), transparent 26%),
            var(--hx-bg, #eef4fb);
        }

        .hero-section {
          min-height: 196px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 34px;
          overflow: hidden;
          animation: heroEnter .82s ease both;
        }

        .hero-copy {
          position: relative;
          z-index: 3;
          min-width: 530px;
        }

        .hero-decoration {
          margin-bottom: 22px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .hero-diamond {
          width: 9px;
          height: 9px;
          transform: rotate(45deg);
          background: #d2aa55;
          box-shadow: 0 0 12px rgba(210,170,85,.5);
        }

        .hero-line {
          width: 74px;
          height: 1px;
          background: linear-gradient(90deg, #d2aa55, transparent);
        }

        .hero-copy h1 {
          margin: 0;
          display: flex;
          align-items: baseline;
          gap: 16px;
          font-family: 'Montserrat', 'Inter', sans-serif;
          font-size: clamp(46px, 5vw, 72px);
          font-weight: 500;
          line-height: .98;
          text-transform: uppercase;
          letter-spacing: .015em;
        }

        .hero-copy h1 span {
          color: var(--hx-text, #0d2338);
          animation: heroWordIn .75s var(--hx-ease, cubic-bezier(.16,1,.3,1)) .12s both;
        }

        .hero-copy h1 em {
          font-style: normal;
          font-weight: 600;
          color: #0b93a6;
          background: linear-gradient(105deg, #0b93a6 30%, #17d9d4 50%, #0b93a6 70%);
          background-size: 240% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 28px rgba(23,217,212,.22);
          animation:
            heroWordIn .75s var(--hx-ease, cubic-bezier(.16,1,.3,1)) .26s both,
            heroEmSheen 1.6s ease-in-out 1.05s both;
        }

        @keyframes heroWordIn {
          from { opacity: 0; transform: translateY(26px); filter: blur(6px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }

        @keyframes heroEmSheen {
          from { background-position: 130% 0; }
          to { background-position: 0% 0; }
        }

        .hero-copy p {
          margin: 24px 0 0;
          padding-left: 224px;
          color: var(--hx-muted, #55697d);
          font-size: 18px;
          animation: heroEnter .7s ease .38s both;
        }

        .hero-decoration {
          transform-origin: left center;
          animation: heroDecoIn .6s var(--hx-ease, cubic-bezier(.16,1,.3,1)) .05s both;
        }

        @keyframes heroDecoIn {
          from { opacity: 0; transform: scaleX(.35); }
          to { opacity: 1; transform: scaleX(1); }
        }

        .hero-light-lines {
          position: absolute;
          left: 28%;
          top: 38px;
          width: 64%;
          height: 130px;
          pointer-events: none;
          opacity: .58;
        }

        .hero-light-lines span {
          position: absolute;
          width: 100%;
          height: 62px;
          border-top: 1px solid rgba(169,121,31,.26);
          border-radius: 50%;
          animation: lightLineMove 6s ease-in-out infinite;
        }

        .hero-light-lines span:nth-child(2) {
          top: 20px;
          opacity: .55;
          animation-delay: -1.2s;
        }

        .hero-light-lines span:nth-child(3) {
          top: 40px;
          opacity: .28;
          animation-delay: -2.4s;
        }

        /* --- Cinematic exhibition image panel (decorative, wide screens) --- */
        .hero-visual {
          display: none;
          position: absolute;
          z-index: 2;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -52%);
          width: 358px;
          pointer-events: none;
        }

        .hero-visual-frame {
          position: relative;
          overflow: hidden;
          border-radius: 18px;
          aspect-ratio: 21 / 9;
          border: 1px solid rgba(11,147,166,.3);
          background: #dfeaf4;
          box-shadow:
            0 26px 54px rgba(20,55,95,.18),
            inset 0 1px 0 rgba(255,255,255,.7);
          animation:
            heroVisualIn 1s var(--hx-ease, cubic-bezier(.16,1,.3,1)) .45s both,
            heroVisualFloat 9s ease-in-out 3s infinite;
        }

        /* Light integration overlay: HOPEX tint + white edge fade so the
           photo merges with the bright report header (static, no motion). */
        .hero-visual-frame::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          background:
            var(--hx-image-tint, linear-gradient(160deg, rgba(23,217,212,.12), rgba(124,92,255,.07) 45%, rgba(255,255,255,0) 62%)),
            var(--hx-image-overlay, linear-gradient(180deg, rgba(255,255,255,0) 48%, rgba(238,244,251,.55) 84%, rgba(238,244,251,.85) 100%));
        }

        @keyframes heroVisualIn {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(.96);
            clip-path: inset(10% 88% 10% 0 round 18px);
          }
          55% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            clip-path: inset(0 0 0 0 round 18px);
          }
        }

        @keyframes heroVisualFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .hero-visual-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          animation: heroVisualSettle 2.2s var(--hx-ease-soft, cubic-bezier(.2,.8,.2,1)) .5s both;
        }

        @keyframes heroVisualSettle {
          from { transform: scale(1.12); filter: brightness(1.05); }
          to { transform: scale(1); filter: brightness(1); }
        }

        .hero-visual-sweep {
          position: absolute;
          inset: 0;
          z-index: 3;
          background:
            linear-gradient(115deg, transparent 32%, rgba(255,255,255,.42) 49%, rgba(23,217,212,.16) 56%, transparent 72%);
          transform: translateX(-130%) skewX(-8deg);
          animation: heroVisualSweep 1.15s ease-in-out 1.5s both;
        }

        @keyframes heroVisualSweep {
          from { transform: translateX(-130%) skewX(-8deg); }
          to { transform: translateX(130%) skewX(-8deg); }
        }

        .hero-visual-halo {
          position: absolute;
          inset: -26px -30px;
          border-radius: 40px;
          background:
            radial-gradient(60% 75% at 50% 55%, rgba(23,217,212,.26), rgba(210,170,85,.12) 55%, transparent 78%);
          filter: blur(16px);
          opacity: 0;
          animation: heroVisualHalo 2.6s ease-in-out 1.6s both;
        }

        @keyframes heroVisualHalo {
          0% { opacity: 0; }
          35% { opacity: 1; }
          100% { opacity: .26; }
        }

        .hero-visual-base {
          position: absolute;
          left: 50%;
          bottom: -14px;
          width: 74%;
          height: 2px;
          transform: translateX(-50%);
          border-radius: 999px;
          background:
            linear-gradient(90deg, transparent, rgba(10,162,180,.65), rgba(210,170,85,.55), transparent);
          box-shadow: 0 0 14px rgba(23,217,212,.28);
          animation: heroVisualBase .9s var(--hx-ease, cubic-bezier(.16,1,.3,1)) 1.35s both;
        }

        @keyframes heroVisualBase {
          from { opacity: 0; transform: translateX(-50%) scaleX(.3); }
          to { opacity: 1; transform: translateX(-50%) scaleX(1); }
        }

        @media (min-width: 1500px) {
          .hero-visual {
            display: block;
          }
        }

        .hero-controls {
          position: relative;
          z-index: 4;
          display: flex;
          align-items: center;
          gap: 46px;
        }

        .live-sync-block {
          min-width: 180px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .live-sync-pill {
          min-width: 174px;
          min-height: 58px;
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 11px;
          border: 1px solid rgba(11,147,166,.35);
          border-radius: 999px;
          color: var(--hx-cyan, #0b93a6);
          background: rgba(255,255,255,.85);
          text-transform: uppercase;
          box-shadow: inset 0 0 20px rgba(23,217,212,.06), 0 10px 26px rgba(20,55,95,.08);
        }

        .live-sync-pill strong {
          font-size: 13px;
          letter-spacing: .04em;
        }

        .live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #0aa2b4;
          box-shadow: 0 0 14px rgba(23,217,212,.6);
          animation: livePulse 1.5s ease-in-out infinite;
        }

        .live-orbit {
          position: absolute;
          left: -11px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 1px solid transparent;
          border-top-color: rgba(10,162,180,.6);
          border-bottom-color: rgba(10,162,180,.2);
          animation: spin 3.3s linear infinite;
        }

        .sync-time {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .sync-time span {
          color: rgba(85,105,125,.75);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: .08em;
        }

        .sync-time strong {
          color: var(--hx-gold, #a9791f);
          font-size: 18px;
          font-weight: 750;
          letter-spacing: .055em;
          font-variant-numeric: tabular-nums;
          text-shadow: 0 0 15px rgba(210,170,85,.3);
        }

        .refresh-control {
          width: 205px;
          height: 120px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .refresh-button {
          min-width: 180px;
          min-height: 74px;
          position: relative;
          z-index: 3;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 13px;
          border: 1px solid rgba(210,170,85,.6);
          border-radius: 21px;
          color: var(--hx-navy, #0c3455);
          background: linear-gradient(145deg, #ffffff, #f3f8fd);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.9),
            0 16px 35px rgba(20,55,95,.12);
          font-size: 18px;
          font-weight: 650;
          cursor: pointer;
          transition: .35s ease;
        }

        .refresh-button:hover {
          transform: translateY(-3px);
          border-color: rgba(169,121,31,.8);
          box-shadow: 0 21px 42px rgba(20,55,95,.18), 0 0 26px rgba(210,170,85,.2);
        }

        .refresh-button:active:not(:disabled) {
          transform: translateY(-1px) scale(.97);
        }

        .refresh-button svg {
          width: 27px;
          height: 27px;
          stroke: currentColor;
          stroke-width: 1.9;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .refresh-button svg.spinning {
          animation: spin .75s linear infinite;
        }

        .refresh-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid transparent;
          pointer-events: none;
        }

        .refresh-ring-one {
          width: 112px;
          height: 112px;
          right: 0;
          border-top-color: rgba(178,134,45,.45);
          border-right-color: rgba(178,134,45,.14);
          animation: spin 8s linear infinite;
        }

        .refresh-ring-two {
          width: 142px;
          height: 142px;
          right: -15px;
          border-left-color: rgba(10,162,180,.3);
          border-bottom-color: rgba(210,170,85,.35);
          animation: spin 13s linear infinite reverse;
        }

        .refresh-spark {
          position: absolute;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #d2aa55;
          box-shadow: 0 0 15px rgba(210,170,85,.7);
          animation: sparkPulse 2s ease-in-out infinite;
        }

        .spark-one {
          right: 14px;
          top: 6px;
        }

        .spark-two {
          right: -3px;
          bottom: 15px;
          animation-delay: -1s;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 24px;
          margin-top: 28px;
          margin-bottom: 28px;
        }

        .metric-card {
          --metric-color: #0b93a6;
          --metric-rgb: 11,147,166;
          min-width: 0;
          min-height: 205px;
          padding: 32px 30px 38px;
          position: relative;
          display: grid;
          grid-template-columns: 82px minmax(0, 1fr);
          grid-template-rows: auto 1fr;
          column-gap: 24px;
          align-items: center;
          overflow: hidden;
          border: 1px solid rgba(var(--metric-rgb),.3);
          border-radius: 22px;
          background: linear-gradient(145deg, #ffffff, #f3f8fd);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.9), 0 18px 42px rgba(20,55,95,.1);
          /* backwards fill: releases transform to the hover style after entry */
          animation: cardEnter .75s var(--card-delay) ease backwards;
          transition: .38s ease;
        }

        .metric-card:hover {
          transform: translateY(-7px);
          border-color: rgba(var(--metric-rgb),.6);
          box-shadow: 0 28px 52px rgba(20,55,95,.16), 0 0 30px rgba(var(--metric-rgb),.12);
        }

        .metric-card-cyan {
          --metric-color: #0b93a6;
          --metric-rgb: 11,147,166;
        }

        .metric-card-green {
          --metric-color: #0f9d76;
          --metric-rgb: 15,157,118;
        }

        .metric-card-coral {
          --metric-color: #d64545;
          --metric-rgb: 214,69,69;
        }

        .metric-card-gold {
          --metric-color: #b0832e;
          --metric-rgb: 176,131,46;
        }

        .metric-card-glow {
          position: absolute;
          width: 190px;
          height: 190px;
          left: -100px;
          top: -100px;
          border-radius: 50%;
          background: rgba(var(--metric-rgb),.13);
          filter: blur(55px);
        }

        .metric-card-shine {
          position: absolute;
          inset: 0;
          opacity: 0;
          background: linear-gradient(120deg, transparent 20%, rgba(var(--metric-rgb),.08), transparent 70%);
          transform: translateX(-120%);
          animation: metricShineIn 1s ease calc(var(--card-delay) + 460ms) both;
        }

        /* One glass light sweep as each card lands, then it rests */
        @keyframes metricShineIn {
          0% { opacity: 1; transform: translateX(-120%); }
          85% { opacity: 1; }
          100% { opacity: 0; transform: translateX(120%); }
        }

        .metric-card:hover .metric-card-shine {
          opacity: 1;
          animation: shine .9s ease;
        }

        /* Border glow that blooms with the entrance and settles calm */
        .metric-card::after {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: 22px;
          pointer-events: none;
          border: 1px solid rgba(var(--metric-rgb), .9);
          box-shadow:
            0 0 26px rgba(var(--metric-rgb), .22),
            inset 0 0 18px rgba(var(--metric-rgb), .12);
          opacity: 0;
          animation: metricGlowSettle 1.7s ease calc(var(--card-delay) + 380ms) both;
        }

        @keyframes metricGlowSettle {
          0% { opacity: 0; }
          38% { opacity: 1; }
          100% { opacity: 0; }
        }

        /* Value highlight pulse right after the count-up lands */
        .metric-number {
          animation: metricNumberPulse 1s ease calc(var(--card-delay) + 820ms) both;
        }

        @keyframes metricNumberPulse {
          0%, 100% { text-shadow: 0 0 0 rgba(var(--metric-rgb), 0); }
          45% { text-shadow: 0 0 26px rgba(var(--metric-rgb), .55); }
        }

        .metric-icon {
          width: 82px;
          height: 82px;
          position: relative;
          z-index: 2;
          grid-row: 1 / 3;
          display: grid;
          place-items: center;
          border: 1px solid rgba(var(--metric-rgb),.35);
          border-radius: 22px;
          color: var(--metric-color);
          background: rgba(var(--metric-rgb),.1);
          box-shadow: inset 0 0 22px rgba(var(--metric-rgb),.07);
        }

        .metric-icon svg {
          width: 41px;
          height: 41px;
          stroke: currentColor;
          stroke-width: 1.6;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .metric-content {
          min-width: 0;
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          gap: 20px;
        }

        .metric-title {
          width: 100%;
          overflow: hidden;
          color: var(--hx-muted-strong, #3c516a);
          font-size: 14px;
          font-weight: 700;
          letter-spacing: .025em;
          text-transform: uppercase;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .metric-number {
          min-width: 86px;
          color: var(--hx-text, #0d2338);
          font-size: 52px;
          line-height: .9;
          font-weight: 650;
          letter-spacing: -.04em;
          font-variant-numeric: tabular-nums lining-nums;
        }

        .metric-card-gold .metric-number {
          color: var(--hx-gold, #a9791f);
        }

        .metric-badge {
          position: absolute;
          right: 25px;
          top: 68px;
          z-index: 3;
          padding: 7px 11px;
          border-radius: 9px;
          color: #067a53;
          background: rgba(15,157,118,.14);
          font-size: 12px;
          font-weight: 750;
        }

        .live-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .live-icon span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #b0832e;
          box-shadow: 0 0 14px rgba(210,170,85,.6);
          animation: livePulse 1.5s ease-in-out infinite;
        }

        .live-icon strong {
          color: var(--hx-gold, #a9791f);
          font-size: 13px;
          letter-spacing: .08em;
        }

        .countdown-ring {
          --countdown-angle: 360deg;
          width: 64px;
          height: 64px;
          position: absolute;
          right: 24px;
          bottom: 37px;
          border-radius: 50%;
          background:
            conic-gradient(#b0832e 0 var(--countdown-angle), rgba(13,35,56,.1) var(--countdown-angle) 360deg);
          mask: radial-gradient(circle, transparent 51%, #000 53%);
          filter: drop-shadow(0 0 7px rgba(176,131,46,.25));
        }

        .countdown-ring span {
          position: absolute;
          inset: 8px;
          border-radius: 50%;
          border: 1px dashed rgba(176,131,46,.35);
          animation: spin 8s linear infinite reverse;
        }

        .metric-line {
          position: absolute;
          left: 28px;
          right: 28px;
          bottom: 24px;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(var(--metric-rgb),.25), transparent);
        }

        .metric-line span {
          position: absolute;
          top: -4px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--metric-color);
          box-shadow: 0 0 15px rgba(var(--metric-rgb),.85);
          animation: scanMove 4.2s ease-in-out infinite;
        }

        .records-panel {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(11,147,166,.22);
          border-radius: 22px;
          background: linear-gradient(160deg, #ffffff, #f3f8fd);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.9), 0 24px 54px rgba(20,55,95,.1);
          animation: panelEnter .8s .28s ease both;
        }

        /* Animated brand accent line across the panel top */
        .records-panel::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 2px;
          z-index: 3;
          transform-origin: left center;
          transform: scaleX(0);
          background:
            linear-gradient(90deg, transparent, rgba(10,162,180,.75), rgba(210,170,85,.65), transparent);
          animation: recordsLineIn 1.1s var(--hx-ease, cubic-bezier(.16,1,.3,1)) .7s both;
        }

        @keyframes recordsLineIn {
          from { transform: scaleX(0); opacity: 0; }
          to { transform: scaleX(1); opacity: 1; }
        }

        .records-header > div,
        .records-count {
          animation: heroEnter .6s ease .55s both;
        }

        .records-count {
          animation-delay: .68s;
        }

        .records-header {
          min-height: 78px;
          padding: 0 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--hx-line, rgba(14,55,92,.12));
          background: rgba(11,147,166,.05);
        }

        .records-header > div {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .records-title-icon {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          color: var(--hx-gold, #a9791f);
        }

        .records-title-icon svg {
          width: 28px;
          height: 28px;
          stroke: currentColor;
          stroke-width: 1.65;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .records-header h2 {
          margin: 0;
          font-size: 19px;
        }

        .records-count {
          padding: 10px 17px;
          border: 1px solid var(--hx-line, rgba(14,55,92,.12));
          border-radius: 14px;
          color: var(--hx-muted, #55697d);
          background: var(--hx-panel-strong, #ffffff);
          font-size: 13px;
          font-variant-numeric: tabular-nums;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .attendance-table {
          width: 100%;
          min-width: 820px;
          border-collapse: collapse;
          table-layout: fixed;
        }

        .attendance-table th {
          height: 58px;
          padding: 0 28px;
          text-align: left;
          color: var(--hx-navy, #0c3455);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .055em;
          text-transform: uppercase;
          border-bottom: 1px solid rgba(169,121,31,.25);
        }

        .record-row {
          border-bottom: 1px solid var(--hx-line-soft, rgba(14,55,92,.07));
          animation: rowEnter .5s var(--row-delay) ease both;
          transition: .25s ease;
        }

        .record-row:hover {
          background: rgba(11,147,166,.05);
          box-shadow: inset 3px 0 0 rgba(10,162,180,.55);
        }

        .attendance-table td {
          height: 70px;
          padding: 0 28px;
          color: #33475a;
          font-size: 13px;
        }

        .employee-cell {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .employee-avatar {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(11,147,166,.3);
          border-radius: 13px;
          color: var(--hx-cyan, #0b93a6);
          background: rgba(11,147,166,.08);
        }

        .email-cell {
          color: rgba(85,105,125,.85) !important;
        }

        .action-badge {
          width: fit-content;
          padding: 8px 13px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
        }

        .action-badge span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
          box-shadow: 0 0 8px currentColor;
        }

        .action-badge.check-in {
          color: #067a53;
          border: 1px solid rgba(15,157,118,.3);
          background: rgba(15,157,118,.1);
        }

        .action-badge.check-out {
          color: #b4372a;
          border: 1px solid rgba(214,69,69,.28);
          background: rgba(214,69,69,.08);
        }

        .timestamp-cell {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--hx-muted, #55697d);
          font-variant-numeric: tabular-nums;
        }

        .timestamp-cell svg {
          width: 18px;
          height: 18px;
          stroke: currentColor;
          stroke-width: 1.7;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .empty-cell {
          height: 340px !important;
          padding: 0 !important;
        }

        .empty-state {
          min-height: 340px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          text-align: center;
          background:
            radial-gradient(circle at center 45%, rgba(10,162,180,.08), transparent 30%);
        }

        .empty-particles {
          position: absolute;
          inset: 0;
        }

        .empty-particles span {
          position: absolute;
          left: var(--particle-x);
          top: var(--particle-y);
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #d2aa55;
          box-shadow: 0 0 10px rgba(210,170,85,.6);
          animation: particleFloat 5s var(--particle-delay) ease-in-out infinite;
        }

        .empty-document {
          width: 98px;
          height: 112px;
          position: relative;
          display: grid;
          place-items: center;
          margin-bottom: 22px;
          border: 1px solid rgba(11,147,166,.4);
          border-radius: 50px 50px 14px 14px;
          color: #33475a;
          background: var(--hx-panel-strong, #ffffff);
          box-shadow: 0 0 24px rgba(23,217,212,.14), 0 14px 30px rgba(20,55,95,.1);
          animation: emptyFloat 4s ease-in-out infinite;
        }

        .empty-document svg {
          width: 40px;
          height: 40px;
          stroke: currentColor;
          stroke-width: 1.4;
        }

        .empty-document span {
          position: absolute;
          bottom: 4px;
          width: 13px;
          height: 7px;
          border-radius: 50%;
          background: #d2aa55;
          box-shadow: 0 0 22px 7px rgba(210,170,85,.3);
          animation: sparkPulse 1.8s ease-in-out infinite;
        }

        .empty-state h3 {
          margin: 0 0 12px;
          color: #33475a;
          font-size: 18px;
        }

        .empty-state p {
          margin: 0;
          color: #7a8ea0;
          font-size: 13px;
        }

        @keyframes heroEnter {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes lightLineMove {
          0%,100% { transform: translateX(-3%) scaleX(.97); opacity: .3; }
          50% { transform: translateX(3%) scaleX(1.04); opacity: 1; }
        }

        @keyframes livePulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50% { opacity: .35; transform: scale(.62); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes sparkPulse {
          0%,100% { opacity: .4; transform: scale(.7); }
          50% { opacity: 1; transform: scale(1.25); }
        }

        @keyframes cardEnter {
          from { opacity: 0; transform: translateY(25px) scale(.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes shine {
          to { transform: translateX(120%); }
        }

        @keyframes scanMove {
          0%,100% { left: 0; opacity: .35; }
          50% { left: calc(100% - 10px); opacity: 1; }
        }

        @keyframes panelEnter {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes rowEnter {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes particleFloat {
          0%,100% { opacity: .1; transform: translateY(8px) scale(.7); }
          50% { opacity: .9; transform: translateY(-13px) scale(1.2); }
        }

        @keyframes emptyFloat {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
        }

        @media (max-width: 1220px) {
          .hero-copy {
            min-width: 450px;
          }

          .hero-copy h1 {
            font-size: 52px;
          }

          .hero-copy p {
            padding-left: 150px;
          }

          .metrics-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 900px) {
          .hero-section {
            flex-direction: column;
            align-items: flex-start;
          }

          .hero-controls {
            width: 100%;
            justify-content: space-between;
          }

          .hero-copy {
            min-width: 0;
          }

          .hero-light-lines {
            left: 10%;
            width: 90%;
          }
        }

        @media (max-width: 620px) {
          .attendance-page {
            padding-top: 30px;
          }

          .hero-copy h1 {
            gap: 8px;
            font-size: 35px;
          }

          .hero-copy p {
            padding-left: 0;
            font-size: 15px;
          }

          .hero-controls {
            gap: 10px;
          }

          .live-sync-pill {
            min-width: 135px;
            min-height: 52px;
          }

          .refresh-control {
            width: 155px;
          }

          .refresh-button {
            min-width: 140px;
            min-height: 62px;
            font-size: 15px;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .metric-card {
            min-height: 180px;
          }

          .records-header {
            padding-inline: 18px;
          }

          .records-header h2 {
            font-size: 16px;
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
