import { useState, useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Link2, Copy, Check, Sparkles, Smartphone, Wifi, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GlobalQRGenerator() {
  const [appUrl, setAppUrl] = useState('http://localhost:5173');
  const [copied, setCopied] = useState(false);
  const qrRef = useRef();

  // كشف الآيبي المحلي تلقائياً عند فتح الصفحة
  useEffect(() => {
    fetch('http://localhost:3000/api/network/ip')
      .then(res => res.json())
      .then(data => {
        if (data?.ip) {
          setAppUrl(`http://${data.ip}:5173`);
        }
      })
      .catch(() => {
        // إذا ما اشتغل السيرفر، نحاول نجيب الآيبي من المتصفح
        try {
          const pc = new RTCPeerConnection({ iceServers: [] });
          pc.createDataChannel('');
          pc.createOffer().then(offer => pc.setLocalDescription(offer));
          pc.onicecandidate = (ice) => {
            if (ice && ice.candidate && ice.candidate.candidate) {
              const ipMatch = ice.candidate.candidate.match(/(\d+\.\d+\.\d+\.\d+)/);
              if (ipMatch && ipMatch[1] !== '192.168.0.1') {
                setAppUrl(`http://${ipMatch[1]}:5173`);
                pc.close();
              }
            }
          };
          setTimeout(() => pc.close(), 3000);
        } catch (e) {
          console.log('Could not auto-detect IP');
        }
      });
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const svg = qrRef.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 1000;
      canvas.height = 1000;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 50, 50, 900, 900);
      
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'EXPO-2025-Visitors-QR.png';
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* رأس الصفحة الفاخر */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c0e2b] via-[#0f1235] to-[#1a1040] border border-white/5 p-5 sm:p-6 text-center"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 left-1/3 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-bold px-3 py-1 rounded-full border border-indigo-500/20">خاص بالأدمن</span>
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white mt-3">🖨️ توليد الـ QR الموحد للزوار</h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-2">الكود العام الذي سيقوم الزوار بمسحه لفتح الخريطة التفاعلية ثلاثية الأبعاد</p>
          </div>
        </motion.div>

        {/* المحتوى الرئيسي */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-gradient-to-br from-[#0c0e2b] to-[#0f1235] border border-white/5 p-4 sm:p-6 lg:p-8 shadow-2xl"
        >
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center">
            {/* القسم الأيسر: إدخال الرابط والتحكم */}
            <div className="w-full lg:w-1/2 space-y-4 sm:space-y-5">
              <div>
                <label className="block text-gray-400 text-xs sm:text-sm font-semibold mb-2 flex items-center gap-2">
                  <Link2 size={16} className="text-indigo-400 flex-shrink-0" /> رابط تطبيق الموبايل:
                </label>
                <input
                  type="url"
                  value={appUrl}
                  onChange={(e) => setAppUrl(e.target.value)}
                  placeholder="http://192.168.1.x:5173"
                  className="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-3 min-h-[48px] text-sm text-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button 
                  onClick={handleCopy}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 font-bold py-3 min-h-[48px] px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                >
                  {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                  {copied ? 'تم النسخ!' : 'نسخ الرابط'}
                </motion.button>
                
                <motion.button 
                  onClick={handleDownload}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-3 min-h-[48px] px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
                >
                  <Download size={18} /> تحميل الـ QR
                </motion.button>
              </div>

              {/* شرح طريقة الاستخدام */}
              <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-indigo-300 font-bold">
                  <Info className="w-3.5 h-3.5" />
                  طريقة الاستخدام للزوار:
                </div>
                <ol className="text-[10px] text-gray-400 space-y-1.5 pr-4 list-decimal">
                  <li>تأكد أن جهازك والتاب/الجوال متصلين بنفس شبكة الـ WiFi</li>
                  <li>شغّل تطبيق الموبايل بهذا الأمر: <code className="bg-indigo-500/10 text-indigo-300 px-1 py-0.5 rounded">cd expo-mobile-app && npm run dev</code></li>
                  <li>سيظهر رابط في التيرمينال مثلاً <code className="bg-indigo-500/10 text-indigo-300 px-1 py-0.5 rounded">http://192.168.1.5:5173</code></li>
                  <li>ضع هذا الرابط في الحقل أعلاه، ثم اطبع الـ QR أو اعرضه على شاشة</li>
                  <li>الزوار يمسحون الـ QR بكاميرا جوالهم ← تفتح معهم الخريطة مباشرة</li>
                </ol>
              </div>
            </div>

            {/* القسم الأيمن: معاينة الـ QR */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-[#030712] p-4 sm:p-6 rounded-2xl border border-white/5 shadow-inner">
              <div ref={qrRef} className="p-4 bg-white rounded-xl shadow-xl">
                <QRCodeSVG
                  value={appUrl}
                  size={200}
                  level="H"
                  includeMargin={false}
                />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] sm:text-xs text-indigo-400 font-medium">✨ جاهز للمعاينة الحية والطباعة</p>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-gray-500">
                <Smartphone className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <span>يشتغل على نفس شبكة الـ WiFi</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}