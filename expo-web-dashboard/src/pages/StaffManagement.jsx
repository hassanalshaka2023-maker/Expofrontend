import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import {
  Users,
  Plus,
  X,
  QrCode,
  CheckCircle,
  UserPlus,
  Mail,
  Lock,
  User,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { webApi } from "../services/api";
import Button from "../components/ui/Button";

const spring = {
  type: "spring",
  stiffness: 280,
  damping: 27,
};

/* Count-up display for values that already exist — the real final value is
   always reached, and shown immediately under reduced-motion settings. */
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

function StaffRow({ staff, onShowQR, index = 0 }) {
  return (
    <motion.tr
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.97 }}
      transition={{ ...spring, delay: Math.min(index * 0.045, 0.45) }}
      className="staff-row"
    >
      <td>
        <div className="staff-name-cell">
          <span className="staff-avatar">
            {staff.name?.charAt(0)?.toUpperCase() || "?"}
          </span>
          <strong>{staff.name || "—"}</strong>
        </div>
      </td>
      <td className="staff-email-cell">{staff.email || "—"}</td>
      <td>
        <span className={`status-chip ${staff.isInside ? "inside" : "outside"}`}>
          <span className="status-dot" />
          {staff.isInside ? "Inside" : "Outside"}
        </span>
      </td>
      <td>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onShowQR(staff)}
          className="qr-action-btn"
          title="Show QR Code"
        >
          <QrCode className="h-4 w-4" />
          <span>QR</span>
        </motion.button>
      </td>
    </motion.tr>
  );
}

