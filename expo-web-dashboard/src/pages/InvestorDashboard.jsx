import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  CheckCircle,
  Clock,
  MapPin,
  Shield,
  Sparkles,
  X,
} from "lucide-react";
import { webApi } from "../services/api";
import SharedExhibitionScene from "../components/exhibition/SharedExhibitionScene";
import BoothRatingSummary from "../components/BoothRatingSummary";

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
            color: rgba(203,216,231,.55);
            background: #020914;
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
            border-top-color: #20d8dc;
            border-right-color: rgba(217,145,69,.48);
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
            color: #20d8dc;
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
          color: #f6f9fd;
          background: #020914;
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
          opacity: .18;
          background-image:
            linear-gradient(rgba(32,216,220,.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(32,216,220,.04) 1px, transparent 1px);
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
          opacity: .11;
          background: #09b8c6;
          animation: investorCyanOrb 15s ease-in-out infinite alternate;
        }

        .investor-orb-gold {
          width: 420px;
          height: 420px;
          left: -170px;
          bottom: -120px;
          opacity: .08;
          background: #c87835;
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
          background: #e5a052;
          box-shadow: 0 0 11px rgba(229,160,82,.75);
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
          border-top: 1px solid rgba(217,145,69,.3);
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
          border-right: 1px solid rgba(32,216,220,.18);
          background:
            radial-gradient(circle at 70% 20%, rgba(5,79,91,.12), transparent 35%),
            #020914;
        }

        .investment-hall-card {
          min-width: 320px;
          position: absolute;
          left: 22px;
          top: 22px;
          z-index: 10;
          overflow: hidden;
          padding: 17px 19px;
          border: 1px solid rgba(32,216,220,.28);
          border-radius: 18px;
          background:
            linear-gradient(145deg, rgba(8,38,53,.88), rgba(3,17,30,.92));
          backdrop-filter: blur(20px);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.05),
            0 18px 42px rgba(0,0,0,.28);
        }

        .hall-card-shimmer,
        .company-card-shimmer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(120deg, transparent 20%, rgba(255,255,255,.07), transparent 70%);
        }

        .hall-card-label {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #e3a04f;
        }

        .hall-card-label svg {
          width: 14px;
          height: 14px;
        }

        .hall-card-label span {
          padding: 5px 9px;
          border: 1px solid rgba(227,160,79,.2);
          border-radius: 999px;
          background: rgba(227,160,79,.075);
          font-size: 9px;
          font-weight: 750;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .investment-hall-card h2 {
          margin: 10px 0 0;
          position: relative;
          z-index: 2;
          color: white;
          font-size: 21px;
        }

        .investment-hall-card p {
          margin: 7px 0 0;
          position: relative;
          z-index: 2;
          color: rgba(181,197,215,.58);
          font-size: 11px;
        }

        .hall-card-line {
          width: 70px;
          height: 2px;
          margin-top: 12px;
          position: relative;
          z-index: 2;
          border-radius: 999px;
          background: linear-gradient(90deg, #20d8dc, #d99145);
          box-shadow: 0 0 12px rgba(32,216,220,.2);
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
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 15px;
          background: rgba(3,20,34,.8);
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
          color: rgba(183,198,216,.58);
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
            linear-gradient(90deg, transparent, rgba(32,216,220,.8), rgba(217,145,69,.65), transparent);
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
            linear-gradient(180deg, rgba(6,24,39,.97), rgba(2,13,25,.99));
          backdrop-filter: blur(24px);
          box-shadow: -22px 0 50px rgba(0,0,0,.24);
        }

        .panel-orb-cyan {
          width: 250px;
          height: 250px;
          right: -90px;
          top: -80px;
          opacity: .08;
          background: #20d8dc;
        }

        .panel-orb-gold {
          width: 230px;
          height: 230px;
          left: -90px;
          bottom: -90px;
          opacity: .06;
          background: #d99145;
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
          color: #16d8a0;
          border-color: rgba(22,216,160,.25);
          background: rgba(22,216,160,.075);
        }

        .message-error {
          color: #ff755f;
          border-color: rgba(255,117,95,.25);
          background: rgba(255,117,95,.075);
        }

        .investor-panel-content {
          position: relative;
          z-index: 2;
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          scrollbar-width: thin;
          scrollbar-color: rgba(32,216,220,.3) rgba(255,255,255,.02);
        }

        .investor-panel-content::-webkit-scrollbar {
          width: 7px;
        }

        .investor-panel-content::-webkit-scrollbar-track {
          background: rgba(255,255,255,.02);
        }

        .investor-panel-content::-webkit-scrollbar-thumb {
          border-radius: 999px;
          background:
            linear-gradient(180deg, rgba(32,216,220,.48), rgba(217,145,69,.42));
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
          border-top-color: #20d8dc;
          border-right-color: rgba(217,145,69,.42);
          border-radius: 50%;
        }

        .empty-booth-orbit > span:nth-child(2) {
          inset: 15px;
          border-top-color: transparent;
          border-right-color: transparent;
          border-bottom-color: rgba(32,216,220,.48);
          border-left-color: #e3a04f;
        }

        .empty-booth-orbit > div {
          width: 66px;
          height: 66px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(32,216,220,.24);
          border-radius: 19px;
          color: rgba(32,216,220,.7);
          background:
            linear-gradient(145deg, rgba(32,216,220,.12), rgba(217,145,69,.05));
          box-shadow: 0 0 28px rgba(32,216,220,.08);
        }

        .empty-booth-orbit svg {
          width: 36px;
          height: 36px;
        }

        .investor-empty-state h3 {
          margin: 0 0 10px;
          color: white;
          font-size: 17px;
        }

        .investor-empty-state p {
          max-width: 315px;
          margin: 0;
          color: rgba(168,185,205,.48);
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
          border: 1px solid rgba(32,216,220,.22);
          border-radius: 18px;
          background:
            linear-gradient(145deg, rgba(32,216,220,.08), rgba(217,145,69,.055));
        }

        .reserve-header-glow {
          width: 130px;
          height: 130px;
          position: absolute;
          left: -60px;
          top: -70px;
          border-radius: 50%;
          background: rgba(217,145,69,.1);
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
          color: #e3a04f;
        }

        .details-title > svg {
          color: #20d8dc;
        }

        .reserve-title div,
        .details-title div {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .reserve-title span,
        .details-title span {
          color: rgba(227,160,79,.72);
          font-size: 9px;
          font-weight: 750;
          letter-spacing: .09em;
          text-transform: uppercase;
        }

        .details-title span {
          color: rgba(32,216,220,.7);
        }

        .reserve-title h3,
        .details-title h3 {
          margin: 0;
          color: white;
          font-size: 16px;
        }

        .panel-close {
          width: 38px;
          height: 38px;
          position: relative;
          z-index: 2;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 50%;
          color: rgba(183,198,216,.45);
          background: rgba(255,255,255,.025);
          cursor: pointer;
          transition: .3s ease;
        }

        .panel-close:hover {
          color: white;
          border-color: rgba(32,216,220,.24);
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
          color: rgba(215,225,237,.68);
          font-size: 11px;
          font-weight: 650;
        }

        .readonly-field {
          min-height: 54px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 15px;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 15px;
          color: rgba(199,212,228,.62);
          background: rgba(255,255,255,.025);
          font-size: 12px;
        }

        .readonly-field svg {
          width: 17px;
          height: 17px;
          color: #e3a04f;
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
          color: #20d8dc;
        }

        .input-wrapper input,
        .textarea-wrapper textarea {
          width: 100%;
          outline: none;
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 15px;
          color: #f4f8fd;
          background: rgba(2,12,23,.72);
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
          color: rgba(173,190,210,.28);
        }

        .input-wrapper input:focus,
        .textarea-wrapper textarea:focus {
          border-color: rgba(32,216,220,.52);
          box-shadow:
            0 0 0 4px rgba(32,216,220,.055),
            0 0 24px rgba(32,216,220,.07);
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
            linear-gradient(90deg, transparent, #20d8dc, #d99145, transparent);
          box-shadow: 0 0 16px rgba(32,216,220,.35);
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
          border: 1px solid rgba(229,160,82,.62);
          border-radius: 16px;
          color: white;
          background:
            linear-gradient(135deg, rgba(32,148,163,.86), rgba(199,121,56,.92));
          box-shadow:
            0 14px 32px rgba(32,136,166,.15),
            0 10px 26px rgba(199,121,56,.12);
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
          color: #16d8a0;
          border-color: rgba(22,216,160,.22);
          background: rgba(22,216,160,.075);
        }

        .status-pending {
          color: #e3a04f;
          border-color: rgba(227,160,79,.22);
          background: rgba(227,160,79,.075);
        }

        .status-reserved {
          color: #ff7059;
          border-color: rgba(255,112,89,.22);
          background: rgba(255,112,89,.075);
        }

        .company-details-card {
          position: relative;
          overflow: hidden;
          padding: 20px;
          border: 1px solid rgba(32,216,220,.18);
          border-radius: 20px;
          background:
            linear-gradient(145deg, rgba(8,35,49,.9), rgba(3,17,30,.94));
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.04),
            0 18px 40px rgba(0,0,0,.22);
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
          background: rgba(32,216,220,.1);
        }

        .company-card-orb-gold {
          width: 120px;
          height: 120px;
          left: -55px;
          bottom: -55px;
          background: rgba(217,145,69,.08);
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
          border: 1px solid rgba(32,216,220,.24);
          border-radius: 15px;
          color: #20d8dc;
          background:
            linear-gradient(145deg, rgba(32,216,220,.14), rgba(217,145,69,.06));
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
          color: rgba(227,160,79,.7);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
        }

        .company-details-main strong {
          overflow: hidden;
          color: white;
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
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 13px;
          background: rgba(255,255,255,.025);
        }

        .company-info-box strong {
          margin-top: 7px;
          display: flex;
          align-items: center;
          gap: 7px;
          color: rgba(235,241,249,.82);
          font-size: 11px;
        }

        .company-info-box strong svg {
          width: 13px;
          height: 13px;
          color: #20d8dc;
        }

        .company-description p {
          margin: 8px 0 0;
          color: rgba(204,216,230,.7);
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
          color: #ff7059;
          border-color: rgba(255,112,89,.16);
          background: rgba(255,112,89,.055);
        }

        .pending-message {
          color: #e3a04f;
          border-color: rgba(227,160,79,.16);
          background: rgba(227,160,79,.055);
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
            border-bottom: 1px solid rgba(32,216,220,.18);
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
