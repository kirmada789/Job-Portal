import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  LogOut, 
  Bell, 
  BriefcaseBusiness, 
  Target,
  Sparkles,
  FileText,
  LayoutDashboard,
  CheckCircle,
  Clock,
  Menu,
  X,
  User as UserIcon,
  ShieldAlert
} from 'lucide-react';
import api from '../api/axios';

function Navbar({ user, onLogout }) {
  const userRole = user?.role?.toLowerCase();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch notifications for recruiter
  useEffect(() => {
    const fetchNotifications = async () => {
      if (userRole === 'recruiter') {
        try {
          const res = await api.get('/notifications');
          if (res.data.success) {
            setNotifications(res.data.notifications || []);
            setUnreadCount(res.data.unreadCount || 0);
          }
        } catch (err) {
          console.error("Failed to fetch notifications:", err);
        }
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [userRole]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  return (
    <div className="w-full px-3 sm:px-6 lg:px-12 pt-4 sticky top-0 z-50">
      <nav className="w-full relative z-20 bg-white border border-slate-200/80 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] backdrop-blur-xl px-3 sm:px-6 lg:px-12 py-2.5 rounded-2xl flex items-center justify-between">
        
        {/* Left Side: Logo */}
        <div className="flex items-center shrink-0">
          <Link to={userRole === 'admin' ? "/admin/dashboard" : "/"} className="group flex items-center gap-2 cursor-pointer">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8] shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-transform group-hover:scale-105">
              <BriefcaseBusiness className="h-5 w-5 sm:h-6 sm:w-6 text-white" strokeWidth={2} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-[22px] font-bold tracking-tight text-[#0f172a] leading-none">
                Job<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8]">Portal</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold tracking-widest text-[#475569] uppercase">
                {userRole === 'admin' ? 'Admin Nexus' : 'Jobnetic Edition'}
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Navigation Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-8">
          {userRole === 'admin' ? (
            // 🛡️ Admin ke liye public links bilkul hide rahenge
            <div className="flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cyan-700">
              <ShieldAlert className="h-4 w-4 text-cyan-600" /> Admin Command Center
            </div>
          ) : userRole === 'recruiter' ? (
            <>
              <Link to="/" className="relative py-2 text-base font-semibold text-[#1e293b] hover:text-[#635bff] transition-colors duration-300 cursor-pointer after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#635bff] hover:after:w-full after:transition-all after:duration-300">Home</Link>
              <Link to="/post-job" className="relative py-2 text-base font-semibold text-[#1e293b] hover:text-[#635bff] transition-colors duration-300 cursor-pointer after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#635bff] hover:after:w-full after:transition-all after:duration-300">Post New Job</Link>
              <Link to="/recruiter" className="relative py-2 text-base font-semibold text-[#1e293b] hover:text-[#635bff] transition-colors duration-300 cursor-pointer after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#635bff] hover:after:w-full after:transition-all after:duration-300">Applicant Submissions</Link>
            </>
          ) : (
            <>
              <Link to="/" className="relative py-2 text-base font-semibold text-[#1e293b] hover:text-[#635bff] transition-colors duration-300 cursor-pointer after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#635bff] hover:after:w-full after:transition-all after:duration-300">Home</Link>
              <Link to="/seeker" className="relative flex items-center gap-2 py-2 text-base font-semibold text-[#1e293b] hover:text-[#635bff] transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#635bff] hover:after:w-full after:transition-all after:duration-300">
                <Target className="h-4.5 w-4.5 text-blue-600" /> Explore Jobs
              </Link>
              <Link to="/tracker" className="relative flex items-center gap-2 py-2 text-base font-semibold text-[#1e293b] hover:text-[#635bff] transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#635bff] hover:after:w-full after:transition-all after:duration-300">
                <FileText className="h-4.5 w-4.5 text-indigo-600" /> Job Tracker
              </Link>
            </>
          )}
        </div>

        {/* Right Side: User Actions / Logout */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {user ? (
            <>
              {userRole === 'recruiter' && (
                <div className="relative flex items-center gap-2 sm:gap-3 border-r border-black/10 pr-2 sm:pr-4" ref={dropdownRef}>
                  <button 
                    onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                    className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-black/10 bg-black/5 text-[#0f172a] transition-all hover:bg-black/15 cursor-pointer"
                  >
                    <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-red-600 text-[9px] sm:text-[10px] font-bold text-white shadow-md">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifDropdown && (
                    <div className="absolute right-0 top-12 w-72 sm:w-80 rounded-2xl bg-white p-4 shadow-2xl border border-slate-200 z-50 text-left">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                        <h4 className="font-bold text-sm text-slate-800">Notifications</h4>
                        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                          {unreadCount} unread
                        </span>
                      </div>

                      <div className="max-h-72 overflow-y-auto space-y-2.5">
                        {notifications.length > 0 ? (
                          notifications.map((notif) => (
                            <div 
                              key={notif._id} 
                              onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
                              className={`p-3 rounded-xl border transition-all text-xs cursor-pointer ${notif.isRead ? 'bg-slate-50 border-slate-100 text-slate-500' : 'bg-indigo-50/60 border-indigo-200 text-slate-900 font-medium'}`}
                            >
                              <p className="leading-snug">{notif.message}</p>
                              <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
                                <span className="flex items-center gap-1">
                                  <Clock size={11} /> {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {!notif.isRead && (
                                  <span className="text-indigo-600 font-bold flex items-center gap-0.5">
                                    <CheckCircle size={11} /> Mark read
                                  </span>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-400 text-center py-6">No notifications yet.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 sm:gap-4">
                {userRole !== 'admin' && (
                  <Link to="/profile" className="hidden sm:flex items-center gap-3 rounded-full border border-black/10 bg-white/50 p-1.5 pr-4 shadow-inner hover:bg-slate-100 transition-colors cursor-pointer">
                    <div className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 p-[2px]">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${user?.fullName || user?.name || 'User'}&background=random&color=fff`} 
                        alt="Profile" 
                        className="h-full w-full rounded-full border border-white object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-bold text-[#0f172a]">{user.fullName || user.name}</div>
                      <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold tracking-wide text-blue-600 uppercase">
                        <Sparkles className="h-3 w-3" />
                        {user.role}
                      </div>
                    </div>
                  </Link>
                )}

                <button 
                  onClick={onLogout} 
                  className="group flex items-center gap-1.5 sm:gap-2 rounded-xl bg-red-500/10 px-3 sm:px-4 py-2 text-xs sm:text-base font-semibold text-red-600 transition-all hover:bg-red-500 hover:text-white cursor-pointer"
                >
                  <LogOut className="h-4 w-4 sm:h-4.5 sm:w-4.5 transition-transform group-hover:-translate-x-1" />
                  <span>{userRole === 'admin' ? 'Terminate Session' : 'Logout'}</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 sm:gap-6">
              <Link to="/login" className="relative py-2 font-semibold text-[#1e293b] hover:text-[#635bff] transition-colors duration-300 cursor-pointer flex items-center">
                <span className="sm:hidden flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-black/5 text-[#0f172a]">
                  <UserIcon className="h-4 w-4" />
                </span>
                <span className="hidden sm:inline text-base">Login / Register</span>
              </Link>
              <Link 
                to="/post-job" 
                className="relative isolate hidden overflow-hidden bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8] text-white font-semibold px-5 py-2.5 rounded-xl text-base shadow-md shadow-indigo-500/20 sm:block"
              >
                <span className="relative z-10">Post Jobs &gt;</span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger Button (Hidden for Admin) */}
          {userRole !== 'admin' && (
            <button
              type="button"
              aria-label={showMobileMenu ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={showMobileMenu}
              onClick={() => setShowMobileMenu((current) => !current)}
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition-colors hover:bg-slate-100 lg:hidden cursor-pointer"
            >
              {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}
        </div>

      </nav>

      {/* Mobile Dropdown Navigation Menu */}
      {showMobileMenu && userRole !== 'admin' && (
        <div className="mt-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl lg:hidden">
          <div className="flex flex-col gap-2">
            {userRole === 'recruiter' ? (
              <>
                <Link onClick={() => setShowMobileMenu(false)} to="/" className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">Home</Link>
                <Link onClick={() => setShowMobileMenu(false)} to="/post-job" className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">Post New Job</Link>
                <Link onClick={() => setShowMobileMenu(false)} to="/recruiter" className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">Applicant Submissions</Link>
              </>
            ) : (
              <>
                <Link onClick={() => setShowMobileMenu(false)} to="/" className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">Home</Link>
                <Link onClick={() => setShowMobileMenu(false)} to="/seeker" className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">Explore Jobs</Link>
                <Link onClick={() => setShowMobileMenu(false)} to="/tracker" className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">Job Tracker</Link>
              </>
            )}
            {user && (
              <Link onClick={() => setShowMobileMenu(false)} to="/profile" className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 sm:hidden">My Profile</Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;