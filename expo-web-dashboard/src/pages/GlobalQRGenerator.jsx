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
                    "0 22px 50px rgba(0,0,0,.36), 0 0 0 rgba(32,216,220,0)",
                    "0 28px 60px rgba(0,0,0,.42), 0 0 34px rgba(32,216,220,.14)",
                    "0 22px 50px rgba(0,0,0,.36), 0 0 0 rgba(32,216,220,0)",
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
                  fgColor="#04111f"
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
          color: #f6f9fd;
          background: #020914;
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
          opacity: .18;
          background-image:
            linear-gradient(rgba(32,216,220,.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(32,216,220,.04) 1px, transparent 1px);
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
          opacity: .12;
          background: #09b8c6;
          animation: qrCyanOrb 15s ease-in-out infinite alternate;
        }

        .qr-orb-gold {
          width: 460px;
          height: 460px;
          left: -170px;
          bottom: -120px;
          opacity: .09;
          background: #c87835;
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
          background: #e5a052;
          box-shadow: 0 0 11px rgba(229,160,82,.75);
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
          border-top: 1px solid rgba(217,145,69,.3);
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
          background: #e5a052;
          box-shadow: 0 0 12px rgba(229,160,82,.55);
        }

        .qr-accent-line {
          width: 74px;
          height: 1px;
          background: linear-gradient(90deg, #d99145, transparent);
        }

        .qr-admin-label {
          width: fit-content;
          margin-bottom: 14px;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 7px 12px;
          border: 1px solid rgba(32,216,220,.24);
          border-radius: 999px;
          color: #20d8dc;
          background: rgba(32,216,220,.065);
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
          color: #f4f6fa;
          font-family: 'Montserrat', 'Inter', sans-serif;
          font-size: clamp(42px, 5vw, 70px);
          font-weight: 500;
          line-height: .98;
          letter-spacing: .012em;
          text-transform: uppercase;
        }

        .qr-hero h1 em {
          color: #20d8dc;
          font-style: normal;
          font-weight: 600;
          text-shadow: 0 0 28px rgba(32,216,220,.16);
        }

        .qr-hero p {
          max-width: 650px;
          margin: 20px 0 0;
          color: rgba(181,197,215,.58);
          font-size: 15px;
          line-height: 1.7;
        }

        .qr-hero-symbol {
          width: 150px;
          height: 150px;
          position: relative;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          border: 1px solid rgba(32,216,220,.24);
          border-radius: 36px;
          color: #20d8dc;
          background:
            linear-gradient(145deg, rgba(32,216,220,.11), rgba(217,145,69,.05));
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.05),
            0 26px 60px rgba(0,0,0,.3),
            0 0 35px rgba(32,216,220,.07);
        }

        .qr-hero-symbol > svg {
          width: 64px;
          height: 64px;
          stroke-width: 1.35;
          filter: drop-shadow(0 0 12px rgba(32,216,220,.25));
        }

        .symbol-orbit {
          position: absolute;
          border: 1px solid transparent;
          border-radius: 50%;
        }

        .symbol-orbit-one {
          width: 178px;
          height: 178px;
          border-top-color: rgba(32,216,220,.52);
          border-right-color: rgba(217,145,69,.25);
          animation: qrSpin 10s linear infinite;
        }

        .symbol-orbit-two {
          width: 205px;
          height: 205px;
          border-bottom-color: rgba(32,216,220,.25);
          border-left-color: rgba(217,145,69,.42);
          animation: qrSpin 15s linear infinite reverse;
        }

        .symbol-light {
          width: 12px;
          height: 7px;
          position: absolute;
          bottom: 17px;
          border-radius: 50%;
          background: #e5a052;
          box-shadow: 0 0 24px 7px rgba(229,160,82,.35);
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
          border: 1px solid rgba(55,183,205,.42);
          border-radius: 26px;
          background:
            linear-gradient(150deg, rgba(8,30,47,.9), rgba(3,15,28,.96));
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.045),
            0 28px 68px rgba(0,0,0,.34);
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
          background: rgba(32,216,220,.1);
        }

        .main-card-glow-gold {
          width: 280px;
          height: 280px;
          left: -140px;
          bottom: -140px;
          background: rgba(217,145,69,.075);
        }

        .main-card-shimmer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(120deg, transparent 25%, rgba(255,255,255,.045), transparent 65%);
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
          border: 1px solid rgba(32,216,220,.28);
          border-radius: 16px;
          color: #20d8dc;
          background: rgba(32,216,220,.08);
          box-shadow: inset 0 0 20px rgba(32,216,220,.05);
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
          color: rgba(227,160,79,.72);
          font-size: 10px;
          font-weight: 750;
          letter-spacing: .11em;
          text-transform: uppercase;
        }

        .control-heading h2 {
          margin: 0;
          color: white;
          font-size: 20px;
        }

        .qr-input-label {
          margin-bottom: 10px;
          color: rgba(215,225,237,.7);
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
          color: #20d8dc;
        }

        .qr-input-wrapper input {
          width: 100%;
          min-height: 58px;
          padding: 0 18px 0 48px;
          outline: none;
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 16px;
          color: #f4f8fd;
          background: rgba(2,12,23,.7);
          font-size: 13px;
          transition: .3s ease;
        }

        .qr-input-wrapper input::placeholder {
          color: rgba(173,190,210,.28);
        }

        .qr-input-wrapper input:focus {
          border-color: rgba(32,216,220,.52);
          box-shadow:
            0 0 0 4px rgba(32,216,220,.055),
            0 0 24px rgba(32,216,220,.07);
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
            linear-gradient(90deg, transparent, #20d8dc, #d99145, transparent);
          box-shadow: 0 0 16px rgba(32,216,220,.35);
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
          border: 1px solid rgba(32,216,220,.28);
          color: #dce8f4;
          background:
            linear-gradient(145deg, rgba(11,40,53,.72), rgba(3,17,30,.88));
        }

        .copy-button:hover,
        .copy-button.copied {
          color: #20d8dc;
          border-color: rgba(32,216,220,.62);
          box-shadow: 0 16px 32px rgba(0,0,0,.26), 0 0 24px rgba(32,216,220,.08);
        }

        .copy-button.copied svg {
          color: #16d8a0;
        }

        .download-button {
          border: 1px solid rgba(229,160,82,.62);
          color: white;
          background:
            linear-gradient(135deg, rgba(32,148,163,.86), rgba(199,121,56,.92));
          box-shadow:
            0 14px 32px rgba(32,136,166,.15),
            0 10px 26px rgba(199,121,56,.12);
        }

        .download-button:hover {
          border-color: rgba(244,188,117,.9);
          box-shadow:
            0 19px 40px rgba(0,0,0,.3),
            0 0 28px rgba(217,145,69,.13);
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
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 14px;
          background: rgba(255,255,255,.022);
        }

        .quality-note > svg {
          width: 20px;
          height: 20px;
          flex: 0 0 auto;
          color: #e3a04f;
        }

        .quality-note div {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .quality-note strong {
          color: rgba(239,245,252,.8);
          font-size: 11px;
        }

        .quality-note span {
          color: rgba(165,183,204,.42);
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
          border: 1px solid rgba(32,216,220,.16);
          border-radius: 22px;
          background:
            radial-gradient(circle at center 45%, rgba(10,79,91,.13), transparent 36%),
            rgba(2,13,24,.62);
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
          color: rgba(227,160,79,.72);
          font-size: 9px;
          font-weight: 750;
          letter-spacing: .1em;
          text-transform: uppercase;
        }

        .preview-heading strong {
          color: rgba(239,245,252,.8);
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
          border-top-color: rgba(32,216,220,.36);
          border-right-color: rgba(217,145,69,.22);
          animation: qrSpin 13s linear infinite;
        }

        .stage-ring-two {
          width: 324px;
          height: 324px;
          border-bottom-color: rgba(32,216,220,.2);
          border-left-color: rgba(217,145,69,.42);
          animation: qrSpin 18s linear infinite reverse;
        }

        .stage-spark {
          width: 7px;
          height: 7px;
          position: absolute;
          border-radius: 50%;
          background: #e5a052;
          box-shadow: 0 0 15px rgba(229,160,82,.9);
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
          border: 1px solid rgba(255,255,255,.16);
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
          border-color: #20d8dc;
          border-style: solid;
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
            linear-gradient(90deg, transparent, rgba(217,145,69,.7), rgba(32,216,220,.62), transparent);
          box-shadow: 0 0 10px rgba(32,216,220,.13);
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
          background: #16d8a0;
          box-shadow: 0 0 14px rgba(22,216,160,.8);
        }

        .preview-status div {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .preview-status strong {
          color: #20d8dc;
          font-size: 11px;
        }

        .preview-status small {
          color: rgba(163,182,203,.4);
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
