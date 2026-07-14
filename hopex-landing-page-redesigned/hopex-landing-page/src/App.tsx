import { Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PlaceholderPage from './pages/PlaceholderPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={
          <PlaceholderPage
            eyebrow="Secure access"
            title="Sign in to HOPEX"
            description="Connect this route to your existing authentication feature for Admin, Investor, and Employee access."
          />
        }
      />
      <Route
        path="/map"
        element={
          <PlaceholderPage
            eyebrow="Visitor experience"
            title="Interactive Exhibition Map"
            description="Connect this public route to the Three.js visitor map. Visitors do not need an account."
          />
        }
      />
    </Routes>
  );
}
