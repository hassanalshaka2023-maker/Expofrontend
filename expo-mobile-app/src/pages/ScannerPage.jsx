import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { expoApi } from "../services/api";

export default function ScannerPage() {
  const [scanResult, setScanResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scannerRef = useRef(null);

   async function onScanSuccess(decodedText) {
    if (isLoading) return; // منع إرسال طلبات مكررة أثناء المعالجة

    setIsLoading(true);
    setErrorMessage("");
    setScanResult(null);

    try {
      // إرسال التوكن الملقوط إلى سيرفر الـ NestJS
      const response = await expoApi.scanStaffQR(decodedText);

      setScanResult(response); // تخزين نتيجة الحضور (دخول أو خروج) لعرضها للمستخدم

      // إيقاف الكاميرا مؤقتاً لإظهار شاشة النجاح
      if (scannerRef.current) scannerRef.current.clear();
    } catch (error) {
      // عرض الخطأ إذا كان الـ QR مزوراً أو غير مسجل في قاعدة البيانات
      setErrorMessage(
        error.response?.data?.message || "حدث خطأ أثناء فحص الكود",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function onScanFailure(error) {
    // هذه الدالة تعمل مع كل إطار لا تجد فيه الكاميرا كود QR، نتركها فارغة لتجنب الفوضى في الـ Console
  }

  useEffect(() => {
    // 1. تهيئة ماسح الـ QR وإعداد الإعدادات والكاميرا الخلفية
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10, // عدد الإطارات في الثانية لفحص الكود
      qrbox: { width: 250, height: 250 }, // حجم مربع التحديد وسط الكاميرا
      rememberLastUsedCamera: true,
    });

    scanner.render(onScanSuccess, onScanFailure);
    scannerRef.current = scanner;

    // تنظيف الكاميرا عند إغلاق الصفحة لمنع استهلاك البطارية
    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .clear()
          .catch((err) => console.error("فشل إغلاق الكاميرا:", err));
      }
    };
  }, []);

  // 2. دالة تنفذ تلقائياً بمجرد لقط كود الـ QR من البطاقة
 
  // إعادة تشغيل الكاميرا لإجراء عملية مسح جديدة لموظف آخر
  const resetScanner = () => {
    setScanResult(null);
    setErrorMessage("");
    window.location.reload(); // إعادة تحميل الصفحة لتهيئة جهاز القراءة مجدداً بسلاسة
  };

  return (
    <div className="w-screen h-screen min-h-screen bg-gray-950 text-white flex flex-col p-6 items-center justify-center">
      <h1 className="text-2xl font-bold text-indigo-400 mb-2">
        📷 بوابة الحضور والانصراف
      </h1>
      <p className="text-gray-400 text-sm text-center mb-6">
        وجه الكاميرا نحو كود الـ QR المطبوع على بطاقة تعريف الموظف
      </p>

      {/* === واجهة الكاميرا الحية === */}
      {!scanResult && !errorMessage && (
        <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden p-4 shadow-xl">
          <div id="reader" className="w-full rounded-xl overflow-hidden"></div>
          {isLoading && (
            <p className="text-center text-amber-400 font-medium mt-4 animate-pulse">
              جاري التحقق من السيرفر...
            </p>
          )}
        </div>
      )}

      {/* === شاشة النجاح (تظهر دخول أو خروج الموظف) === */}
      {scanResult && (
        <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center shadow-2xl animate-fade-in">
          <div
            className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl mb-4 ${scanResult.action === "check-in" ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}
          >
            {scanResult.action === "check-in" ? "✓" : "🚪"}
          </div>
          <h2 className="text-xl font-bold text-white mb-1">
            {scanResult.staffName}
          </h2>
          <p
            className={`text-md font-semibold ${scanResult.action === "check-in" ? "text-emerald-400" : "text-rose-400"}`}
          >
            {scanResult.message}
          </p>
          <p className="text-xs text-gray-500 mt-3">
            الوقت: {new Date(scanResult.time).toLocaleTimeString("ar-SY")}
          </p>
          <button
            onClick={resetScanner}
            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-colors"
          >
            مسح بطاقة موظف آخر
          </button>
        </div>
      )}

      {/* === شاشة الخطأ (إذا كان الكود غير صحيح) === */}
      {errorMessage && (
        <div className="w-full max-w-md bg-gray-900 border border-red-900/50 rounded-2xl p-6 text-center shadow-2xl">
          <div className="w-16 h-16 bg-rose-500/20 text-rose-400 mx-auto rounded-full flex items-center justify-center text-3xl mb-4">
            ✕
          </div>
          <h2 className="text-lg font-bold text-white mb-2">
            فشل التحقق من الهوية
          </h2>
          <p className="text-rose-400 text-sm">{errorMessage}</p>
          <button
            onClick={resetScanner}
            className="w-full mt-6 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      )}
    </div>
  );
}
