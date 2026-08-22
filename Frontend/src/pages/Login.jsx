import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ChevronDown } from 'lucide-react';
import API from '../utils/api'; // 👈 Ab sahi API instance import kar liya hai
import { GoogleLogin } from '@react-oauth/google';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'Seeker',
  });
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.15 });

    const elements = document.querySelectorAll('.scroll-fade, .image-zoom-reveal');
    elements.forEach(el => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        role: formData.role.toLowerCase()
      };

      // ✅ Ab yeh Render backend par request bhejega
      const response = await API.post("/auth/login", payload);

      if (response.data.success) {
        const loggedInUser = response.data.user || response.data || payload;
        onLogin(loggedInUser);

        alert("Login Successful!");

        const userRole = (response.data.role || response.data.user?.role || formData.role).toLowerCase();
        
        if (userRole === 'admin') {
          navigate('/admin');
        } else if (userRole === 'recruiter') {
          navigate('/recruiter');
        } else {
          navigate('/seeker');
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Invalid email, password or role.');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/auth/forget-password", {
        email: forgotEmail
      });
      if (response.data.success) {
        alert("Password reset link sent to your email!");
        setIsForgotMode(false);
        setForgotEmail('');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <div className="flex min-h-[82vh] items-center justify-center py-8">
      
      <style>{`
        .scroll-fade {
          opacity: 0;
          transform: translateY(50px);
          transition: opacity 2.5s cubic-bezier(0.16, 1, 0.3, 1), transform 2.5s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }
        .scroll-fade.active {
          opacity: 1;
          transform: translateY(0);
        }

        .image-zoom-reveal {
          opacity: 0;
          transform: scale(0.6) translateY(50px);
          transition: opacity 2.5s cubic-bezier(0.16, 1, 0.3, 1), transform 2.5s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }
        .image-zoom-reveal.active {
          opacity: 1;
          transform: scale(1) translateY(0);
        }

        select option:checked, select option:hover {
          background: linear-gradient(to right, #d3c4f5, #9795f3) !important;
          color: #000 !important;
        }
      `}</style>

      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] px-4 sm:px-6">
        <div className="scroll-fade rounded-[28px] bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8] p-8 text-black shadow-[0_20px_60px_rgba(15,23,42,0.25)] sm:p-10 border border-white/20">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-black">Job Portal</p>
          <h1 className="mt-4 text-3xl font-semibold sm:text-4xl text-black">Find your next opportunity with confidence.</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-black sm:text-base">
            Recruiters handle hiring, and seekers discover roles in one polished experience.
          </p>
          <div className="mt-8 rounded-2xl border border-black/15 bg-white/20 p-4 backdrop-blur">
            <div className="flex items-center gap-2 text-sm font-medium text-black">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-900" />
              Fast onboarding
            </div>
            <div className="mt-3 grid gap-2 text-sm text-black sm:grid-cols-2">
              <div className="rounded-xl bg-white/20 px-3 py-2">Role-based dashboards</div>
              <div className="rounded-xl bg-white/20 px-3 py-2">Application tracking</div>
            </div>
          </div>
        </div>

        <div className="image-zoom-reveal glass-card p-6 sm:p-8 rounded-[28px] bg-white shadow-xl border border-slate-100">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-800">{isForgotMode ? "Reset Password" : "Welcome Back"}</h2>
            <p className="mt-2 text-sm text-slate-500">{isForgotMode ? "Enter your email to receive reset link" : "Login to continue your journey"}</p>
          </div>

          {!isForgotMode ? (
            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Select Role</label>
                <div className="relative">
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 pr-10 text-sm outline-none ring-0 transition focus:border-[#9795f3] focus:ring-2 focus:ring-[#9795f3]/30 text-slate-800 cursor-pointer"
                  >
                    <option value="Seeker">Job Seeker</option>
                    <option value="Recruiter">Recruiter</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Email Address</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setIsForgotMode(true)}
                    className="text-xs font-semibold bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8] bg-clip-text text-transparent hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 text-slate-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="relative isolate overflow-hidden flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8] px-4 py-2.5 font-semibold text-white transition-all duration-300 shadow-md before:absolute before:inset-0 before:bg-[#0a2540] before:opacity-0 before:transition-opacity before:duration-400 before:ease-in-out hover:before:opacity-100 before:-z-10"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <LogIn className="h-5 w-5" />
                  Login
                </span>
              </button>
              
              <div className="mt-4 flex justify-center">
                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    try {
                      const token = credentialResponse.credential;
                      // ✅ Google Auth ab API instance use karega
                      const response = await API.post("/auth/google", {
                        token: token,
                        role: formData.role.toLowerCase()
                      });
                      if (response.data.success) {
                        onLogin(response.data.user || response.data);
                        alert("Google Login Successful!");
                        const role = (response.data.role || formData.role).toLowerCase();
                        navigate(role === 'recruiter' ? '/recruiter' : '/seeker');
                      }
                    } catch (error) {
                      alert(error.response?.data?.message || 'Google Auth failed.');
                    }
                  }}
                  onError={() => alert('Google Sign-In failed.')}
                />
              </div>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="mt-7 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Enter Your Registered Email</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 text-slate-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="relative isolate overflow-hidden flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8] px-4 py-2.5 font-semibold text-white transition-all duration-300 shadow-md"
              >
                <span className="relative z-10">Send Reset Link</span>
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsForgotMode(false)}
                  className="text-sm font-semibold text-slate-600 hover:underline"
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8] bg-clip-text text-transparent hover:underline">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;