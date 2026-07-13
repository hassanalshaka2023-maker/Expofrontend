import  { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { webApi } from '../services/api';
import WebBooth3D from '../components/WebBooth3D';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Sparkles, Shield, X, MapPin, CheckCircle, Clock } from 'lucide-react';

export default function InvestorDashboard({ user }) {
  const [booths, setBooths] = useState([]);
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchBooths = async () => {
      try {
        const data = await webApi.getBooths();
        setBooths(data);
        setLoading(false);
      } catch (err) {
        console.error('فشل في جلب الأكشاك', err);
        setLoading(false);
      }
    };
    fetchBooths();
  }, []);

  const handleReserve = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const investorData = {
        investorId: user.id,
        companyName: user.companyName,
        category: category,
        description: description,
        companyLogo: ''
      };
      await webApi.reserveBooth(selectedBooth.boothId, investorData);
      setMessage(`🎉 ممتاز! تم حجز الكشك ${selectedBooth.boothId} بنجاح لشركتكم.`);
      setSelectedBooth(null);
      setCategory('');
      setDescription('');
      const updatedBooths = await webApi.getBooths();
      setBooths(updatedBooths);
    } catch (err) {
      setMessage(err.response?.data?.message || 'فشل الحجز، حاول مجدداً');
    }
  };

  const closePanel = () => setSelectedBooth(null);

  if (loading) return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-10 h-10 rounded-full border-2 border-amber-500 border-t-transparent"
      />
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-[#030712] flex flex-col lg:flex-row text-right" dir="rtl">
      
      {/* القسم الأيمن: فضاء العرض ثلاثي الأبعاد */}
      <div className="flex-1 h-[40vh] md:h-[45vh] lg:h-screen relative bg-[#020617] border-b lg:border-b-0 lg:border-l border-white/5">
        {/* Overlay فاخر */}
        <div className="absolute top-4 right-4 z-10">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-[#0c0e2b]/90 to-[#0f1235]/90 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-white/10 shadow-xl pointer-events-none"
          >
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="bg-amber-500/10 text-amber-400 text-[8px] px-1.5 py-0.5 rounded font-bold border border-amber-500/20">بوابة المستثمرين</span>
            </div>
            <h2 className="text-base sm:text-xl font-black text-white">🌐 صالة الاستثمار</h2>
            <p className="text-gray-400 text-[10px] sm:text-xs mt-1">حرك الفأرة لتدوير الصالة، وانقر على الكشك لرؤية التفاصيل</p>
            <div className="mt-2 w-12 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" />
          </motion.div>
        </div>

        <Canvas camera={{ position: [0, 15, 25], fov: 50 }} shadows>
          <color attach="background" args={['#020617']} />
          <ambientLight intensity={0.6} color="#4f46e5" />
          <pointLight position={[10, 20, 10]} intensity={1.8} color="#818cf8" castShadow />
          <pointLight position={[-10, 15, -10]} intensity={0.6} color="#00ffcc" />
          <pointLight position={[0, 5, 15]} intensity={0.3} color="#c77938" />
          <directionalLight position={[-20, 30, 20]} intensity={1.2} color="#00ffff" />
          <Grid position={[0, -0.01, 0]} args={[60, 60]} cellSize={1} cellThickness={0.6} cellColor="#1e293b" sectionSize={5} sectionThickness={1.2} sectionColor="#4f46e5" fadeDistance={50} infiniteGrid />
          {booths.map((booth) => (
            <WebBooth3D key={booth.boothId} id={booth.boothId} position={booth.position3D} status={booth.status} companyDetails={booth.companyDetails} onSelect={(boothInfo) => setSelectedBooth(boothInfo)} allowAllClicks />
          ))}
          <OrbitControls maxPolarAngle={Math.PI / 2.2} minDistance={8} maxDistance={45} target={[0, 2, 0]} enableDamping dampingFactor={0.1} />
        </Canvas>
      </div>

      {/* القسم الأيسر: لوحة التحكم والاستمارة */}
      <div className="w-full lg:w-[450px] bg-gradient-to-b from-[#0c0e2b]/95 to-[#0f1235]/95 backdrop-blur-lg p-4 sm:p-6 flex flex-col justify-start border-t lg:border-t-0 lg:border-r border-white/5 overflow-y-auto h-auto lg:h-screen">
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl mb-6 text-center text-xs font-bold"
          >
            {message}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {!selectedBooth ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full text-center py-8 sm:py-12"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-16 h-16 sm:w-20 sm:h-20 mb-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 flex items-center justify-center"
              >
                <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400/60" />
              </motion.div>
              <h3 className="text-white font-bold text-sm sm:text-lg mb-2">اختر كشكاً من صالة الاستثمار</h3>
              <p className="text-gray-500 text-[10px] sm:text-xs max-w-xs leading-relaxed">
                اضغط على أي كشك في الصالة ثلاثية الأبعاد لرؤية تفاصيله. الأكشاك الخضراء متاحة للحجز.
              </p>
            </motion.div>
          ) : selectedBooth.status === 'Available' ? (
            <motion.div
              key="reserve"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-5"
            >
              {/* رأس استمارة الحجز */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-4">
                <div className="absolute top-0 left-0 w-16 h-16 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm sm:text-md font-bold text-white">💼 حجز كشك ({selectedBooth.boothId})</h3>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closePanel}
                    className="w-8 h-8 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              <form onSubmit={handleReserve} className="space-y-4">
                <div>
                  <label className="block text-[10px] sm:text-[11px] text-gray-400 mb-1.5 font-semibold">الشركة المتقدمة للحجز:</label>
                  <div className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 min-h-[48px] text-xs text-gray-500 flex items-center">
                    <Building2 className="w-3.5 h-3.5 text-amber-400 ml-2" />
                    {user.companyName}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] sm:text-[11px] text-gray-400 mb-1.5 font-semibold">تخصص قطاع عمل شركتكم بالمعرض:</label>
                  <input type="text" value={category} onChange={e => setCategory(e.target.value)} required placeholder="مثال: حلول برمجية وذكاء اصطناعي"
                    className="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-3 min-h-[48px] text-xs text-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all" />
                </div>

                <div>
                  <label className="block text-[10px] sm:text-[11px] text-gray-400 mb-1.5 font-semibold">نبذة تسويقية عن الكشك:</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={4}
                    placeholder="اكتب وصفاً جذاباً ليقرأه الزائر عند النقر على كشككم..."
                    className="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-3 text-xs text-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none resize-none leading-relaxed transition-all"></textarea>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-3.5 min-h-[52px] rounded-xl text-xs transition-all shadow-lg shadow-amber-600/20 mt-4 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  تثبيت وتأمين حجز الكشك 🚀
                </motion.button>
              </form>
            </motion.div>
          ) : (
            /* عرض تفاصيل الشركة للكشك المحجوز/قيد الانتظار */
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-5"
            >
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 p-4">
                <div className="absolute top-0 left-0 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-sm sm:text-md font-bold text-white">📍 الكشك {selectedBooth.boothId}</h3>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closePanel}
                    className="w-8 h-8 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* حالة الكشك */}
              <div className="flex items-center gap-2">
                {selectedBooth.status === 'Reserved' ? (
                  <span className="inline-flex items-center gap-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] px-2.5 py-1 rounded-lg font-bold">
                    <CheckCircle className="w-3 h-3" /> محجوز
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] px-2.5 py-1 rounded-lg font-bold">
                    <Clock className="w-3 h-3" /> قيد الانتظار
                  </span>
                )}
              </div>

              {/* تفاصيل الشركة */}
              {selectedBooth.companyDetails && (
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c0e2b] to-[#0f1235] border border-white/10 p-5 space-y-4">
                  <div className="absolute top-0 left-0 w-20 h-20 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 flex items-center justify-center text-xl flex-shrink-0">
                      🏢
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">الشركة المستثمرة</p>
                      <p className="text-white font-bold text-base truncate">
                        {selectedBooth.companyDetails.companyName || '—'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-white/[0.03] rounded-xl p-3 border border-white/5">
                      <p className="text-[9px] text-gray-500 font-medium uppercase tracking-wider mb-1">التخصص</p>
                      <p className="text-gray-200 text-xs font-semibold flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        {selectedBooth.companyDetails.category || 'غير محدد'}
                      </p>
                    </div>
                  </div>

                  {selectedBooth.companyDetails.description && (
                    <div className="bg-white/[0.02] rounded-xl p-3 border border-white/5">
                      <p className="text-[9px] text-gray-500 font-medium uppercase tracking-wider mb-1.5">الوصف التجاري</p>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        {selectedBooth.companyDetails.description}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {selectedBooth.status === 'Reserved' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-4 text-center"
                >
                  <p className="text-rose-400 text-xs font-bold">هذا الكشك محجوز حالياً ولا يمكن حجزه</p>
                </motion.div>
              )}
              {selectedBooth.status === 'Pending' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4 text-center"
                >
                  <p className="text-amber-400 text-xs font-bold">هذا الكشك بانتظار موافقة الإدارة</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}