function QRModal({ staff, onClose, onRefreshQR, refreshing }) {
  const qrValue = staff?.staffQRToken
    ? JSON.stringify({ type: "staff", token: staff.staffQRToken })
    : "";

  return (
    <AnimatePresence>
      {staff && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="modal-overlay"
          />
          <div className="modal-wrapper">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={spring}
              className="modal-content"
            >
              <div className="modal-header">
                <h3>
                  <QrCode className="h-5 w-5" />
                  Staff QR Code
                </h3>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="modal-close-btn"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              <div className="qr-modal-body">
                <div className="qr-staff-info">
                  <span className="qr-staff-avatar">
                    {staff.name?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                  <div>
                    <strong>{staff.name}</strong>
                    <span>{staff.email}</span>
                  </div>
                </div>

                <div className="qr-code-wrapper">
                  {qrValue ? (
                    <QRCodeCanvas
                      value={qrValue}
                      size={220}
                      bgColor="#ffffff"
                      fgColor="#0c3455"
                      level="H"
                      includeMargin={false}
                    />
                  ) : (
                    <div className="qr-empty-state">
                      <AlertCircle className="h-10 w-10" />
                      <p>No QR token available</p>
                    </div>
                  )}
                  <div className="qr-glow" />
                </div>

                <p className="qr-instruction">
                  Scan this QR code at the exhibition entrance for check-in/check-out
                </p>

                <Button
                  variant="ghost"
                  onClick={() => onRefreshQR(staff._id)}
                  disabled={refreshing}
                  className="qr-refresh-btn"
                  size="sm"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                  {refreshing ? "Generating..." : "Generate New QR"}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function AddStaffModal({ open, onClose, onSubmit, loading }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      await onSubmit(name.trim(), email.trim(), password);
      setName("");
      setEmail("");
      setPassword("");
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to add staff");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="modal-overlay"
          />
          <div className="modal-wrapper">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={spring}
              className="modal-content"
            >
              <div className="modal-header">
                <h3>
                  <UserPlus className="h-5 w-5" />
                  Add New Staff
                </h3>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="modal-close-btn"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="staff-form">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="staff-form-error"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </motion.div>
                )}

                <div className="staff-input-group">
                  <label>
                    <User className="h-4 w-4" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter staff name"
                    className="staff-input"
                  />
                </div>

                <div className="staff-input-group">
                  <label>
                    <Mail className="h-4 w-4" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="staff-input"
                  />
                </div>

                <div className="staff-input-group">
                  <label>
                    <Lock className="h-4 w-4" />
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="staff-input"
                  />
                </div>

                <div className="staff-form-actions">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Add Staff
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function DecorativeParticles() {
  return (
    <div className="staff-particles" aria-hidden="true">
      {Array.from({ length: 15 }).map((_, index) => (
        <motion.span
          key={index}
          style={{
            "--px": `${5 + ((index * 31) % 90)}%`,
            "--py": `${8 + ((index * 47) % 80)}%`,
          }}
          animate={{
            y: [8, -16, 8],
            opacity: [0.08, 0.85, 0.08],
            scale: [0.65, 1.3, 0.65],
          }}
          transition={{
            duration: 4.5 + (index % 4),
            delay: (index % 7) * 0.35,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [qrRefreshLoading, setQrRefreshLoading] = useState(false);

  const fetchStaff = useCallback(async () => {
    try {
      const data = await webApi.getStaff();
      setStaff(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load staff");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleAddStaff = async (name, email, password) => {
    setAddLoading(true);
    try {
      await webApi.addStaff(name, email, password);
      await fetchStaff();
    } finally {
      setAddLoading(false);
    }
  };

  const handleRefreshQR = async (staffId) => {
    setQrRefreshLoading(true);
    try {
      const result = await webApi.generateStaffQR(staffId);
      setStaff((prev) =>
        prev.map((s) =>
          s._id === staffId ? { ...s, staffQRToken: result.staffQRToken } : s
        )
      );
      setSelectedStaff((prev) =>
        prev?._id === staffId ? { ...prev, staffQRToken: result.staffQRToken } : prev
      );
    } finally {
      setQrRefreshLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="staff-loading">
        <div className="staff-loading-rings">
          <span />
          <span />
          <span />
          <Users className="h-8 w-8" />
        </div>
        <p>Loading staff records...</p>
      </div>
    );
  }

  if (error && staff.length === 0) {
    return (
      <div className="staff-error-page">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="staff-error-content"
        >
          <div className="staff-error-icon">
            <AlertCircle />
          </div>
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <Button onClick={fetchStaff} variant="primary">
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <section className="staff-page" dir="ltr">
      <div className="staff-bg" aria-hidden="true">
        <div className="staff-grid-bg" />
        <div className="staff-orb staff-orb-cyan" />
        <div className="staff-orb staff-orb-gold" />
        <DecorativeParticles />
      </div>

      <div className="staff-content">
        <div className="staff-hero">
          <div className="staff-hero-copy">
            <div className="staff-hero-deco">
              <span className="staff-diamond" />
              <span className="staff-hero-line" />
            </div>
            <h1>
              <span>Staff</span>
              <em>Management</em>
            </h1>
            <p>Manage employees and their QR codes for exhibition access</p>
          </div>

          <div className="staff-hero-right">
            <motion.button
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setAddModalOpen(true)}
              className="add-staff-btn"
            >
              <span className="add-staff-ring" />
              <Plus className="h-5 w-5" />
              <span>Add Staff</span>
            </motion.button>

            <button
              type="button"
              onClick={fetchStaff}
              className="staff-refresh-btn"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="staff-summary">
          <div className="summary-card">
            <Users className="h-5 w-5" />
            <div>
              <span>Total Staff</span>
              <strong>
                <AnimatedNumber value={staff.length} />
              </strong>
            </div>
          </div>
          <div className="summary-card summary-card-inside">
            <CheckCircle className="h-5 w-5" />
            <div>
              <span>Inside</span>
              <strong>
                <AnimatedNumber value={staff.filter((s) => s.isInside).length} />
              </strong>
            </div>
          </div>
          <div className="summary-card summary-card-outside">
            <X className="h-5 w-5" />
            <div>
              <span>Outside</span>
              <strong>
                <AnimatedNumber
                  value={staff.filter((s) => !s.isInside).length}
                />
              </strong>
            </div>
          </div>
        </div>

        <div className="staff-table-wrapper">
          <table className="staff-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>QR Code</th>
              </tr>
            </thead>
            <tbody>
              {staff.length === 0 ? (
                <tr>
                  <td colSpan={4} className="staff-empty-cell">
                    <div className="staff-empty">
                      <UserPlus className="h-12 w-12" />
                      <h3>No staff members yet</h3>
                      <p>
                        Click the "Add Staff" button above to register your first
                        employee.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {staff.map((member, index) => (
                    <StaffRow
                      key={member._id}
                      staff={member}
                      onShowQR={setSelectedStaff}
                      index={index}
                    />
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <QRModal
        staff={selectedStaff}
        onClose={() => setSelectedStaff(null)}
        onRefreshQR={handleRefreshQR}
        refreshing={qrRefreshLoading}
      />

      <AddStaffModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddStaff}
        loading={addLoading}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Montserrat:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; }

        .staff-page {
          width: 100%;
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          color: var(--hx-text, #0d2338);
          font-family: 'Inter', sans-serif;
          background: var(--hx-bg, #eef4fb);
          isolation: isolate;
        }

        .staff-bg {
          position: fixed;
          inset: 0;
          z-index: -1;
          overflow: hidden;
          pointer-events: none;
        }

        .staff-grid-bg {
          position: absolute;
          inset: 0;
          opacity: 0.5;
          background-image:
            linear-gradient(rgba(11,147,166,.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(11,147,166,.05) 1px, transparent 1px);
          background-size: 78px 78px;
          animation: staffGridMove 32s linear infinite;
        }

        @keyframes staffGridMove {
          to { transform: translateY(78px); }
        }

        .staff-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(110px);
          pointer-events: none;
        }

        .staff-orb-cyan {
          width: 460px;
          height: 460px;
          right: -160px;
          top: 80px;
          opacity: .16;
          background: #17d9d4;
          animation: staffCyanOrb 15s ease-in-out infinite alternate;
        }

        .staff-orb-gold {
          width: 380px;
          height: 380px;
          left: -140px;
          bottom: -100px;
          opacity: .14;
          background: #e6be6a;
          animation: staffGoldOrb 13s ease-in-out infinite alternate;
        }

        @keyframes staffCyanOrb {
          to { transform: translate(-40px, 30px) scale(1.12); }
        }

        @keyframes staffGoldOrb {
          to { transform: translate(40px, -30px) scale(1.1); }
        }

        .staff-particles {
          position: absolute;
          inset: 0;
        }

        .staff-particles span {
          position: absolute;
          left: var(--px);
          top: var(--py);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #d2aa55;
          box-shadow: 0 0 11px rgba(210,170,85,.6);
        }

        .staff-content {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 48px 24px 80px;
        }

        .staff-hero {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 32px;
          animation: heroEnter .7s ease both;
        }

        @keyframes heroEnter {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .staff-hero-copy h1 {
          margin: 0;
          display: flex;
          align-items: baseline;
          gap: 14px;
          font-family: 'Montserrat', 'Inter', sans-serif;
          font-size: clamp(38px, 4vw, 58px);
          font-weight: 500;
          line-height: .98;
          text-transform: uppercase;
          letter-spacing: .015em;
        }

        .staff-hero-copy h1 span {
          color: var(--hx-text, #0d2338);
          animation: staffWordIn .75s var(--hx-ease, cubic-bezier(.16,1,.3,1)) .1s both;
        }

        .staff-hero-copy h1 em {
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
            staffWordIn .75s var(--hx-ease, cubic-bezier(.16,1,.3,1)) .24s both,
            staffEmSheen 1.6s ease-in-out 1s both;
        }

        @keyframes staffWordIn {
          from { opacity: 0; transform: translateY(24px); filter: blur(6px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }

        @keyframes staffEmSheen {
          from { background-position: 130% 0; }
          to { background-position: 0% 0; }
        }

        .staff-hero-copy p {
          margin: 16px 0 0;
          color: var(--hx-muted, #55697d);
          font-size: 15px;
          animation: heroEnter .65s ease .34s both;
        }

        .staff-hero-deco {
          transform-origin: left center;
          animation: staffDecoIn .6s var(--hx-ease, cubic-bezier(.16,1,.3,1)) .04s both;
        }

        @keyframes staffDecoIn {
          from { opacity: 0; transform: scaleX(.35); }
          to { opacity: 1; transform: scaleX(1); }
        }

        .staff-hero-deco {
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .staff-diamond {
          width: 8px;
          height: 8px;
          transform: rotate(45deg);
          background: #d2aa55;
          box-shadow: 0 0 12px rgba(210,170,85,.5);
        }

        .staff-hero-line {
          width: 64px;
          height: 1px;
          background: linear-gradient(90deg, #d2aa55, transparent);
        }

        .staff-hero-right {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .add-staff-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 26px;
          border: 1px solid rgba(10,162,180,.45);
          border-radius: 16px;
          background: linear-gradient(135deg, #27e8df, #00a8bd 58%, #d3aa56 135%);
          color: #001116;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 12px 35px rgba(0,196,202,.2), inset 0 1px 0 rgba(255,255,255,.42);
          transition: .3s ease;
          overflow: hidden;
        }

        .add-staff-btn:hover {
          border-color: rgba(10,162,180,.7);
          box-shadow: 0 18px 45px rgba(0,205,208,.28), inset 0 1px 0 rgba(255,255,255,.45);
          transform: translateY(-2px);
        }

        .add-staff-btn:active {
          transform: translateY(0) scale(.97);
        }

        /* Border light sweep on hover */
        .add-staff-btn::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(115deg, transparent 30%, rgba(255,255,255,.14) 50%, transparent 70%);
          transform: translateX(-130%);
          transition: transform .7s var(--hx-ease, cubic-bezier(.16,1,.3,1));
          pointer-events: none;
        }

        .add-staff-btn:hover::after {
          transform: translateX(130%);
        }

        .add-staff-ring {
          position: absolute;
          inset: -6px;
          border-radius: 20px;
          border: 1px solid rgba(10,162,180,.28);
          animation: ringPulse 2s ease-in-out infinite;
        }

        @keyframes ringPulse {
          0%, 100% { transform: scale(1); opacity: .6; }
          50% { transform: scale(1.04); opacity: .2; }
        }

        .staff-refresh-btn {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border: 1px solid var(--hx-line, rgba(14,55,92,.12));
          border-radius: 12px;
          background: var(--hx-panel-strong, #ffffff);
          color: var(--hx-muted, #55697d);
          cursor: pointer;
          transition: .25s ease;
        }

        .staff-refresh-btn:hover {
          border-color: rgba(11,147,166,.4);
          color: var(--hx-cyan, #0b93a6);
        }

        .staff-summary {
          display: flex;
          gap: 18px;
          margin-bottom: 28px;
          animation: heroEnter .7s .12s ease both;
        }

        .summary-card {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px 22px;
          border: 1px solid rgba(11,147,166,.3);
          border-radius: 16px;
          background: linear-gradient(145deg, #ffffff, #f3f8fd);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.9), 0 12px 28px rgba(20,55,95,.08);
          color: var(--hx-cyan, #0b93a6);
          /* backwards fill: releases transform to the hover style after entry */
          animation: summaryCardIn .65s var(--hx-ease, cubic-bezier(.16,1,.3,1)) backwards;
          transition: transform .28s var(--hx-ease, cubic-bezier(.16,1,.3,1)), box-shadow .28s ease;
        }

        .summary-card:nth-child(1) { animation-delay: .16s; }
        .summary-card:nth-child(2) { animation-delay: .24s; }
        .summary-card:nth-child(3) { animation-delay: .32s; }

        @keyframes summaryCardIn {
          from { opacity: 0; transform: translateY(16px) scale(.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .summary-card:hover {
          transform: translateY(-3px);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.9),
            0 14px 30px rgba(20,55,95,.14),
            0 0 22px rgba(23,217,212,.12);
        }

        /* Brief glow bloom as each summary card lands, then calm */
        .summary-card::after {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: 16px;
          pointer-events: none;
          border: 1px solid currentColor;
          opacity: 0;
          animation: summaryGlowSettle 1.5s ease both;
        }

        .summary-card:nth-child(1)::after { animation-delay: .5s; }
        .summary-card:nth-child(2)::after { animation-delay: .6s; }
        .summary-card:nth-child(3)::after { animation-delay: .7s; }

        @keyframes summaryGlowSettle {
          0% { opacity: 0; }
          40% { opacity: .55; }
          100% { opacity: 0; }
        }

        .summary-card-inside {
          border-color: rgba(15,157,118,.35);
          color: #0f9d76;
        }

        .summary-card-outside {
          border-color: rgba(214,69,69,.3);
          color: #d64545;
        }

        .summary-card div {
          display: flex;
          flex-direction: column;
        }

        .summary-card div span {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: .06em;
          opacity: .7;
        }

        .summary-card div strong {
          font-size: 26px;
          font-weight: 700;
          line-height: 1.1;
        }

        .staff-table-wrapper {
          overflow: hidden;
          border: 1px solid rgba(11,147,166,.22);
          border-radius: 20px;
          background: linear-gradient(160deg, #ffffff, #f3f8fd);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.9), 0 18px 42px rgba(20,55,95,.1);
          animation: heroEnter .7s .22s ease both;
        }

        .staff-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        .staff-table thead th {
          padding: 16px 20px;
          text-align: left;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .08em;
          color: var(--hx-navy, #0c3455);
          border-bottom: 1px solid var(--hx-line, rgba(14,55,92,.12));
          background: rgba(11,147,166,.05);
        }

        .staff-row {
          border-bottom: 1px solid var(--hx-line-soft, rgba(14,55,92,.07));
          transition: background .2s;
        }

        .staff-row:hover { background: rgba(11,147,166,.05); }

        .staff-row td { padding: 14px 20px; }

        .staff-name-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .staff-avatar {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: linear-gradient(145deg, rgba(11,147,166,.14), rgba(255,255,255,.9));
          border: 1px solid rgba(11,147,166,.3);
          color: var(--hx-cyan, #0b93a6);
          font-size: 14px;
          font-weight: 800;
        }

        .staff-name-cell strong {
          color: var(--hx-text, #0d2338);
          font-size: 14px;
        }

        .staff-email-cell {
          color: rgba(85,105,125,.85);
          font-size: 13px;
        }

        .status-chip {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .04em;
        }

        .status-chip.inside {
          color: #067a53;
          background: rgba(15,157,118,.12);
          border: 1px solid rgba(15,157,118,.3);
        }

        .status-chip.outside {
          color: var(--hx-muted, #55697d);
          background: rgba(13,35,56,.05);
          border: 1px solid var(--hx-line, rgba(14,55,92,.12));
        }

        .status-chip .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .status-chip.inside .status-dot {
          background: #0f9d76;
          box-shadow: 0 0 8px rgba(15,157,118,.5);
          animation: livePulse 1.5s ease-in-out infinite;
        }

        @keyframes livePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .35; }
        }

        .status-chip.outside .status-dot {
          background: rgba(85,105,125,.5);
        }

        .qr-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border: 1px solid rgba(11,147,166,.35);
          border-radius: 10px;
          background: rgba(11,147,166,.08);
          color: var(--hx-cyan, #0b93a6);
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: .25s ease;
        }

        .qr-action-btn:hover {
          background: rgba(11,147,166,.14);
          border-color: rgba(11,147,166,.6);
          box-shadow: 0 0 18px rgba(23,217,212,.16);
        }

        .staff-empty-cell {
          padding: 60px 20px !important;
          text-align: center;
        }

        .staff-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          color: #7a8ea0;
        }

        .staff-empty h3 {
          margin: 0;
          color: #33475a;
          font-size: 18px;
        }

        .staff-empty p {
          margin: 0;
          font-size: 13px;
          max-width: 340px;
        }

        .staff-loading {
          min-height: 80vh;
          display: grid;
          place-content: center;
          justify-items: center;
          gap: 20px;
          color: var(--hx-muted, #55697d);
          background: var(--hx-bg, #eef4fb);
        }

        .staff-loading-rings {
          width: 90px;
          height: 90px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .staff-loading-rings > span {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px solid transparent;
          border-top-color: #0aa2b4;
          border-right-color: rgba(178,134,45,.5);
          animation: spin 2.2s linear infinite;
        }

        .staff-loading-rings > span:nth-child(2) {
          inset: 12px;
          animation-duration: 1.6s;
          animation-direction: reverse;
        }

        .staff-loading-rings > span:nth-child(3) {
          inset: 24px;
          animation-duration: 1.1s;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .staff-error-page {
          min-height: 80vh;
          display: grid;
          place-items: center;
          padding: 32px;
          background: var(--hx-bg, #eef4fb);
        }

        .staff-error-content {
          text-align: center;
          max-width: 400px;
        }

        .staff-error-icon {
          width: 70px;
          height: 70px;
          margin: 0 auto 20px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(214,69,69,.3);
          border-radius: 20px;
          color: #d64545;
          background: rgba(214,69,69,.08);
        }

        .staff-error-content h2 {
          margin: 0 0 10px;
          color: var(--hx-text, #0d2338);
          font-size: 20px;
        }

        .staff-error-content p {
          margin: 0 0 24px;
          color: var(--hx-muted, #55697d);
          font-size: 14px;
        }

        /* ===== MODALS - FIXED CENTERING ===== */
        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 200;
          background: rgba(13,35,56,.32);
          backdrop-filter: blur(6px);
        }

        .modal-wrapper {
          position: fixed;
          inset: 0;
          z-index: 210;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .modal-content {
          width: 94%;
          max-width: 460px;
          max-height: 90vh;
          overflow-y: auto;
          border: 1px solid rgba(11,147,166,.28);
          border-radius: 22px;
          background: linear-gradient(160deg, #ffffff, #f3f8fd);
          box-shadow: 0 32px 64px rgba(20,55,95,.22), 0 0 48px rgba(23,217,212,.08);
          pointer-events: auto;
          animation: modalGlowSettle 1.6s ease .15s both;
        }

        /* Border glow that blooms with the modal entrance, then settles */
        @keyframes modalGlowSettle {
          0% { box-shadow: 0 32px 64px rgba(20,55,95,.22), 0 0 0 rgba(23,217,212,0); }
          40% { box-shadow: 0 32px 64px rgba(20,55,95,.22), 0 0 56px rgba(23,217,212,.2); }
          100% { box-shadow: 0 32px 64px rgba(20,55,95,.22), 0 0 48px rgba(23,217,212,.08); }
        }

        /* Short content stagger inside the modals */
        .modal-header,
        .staff-form > *,
        .qr-modal-body > * {
          animation: modalItemIn .5s var(--hx-ease, cubic-bezier(.16,1,.3,1)) both;
        }

        .modal-header { animation-delay: .05s; }
        .staff-form > *:nth-child(1) { animation-delay: .12s; }
        .staff-form > *:nth-child(2) { animation-delay: .18s; }
        .staff-form > *:nth-child(3) { animation-delay: .24s; }
        .staff-form > *:nth-child(4) { animation-delay: .3s; }
        .staff-form > *:nth-child(5) { animation-delay: .36s; }
        .qr-modal-body > *:nth-child(1) { animation-delay: .12s; }
        .qr-modal-body > *:nth-child(2) { animation-delay: .2s; }
        .qr-modal-body > *:nth-child(3) { animation-delay: .28s; }
        .qr-modal-body > *:nth-child(4) { animation-delay: .34s; }

        @keyframes modalItemIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px 16px;
          border-bottom: 1px solid var(--hx-line-soft, rgba(14,55,92,.07));
        }

        .modal-header h3 {
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 16px;
          color: var(--hx-cyan, #0b93a6);
        }

        .modal-close-btn {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border: 1px solid var(--hx-line, rgba(14,55,92,.12));
          border-radius: 10px;
          background: rgba(13,35,56,.04);
          color: var(--hx-muted, #55697d);
          cursor: pointer;
          transition: .2s;
        }

        .modal-close-btn:hover {
          background: rgba(13,35,56,.08);
          color: var(--hx-text, #0d2338);
        }

        /* Add Staff Form */
        .staff-form {
          padding: 20px 24px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .staff-form-error {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border: 1px solid rgba(214,69,69,.32);
          border-radius: 10px;
          background: rgba(214,69,69,.08);
          color: #b4372a;
          font-size: 13px;
          font-weight: 600;
        }

        .staff-input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .staff-input-group label {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--hx-muted-strong, #3c516a);
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .06em;
        }

        .staff-input {
          padding: 12px 16px;
          border: 1px solid rgba(14,55,92,.16);
          border-radius: 12px;
          background: var(--hx-panel-strong, #ffffff);
          color: var(--hx-text, #0d2338);
          font-size: 14px;
          outline: none;
          transition: .2s;
          font-family: inherit;
        }

        .staff-input:focus {
          border-color: rgba(11,147,166,.55);
          box-shadow: 0 0 0 3px var(--hx-focus, rgba(11,147,166,.22)), 0 0 16px rgba(23,217,212,.1);
        }

        .staff-input::placeholder {
          color: rgba(13,35,56,.35);
        }

        /* Scoped light re-skin of the shared Button component inside this
           page's modals only (the shared component itself is untouched so
           the 3D booth manager keeps its own styling). */
        .staff-form-actions > button[type="submit"] {
          background: var(--hx-grad-primary, linear-gradient(135deg, #27e8df, #00a8bd 58%, #d3aa56 135%));
          color: #001116;
          box-shadow: 0 12px 35px rgba(0,196,202,.2), inset 0 1px 0 rgba(255,255,255,.42);
        }

        .staff-form-actions > button[type="button"],
        .qr-modal-body .qr-refresh-btn {
          background: var(--hx-panel-strong, #ffffff);
          color: var(--hx-navy, #0c3455);
          border: 1px solid rgba(11,147,166,.35);
        }

        .staff-form-actions > button[type="button"]:hover,
        .qr-modal-body .qr-refresh-btn:hover {
          background: rgba(11,147,166,.07);
        }

        .staff-form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 8px;
        }

        /* QR modal body */
        .qr-modal-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .qr-staff-info {
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
          padding: 12px 16px;
          border: 1px solid var(--hx-line-soft, rgba(14,55,92,.07));
          border-radius: 14px;
          background: rgba(13,35,56,.03);
        }

        .qr-staff-avatar {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: linear-gradient(145deg, rgba(11,147,166,.16), rgba(255,255,255,.9));
          border: 1px solid rgba(11,147,166,.35);
          color: var(--hx-cyan, #0b93a6);
          font-size: 16px;
          font-weight: 800;
        }

        .qr-staff-info div {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .qr-staff-info div strong {
          color: var(--hx-text, #0d2338);
          font-size: 15px;
        }

        .qr-staff-info div span {
          color: var(--hx-muted, #55697d);
          font-size: 12px;
        }

        .qr-code-wrapper {
          position: relative;
          padding: 20px;
          border: 1px solid rgba(11,147,166,.3);
          border-radius: 20px;
          background: var(--hx-panel-strong, #ffffff);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 16px 36px rgba(20,55,95,.12);
        }

        .qr-glow {
          position: absolute;
          inset: -8px;
          border-radius: 26px;
          opacity: 0.15;
          background: radial-gradient(circle at center, #17d9d4, transparent 70%);
          filter: blur(12px);
          pointer-events: none;
          animation: qrGlowBloom 1.8s ease .35s both;
        }

        @keyframes qrGlowBloom {
          0% { opacity: 0; }
          40% { opacity: .4; }
          100% { opacity: .15; }
        }

        .qr-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          color: #7a8ea0;
          padding: 40px;
        }

        .qr-instruction {
          margin: 0;
          text-align: center;
          color: var(--hx-muted, #55697d);
          font-size: 12px;
          line-height: 1.5;
          max-width: 280px;
        }

        .qr-refresh-btn { width: 100%; }

        @media (max-width: 640px) {
          .staff-content { padding: 24px 16px 80px; }
          .staff-hero { flex-direction: column; align-items: flex-start; }
          .staff-hero-copy h1 { font-size: clamp(28px, 8vw, 38px); }
          .staff-summary { flex-direction: column; }
          .staff-email-cell { display: none; }
          .staff-table thead th:nth-child(2) { display: none; }
          .modal-content { width: 96%; }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: .001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .001ms !important;
          }
        }
      `}</style>
    </section>
  );
}