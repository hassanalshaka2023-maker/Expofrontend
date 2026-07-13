import { useEffect, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { webApi } from '../services/api';
import WebBooth3D from '../components/WebBooth3D';
import Button from '../components/ui/Button';
import { PanelSkeleton, BoothSkeleton } from '../components/ui/Skeleton';
import { CheckCircle, XCircle, Building2, MapPin, HelpCircle, ChevronDown, Sparkles, Activity } from 'lucide-react';

/* ─── BoothesStatusBadge: شارة الحالة الجذابة ─── */
function BoothStatusBadge({ status, size = 'sm' }) {
  const config = {
    Available: { icon: '🟢', text: 'متاح', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    Pending: { icon: '🟡', text: 'قيد الانتظار', className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    Reserved: { icon: '🔴', text: 'محجوز', className: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  };
  const c = config[status] || config.Available;
  return (
    <span className={`inline-flex items-center gap-1.5 font-bold rounded-lg border ${c.className} ${size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-3 py-1'}`}>
      {c.icon} {c.text}
    </span>
  );
}

/* ─── BoothDetailCard: بطاقة تفاصيل الكشك المتحركة ─── */
function BoothDetailCard({ booth, onApprove, onReject, onClose }) {
  const details = booth.companyDetails || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <motion.h3
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white font-black text-lg flex items-center gap-2"
          >
            <Building2 className="w-5 h-5 text-indigo-400" />
            الكشك {booth.boothId}
          </motion.h3>
          <BoothStatusBadge status={booth.status} size="md" />
        </div>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onClose()}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-500 hover:bg-white/10 hover:text-white transition-colors"
        >
          ✕
        </motion.button>
      </div>

      {/* Company Info Card - بتصميم فاخر */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c0e2b] to-[#0f1235] border border-white/10 p-5 space-y-4"
      >
        <div className="absolute top-0 left-0 w-20 h-20 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        
        {/* Company Name */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 flex items-center justify-center text-xl flex-shrink-0">
            🏢
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">الشركة المستثمرة</p>
            <p className="text-white font-bold text-base truncate">
              {details.companyName || '—'}
            </p>
          </div>
        </div>

        {/* Detail Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white/[0.03] rounded-xl p-3 border border-white/5">
            <p className="text-[9px] text-gray-500 font-medium uppercase tracking-wider mb-1">التخصص</p>
            <p className="text-gray-200 text-xs font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" />
              {details.category || 'غير محدد'}
            </p>
          </div>
          <div className="bg-white/[0.03] rounded-xl p-3 border border-white/5">
            <p className="text-[9px] text-gray-500 font-medium uppercase tracking-wider mb-1">الموقع</p>
            <p className="text-gray-200 text-xs font-semibold flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-blue-400" />
              صالة العرض
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white/[0.02] rounded-xl p-3 border border-white/5">
          <p className="text-[9px] text-gray-500 font-medium uppercase tracking-wider mb-1.5">الوصف التجاري</p>
          <p className="text-gray-300 text-xs leading-relaxed">
            {details.description || 'لا يوجد وصف'}
          </p>
        </div>
      </motion.div>

      {/* Action Buttons */}
      {booth.status === 'Pending' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-2 gap-3"
        >
          <Button
            variant="success"
            onClick={() => onApprove(booth.boothId)}
            size="md"
            className="!rounded-xl"
          >
            <CheckCircle className="w-4 h-4" />
            قبول الحجز
          </Button>
          <Button
            variant="danger"
            onClick={() => onReject(booth.boothId)}
            size="md"
            className="!rounded-xl"
          >
            <XCircle className="w-4 h-4" />
            رفض الطلب
          </Button>
        </motion.div>
      )}

      {booth.status === 'Available' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 text-center"
        >
          <p className="text-emerald-400 text-xs font-bold">هذا الكشك شاغر وينتظر المستثمرين</p>
        </motion.div>
      )}
      {booth.status === 'Reserved' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-4 text-center"
        >
          <p className="text-rose-400 text-xs font-bold">هذا الكشك محجوز بالفعل ولا يمكن التعديل</p>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ─── StatCard: بطاقة إحصائية فاخرة ─── */
function StatCard({ label, value, icon, color }) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      className={`relative overflow-hidden bg-gradient-to-br ${color} rounded-xl p-3 border border-white/10 min-h-[70px]`}
    >
      <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full blur-xl pointer-events-none" />
      <div className="relative z-10">
        <p className="text-[10px] text-gray-400 font-medium mb-1">{label}</p>
        <p className="text-white font-black text-base sm:text-lg flex items-center gap-2">
          {icon}
          {value}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── MiniLegend ─── */
function MiniLegend() {
  const items = [
    { color: 'bg-emerald-500', label: 'متاح' },
    { color: 'bg-amber-500', label: 'قيد الانتظار' },
    { color: 'bg-rose-500', label: 'محجوز' },
  ];
  return (
    <div className="flex items-center gap-4 bg-white/[0.03] rounded-xl px-4 py-2 border border-white/5">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span className={`w-2.5 h-2.5 rounded-full ${item.color} shadow-lg`} />
          <span className="text-[10px] text-gray-400">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════ */
export default function AdminBoothsManager() {
  const [booths, setBooths] = useState([]);
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);
  const [showStats, setShowStats] = useState(true);

  useEffect(() => {
    let mounted = true;
    webApi.getBooths()
      .then((data) => {
        if (mounted) { setBooths(data); setLoading(false); }
      })
      .catch(() => {
        if (mounted) { setError('فشل في تحميل الأكشاك'); setLoading(false); }
      });
    return () => { mounted = false; };
  }, []);

  const reloadData = useCallback(async () => {
    const data = await webApi.getBooths();
    setBooths(data);
  }, []);

  const handleAction = async (action, boothId) => {
    setActionLoading(boothId);
    try {
      if (action === 'approve') await webApi.approveBooth(boothId);
      else await webApi.rejectBooth(boothId);
      setSelectedBooth(null);
      await reloadData();
    } catch (err) {
      setError(err.response?.data?.message || 'فشلت العملية');
    } finally { setActionLoading(null); }
  };

  const stats = {
    total: booths.length,
    available: booths.filter(b => b.status === 'Available').length,
    pending: booths.filter(b => b.status === 'Pending').length,
    reserved: booths.filter(b => b.status === 'Reserved').length,
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#030712] flex flex-col lg:flex-row">
        <div className="flex-1 h-[50vh] lg:h-screen bg-[#020617]"><BoothSkeleton /></div>
        <div className="w-full lg:w-[420px] bg-[#030712] border-t lg:border-t-0 lg:border-r border-white/5"><PanelSkeleton /></div>
      </div>
    );
  }

  if (error && booths.length === 0) {
    return (
      <div className="w-full min-h-screen bg-[#030712] flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
            <HelpCircle className="w-10 h-10 text-rose-400" />
          </div>
          <h2 className="text-white font-black text-xl mb-2">حدث خطأ</h2>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          <Button onClick={() => window.location.reload()} variant="primary">إعادة المحاولة</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#030712] flex flex-col lg:flex-row" dir="rtl">
      {/* ═══ مشهد Three.js ═══ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 h-[40vh] md:h-[45vh] lg:h-screen relative bg-[#020617] overflow-hidden"
      >
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-[#0c0e2b]/90 to-[#0f1235]/90 backdrop-blur-md rounded-xl px-4 py-2.5 border border-white/10 shadow-2xl"
          >
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <MapPin className="w-4 h-4 text-indigo-400" />
              صالة الأكشاك التفاعلية
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">اسحب لتدوير · انقر على كشك لإدارته</p>
          </motion.div>
          <MiniLegend />
        </div>

        <AnimatePresence>
          {actionLoading && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 bg-gray-950/60 backdrop-blur-sm flex items-center justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 rounded-full border-2 border-indigo-500 border-t-transparent"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <Canvas camera={{ position: [0, 5, 10], fov: 45 }}>
          <color attach="background" args={['#020617']} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 20, 10]} intensity={1.5} color="#6366f1" />
          <directionalLight position={[-20, 30, 20]} intensity={1} color="#ffffff" />
          <Grid position={[0, -0.01, 0]} args={[50, 50]} cellSize={1} cellThickness={0.6} cellColor="#1e293b" sectionSize={5} sectionThickness={1.2} sectionColor="#4f46e5" fadeDistance={40} />
          {booths.map((booth) => (
            <WebBooth3D key={booth.boothId} id={booth.boothId} position={booth.position3D} status={booth.status} companyDetails={booth.companyDetails} onSelect={() => setSelectedBooth(booth)} allowAllClicks={true} />
          ))}
          <OrbitControls maxPolarAngle={Math.PI / 2.1} minDistance={5} maxDistance={30} enablePan={true} />
        </Canvas>
      </motion.div>

      {/* ═══ لوحة التحكم ═══ */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full lg:w-[420px] bg-gradient-to-b from-[#0c0e2b]/95 to-[#0f1235]/95 backdrop-blur-xl border-t lg:border-t-0 lg:border-r border-white/5 flex flex-col h-full lg:h-screen overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-black text-sm sm:text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              لوحة التحكم
            </h2>
            <button
              onClick={() => setShowStats(!showStats)}
              className="text-gray-500 hover:text-white transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${showStats ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <AnimatePresence>
            {showStats && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-2 overflow-hidden"
              >
                <StatCard label="إجمالي الأكشاك" value={stats.total} icon={<Building2 className="w-4 h-4 text-indigo-400" />} color="from-indigo-500/10 to-indigo-500/5" />
                <StatCard label="متاح" value={stats.available} icon={<span className="text-emerald-400">🟢</span>} color="from-emerald-500/10 to-emerald-500/5" />
                <StatCard label="بانتظار الموافقة" value={stats.pending} icon={<span className="text-amber-400">🟡</span>} color="from-amber-500/10 to-amber-500/5" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 custom-scrollbar">
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 mb-4 text-center">
              <p className="text-rose-400 text-xs">{error}</p>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {selectedBooth ? (
              <BoothDetailCard key={selectedBooth.boothId} booth={selectedBooth}
                onApprove={(id) => handleAction('approve', id)} onReject={(id) => handleAction('reject', id)}
                onClose={() => setSelectedBooth(null)} />
            ) : (
              <motion.div key="empty" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center h-full text-center py-12 sm:py-16">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-16 h-16 sm:w-20 sm:h-20 mb-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-400/60" />
                </motion.div>
                <h3 className="text-white font-bold text-base mb-2">اختر كشكاً للإدارة</h3>
                <p className="text-gray-500 text-xs max-w-xs leading-relaxed">
                  اضغط على أي كشك في الخريطة ثلاثية الأبعاد لمراجعة بيانات المستثمر، وقبول أو رفض طلب الحجز.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-3 sm:p-4 border-t border-white/5">
          <p className="text-[9px] text-gray-600 text-center">{booths.length} كشك | {stats.pending} بانتظار الموافقة</p>
        </div>
      </motion.div>
    </div>
  );
}