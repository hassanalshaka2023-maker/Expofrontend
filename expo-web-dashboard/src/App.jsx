import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, BarChart3, Box, QrCode, User, Menu, X, Shield, Sparkles } from 'lucide-react';
import Login from './pages/Login';
import GlobalQRGenerator from './pages/GlobalQRGenerator';
import AttendanceLogs from './pages/AttendanceLogs';
import InvestorDashboard from './pages/InvestorDashboard';
import AdminBoothsManager from './pages/AdminBoothsManager';
import BottomNav from './components/ui/BottomNav';

/* ─── TabButton: زر تبويب أنيق ─── */
function TabButton({ active, onClick, icon, label, badge }) {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold rounded-lg transition-colors ${
        active
          ? 'text-white'
          : 'text-gray-500 hover:text-gray-300'
      }`}
    >
      <span className="text-sm">{icon}</span>
      <span className="hidden sm:inline">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-rose-500 text-white text-[8px] font-black rounded-full shadow-lg shadow-rose-500/30">
          {badge}
        </span>
      )}
      {active && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-white/10 rounded-lg -z-10"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  );
}

/* ─── GlassHeader: شريط علوي فاخر بنفس جودة Login ─── */
function GlassHeader({ user, activeTab, onTabChange, onLogout, onMenuToggle }) {
  const tabs = [
    { key: 'logs', icon: <BarChart3 className="w-3.5 h-3.5" />, label: 'سجل الحضور' },
    { key: 'booths', icon: <Box className="w-3.5 h-3.5" />, label: 'صالة الأكشاك (3D)' },
    { key: 'qr', icon: <QrCode className="w-3.5 h-3.5" />, label: 'QR الزوار' },
  ];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="relative z-50 bg-gradient-to-r from-[#0c0e2b]/95 via-[#0f1235]/95 to-[#1a1040]/95 backdrop-blur-2xl border-b border-white/5 px-4 lg:px-6 h-16 flex items-center justify-between overflow-hidden"
    >
      {/* خلفية زخرفية */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-1/3 w-48 h-48 bg-violet-500/5 rounded-full blur-3xl" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

      {/* زر القائمة للشاشات الصغيرة */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onMenuToggle}
        className="lg:hidden flex items-center justify-center w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
      >
        <Menu className="w-5 h-5" />
      </motion.button>

      <div className="flex items-center gap-4 lg:gap-6">
        {/* Logo / Brand */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 ring-1 ring-white/10">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="hidden md:block">
            <h1 className="text-white font-black text-xs leading-tight">TECH EXPO</h1>
            <p className="text-[8px] text-gray-500 font-medium">لوحة التحكم</p>
          </div>
        </motion.div>

        {/* User Badge - للشاشات المتوسطة */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="hidden lg:flex items-center gap-2 bg-white/[0.03] border border-white/5 rounded-lg px-3 py-1.5"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-500/20 flex items-center justify-center">
            <User className="w-3 h-3 text-amber-400" />
          </div>
          <div>
            <p className="text-white font-bold text-[10px] leading-tight">{user.name}</p>
            <p className="text-[8px] text-gray-500 font-medium">{user.role === 'admin' ? 'الأدمن الرئيسي' : user.companyName}</p>
          </div>
        </motion.div>

        {/* Tabs - مخفية على الموبايل (تظهر في BottomNav) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="hidden lg:flex items-center bg-white/[0.03] border border-white/5 rounded-xl p-1"
        >
          {tabs.map((tab) => (
            <TabButton
              key={tab.key}
              active={activeTab === tab.key}
              onClick={() => onTabChange(tab.key)}
              icon={tab.icon}
              label={tab.label}
            />
          ))}
        </motion.div>
      </div>

      {/* مستخدم - للشاشات الصغيرة (اسم مختصر) */}
      <div className="lg:hidden flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-500/20 flex items-center justify-center">
          <User className="w-3 h-3 text-amber-400" />
        </div>
      </div>

      {/* Logout Button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onLogout}
        className="flex items-center gap-2 bg-white/[0.03] hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/20 text-gray-400 hover:text-rose-400 font-bold text-[10px] px-3 py-2 rounded-lg transition-all min-h-[36px]"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">تسجيل الخروج</span>
      </motion.button>
    </motion.header>
  );
}

/* ─── InvestorHeader: شريط المستثمر الفاخر ─── */
function InvestorHeader({ user, onLogout }) {
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="relative z-50 bg-gradient-to-r from-[#0c0e2b]/95 via-[#1a1040]/95 to-[#0f1235]/95 backdrop-blur-2xl border-b border-white/5 px-4 lg:px-6 h-16 flex items-center justify-between overflow-hidden"
    >
      {/* خلفية زخرفية */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

      <div className="flex items-center gap-3">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30 ring-1 ring-white/10"
        >
          <span className="text-white font-black text-sm">I</span>
        </motion.div>
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/10 text-amber-400 text-[8px] px-1.5 py-0.5 rounded font-bold border border-amber-500/20 flex items-center gap-1">
              <Shield className="w-2.5 h-2.5" />
              بوابة المستثمرين
            </span>
          </div>
          <p className="text-white font-bold text-xs mt-0.5">
            {user.companyName}
            <span className="text-gray-500 font-medium mr-1">({user.name})</span>
          </p>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onLogout}
        className="flex items-center gap-2 bg-white/[0.03] hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/20 text-gray-400 hover:text-rose-400 font-bold text-[10px] px-3 py-2 rounded-lg transition-all min-h-[36px]"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">تسجيل الخروج</span>
      </motion.button>
    </motion.header>
  );
}

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

/* ─── DrawerOverlay: قائمة جانبية فاخرة ─── */
function DrawerOverlay({ open, onClose, user, activeTab, onTabChange, onLogout }) {
  const drawerTabs = [
    { key: 'logs', icon: <BarChart3 className="w-5 h-5" />, label: 'سجل الحضور' },
    { key: 'booths', icon: <Box className="w-5 h-5" />, label: 'صالة الأكشاك (3D)' },
    { key: 'qr', icon: <QrCode className="w-5 h-5" />, label: 'QR الزوار' },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 bottom-0 z-[70] w-[300px] bg-gradient-to-b from-[#0c0e2b] to-[#0f1235] border-l border-white/10 shadow-2xl lg:hidden flex flex-col"
          >
            {/* رأس الدراور */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-black text-xs">القائمة</h2>
                  <p className="text-[9px] text-gray-500">{user.name}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* قائمة التبويبات */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {drawerTabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <motion.button
                    key={tab.key}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onTabChange(tab.key)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3.5 min-h-[48px] rounded-xl text-right transition-all
                      ${isActive
                        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                      }
                    `}
                  >
                    {tab.icon}
                    <span className="font-bold text-sm">{tab.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="drawerActive"
                        className="mr-auto w-1.5 h-1.5 rounded-full bg-indigo-500"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* معلومات المستخدم */}
            <div className="p-4 border-t border-white/10">
              <div className="bg-white/[0.03] rounded-xl p-3 mb-3 border border-white/5">
                <p className="text-[10px] text-gray-500 mb-1">الدور</p>
                <p className="text-white font-bold text-xs">{user.role === 'admin' ? 'الأدمن الرئيسي' : user.companyName}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 min-h-[48px] bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/20 text-gray-400 hover:text-rose-400 font-bold text-xs rounded-xl transition-all"
              >
                <LogOut className="w-4 h-4" />
                تسجيل الخروج
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════
   التطبيق الرئيسي
   ═══════════════════════════════════════════════════════ */
export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('booths');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // 1. شاشة تسجيل الدخول
  if (!user) {
    return <Login onLoginSuccess={(loggedInUser) => setUser(loggedInUser)} />;
  }

  // 2. واجهة الأدمن
  if (user.role === 'admin') {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex flex-col" dir="rtl">
        <GlassHeader
          user={user}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
          onMenuToggle={() => setDrawerOpen(!drawerOpen)}
        />

        <div className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <AnimatePresence mode="wait">
            {activeTab === 'logs' && (
              <motion.div
                key="logs"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="flex-1 overflow-y-auto"
              >
                <AttendanceLogs />
              </motion.div>
            )}
            {activeTab === 'booths' && (
              <motion.div
                key="booths"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="flex-1 overflow-y-auto"
              >
                <AdminBoothsManager />
              </motion.div>
            )}
            {activeTab === 'qr' && (
              <motion.div
                key="qr"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeOut' }}
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

  // 3. واجهة المستثمر
  if (user.role === 'investor') {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex flex-col" dir="rtl">
        <InvestorHeader user={user} onLogout={handleLogout} />

        <div className="flex-1">
          <InvestorDashboard user={user} />
        </div>
      </div>
    );
  }

  return null;
}