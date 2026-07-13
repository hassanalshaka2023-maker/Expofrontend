import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InteractiveMap from './pages/InteractiveMap';
import ScannerPage from './pages/ScannerPage';

function App() {
  return (
    <Router>
      <div className="w-full h-screen overflow-hidden bg-gray-950 m-0 p-0">
        <Routes>
          <Route path="/" element={<InteractiveMap />} />
          <Route path="/admin-gate-scan" element={<ScannerPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;