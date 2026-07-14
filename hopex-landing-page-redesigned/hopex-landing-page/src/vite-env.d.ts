/// <reference types="vite/client" />

declare module '*.css';

interface ImportMetaEnv {
  /** Public URL of the Expo Web Dashboard that hosts the login page. */
  readonly VITE_WEB_APP_URL?: string;
}
