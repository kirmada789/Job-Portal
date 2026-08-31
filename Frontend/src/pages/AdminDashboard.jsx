import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, Activity, Briefcase, Power, Cpu, Globe, 
  Users, Trash2, CheckCircle2, XCircle, LogOut, Menu, X, FileText, LayoutDashboard 
} from 'lucide-react';
import api from '../api/axios';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Backend Data States
  const [dashboardStats, setDashboardStats] = useState({ totalUsers: 0, totalRecruiters: 0, totalJobs: 0, totalApplications: 0 });
  const [users, setUsers] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    alert("Session Terminated Successfully.");
    navigate('/admin-login');
  };

  // Fetch all core admin data on mount (Axios interceptor will attach token automatically)
  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        // 1. getAdminDashboard
        const statsRes = await api.get('/admin/dashboard').catch((err) => {
          console.error("Dashboard Stats Error:", err.response?.data || err.message);
          return null;
        });
        if (statsRes?.data) {
          setDashboardStats(statsRes.data.stats || statsRes.data);
        }

        // 2. getAllUsers
        const usersRes = await api.get('/admin/users').catch(() => null);
        if (usersRes?.data) {
          const allUsersData = usersRes.data.users || usersRes.data || [];
          setUsers(allUsersData);
          const recs = allUsersData.filter(u => u.role === 'recruiter');
          setRecruiters(recs);
        }

        // 3. getAllRecruiters
        const recruitersRes = await api.get('/admin/recruiters').catch(() => null);
        if (recruitersRes?.data) {
          setRecruiters(recruitersRes.data.recruiters || recruitersRes.data || []);
        }

        // 4. gettAllJobs
        const jobsRes = await api.get('/admin/jobs').catch(() => null);
        if (jobsRes?.data) {
          setJobs(jobsRes.data.jobs || jobsRes.data || []);
        }

        // 5. getAllApplications (With Console Log Debugger)
        const appsRes = await api.get('/admin/applications').catch((err) => {
          console.error("Applications Fetch Error:", err.response?.data || err.message);
          return null;
        });
        if (appsRes?.data) {
          console.log("🔥 Applications API Raw Response:", appsRes.data);
          const appsList = appsRes.data.applications || appsRes.data || [];
          console.log("🔥 Parsed Applications Array:", appsList);
          setApplications(appsList);
        }
      } catch (error) {
        console.error('Failed to load admin telemetry:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();

    // Set dark theme background
    const rootElement = document.getElementById('root');
    document.documentElement.style.backgroundColor = '#030712';
    document.body.style.backgroundColor = '#030712';
    if (rootElement) {
      rootElement.style.backgroundColor = '#030712';
      rootElement.style.minHeight = '100vh';
    }

    return () => {
      document.documentElement.style.backgroundColor = '';
      document.body.style.backgroundColor = '';
      if (rootElement) {
        rootElement.style.backgroundColor = '';
        rootElement.style.minHeight = '';
      }
    };
  }, []);

  // API: updateUserStatus
  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked';
      await api.put(`/admin/users/${userId}/status`, { status: newStatus });
      setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u));
    } catch (error) {
      alert("Failed to update user status.");
    }
  };

  // API: deleteUser
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to purge this user?")) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
    } catch (error) {
      alert("Failed to delete user.");
    }
  };

  // API: updateJobStatus
  const handleToggleJobStatus = async (jobId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'closed' : 'active';
      await api.put(`/admin/jobs/${jobId}/status`, { status: newStatus });
      setJobs(jobs.map(j => j._id === jobId ? { ...j, status: newStatus } : j));
    } catch (error) {
      alert("Failed to update job status.");
    }
  };

  // API: deleteJobs
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job posting?")) return;
    try {
      await api.delete(`/admin/jobs/${jobId}`);
      setJobs(jobs.filter(j => j._id !== jobId));
    } catch (error) {
      alert("Failed to delete job.");
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full p-6 bg-[#050b14] border-r border-cyan-500/25">
      <div className="flex items-center gap-4 px-3 py-4 border-b border-white/10 mb-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-500/40 bg-cyan-500/10 text-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.4)]">
          <Cpu className="h-6 w-6 animate-pulse" />
        </span>
        <div>
          <div className="text-base font-black text-white tracking-wider">JOBPORTAL NEXUS</div>
          <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span> Master Admin
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-3">
        <button 
          onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
          className={`flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold transition-all cursor-pointer ${activeTab === 'overview' ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.25)]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
        >
          <LayoutDashboard className="h-5 w-5 text-cyan-400" /> Overview & Stats
        </button>
        <button 
          onClick={() => { setActiveTab('users'); setMobileMenuOpen(false); }}
          className={`flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold transition-all cursor-pointer ${activeTab === 'users' ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.25)]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
        >
          <Users className="h-5 w-5 text-purple-400" /> Users & Recruiters
        </button>
        <button 
          onClick={() => { setActiveTab('jobs'); setMobileMenuOpen(false); }}
          className={`flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold transition-all cursor-pointer ${activeTab === 'jobs' ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.25)]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
        >
          <Briefcase className="h-5 w-5 text-indigo-400" /> Job Postings
        </button>
        <button 
          onClick={() => { setActiveTab('applications'); setMobileMenuOpen(false); }}
          className={`flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold transition-all cursor-pointer ${activeTab === 'applications' ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.25)]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
        >
          <FileText className="h-5 w-5 text-emerald-400" /> Applications
        </button>
      </nav>

      <div className="mt-auto space-y-4 pt-4 border-t border-white/10">
        <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span> Live API Connected
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-3.5 text-sm font-bold text-rose-400 transition-all hover:bg-rose-500 hover:text-white active:scale-95 cursor-pointer shadow-[0_0_15px_rgba(244,63,94,0.2)]"
        >
          <LogOut className="h-4 w-4" /> Terminate Session
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-[#030712] text-slate-300 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-80 flex-col sticky top-0 h-screen z-40 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-cyan-500/20 bg-[#050b14]/95 px-4 py-3.5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-500/40 bg-cyan-500/10 text-cyan-400">
            <Cpu className="h-5 w-5" />
          </span>
          <span className="text-sm font-black text-white tracking-wider">NEXUS ADMIN</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-cyan-400 cursor-pointer"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-45 bg-black/85 backdrop-blur-md pt-16">
          <div className="w-72 sm:w-80 h-full">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto lg:pt-0 pt-20">
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col space-y-8 p-4 sm:p-8 lg:p-12">
          
          {/* Header Banner */}
          <div className="rounded-3xl border border-white/10 bg-black/50 p-6 sm:p-10 backdrop-blur-3xl">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tighter text-white">
              Admin <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Control Center</span>
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-400">
              Managing real-time users, active job listings, and system applications securely via backend APIs.
            </p>
          </div>

          {loading ? (
            <div className="py-20 text-center text-cyan-400 font-mono text-lg animate-pulse">
              [Fetching live data from backend nodes...]
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW & STATS */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur-xl">
                      <div className="text-3xl sm:text-4xl font-black text-white">
                        {users.filter(u => u.role === 'seeker').length || dashboardStats.totalUsers}
                      </div>
                      <div className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">Total Users</div>
                    </div>
                    <div className="rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur-xl">
                      <div className="text-3xl sm:text-4xl font-black text-white">
                        {recruiters.length || users.filter(u => u.role === 'recruiter').length || dashboardStats.totalRecruiters}
                      </div>
                      <div className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">Total Recruiters</div>
                    </div>
                    <div className="rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur-xl">
                      <div className="text-3xl sm:text-4xl font-black text-white">{jobs.length || dashboardStats.totalJobs}</div>
                      <div className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">Active Job Posts</div>
                    </div>
                    <div className="rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur-xl">
                      <div className="text-3xl sm:text-4xl font-black text-white">{applications.length || dashboardStats.totalApplications}</div>
                      <div className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">Total Applications</div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: USERS & RECRUITERS MANAGEMENT */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-white">Registered Entities (Users & Recruiters)</h2>
                  <div className="flex flex-col gap-4">
                    {users.map((u) => (
                      <div key={u._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                        <div>
                          <div className="text-base font-bold text-white">{u.fullName || u.name}</div>
                          <div className="text-xs text-slate-400">{u.email} • <span className="uppercase text-cyan-400 font-semibold">{u.role}</span></div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleToggleUserStatus(u._id, u.status)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide cursor-pointer ${u.status === 'blocked' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'}`}
                          >
                            {u.status === 'blocked' ? 'Unblock' : 'Block'}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-white cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: JOB POSTINGS MANAGEMENT */}
              {activeTab === 'jobs' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-white">Job Postings Control</h2>
                  <div className="flex flex-col gap-4">
                    {jobs.length === 0 ? (
                      <div className="text-slate-500 text-sm">No job postings found.</div>
                    ) : (
                      jobs.map((job) => (
                        <div key={job._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                          <div>
                            <div className="text-base font-bold text-white">{job.title}</div>
                            <div className="text-xs text-slate-400">{job.company} • <span className="text-cyan-400">{job.location}</span></div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleToggleJobStatus(job._id, job.status)}
                              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide cursor-pointer ${job.status === 'closed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'}`}
                            >
                              {job.status === 'closed' ? 'Activate' : 'Close Job'}
                            </button>
                            <button
                              onClick={() => handleDeleteJob(job._id)}
                              className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-white cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: APPLICATIONS */}
              {activeTab === 'applications' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-white">All Platform Applications</h2>
                  <div className="flex flex-col gap-4">
                    {applications.length === 0 ? (
                      <div className="text-slate-500 text-sm">No applications recorded yet.</div>
                    ) : (
                      applications.map((app) => (
                        <div key={app._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                          <div>
                            <div className="text-base font-bold text-white">
                              Application ID: {app._id}
                            </div>
                            <div className="text-xs text-slate-400 mt-1">
                              Job Ref: {app.job?.title || app.jobId || app.job || 'N/A'} • Status: <span className="text-cyan-400 uppercase font-semibold">{app.status || 'Pending'}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;