import React, { useMemo, useRef, useState, useEffect } from 'react';
import { ArrowRight, Building2, Search, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import api from '../api/axios';

function LandingPage() {
  const highlights = [
    'Trusted by recruiters and seekers',
    'Role-based dashboards for every user',
    'Live application tracking and updates',
  ];

  const popularRoles = ['Frontend Developer', 'Backend Engineer', 'Product Designer', 'Data Analyst'];
  const companies = ['TechNova', 'CodeSphere', 'PixelCraft', 'NorthStar'];
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const jobsSectionRef = useRef(null);
  const [jobs, setJobs] = useState([]);

  // Jobs fetch karne ke liye API call (with search keyword query)
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const endpoint = activeQuery ? `/jobs/get-jobs?keyword=${encodeURIComponent(activeQuery)}` : '/jobs/get-jobs';
        const response = await api.get(endpoint);
        setJobs(response.data.jobs || []);
      } catch (error) {
        console.error('Failed to load jobs:', error);
      }
    };

    fetchJobs();
  }, [activeQuery]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.05 });

    const elements = document.querySelectorAll('.scroll-fade, .image-zoom-reveal');
    elements.forEach(el => {
      observer.observe(el);
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('active');
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const visibleJobs = useMemo(() => {
    return jobs.slice(0, 3);
  }, [jobs]);

  const stats = [
    { label: 'Jobs Listed', value: '10k+' },
    { label: 'Active Recruiters', value: '2.5k+' },
    { label: 'Successful Matches', value: '98%' },
  ];
  
  const howItWorks = [
    { title: 'Search smarter', text: 'Find roles by title, company, or location in seconds.' },
    { title: 'Apply instantly', text: 'Start your next move with a single click and a polished flow.' },
    { title: 'Track progress', text: 'Stay updated while recruiters review your application.' },
  ];

  const focusJobsSection = () => {
    jobsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSearch = (value) => {
    const trimmed = value.trim();
    setActiveQuery(trimmed);
    setQuery(trimmed);
    focusJobsSection();
    toast.success(trimmed ? `Showing jobs for “${trimmed}”` : 'Showing featured jobs');
  };

  return (
    <div className="space-y-8 py-2 sm:py-4 overflow-x-hidden">
      <Toaster position="top-right" toastOptions={{ duration: 2200 }} />

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
      `}</style>

      <section className="scroll-fade relative overflow-hidden rounded-[36px] border border-white/20 bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8] p-6 text-black shadow-[0_30px_90px_rgba(15,23,42,0.15)] sm:p-8 lg:p-10">
        <div className="hero-glow" />
        <div className="relative grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="premium-pill mb-4 inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/20 px-3 py-1 text-sm text-black backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Premium Job Portal Experience
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl text-black">
              Build your career with the right opportunities.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-900 font-medium sm:text-lg">
              Discover top roles, connect with hiring teams, and manage every step of your job search from one powerful platform.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                onClick={() => toast.success('Opening registration form')}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 font-semibold text-white shadow-lg transition hover:bg-slate-800"
              >
                Create Account <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                onClick={() => toast.success('Opening login form')}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-black/20 bg-white/20 px-6 py-3.5 font-semibold text-black transition hover:bg-white/30 backdrop-blur"
              >
                Login Now
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {['10k+ live jobs', 'Trusted recruiters', 'Real-time tracking'].map((chip) => (
                <span key={chip} className="rounded-full border border-black/15 bg-white/20 px-3 py-1.5 text-sm text-black backdrop-blur font-medium">
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div className="image-zoom-reveal rounded-[24px] border border-black/15 bg-white/30 p-4 backdrop-blur lg:p-5 shadow-xl">
            <div className="rounded-[20px] bg-white p-4 text-slate-800 shadow-[0_20px_60px_rgba(2,6,23,0.18)]">
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-700">
                <Search className="h-4 w-4" />
                Search Jobs
              </div>
              <form
                className="mt-4 flex flex-col gap-2 sm:flex-row"
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSearch(query);
                }}
              >
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Try Frontend, Mumbai, Remote..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Search
                </button>
              </form>

              <div className="mt-4 rounded-xl border border-slate-200 p-3">
                <p className="text-sm text-slate-500">Popular roles</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {popularRoles.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => {
                        handleSearch(role);
                      }}
                      className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-slate-600">
                {highlights.map((item) => (
                  <div key={item} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs Section Ref for Scrolling */}
      <div ref={jobsSectionRef}></div>

      <section className="scroll-fade grid gap-4 md:grid-cols-3">
        {stats.map((item) => (
          <div key={item.label} className="stat-card card-hover rounded-[24px] border border-slate-200/80 p-5 text-center bg-white shadow-sm">
            <p className="text-3xl font-semibold text-slate-800">{item.value}</p>
            <p className="mt-2 text-sm font-medium text-slate-500">{item.label}</p>
          </div>
        ))}
      </section>

      <section className="image-zoom-reveal section-shell rounded-[28px] bg-white p-5 shadow-[0_20px_55px_rgba(15,23,42,0.08)] sm:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">Top companies hiring now</h2>
            <p className="mt-1 text-sm text-slate-500">Work with teams that value growth, innovation, and impact.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {companies.map((company) => (
              <div key={company} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="scroll-fade grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="section-shell rounded-[28px] bg-white p-6 shadow-sm border border-slate-200/60">
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-700">
            <TrendingUp className="h-4 w-4" />
            Why this platform stands out
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {howItWorks.map((step) => (
              <div key={step.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-lg font-semibold text-slate-800">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="section-shell rounded-[28px] bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8] p-6 text-black shadow-md border border-white/20">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-black">Fast and polished</p>
          <h3 className="mt-3 text-2xl font-semibold text-black">A front end that feels premium from the first click.</h3>
          <p className="mt-3 text-sm leading-7 text-slate-900 font-medium">
            The experience is designed to feel modern, confident, and effortless, with strong visuals and clear next steps for every user.
          </p>
          <Link
            to="/register"
            onClick={() => toast.success('Launching your next step')}
            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 font-semibold text-white transition hover:bg-slate-800 shadow-md"
          >
            Get started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="image-zoom-reveal section-shell rounded-[28px] bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8] p-6 text-black sm:p-8 shadow-xl border border-white/20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex rounded-full border border-black/15 bg-white/20 px-3 py-1 text-sm text-black backdrop-blur">
              <Building2 className="mr-2 h-4 w-4" />
              Built for modern hiring journeys
            </div>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl text-black">Everything a modern job portal should feel like — in one polished experience.</h2>
            <p className="mt-3 text-sm leading-7 text-slate-900 font-medium sm:text-base">
              From search to application tracking, the experience is designed to feel powerful, premium, and effortless for every user.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              to="/register"
              onClick={() => toast.success('Let’s get you started')}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 shadow-md"
            >
              Join Now <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/login" className="inline-flex items-center justify-center rounded-2xl border border-black/20 bg-white/20 px-5 py-3 font-semibold text-black transition hover:bg-white/30 backdrop-blur">
              Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;