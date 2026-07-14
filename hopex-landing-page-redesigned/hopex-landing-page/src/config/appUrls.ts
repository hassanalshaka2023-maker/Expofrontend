/**
 * Centralized URLs for cross-application navigation.
 *
 * The landing page and the Expo Web Dashboard are two separate Vite apps that
 * run on different ports. The dashboard does NOT use a client-side router: its
 * `<App>` renders the `<Login>` screen at the app root ("/") whenever no user is
 * authenticated (see Expofrontend/expo-web-dashboard/src/App.jsx). The same
 * login form is shared by Admin and Investor roles — the backend returns the
 * role and the dashboard picks the correct view after sign-in.
 *
 * Therefore the "login page" is simply the dashboard's root URL. The landing
 * page only navigates there; it never talks to the backend auth API directly.
 */

const webAppUrl = (
  import.meta.env.VITE_WEB_APP_URL || 'http://localhost:5180'
).replace(/\/$/, '');

export const APP_URLS = {
  /** Dashboard base URL (the dashboard renders its Login screen at the root). */
  webApp: webAppUrl,
  /** The real login entry point discovered in the dashboard: its root URL. */
  login: webAppUrl,
};
