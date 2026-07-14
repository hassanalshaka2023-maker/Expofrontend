// services/api.js
import axios from "axios";

// ────────────────────────────────────────────────────────────────────────────
// API base URL resolution — order of precedence:
//
//   1. VITE_API_URL (explicit override) — use for production or a custom API
//      host. Vite only exposes variables prefixed with VITE_ on import.meta.env.
//   2. Otherwise, in the browser, derive it from the SAME host the page was
//      opened from, on the API port (3000). This makes phone / LAN testing
//      "just work" regardless of the laptop's current IP — when the Wi-Fi or
//      DHCP hands out a new address, nothing needs editing. (Opening the page
//      from localhost → API on localhost; from 192.168.x.y → API on the same
//      192.168.x.y.)
//   3. Non-browser fallback (SSR / tests): http://localhost:3000.
//
// No IP is EVER hardcoded here — a stale/invalid hardcoded IP is exactly what
// broke the map before (first unreachable, then a slow timeout after the LAN
// address changed).
// ────────────────────────────────────────────────────────────────────────────
const API_PORT = 3000;

function resolveApiBaseUrl() {
  const fromEnv = import.meta.env.VITE_API_URL;
  if (fromEnv) return fromEnv.replace(/\/+$/, ""); // strip trailing slash(es)
  if (typeof window !== "undefined" && window.location?.hostname) {
    // Same host as the page, on the API port. Dev is http, so no mixed-content
    // issue; production should set VITE_API_URL explicitly (see precedence #1).
    return `${window.location.protocol}//${window.location.hostname}:${API_PORT}`;
  }
  return `http://localhost:${API_PORT}`;
}

const API_BASE_URL = resolveApiBaseUrl();
const isDev = import.meta.env.DEV;

if (isDev) {
  // The base URL is auto-derived, so this is informational — it makes the
  // effective target visible in the console when diagnosing a failed load.
  console.info(`[api] base URL: ${API_BASE_URL}`);
}

// إعدادات axios مع timeout
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ────────────────────────────────────────────────────────────────────────────
// Error classification: turn an opaque Axios error into an actionable category
// plus a visitor-friendly (Arabic) message the UI can render directly.
// ────────────────────────────────────────────────────────────────────────────
export const API_ERROR = {
  TIMEOUT: "timeout",
  UNREACHABLE: "unreachable",
  UNAUTHORIZED: "unauthorized",
  NOT_FOUND: "not_found",
  SERVER: "server",
  UNKNOWN: "unknown",
};

const USER_MESSAGES = {
  [API_ERROR.TIMEOUT]:
    "انتهت مهلة الاتصال بخادم المعرض. تحقّق من الشبكة وحاول مجددًا.",
  [API_ERROR.UNREACHABLE]: "تعذّر الاتصال بخادم المعرض.",
  [API_ERROR.UNAUTHORIZED]: "هذه البيانات تتطلّب صلاحية دخول.",
  [API_ERROR.NOT_FOUND]: "لم يتم العثور على بيانات المعرض المطلوبة.",
  [API_ERROR.SERVER]: "حدث خطأ في خادم المعرض. الرجاء المحاولة لاحقًا.",
  [API_ERROR.UNKNOWN]: "تعذّر تحميل الخريطة.",
};

function classify(error) {
  // Timeout is reported as ECONNABORTED with no response — check it first,
  // otherwise it would be mistaken for a generic "no response".
  if (error?.code === "ECONNABORTED" || /timeout/i.test(error?.message || "")) {
    return API_ERROR.TIMEOUT;
  }
  if (error?.response) {
    const status = error.response.status;
    if (status === 401 || status === 403) return API_ERROR.UNAUTHORIZED;
    if (status === 404) return API_ERROR.NOT_FOUND;
    if (status >= 500) return API_ERROR.SERVER;
    return API_ERROR.UNKNOWN;
  }
  if (error?.request) {
    // Request left the browser but nothing came back: server down, wrong IP,
    // firewall dropping the connection, or a blocked CORS preflight. In the
    // browser these are indistinguishable, so we treat them as "unreachable".
    return API_ERROR.UNREACHABLE;
  }
  return API_ERROR.UNKNOWN;
}

// Throttle identical failures so a backend that is offline (or repeated Retry
// taps) cannot flood the console with the same line over and over.
const lastLoggedAt = new Map();
function logOnce(kind, url) {
  if (!isDev) return; // never spam technical logs at visitors in production
  const key = `${kind}:${url}`;
  const now = Date.now();
  if (now - (lastLoggedAt.get(key) || 0) < 5000) return;
  lastLoggedAt.set(key, now);
  console.warn(`[api] ${kind} while requesting ${url}`);
}

