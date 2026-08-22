import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Building2, MapPin, IndianRupee, FileText, Sparkles, ArrowLeft, CheckCircle2, Layers, Cpu, Award, Zap } from 'lucide-react';
import api from '../api/axios';
import Footer from './Footer';

function PostJob() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    type: 'Full-time',
    description: '',
    skills: '',
    perks: []
  });

  const availablePerks = [
    'Remote Friendly', 'Flexible Hours', 'Health Insurance', 
    'Stock Options', 'Performance Bonus', 'Learning Stipend'
  ];

  const togglePerk = (perk) => {
    setFormData(prev => ({
      ...prev,
      perks: prev.perks.includes(perk) 
        ? prev.perks.filter(p => p !== perk)
        : [...prev.perks, perk]
    }));
  };

  const saveJob = async () => {
    if (!formData.title.trim() || !formData.company.trim() || !formData.location.trim()) {
      alert('Please fill in all mandatory fields: Job Title, Company Name, and Location.');
      return;
    }

    try {
      const payload = {
        title: formData.title,
        description: `${formData.description}\n\nKey Skills: ${formData.skills}\nPerks: ${formData.perks.join(', ')}`,
        company: formData.company,
        location: formData.location,
        salary: formData.salary,
        jobType: formData.type
      };

      const response = await api.post("/jobs/post-job", payload);

      if (response.data.success) {
        alert("Job vacancy published successfully!");
        navigate('/recruiter');
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to publish job. Please ensure you are logged in with recruiter credentials.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-slate-50 via-indigo-50/10 to-slate-100 font-sans antialiased">
      
      {/* Top Breadcrumb Navigation */}
      <div className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/recruiter')}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors group cursor-pointer"
          >
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" /> Back to Recruiter Command Center
          </button>
          <div className="hidden sm:inline-flex items-center gap-2 text-xs font-bold text-indigo-700 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100 shadow-xs">
            <Sparkles size={14} /> AI-Powered Vacancy Publisher
          </div>
        </div>
      </div>

      {/* Main Large Enterprise Container with Zoom Animation */}
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-12 py-12 w-full animate-in fade-in zoom-in-95 duration-500">
        
        <div className="bg-white rounded-[36px] p-8 sm:p-14 lg:p-16 shadow-[0_25px_60px_rgba(15,23,42,0.08)] border border-slate-200/80 relative overflow-hidden">
          
          {/* Top Decorative Gradient Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8]"></div>

          {/* Header Section */}
          <div className="mb-12 border-b border-slate-100 pb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-extrabold uppercase tracking-wider mb-4 border border-indigo-100 shadow-xs">
                <Layers size={14} /> Executive Requisition
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">Post New Position</h1>
              <p className="text-base text-slate-500 mt-2 max-w-2xl font-medium">
                Create an immersive job listing equipped with compensation tiers, perk badges, and tech stack filters to attract top-tier global talent.
              </p>
            </div>
            <div className="hidden lg:flex flex-col items-center justify-center p-5 bg-slate-50 rounded-2xl border border-slate-200/60 text-center shrink-0">
              <Zap size={24} className="text-indigo-600 mb-1 animate-pulse" />
              <span className="text-xs font-extrabold text-slate-700 uppercase">High Visibility</span>
              <span className="text-[11px] text-slate-400 font-medium">Broadcasts instantly</span>
            </div>
          </div>

          {/* Form Structure Grid */}
          <div className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Job Title */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                  <Briefcase size={16} className="text-indigo-600" /> Job Title <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                  placeholder="e.g. Senior Fullstack MERN Architect" 
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50/50 px-5 py-4 text-base font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 focus:outline-none transition-all shadow-xs" 
                />
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                  <Building2 size={16} className="text-indigo-600" /> Organization Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={formData.company} 
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })} 
                  placeholder="e.g. Aivon Tech Solutions" 
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50/50 px-5 py-4 text-base font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 focus:outline-none transition-all shadow-xs" 
                />
              </div>

              {/* Salary */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                  <IndianRupee size={16} className="text-indigo-600" /> Compensation Package (Annual)
                </label>
                <input 
                  type="text" 
                  value={formData.salary} 
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })} 
                  placeholder="e.g. ₹12,00,000 - ₹20,00,000" 
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50/50 px-5 py-4 text-base font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 focus:outline-none transition-all shadow-xs" 
                />
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                  <Briefcase size={16} className="text-indigo-600" /> Employment Type
                </label>
                <select 
                  value={formData.type} 
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })} 
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50/50 px-5 py-4 text-base font-semibold text-slate-800 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 focus:outline-none transition-all shadow-xs cursor-pointer"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                  <Award size={16} className="text-indigo-600" /> Experience Requirement
                </label>
                <select className="w-full rounded-2xl border border-slate-300 bg-slate-50/50 px-5 py-4 text-base font-semibold text-slate-800 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 focus:outline-none transition-all shadow-xs cursor-pointer">
                  <option>Entry Level (0 - 1 Years)</option>
                  <option>Mid Level (2 - 5 Years)</option>
                  <option>Senior Level (5+ Years)</option>
                  <option>Lead / Principal Engineer</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                  <MapPin size={16} className="text-indigo-600" /> Work Location <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={formData.location} 
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })} 
                  placeholder="e.g. Remote / Bangalore / Ranchi" 
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50/50 px-5 py-4 text-base font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 focus:outline-none transition-all shadow-xs" 
                />
              </div>

            </div>

            {/* Key Skills Input */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                <Cpu size={16} className="text-indigo-600" /> Key Required Skills (Comma Separated)
              </label>
              <input 
                type="text" 
                value={formData.skills} 
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })} 
                placeholder="e.g. React, Node.js, MongoDB, Tailwind CSS, Git" 
                className="w-full rounded-2xl border border-slate-300 bg-slate-50/50 px-5 py-4 text-base font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 focus:outline-none transition-all shadow-xs" 
              />
            </div>

            {/* Perks & Benefits Chips */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-600" /> Perks & Benefits Offered
              </label>
              <div className="flex flex-wrap gap-2.5">
                {availablePerks.map((perk) => {
                  const isSelected = formData.perks.includes(perk);
                  return (
                    <button
                      key={perk}
                      type="button"
                      onClick={() => togglePerk(perk)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        isSelected 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20' 
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '} {perk}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                <FileText size={16} className="text-indigo-600" /> Detailed Job Description & Requirements
              </label>
              <textarea 
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                placeholder="Elaborate on core responsibilities, expected milestones, team culture, and candidate expectations..." 
                rows="7" 
                className="w-full rounded-2xl border border-slate-300 bg-slate-50/50 px-5 py-4 text-base font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 focus:outline-none transition-all shadow-xs resize-y" 
              />
            </div>

          </div>

          {/* Action Footer Buttons (Original Gradient Preserved) */}
          <div className="mt-12 flex flex-col-reverse sm:flex-row justify-end gap-4 pt-8 border-t border-slate-100">
            <button 
              onClick={() => navigate('/recruiter')} 
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 transition-all text-base cursor-pointer text-center"
            >
              Cancel
            </button>
            <button 
              onClick={saveJob} 
              className="w-full sm:w-auto px-10 py-4 rounded-2xl font-bold bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8] text-white hover:opacity-95 transition-all transform hover:-translate-y-0.5 shadow-xl shadow-indigo-500/25 text-base cursor-pointer text-center inline-flex items-center justify-center gap-2.5"
            >
              <CheckCircle2 size={20} /> Publish Job Vacancy
            </button>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default PostJob;