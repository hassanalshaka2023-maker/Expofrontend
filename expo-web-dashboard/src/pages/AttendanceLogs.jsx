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
    const duration = 620;
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
            color: rgba(203,216,231,.55);
            font-family: 'Inter', sans-serif;
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
            border-top-color: #20d8dc;
            border-right-color: rgba(217,145,69,.48);
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
            stroke: #20d8dc;
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
          color: #f6f9fd;
          font-family: 'Inter', sans-serif;
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
          background: #e5a052;
          box-shadow: 0 0 12px rgba(229,160,82,.55);
        }

        .hero-line {
          width: 74px;
          height: 1px;
          background: linear-gradient(90deg, #d99145, transparent);
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
          color: #f4f6fa;
        }

        .hero-copy h1 em {
          color: #20d8dc;
          font-style: normal;
          font-weight: 600;
          text-shadow: 0 0 28px rgba(32,216,220,.16);
        }

        .hero-copy p {
          margin: 24px 0 0;
          padding-left: 224px;
          color: rgba(181,197,215,.62);
          font-size: 18px;
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
          border-top: 1px solid rgba(217,145,69,.32);
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
          border: 1px solid rgba(32,216,220,.37);
          border-radius: 999px;
          color: #20d8dc;
          background: rgba(3,27,42,.78);
          text-transform: uppercase;
          box-shadow: inset 0 0 20px rgba(32,216,220,.04);
        }

        .live-sync-pill strong {
          font-size: 13px;
          letter-spacing: .04em;
        }

        .live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #20d8dc;
          box-shadow: 0 0 14px rgba(32,216,220,.82);
          animation: livePulse 1.5s ease-in-out infinite;
        }

        .live-orbit {
          position: absolute;
          left: -11px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 1px solid transparent;
          border-top-color: rgba(32,216,220,.66);
          border-bottom-color: rgba(32,216,220,.2);
          animation: spin 3.3s linear infinite;
        }

        .sync-time {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .sync-time span {
          color: rgba(181,197,215,.48);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: .08em;
        }

        .sync-time strong {
          color: #e1a052;
          font-size: 18px;
          font-weight: 750;
          letter-spacing: .055em;
          font-variant-numeric: tabular-nums;
          text-shadow: 0 0 15px rgba(225,160,82,.25);
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
          border: 1px solid rgba(229,160,82,.65);
          border-radius: 21px;
          color: #f5f8fc;
          background: linear-gradient(145deg, rgba(24,45,56,.7), rgba(4,18,31,.88));
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.08),
            0 16px 35px rgba(0,0,0,.28);
          font-size: 18px;
          font-weight: 650;
          cursor: pointer;
          transition: .35s ease;
        }

        .refresh-button:hover {
          transform: translateY(-3px);
          border-color: rgba(241,183,107,.92);
          box-shadow: 0 21px 42px rgba(0,0,0,.34), 0 0 26px rgba(217,145,69,.13);
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
          border-top-color: rgba(217,145,69,.5);
          border-right-color: rgba(217,145,69,.12);
          animation: spin 8s linear infinite;
        }

        .refresh-ring-two {
          width: 142px;
          height: 142px;
          right: -15px;
          border-left-color: rgba(32,216,220,.24);
          border-bottom-color: rgba(217,145,69,.3);
          animation: spin 13s linear infinite reverse;
        }

        .refresh-spark {
          position: absolute;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #e6a152;
          box-shadow: 0 0 15px rgba(230,161,82,.92);
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
          --metric-color: #20d8dc;
          --metric-rgb: 32,216,220;
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
          border: 1px solid rgba(var(--metric-rgb),.54);
          border-radius: 22px;
          background: linear-gradient(145deg, rgba(15,36,50,.8), rgba(4,18,31,.9));
          box-shadow: inset 0 1px 0 rgba(255,255,255,.05), 0 18px 42px rgba(0,0,0,.25);
          animation: cardEnter .75s var(--card-delay) ease both;
          transition: .38s ease;
        }

        .metric-card:hover {
          transform: translateY(-7px);
          border-color: rgba(var(--metric-rgb),.82);
          box-shadow: 0 28px 52px rgba(0,0,0,.34), 0 0 30px rgba(var(--metric-rgb),.09);
        }

        .metric-card-cyan {
          --metric-color: #20d8dc;
          --metric-rgb: 32,216,220;
        }

        .metric-card-green {
          --metric-color: #16d8a0;
          --metric-rgb: 22,216,160;
        }

        .metric-card-coral {
          --metric-color: #ff7059;
          --metric-rgb: 255,112,89;
        }

        .metric-card-gold {
          --metric-color: #e3a04f;
          --metric-rgb: 227,160,79;
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
          background: linear-gradient(120deg, transparent 20%, rgba(255,255,255,.08), transparent 70%);
          transform: translateX(-120%);
        }

        .metric-card:hover .metric-card-shine {
          opacity: 1;
          animation: shine .9s ease;
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
          color: rgba(241,246,252,.82);
          font-size: 14px;
          font-weight: 700;
          letter-spacing: .025em;
          text-transform: uppercase;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .metric-number {
          min-width: 86px;
          color: #fff;
          font-size: 52px;
          line-height: .9;
          font-weight: 650;
          letter-spacing: -.04em;
          font-variant-numeric: tabular-nums lining-nums;
        }

        .metric-card-gold .metric-number {
          color: #e3a04f;
        }

        .metric-badge {
          position: absolute;
          right: 25px;
          top: 68px;
          z-index: 3;
          padding: 7px 11px;
          border-radius: 9px;
          color: #1ee19b;
          background: rgba(17,132,94,.2);
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
          background: #e3a04f;
          box-shadow: 0 0 14px rgba(227,160,79,.75);
          animation: livePulse 1.5s ease-in-out infinite;
        }

        .live-icon strong {
          color: #e3a04f;
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
            conic-gradient(#e3a04f 0 var(--countdown-angle), rgba(255,255,255,.09) var(--countdown-angle) 360deg);
          mask: radial-gradient(circle, transparent 51%, #000 53%);
          filter: drop-shadow(0 0 7px rgba(227,160,79,.3));
        }

        .countdown-ring span {
          position: absolute;
          inset: 8px;
          border-radius: 50%;
          border: 1px dashed rgba(227,160,79,.3);
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
          overflow: hidden;
          border: 1px solid rgba(55,183,205,.45);
          border-radius: 22px;
          background: linear-gradient(160deg, rgba(7,25,41,.88), rgba(3,15,28,.94));
          box-shadow: inset 0 1px 0 rgba(255,255,255,.04), 0 24px 54px rgba(0,0,0,.28);
          animation: panelEnter .8s .28s ease both;
        }

        .records-header {
          min-height: 78px;
          padding: 0 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(77,143,164,.19);
          background: rgba(8,28,45,.55);
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
          color: #e2a04e;
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
          border: 1px solid rgba(101,142,166,.18);
          border-radius: 14px;
          color: rgba(199,212,228,.58);
          background: rgba(7,22,36,.58);
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
          color: rgba(179,193,210,.58);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .055em;
          text-transform: uppercase;
          border-bottom: 1px solid rgba(217,145,69,.21);
        }

        .record-row {
          border-bottom: 1px solid rgba(91,129,151,.1);
          animation: rowEnter .5s var(--row-delay) ease both;
          transition: .25s ease;
        }

        .record-row:hover {
          background: rgba(32,216,220,.035);
          box-shadow: inset 3px 0 0 rgba(32,216,220,.5);
        }

        .attendance-table td {
          height: 70px;
          padding: 0 28px;
          color: rgba(224,232,242,.76);
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
          border: 1px solid rgba(32,216,220,.28);
          border-radius: 13px;
          color: #20d8dc;
          background: rgba(32,216,220,.08);
        }

        .email-cell {
          color: rgba(187,202,218,.55) !important;
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
          color: #17d7a1;
          border: 1px solid rgba(23,215,161,.23);
          background: rgba(23,215,161,.075);
        }

        .action-badge.check-out {
          color: #ff755f;
          border: 1px solid rgba(255,117,95,.23);
          background: rgba(255,117,95,.075);
        }

        .timestamp-cell {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: rgba(187,202,218,.6);
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
            radial-gradient(circle at center 45%, rgba(8,67,82,.16), transparent 30%);
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
          background: #e4a454;
          box-shadow: 0 0 10px rgba(228,164,84,.8);
          animation: particleFloat 5s var(--particle-delay) ease-in-out infinite;
        }

        .empty-document {
          width: 98px;
          height: 112px;
          position: relative;
          display: grid;
          place-items: center;
          margin-bottom: 22px;
          border: 1px solid rgba(32,216,220,.5);
          border-radius: 50px 50px 14px 14px;
          color: rgba(239,245,252,.8);
          background: rgba(5,20,33,.7);
          box-shadow: 0 0 24px rgba(32,216,220,.09);
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
          background: #e5a052;
          box-shadow: 0 0 22px 7px rgba(229,160,82,.34);
          animation: sparkPulse 1.8s ease-in-out infinite;
        }

        .empty-state h3 {
          margin: 0 0 12px;
          color: rgba(229,236,245,.72);
          font-size: 18px;
        }

        .empty-state p {
          margin: 0;
          color: rgba(151,169,190,.44);
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
