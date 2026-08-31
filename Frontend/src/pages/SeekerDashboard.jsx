import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Sparkles, SlidersHorizontal, ChevronDown, ArrowRight, Star, DollarSign, Briefcase, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';

function SeekerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loadingApp, setLoadingApp] = useState(true);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const navigate = useNavigate();

  // Recruiter restriction check
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.role?.trim().toLowerCase() === 'recruiter') {
      alert("Recruiters cannot access the Seeker dashboard!");
      navigate('/recruiter', { replace: true });
    }
  }, [navigate]);

  // Fetch real jobs and seeker's applied applications
  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobsRes = await api.get('/jobs/get-jobs');
        if (jobsRes.data.success) {
          const formattedJobs = jobsRes.data.jobs.map((job) => ({
            id: job._id,
            title: job.title,
            company: job.company,
            location: job.location,
            type: job.jobType || 'Full-time',
            salary: job.salary || 'Negotiable',
            description: job.description,
            postedBy: job.postedBy
          }));
          setJobs(formattedJobs);
        }

        const storedUser = JSON.parse(localStorage.getItem('user'));
        const userId = storedUser?._id || storedUser?.id;

        if (userId) {
          const appRes = await api.get(`/application/my-applications/${userId}`);
          setApplications(appRes.data.applications || appRes.data || []);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoadingApp(false);
      }
    };

    fetchData();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchTitle = (job.title || '').toLowerCase().includes(searchTitle.toLowerCase()) || 
                         (job.company || '').toLowerCase().includes(searchTitle.toLowerCase());
      const matchLocation = (job.location || '').toLowerCase().includes(searchLocation.toLowerCase());
      const matchCategory = selectedCategory === 'All' || job.type.toLowerCase() === selectedCategory.toLowerCase();
      return matchTitle && matchLocation && matchCategory;
    });
  }, [jobs, searchTitle, searchLocation, selectedCategory]);

  const applyJob = async (jobId, jobTitle) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));

      if (!storedUser) {
        alert("Please login first to apply for this job!");
        return navigate('/login');
      }

      if (storedUser.role?.trim().toLowerCase() === 'recruiter') {
        alert("Recruiters are not allowed to apply for jobs!");
        return;
      }

      const userId = storedUser._id || storedUser.id;

      const response = await api.post('/application/apply', { jobId, userId });
      alert(response.data.message || 'Successfully applied to ' + jobTitle);
      
      const appRes = await api.get(`/application/my-applications/${userId}`);
      setApplications(appRes.data.applications || appRes.data || []);
    } catch (err) {
      console.error("Apply error:", err);
      alert(err.response?.data?.message || 'Failed to apply for job.');
    }
  };

  const avatars = [
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1594744803329-e58b31de8c5f?w=150&auto=format&fit=crop&q=80"
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between overflow-x-hidden font-sans w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] bg-slate-50 m-0 p-0 text-slate-900">
      
      <div className="w-full pb-24 space-y-12 m-0 p-0">
        
        {/* Original Theme Hero Banner with High-End Polish */}
        <div className="bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8] pt-40 pb-36 px-6 sm:px-12 text-center text-slate-900 shadow-xl w-full relative overflow-hidden">
          
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/20 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-indigo-900/10 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 w-full px-4 sm:px-8 max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-xs font-black uppercase tracking-wider text-slate-900 shadow-sm mb-6">
              <Sparkles className="h-3.5 w-3.5 text-[#3c47c8]" /> Jobseeker Portal & Smart Matching
            </div>
            
            <h1 className="text-4xl font-black sm:text-6xl tracking-tight text-slate-900 leading-tight">
              Unlock Your <span className="text-white drop-shadow-sm">Dream Career</span> Today
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-900 font-medium max-w-2xl mx-auto leading-relaxed">
              Discover verified remote & full-time opportunities from top-tier companies with a single click.
            </p>

            {/* Luxury Floating Search Bar */}
            <div className="mt-10 flex flex-col md:flex-row items-center gap-3 bg-white p-3.5 rounded-[28px] shadow-[0_20px_60px_rgba(60,71,200,0.15)] border border-white w-full max-w-4xl mx-auto">
              <div className="flex items-center gap-3 px-4 py-3 w-full md:w-1/2 border-b md:border-b-0 md:border-r border-slate-100">
                <Search className="h-5 w-5 text-[#3c47c8] shrink-0" />
                <input
                  type="text"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  placeholder="Job title, keywords, or company..."
                  className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder-slate-400"
                />
              </div>
              <div className="flex items-center gap-3 px-4 py-3 w-full md:w-1/3">
                <MapPin className="h-5 w-5 text-[#3c47c8] shrink-0" />
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="City, State or Remote"
                  className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder-slate-400"
                />
              </div>
              <button
                onClick={() => {}}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#3c47c8] text-white px-8 py-4 rounded-2xl font-black text-sm shadow-lg shadow-indigo-600/30 hover:bg-[#323ba7] transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Search className="h-4 w-4" /> Find Jobs
              </button>
            </div>
          </div>
        </div>

        {/* Main Layout Container */}
        <div className="w-full px-6 sm:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10 max-w-[1600px] mx-auto">
          
          {/* Left Sticky Filter Panel */}
          <div className="space-y-6">
            <div className="bg-white p-7 rounded-[28px] border border-slate-200/80 shadow-[0_10px_30px_rgba(15,23,42,0.04)] space-y-6 sticky top-28">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-900 flex items-center gap-2 text-sm">
                  <SlidersHorizontal className="h-4 w-4 text-[#3c47c8]" /> Filter Roles
                </h3>
                <span className="text-xs font-bold text-[#3c47c8] hover:underline cursor-pointer" onClick={() => { setSearchTitle(''); setSearchLocation(''); setSelectedCategory('All'); }}>Reset All</span>
              </div>

              <div>
                <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-3.5">Category Type</h4>
                <div className="space-y-3 text-sm font-bold text-slate-600">
                  {['All', 'Full-time', 'Part-time', 'Remote', 'Contract'].map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer hover:text-slate-900 transition">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(cat)}
                        className="accent-[#3c47c8] h-4 w-4 cursor-pointer"
                      />
                      {cat}
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="rounded-2xl bg-gradient-to-r from-indigo-50/80 to-purple-50/80 border border-indigo-100 p-4 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2.5 text-xs font-extrabold text-indigo-950">
                    <Briefcase className="h-4 w-4 text-[#3c47c8]" /> Applied Tracking
                  </div>
                  <span className="bg-[#3c47c8] text-white text-xs px-3 py-1 rounded-full font-black shadow-sm">{applications.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Job Cards Grid */}
          <div className="space-y-6 w-full">
            
            {/* Results Header Bar */}
            <div className="flex items-center justify-between bg-white px-6 py-4 rounded-[24px] border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)]">
              <p className="text-sm font-bold text-slate-600">Showing <span className="text-slate-900 font-black">{filteredJobs.length}</span> active openings</p>
              <div className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl cursor-pointer font-bold shadow-2xs">
                <span>Sort by: <strong>Relevance</strong></span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* Job Cards Modern Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job, index) => {
                  const applied = applications.some((app) => (app.jobId?._id || app.jobId) === job.id);
                  const avatarUrl = avatars[index % avatars.length];
                  return (
                    <div key={`${job.id}-${index}`} className="group bg-white hover:bg-slate-50/30 rounded-[28px] border border-slate-200/90 hover:border-[#3c47c8]/50 p-7 shadow-[0_10px_35px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_50px_rgba(60,71,200,0.08)] flex flex-col items-center text-center justify-between relative transition-all duration-300 hover:-translate-y-1">
                      
                      <div className="w-full flex flex-col items-center">
                        <div className="relative mb-5">
                          <img 
                            src={avatarUrl} 
                            alt={job.company} 
                            loading="lazy"
                            className="h-20 w-20 rounded-2xl object-cover border-2 border-slate-100 shadow-md group-hover:scale-105 transition duration-300"
                          />
                        </div>

                        <h3 className="text-lg font-black text-slate-900 tracking-tight">{job.company}</h3>
                        <p className="text-sm font-extrabold text-[#3c47c8] mt-1">{job.title}</p>
                        <span className="mt-3 rounded-full bg-indigo-50/80 border border-indigo-100 px-4 py-1 text-xs font-black text-[#3c47c8] tracking-wide">{job.type}</span>

                        <div className="mt-6 w-full pt-5 border-t border-slate-100 flex items-center justify-around text-xs font-bold text-slate-600">
                          <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg">
                            <DollarSign className="h-3.5 w-3.5 text-[#3c47c8]" /> {job.salary}
                          </span>
                          <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg">
                            <MapPin className="h-3.5 w-3.5 text-[#3c47c8]" /> {job.location}
                          </span>
                          <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg">
                            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" /> 4.5
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => applyJob(job.id, job.title)}
                        disabled={applied}
                        className={`mt-7 w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 font-black text-xs tracking-wide transition shadow-md cursor-pointer ${applied ? 'cursor-not-allowed bg-slate-100 text-slate-400 shadow-none border border-slate-200' : 'relative isolate overflow-hidden bg-[#3c47c8] text-white hover:bg-[#323ba7] shadow-indigo-600/20'}`}
                      >
                        {applied ? <>Application Submitted <CheckCircle2 className="h-4 w-4" /></> : <>Apply For Position <ArrowRight className="h-4 w-4" /></>}
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full bg-white rounded-[28px] border border-dashed border-slate-300 p-16 text-center text-slate-400 font-bold">
                  No matching jobs found in database. Try modifying your filter criteria.
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}

export default SeekerDashboard;