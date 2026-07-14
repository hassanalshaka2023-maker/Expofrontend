import { useEffect, useState, useCallback } from "react";
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

function StaffRow({ staff, onShowQR }) {
  return (
    <motion.tr
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.97 }}
      transition={spring}
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
                      bgColor="#03101e"
                      fgColor="#20d8dc"
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
              <strong>{staff.length}</strong>
            </div>
          </div>
          <div className="summary-card summary-card-inside">
            <CheckCircle className="h-5 w-5" />
            <div>
              <span>Inside</span>
              <strong>{staff.filter((s) => s.isInside).length}</strong>
            </div>
          </div>
          <div className="summary-card summary-card-outside">
            <X className="h-5 w-5" />
            <div>
              <span>Outside</span>
              <strong>{staff.filter((s) => !s.isInside).length}</strong>
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
                  {staff.map((member) => (
                    <StaffRow
                      key={member._id}
                      staff={member}
                      onShowQR={setSelectedStaff}
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
          color: #f6f9fd;
          font-family: 'Inter', sans-serif;
          background: #020914;
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
          opacity: 0.18;
          background-image:
            linear-gradient(rgba(32,216,220,.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(32,216,220,.04) 1px, transparent 1px);
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
          opacity: .1;
          background: #09b8c6;
          animation: staffCyanOrb 15s ease-in-out infinite alternate;
        }

        .staff-orb-gold {
          width: 380px;
          height: 380px;
          left: -140px;
          bottom: -100px;
          opacity: .08;
          background: #c87835;
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
          background: #e5a052;
          box-shadow: 0 0 11px rgba(229,160,82,.75);
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

        .staff-hero-copy h1 span { color: #f4f6fa; }
        .staff-hero-copy h1 em {
          color: #20d8dc;
          font-style: normal;
          font-weight: 600;
          text-shadow: 0 0 28px rgba(32,216,220,.16);
        }

        .staff-hero-copy p {
          margin: 16px 0 0;
          color: rgba(181,197,215,.62);
          font-size: 15px;
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
          background: #e5a052;
          box-shadow: 0 0 12px rgba(229,160,82,.55);
        }

        .staff-hero-line {
          width: 64px;
          height: 1px;
          background: linear-gradient(90deg, #d99145, transparent);
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
          border: 1px solid rgba(32,216,220,.5);
          border-radius: 16px;
          background: linear-gradient(145deg, rgba(8,38,53,.88), rgba(3,17,30,.92));
          color: #20d8dc;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.05);
          transition: .3s ease;
          overflow: hidden;
        }

        .add-staff-btn:hover {
          border-color: rgba(32,216,220,.85);
          box-shadow: 0 0 28px rgba(32,216,220,.12);
          transform: translateY(-2px);
        }

        .add-staff-ring {
          position: absolute;
          inset: -6px;
          border-radius: 20px;
          border: 1px solid rgba(32,216,220,.2);
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
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 12px;
          background: rgba(255,255,255,.035);
          color: rgba(203,216,231,.6);
          cursor: pointer;
          transition: .25s ease;
        }

        .staff-refresh-btn:hover {
          border-color: rgba(32,216,220,.3);
          color: #20d8dc;
        }

        .staff-summary {
          display: flex;
          gap: 18px;
          margin-bottom: 28px;
          animation: heroEnter .7s .12s ease both;
        }

        .summary-card {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px 22px;
          border: 1px solid rgba(32,216,220,.35);
          border-radius: 16px;
          background: linear-gradient(145deg, rgba(8,38,53,.8), rgba(3,17,30,.9));
          box-shadow: inset 0 1px 0 rgba(255,255,255,.04);
          color: #20d8dc;
        }

        .summary-card-inside {
          border-color: rgba(22,216,160,.35);
          color: #16d8a0;
        }

        .summary-card-outside {
          border-color: rgba(255,112,89,.35);
          color: #ff7059;
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
          border: 1px solid rgba(32,216,220,.25);
          border-radius: 20px;
          background: linear-gradient(160deg, rgba(7,25,41,.85), rgba(3,15,28,.92));
          box-shadow: inset 0 1px 0 rgba(255,255,255,.04), 0 18px 42px rgba(0,0,0,.25);
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
          color: rgba(203,216,231,.5);
          border-bottom: 1px solid rgba(77,143,164,.19);
          background: rgba(8,28,45,.55);
        }

        .staff-row {
          border-bottom: 1px solid rgba(255,255,255,.04);
          transition: background .2s;
        }

        .staff-row:hover { background: rgba(32,216,220,.03); }

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
          background: linear-gradient(145deg, rgba(32,216,220,.2), rgba(3,27,42,.8));
          border: 1px solid rgba(32,216,220,.3);
          color: #20d8dc;
          font-size: 14px;
          font-weight: 800;
        }

        .staff-name-cell strong {
          color: #f4f6fa;
          font-size: 14px;
        }

        .staff-email-cell {
          color: rgba(203,216,231,.55);
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
          color: #16d8a0;
          background: rgba(22,216,160,.1);
          border: 1px solid rgba(22,216,160,.25);
        }

        .status-chip.outside {
          color: rgba(203,216,231,.5);
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.08);
        }

        .status-chip .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .status-chip.inside .status-dot {
          background: #16d8a0;
          box-shadow: 0 0 8px rgba(22,216,160,.6);
          animation: livePulse 1.5s ease-in-out infinite;
        }

        @keyframes livePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .35; }
        }

        .status-chip.outside .status-dot {
          background: rgba(203,216,231,.35);
        }

        .qr-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border: 1px solid rgba(32,216,220,.3);
          border-radius: 10px;
          background: rgba(32,216,220,.07);
          color: #20d8dc;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: .25s ease;
        }

        .qr-action-btn:hover {
          background: rgba(32,216,220,.14);
          border-color: rgba(32,216,220,.55);
          box-shadow: 0 0 18px rgba(32,216,220,.1);
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
          color: rgba(203,216,231,.45);
        }

        .staff-empty h3 {
          margin: 0;
          color: rgba(241,246,252,.7);
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
          color: rgba(203,216,231,.55);
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
          border-top-color: #20d8dc;
          border-right-color: rgba(217,145,69,.48);
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
          border: 1px solid rgba(255,112,89,.25);
          border-radius: 20px;
          color: #ff7059;
          background: rgba(255,112,89,.08);
        }

        .staff-error-content h2 {
          margin: 0 0 10px;
          color: white;
          font-size: 20px;
        }

        .staff-error-content p {
          margin: 0 0 24px;
          color: rgba(188,203,220,.6);
          font-size: 14px;
        }

        /* ===== MODALS - FIXED CENTERING ===== */
        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 200;
          background: rgba(0,0,0,.65);
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
          border: 1px solid rgba(32,216,220,.3);
          border-radius: 22px;
          background: linear-gradient(160deg, #061523, #03101e);
          box-shadow: 0 32px 64px rgba(0,0,0,.45), 0 0 48px rgba(32,216,220,.06);
          pointer-events: auto;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px 16px;
          border-bottom: 1px solid rgba(255,255,255,.06);
        }

        .modal-header h3 {
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 16px;
          color: #20d8dc;
        }

        .modal-close-btn {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 10px;
          background: rgba(255,255,255,.035);
          color: rgba(203,216,231,.6);
          cursor: pointer;
          transition: .2s;
        }

        .modal-close-btn:hover {
          background: rgba(255,255,255,.07);
          color: white;
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
          border: 1px solid rgba(255,112,89,.35);
          border-radius: 10px;
          background: rgba(255,112,89,.08);
          color: #ff7059;
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
          color: rgba(203,216,231,.6);
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .06em;
        }

        .staff-input {
          padding: 12px 16px;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 12px;
          background: rgba(255,255,255,.035);
          color: #f4f6fa;
          font-size: 14px;
          outline: none;
          transition: .2s;
          font-family: inherit;
        }

        .staff-input:focus {
          border-color: rgba(32,216,220,.5);
          box-shadow: 0 0 16px rgba(32,216,220,.06);
        }

        .staff-input::placeholder {
          color: rgba(203,216,231,.3);
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
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 14px;
          background: rgba(255,255,255,.025);
        }

        .qr-staff-avatar {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: linear-gradient(145deg, rgba(32,216,220,.25), rgba(3,27,42,.8));
          border: 1px solid rgba(32,216,220,.35);
          color: #20d8dc;
          font-size: 16px;
          font-weight: 800;
        }

        .qr-staff-info div {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .qr-staff-info div strong {
          color: #f4f6fa;
          font-size: 15px;
        }

        .qr-staff-info div span {
          color: rgba(203,216,231,.5);
          font-size: 12px;
        }

        .qr-code-wrapper {
          position: relative;
          padding: 20px;
          border: 1px solid rgba(32,216,220,.25);
          border-radius: 20px;
          background: rgba(3,16,30,.8);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .qr-glow {
          position: absolute;
          inset: -8px;
          border-radius: 26px;
          opacity: 0.15;
          background: radial-gradient(circle at center, #20d8dc, transparent 70%);
          filter: blur(12px);
          pointer-events: none;
        }

        .qr-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          color: rgba(203,216,231,.4);
          padding: 40px;
        }

        .qr-instruction {
          margin: 0;
          text-align: center;
          color: rgba(203,216,231,.55);
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
      `}</style>
    </section>
  );
}