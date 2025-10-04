import './App.css';
import { useContext, useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import { AuthContext } from "./Navbar/AuthContext";
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import PrivateRoute from './AUTH/PrivateRoute';
import { AuthPage } from './AUTH/AuthPage';
import LoginSuccess from './AUTH/LoginSuccess';
import LandingPage from './STUDIO/LANDING-PAGE/LandingPage';
import Dashboard from './STUDIO/USER/Dashboard';
import { CheckoutPage } from './STUDIO/LANDING-PAGE/CheckoutPage';
import StudioSuperAdminDashboard from './STUDIO/StudioSuperAdmin/StudioSuperAdminDashboard';


function App() {

  const { isLoggedIn, name } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === "/" && isLoggedIn && name) {
      navigate(`/${name}`, { replace: true });
    }
  }, [location.pathname, isLoggedIn, name, navigate]);


  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/:name" element={<LandingPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login-success" element={<LoginSuccess />} />
        <Route path="/dashboard/:name" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/studioSuperAdmin" element={<StudioSuperAdminDashboard />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>

  );
}

export default App;
