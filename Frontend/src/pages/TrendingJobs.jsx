import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import api from '../api/axios';

const TrendingJobs = ({ sectionStyle = {} }) => {
  const [activeFilter, setActiveFilter] = useState('All Jobs');
  const [isVisible, setIsVisible] = useState(false);
  const [jobs, setJobs] = useState([]);
  const localRef = useRef(null);
  const navigate = useNavigate();
  
  // LocalStorage se logged-in user ki details nikalna
  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = user?.role?.toLowerCase();

  // Real API se jobs fetch karna
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get('/jobs/get-jobs');
        setJobs(response.data.jobs || []);
      } catch (error) {
        console.error("Error fetching trending jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (localRef.current) observer.observe(localRef.current);
    return () => observer.disconnect();
  }, []);
  
  const filterOptions = ['All Jobs', 'Full-time', 'Part-time', 'Internship', 'Contract'];
  
  // Case-insensitive aur trimmed filtering logic
  const filteredJobs = activeFilter === 'All Jobs' 
    ? jobs 
    : jobs.filter(job => {
        const jobType = job.jobType ? job.jobType.toLowerCase().trim() : '';
        const filterType = activeFilter.toLowerCase().trim();
        return jobType === filterType;
      });

  // Apply Button Click Handler
  const handleApply = async (jobId) => {
    // 1. Agar user login nahi hai -> Login page par redirect karo
    if (!user) {
      toast.error("Please login to apply for this job!");
      return navigate('/login');
    }

    // 2. Agar user Recruiter hai -> Apply karne se roko
    if (userRole === 'recruiter') {
      return toast.error("Recruiters are not allowed to apply for jobs!");
    }

    // 3. Agar Seeker hai -> Apply API call karo
    try {
      const response = await api.post('/application/apply', {
        jobId: jobId,
        userId: user._id || user.id
      });

      if (response.data.success) {
        toast.success("Applied successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply for job");
    }
  };

  return (
    <div 
      ref={localRef} 
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans"
      style={{
        ...sectionStyle,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(40px)",
        transition: "opacity 0.8s ease-out, transform 0.8s ease-out"
      }}
    >
      <Toaster position="top-right" />

      {/* Header & Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight">Trending Jobs</h2>
          <p className="mt-2 text-base text-slate-600 font-medium">
            Handpicked roles from top companies — apply before they're gone!
          </p>
        </div>
        
        {/* Responsive Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {filterOptions.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeFilter === tab 
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid or Empty State */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200 text-slate-700">
          <p className="text-lg font-semibold">No {activeFilter} jobs available right now.</p>
          <p className="text-sm text-slate-500 mt-1">Try selecting a different category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map((job, idx) => (
            <div
              key={job._id || idx}
              className="group bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.08}s`,
              }}
            >
              {/* Top Section: Logo & Details */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-100 to-indigo-50 border border-slate-200/60 flex items-center justify-center text-indigo-600 font-bold text-xl shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                  {job.company ? job.company[0].toUpperCase() : 'J'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-[#0f172a] truncate group-hover:text-indigo-600 transition-colors">
                    {job.title}
                  </h3>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 font-medium">
                    <span className="flex items-center gap-1">🏢 {job.company}</span>
                    <span className="flex items-center gap-1">📍 {job.location}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Section: Job Type, Salary & Apply Button */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full w-max mb-1">
                    {job.jobType || 'Full-time'}
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {job.salary || 'Negotiable'}
                  </span>
                </div>

                <button
                  onClick={() => handleApply(job._id)}
                  disabled={userRole === 'recruiter'}
                  className={`px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md transition-all cursor-pointer ${
                    userRole === 'recruiter'
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8] text-white hover:opacity-95 active:scale-95 shadow-indigo-500/20'
                  }`}
                >
                  {userRole === 'recruiter' ? 'Not Allowed' : 'Apply Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrendingJobs;