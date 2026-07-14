import axios from "axios";

// ── Centralized API configuration ────────────────────────────────────────────
// The base URL comes from ONE environment variable (VITE_API_URL). Set it in
// `.env.local` for LAN/phone testing, e.g. http://<LAPTOP_IPV4>:3000 (NOT
// localhost — on a phone, localhost is the phone itself). Falls back to
// localhost for desktop dev. Trailing slashes are stripped so request URLs are
// never malformed (e.g. `//booths`).
export const API_URL = (
  import.meta.env.VITE_API_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");

// Single axios instance: shared base URL + a request timeout so an unreachable
// backend fails fast with a clear error instead of hanging until the browser
// gives up (this was the old "timeout of 10000ms exceeded" symptom on LAN).
const http = axios.create({ baseURL: API_URL, timeout: 12000 });

export const webApi = {
  login: async (email, password) => {
    const response = await http.post("/auth/login", { email, password });
    return response.data;
  },
  registerInvestor: async (name, email, password, companyName) => {
    const response = await http.post("/auth/register-investor", {
      name,
      email,
      password,
      companyName,
    });
    return response.data;
  },
  // Attendance logs (admin), newest first.
  getAttendanceLogs: async () => {
    const response = await http.get("/attendance/logs");
    return response.data;
  },

  // === Booths ===
  // Public read of the whole exhibition map (used by Admin, Investor AND the
  // public Visitor map — this endpoint is already public/read-only server-side).
  getBooths: async () => {
    const response = await http.get("/booths");
    return response.data;
  },
  // Investor: submit a reservation request for a booth.
  reserveBooth: async (boothId, investorData) => {
    const response = await http.post(`/booths/reserve/${boothId}`, investorData);
    return response.data;
  },
  // Admin: approve a pending reservation.
  approveBooth: async (boothId) => {
    const response = await http.post(`/booths/approve/${boothId}`);
    return response.data;
  },
  // Admin: reject a reservation (returns the booth to Available).
  rejectBooth: async (boothId) => {
    const response = await http.post(`/booths/reject/${boothId}`);
    return response.data;
  },
};
