import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import TestMessage from './components/TestMessage';
import RegisterForm from './components/Form/RegisterForm';
import UserList from './components/UserList';
import LoginForm from './components/Form/LoginForm';
import Navbar from './components/Navbar';
import { Button } from "@/components/ui/button"
import RestaurantSettings from './pages/Settings/RestaurantSettings';
import PinProtection from './pages/Settings/PinProtection';

import AiWebSocketTest from './components/AiWebSocketTest';
import WebSocketRawDebug from './pages/WebSocketRawDebug';
import BackendStatus from "@/components/Debug/BackendStatus";

function App() {
  // Le hook useLocation permet de savoir sur quelle page on est
  const location = useLocation();
  return (
    <>
      {/* On n'affiche la Navbar que si on n'est PAS sur la page /register */}
      {location.pathname !== '/register' && <Navbar />}

      {/* Route pour le reste de l'application (Accueil) */}
      <div className={location.pathname !== '/register' ? "pt-[70px]" : ""}>
        <Routes>
          {/* Route pour la page de connexion */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/test" element={<TestMessage />} />
          <Route path="/test-ai" element={<AiWebSocketTest />} />
          <Route path="/debug-ws" element={<WebSocketRawDebug />} />
          <Route path="/admin/utilisateur" element={<UserList />} />
          <Route path="/settings/security" element={<PinProtection />} />
          <Route path="/settings" element={<RestaurantSettings />} />
          <Route path="*" element={<h1>404 - Page non trouvée</h1>} />
        </Routes>
        <div className="p-4">
          <BackendStatus />
        </div>
      </div>
    </>
  );
}

export default App;
