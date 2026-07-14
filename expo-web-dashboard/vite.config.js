import os from "node:os";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Best-guess LAN IPv4 of THIS machine, computed in Node at dev/build time and
// injected as __VISITOR_LAN_HOST__. The browser cannot read the machine's LAN
// IP, so this is how the Visitor QR embeds a phone-reachable address (the same
// "Network:" URL Vite prints) even when the dashboard is opened via localhost.
// Preference order: 192.168.* (typical Wi-Fi / Windows Mobile Hotspot) → 172.16
// –31.* → 10.* ; internal loopback and 169.254.* (APIPA, no DHCP) are skipped.
function detectLanHost() {
  const rank = (ip) => {
    if (ip.startsWith("192.168.")) return 0;
    if (/^172\.(1[6-9]|2\d|3[01])\./.test(ip)) return 1;
    if (ip.startsWith("10.")) return 2;
    return 3;
  };
  const found = [];
  for (const list of Object.values(os.networkInterfaces())) {
    for (const net of list || []) {
      const isIPv4 =
        typeof net.family === "string" ? net.family === "IPv4" : net.family === 4;
      if (!isIPv4 || net.internal || net.address.startsWith("169.254.")) continue;
      found.push(net.address);
    }
  }
  found.sort((a, b) => rank(a) - rank(b));
  return found[0] || "";
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    // Literal string (may be "") baked into the client bundle; read by the
    // Visitor QR generator to build a phone-reachable map URL.
    __VISITOR_LAN_HOST__: JSON.stringify(detectLanHost()),
  },
  server: {
    // Dedicated, fixed port for the web dashboard. Without this, Vite defaults
    // to 5173 and collides with expo-mobile-app (which also defaults to 5173),
    // so the port would drift unpredictably and the landing page's "Sign in"
    // link (VITE_WEB_APP_URL) could not reliably reach the dashboard.
    // strictPort makes a conflict fail loudly instead of silently drifting.
    port: 5180,
    strictPort: true,
  },
});
