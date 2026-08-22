import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const TopTalent = ({ 
  sectionStyle = {}, 
  topTalentSteps = [
    { title: "Post Your Job With Ease", desc: "Tell us about your experience, skills, and what your ideal remote job looks like." },
    { title: "Connect With Verified Talent", desc: "Browse or get matched with professionals ready to start immediately." },
    { title: "Flexible Hiring & Payment", desc: "Choose milestones or hourly rates with secure, hassle-free transactions." }
  ] 
}) => {
  const navigate = useNavigate();

  // LocalStorage se logged-in user check karna
  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = user?.role?.toLowerCase();

  const handleStartHiring = () => {
    // 1. Agar user login nahi hai -> Register page par redirect karo
    if (!user) {
      toast.error("Please register/login first to start hiring!");
      return navigate('/register');
    }

    // 2. Agar user Seeker hai -> Alert/Toast do ki pehle recruiter login karo
    if (userRole === 'seeker') {
      return toast.error("You are logged in as a Seeker. Please login or switch to a Recruiter account to post jobs and hire talent!");
    }

    // 3. Agar user Recruiter hai -> /recruiter dashboard par bhej do
    if (userRole === 'recruiter') {
      toast.success("Welcome back, Recruiter!");
      return navigate('/recruiter');
    }

    // Fallback default case agar role match na ho
    navigate('/login');
  };

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

  return (
    <div style={sectionStyle} className="pt-8 max-w-[85rem] mx-auto px-6">
      <Toaster position="top-right" />
      
      {/* Faster transition and transparent background */}
      <style>{`
        .scroll-fade {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }
        .scroll-fade.active {
          opacity: 1;
          transform: translateY(0);
        }

        .image-zoom-reveal {
          opacity: 0;
          transform: scale(0.9) translateY(20px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }
        .image-zoom-reveal.active {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      `}</style>

      <div className="image-zoom-reveal grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-transparent rounded-[24px] p-8 md:p-12 relative overflow-hidden">
        
        {/* Left Side: Image with floating badges */}
        <div className="scroll-fade relative flex justify-center items-center order-2 lg:order-1">
          <div className="relative w-full max-w-[500px]">
            <img
              src="https://demoapus1.com/jobnetic/wp-content/uploads/2025/10/h61.jpg"
              alt="Top Talent"
              loading="lazy"
              className="w-full h-auto rounded-[20px] shadow-lg object-cover transition-transform duration-400 ease-in-out hover:scale-[1.02]"
            />
            
            {/* Top-Right Floating Badge on Image with smooth bounce/float animation */}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100 animate-[bounce_3s_infinite]">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Samana" 
                alt="User" 
                className="w-10 h-10 rounded-full object-cover border border-indigo-200"
              />
              <div>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider m-0">Verified Talent Hired</p>
                <h5 className="text-xs font-bold text-[#0A2540] m-0">Top Talent Hired</h5>
              </div>
            </div>

            {/* Bottom-Left Floating Card on Image */}
            <div className="absolute -bottom-6 left-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100 max-w-[240px]">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Liam" 
                alt="Liam Carter" 
                className="w-12 h-12 rounded-full object-cover border border-indigo-200"
              />
              <div>
                <h5 className="text-xs font-bold text-[#0A2540] m-0">Liam Carter</h5>
                <p className="text-[11px] text-slate-500 m-0">Senior React Developer</p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-600 font-semibold">
                  <span className="text-emerald-600">⚡ $18/Hr</span>
                  <span>📍 New York</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Content & Steps */}
        <div className="scroll-fade order-1 lg:order-2 relative">
          
          {/* 3D Animated Image at Top-Right of the text section */}
          <div className="absolute -top-6 right-0 w-24 h-24 pointer-events-none z-10">
            <img 
              src="/animated image.png" 
              alt="Decoration" 
              className="w-full h-full object-contain drop-shadow-md animate-pulse"
            />
          </div>

          <h2 className="text-[2.2rem] font-bold text-[#0A2540] leading-tight pr-16">Find Top Talent Fast & Hassle-Free</h2>
          <p className="text-[#5E6D77] mt-3 mb-8 text-[1.05rem]">Access a Global Pool of Verified Freelancers Ready To Deliver Quality Work On Time and On Budget.</p>
          
          <div className="flex flex-col gap-4">
            {topTalentSteps.map((item, i) => (
              <div
                key={i}
                className="flex gap-4 items-start p-4 rounded-xl transition-all duration-300 ease-in-out cursor-default hover:bg-[#f8fafc] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] border border-transparent hover:border-slate-100"
              >
                <span className="bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8] text-black w-7 h-7 rounded-full flex items-center justify-center font-bold text-[0.9rem] shrink-0 mt-0.5 shadow-sm">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-[#0A2540] m-0 text-base">{item.title}</h4>
                    <span className="text-slate-400 text-sm font-light">&#8599;</span>
                  </div>
                  <p className="text-[#5E6D77] text-[0.95rem] mt-1 m-0 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleStartHiring}
            className="mt-8 py-3.5 px-8 bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8] text-black border-none rounded-xl font-semibold text-base cursor-pointer transition-all duration-300 shadow-[0_4px_12px_rgba(60,71,200,0.25)] hover:bg-[#0a2540] hover:text-white hover:scale-[1.02] hover:shadow-[0_8px_20px_rgba(10,37,64,0.3)]"
          >
            Start Hiring Now &rarr;
          </button>
        </div>

      </div>
    </div>
  );
};

export default TopTalent;