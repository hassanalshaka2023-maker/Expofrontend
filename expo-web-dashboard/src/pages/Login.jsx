import { useEffect, useState } from "react";
import { webApi } from "../services/api";

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handlePointerMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;

      document.documentElement.style.setProperty("--login-pointer-x", `${x}%`);
      document.documentElement.style.setProperty("--login-pointer-y", `${y}%`);
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      if (isRegister) {
        await webApi.registerInvestor(name, email, password, companyName);
        alert("Registration successful! Please login now.");
        setIsRegister(false);
      } else {
        const data = await webApi.login(email, password);
        localStorage.setItem("token", data.token);
        onLoginSuccess(data.user);
      }
    } catch (err) {
      // Handle Arabic error messages from backend by translating them
      const serverMsg = err.response?.data?.message || "";
      const englishMsg = serverMsg.includes("بيانات الدخول غير صحيحة")
        ? "Invalid email or password. Please try again."
        : serverMsg.includes("البريد الإلكتروني")
          ? "This email is already registered."
          : serverMsg.includes("غير موجود")
            ? "Account not found."
            : serverMsg.includes("خطأ")
              ? "An error occurred. Please try again."
              : serverMsg || "Something went wrong. Please try again.";
      setError(englishMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      {/* Animated Background Layers */}
      <div className="login-bg">
        <div className="bg-gradient-layer"></div>
        <div className="bg-grid"></div>
        <div className="bg-pointer-light"></div>

        <div className="bg-wave-lines">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-orb bg-orb-3"></div>

        {/* Logo as blurred background */}
        <div className="bg-logo-blur">
          <img
            src="/src/assets/HOPEX_official_logo_main.png"
            alt=""
            className="bg-logo-img"
          />
        </div>

        <div className="bg-particles" id="particles">
          {Array.from({ length: 24 }).map((_, index) => (
            <span
              key={index}
              className="login-particle"
              style={{
                "--particle-x": `${4 + ((index * 31) % 92)}%`,
                "--particle-y": `${6 + ((index * 47) % 84)}%`,
                "--particle-delay": `${(index % 8) * -0.55}s`,
                "--particle-duration": `${5 + (index % 5)}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Login Card */}
      <div className="login-card">
        <div className="login-card-border"></div>
        <div className="login-card-shimmer"></div>

        {/* Logo Text Only */}
        <div className="login-logo">
          <div className="logo-glow"></div>
          <h1 className="logo-text">Hopex</h1>
          <p className="logo-tagline">Build the future</p>
        </div>

        <h2 className="login-title">
          {isRegister ? "Create Investor Account" : "Welcome Back"}
        </h2>
        <p className="login-subtitle">
          {isRegister
            ? "Join Hopex and start your investment journey"
            : "Sign in to continue"}
        </p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          {isRegister && (
            <>
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="input-field"
                    placeholder="Enter your full name"
                  />
                  <div className="input-border"></div>
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Company Name</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    className="input-field"
                    placeholder="Your company name"
                  />
                  <div className="input-border"></div>
                </div>
              </div>
            </>
          )}

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <div className="input-wrapper">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
                placeholder="you@example.com"
              />
              <div className="input-border"></div>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="input-wrapper">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field"
                placeholder="••••••••"
              />
              <div className="input-border"></div>
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={isSubmitting}>
            <span className="login-btn-shimmer"></span>
            {isSubmitting ? (
              <span className="btn-loading">
                <span className="spinner"></span>
                Signing in...
              </span>
            ) : isRegister ? (
              "Create Account"
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="login-footer">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            className="toggle-btn"
          >
            {isRegister
              ? "Already have an account? Sign in"
              : "New investor? Create your account"}
          </button>
        </div>

        <div className="login-divider"></div>
        <p className="login-copyright">
          &copy; {new Date().getFullYear()} Hopex. All rights reserved.
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        :root {
          --login-pointer-x: 50%;
          --login-pointer-y: 50%;
          --hopex-cyan: #20d8dc;
          --hopex-gold: #d99145;
          --hopex-gold-soft: #e8ad68;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          position: relative;
          overflow: hidden;
          background:
            linear-gradient(180deg, rgba(2,9,20,.96), rgba(2,9,20,1)),
            #020914;
          isolation: isolate;
        }

        /* === ANIMATED BACKGROUND === */
        .login-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
        }

        .bg-gradient-layer {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 20% 50%, rgba(32, 216, 220, 0.11) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(217, 145, 69, 0.085) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, rgba(16, 28, 53, 0.15) 0%, transparent 50%);
        }

        .bg-grid {
          position: absolute;
          inset: 0;
          opacity: 0.18;
          background-image:
            linear-gradient(rgba(32,216,220,.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(32,216,220,.045) 1px, transparent 1px);
          background-size: 78px 78px;
          mask-image: linear-gradient(to bottom, transparent, black 12%, black 88%, transparent);
          animation: loginGridMove 32s linear infinite;
        }

        .bg-pointer-light {
          position: absolute;
          inset: 0;
          opacity: .35;
          background:
            radial-gradient(
              460px circle at var(--login-pointer-x) var(--login-pointer-y),
              rgba(32,216,220,.12),
              rgba(217,145,69,.045) 35%,
              transparent 70%
            );
        }

        .bg-wave-lines {
          width: 62%;
          height: 155px;
          position: absolute;
          left: 19%;
          top: 11%;
          opacity: .55;
          transform: rotate(-4deg);
        }

        .bg-wave-lines span {
          position: absolute;
          width: 100%;
          height: 72px;
          border-top: 1px solid rgba(217,145,69,.3);
          border-radius: 50%;
          animation: loginWaveMove 6.5s ease-in-out infinite;
        }

        .bg-wave-lines span:nth-child(2) {
          top: 23px;
          opacity: .55;
          animation-delay: -1.2s;
        }

        .bg-wave-lines span:nth-child(3) {
          top: 46px;
          opacity: .28;
          animation-delay: -2.4s;
        }

        .bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.15;
        }

        .bg-orb-1 {
          width: 700px;
          height: 700px;
          background: radial-gradient(circle, #2088A6, transparent);
          top: -350px;
          right: -200px;
          animation: orbFloat1 12s ease-in-out infinite;
        }

        .bg-orb-2 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, #C77938, transparent);
          bottom: -300px;
          left: -200px;
          animation: orbFloat2 10s ease-in-out infinite;
        }

        .bg-orb-3 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, #101C35, transparent);
          top: 40%;
          left: 60%;
          animation: orbFloat3 14s ease-in-out infinite;
        }

        @keyframes orbFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          33% { transform: translate(80px, -60px) scale(1.1) rotate(5deg); }
          66% { transform: translate(-40px, 40px) scale(0.9) rotate(-3deg); }
        }

        @keyframes orbFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-60px, 50px) scale(1.15); }
          66% { transform: translate(40px, -30px) scale(0.85); }
        }

        @keyframes orbFloat3 {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          50% { transform: translate(-30px, -40px) scale(1.05) rotate(-2deg); }
        }

        /* Logo as Blurred Background */
        .bg-logo-blur {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.08;
          animation: logoBgFade 6s ease-in-out infinite alternate;
        }

        .bg-logo-img {
          width: 80%;
          max-width: 600px;
          height: auto;
          object-fit: contain;
          filter: blur(40px) brightness(0.6);
          transform: scale(1.5);
          animation: logoBgPulse 8s ease-in-out infinite;
        }

        @keyframes logoBgFade {
          0%, 100% { opacity: 0.06; }
          50% { opacity: 0.12; }
        }

        @keyframes logoBgPulse {
          0%, 100% { transform: scale(1.5) rotate(0deg); }
          50% { transform: scale(1.8) rotate(2deg); }
        }

        /* Floating Particles */
        .bg-particles {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(circle at 10% 20%, rgba(255,255,255,0.03) 0.5px, transparent 0.5px),
            radial-gradient(circle at 30% 60%, rgba(255,255,255,0.02) 0.5px, transparent 0.5px),
            radial-gradient(circle at 50% 10%, rgba(32,136,166,0.04) 1px, transparent 1px),
            radial-gradient(circle at 70% 80%, rgba(199,121,56,0.03) 1px, transparent 1px),
            radial-gradient(circle at 90% 30%, rgba(255,255,255,0.02) 0.5px, transparent 0.5px),
            radial-gradient(circle at 15% 85%, rgba(32,136,166,0.03) 0.5px, transparent 0.5px),
            radial-gradient(circle at 65% 45%, rgba(199,121,56,0.02) 1px, transparent 1px),
            radial-gradient(circle at 40% 35%, rgba(255,255,255,0.03) 0.5px, transparent 0.5px),
            radial-gradient(circle at 80% 15%, rgba(32,136,166,0.02) 0.5px, transparent 0.5px),
            radial-gradient(circle at 5% 50%, rgba(199,121,56,0.03) 0.5px, transparent 0.5px),
            radial-gradient(circle at 55% 70%, rgba(255,255,255,0.02) 0.5px, transparent 0.5px),
            radial-gradient(circle at 75% 55%, rgba(32,136,166,0.03) 1px, transparent 1px),
            radial-gradient(circle at 25% 40%, rgba(199,121,56,0.02) 0.5px, transparent 0.5px),
            radial-gradient(circle at 45% 90%, rgba(255,255,255,0.03) 0.5px, transparent 0.5px),
            radial-gradient(circle at 95% 65%, rgba(32,136,166,0.02) 0.5px, transparent 0.5px);
          background-size: 300px 300px, 400px 400px, 250px 250px, 350px 350px, 200px 200px, 
                          320px 320px, 280px 280px, 360px 360px, 220px 220px, 340px 340px,
                          270px 270px, 310px 310px, 290px 290px, 260px 260px, 380px 380px;
          animation: particleDrift 25s linear infinite;
        }

        @keyframes particleDrift {
          0% { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(40px, -40px) rotate(5deg); }
        }

        .login-particle {
          position: absolute;
          left: var(--particle-x);
          top: var(--particle-y);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #e5a052;
          box-shadow: 0 0 11px rgba(229,160,82,.78);
          animation:
            loginParticleFloat var(--particle-duration)
            var(--particle-delay) ease-in-out infinite;
        }

        @keyframes loginParticleFloat {
          0%,100% {
            opacity: .06;
            transform: translateY(10px) scale(.68);
          }
          50% {
            opacity: .9;
            transform: translateY(-16px) scale(1.28);
          }
        }

        @keyframes loginGridMove {
          to { transform: translate(78px, 78px); }
        }

        @keyframes loginWaveMove {
          0%,100% { transform: translateX(-3%) scaleX(.97); opacity: .3; }
          50% { transform: translateX(3%) scaleX(1.04); opacity: 1; }
        }

        /* === LOGIN CARD === */
        .login-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 420px;
          background:
            linear-gradient(180deg, rgba(12,26,43,.86), rgba(4,15,28,.94));
          backdrop-filter: blur(34px) saturate(1.35);
          -webkit-backdrop-filter: blur(40px) saturate(1.4);
          border: 1px solid rgba(32, 216, 220, 0.22);
          border-radius: 24px;
          padding: 44px 36px 36px;
          box-shadow: 
            0 30px 80px rgba(0, 0, 0, 0.6),
            0 0 0 1px rgba(255, 255, 255, 0.03),
            inset 0 1px 0 rgba(255, 255, 255, 0.06),
            0 0 34px rgba(32,216,220,.04);
          animation: cardReveal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes cardReveal {
          0% {
            opacity: 0;
            transform: translateY(50px) scale(0.92);
            filter: blur(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }


        .login-card-border {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          background:
            linear-gradient(
              120deg,
              rgba(32,216,220,.26),
              transparent 26%,
              transparent 72%,
              rgba(217,145,69,.24)
            );
          mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          padding: 1px;
          -webkit-mask-composite: xor;
          mask-composite: exclude;
        }

        .login-card-shimmer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(
              120deg,
              transparent 24%,
              rgba(255,255,255,.055),
              transparent 68%
            );
          transform: translateX(-140%);
          animation: loginCardShimmer 5.2s ease-in-out infinite;
        }

        @keyframes loginCardShimmer {
          0%,42% { transform: translateX(-140%); }
          68%,100% { transform: translateX(140%); }
        }

        /* === LOGO === */
        .login-logo {
          text-align: center;
          margin-bottom: 32px;
          position: relative;
          animation: logoReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
        }

        .logo-glow {
          position: absolute;
          width: 120px;
          height: 120px;
          background: radial-gradient(circle, rgba(32, 216, 220, 0.18), rgba(217,145,69,.04) 45%, transparent 72%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          animation: logoGlow 3s ease-in-out infinite;
        }

        @keyframes logoGlow {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.8; }
        }

        .logo-text {
          font-size: 28px;
          font-weight: 900;
          letter-spacing: 1px;
          background: linear-gradient(135deg, #20d8dc 0%, #d99145 50%, #20d8dc 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 6px 0 2px;
          animation: gradientShift 4s ease-in-out infinite;
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 100% center; }
        }

        .logo-tagline {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.3);
          margin: 0;
        }

        @keyframes logoReveal {
          0% { opacity: 0; transform: translateY(-30px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* === TEXT === */
        .login-title {
          color: rgba(255, 255, 255, 0.9);
          font-size: 20px;
          font-weight: 700;
          text-align: center;
          margin: 0 0 6px;
          letter-spacing: -0.3px;
          animation: fadeSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both;
        }

        .login-subtitle {
          color: rgba(255, 255, 255, 0.35);
          font-size: 13px;
          font-weight: 400;
          text-align: center;
          margin: 0 0 28px;
          animation: fadeSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
        }

        @keyframes fadeSlideUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        /* === ERROR === */
        .login-error {
          background: rgba(199, 121, 56, 0.08);
          border: 1px solid rgba(199, 121, 56, 0.2);
          color: #C77938;
          font-size: 13px;
          font-weight: 500;
          padding: 12px 16px;
          border-radius: 12px;
          margin-bottom: 20px;
          text-align: center;
          animation: errorShake 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes errorShake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-10px) rotate(-0.5deg); }
          30% { transform: translateX(10px) rotate(0.5deg); }
          45% { transform: translateX(-6px); }
          60% { transform: translateX(6px); }
          75% { transform: translateX(-2px); }
        }

        /* === INPUTS === */
        .login-form {
          animation: fadeSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both;
        }

        .input-group {
          margin-bottom: 18px;
        }

        .input-label {
          display: block;
          color: rgba(255, 255, 255, 0.5);
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 6px;
          letter-spacing: 0.3px;
          text-transform: uppercase;
        }

        .input-wrapper {
          position: relative;
          overflow: hidden;
        }

        .input-field {
          width: 100%;
          background: rgba(2, 12, 23, 0.62);
          border: 1.5px solid rgba(255, 255, 255, 0.075);
          border-radius: 12px;
          padding: 14px 16px;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
          outline: none;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          z-index: 1;
          background: transparent;
        }

        .input-field::placeholder {
          color: rgba(255, 255, 255, 0.15);
          font-weight: 400;
        }

        .input-field:focus {
          border-color: transparent;
          background: rgba(255, 255, 255, 0.02);
          box-shadow: none;
        }

        .input-border {
          position: absolute;
          inset: 0;
          border-radius: 12px;
          padding: 1.5px;
          background: linear-gradient(135deg, #20d8dc, #d99145, #20d8dc);
          background-size: 200% 200%;
          opacity: 0;
          transition: opacity 0.4s ease;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          animation: borderGradient 3s ease infinite;
        }

        @keyframes borderGradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .input-wrapper:focus-within .input-border {
          opacity: 1;
        }

        .input-field:focus ~ .input-border {
          opacity: 1;
        }

        /* === BUTTON === */
        .login-btn {
          width: 100%;
          padding: 16px;
          margin-top: 22px;
          background: linear-gradient(135deg, rgba(32,148,163,.96), rgba(199,121,56,.94));
          border: none;
          border-radius: 12px;
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(32, 136, 166, 0.2);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          letter-spacing: 0.3px;
        }


        .login-btn-shimmer {
          position: absolute !important;
          inset: 0;
          z-index: 1 !important;
          background:
            linear-gradient(
              120deg,
              transparent 24%,
              rgba(255,255,255,.18),
              transparent 72%
            );
          transform: translateX(-140%);
          animation: loginButtonShimmer 3.7s ease-in-out infinite;
        }

        @keyframes loginButtonShimmer {
          0%,55% { transform: translateX(-140%); }
          82%,100% { transform: translateX(140%); }
        }

        .login-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #d99145, #20d8dc);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .login-btn::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1), transparent 60%);
          opacity: 0;
          transform: scale(0.5);
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .login-btn:hover::before {
          opacity: 1;
        }

        .login-btn:hover::after {
          opacity: 1;
          transform: scale(1.5);
        }

        .login-btn:hover {
          transform: translateY(-3px) scale(1.01);
          box-shadow: 0 8px 40px rgba(32, 136, 166, 0.35);
        }

        .login-btn:active {
          transform: translateY(-1px) scale(0.99);
        }

        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .login-btn span {
          position: relative;
          z-index: 1;
        }

        .btn-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2.5px solid rgba(255, 255, 255, 0.2);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s cubic-bezier(0.6, 0, 0.4, 1) infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* === FOOTER === */
        .login-footer {
          text-align: center;
          margin-top: 24px;
          animation: fadeSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.45s both;
        }

        .toggle-btn {
          background: none;
          border: none;
          color: rgba(32, 136, 166, 0.7);
          font-size: 13px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 8px 16px;
          border-radius: 8px;
          position: relative;
        }

        .toggle-btn::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 1.5px;
          background: linear-gradient(90deg, transparent, #2088A6, transparent);
          transition: width 0.3s ease;
        }

        .toggle-btn:hover {
          color: #2088A6;
          background: rgba(32, 136, 166, 0.05);
        }

        .toggle-btn:hover::after {
          width: 60%;
        }

        .login-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.06), transparent);
          margin: 24px 0 14px;
          animation: fadeSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
        }

        .login-copyright {
          text-align: center;
          color: rgba(255, 255, 255, 0.12);
          font-size: 11px;
          font-weight: 500;
          margin: 0;
          animation: fadeSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.55s both;
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

        /* === RESPONSIVE === */
        @media (max-width: 480px) {
          .login-card {
            padding: 32px 24px 28px;
            border-radius: 18px;
          }
          .login-title {
            font-size: 18px;
          }
          .logo-text {
            font-size: 24px;
          }
        }

        @media (min-width: 768px) {
          .login-card {
            padding: 48px 40px 40px;
          }
        }
      `}</style>
    </div>
  );
}
