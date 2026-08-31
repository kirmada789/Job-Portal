import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const Resume = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.15 });

    const elements = document.querySelectorAll('.scroll-fade');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 🛡️ Recruiter check logic
    const userString = localStorage.getItem('user');
    const currentUser = userString ? JSON.parse(userString) : null;

    if (!currentUser) {
      alert("Please login first to upload your resume.");
      navigate('/login');
      return;
    }

    if (currentUser.role?.trim().toLowerCase() === 'recruiter') {
      alert("Access Denied: You are logged in as a Recruiter. Please login as a Seeker to upload your resume.");
      e.target.value = null; // Clear file input
      return;
    }

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await API.post("/seeker/resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(response.data.message || "Resume uploaded successfully and linked to your profile!");
    } catch (error) {
      console.error("Upload error:", error);
      if (error.response && error.response.status === 401) {
        alert("Please login first to upload your resume.");
        navigate('/login');
      } else {
        alert(error.response?.data?.message || "Failed to upload resume. Please try again.");
      }
    } finally {
      e.target.value = null;
    }
  };

  const handleButtonClick = () => {
    // Click hone se pehle bhi role check kar sakte hain taaki file dialog open hi na ho agar recruiter ho
    const userString = localStorage.getItem('user');
    const currentUser = userString ? JSON.parse(userString) : null;

    if (!currentUser) {
      alert("Please login first to upload your resume.");
      navigate('/login');
      return;
    }

    if (currentUser.role?.trim().toLowerCase() === 'recruiter') {
      alert("Access Denied: You are logged in as a Recruiter. Please login as a Seeker to upload your resume.");
      return;
    }

    fileInputRef.current.click();
  };

  return (
    <div className="py-8">
      
      <style>{`
        .scroll-fade {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 1.5s cubic-bezier(0.16, 1, 0.3, 1), transform 1.5s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }
        .scroll-fade.active {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: "none" }} 
        accept=".pdf,.doc,.docx" 
        onChange={handleFileChange}
      />

      <div className="scroll-fade grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center bg-gradient-to-r from-[#fefefe] to-[#f8fafc] rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm border border-slate-200">
        
        {/* Model Image - Hidden on mobile screens */}
        <div className="hidden md:flex justify-center">
          <img 
            src="/sir4.png"
            alt="Resume Review"
            loading="lazy"
            className="w-full max-w-[400px] object-contain transition-transform duration-300 hover:scale-[1.02]"
          />
        </div>

        <div className="text-left space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-3xl lg:text-[2.5rem] font-bold text-[#0A2540] leading-tight">
            Get a free professional<br />resume review
          </h2>
          <p className="text-[#5E6D77] text-sm sm:text-base leading-relaxed">
            Upload your resume to see how it performs with recruiters and applicant tracking systems.
            Get a personalized score and expert feedback that's fast, free, and actionable.
          </p>
          <button
            onClick={handleButtonClick}
            className="relative isolate overflow-hidden bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8] text-slate-900 font-semibold px-7 py-3.5 rounded-xl text-base shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer flex items-center gap-2"
          >
            <span>Upload Your CV &rarr;</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default Resume;