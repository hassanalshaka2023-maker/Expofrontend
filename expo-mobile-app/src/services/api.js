// services/api.js
import axios from 'axios';

// ربط التطبيق برابط سيرفر الـ NestJS المحلي
const API_BASE_URL = 'http://192.168.100.103:3000';

// إعدادات axios مع timeout
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor للتعامل مع الأخطاء
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // خطأ من السيرفر
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // لم يتم استلام رد
      console.error('No response from server');
    } else {
      // خطأ في الإعداد
      console.error('Request error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const expoApi = {
  /**
   * 1. جلب كافة الأكشاك الـ 12 مع إحداثيات الـ 3D وحالة الحجز
   * @returns {Promise<Array>} قائمة الأكشاك
   */
  getBooths: async () => {
    try {
      const response = await axiosInstance.get('/booths');
      return response.data;
    } catch (error) {
      console.error('Error fetching booths:', error);
      throw error;
    }
  },

  /**
   * 2. إرسال توكن الـ QR الخاص بالموظف لتسجيل الحضور أو الانصراف تلقائياً
   * @param {string} qrToken - التوكن الممسوح من بطاقة الموظف
   * @returns {Promise<Object>} نتيجة عملية الحضور/الانصراف
   */
  scanStaffQR: async (qrToken) => {
    try {
      const response = await axiosInstance.post('/attendance/scan', { qrToken });
      return response.data;
    } catch (error) {
      console.error('Error scanning QR:', error);
      throw error;
    }
  },

  /**
   * 3. جلب تفاصيل شركة محددة
   * @param {string} boothId - معرف الكشك
   * @returns {Promise<Object>} تفاصيل الشركة
   */
  getCompanyDetails: async (boothId) => {
    try {
      const response = await axiosInstance.get(`/booths/${boothId}/company`);
      return response.data;
    } catch (error) {
      console.error('Error fetching company details:', error);
      throw error;
    }
  },

  /**
   * 4. تسجيل زيارة للكشك
   * @param {string} boothId - معرف الكشك
   * @param {string} userId - معرف المستخدم (اختياري)
   * @returns {Promise<Object>} نتيجة تسجيل الزيارة
   */
  logBoothVisit: async (boothId, userId = null) => {
    try {
      const response = await axiosInstance.post(`/booths/${boothId}/visit`, { userId });
      return response.data;
    } catch (error) {
      console.error('Error logging booth visit:', error);
      throw error;
    }
  },

  /**
   * 5. جلب إحصائيات الأكشاك
   * @returns {Promise<Object>} إحصائيات الأكشاك
   */
  getBoothStats: async () => {
    try {
      const response = await axiosInstance.get('/booths/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching booth stats:', error);
      throw error;
    }
  },

  /**
   * 6. تقييم كشك
   * @param {string} boothId - معرف الكشك
   * @param {number} rating - التقييم من 1 إلى 5
   * @param {string} comment - تعليق اختياري
   * @returns {Promise<Object>} نتيجة التقييم
   */
  rateBooth: async (boothId, rating, comment = '') => {
    try {
      const response = await axiosInstance.post(`/booths/${boothId}/rate`, {
        rating,
        comment,
      });
      return response.data;
    } catch (error) {
      console.error('Error rating booth:', error);
      throw error;
    }
  },

  /**
   * 7. جلب تقييمات الكشك
   * @param {string} boothId - معرف الكشك
   * @returns {Promise<Array>} قائمة التقييمات
   */
  getBoothRatings: async (boothId) => {
    try {
      const response = await axiosInstance.get(`/booths/${boothId}/ratings`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booth ratings:', error);
      throw error;
    }
  },

  /**
   * 8. البحث عن الأكشاك
   * @param {string} query - مصطلح البحث
   * @param {string} status - فلتر الحالة (اختياري)
   * @returns {Promise<Array>} قائمة الأكشاك المطابقة
   */
  searchBooths: async (query, status = null) => {
    try {
      const params = new URLSearchParams({ q: query });
      if (status) params.append('status', status);
      const response = await axiosInstance.get(`/booths/search?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error searching booths:', error);
      throw error;
    }
  },

  /**
   * 9. جلب حالة الكشك في الوقت الفعلي
   * @param {string} boothId - معرف الكشك
   * @returns {Promise<Object>} حالة الكشك الحالية
   */
  getBoothStatus: async (boothId) => {
    try {
      const response = await axiosInstance.get(`/booths/${boothId}/status`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booth status:', error);
      throw error;
    }
  },

  /**
   * 10. تحديث حالة الكشك (للاستخدام الإداري)
   * @param {string} boothId - معرف الكشك
   * @param {string} status - الحالة الجديدة
   * @returns {Promise<Object>} نتيجة التحديث
   */
  updateBoothStatus: async (boothId, status) => {
    try {
      const response = await axiosInstance.patch(`/booths/${boothId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating booth status:', error);
      throw error;
    }
  },
};

// Export للاستخدام المباشر للـ axios instance إذا لزم الأمر
export { axiosInstance };