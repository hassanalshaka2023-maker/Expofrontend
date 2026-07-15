import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  BarChart3,
  Box,
  QrCode,
  User,
  Menu,
  X,
  Shield,
  Users,
} from "lucide-react";
import Login from "./pages/Login";
import GlobalQRGenerator from "./pages/GlobalQRGenerator";
import AttendanceLogs from "./pages/AttendanceLogs";
import InvestorDashboard from "./pages/InvestorDashboard";
import AdminBoothsManager from "./pages/AdminBoothsManager";
import StaffManagement from "./pages/StaffManagement";
import VisitorMapPage from "./pages/VisitorMapPage";
import BottomNav from "./components/ui/BottomNav";
import Logo from "./assets/Logo.png";

const premiumSpring = {
  type: "spring",
  stiffness: 260,
  damping: 26,
};

function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#eef4fb]" />

      <motion.div
        className="absolute -right-56 top-0 h-[620px] w-[620px] rounded-full bg-[#17d9d4]/[0.18] blur-[130px]"
        animate={{
          x: [0, -70, 15, 0],
          y: [0, 55, -18, 0],
          scale: [1, 1.13, 0.96, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute -bottom-64 -left-44 h-[560px] w-[560px] rounded-full bg-[#e6be6a]/[0.18] blur-[130px]"
        animate={{
          x: [0, 90, 20, 0],
          y: [0, -75, 15, 0],
          scale: [1, 1.12, 0.95, 1],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(11,147,166,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(11,147,166,.08) 1px, transparent 1px)",
          backgroundSize: "78px 78px",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 12%, black 86%, transparent 100%)",
        }}
      />

      <motion.div
        className="absolute left-[18%] top-[96px] h-28 w-[62%] opacity-60"
        animate={{ x: ["-3%", "3%", "-3%"], opacity: [0.28, 0.8, 0.28] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="absolute h-16 w-full rounded-[50%] border-t border-[#a9791f]/25"
            style={{ top: item * 18, opacity: 1 - item * 0.23 }}
          />
        ))}
      </motion.div>

      {Array.from({ length: 20 }).map((_, index) => (
        <motion.span
          key={index}
          className="absolute h-1 w-1 rounded-full bg-[#d2aa55] shadow-[0_0_12px_rgba(210,170,85,.6)]"
          style={{
            left: `${(index * 31) % 96}%`,
            top: `${10 + ((index * 47) % 80)}%`,
          }}
          animate={{
            y: [8, -14, 8],
            opacity: [0.12, 0.9, 0.12],
            scale: [0.7, 1.25, 0.7],
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

function TabButton({ active, onClick, icon, label, badge }) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative isolate flex min-h-[48px] items-center gap-2 overflow-hidden rounded-xl border px-4 py-2.5 text-[11px] font-bold transition-colors ${
        active
          ? "border-[#0b93a6]/45 text-[#076e7e] shadow-[0_0_26px_rgba(23,217,212,.14)]"
          : "border-transparent text-[#55697d] hover:border-[#0d2338]/10 hover:bg-[#0b93a6]/[0.05] hover:text-[#0d2338]"
      }`}
    >
      {active && (
        <>
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-[#17d9d4]/[0.18] to-white/85"
            transition={premiumSpring}
          />
          <motion.div
            className="absolute bottom-0 left-[18%] right-[18%] h-px bg-gradient-to-r from-transparent via-[#0aa2b4] to-transparent shadow-[0_0_12px_#17d9d4]"
            animate={{ opacity: [0.45, 1, 0.45], scaleX: [0.7, 1, 0.7] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/[0.5] to-transparent"
            initial={{ x: "-150%" }}
            animate={{ x: "150%" }}
            transition={{ duration: 3.8, repeat: Infinity, repeatDelay: 1.5 }}
          />
        </>
      )}

      <span className={`text-sm ${active ? "text-[#0b93a6]" : ""}`}>{icon}</span>
      <span className="hidden sm:inline">{label}</span>

      {badge !== undefined && badge > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[8px] font-black text-white shadow-lg shadow-rose-500/30">
          {badge}
        </span>
      )}
    </motion.button>
  );
}

function LogoBrand({ subtitle = "Control Panel" }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.08, ...premiumSpring }}
      className="flex min-w-0 items-center gap-3"
    >
      <motion.img
        src={Logo}
        alt="HOPEX"
        className="h-40 w-[175px] object-contain object-left sm:h-30 sm:w-[200px]"
        animate={{
          filter: [
            "drop-shadow(0 0 8px rgba(23,217,212,.1))",
            "drop-shadow(0 0 20px rgba(23,217,212,.3))",
            "drop-shadow(0 0 8px rgba(23,217,212,.1))",
          ],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="hidden border-l border-[#0d2338]/10 pl-2 lg:block">
        <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#a9791f]">
          {subtitle}
        </p>
        <p className="mt-1 text-[7px] text-[#55697d]">
          The New Era of Exhibitions
        </p>
      </div>
    </motion.div>
  );
}

function UserBadge({ user, compact = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.14 }}
      whileHover={{ y: -2 }}
      className="flex items-center gap-2.5 rounded-2xl border border-[#0b93a6]/30 bg-gradient-to-br from-[#17d9d4]/[0.12] to-white/85 p-1.5 pl-3 shadow-[inset_0_1px_0_rgba(255,255,255,.7)]"
    >
      <div className="relative grid h-10 w-10 place-items-center rounded-xl border border-[#0b93a6]/25 bg-gradient-to-br from-[#17d9d4]/25 to-white text-sm font-black text-[#076e7e]">
        {user.name?.charAt(0)?.toUpperCase() || <User className="h-4 w-4" />}
        <motion.span
          className="absolute -inset-1 rounded-[15px] border border-transparent border-b-[#d2aa55]/60 border-r-[#0aa2b4]/60"
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {!compact && (
        <div className="hidden lg:block">
          <p className="max-w-[120px] truncate text-[11px] font-black text-[#0d2338]">
            {user.name}
          </p>
          <p className="mt-0.5 text-[9px] font-medium text-[#0b93a6]">
            {user.role === "admin" ? "Main Administrator" : user.companyName}
          </p>
        </div>
      )}
    </motion.div>
  );
}

function GlassHeader({ user, activeTab, onTabChange, onLogout, onMenuToggle }) {
  const tabs = [
    {
      key: "logs",
      icon: <BarChart3 className="h-4 w-4" />,
      label: "Attendance Logs",
    },
    {
      key: "booths",
      icon: <Box className="h-4 w-4" />,
      label: "3D Booth Hall",
    },
    {
      key: "staff",
      icon: <Users className="h-4 w-4" />,
      label: "Staff Management",
    },
    {
      key: "qr",
      icon: <QrCode className="h-4 w-4" />,
      label: "Visitor QR",
    },
  ];

  return (
    <motion.header
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 190, damping: 22 }}
      className="relative z-50 flex min-h-[82px] items-center justify-between overflow-hidden border-b border-[#0d2338]/10 bg-white/85 px-4 backdrop-blur-2xl lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/4 h-52 w-80 rounded-full bg-[#17d9d4]/[0.14] blur-3xl" />
        <div className="absolute -bottom-24 right-1/4 h-48 w-64 rounded-full bg-[#e6be6a]/[0.14] blur-3xl" />
      </div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0aa2b4]/60 to-[#d2aa55]/50"
        animate={{ opacity: [0.3, 1, 0.3], scaleX: [0.35, 1, 0.35] }}
        transition={{ duration: 4.5, repeat: Infinity }}
      />

      <div className="relative z-10 flex min-w-0 items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={onMenuToggle}
          aria-label="Open navigation menu"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[#0d2338]/10 bg-white text-[#55697d] transition hover:border-[#0b93a6]/30 hover:text-[#0b93a6] lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </motion.button>

        <LogoBrand />

        <div className="hidden items-center rounded-2xl border border-[#0d2338]/10 bg-[#0d2338]/[0.04] p-1.5 lg:flex">
          {tabs.map((tab) => (
            <TabButton
              key={tab.key}
              active={activeTab === tab.key}
              onClick={() => onTabChange(tab.key)}
              icon={tab.icon}
              label={tab.label}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-3">
        <UserBadge user={user} />

        <motion.button
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onLogout}
          className="flex min-h-[48px] items-center gap-2 rounded-xl border border-[#0d2338]/10 bg-white px-4 text-[10px] font-bold text-[#55697d] transition hover:border-[#a9791f]/40 hover:bg-[#d2aa55]/10 hover:text-[#a9791f]"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </motion.button>
      </div>
    </motion.header>
  );
}

function InvestorHeader({ user, onLogout }) {
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={premiumSpring}
      className="relative z-50 flex min-h-[82px] items-center justify-between overflow-hidden border-b border-[#0d2338]/10 bg-white/85 px-4 backdrop-blur-2xl lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-1/4 h-60 w-72 rounded-full bg-[#e6be6a]/[0.16] blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-48 w-72 rounded-full bg-[#17d9d4]/[0.12] blur-3xl" />
      </div>

      <div className="relative z-10 flex items-center gap-4">
        <LogoBrand subtitle="Investor Portal" />

        <div className="hidden md:block">
          <span className="inline-flex items-center gap-1 rounded-full border border-[#a9791f]/25 bg-[#d2aa55]/15 px-2.5 py-1 text-[9px] font-bold text-[#a9791f]">
            <Shield className="h-3 w-3" />
            Investor
          </span>
          <p className="mt-1 text-[11px] font-bold text-[#0d2338]">
            {user.companyName}
            <span className="ml-1 font-medium text-[#55697d]">
              ({user.name})
            </span>
          </p>
        </div>
      </div>

      <motion.button
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={onLogout}
        className="relative z-10 flex min-h-[48px] items-center gap-2 rounded-xl border border-[#0d2338]/10 bg-white px-4 text-[10px] font-bold text-[#55697d] transition hover:border-rose-400/40 hover:bg-rose-500/[0.06] hover:text-rose-600"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Sign Out</span>
      </motion.button>
    </motion.header>
  );
}

const pageVariants = {
  initial: { opacity: 0, y: 18, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -12, filter: "blur(5px)" },
};

function DrawerOverlay({
  open,
  onClose,
  user,
  activeTab,
  onTabChange,
  onLogout,
}) {
  const drawerTabs = [
    {
      key: "logs",
      icon: <BarChart3 className="h-5 w-5" />,
      label: "Attendance Logs",
    },
    {
      key: "booths",
      icon: <Box className="h-5 w-5" />,
      label: "3D Booth Hall",
    },
    {
      key: "staff",
      icon: <Users className="h-5 w-5" />,
      label: "Staff Management",
    },
    {
      key: "qr",
      icon: <QrCode className="h-5 w-5" />,
      label: "Visitor QR",
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-[#0d2338]/30 backdrop-blur-sm lg:hidden"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className="fixed bottom-0 left-0 top-0 z-[70] flex w-[310px] flex-col overflow-hidden border-l border-[#0d2338]/10 bg-white/95 shadow-2xl lg:hidden"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -right-24 top-16 h-72 w-72 rounded-full bg-[#17d9d4]/[0.16] blur-3xl" />
              <div className="absolute -bottom-24 left-0 h-64 w-64 rounded-full bg-[#e6be6a]/[0.14] blur-3xl" />
            </div>

            <div className="relative z-10 flex items-center justify-between border-b border-[#0d2338]/10 p-5">
              <LogoBrand subtitle="Menu" />

              <motion.button
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                aria-label="Close navigation menu"
                className="grid h-9 w-9 place-items-center rounded-full border border-[#0d2338]/10 bg-white text-[#55697d] hover:text-[#0d2338]"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </div>

            <div className="relative z-10 flex-1 space-y-2 overflow-y-auto p-4">
              {drawerTabs.map((tab) => {
                const isActive = activeTab === tab.key;

                return (
                  <motion.button
                    key={tab.key}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onTabChange(tab.key)}
                    className={`flex min-h-[54px] w-full items-center gap-3 rounded-xl border px-4 text-right transition ${
                      isActive
                        ? "border-[#0b93a6]/30 bg-[#0b93a6]/[0.1] text-[#076e7e]"
                        : "border-transparent text-[#55697d] hover:border-[#0d2338]/10 hover:bg-[#0d2338]/[0.04] hover:text-[#0d2338]"
                    }`}
                  >
                    {tab.icon}
                    <span className="text-sm font-bold">{tab.label}</span>

                    {isActive && (
                      <motion.div
                        layoutId="drawerActive"
                        className="ml-auto h-2 w-2 rounded-full bg-[#0aa2b4] shadow-[0_0_10px_#17d9d4]"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            <div className="relative z-10 border-t border-[#0d2338]/10 p-4">
              <div className="mb-3 rounded-xl border border-[#0d2338]/10 bg-[#0d2338]/[0.03] p-3">
                <p className="mb-1 text-[10px] text-[#55697d]">User</p>
                <p className="text-xs font-bold text-[#0d2338]">{user.name}</p>
              </div>

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={onLogout}
                className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl border border-[#0d2338]/10 bg-white text-xs font-bold text-[#55697d] transition hover:border-rose-400/40 hover:bg-rose-500/[0.06] hover:text-rose-600"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </motion.button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function DashboardApp() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("booths");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  if (!user) {
    return <Login onLoginSuccess={(loggedInUser) => setUser(loggedInUser)} />;
  }

  if (user.role === "admin") {
    return (
      <div
        className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#eef4fb] text-[#0d2338]"
        dir="ltr"
      >
        <AmbientBackground />

        <GlassHeader
          user={user}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
          onMenuToggle={() => setDrawerOpen((value) => !value)}
        />

        <div className="relative z-10 flex-1 overflow-y-auto pb-20 lg:pb-0">
          <AnimatePresence mode="wait">
            {activeTab === "logs" && (
              <motion.div
                key="logs"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                className="flex-1 overflow-y-auto"
              >
                <AttendanceLogs />
              </motion.div>
            )}

            {activeTab === "booths" && (
              <motion.div
                key="booths"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                className="flex-1 overflow-y-auto"
              >
                <AdminBoothsManager />
              </motion.div>
            )}

            {activeTab === "staff" && (
              <motion.div
                key="staff"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                className="flex-1 overflow-y-auto"
              >
                <StaffManagement />
              </motion.div>
            )}

            {activeTab === "qr" && (
              <motion.div
                key="qr"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                className="flex-1 overflow-y-auto"
              >
                <GlobalQRGenerator />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <BottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
        />

        <DrawerOverlay
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          user={user}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setDrawerOpen(false);
          }}
          onLogout={() => {
            setDrawerOpen(false);
            handleLogout();
          }}
        />
      </div>
    );
  }

  if (user.role === "investor") {
    return (
      <div
        className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#eef4fb] text-[#0d2338]"
        dir="ltr"
      >
        <AmbientBackground />
        <InvestorHeader user={user} onLogout={handleLogout} />

        <div className="relative z-10 flex-1">
          <InvestorDashboard user={user} />
        </div>
      </div>
    );
  }

  return null;
}

/* App shell / router.
 *   - /visitor/map[/:exhibitionId]  → PUBLIC read-only Visitor map (no login).
 *   - everything else               → the existing login + Admin/Investor
 *     dashboard, unchanged.
 * This app has a single implicit exhibition (booths are served globally by
 * GET /booths), so :exhibitionId is optional and only informational. */
export default function App() {
  return (
    <Routes>
      <Route path="/visitor/map" element={<VisitorMapPage />} />
      <Route path="/visitor/map/:exhibitionId" element={<VisitorMapPage />} />
      <Route path="*" element={<DashboardApp />} />
    </Routes>
  );
}
