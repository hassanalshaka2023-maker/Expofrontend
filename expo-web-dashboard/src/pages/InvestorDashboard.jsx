import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  CheckCircle,
  Clock,
  MapPin,
  Ruler,
  Shield,
  Sparkles,
  Wallet,
  X,
} from "lucide-react";
import { webApi } from "../services/api";
import SharedExhibitionScene from "../components/exhibition/SharedExhibitionScene";
import BoothRatingSummary from "../components/BoothRatingSummary";
import {
  getInvestorBoothDetails,
  formatBoothPrice,
  formatBoothArea,
  getBoothLocation,
} from "../data/investorBoothDetails";

const spring = {
  type: "spring",
  stiffness: 280,
  damping: 27,
};

function BackgroundParticles() {
  return (
    <div className="investor-particles" aria-hidden="true">
      {Array.from({ length: 20 }).map((_, index) => (
        <motion.span
          key={index}
          style={{
            "--particle-x": `${4 + ((index * 31) % 92)}%`,
            "--particle-y": `${6 + ((index * 43) % 84)}%`,
          }}
          animate={{
            y: [10, -15, 10],
            opacity: [0.06, 0.8, 0.06],
            scale: [0.68, 1.3, 0.68],
          }}
          transition={{
            duration: 4.2 + (index % 4),
            delay: (index % 7) * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* Investor-only "Booth Business Details" group (price / area / location).
 * Values come from the frontend presentation metadata in
 * src/data/investorBoothDetails.js — nothing here is read from or written to
 * the backend. The `key` on the root remounts the group whenever another
 * booth is selected, so the short CSS entrance replays with fresh values
 * (and the page's reduced-motion rule shows final values instantly). */
function BoothBusinessDetails({ boothId }) {
  const meta = getInvestorBoothDetails(boothId);

  return (
    <div className="booth-biz" key={boothId}>
      <div className="biz-heading">
        <span className="biz-heading-line" />
        <span>Booth Business Details</span>
      </div>

      <div className="biz-grid">
        <div className="biz-item biz-price">
          <span className="biz-icon">
            <Wallet />
          </span>
          <span className="biz-label">Booth Price</span>
          <strong className="biz-value">{formatBoothPrice(meta)}</strong>
        </div>

        <div className="biz-item biz-area">
          <span className="biz-icon">
            <Ruler />
          </span>
          <span className="biz-label">Booth Area</span>
          <strong className="biz-value">{formatBoothArea(meta)}</strong>
        </div>

        <div className="biz-item biz-location">
          <span className="biz-icon">
            <MapPin />
          </span>
          <span className="biz-label">Booth Location</span>
          <strong className="biz-value">{getBoothLocation(meta)}</strong>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    Available: {
      label: "Available",
      className: "status-available",
    },
    Pending: {
      label: "Pending Approval",
      className: "status-pending",
    },
    Reserved: {
      label: "Reserved",
      className: "status-reserved",
    },
  };

  const current = config[status] || config.Available;

  return (
    <span className={`investor-status ${current.className}`}>
      <motion.span
        animate={{ opacity: [1, 0.4, 1], scale: [1, 0.7, 1] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      />
      {current.label}
    </span>
  );
}

export default function InvestorDashboard({ user }) {
  const [booths, setBooths] = useState([]);
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchBooths = async () => {
      try {
        const data = await webApi.getBooths();
        setBooths(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load booths:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooths();
  }, []);

  const handleReserve = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const investorData = {
        investorId: user.id,
        companyName: user.companyName,
        category,
        description,
        companyLogo: "",
      };

      await webApi.reserveBooth(selectedBooth.boothId, investorData);

      setMessage(
        `Success! Booth ${selectedBooth.boothId} was reserved for ${user.companyName}.`,
      );

      setSelectedBooth(null);
      setCategory("");
      setDescription("");

      const updatedBooths = await webApi.getBooths();
      setBooths(Array.isArray(updatedBooths) ? updatedBooths : []);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Reservation failed. Please try again.",
      );
    }
  };

  const closePanel = () => setSelectedBooth(null);

  // Latest full record for the selected booth (carries the live visitor-rating
  // totals, which the click payload from the scene does not include).
  const selectedFull =
    selectedBooth && booths.find((b) => b.boothId === selectedBooth.boothId);

  if (loading) {
    return (
      <div className="investor-loader">
        <div className="investor-loader-rings">
          <span />
          <span />
          <span />
          <Building2 />
        </div>

        <p>Loading the investment hall...</p>

        <style>{`
          .investor-loader {
            min-height: 100vh;
            display: grid;
            place-content: center;
            justify-items: center;
            gap: 20px;
            color: var(--hx-muted, #55697d);
            background: var(--hx-bg, #eef4fb);
            font-family: 'Inter', sans-serif;
          }

          .investor-loader-rings {
            width: 115px;
            height: 115px;
            position: relative;
            display: grid;
            place-items: center;
          }

          .investor-loader-rings > span {
            position: absolute;
            inset: 0;
            border: 1px solid transparent;
            border-top-color: #0aa2b4;
            border-right-color: rgba(178,134,45,.5);
            border-radius: 50%;
            animation: investorLoaderSpin 2.2s linear infinite;
          }

          .investor-loader-rings > span:nth-child(2) {
            inset: 13px;
            animation-duration: 1.6s;
            animation-direction: reverse;
          }

          .investor-loader-rings > span:nth-child(3) {
            inset: 27px;
            animation-duration: 1.1s;
          }

          .investor-loader-rings svg {
            width: 34px;
            height: 34px;
            color: #0aa2b4;
          }

          @keyframes investorLoaderSpin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <section className="investor-dashboard" dir="ltr">
      <div className="investor-background" aria-hidden="true">
        <div className="investor-grid" />
        <div className="investor-orb investor-orb-cyan" />
        <div className="investor-orb investor-orb-gold" />
        <BackgroundParticles />

        <div className="investor-wave-lines">
          <span />
          <span />
          <span />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.72, ease: [0.2, 0.8, 0.2, 1] }}
        className="investor-canvas-section"
      >
        <motion.div
          initial={{ opacity: 0, x: -22, filter: "blur(5px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.16 }}
          className="investment-hall-card"
        >
          <motion.div
            className="hall-card-shimmer"
            initial={{ x: "-140%" }}
            animate={{ x: "140%" }}
            transition={{ duration: 4.5, repeat: Infinity, repeatDelay: 2 }}
          />

          <div className="hall-card-label">
            <Sparkles />
            <span>Investor Portal</span>
          </div>

          <h2>Investment Hall</h2>

          <p>
            Drag to rotate the hall and click a booth to review its details.
          </p>

          <div className="hall-card-line" />
        </motion.div>

        <div className="hall-legend">
          <div>
            <span className="legend-available" />
            <small>Available</small>
          </div>

          <div>
            <span className="legend-pending" />
            <small>Pending</small>
          </div>

          <div>
            <span className="legend-reserved" />
            <small>Reserved</small>
          </div>
        </div>

        {/* Shared, identical exhibition scene (same one Admin and the public
            Visitor see). Investor reservation logic stays outside the scene. */}
        <SharedExhibitionScene
          mode="investor"
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
        className="investor-control-panel"
      >
        <div className="panel-orb panel-orb-cyan" />
        <div className="panel-orb panel-orb-gold" />

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -12, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -12, height: 0 }}
              className={`investor-message ${
                message.startsWith("Success")
                  ? "message-success"
                  : "message-error"
              }`}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="investor-panel-content">
          <AnimatePresence mode="wait">
            {!selectedBooth ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 16, filter: "blur(5px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                className="investor-empty-state"
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
                  Click any booth in the 3D hall to review its information.
                  Green booths are available for reservation.
                </p>
              </motion.div>
            ) : selectedBooth.status === "Available" ? (
              <motion.div
                key="reserve"
                initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -18, filter: "blur(4px)" }}
                transition={spring}
                className="reserve-panel"
              >
                <div className="reserve-header">
                  <div className="reserve-header-glow" />

                  <div className="reserve-title">
                    <Shield />
                    <div>
                      <span>Reservation Request</span>
                      <h3>Reserve Booth {selectedBooth.boothId}</h3>
                    </div>
                  </div>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closePanel}
                    className="panel-close"
                  >
                    <X />
                  </motion.button>
                </div>

                <BoothBusinessDetails boothId={selectedBooth.boothId} />

                <form onSubmit={handleReserve} className="reservation-form">
                  <div className="form-field">
                    <label>Applicant Company</label>

                    <div className="readonly-field">
                      <Building2 />
                      <span>{user.companyName}</span>
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="company-category">
                      Company Business Category
                    </label>

                    <div className="input-wrapper">
                      <Sparkles />

                      <input
                        id="company-category"
                        type="text"
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                        required
                        placeholder="Example: Software solutions and AI"
                      />

                      <span className="input-light" />
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="booth-description">
                      Booth Marketing Description
                    </label>

                    <div className="textarea-wrapper">
                      <textarea
                        id="booth-description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        required
                        rows={5}
                        placeholder="Write an attractive description visitors will see when they select your booth..."
                      />

                      <span className="input-light" />
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ y: -3, scale: 1.01 }}
                    whileTap={{ scale: 0.97 }}
                    className="reserve-button"
                  >
                    <span className="button-shimmer" />
                    <Sparkles />
                    <span>Confirm Booth Reservation</span>
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -18, filter: "blur(4px)" }}
                transition={spring}
                className="details-panel"
              >
                <div className="details-header">
                  <div className="details-title">
                    <MapPin />
                    <div>
                      <span>Booth Information</span>
                      <h3>Booth {selectedBooth.boothId}</h3>
                    </div>
                  </div>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closePanel}
                    className="panel-close"
                  >
                    <X />
                  </motion.button>
                </div>

                <StatusBadge status={selectedBooth.status} />

                <BoothBusinessDetails boothId={selectedBooth.boothId} />

                {selectedBooth.companyDetails && (
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 }}
                    whileHover={{ y: -4 }}
                    className="company-details-card"
                  >
                    <div className="company-card-orb company-card-orb-cyan" />
                    <div className="company-card-orb company-card-orb-gold" />

                    <motion.div
                      className="company-card-shimmer"
                      initial={{ x: "-140%" }}
                      animate={{ x: "140%" }}
                      transition={{
                        duration: 4.2,
                        repeat: Infinity,
                        repeatDelay: 2,
                      }}
                    />

                    <div className="company-details-main">
                      <motion.div
                        whileHover={{ rotate: 4, scale: 1.05 }}
                        className="company-details-icon"
                      >
                        <Building2 />
                      </motion.div>

                      <div>
                        <span>Investor Company</span>
                        <strong>
                          {selectedBooth.companyDetails.companyName || "—"}
                        </strong>
                      </div>
                    </div>

                    <div className="company-info-box">
                      <span>Category</span>
                      <strong>
                        <Sparkles />
                        {selectedBooth.companyDetails.category ||
                          "Not specified"}
                      </strong>
                    </div>

                    {selectedBooth.companyDetails.description && (
                      <div className="company-description">
                        <span>Business Description</span>
                        <p>{selectedBooth.companyDetails.description}</p>
                      </div>
                    )}
                  </motion.div>
                )}

                <BoothRatingSummary
                  ratingSum={selectedFull?.ratingSum || 0}
                  ratingCount={selectedFull?.ratingCount || 0}
                />

                {selectedBooth.status === "Reserved" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="booth-state-message reserved-message"
                  >
                    <CheckCircle />
                    This booth is currently reserved and cannot be booked.
                  </motion.div>
                )}

                {selectedBooth.status === "Pending" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="booth-state-message pending-message"
                  >
                    <Clock />
                    This booth is waiting for administrator approval.
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Montserrat:wght@400;500;600;700&display=swap');

        * {
          box-sizing: border-box;
        }

        .investor-dashboard {
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

        .investor-background {
          position: fixed;
          inset: 0;
          z-index: -1;
          overflow: hidden;
          pointer-events: none;
        }

        .investor-grid {
          position: absolute;
          inset: 0;
          opacity: .5;
          background-image:
            linear-gradient(rgba(11,147,166,.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(11,147,166,.05) 1px, transparent 1px);
          background-size: 78px 78px;
          animation: investorGridMove 32s linear infinite;
        }

        .investor-orb,
        .panel-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(110px);
          pointer-events: none;
        }

        .investor-orb-cyan {
          width: 520px;
          height: 520px;
          right: -180px;
          top: 90px;
          opacity: .16;
          background: #17d9d4;
          animation: investorCyanOrb 15s ease-in-out infinite alternate;
        }

        .investor-orb-gold {
          width: 420px;
          height: 420px;
          left: -170px;
          bottom: -120px;
          opacity: .14;
          background: #e6be6a;
          animation: investorGoldOrb 13s ease-in-out infinite alternate;
        }

        .investor-particles {
          position: absolute;
          inset: 0;
        }

        .investor-particles span {
          position: absolute;
          left: var(--particle-x);
          top: var(--particle-y);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #d2aa55;
          box-shadow: 0 0 11px rgba(210,170,85,.6);
        }

        .investor-wave-lines {
          width: 66%;
          height: 145px;
          position: absolute;
          left: 16%;
          top: 85px;
          opacity: .5;
        }

        .investor-wave-lines span {
          position: absolute;
          width: 100%;
          height: 68px;
          border-top: 1px solid rgba(169,121,31,.26);
          border-radius: 50%;
          animation: investorWaveMove 6.5s ease-in-out infinite;
        }

        .investor-wave-lines span:nth-child(2) {
          top: 22px;
          opacity: .55;
          animation-delay: -1.2s;
        }

        .investor-wave-lines span:nth-child(3) {
          top: 44px;
          opacity: .28;
          animation-delay: -2.4s;
        }

        .investor-canvas-section {
          min-width: 0;
          height: 100vh;
          position: relative;
          flex: 1;
          overflow: hidden;
          border-right: 1px solid var(--hx-line, rgba(14,55,92,.12));
          background:
            radial-gradient(circle at 70% 20%, rgba(10,162,180,.1), transparent 35%),
            var(--hx-bg, #eef4fb);
        }

        .investment-hall-card {
          min-width: 320px;
          position: absolute;
          left: 22px;
          top: 22px;
          z-index: 10;
          overflow: hidden;
          padding: 17px 19px;
          border: 1px solid rgba(11,147,166,.3);
          border-radius: 18px;
          background:
            linear-gradient(145deg, rgba(255,255,255,.92), rgba(243,248,253,.88));
          backdrop-filter: blur(20px);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.9),
            0 18px 42px rgba(20,55,95,.12);
        }

        .hall-card-shimmer,
        .company-card-shimmer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(120deg, transparent 20%, rgba(11,147,166,.06), transparent 70%);
        }

        .hall-card-label {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--hx-gold, #a9791f);
        }

        .hall-card-label svg {
          width: 14px;
          height: 14px;
        }

        .hall-card-label span {
          padding: 5px 9px;
          border: 1px solid rgba(169,121,31,.25);
          border-radius: 999px;
          background: rgba(210,170,85,.12);
          font-size: 9px;
          font-weight: 750;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .investment-hall-card h2 {
          margin: 10px 0 0;
          position: relative;
          z-index: 2;
          color: var(--hx-text, #0d2338);
          font-size: 21px;
        }

        .investment-hall-card p {
          margin: 7px 0 0;
          position: relative;
          z-index: 2;
          color: var(--hx-muted, #55697d);
          font-size: 11px;
        }

        .hall-card-line {
          width: 70px;
          height: 2px;
          margin-top: 12px;
          position: relative;
          z-index: 2;
          border-radius: 999px;
          background: linear-gradient(90deg, #0aa2b4, #d2aa55);
          box-shadow: 0 0 12px rgba(23,217,212,.25);
        }

        .hall-legend {
          position: absolute;
          left: 22px;
          top: 174px;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 17px;
          padding: 11px 15px;
          border: 1px solid var(--hx-line, rgba(14,55,92,.12));
          border-radius: 15px;
          background: rgba(255,255,255,.88);
          backdrop-filter: blur(18px);
        }

        .hall-legend > div {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .hall-legend span {
          width: 9px;
          height: 9px;
          border-radius: 50%;
        }

        .hall-legend small {
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

        .investor-control-panel {
          width: 450px;
          height: 100vh;
          position: relative;
          display: flex;
          flex: 0 0 auto;
          flex-direction: column;
          overflow: hidden;
          background:
            linear-gradient(180deg, rgba(255,255,255,.96), rgba(243,248,253,.98));
          backdrop-filter: blur(24px);
          box-shadow: -22px 0 50px rgba(20,55,95,.1);
        }

        .panel-orb-cyan {
          width: 250px;
          height: 250px;
          right: -90px;
          top: -80px;
          opacity: .14;
          background: #17d9d4;
        }

        .panel-orb-gold {
          width: 230px;
          height: 230px;
          left: -90px;
          bottom: -90px;
          opacity: .12;
          background: #e6be6a;
        }

        .investor-message {
          position: relative;
          z-index: 3;
          margin: 18px 20px 0;
          padding: 14px;
          overflow: hidden;
          border: 1px solid;
          border-radius: 14px;
          text-align: center;
          font-size: 12px;
          font-weight: 700;
        }

        .message-success {
          color: #067a53;
          border-color: rgba(15,157,118,.3);
          background: rgba(15,157,118,.1);
        }

        .message-error {
          color: #b4372a;
          border-color: rgba(214,69,69,.28);
          background: rgba(214,69,69,.08);
        }

        .investor-panel-content {
          position: relative;
          z-index: 2;
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          scrollbar-width: thin;
          scrollbar-color: rgba(10,162,180,.4) rgba(13,35,56,.05);
        }

        .investor-panel-content::-webkit-scrollbar {
          width: 7px;
        }

        .investor-panel-content::-webkit-scrollbar-track {
          background: rgba(13,35,56,.05);
        }

        .investor-panel-content::-webkit-scrollbar-thumb {
          border-radius: 999px;
          background:
            linear-gradient(180deg, rgba(10,162,180,.45), rgba(210,170,85,.4));
        }

        .investor-empty-state {
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

        .investor-empty-state h3 {
          margin: 0 0 10px;
          color: var(--hx-text, #0d2338);
          font-size: 17px;
        }

        .investor-empty-state p {
          max-width: 315px;
          margin: 0;
          color: #7a8ea0;
          font-size: 12px;
          line-height: 1.65;
        }

        .reserve-panel,
        .details-panel {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .reserve-header,
        .details-header {
          min-height: 78px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          overflow: hidden;
          padding: 16px 18px;
          border: 1px solid rgba(11,147,166,.28);
          border-radius: 18px;
          background:
            linear-gradient(145deg, rgba(23,217,212,.1), rgba(210,170,85,.08));
        }

        .reserve-header-glow {
          width: 130px;
          height: 130px;
          position: absolute;
          left: -60px;
          top: -70px;
          border-radius: 50%;
          background: rgba(210,170,85,.14);
          filter: blur(35px);
        }

        .reserve-title,
        .details-title {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .reserve-title > svg,
        .details-title > svg {
          width: 22px;
          height: 22px;
          color: #b0832e;
        }

        .details-title > svg {
          color: var(--hx-cyan, #0b93a6);
        }

        .reserve-title div,
        .details-title div {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .reserve-title span,
        .details-title span {
          color: var(--hx-gold, #a9791f);
          font-size: 9px;
          font-weight: 750;
          letter-spacing: .09em;
          text-transform: uppercase;
        }

        .details-title span {
          color: var(--hx-cyan, #0b93a6);
        }

        .reserve-title h3,
        .details-title h3 {
          margin: 0;
          color: var(--hx-text, #0d2338);
          font-size: 16px;
        }

        .panel-close {
          width: 38px;
          height: 38px;
          position: relative;
          z-index: 2;
          display: grid;
          place-items: center;
          border: 1px solid var(--hx-line, rgba(14,55,92,.12));
          border-radius: 50%;
          color: var(--hx-muted, #55697d);
          background: var(--hx-panel-strong, #ffffff);
          cursor: pointer;
          transition: .3s ease;
        }

        .panel-close:hover {
          color: var(--hx-text, #0d2338);
          border-color: rgba(11,147,166,.35);
        }

        .panel-close svg {
          width: 17px;
          height: 17px;
        }

        .reservation-form {
          display: flex;
          flex-direction: column;
          gap: 17px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .form-field label {
          color: var(--hx-muted-strong, #3c516a);
          font-size: 11px;
          font-weight: 650;
        }

        .readonly-field {
          min-height: 54px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 15px;
          border: 1px solid var(--hx-line, rgba(14,55,92,.12));
          border-radius: 15px;
          color: var(--hx-muted, #55697d);
          background: rgba(13,35,56,.03);
          font-size: 12px;
        }

        .readonly-field svg {
          width: 17px;
          height: 17px;
          color: #b0832e;
        }

        .input-wrapper,
        .textarea-wrapper {
          position: relative;
        }

        .input-wrapper > svg {
          width: 17px;
          height: 17px;
          position: absolute;
          left: 15px;
          top: 50%;
          z-index: 2;
          transform: translateY(-50%);
          color: var(--hx-cyan, #0b93a6);
        }

        .input-wrapper input,
        .textarea-wrapper textarea {
          width: 100%;
          outline: none;
          border: 1px solid rgba(14,55,92,.16);
          border-radius: 15px;
          color: var(--hx-text, #0d2338);
          background: var(--hx-panel-strong, #ffffff);
          font-family: inherit;
          font-size: 12px;
          transition: .3s ease;
        }

        .input-wrapper input {
          min-height: 54px;
          padding: 0 15px 0 44px;
        }

        .textarea-wrapper textarea {
          padding: 14px 15px;
          resize: vertical;
          line-height: 1.65;
        }

        .input-wrapper input::placeholder,
        .textarea-wrapper textarea::placeholder {
          color: rgba(13,35,56,.35);
        }

        .input-wrapper input:focus,
        .textarea-wrapper textarea:focus {
          border-color: rgba(11,147,166,.55);
          box-shadow:
            0 0 0 4px var(--hx-focus, rgba(11,147,166,.22)),
            0 0 24px rgba(23,217,212,.1);
        }

        .input-light {
          height: 2px;
          position: absolute;
          left: 16px;
          right: 16px;
          bottom: 0;
          opacity: 0;
          transform: scaleX(.4);
          border-radius: 999px;
          background:
            linear-gradient(90deg, transparent, #0aa2b4, #d2aa55, transparent);
          box-shadow: 0 0 16px rgba(23,217,212,.3);
          transition: .3s ease;
        }

        .input-wrapper:focus-within .input-light,
        .textarea-wrapper:focus-within .input-light {
          opacity: 1;
          transform: scaleX(1);
        }

        .reserve-button {
          min-height: 57px;
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          overflow: hidden;
          border: 1px solid rgba(10,162,180,.45);
          border-radius: 16px;
          color: #001116;
          background:
            linear-gradient(135deg, #27e8df, #00a8bd 58%, #d3aa56 135%);
          box-shadow:
            0 12px 35px rgba(0,196,202,.2),
            inset 0 1px 0 rgba(255,255,255,.42);
          font-size: 13px;
          font-weight: 750;
          cursor: pointer;
        }

        .reserve-button svg,
        .reserve-button > span:last-child {
          position: relative;
          z-index: 2;
        }

        .reserve-button svg {
          width: 18px;
          height: 18px;
        }

        .button-shimmer {
          position: absolute !important;
          inset: 0;
          z-index: 1 !important;
          background:
            linear-gradient(120deg, transparent 24%, rgba(255,255,255,.16), transparent 72%);
          transform: translateX(-140%);
          animation: investorButtonShimmer 3.8s ease-in-out infinite;
        }

        /* --- Booth Business Details (Investor-only presentation data) --- */
        .booth-biz {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .biz-heading {
          display: flex;
          align-items: center;
          gap: 9px;
          color: var(--hx-gold, #a9791f);
          font-size: 9px;
          font-weight: 750;
          letter-spacing: .1em;
          text-transform: uppercase;
          animation: bizItemIn .4s var(--hx-ease, cubic-bezier(.16,1,.3,1)) both;
        }

        .biz-heading-line {
          width: 26px;
          height: 2px;
          border-radius: 999px;
          background: linear-gradient(90deg, #0aa2b4, #d2aa55);
          box-shadow: 0 0 10px rgba(23,217,212,.25);
        }

        .biz-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .biz-item {
          --biz-accent: #0b93a6;
          --biz-accent-rgb: 11,147,166;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 6px;
          overflow: hidden;
          padding: 13px 14px 14px;
          border: 1px solid rgba(var(--biz-accent-rgb), .26);
          border-radius: 14px;
          background:
            linear-gradient(150deg, rgba(var(--biz-accent-rgb), .07), rgba(255,255,255,.92));
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.9),
            0 10px 24px rgba(20,55,95,.08);
          animation: bizItemIn .45s var(--hx-ease, cubic-bezier(.16,1,.3,1)) both;
          transition: border-color .25s ease, box-shadow .25s ease;
        }

        .biz-item:hover {
          border-color: rgba(var(--biz-accent-rgb), .5);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.9),
            0 14px 28px rgba(20,55,95,.12),
            0 0 18px rgba(var(--biz-accent-rgb), .12);
        }

        /* Small accent line along the top of each card */
        .biz-item::before {
          content: "";
          position: absolute;
          left: 12px;
          right: 55%;
          top: 0;
          height: 2px;
          border-radius: 999px;
          background: linear-gradient(90deg, rgba(var(--biz-accent-rgb), .75), transparent);
        }

        .biz-item:nth-child(1) { animation-delay: .05s; }
        .biz-item:nth-child(2) { animation-delay: .11s; }
        .biz-item:nth-child(3) { animation-delay: .17s; }

        @keyframes bizItemIn {
          from { opacity: 0; transform: translateY(10px) scale(.985); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .biz-price {
          --biz-accent: #0b93a6;
          --biz-accent-rgb: 11,147,166;
        }

        .biz-area {
          --biz-accent: #7c5cff;
          --biz-accent-rgb: 124,92,255;
        }

        .biz-location {
          --biz-accent: #ff5fa2;
          --biz-accent-rgb: 255,95,162;
          grid-column: 1 / -1;
        }

        .biz-icon {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(var(--biz-accent-rgb), .3);
          border-radius: 10px;
          color: var(--biz-accent);
          background: rgba(var(--biz-accent-rgb), .1);
        }

        .biz-icon svg {
          width: 15px;
          height: 15px;
        }

        .biz-label {
          color: var(--hx-muted-strong, #3c516a);
          font-size: 9px;
          font-weight: 750;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .biz-value {
          color: var(--hx-text, #0d2338);
          font-size: 14px;
          font-weight: 750;
          line-height: 1.45;
          overflow-wrap: anywhere;
          font-variant-numeric: tabular-nums;
        }

        .biz-price .biz-value {
          color: var(--hx-cyan-deep, #076e7e);
          font-size: 17px;
        }

        @media (max-width: 400px) {
          .biz-grid {
            grid-template-columns: 1fr;
          }

          .biz-location {
            grid-column: auto;
          }
        }

        .investor-status {
          width: fit-content;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 12px;
          border: 1px solid;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 700;
        }

        .investor-status > span {
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

        .company-details-card {
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

        .company-card-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
          pointer-events: none;
        }

        .company-card-orb-cyan {
          width: 130px;
          height: 130px;
          right: -55px;
          top: -55px;
          background: rgba(23,217,212,.14);
        }

        .company-card-orb-gold {
          width: 120px;
          height: 120px;
          left: -55px;
          bottom: -55px;
          background: rgba(210,170,85,.12);
        }

        .company-details-main {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .company-details-icon {
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

        .company-details-icon svg {
          width: 25px;
          height: 25px;
        }

        .company-details-main > div:last-child {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .company-details-main span,
        .company-info-box > span,
        .company-description > span {
          color: var(--hx-gold, #a9791f);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
        }

        .company-details-main strong {
          overflow: hidden;
          color: var(--hx-text, #0d2338);
          font-size: 16px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .company-info-box,
        .company-description {
          position: relative;
          z-index: 2;
          margin-top: 14px;
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

        .company-description p {
          margin: 8px 0 0;
          color: var(--hx-muted, #55697d);
          font-size: 12px;
          line-height: 1.65;
        }

        .booth-state-message {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 15px;
          border: 1px solid;
          border-radius: 13px;
          text-align: center;
          font-size: 12px;
          font-weight: 700;
        }

        .booth-state-message svg {
          width: 16px;
          height: 16px;
        }

        .reserved-message {
          color: #b4372a;
          border-color: rgba(214,69,69,.22);
          background: rgba(214,69,69,.06);
        }

        .pending-message {
          color: #a9791f;
          border-color: rgba(169,121,31,.25);
          background: rgba(210,170,85,.12);
        }

        @keyframes investorGridMove {
          to { transform: translate(78px, 78px); }
        }

        @keyframes investorCyanOrb {
          to { transform: translate(-80px, 70px) scale(1.13); }
        }

        @keyframes investorGoldOrb {
          to { transform: translate(90px, -70px) scale(1.1); }
        }

        @keyframes investorWaveMove {
          0%,100% { transform: translateX(-3%) scaleX(.97); opacity: .3; }
          50% { transform: translateX(3%) scaleX(1.04); opacity: 1; }
        }

        @keyframes investorButtonShimmer {
          0%,55% { transform: translateX(-140%); }
          82%,100% { transform: translateX(140%); }
        }

        @media (max-width: 920px) {
          .investor-dashboard {
            flex-direction: column;
            overflow: visible;
          }

          .investor-canvas-section {
            width: 100%;
            height: 52vh;
            min-height: 500px;
            flex: none;
            border-right: 0;
            border-bottom: 1px solid var(--hx-line, rgba(14,55,92,.12));
          }

          .investor-control-panel {
            width: 100%;
            height: auto;
            min-height: 580px;
          }
        }

        @media (max-width: 620px) {
          .investor-canvas-section {
            min-height: 560px;
          }

          .investment-hall-card {
            min-width: 0;
            left: 14px;
            right: 14px;
            top: 14px;
          }

          .hall-legend {
            left: 14px;
            top: 184px;
            gap: 10px;
          }

          .investor-panel-content {
            padding: 18px;
          }

          .reserve-header,
          .details-header {
            padding: 14px;
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
