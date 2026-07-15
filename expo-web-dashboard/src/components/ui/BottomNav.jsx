import { motion } from 'framer-motion';
import { BarChart3, Box, QrCode, Users, LogOut } from 'lucide-react';

const tabs = [
  { key: 'logs', icon: BarChart3, label: 'سجل الحضور' },
  { key: 'booths', icon: Box, label: 'الأكشاك' },
  { key: 'staff', icon: Users, label: 'الموظفين' },
  { key: 'qr', icon: QrCode, label: 'QR الزوار' },
];

export default function BottomNav({ activeTab, onTabChange, onLogout }) {
  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 backdrop-blur-2xl border-t border-[#0d2338]/10 safe-area-bottom"
    >
      <div className="flex items-center justify-around px-2 py-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <motion.button
              key={tab.key}
              whileTap={{ scale: 0.92 }}
              onClick={() => onTabChange(tab.key)}
              className={`
                relative flex flex-col items-center justify-center gap-0.5
                min-w-[64px] min-h-[56px] px-3 py-1.5 rounded-xl
                transition-colors duration-200
                ${isActive
                  ? 'text-[#076e7e]'
                  : 'text-[#55697d] hover:text-[#0d2338]'
                }
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavActive"
                  className="absolute inset-0 bg-[#0b93a6]/10 rounded-xl"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <div className="relative z-10 flex flex-col items-center gap-0.5">
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-bold">{tab.label}</span>
              </div>
            </motion.button>
          );
        })}

        {/* زر تسجيل الخروج */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={onLogout}
          className="flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[56px] px-3 py-1.5 rounded-xl text-[#55697d] hover:text-rose-600 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[10px] font-bold">خروج</span>
        </motion.button>
      </div>
    </motion.nav>
  );
}