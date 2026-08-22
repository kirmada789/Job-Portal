import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Sparkles, SlidersHorizontal, ChevronDown, ArrowRight, Star, DollarSign } from 'lucide-react';
import api from '../api/axios';
import Footer from './Footer';

function SeekerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loadingApp, setLoadingApp] = useState(true);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxSalary, setMaxSalary] = useState(5000);
  
  const navigate = useNavigate();

  // Recruiter restriction check
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.role?.trim().toLowerCase() === 'recruiter') {
      alert("Recruiters cannot access the Seeker dashboard!");
      navigate('/recruiter', { replace: true });
    }
  }, [navigate]);

  // Fetch real jobs and seeker's applied applications using backend routes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Jobs
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

        // 2. Fetch Seeker Applications if logged in
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

  // Apply Job function with login & recruiter guards
  const applyJob = async (jobId, jobTitle) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));

      // 1. Agar user login nahi hai -> Login page par redirect karo
      if (!storedUser) {
        alert("Please login first to apply for this job!");
        return navigate('/login');
      }

      // 2. Agar user Recruiter hai -> Apply karne se roko
      if (storedUser.role?.trim().toLowerCase() === 'recruiter') {
        alert("Recruiters are not allowed to apply for jobs!");
        return;
      }

      const userId = storedUser._id || storedUser.id;

      const response = await api.post('/application/apply', { jobId, userId });
      alert(response.data.message || 'Successfully applied to ' + jobTitle);
      
      // Refresh applications list
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
    <div className="min-h-screen flex flex-col justify-between overflow-x-hidden font-sans w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] bg-slate-50 m-0 p-0">
      
      <div className="w-full pb-16 space-y-8 m-0 p-0">
        
        {/* Top Search Hero Section */}
        <div className="bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8] pt-36 pb-32 px-6 sm:px-12 text-center text-slate-900 shadow-md w-full">
          <div className="w-full px-4 sm:px-8">
            <h1 className="text-4xl font-bold sm:text-5xl tracking-tight">Find Your Next Opportunity</h1>
            <p className="mt-3 text-base text-slate-900 font-medium sm:text-lg">
              Discover the best remote and work-from-home jobs at top companies.
            </p>

            <div className="mt-8 flex flex-col md:flex-row items-center gap-3 bg-white p-3 rounded-2xl shadow-xl border border-white/20 w-full max-w-5xl mx-auto">
              <div className="flex items-center gap-2 px-3 py-2 w-full md:w-1/2 border-b md:border-b-0 md:border-r border-slate-200">
                <Search className="h-5 w-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  placeholder="Job title, keywords, or company"
                  className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder-slate-400"
                />
              </div>
              <div className="flex items-center gap-2 px-3 py-2 w-full md:w-1/3">
                <MapPin className="h-5 w-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="City, State or Zip Code"
                  className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder-slate-400"
                />
              </div>
              <button
                onClick={() => {}}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8] text-white px-8 py-3.5 rounded-xl font-semibold text-sm shadow-md hover:opacity-90 transition"
              >
                <Search className="h-4 w-4" /> Search
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="w-full px-6 sm:px-10 lg:px-12 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          
          {/* Left Sidebar Filters */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-[#3c47c8]" /> Filter Jobs
                </h3>
                <span className="text-xs font-semibold text-[#3c47c8] cursor-pointer hover:underline" onClick={() => { setSearchTitle(''); setSearchLocation(''); setSelectedCategory('All'); }}>Reset</span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-3">Job Type / Category</h4>
                <div className="space-y-2 text-sm text-slate-600">
                  {['All', 'Full-time', 'Part-time', 'Remote', 'Contract'].map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer hover:text-slate-900">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(cat)}
                        className="accent-[#3c47c8]"
                      />
                      {cat}
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Sparkles className="h-4 w-4 text-[#3c47c8]" /> Applied Jobs
                  </div>
                  <span className="bg-[#3c47c8] text-white text-xs px-2.5 py-1 rounded-full font-bold">{applications.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Job Cards Grid */}
          <div className="space-y-8 w-full">
            
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-sm font-medium text-slate-600">Showing {filteredJobs.length} results</p>
                <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl cursor-pointer">
                  <span>Sort by: <strong>Default</strong></span>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job, index) => {
                    const applied = applications.some((app) => (app.jobId?._id || app.jobId) === job.id);
                    const avatarUrl = avatars[index % avatars.length];
                    return (
                      <div key={`${job.id}-${index}`} className="card-hover bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col items-center text-center justify-between relative">
                        
                        <div className="w-full flex flex-col items-center">
                          <div className="relative mb-3">
                            <img 
                              src={avatarUrl} 
                              alt={job.company} 
                              loading="lazy"
                              className="h-20 w-20 rounded-full object-cover border-2 border-slate-100 shadow-md"
                            />
                          </div>

                          <h3 className="text-lg font-bold text-slate-900">{job.company}</h3>
                          <p className="text-sm font-medium text-[#3c47c8] mt-0.5">{job.title}</p>
                          <span className="mt-2 rounded-full bg-slate-100 px-3 py-0.5 text-xs font-semibold text-slate-600">{job.type}</span>

                          <div className="mt-5 w-full pt-4 border-t border-slate-100 flex items-center justify-around text-xs font-medium text-slate-600">
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3.5 w-3.5 text-slate-400" /> {job.salary}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-slate-400" /> {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" /> 4.5
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => applyJob(job.id, job.title)}
                          disabled={applied}
                          className={`mt-6 w-full flex items-center justify-center gap-2 rounded-xl py-2.5 font-semibold text-sm transition shadow-sm ${applied ? 'cursor-not-allowed bg-slate-100 text-slate-400' : 'relative isolate overflow-hidden bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8] text-white hover:opacity-90'}`}
                        >
                          {applied ? 'Applied Successfully' : <>Apply Now <ArrowRight className="h-4 w-4" /></>}
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
                    No matching jobs found in the database. Try adjusting your search keywords.
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default SeekerDashboard;