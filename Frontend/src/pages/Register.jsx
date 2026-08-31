import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Briefcase, ChevronDown, ShieldCheck } from 'lucide-react';
import API from '../utils/api'; 
import { GoogleLogin } from '@react-oauth/google';

function Register({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Seeker', 
  });

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

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

    if (formData.password !== formData.confirmPassword) {
      alert('Password mismatch ho gaya hai.');
      return;
    }

    try {
      const payload = {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role.toLowerCase()
      };

      const response = await API.post("/auth/signup", payload);

      if (response.data.success) {
        alert("OTP sent to your email! Please check your inbox.");
        setIsOtpSent(true); 
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Something went wrong during registration.');
    }
  };

  // 2. OTP Verification Handler (Ab user ko login page par bhejega)
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/auth/verify-otp", {
        email: formData.email,
        otp: otp
      });

      if (response.data.success) {
        alert("Email verified successfully! Please login with your credentials.");
        navigate('/login'); // 👈 Ab user direct login page par redirect hoga
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Invalid or expired OTP.');
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
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-black">Create Account</p>
          <h1 className="mt-4 text-3xl font-semibold sm:text-4xl text-black">Join a smarter hiring experience.</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-black sm:text-base">
            Build your profile, find relevant roles, or manage hiring pipelines from one place.
          </p>
          <div className="mt-8 grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-2xl border border-black/15 bg-white/20 p-3 text-black">Secure OTP Verification</div>
            <div className="rounded-2xl border border-black/15 bg-white/20 p-3 text-black">Role-based access</div>
          </div>
        </div>

        <div className="image-zoom-reveal glass-card p-6 sm:p-8 rounded-[28px] bg-white shadow-xl border border-slate-100">
          
          {!isOtpSent ? (
            <>
              <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-800">Create Account</h2>
                <p className="mt-2 text-sm text-slate-500">Join JobPortal as a seeker or recruiter</p>
              </div>

              <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Full Name</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 text-slate-800"
                    />
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
                  <label className="mb-1 block text-sm font-medium text-slate-700">Role</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 z-10">
                      <Briefcase className="h-5 w-5 text-slate-400" />
                    </div>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full appearance-none rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-10 text-sm outline-none ring-0 transition hover:border-[#9795f3] focus:border-[#3c47c8] focus:ring-2 focus:ring-[#9795f3]/30 text-slate-800 cursor-pointer"
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
                  <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
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

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Confirm Password</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 text-slate-800"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="relative isolate overflow-hidden flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8] px-4 py-2.5 font-semibold text-white transition-all duration-300 shadow-md before:absolute before:inset-0 before:bg-[#0a2540] before:opacity-0 before:transition-opacity before:duration-400 before:ease-in-out hover:before:opacity-100 before:-z-10 cursor-pointer"
                >
                  <span className="relative z-10">Register & Send OTP</span>
                </button>

                <div className="mt-4 flex justify-center">
                  <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                      try {
                        const token = credentialResponse.credential;
                        const response = await API.post("/auth/google", {
                          token: token,
                          role: formData.role.toLowerCase()
                        });
                        if (response.data.success) {
                          onLogin(response.data.user || response.data);
                          alert("Google Registration Successful!");
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

              <div className="mt-6 text-center text-sm text-slate-600">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8] bg-clip-text text-transparent hover:underline">
                  Login here
                </Link>
              </div>
            </>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6 py-6">
              <div className="text-center">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-3 shadow-inner">
                  <ShieldCheck className="h-6 w-6" />
                </span>
                <h2 className="text-2xl font-bold text-slate-800">Verify Your Email</h2>
                <p className="mt-2 text-sm text-slate-500">
                  We have sent a 6-digit verification code to <span className="font-semibold text-slate-700">{formData.email}</span>
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 text-center">Enter 6-Digit OTP</label>
                <input
                  type="text"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  required
                  className="w-full text-center tracking-[0.5em] text-2xl font-bold rounded-xl border border-slate-300 bg-slate-50 py-3 px-3 outline-none transition focus:border-blue-500 text-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8] px-4 py-3 font-semibold text-white transition-all duration-300 shadow-md hover:opacity-90 cursor-pointer"
              >
                Verify & Proceed to Login
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsOtpSent(false)}
                  className="text-xs text-indigo-600 hover:underline font-medium cursor-pointer"
                >
                  ← Back to Registration form
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

export default Register;