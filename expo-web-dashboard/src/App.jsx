import { useState } from "react";
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
} from "lucide-react";
import Login from "./pages/Login";
import GlobalQRGenerator from "./pages/GlobalQRGenerator";
import AttendanceLogs from "./pages/AttendanceLogs";
import InvestorDashboard from "./pages/InvestorDashboard";
import AdminBoothsManager from "./pages/AdminBoothsManager";
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
      <div className="absolute inset-0 bg-[#020914]" />

      <motion.div
        className="absolute -right-56 top-0 h-[620px] w-[620px] rounded-full bg-cyan-400/[0.08] blur-[130px]"
        animate={{
          x: [0, -70, 15, 0],
          y: [0, 55, -18, 0],
          scale: [1, 1.13, 0.96, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute -bottom-64 -left-44 h-[560px] w-[560px] rounded-full bg-amber-500/[0.08] blur-[130px]"
        animate={{
          x: [0, 90, 20, 0],
          y: [0, -75, 15, 0],
          scale: [1, 1.12, 0.95, 1],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(32,216,220,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(32,216,220,.08) 1px, transparent 1px)",
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
            className="absolute h-16 w-full rounded-[50%] border-t border-amber-400/25"
            style={{ top: item * 18, opacity: 1 - item * 0.23 }}
          />
        ))}
      </motion.div>

      {Array.from({ length: 20 }).map((_, index) => (
        <motion.span
          key={index}
          className="absolute h-1 w-1 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(245,185,95,.8)]"
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
          ? "border-cyan-400/50 text-white shadow-[0_0_26px_rgba(32,216,220,.08)]"
          : "border-transparent text-slate-500 hover:border-white/5 hover:bg-white/[0.025] hover:text-slate-200"
      }`}
    >
      {active && (
        <>
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-cyan-400/[0.16] to-[#061524]/80"
            transition={premiumSpring}
          />
          <motion.div
            className="absolute bottom-0 left-[18%] right-[18%] h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_12px_#20d8dc]"
            animate={{ opacity: [0.45, 1, 0.45], scaleX: [0.7, 1, 0.7] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
            initial={{ x: "-150%" }}
            animate={{ x: "150%" }}
            transition={{ duration: 3.8, repeat: Infinity, repeatDelay: 1.5 }}
          />
        </>
      )}

      <span className={`text-sm ${active ? "text-cyan-300" : ""}`}>{icon}</span>
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
            "drop-shadow(0 0 8px rgba(32,216,220,.06))",
            "drop-shadow(0 0 20px rgba(32,216,220,.2))",
            "drop-shadow(0 0 8px rgba(32,216,220,.06))",
          ],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="hidden border-l border-white/10 pl-2 lg:block">
        <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-amber-400/80">
          {subtitle}
        </p>
        <p className="mt-1 text-[7px] text-slate-500">
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
      className="flex items-center gap-2.5 rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-400/[0.1] to-[#061523]/80 p-1.5 pl-3 shadow-[inset_0_1px_0_rgba(255,255,255,.04)]"
    >
      <div className="relative grid h-10 w-10 place-items-center rounded-xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/30 to-cyan-950/80 text-sm font-black text-cyan-300">
        {user.name?.charAt(0)?.toUpperCase() || <User className="h-4 w-4" />}
        <motion.span
          className="absolute -inset-1 rounded-[15px] border border-transparent border-b-amber-400/45 border-r-cyan-400/65"
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {!compact && (
        <div className="hidden lg:block">
          <p className="max-w-[120px] truncate text-[11px] font-black text-white">
            {user.name}
          </p>
          <p className="mt-0.5 text-[9px] font-medium text-cyan-400">
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
      className="relative z-50 flex min-h-[82px] items-center justify-between overflow-hidden border-b border-cyan-400/20 bg-[#03101e]/92 px-4 backdrop-blur-2xl lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/4 h-52 w-80 rounded-full bg-cyan-400/[0.055] blur-3xl" />
        <div className="absolute -bottom-24 right-1/4 h-48 w-64 rounded-full bg-amber-500/[0.05] blur-3xl" />
      </div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-amber-400/50"
        animate={{ opacity: [0.3, 1, 0.3], scaleX: [0.35, 1, 0.35] }}
        transition={{ duration: 4.5, repeat: Infinity }}
      />

      <div className="relative z-10 flex min-w-0 items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={onMenuToggle}
          aria-label="Open navigation menu"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-slate-400 transition hover:border-cyan-400/20 hover:text-cyan-300 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </motion.button>

        <LogoBrand />

        <div className="hidden items-center rounded-2xl border border-white/[0.06] bg-black/20 p-1.5 lg:flex">
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
          className="flex min-h-[48px] items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.025] px-4 text-[10px] font-bold text-slate-400 transition hover:border-amber-400/30 hover:bg-amber-500/[0.06] hover:text-amber-300"
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
      className="relative z-50 flex min-h-[82px] items-center justify-between overflow-hidden border-b border-amber-400/20 bg-[#03101e]/94 px-4 backdrop-blur-2xl lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-1/4 h-60 w-72 rounded-full bg-amber-500/[0.07] blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-48 w-72 rounded-full bg-cyan-400/[0.04] blur-3xl" />
      </div>

      <div className="relative z-10 flex items-center gap-4">
        <LogoBrand subtitle="Investor Portal" />

        <div className="hidden md:block">
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/20 bg-amber-400/[0.08] px-2.5 py-1 text-[9px] font-bold text-amber-300">
            <Shield className="h-3 w-3" />
            Investor
          </span>
          <p className="mt-1 text-[11px] font-bold text-white">
            {user.companyName}
            <span className="ml-1 font-medium text-slate-500">
              ({user.name})
            </span>
          </p>
        </div>
      </div>

      <motion.button
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={onLogout}
        className="relative z-10 flex min-h-[48px] items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.025] px-4 text-[10px] font-bold text-slate-400 transition hover:border-rose-400/30 hover:bg-rose-500/[0.08] hover:text-rose-300"
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
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm lg:hidden"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className="fixed bottom-0 left-0 top-0 z-[70] flex w-[310px] flex-col overflow-hidden border-l border-cyan-400/15 bg-[#03101e]/98 shadow-2xl lg:hidden"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -right-24 top-16 h-72 w-72 rounded-full bg-cyan-400/[0.07] blur-3xl" />
              <div className="absolute -bottom-24 left-0 h-64 w-64 rounded-full bg-amber-500/[0.05] blur-3xl" />
            </div>

            <div className="relative z-10 flex items-center justify-between border-b border-white/[0.07] p-5">
              <LogoBrand subtitle="Menu" />

              <motion.button
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                aria-label="Close navigation menu"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/[0.07] bg-white/[0.035] text-slate-400 hover:text-white"
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
                        ? "border-cyan-400/25 bg-cyan-400/[0.1] text-cyan-300"
                        : "border-transparent text-slate-400 hover:border-white/[0.05] hover:bg-white/[0.035] hover:text-white"
                    }`}
                  >
                    {tab.icon}
                    <span className="text-sm font-bold">{tab.label}</span>

                    {isActive && (
                      <motion.div
                        layoutId="drawerActive"
                        className="ml-auto h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#20d8dc]"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            <div className="relative z-10 border-t border-white/[0.07] p-4">
              <div className="mb-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
                <p className="mb-1 text-[10px] text-slate-500">User</p>
                <p className="text-xs font-bold text-white">{user.name}</p>
              </div>

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={onLogout}
                className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.035] text-xs font-bold text-slate-400 transition hover:border-rose-400/25 hover:bg-rose-500/[0.08] hover:text-rose-300"
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

export default function App() {
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
        className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#020914] text-white"
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
        className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#020914] text-white"
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
