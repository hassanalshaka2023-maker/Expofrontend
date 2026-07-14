import { useState } from "react";
import {
  AlertCircle,
  Building2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  QrCode,
  ScanLine,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import { webApi } from "../services/api";
import AnimatedLoginBackdrop from "../components/AnimatedLoginBackdrop";
import Logo from "../assets/Logo.png";
import "./Login.css";

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="login-page">
      <AnimatedLoginBackdrop />

      <div className="login-shell">
        {/* Left: brand + exhibition-inspired backdrop (desktop) */}
        <aside className="login-brand">
          <div className="login-brand-inner">
            <img src={Logo} alt="HOPEX" className="login-brand-logo" />

            <div className="login-brand-badges">
              <span className="login-badge">
                <Sparkles size={13} /> Exhibition Platform
              </span>
              <span className="login-badge is-gold">
                <ShieldCheck size={13} /> Secure Access
              </span>
            </div>

            <h2 className="login-brand-title">The New Era of Exhibitions</h2>
            <p className="login-brand-text">
              HOPEX unifies exhibition management, booth reservations, and
              intelligent venue navigation inside one connected ecosystem.
            </p>

            <ul className="login-brand-points">
              <li>
                <Building2 size={16} /> Manage exhibitions, halls, and booths
              </li>
              <li>
                <ScanLine size={16} /> QR-powered attendance and access
              </li>
              <li>
                <QrCode size={16} /> Real-time visitor and investor insights
              </li>
            </ul>
          </div>
        </aside>

        {/* Right: login form */}
        <main className="login-panel">
          <div className="login-card">
            <div className="login-card-brand">
              <img src={Logo} alt="HOPEX" className="login-card-logo" />
            </div>

            <div className="login-head">
              <h1 className="login-title">
                {isRegister ? "Create Investor Account" : "Welcome Back"}
              </h1>
              <p className="login-subtitle">
                {isRegister
                  ? "Join HOPEX and start your investment journey."
                  : "Access the HOPEX exhibition management ecosystem."}
              </p>
            </div>

            {error && (
              <div className="login-error" role="alert">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form" noValidate>
              {isRegister && (
                <>
                  <div className="field">
                    <label className="field-label" htmlFor="login-name">
                      Full Name
                    </label>
                    <div className="field-control">
                      <span className="field-icon">
                        <User size={17} />
                      </span>
                      <input
                        id="login-name"
                        type="text"
                        className="field-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        autoComplete="name"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label className="field-label" htmlFor="login-company">
                      Company Name
                    </label>
                    <div className="field-control">
                      <span className="field-icon">
                        <Building2 size={17} />
                      </span>
                      <input
                        id="login-company"
                        type="text"
                        className="field-input"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                        autoComplete="organization"
                        placeholder="Your company name"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="field">
                <label className="field-label" htmlFor="login-email">
                  Email Address
                </label>
                <div className="field-control">
                  <span className="field-icon">
                    <Mail size={17} />
                  </span>
                  <input
                    id="login-email"
                    type="email"
                    className="field-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="field">
                <label className="field-label" htmlFor="login-password">
                  Password
                </label>
                <div className="field-control">
                  <span className="field-icon">
                    <Lock size={17} />
                  </span>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    className="field-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete={isRegister ? "new-password" : "current-password"}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="field-toggle"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="login-submit"
                disabled={isSubmitting}
              >
                <span className="login-submit-inner">
                  {isSubmitting ? (
                    <>
                      <span className="login-spinner" />
                      {isRegister ? "Creating account…" : "Signing in…"}
                    </>
                  ) : isRegister ? (
                    "Create Account"
                  ) : (
                    "Sign In"
                  )}
                </span>
              </button>
            </form>

            <div className="login-alt">
              <button
                type="button"
                className="login-alt-btn"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError("");
                }}
              >
                {isRegister ? (
                  <>Already have an account? <b>Sign in</b></>
                ) : (
                  <>New investor? <b>Create your account</b></>
                )}
              </button>
            </div>

            <p className="login-foot">
              &copy; {new Date().getFullYear()} HOPEX. All rights reserved.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