// Interceptor: classify once, attach a friendly message, log at most once.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const kind = classify(error);
    error.kind = kind;
    error.userMessage = USER_MESSAGES[kind] || USER_MESSAGES[API_ERROR.UNKNOWN];
    logOnce(kind, error?.config?.url || "unknown");
    return Promise.reject(error);
  },
);

export const expoApi = {
  /**
   * 1. جلب كافة الأكشاك الـ 12 مع إحداثيات الـ 3D وحالة الحجز
   * @returns {Promise<Array>} قائمة الأكشاك
   */
  getBooths: async () => {
    const response = await axiosInstance.get("/booths");
    return response.data;
  },

  /**
   * 2. إرسال توكن الـ QR الخاص بالموظف لتسجيل الحضور أو الانصراف تلقائياً
   * @param {string} qrToken - التوكن الممسوح من بطاقة الموظف
   * @returns {Promise<Object>} نتيجة عملية الحضور/الانصراف
   */
  scanStaffQR: async (qrToken) => {
    const response = await axiosInstance.post("/attendance/scan", { qrToken });
    return response.data;
  },

  /**
   * 3. جلب تفاصيل شركة محددة
   * @param {string} boothId - معرف الكشك
   * @returns {Promise<Object>} تفاصيل الشركة
   */
  getCompanyDetails: async (boothId) => {
    const response = await axiosInstance.get(`/booths/${boothId}/company`);
    return response.data;
  },

  /**
   * 4. تسجيل زيارة للكشك
   * @param {string} boothId - معرف الكشك
   * @param {string} userId - معرف المستخدم (اختياري)
   * @returns {Promise<Object>} نتيجة تسجيل الزيارة
   */
  logBoothVisit: async (boothId, userId = null) => {
    const response = await axiosInstance.post(`/booths/${boothId}/visit`, {
      userId,
    });
    return response.data;
  },

  /**
   * 5. جلب إحصائيات الأكشاك
   * @returns {Promise<Object>} إحصائيات الأكشاك
   */
  getBoothStats: async () => {
    const response = await axiosInstance.get("/booths/stats");
    return response.data;
  },

  /**
   * 6. تقييم كشك
   * @param {string} boothId - معرف الكشك
   * @param {number} rating - التقييم من 1 إلى 5
   * @param {string} comment - تعليق اختياري
   * @returns {Promise<Object>} نتيجة التقييم
   */
  rateBooth: async (boothId, rating, comment = "") => {
    const response = await axiosInstance.post(`/booths/${boothId}/rate`, {
      rating,
      comment,
    });
    return response.data;
  },

  /**
   * 7. جلب تقييمات الكشك
   * @param {string} boothId - معرف الكشك
   * @returns {Promise<Array>} قائمة التقييمات
   */
  getBoothRatings: async (boothId) => {
    const response = await axiosInstance.get(`/booths/${boothId}/ratings`);
    return response.data;
  },

  /**
   * 8. البحث عن الأكشاك
   * @param {string} query - مصطلح البحث
   * @param {string} status - فلتر الحالة (اختياري)
   * @returns {Promise<Array>} قائمة الأكشاك المطابقة
   */
  searchBooths: async (query, status = null) => {
    const params = new URLSearchParams({ q: query });
    if (status) params.append("status", status);
    const response = await axiosInstance.get(`/booths/search?${params}`);
    return response.data;
  },

  /**
   * 9. جلب حالة الكشك في الوقت الفعلي
   * @param {string} boothId - معرف الكشك
   * @returns {Promise<Object>} حالة الكشك الحالية
   */
  getBoothStatus: async (boothId) => {
    const response = await axiosInstance.get(`/booths/${boothId}/status`);
    return response.data;
  },

  /**
   * 10. تحديث حالة الكشك (للاستخدام الإداري)
   * @param {string} boothId - معرف الكشك
   * @param {string} status - الحالة الجديدة
   * @returns {Promise<Object>} نتيجة التحديث
   */
  updateBoothStatus: async (boothId, status) => {
    const response = await axiosInstance.patch(`/booths/${boothId}/status`, {
      status,
    });
    return response.data;
  },
};

// Export للاستخدام المباشر للـ axios instance إذا لزم الأمر
export { axiosInstance, API_BASE_URL };
