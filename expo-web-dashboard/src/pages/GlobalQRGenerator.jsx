import { useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Link2,
  Printer,
  QrCode,
  Shield,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

/* global __VISITOR_LAN_HOST__ */

// The QR opens the PUBLIC visitor map served by the separate expo-mobile-app,
// which runs on its OWN port (5173) and serves the map at the root path — NOT
// this dashboard's /visitor/map route. The URL is built to embed a PHONE-
// REACHABLE network address, never localhost, and needs no source edit when the
// LAN IP / DHCP address changes:
//
//   1. VITE_VISITOR_MAP_URL — explicit override (production, or a custom host).
//   2. __VISITOR_LAN_HOST__ — this machine's LAN IPv4, detected by Vite in Node
//      at startup (see vite.config.js) and injected here. This is what makes the
//      QR use http://192.168.x.y:5173/ even when the dashboard itself is opened
//      via http://localhost:5180 (the browser cannot read the LAN IP on its own).
//   3. Fallback: the hostname the dashboard was opened from (used only if no LAN
//      IP could be detected, e.g. offline).
//
// There is one implicit exhibition (booths are served globally), so no
// exhibition id is appended.
const EXHIBITION_NAME = "HOPEX EXPO";
// Port the expo-mobile-app dev/preview server listens on (its vite.config.js).
const VISITOR_MAP_PORT = import.meta.env.VITE_VISITOR_MAP_PORT || "5173";
// Injected by vite.config.js; "" when the token wasn't replaced or no LAN IP.
const LAN_HOST = typeof __VISITOR_LAN_HOST__ === "string" ? __VISITOR_LAN_HOST__ : "";

function buildDefaultMapUrl() {
  const override = import.meta.env.VITE_VISITOR_MAP_URL;
  if (override) return override.replace(/\/+$/, "");
  const protocol =
    typeof window !== "undefined" ? window.location.protocol : "http:";
  const host =
    LAN_HOST ||
    (typeof window !== "undefined" ? window.location.hostname : "localhost");
  return `${protocol}//${host}:${VISITOR_MAP_PORT}/`;
}

function BackgroundParticles() {
  return (
    <div className="qr-particles" aria-hidden="true">
      {Array.from({ length: 22 }).map((_, index) => (
        <motion.span
          key={index}
          style={{
            "--particle-x": `${4 + ((index * 31) % 92)}%`,
            "--particle-y": `${6 + ((index * 47) % 84)}%`,
          }}
          animate={{
            y: [10, -15, 10],
            opacity: [0.06, 0.82, 0.06],
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

export default function GlobalQRGenerator() {
  // The admin can still edit the URL in the input (e.g. to a production domain).
  const [appUrl, setAppUrl] = useState(buildDefaultMapUrl);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const qrRef = useRef(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy the URL:", error);
    }
  };

  const handleOpen = () => {
    window.open(appUrl, "_blank", "noopener,noreferrer");
  };

  const handlePrint = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const dataUri =
      "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    const win = window.open("", "_blank", "width=520,height=680");
    if (!win) return;
    win.document.write(`<!doctype html><html><head><title>${EXHIBITION_NAME} — Visitor Map QR</title>
      <style>
        body{font-family:Inter,system-ui,sans-serif;text-align:center;padding:40px;color:#14303f}
        h1{font-size:22px;margin:0 0 4px}p{color:#5b7180;font-size:13px;word-break:break-all;margin:6px 0 24px}
        img{width:340px;height:340px}
      </style></head><body>
      <h1>${EXHIBITION_NAME}</h1><p>Scan to open the interactive exhibition map<br/>${appUrl}</p>
      <img src="${dataUri}" alt="Visitor map QR" onload="window.print()"/>
      </body></html>`);
    win.document.close();
  };

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector("svg");

    if (!svg) {
      console.error("QR SVG was not found.");
      return;
    }

    setDownloading(true);

    try {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const image = new Image();

      image.onload = () => {
        canvas.width = 1000;
        canvas.height = 1000;

        context.fillStyle = "#FFFFFF";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 50, 50, 900, 900);

        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");

        downloadLink.download = "HOPEX-Visitors-QR.png";
        downloadLink.href = pngFile;
        downloadLink.click();

        setDownloading(false);
      };

      image.onerror = () => {
        console.error("Failed to prepare the QR image.");
        setDownloading(false);
      };

      image.src =
        "data:image/svg+xml;base64," +
        btoa(unescape(encodeURIComponent(svgData)));
    } catch (error) {
      console.error("Failed to download the QR code:", error);
      setDownloading(false);
    }
  };

  return (
    <section className="global-qr-page" dir="ltr">
      <div className="global-qr-background" aria-hidden="true">
        <div className="qr-grid" />
        <div className="qr-orb qr-orb-cyan" />
        <div className="qr-orb qr-orb-gold" />
        <BackgroundParticles />

        <div className="qr-wave-lines">
          <span />
          <span />
          <span />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.72, ease: [0.2, 0.8, 0.2, 1] }}
        className="qr-page-content"
      >
        <header className="qr-hero">
          <div className="qr-hero-copy">
            <div className="qr-hero-accent">
              <span className="qr-diamond" />
              <span className="qr-accent-line" />
            </div>

            <div className="qr-admin-label">
              <Sparkles />
              <span>Admin Access</span>
              <Sparkles />
            </div>

            <h1>
              Global <em>Visitor QR</em>
            </h1>

            <p>
              Generate the unified QR code visitors use to open the interactive
              3D exhibition map.
            </p>
          </div>

          <motion.div
            animate={{ y: [0, -7, 0], rotate: [0, 2, 0] }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="qr-hero-symbol"
          >
            <span className="symbol-orbit symbol-orbit-one" />
            <span className="symbol-orbit symbol-orbit-two" />
            <QrCode />
            <span className="symbol-light" />
          </motion.div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.12, duration: 0.66 }}
          className="qr-main-card"
        >
          <div className="main-card-glow main-card-glow-cyan" />
          <div className="main-card-glow main-card-glow-gold" />

          <motion.div
            className="main-card-shimmer"
            initial={{ x: "-140%" }}
            animate={{ x: "140%" }}
            transition={{ duration: 5, repeat: Infinity, repeatDelay: 2 }}
          />

          <div className="qr-controls-panel">
            <div className="control-heading">
              <div className="control-heading-icon">
                <Link2 />
              </div>

              <div>
                <span>Public Map URL</span>
                <h2>{EXHIBITION_NAME} · Visitor Map</h2>
              </div>
            </div>

            <label className="qr-input-label" htmlFor="visitor-app-url">
              Public visitor-map URL
            </label>

            <div className="qr-input-wrapper">
              <Link2 />

              <input
                id="visitor-app-url"
                type="url"
                value={appUrl}
                onChange={(event) => setAppUrl(event.target.value)}
                placeholder="http://192.168.x.y:5173/"
                spellCheck="false"
              />

              <span className="qr-input-light" />
            </div>

            <div className="qr-button-grid">
              <motion.button
                type="button"
                onClick={handleOpen}
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                className="qr-action-button copy-button"
              >
                <span className="button-shimmer" />
                <ExternalLink />
                <span>Open Map</span>
              </motion.button>

              <motion.button
                type="button"
                onClick={handleCopy}
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                className={`qr-action-button copy-button ${
                  copied ? "copied" : ""
                }`}
              >
                <span className="button-shimmer" />

                {copied ? <Check /> : <Copy />}

                <span>{copied ? "Link Copied" : "Copy Link"}</span>
              </motion.button>

              <motion.button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                className="qr-action-button download-button"
              >
                <span className="button-shimmer" />

                <Download className={downloading ? "downloading" : ""} />

                <span>{downloading ? "Preparing..." : "Download QR"}</span>
              </motion.button>

              <motion.button
                type="button"
                onClick={handlePrint}
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                className="qr-action-button copy-button"
              >
                <span className="button-shimmer" />
                <Printer />
                <span>Print QR</span>
              </motion.button>
            </div>

            <div className="quality-note">
              <Shield />
              <div>
                <strong>Print-ready quality</strong>
                <span>
                  The QR code is exported as a high-resolution PNG file.
                </span>
              </div>
            </div>
          </div>

          <div className="qr-preview-panel">
            <div className="preview-heading">
              <span>{EXHIBITION_NAME}</span>
              <strong>Visitor Map QR</strong>
            </div>

            <div className="qr-stage">
              <span className="stage-ring stage-ring-one" />
              <span className="stage-ring stage-ring-two" />
              <span className="stage-spark stage-spark-one" />
              <span className="stage-spark stage-spark-two" />

              <motion.div
                ref={qrRef}
                animate={{
                  y: [0, -6, 0],
                  boxShadow: [
                    "0 22px 50px rgba(20,55,95,.18), 0 0 0 rgba(23,217,212,0)",
                    "0 28px 60px rgba(20,55,95,.24), 0 0 34px rgba(23,217,212,.2)",
                    "0 22px 50px rgba(20,55,95,.18), 0 0 0 rgba(23,217,212,0)",
                  ],
                }}
                transition={{
                  duration: 4.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="qr-code-frame"
              >
                <div className="qr-frame-corner corner-top-left" />
                <div className="qr-frame-corner corner-top-right" />
                <div className="qr-frame-corner corner-bottom-left" />
                <div className="qr-frame-corner corner-bottom-right" />

                <QRCodeSVG
                  value={appUrl}
                  size={220}
                  level="H"
                  includeMargin={false}
                  bgColor="#FFFFFF"
                  fgColor="#0c3455"
                />
              </motion.div>

              <div className="qr-platform">
                <span />
                <span />
                <span />
              </div>
            </div>

            <div className="preview-status">
              <motion.span
                animate={{ opacity: [1, 0.35, 1], scale: [1, 0.7, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />

              <div>
                <strong>Ready for live preview</strong>
                <small>Changes appear instantly as you edit the URL.</small>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Montserrat:wght@400;500;600;700&display=swap');

        * {
          box-sizing: border-box;
        }

        .global-qr-page {
          width: 100%;
          min-height: 100vh;
          position: relative;
          display: grid;
          place-items: center;
          overflow: hidden;
          padding: 48px 28px;
          color: var(--hx-text, #0d2338);
          background: var(--hx-bg, #eef4fb);
          font-family: 'Inter', sans-serif;
          isolation: isolate;
        }

        .global-qr-background {
          position: fixed;
          inset: 0;
          z-index: -1;
          overflow: hidden;
          pointer-events: none;
        }

        .qr-grid {
          position: absolute;
          inset: 0;
          opacity: .5;
          background-image:
            linear-gradient(rgba(11,147,166,.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(11,147,166,.05) 1px, transparent 1px);
          background-size: 78px 78px;
          animation: qrGridMove 32s linear infinite;
        }

        .qr-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(115px);
        }

        .qr-orb-cyan {
          width: 560px;
          height: 560px;
          right: -180px;
          top: 80px;
          opacity: .16;
          background: #17d9d4;
          animation: qrCyanOrb 15s ease-in-out infinite alternate;
        }

        .qr-orb-gold {
          width: 460px;
          height: 460px;
          left: -170px;
          bottom: -120px;
          opacity: .14;
          background: #e6be6a;
          animation: qrGoldOrb 13s ease-in-out infinite alternate;
        }

        .qr-particles {
          position: absolute;
          inset: 0;
        }

        .qr-particles span {
          position: absolute;
          left: var(--particle-x);
          top: var(--particle-y);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #d2aa55;
          box-shadow: 0 0 11px rgba(210,170,85,.6);
        }

        .qr-wave-lines {
          width: 64%;
          height: 150px;
          position: absolute;
          left: 18%;
          top: 80px;
          opacity: .52;
          transform: rotate(-2deg);
        }

        .qr-wave-lines span {
          position: absolute;
          width: 100%;
          height: 70px;
          border-top: 1px solid rgba(169,121,31,.26);
          border-radius: 50%;
          animation: qrWaveMove 6.5s ease-in-out infinite;
        }

        .qr-wave-lines span:nth-child(2) {
          top: 23px;
          opacity: .55;
          animation-delay: -1.2s;
        }

        .qr-wave-lines span:nth-child(3) {
          top: 46px;
          opacity: .28;
          animation-delay: -2.4s;
        }

        .qr-page-content {
          width: min(1120px, 100%);
          position: relative;
          z-index: 2;
        }

        .qr-hero {
          min-height: 190px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 36px;
          overflow: hidden;
          margin-bottom: 26px;
        }

        .qr-hero-copy {
          position: relative;
          z-index: 3;
        }

        .qr-hero-accent {
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .qr-diamond {
          width: 9px;
          height: 9px;
          transform: rotate(45deg);
          background: #d2aa55;
          box-shadow: 0 0 12px rgba(210,170,85,.5);
        }

        .qr-accent-line {
          width: 74px;
          height: 1px;
          background: linear-gradient(90deg, #d2aa55, transparent);
        }

        .qr-admin-label {
          width: fit-content;
          margin-bottom: 14px;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 7px 12px;
          border: 1px solid rgba(11,147,166,.28);
          border-radius: 999px;
          color: var(--hx-cyan, #0b93a6);
          background: rgba(11,147,166,.07);
          font-size: 10px;
          font-weight: 750;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .qr-admin-label svg {
          width: 13px;
          height: 13px;
        }

        .qr-hero h1 {
          margin: 0;
          color: var(--hx-text, #0d2338);
          font-family: 'Montserrat', 'Inter', sans-serif;
          font-size: clamp(42px, 5vw, 70px);
          font-weight: 500;
          line-height: .98;
          letter-spacing: .012em;
          text-transform: uppercase;
          animation: qrTitleIn .8s var(--hx-ease, cubic-bezier(.16,1,.3,1)) .14s both;
        }

        @keyframes qrTitleIn {
          from { opacity: 0; transform: translateY(24px); filter: blur(6px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }

        .qr-hero h1 em {
          font-style: normal;
          font-weight: 600;
          color: #0b93a6;
          background: linear-gradient(105deg, #0b93a6 30%, #17d9d4 50%, #0b93a6 70%);
          background-size: 240% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 28px rgba(23,217,212,.22);
          animation: qrEmSheen 1.6s ease-in-out 1s both;
        }

        @keyframes qrEmSheen {
          from { background-position: 130% 0; }
          to { background-position: 0% 0; }
        }

        .qr-hero p {
          max-width: 650px;
          margin: 20px 0 0;
          color: var(--hx-muted, #55697d);
          font-size: 15px;
          line-height: 1.7;
          animation: qrRiseIn .7s var(--hx-ease, cubic-bezier(.16,1,.3,1)) .32s both;
        }

        @keyframes qrRiseIn {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .qr-admin-label {
          animation: qrRiseIn .6s var(--hx-ease, cubic-bezier(.16,1,.3,1)) .08s both;
        }

        .qr-hero-accent {
          transform-origin: left center;
          animation: qrAccentIn .6s var(--hx-ease, cubic-bezier(.16,1,.3,1)) .02s both;
        }

        @keyframes qrAccentIn {
          from { opacity: 0; transform: scaleX(.35); }
          to { opacity: 1; transform: scaleX(1); }
        }

        .qr-hero-symbol {
          width: 150px;
          height: 150px;
          position: relative;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          border: 1px solid rgba(11,147,166,.3);
          border-radius: 36px;
          color: var(--hx-cyan, #0b93a6);
          background:
            linear-gradient(145deg, #ffffff, #f3f8fd);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.9),
            0 26px 60px rgba(20,55,95,.14),
            0 0 35px rgba(23,217,212,.1);
        }

        .qr-hero-symbol > svg {
          width: 64px;
          height: 64px;
          stroke-width: 1.35;
          filter: drop-shadow(0 0 12px rgba(23,217,212,.3));
        }

        .symbol-orbit {
          position: absolute;
          border: 1px solid transparent;
          border-radius: 50%;
        }

        .symbol-orbit-one {
          width: 178px;
          height: 178px;
          border-top-color: rgba(10,162,180,.5);
          border-right-color: rgba(178,134,45,.3);
          animation: qrSpin 10s linear infinite;
        }

        .symbol-orbit-two {
          width: 205px;
          height: 205px;
          border-bottom-color: rgba(10,162,180,.25);
          border-left-color: rgba(178,134,45,.4);
          animation: qrSpin 15s linear infinite reverse;
        }

        .symbol-light {
          width: 12px;
          height: 7px;
          position: absolute;
          bottom: 17px;
          border-radius: 50%;
          background: #d2aa55;
          box-shadow: 0 0 24px 7px rgba(210,170,85,.3);
          animation: qrPulse 1.8s ease-in-out infinite;
        }

        .qr-main-card {
          min-height: 520px;
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(360px, .9fr);
          gap: 32px;
          overflow: hidden;
          padding: 34px;
          border: 1px solid rgba(11,147,166,.25);
          border-radius: 26px;
          background:
            linear-gradient(150deg, #ffffff, #f3f8fd);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.9),
            0 28px 68px rgba(20,55,95,.12);
          animation: qrCardGlowSettle 1.8s ease .5s both;
        }

        /* Border glow bloom on entrance that settles calm */
        @keyframes qrCardGlowSettle {
          0% {
            box-shadow:
              inset 0 1px 0 rgba(255,255,255,.9),
              0 28px 68px rgba(20,55,95,.12),
              0 0 0 rgba(23,217,212,0);
          }
          40% {
            box-shadow:
              inset 0 1px 0 rgba(255,255,255,.9),
              0 28px 68px rgba(20,55,95,.12),
              0 0 52px rgba(23,217,212,.18);
          }
          100% {
            box-shadow:
              inset 0 1px 0 rgba(255,255,255,.9),
              0 28px 68px rgba(20,55,95,.12),
              0 0 0 rgba(23,217,212,0);
          }
        }

        .main-card-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          pointer-events: none;
        }

        .main-card-glow-cyan {
          width: 300px;
          height: 300px;
          right: -140px;
          top: -130px;
          background: rgba(23,217,212,.14);
        }

        .main-card-glow-gold {
          width: 280px;
          height: 280px;
          left: -140px;
          bottom: -140px;
          background: rgba(210,170,85,.12);
        }

        .main-card-shimmer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(120deg, transparent 25%, rgba(11,147,166,.05), transparent 65%);
        }

        .qr-controls-panel,
        .qr-preview-panel {
          position: relative;
          z-index: 2;
        }

        .qr-controls-panel {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 12px 4px;
        }

        .control-heading {
          margin-bottom: 28px;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .control-heading-icon {
          width: 54px;
          height: 54px;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          border: 1px solid rgba(11,147,166,.3);
          border-radius: 16px;
          color: var(--hx-cyan, #0b93a6);
          background: rgba(11,147,166,.08);
          box-shadow: inset 0 0 20px rgba(23,217,212,.06);
        }

        .control-heading-icon svg {
          width: 26px;
          height: 26px;
        }

        .control-heading div:last-child {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .control-heading span {
          color: var(--hx-gold, #a9791f);
          font-size: 10px;
          font-weight: 750;
          letter-spacing: .11em;
          text-transform: uppercase;
        }

        .control-heading h2 {
          margin: 0;
          color: var(--hx-text, #0d2338);
          font-size: 20px;
        }

        .qr-input-label {
          margin-bottom: 10px;
          color: var(--hx-muted-strong, #3c516a);
          font-size: 12px;
          font-weight: 650;
        }

        .qr-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .qr-input-wrapper > svg {
          width: 19px;
          height: 19px;
          position: absolute;
          left: 16px;
          z-index: 2;
          color: var(--hx-cyan, #0b93a6);
        }

        .qr-input-wrapper input {
          width: 100%;
          min-height: 58px;
          padding: 0 18px 0 48px;
          outline: none;
          border: 1px solid rgba(14,55,92,.16);
          border-radius: 16px;
          color: var(--hx-text, #0d2338);
          background: var(--hx-panel-strong, #ffffff);
          font-size: 13px;
          transition: .3s ease;
        }

        .qr-input-wrapper input::placeholder {
          color: rgba(13,35,56,.35);
        }

        .qr-input-wrapper input:focus {
          border-color: rgba(11,147,166,.55);
          box-shadow:
            0 0 0 4px var(--hx-focus, rgba(11,147,166,.22)),
            0 0 24px rgba(23,217,212,.1);
        }

        .qr-input-light {
          height: 2px;
          position: absolute;
          left: 18px;
          right: 18px;
          bottom: 0;
          opacity: 0;
          transform: scaleX(.4);
          border-radius: 999px;
          background:
            linear-gradient(90deg, transparent, #0aa2b4, #d2aa55, transparent);
          box-shadow: 0 0 16px rgba(23,217,212,.3);
          transition: .3s ease;
        }

        .qr-input-wrapper:focus-within .qr-input-light {
          opacity: 1;
          transform: scaleX(1);
        }

        .qr-button-grid {
          margin-top: 18px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 13px;
        }

        .qr-action-button {
          min-height: 55px;
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          overflow: hidden;
          border-radius: 16px;
          font-size: 13px;
          font-weight: 750;
          cursor: pointer;
          transition: .35s ease;
          /* backwards fill: releases transform to hover/tap styles after entry */
          animation: qrRiseIn .55s var(--hx-ease, cubic-bezier(.16,1,.3,1)) backwards;
        }

        .qr-button-grid .qr-action-button:nth-child(1) { animation-delay: .38s; }
        .qr-button-grid .qr-action-button:nth-child(2) { animation-delay: .45s; }
        .qr-button-grid .qr-action-button:nth-child(3) { animation-delay: .52s; }
        .qr-button-grid .qr-action-button:nth-child(4) { animation-delay: .59s; }

        .qr-action-button:active:not(:disabled) {
          transform: translateY(0) scale(.97);
        }

        .qr-action-button svg {
          width: 19px;
          height: 19px;
          position: relative;
          z-index: 2;
        }

        .qr-action-button > span:last-child {
          position: relative;
          z-index: 2;
        }

        .copy-button {
          border: 1px solid rgba(11,147,166,.35);
          color: var(--hx-navy, #0c3455);
          background:
            linear-gradient(145deg, #ffffff, #f3f8fd);
        }

        .copy-button:hover,
        .copy-button.copied {
          color: var(--hx-cyan, #0b93a6);
          border-color: rgba(11,147,166,.6);
          box-shadow: 0 16px 32px rgba(20,55,95,.14), 0 0 24px rgba(23,217,212,.12);
        }

        .copy-button.copied svg {
          color: #0f9d76;
        }

        .download-button {
          border: 1px solid rgba(10,162,180,.45);
          color: #001116;
          background:
            linear-gradient(135deg, #27e8df, #00a8bd 58%, #d3aa56 135%);
          box-shadow:
            0 12px 35px rgba(0,196,202,.2),
            inset 0 1px 0 rgba(255,255,255,.42);
        }

        .download-button:hover {
          border-color: rgba(10,162,180,.7);
          box-shadow:
            0 18px 45px rgba(0,205,208,.28),
            inset 0 1px 0 rgba(255,255,255,.45);
        }

        .download-button:disabled {
          opacity: .65;
          cursor: wait;
        }

        .download-button svg.downloading {
          animation: qrDownloadPulse 1s ease-in-out infinite;
        }

        .button-shimmer {
          position: absolute !important;
          inset: 0;
          z-index: 1 !important;
          background:
            linear-gradient(120deg, transparent 24%, rgba(255,255,255,.16), transparent 72%);
          transform: translateX(-140%);
          animation: qrButtonShimmer 3.8s ease-in-out infinite;
        }

        .quality-note {
          margin-top: 18px;
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 13px 14px;
          border: 1px solid var(--hx-line-soft, rgba(14,55,92,.07));
          border-radius: 14px;
          background: rgba(13,35,56,.03);
        }

        .quality-note > svg {
          width: 20px;
          height: 20px;
          flex: 0 0 auto;
          color: var(--hx-gold, #a9791f);
        }

        .quality-note div {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .quality-note strong {
          color: #33475a;
          font-size: 11px;
        }

        .quality-note span {
          color: #7a8ea0;
          font-size: 10px;
        }

        .qr-preview-panel {
          min-height: 430px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 26px;
          border: 1px solid rgba(11,147,166,.22);
          border-radius: 22px;
          background:
            radial-gradient(circle at center 45%, rgba(10,162,180,.1), transparent 36%),
            rgba(255,255,255,.7);
        }

        .preview-heading {
          position: absolute;
          left: 24px;
          top: 22px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .preview-heading span {
          color: var(--hx-gold, #a9791f);
          font-size: 9px;
          font-weight: 750;
          letter-spacing: .1em;
          text-transform: uppercase;
        }

        .preview-heading strong {
          color: #33475a;
          font-size: 13px;
        }

        .qr-stage {
          width: 330px;
          height: 330px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .stage-ring {
          position: absolute;
          border: 1px solid transparent;
          border-radius: 50%;
        }

        .stage-ring-one {
          width: 290px;
          height: 290px;
          border-top-color: rgba(10,162,180,.4);
          border-right-color: rgba(178,134,45,.28);
          animation: qrSpin 13s linear infinite;
        }

        .stage-ring-two {
          width: 324px;
          height: 324px;
          border-bottom-color: rgba(10,162,180,.22);
          border-left-color: rgba(178,134,45,.4);
          animation: qrSpin 18s linear infinite reverse;
        }

        .stage-spark {
          width: 7px;
          height: 7px;
          position: absolute;
          border-radius: 50%;
          background: #d2aa55;
          box-shadow: 0 0 15px rgba(210,170,85,.7);
          animation: qrPulse 2s ease-in-out infinite;
        }

        .stage-spark-one {
          right: 29px;
          top: 48px;
        }

        .stage-spark-two {
          left: 24px;
          bottom: 62px;
          animation-delay: -1s;
        }

        .qr-code-frame {
          position: relative;
          z-index: 3;
          display: grid;
          place-items: center;
          padding: 22px;
          border: 1px solid var(--hx-line, rgba(14,55,92,.12));
          border-radius: 22px;
          background: white;
        }

        .qr-code-frame svg {
          display: block;
        }

        .qr-frame-corner {
          width: 24px;
          height: 24px;
          position: absolute;
          border-color: #0aa2b4;
          border-style: solid;
          animation: qrCornerIn .5s var(--hx-ease, cubic-bezier(.16,1,.3,1)) both;
        }

        .corner-top-left { animation-delay: .7s; }
        .corner-top-right { animation-delay: .82s; }
        .corner-bottom-right { animation-delay: .94s; }
        .corner-bottom-left { animation-delay: 1.06s; }

        @keyframes qrCornerIn {
          from { opacity: 0; transform: scale(.5); }
          to { opacity: 1; transform: scale(1); }
        }

        .corner-top-left {
          left: -6px;
          top: -6px;
          border-width: 2px 0 0 2px;
          border-radius: 8px 0 0 0;
        }

        .corner-top-right {
          right: -6px;
          top: -6px;
          border-width: 2px 2px 0 0;
          border-radius: 0 8px 0 0;
        }

        .corner-bottom-left {
          left: -6px;
          bottom: -6px;
          border-width: 0 0 2px 2px;
          border-radius: 0 0 0 8px;
        }

        .corner-bottom-right {
          right: -6px;
          bottom: -6px;
          border-width: 0 2px 2px 0;
          border-radius: 0 0 8px 0;
        }

        .qr-platform {
          width: 250px;
          height: 30px;
          position: absolute;
          bottom: 10px;
        }

        .qr-platform span {
          height: 2px;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 999px;
          background:
            linear-gradient(90deg, transparent, rgba(210,170,85,.6), rgba(10,162,180,.55), transparent);
          box-shadow: 0 0 10px rgba(23,217,212,.16);
        }

        .qr-platform span:nth-child(1) {
          width: 145px;
          top: 2px;
        }

        .qr-platform span:nth-child(2) {
          width: 200px;
          top: 11px;
          opacity: .65;
        }

        .qr-platform span:nth-child(3) {
          width: 250px;
          top: 20px;
          opacity: .35;
        }

        .preview-status {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .preview-status > span {
          width: 9px;
          height: 9px;
          flex: 0 0 auto;
          border-radius: 50%;
          background: #0f9d76;
          box-shadow: 0 0 14px rgba(15,157,118,.6);
        }

        .preview-status div {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .preview-status strong {
          color: var(--hx-cyan, #0b93a6);
          font-size: 11px;
        }

        .preview-status small {
          color: #7a8ea0;
          font-size: 9px;
        }

        @keyframes qrGridMove {
          to { transform: translate(78px, 78px); }
        }

        @keyframes qrCyanOrb {
          to { transform: translate(-80px, 70px) scale(1.13); }
        }

        @keyframes qrGoldOrb {
          to { transform: translate(90px, -70px) scale(1.1); }
        }

        @keyframes qrWaveMove {
          0%,100% { transform: translateX(-3%) scaleX(.97); opacity: .3; }
          50% { transform: translateX(3%) scaleX(1.04); opacity: 1; }
        }

        @keyframes qrSpin {
          to { transform: rotate(360deg); }
        }

        @keyframes qrPulse {
          0%,100% { opacity: .42; transform: scale(.72); }
          50% { opacity: 1; transform: scale(1.25); }
        }

        @keyframes qrButtonShimmer {
          0%,55% { transform: translateX(-140%); }
          82%,100% { transform: translateX(140%); }
        }

        @keyframes qrDownloadPulse {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(3px); }
        }

        @media (max-width: 900px) {
          .global-qr-page {
            padding: 32px 20px;
          }

          .qr-hero {
            align-items: flex-start;
          }

          .qr-hero-symbol {
            width: 120px;
            height: 120px;
          }

          .symbol-orbit-one {
            width: 145px;
            height: 145px;
          }

          .symbol-orbit-two {
            width: 170px;
            height: 170px;
          }

          .qr-main-card {
            grid-template-columns: 1fr;
          }

          .qr-preview-panel {
            min-height: 450px;
          }
        }

        @media (max-width: 620px) {
          .global-qr-page {
            padding: 26px 14px;
          }

          .qr-hero {
            min-height: auto;
            flex-direction: column;
            margin-bottom: 22px;
          }

          .qr-hero h1 {
            font-size: 36px;
          }

          .qr-hero-symbol {
            display: none;
          }

          .qr-main-card {
            padding: 20px;
            border-radius: 22px;
          }

          .qr-button-grid {
            grid-template-columns: 1fr;
          }

          .qr-preview-panel {
            min-height: 390px;
            padding: 18px;
          }

          .qr-stage {
            width: 290px;
            height: 290px;
            transform: scale(.9);
          }

          .preview-heading {
            left: 18px;
            top: 17px;
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
