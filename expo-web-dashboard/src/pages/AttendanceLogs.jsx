import { useEffect, useState } from 'react';
import { webApi } from '../services/api';
import { Users, ArrowRightLeft, RefreshCw, Sparkles, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AttendanceLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchLogs = async () => {
      try {
        const data = await webApi.getAttendanceLogs();
        if (isMounted) {
          setLogs(data);
          setLoading(false);
          setRefreshing(false);
        }
      } catch (err) {
        console.error('فشل في جلب سجلات الحضور:', err);
        if (isMounted) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await webApi.getAttendanceLogs();
      setLogs(data);
    } catch (err) {
      console.error('فشل في تحديث سجلات الحضور يدوياً:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const totalActions = logs.length;
  const totalCheckIns = logs.filter(log => log.actionType === 'check-in').length;

  if (loading) return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#030712] p-4 sm:p-6 lg:p-8" dir="rtl">
      {/* رأس الصفحة الفاخر */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-6 sm:mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c0e2b] via-[#0f1235] to-[#1a1040] border border-white/5 p-5 sm:p-6"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">مراقبة حية</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">📊 سجل الحضور والانصراف</h2>
            <p className="text-gray-500 text-[11px] sm:text-xs mt-1">يتم تحديث البيانات تلقائياً عند مسح QR Code</p>
          </div>
          <motion.button 
            onClick={handleRefresh}
            disabled={refreshing}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-white/[0.05] hover:bg-white/10 border border-white/10 hover:border-indigo-500/30 disabled:opacity-50 text-gray-300 hover:text-indigo-400 px-4 py-3 min-h-[44px] rounded-xl text-xs font-bold transition-all"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin text-indigo-400' : ''} />
            {refreshing ? 'جاري التحديث...' : 'تحديث'}
          </motion.button>
        </div>
      </motion.div>

      {/* بطاقات الإحصائيات الفاخرة */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c0e2b] to-[#0f1235] border border-white/5 p-4 sm:p-5"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <p className="text-gray-400 text-[10px] sm:text-xs font-bold mb-1">إجمالي الحركات اليومية</p>
            <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              {totalActions}
              <span className="text-xs text-gray-500 font-medium">حركات</span>
            </h3>
            <div className="mt-2 w-12 h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" />
          </div>
          <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
            <ArrowRightLeft className="w-5 h-5 text-indigo-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c0e2b] to-[#0f1235] border border-white/5 p-4 sm:p-5"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <p className="text-gray-400 text-[10px] sm:text-xs font-bold mb-1">عمليات الدخول</p>
            <h3 className="text-xl sm:text-2xl font-black text-emerald-400 flex items-center gap-2">
              {totalCheckIns}
              <span className="text-xs text-gray-500 font-medium">دخول</span>
            </h3>
            <div className="mt-2 w-12 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
          </div>
          <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-emerald-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c0e2b] to-[#0f1235] border border-white/5 p-4 sm:p-5"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <p className="text-gray-400 text-[10px] sm:text-xs font-bold mb-1">آخر حركة</p>
            <h3 className="text-sm font-bold text-white truncate max-w-[180px]">
              {logs[0] ? `${logs[0].staffId?.name || 'موظف'} (${logs[0].actionType === 'check-in' ? 'دخل' : 'خرج'})` : 'لا يوجد حركات'}
            </h3>
            <div className="mt-2 w-12 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" />
          </div>
          <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Activity className="w-5 h-5 text-amber-400" />
          </div>
        </motion.div>
      </div>

      {/* جدول البيانات الفاخر */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl bg-gradient-to-br from-[#0c0e2b] to-[#0f1235] border border-white/5 overflow-hidden"
      >
        {/* عرض البطاقات على الشاشات الصغيرة */}
        <div className="block lg:hidden divide-y divide-white/5">
          {logs.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-xs">لا توجد أي سجلات حضور أو انصراف لليوم بعد.</div>
          ) : (
            logs.map((log, i) => {
              const isCheckIn = log.actionType === 'check-in';
              return (
                <motion.div
                  key={log._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="p-4 space-y-2 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{log.staffId?.name || 'موظف غير معروف'}</span>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                      isCheckIn 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {isCheckIn ? '📥 دخول' : '📤 خروج'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">{log.staffId?.email || '---'}</span>
                    <span className="text-gray-500 font-mono" dir="ltr">
                      {log.timestamp ? new Date(log.timestamp).toLocaleString('ar-SY', { hour12: true }) : '---'}
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* الجدول للشاشات الكبيرة */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-sm text-right text-gray-300">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-4 font-bold text-[10px] text-gray-500 uppercase tracking-wider">اسم الموظف</th>
                <th className="px-6 py-4 font-bold text-[10px] text-gray-500 uppercase tracking-wider">البريد الإلكتروني</th>
                <th className="px-6 py-4 font-bold text-[10px] text-gray-500 uppercase tracking-wider text-center">نوع الحركة</th>
                <th className="px-6 py-4 font-bold text-[10px] text-gray-500 uppercase tracking-wider">الوقت والتاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-12 text-gray-500 text-xs">لا توجد أي سجلات حضور أو انصراف لليوم بعد.</td>
                </tr>
              ) : (
                logs.map((log, i) => {
                  const isCheckIn = log.actionType === 'check-in';
                  return (
                    <motion.tr
                      key={log._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4 font-bold text-white">{log.staffId?.name || 'موظف غير معروف'}</td>
                      <td className="px-6 py-4 text-xs text-gray-400">{log.staffId?.email || '---'}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block text-[10px] font-black px-3 py-1 rounded-full ${
                          isCheckIn 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {isCheckIn ? '📥 دخول (Check-In)' : '📤 خروج (Check-Out)'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400 font-mono" dir="ltr">
                        {log.timestamp ? new Date(log.timestamp).toLocaleString('ar-SY', { hour12: true }) : '---'}
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}