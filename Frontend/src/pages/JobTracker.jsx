import React, { useEffect, useState, useMemo } from 'react';
import api from '../api/axios';
import { 
  Loader2, 
  Briefcase, 
  Building2, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  TrendingUp, 
  Award, 
  Layers, 
  Search, 
  Filter, 
  ShieldCheck 
} from 'lucide-react';

function JobTracker() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const userId = storedUser?._id || storedUser?.id;

        if (userId) {
          const response = await api.get(`/application/my-applications/${userId}`);
          setApplications(response.data.applications || response.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Professional Analytics stats calculation
  const stats = useMemo(() => {
    const total = applications.length;
    let shortlisted = 0;
    let hired = 0;
    let pending = 0;

    applications.forEach(app => {
      const st = (app.status || '').toLowerCase();
      if (st === 'shortlisted') shortlisted++;
      else if (st === 'accepted' || st === 'selected') hired++;
      else if (st === 'pending' || st === 'viewed') pending++;
    });

    const successRate = total > 0 ? Math.round(((shortlisted + hired) / total) * 100) : 0;

    return { total, shortlisted, hired, pending, successRate };
  }, [applications]);

  // Filtered applications based on search keyword and status pill
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const titleMatch = (app.job?.title || '').toLowerCase().includes(searchTerm.toLowerCase());
      const companyMatch = (app.job?.company || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSearch = titleMatch || companyMatch;

      const st = (app.status || 'pending').toLowerCase();
      let matchesStatus = true;
      if (statusFilter !== 'All') {
        if (statusFilter === 'Pending') matchesStatus = (st === 'pending' || st === 'viewed');
        else if (statusFilter === 'Shortlisted') matchesStatus = (st === 'shortlisted');
        else if (statusFilter === 'Hired') matchesStatus = (st === 'accepted' || st === 'selected');
        else if (statusFilter === 'Rejected') matchesStatus = (st === 'rejected');
      }

      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, statusFilter]);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': 
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80 shadow-2xs">
            <Clock className="h-3 w-3 text-amber-500" /> Pending Review
          </span>
        );
      case 'viewed': 
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200/80 shadow-2xs">
            <AlertCircle className="h-3 w-3 text-sky-500" /> Profile Viewed
          </span>
        );
      case 'shortlisted': 
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs">
            <CheckCircle2 className="h-3 w-3 text-indigo-500" /> Shortlisted
          </span>
        );
      case 'accepted':
      case 'selected': 
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Hired / Accepted
          </span>
        );
      case 'rejected': 
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80 shadow-2xs">
            <XCircle className="h-3 w-3 text-rose-500" /> Not Selected
          </span>
        );
      default: 
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs">
            {status || 'Pending'}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="h-10 w-10 animate-spin text-[#3c47c8]" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 py-6 max-w-7xl mx-auto overflow-x-hidden animate-fadeIn">
      
      {/* Smooth Keyframe Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .card-hover-effect {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card-hover-effect:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px -5px rgba(60, 71, 200, 0.1);
        }
      `}</style>

      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8] text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md tracking-wider shadow-sm">Candidate Hub</span>
            <span className="text-xs text-slate-400 font-medium">Jobnetic Secure Portal</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Application Tracker</h2>
          <p className="text-sm text-slate-500 mt-1">Real-time tracking of your job applications, recruiter reviews, and hiring pipelines.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-200 shadow-2xs">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Encrypted Pipeline</span>
          </div>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between card-hover-effect">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Applied</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats.total}</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shadow-inner">
            <Briefcase className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between card-hover-effect">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-500">In Review</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats.pending}</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-inner">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between card-hover-effect">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-500">Shortlisted</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats.shortlisted}</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between card-hover-effect">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-500">Hired Offers</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats.hired}</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
            <Award className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8] text-white p-5 rounded-2xl shadow-md flex items-center justify-between col-span-1 sm:col-span-2 lg:col-span-1 card-hover-effect">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-100">Success Rate</p>
            <p className="text-2xl font-black text-white mt-1">{stats.successRate}%</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-md">
            <Layers className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Interactive Controls Toolbar (Search & Filters) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by position or company..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#3c47c8] transition"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <Filter className="h-4 w-4 text-slate-400 mr-2 shrink-0 hidden sm:block" />
          {['All', 'Pending', 'Shortlisted', 'Hired', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap active:scale-95 ${statusFilter === status ? 'bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {status}
            </button>
          ))}
        </div>

      </div>

      {/* Main Table Container */}
      {filteredApplications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-16 text-center shadow-xs">
          <div className="h-16 w-16 rounded-2xl bg-indigo-50 text-[#3c47c8] flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Briefcase className="h-8 w-8 stroke-[1.5]" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No applications matched</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">No job applications correspond to your current search filter or keyword. Try resetting your criteria.</p>
          {searchTerm && (
            <button 
              onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Position Title</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Company Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Live Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Application Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredApplications.map((app) => (
                  <tr key={app._id || app.id} className="hover:bg-slate-50/75 transition-all duration-200 group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3.5">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8] text-white flex items-center justify-center font-bold text-sm shrink-0 group-hover:scale-110 transition-transform shadow-2xs">
                          <Briefcase className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm tracking-tight">{app.job?.title || 'N/A'}</p>
                          <p className="text-xs text-slate-400 font-medium">Verified Submission ID: {app._id ? app._id.slice(-6).toUpperCase() : 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-slate-700 text-sm font-semibold">
                        <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>{app.job?.company || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Showing {filteredApplications.length} of {applications.length} applications</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8] font-extrabold">Jobnetic Enterprise Tracking</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobTracker;