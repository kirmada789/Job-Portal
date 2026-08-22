import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api'; // 👈 Sahi API instance import kiya

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

    try {
      const formData = new FormData();
      formData.append("resume", file);

      // ✅ Ab yeh Render backend par request bhejega aur cookies attach karega
      const response = await API.post("/seeker/resume", formData);

      alert(response.data.message || "Resume uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      if (error.response && error.response.status === 401) {
        alert("Please login first to upload your resume.");
        navigate('/login');
      } else {
        alert(error.response?.data?.message || "Failed to upload resume");
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div style={{ paddingTop: "2rem" }}>
      
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

      <div className="scroll-fade" style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "3rem",
        alignItems: "center",
        background: "linear-gradient(to right, #fefefe, #f8fafc)",
        borderRadius: "24px",
        padding: "3rem",
        boxShadow: "0 10px 35px rgba(15,23,42,0.05)",
        border: "1px solid #e2e8f0"
      }}>
        <div>
          <img className='ml-20'
            src="/sir4.png"
            alt="Resume Review"
            loading="lazy"
            style={{
              width: "100%",
              maxWidth: "500px",
              transition: "transform 0.4s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          />
        </div>
        <div>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 700, color: "#0A2540" }}>
            Get a free professional<br />resume review
          </h2>
          <p style={{ color: "#5E6D77", marginBottom: "2rem", fontSize: "1.05rem", lineHeight: 1.6 }}>
            Upload your resume to see how it performs with recruiters and applicant tracking systems.
            Get a personalized score and expert feedback that's fast, free, and actionable.
          </p>
          <button
            onClick={handleButtonClick}
            className="bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8] text-black font-semibold border-none rounded-[10px] text-base cursor-pointer transition-all duration-300"
            style={{
              padding: "12px 32px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(60,71,200,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Upload Your CV &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Resume;