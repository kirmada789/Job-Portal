import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword'; 
import AdminDashboard from './pages/AdminDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import SeekerDashboard from './pages/SeekerDashboard';
import JobTracker from './pages/JobTracker';
import ProfilePage from './pages/ProfilePage';
import PostJob from './pages/PostJob';
import Footer from './pages/Footer';
import HeroSection from './components/HeroSection';
import JobFeatures from './components/JobFeatures';
import Resume from './pages/Resume';
import TrendingJobs from './pages/TrendingJobs';
import Categories from './pages/Categories';
import Brands from './pages/Brands';
import LatestNews from './pages/LatestNews';
import TopTalent from './pages/TopTalent';
import FreelancerSection from './pages/FreelancerSection';
import api from './api/axios';

function ProtectedRoute({ children, allowedRole }) {
  const userString = localStorage.getItem('user');
  const currentUser = userString ? JSON.parse(userString) : null;

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && currentUser.role?.trim().toLowerCase() !== allowedRole.trim().toLowerCase()) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// 🛡️ PublicOnlyRoute: Agar user already logged-in hai toh login/register pages access nahi karne dega
function PublicOnlyRoute({ children }) {
  const userString = localStorage.getItem('user');
  const currentUser = userString ? JSON.parse(userString) : null;

  if (currentUser) {
    const role = currentUser.role?.trim().toLowerCase();
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'recruiter') return <Navigate to="/recruiter" replace />;
    return <Navigate to="/seeker" replace />;
  }

  return children;
}

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const isStandaloneRoute = location.pathname !== '/' && (['/admin', '/admin/dashboard', '/recruiter', '/seeker', '/tracker', '/profile', '/login', '/admin-login', '/register', '/post-job'].includes(location.pathname) || location.pathname.startsWith('/reset-password'));

  useEffect(() => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname]);

  const handleLogin = (loggedInUser) => {
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem('user');
      setUser(null);
      alert("Logged out successfully!");
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.message || 'Logout failed.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-transparent text-slate-800">
      <div>
        {/* 🛡️ Admin Dashboard par hone par upar wala Navbar hide ho jayega */}
        {location.pathname !== '/admin/dashboard' && <Navbar user={user} onLogout={handleLogout} />}

        {!isStandaloneRoute && (
          <>
            <HeroSection />
            <JobFeatures />
            <Categories />
            <TrendingJobs />
            <TopTalent />
            <FreelancerSection />
          </>
        )}

        <div className={location.pathname === '/admin/dashboard' ? 'w-full p-0 m-0' : 'mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 page-enter'}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            
            {/* 🛡️ Public Only Routes (Wrapped to prevent access if already logged in) */}
            <Route path="/login" element={<PublicOnlyRoute><Login onLogin={handleLogin} /></PublicOnlyRoute>} />
            <Route path="/admin-login" element={<PublicOnlyRoute><AdminLogin /></PublicOnlyRoute>} />
            <Route path="/register" element={<PublicOnlyRoute><Register onLogin={handleLogin} /></PublicOnlyRoute>} />
            
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRole="Admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/recruiter" element={<ProtectedRoute allowedRole="Recruiter"><RecruiterDashboard /></ProtectedRoute>} />
            
            <Route path="/post-job" element={<ProtectedRoute allowedRole="Recruiter"><PostJob /></ProtectedRoute>} />
            
            <Route path="/seeker" element={<SeekerDashboard />} />
            
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/tracker" element={<ProtectedRoute allowedRole="Seeker"><JobTracker /></ProtectedRoute>} />
          </Routes>
        </div>

        {!isStandaloneRoute && (
          <>
            <LatestNews />
            <br />
            <br />
            <Brands />
            <Resume />
          </>
        )}
      </div>

      {/* 👈 Global Footer (Admin Dashboard ko chhod kar) */}
      {location.pathname !== '/admin/dashboard' && <Footer />}
    </div>
  );
}

export default App;