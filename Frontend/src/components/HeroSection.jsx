import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiZap } from 'react-icons/fi';
import { FaFigma, FaWordpress, FaMedium, FaSketch } from 'react-icons/fa';

const HeroSection = ({ user: propUser }) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Agar prop se user na mile, toh direct localStorage se read kar lega
  const user = propUser || (() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  const userRole = user?.role?.toLowerCase();

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

  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const rect = currentTarget.getBoundingClientRect();
    const x = (clientX - (rect.left + rect.width / 2)) / 15;
    const y = (clientY - (rect.top + rect.height / 2)) / 15;
    setOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div className="min-h-screen bg-transparent font-sans overflow-x-hidden relative">
      
      {/* Ultra slow and buttery-smooth transition styles */}
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

      {/* Background Gradient Blur Blobs */}
      <div 
        className="absolute top-0 right-1/4 w-96 h-96 rounded-full pointer-events-none -z-10" 
        style={{ backgroundColor: '#d3c4f5', filter: 'blur(100px)' }}
      ></div>
      <div 
        className="absolute top-10 left-10 w-96 h-96 rounded-full pointer-events-none -z-10" 
        style={{ backgroundColor: '#eaf0fe', filter: 'blur(100px)' }}
      ></div>
      <div 
        className="absolute top-1/4 right-10 w-80 h-80 rounded-full pointer-events-none -z-10" 
        style={{ backgroundColor: '#9795f3', filter: 'blur(95px)', opacity: 0.5 }}
      ></div>
      <div 
        className="absolute top-1/3 right-1/3 w-80 h-80 rounded-full pointer-events-none -z-10" 
        style={{ backgroundColor: '#3c47c8', filter: 'blur(90px)', opacity: 0.35 }}
      ></div>

      <section id="hero" className="relative pt-12 sm:pt-16 lg:pt-12 pb-20 px-4 sm:px-6 lg:px-12 bg-transparent">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Content - Demo site ki tarah mobile par bhi left-aligned rakha hai */}
          <div className="scroll-fade md:col-span-7 space-y-6 z-10 text-left pr-0 md:pr-8">
            
            <h1 className="text-3xl sm:text-4xl lg:text-[56px] font-bold text-[#0f172a] tracking-tight leading-[1.15]">
              Your Next Role, Just <br className="hidden sm:inline" />
              One Click <span className="inline-flex items-center justify-center bg-white text-[#1e293b] p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl mx-1 align-middle shadow-md border border-slate-100"><FiZap className="w-4 h-4 sm:w-6 sm:h-6 text-[#2563eb]" /></span> Away
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-[#475569] max-w-xl font-normal">
              {userRole === 'recruiter' 
                ? 'Post new job listings and manage applicant submissions smoothly.' 
                : userRole === 'seeker' 
                ? 'Discover jobs that fit your goals and track your applications easily.' 
                : 'Discover Jobs That Fit Your Goals'}
            </p>

            {/* Role-Based Conditioned Action Buttons - Demo site ki tarah proper alignment */}
            <div className="flex flex-row items-center justify-start gap-3 sm:gap-4 pt-2 flex-wrap">
              
              {userRole === 'recruiter' ? (
                <Link 
                  to="/post-job" 
                  className="relative isolate overflow-hidden bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8] text-white font-semibold px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base shadow-md shadow-indigo-500/20 transition-all duration-300 before:absolute before:inset-0 before:bg-[#0a2540] before:opacity-0 before:transition-opacity before:duration-400 before:ease-in-out hover:before:opacity-100 before:-z-10 flex items-center justify-center gap-2"
                >
                  <span className="relative z-10">Post a Job &gt;</span>
                </Link>
              ) : userRole === 'seeker' ? (
                <Link 
                  to="/seeker" 
                  className="relative isolate overflow-hidden bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8] text-white font-semibold px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base shadow-md shadow-indigo-500/20 transition-all duration-300 before:absolute before:inset-0 before:bg-[#0a2540] before:opacity-0 before:transition-opacity before:duration-400 before:ease-in-out hover:before:opacity-100 before:-z-10 flex items-center justify-center gap-2"
                >
                  <span className="relative z-10">Find Your Dream Job &gt;</span>
                </Link>
              ) : (
                <>
                  <Link 
                    to="/seeker" 
                    className="relative isolate overflow-hidden bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8] text-white font-semibold px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base shadow-md shadow-indigo-500/20 transition-all duration-300 before:absolute before:inset-0 before:bg-[#0a2540] before:opacity-0 before:transition-opacity before:duration-400 before:ease-in-out hover:before:opacity-100 before:-z-10 flex items-center justify-center gap-2"
                  >
                    <span className="relative z-10">Find Your Dream Job &gt;</span>
                  </Link>
                  <Link 
                    to="/post-job" 
                    className="relative isolate overflow-hidden bg-white hover:text-white text-[#1e293b] border border-[#e2e8f0] font-medium px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base transition-all duration-300 shadow-sm before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#d3c4f5] before:via-[#9795f3] before:to-[#3c47c8] before:opacity-0 before:transition-opacity before:duration-400 before:ease-in-out hover:before:opacity-100 before:-z-10 flex items-center justify-center gap-2"
                  >
                    <span className="relative z-10">Post a Job &gt;</span>
                  </Link>
                </>
              )}

            </div>

            {/* Trusted Companies */}
            <div className="pt-8 space-y-3">
              <p className="text-[11px] sm:text-[12px] font-medium text-[#64748b] tracking-wider uppercase">
                Trusted by 10.000+ companies worldwide
              </p>
              <div className="flex flex-wrap items-center justify-start gap-4 sm:gap-6 text-[#94a3b8] text-xl sm:text-2xl">
                <FaFigma className="hover:text-[#1e293b] transition cursor-pointer" />
                <FaWordpress className="hover:text-[#1e293b] transition cursor-pointer" />
                <FaMedium className="hover:text-[#1e293b] transition cursor-pointer" />
                <FaSketch className="hover:text-[#1e293b] transition cursor-pointer" />
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#0f172a] text-white flex items-center justify-center text-xs font-bold">in</div>
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#fbbf24] text-[#0f172a] flex items-center justify-center text-xs font-bold">✨</div>
              </div>
            </div>

          </div>

          {/* Right Side 3D Image - 768px se chote screens par hidden */}
          <div 
            className="image-zoom-reveal md:col-span-5 relative hidden md:flex justify-center items-center py-6"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Background Glow */}
            <div className="absolute w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-indigo-500/20 rounded-full blur-3xl -z-10"></div>
            
            <div 
              className="relative w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[580px] aspect-square flex items-center justify-center transition-transform duration-150 ease-out"
              style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
            >
              <img 
                src="/animated image.png" 
                alt="3D Job Portal Banner" 
                className="w-full h-full object-contain drop-shadow-2xl scale-110 lg:scale-120"
              />
            </div>

          </div>

        </div>
      </section>
    </div>
  );
};

export default HeroSection;