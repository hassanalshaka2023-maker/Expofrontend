import axios from 'axios';

// API base URL comes from ONE environment variable (VITE_API_URL). Set it in
// `.env.local` for LAN testing, e.g. http://<LAPTOP_IPV4>:3000. Falls back to
// localhost for desktop dev. Trailing slashes are stripped so request URLs
// never end up malformed (e.g. `//booths`).
const API_BASE_URL = (
  import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
).replace(/\/+$/, '');

export const webApi = {
  login: async (email, password) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    return response.data;
  },
  registerInvestor: async (name, email, password, companyName) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register-investor`, { name, email, password, companyName });
    return response.data;
  },
  // جلب كافة سجلات الحضور والانصراف المرتبة من الأحدث إلى الأقدم
getAttendanceLogs: async () => {
  const response = await axios.get(`${API_BASE_URL}/attendance/logs`);
  return response.data;
},


  // === حقول الأكشاك الجديدة ===
  // 1. جلب حالة الأكشاك الـ 12
  getBooths: async () => {
    const response = await axios.get(`${API_BASE_URL}/booths`);
    return response.data;
  },
  // 2. إرسال طلب حجز كشك محدد
  reserveBooth: async (boothId, investorData) => {
    const response = await axios.post(`${API_BASE_URL}/booths/reserve/${boothId}`, investorData);
    return response.data;
  },
  approveBooth: async (boothId) => {
  const response = await axios.post(`${API_BASE_URL}/booths/approve/${boothId}`);
  return response.data;
},
rejectBooth: async (boothId) => {
  const response = await axios.post(`${API_BASE_URL}/booths/reject/${boothId}`);
  return response.data;
}

};
