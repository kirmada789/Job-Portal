import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Shield, BookOpen, PenSquare, X, Check, Code, 
  Trash2, Plus, FileUp, GraduationCap, Briefcase, ExternalLink, Loader2, Phone, Building2, MapPin 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

const ProfilePage = () => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const isRecruiter = user?.role?.toLowerCase() === 'recruiter';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bio: '',
    skills: '',
    github: '',
    portfolio: '',
    company: '',
    location: '',
  });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Experience and Education Lists
  const [experiences, setExperiences] = useState([]);
  const [newExp, setNewExp] = useState({ title: '', company: '', duration: '', description: '' });
  const [showExpForm, setShowExpForm] = useState(false);

  const [educations, setEducations] = useState([]);
  const [newEdu, setNewEdu] = useState({ degree: '', school: '', year: '' });
  const [showEduForm, setShowEduForm] = useState(false);

  // Resumes State
  const [resumes, setResumes] = useState([]);

  // Fetch Profile from Backend on Mount to prevent data loss on refresh
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Backend route: /api/seeker/profile
        const response = await api.get('/seeker/profile');
        const data = response.data.profile;

        if (isRecruiter) {
          const recruiterUser = data?.userId || user;
          setFormData(prev => ({
            ...prev,
            name: recruiterUser?.name || user?.name || '',
            phone: recruiterUser?.phone || user?.phone || '',
            bio: recruiterUser?.bio || user?.bio || 'Authorized Enterprise Recruiter at JobPortal.',
            company: recruiterUser?.company || user?.company || '',
            location: recruiterUser?.location || user?.location || ''
          }));
          return;
        }

        if (data) {
          setUser((prev) => ({
            ...prev,
            fullName: data.userId?.name || prev?.name,
            email: data.userId?.email || prev?.email,
            profile: data
          }));

          setFormData({
            name: data.userId?.name || '',
            phone: data.phone || '',
            bio: data.bio || '',
            skills: Array.isArray(data.skills) ? data.skills.join(', ') : (data.skills || ''),
            github: data.socials?.github || '',
            portfolio: data.socials?.portfolio || '',
            company: '',
            location: '',
          });

          setExperiences(data.experience || []);
          setEducations(data.education || []);

          if (data.resume && data.resume.url) {
            setResumes([{
              id: 'res-db',
              name: data.resume.url.split('/').pop() || 'Resume.pdf',
              url: data.resume.url,
              isDefault: true,
              uploadedAt: new Date().toISOString().split('T')[0]
            }]);
          } else {
            setResumes([]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch profile from database:', err);
      }
    };

    fetchProfile();
  }, [isRecruiter]);

  if (!user) return <div className="p-8 text-center text-slate-600">Please log in to view profile.</div>;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openEdit = () => {
    setIsEditing(true);
    setSuccessMsg('');
    setErrorMsg('');
  };

  // Database Save Handler for General Details & Name update
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const updateData = isRecruiter ? {
        name: formData.name,
        phone: formData.phone,
        bio: formData.bio,
        company: formData.company,
        location: formData.location
      } : {
        name: formData.name,
        phone: formData.phone,
        bio: formData.bio,
        skills: formData.skills ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
        socials: {
          github: formData.github,
          portfolio: formData.portfolio,
        },
        experience: experiences,
        education: educations,
      };

      // Backend route: PUT /api/seeker/profile
      const response = await api.put('/seeker/profile', updateData);

      const updatedUser = {
        ...user,
        fullName: formData.name,
        name: formData.name,
        phone: formData.phone,
        bio: formData.bio,
        company: formData.company,
        location: formData.location,
        profile: response.data.profile
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsSaving(false);
      setIsEditing(false);
      setSuccessMsg('Profile details saved to database successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Database update failed:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to save changes to database.');
      setIsSaving(false);
    }
  };

  // API Upload Resume Handler
  const handleUploadResumeApi = async (file) => {
    if (!file) return;
    setIsUploading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const uploadData = new FormData();
    uploadData.append('resume', file);

    try {
      // Backend route: POST /api/seeker/resume
      const response = await api.post('/seeker/resume', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      const newRes = {
        id: `res-${Date.now()}`,
        name: file.name,
        url: response.data?.resume?.url || '#',
        isDefault: true,
        uploadedAt: new Date().toISOString().split('T')[0]
      };

      setResumes([newRes]);
      
      const updatedUser = {
        ...user,
        profile: { ...user.profile, resume: response.data?.resume }
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      setSuccessMsg(`Resume "${file.name}" uploaded successfully!`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Resume upload API failed:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to upload resume.');
    } finally {
      setIsUploading(false);
    }
  };

  // API Delete Resume Handler
  const handleRemoveResume = async () => {
    try {
      // Backend route: DELETE /api/seeker/resume
      await api.delete('/seeker/resume');

      setResumes([]);
      const updatedUser = {
        ...user,
        profile: { ...user.profile, resume: null }
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      setSuccessMsg('Resume deleted successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Failed to delete resume:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to delete resume.');
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  // --- EXPERIENCE SAVE & DELETE ---
  const handleAddExperience = async (e) => {
    e.preventDefault();
    if (!newExp.title || !newExp.company) return;

    const updatedExperiences = [{ ...newExp }, ...experiences];

    try {
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        bio: formData.bio,
        skills: formData.skills ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
        experience: updatedExperiences,
        education: educations,
        socials: { github: formData.github, portfolio: formData.portfolio }
      };

      await api.put('/seeker/profile', updateData);

      setExperiences(updatedExperiences);
      setNewExp({ title: '', company: '', duration: '', description: '' });
      setShowExpForm(false);
      setSuccessMsg('Experience added & saved directly to database!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Failed to save experience:', err);
      setErrorMsg('Failed to save experience to database.');
    }
  };

  const handleRemoveExperience = async (indexOrId) => {
    const updatedExperiences = experiences.filter((exp, index) => (exp._id || index) !== indexOrId);

    try {
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        bio: formData.bio,
        skills: formData.skills ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
        experience: updatedExperiences,
        education: educations,
        socials: { github: formData.github, portfolio: formData.portfolio }
      };

      await api.put('/seeker/profile', updateData);

      setExperiences(updatedExperiences);
      setSuccessMsg('Experience deleted from database!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Failed to delete experience:', err);
      setErrorMsg('Failed to delete experience.');
    }
  };

  // --- EDUCATION SAVE & DELETE ---
  const handleAddEducation = async (e) => {
    e.preventDefault();
    if (!newEdu.degree || !newEdu.school) return;

    const updatedEducations = [{ ...newEdu }, ...educations];

    try {
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        bio: formData.bio,
        skills: formData.skills ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
        experience: experiences,
        education: updatedEducations,
        socials: { github: formData.github, portfolio: formData.portfolio }
      };

      await api.put('/seeker/profile', updateData);

      setEducations(updatedEducations);
      setNewEdu({ degree: '', school: '', year: '' });
      setShowEduForm(false);
      setSuccessMsg('Education added & saved directly to database!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Failed to save education:', err);
      setErrorMsg('Failed to save education to database.');
    }
  };

  const handleRemoveEducation = async (indexOrId) => {
    const updatedEducations = educations.filter((edu, index) => (edu._id || index) !== indexOrId);

    try {
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        bio: formData.bio,
        skills: formData.skills ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
        experience: experiences,
        education: updatedEducations,
        socials: { github: formData.github, portfolio: formData.portfolio }
      };

      await api.put('/seeker/profile', updateData);

      setEducations(updatedEducations);
      setSuccessMsg('Education deleted from database!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Failed to delete education:', err);
      setErrorMsg('Failed to delete education.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-8 px-3 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl relative"
      >
        {/* Gradient Banner */}
        <div className="h-36 sm:h-40 bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.2),transparent)]" />
        </div>

        {/* Edit Button Top-Right */}
        <div className="absolute top-4 right-4 sm:right-6 z-20">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={isEditing ? () => setIsEditing(false) : openEdit}
            className="inline-flex h-9 sm:h-10 items-center justify-center rounded-xl border border-white/30 bg-black/40 backdrop-blur-md hover:bg-black/60 px-3 sm:px-4 text-xs font-bold text-white shadow-md transition-all cursor-pointer gap-1.5"
          >
            {isEditing ? (
              <>
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <PenSquare className="h-4 w-4" />
                <span>Edit Profile</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Profile Header Info */}
        <div className="relative px-4 sm:px-6 pb-6 border-b border-slate-200 text-center">
          <div className="-mt-16 shrink-0 mx-auto w-fit relative z-10">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-[#9795f3] to-[#3c47c8] border-4 border-white text-white shadow-xl font-bold text-4xl mx-auto">
              {(formData.name || user.fullName || user.name || 'U').charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="mt-3">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
              {formData.name || user.fullName || user.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 capitalize border border-indigo-200">
                <Shield className="h-3.5 w-3.5" />
                {user.role || 'User'}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 font-medium break-all">
                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                {user.email}
              </span>
              {formData.phone && (
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 font-medium">
                  <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                  {formData.phone}
                </span>
              )}
            </div>
          </div>

          <p className="text-slate-600 text-xs sm:text-sm max-w-2xl leading-relaxed mt-4 mx-auto font-medium px-2">
            {formData.bio || (isRecruiter ? 'Enterprise recruitment manager connecting top talent with global opportunities.' : 'Passionate professional building the future of web apps.')}
          </p>

          {/* Social Links / Recruiter Info */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5 mt-5">
            {isRecruiter ? (
              <>
                {formData.company && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">
                    <Building2 className="h-3.5 w-3.5 text-indigo-600" /> {formData.company}
                  </span>
                )}
                {formData.location && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">
                    <MapPin className="h-3.5 w-3.5 text-indigo-600" /> {formData.location}
                  </span>
                )}
              </>
            ) : (
              <>
                {formData.github && (
                  <a href={formData.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-slate-800 hover:underline">
                    GitHub <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {formData.portfolio && (
                  <a href={formData.portfolio} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 hover:underline">
                    Portfolio <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </>
            )}
          </div>
        </div>

        {/* Profile Body */}
        <div className="p-4 sm:p-8">
          <AnimatePresence>
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 flex items-center gap-2 rounded-xl bg-emerald-50 p-3.5 text-sm font-semibold text-emerald-700 border border-emerald-200 shadow-sm"
              >
                <Check className="h-4 w-4 shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 flex items-center gap-2 rounded-xl bg-red-50 p-3.5 text-sm font-semibold text-red-700 border border-red-200 shadow-sm"
              >
                <span>{errorMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.form
                key="edit-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleFormSubmit}
                className="space-y-6 text-left"
              >
                <h3 className="text-base sm:text-lg font-bold border-b border-slate-200 pb-2 text-slate-800">
                  {isRecruiter ? 'Edit Recruiter & Company Details' : 'Edit Account & Portfolio Details'}
                </h3>
                
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {isRecruiter && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Company Name</label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          placeholder="e.g. Aivon Tech"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Office Location</label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          placeholder="e.g. Ranchi / Remote"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">Biography / Summary</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                      placeholder={isRecruiter ? "Brief overview of your company and hiring focus..." : "Tell recruiters about yourself..."}
                    />
                  </div>

                  {!isRecruiter && (
                    <>
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-sm font-semibold text-slate-700">Skills (Comma separated)</label>
                        <input
                          type="text"
                          name="skills"
                          value={formData.skills}
                          onChange={handleInputChange}
                          placeholder="React, Node.js, Express, MongoDB, Tailwind"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">GitHub URL</label>
                        <input
                          type="url"
                          name="github"
                          value={formData.github}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Portfolio Website</label>
                        <input
                          type="url"
                          name="portfolio"
                          value={formData.portfolio}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full sm:w-auto flex items-center justify-center rounded-xl bg-slate-900 text-white font-bold px-6 h-11 shadow-md hover:bg-slate-800 transition-all disabled:opacity-60 gap-2 cursor-pointer"
                >
                  {isSaving ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="profile-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8 text-left"
              >
                {/* Recruiter View vs Seeker View */}
                {isRecruiter ? (
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                    <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
                      <Building2 className="h-5 w-5 text-indigo-600" />
                      Recruiter Organization Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Organization</p>
                        <p className="font-semibold text-slate-800 mt-1">{formData.company || 'Not Specified'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Office Location</p>
                        <p className="font-semibold text-slate-800 mt-1">{formData.location || 'Not Specified'}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Skills */}
                    <div>
                      <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 mb-3">
                        <Code className="h-5 w-5 text-indigo-600" />
                        Professional Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills ? (
                          formData.skills.split(',').map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center rounded-xl bg-indigo-50 border border-indigo-200 px-3 py-1.5 text-xs sm:text-sm font-semibold text-indigo-700"
                            >
                              {skill.trim()}
                            </span>
                          ))
                        ) : (
                          <p className="text-xs text-slate-500 italic">No skills added yet.</p>
                        )}
                      </div>
                    </div>

                    {/* Resumes */}
                    <div className="pt-6 border-t border-slate-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
                          <BookOpen className="h-5 w-5 text-indigo-600" />
                          <span>My Resume & CV ({resumes.length})</span>
                        </h3>
                      </div>

                      {resumes.length === 0 ? (
                        <p className="text-xs text-slate-500 italic mb-4">No resume uploaded yet. Upload your CV below.</p>
                      ) : (
                        <div className="space-y-3 mb-4">
                          {resumes.map((res) => (
                            <div
                              key={res.id}
                              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-indigo-300 bg-indigo-50/40 shadow-sm"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600 shrink-0">
                                  <BookOpen className="h-5 w-5" />
                                </div>
                                <div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <p className="text-sm font-bold text-slate-900 break-all">{res.name}</p>
                                    <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full border border-indigo-200">
                                      Active Resume
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-500">PDF Document</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 self-end sm:self-center">
                                <button
                                  onClick={handleRemoveResume}
                                  className="h-9 w-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                  title="Delete Resume"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Upload Zone */}
                      <div className="border-2 border-dashed border-slate-300 rounded-2xl p-5 sm:p-6 text-center hover:bg-slate-50 transition-all">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <FileUp className="h-8 w-8 text-slate-400" />
                          <p className="text-sm font-bold text-slate-800">Upload Resume / CV</p>
                          <p className="text-xs text-slate-500">PDF up to 5MB max</p>
                          
                          {isUploading ? (
                            <div className="mt-2 inline-flex items-center gap-2 text-xs font-bold text-indigo-600">
                              <Loader2 className="h-4 w-4 animate-spin" /> Uploading to server...
                            </div>
                          ) : (
                            <label className="mt-2 inline-flex h-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold px-4 hover:bg-indigo-100 transition-all cursor-pointer">
                              + Select Resume File
                              <input 
                                type="file" 
                                accept=".pdf,.doc,.docx" 
                                onChange={(e) => {
                                  if (e.target.files?.[0]) handleUploadResumeApi(e.target.files[0]);
                                }}
                                className="hidden" 
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Work Experience */}
                    <div className="pt-6 border-t border-slate-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
                          <Briefcase className="h-5 w-5 text-indigo-600" />
                          Professional Work Experience
                        </h3>
                        <button
                          onClick={() => setShowExpForm(!showExpForm)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                        >
                          <Plus className="h-4 w-4" /> Add Experience
                        </button>
                      </div>

                      {showExpForm && (
                        <form onSubmit={handleAddExperience} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-4 space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="Job Title (e.g. Frontend Dev)"
                              value={newExp.title}
                              onChange={(e) => setNewExp(prev => ({ ...prev, title: e.target.value }))}
                              required
                              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs"
                            />
                            <input
                              type="text"
                              placeholder="Company Name (e.g. TechNova)"
                              value={newExp.company}
                              onChange={(e) => setNewExp(prev => ({ ...prev, company: e.target.value }))}
                              required
                              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs"
                            />
                            <input
                              type="text"
                              placeholder="Duration (e.g. 2024 - Present)"
                              value={newExp.duration}
                              onChange={(e) => setNewExp(prev => ({ ...prev, duration: e.target.value }))}
                              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:col-span-2"
                            />
                          </div>
                          <textarea
                            placeholder="Role responsibilities..."
                            rows="2"
                            value={newExp.description}
                            onChange={(e) => setNewExp(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs"
                          />
                          <div className="flex gap-2 justify-end">
                            <button type="button" onClick={() => setShowExpForm(false)} className="h-8 px-3 rounded-xl border border-slate-200 text-xs font-bold bg-white cursor-pointer">Cancel</button>
                            <button type="submit" className="h-8 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer">Add item</button>
                          </div>
                        </form>
                      )}

                      {experiences.length === 0 ? (
                        <p className="text-xs text-slate-500 italic">No experience added yet.</p>
                      ) : (
                        <div className="space-y-3">
                          {experiences.map((exp, index) => (
                            <div key={exp._id || index} className="flex gap-4 p-4 rounded-2xl border border-slate-200 bg-slate-50">
                              <div className="h-9 w-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                                <Briefcase className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-bold text-slate-900 text-sm">{exp.title}</h4>
                                    <p className="text-xs text-slate-500 font-semibold">{exp.company} • {exp.duration}</p>
                                  </div>
                                  <button onClick={() => handleRemoveExperience(exp._id || index)} className="text-slate-400 hover:text-red-600 cursor-pointer">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                                {exp.description && <p className="text-xs text-slate-600 mt-1">{exp.description}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Education History */}
                    <div className="pt-6 border-t border-slate-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
                          <GraduationCap className="h-5 w-5 text-indigo-600" />
                          Education & Academic History
                        </h3>
                        <button
                          onClick={() => setShowEduForm(!showEduForm)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                        >
                          <Plus className="h-4 w-4" /> Add Education
                        </button>
                      </div>

                      {showEduForm && (
                        <form onSubmit={handleAddEducation} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-4 space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <input
                              type="text"
                              placeholder="Degree (e.g. BCA)"
                              value={newEdu.degree}
                              onChange={(e) => setNewEdu(prev => ({ ...prev, degree: e.target.value }))}
                              required
                              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
                            />
                            <input
                              type="text"
                              placeholder="School/College"
                              value={newEdu.school}
                              onChange={(e) => setNewEdu(prev => ({ ...prev, school: e.target.value }))}
                              required
                              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
                            />
                            <input
                              type="text"
                              placeholder="Year (e.g. 2026)"
                              value={newEdu.year}
                              onChange={(e) => setNewEdu(prev => ({ ...prev, year: e.target.value }))}
                              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs"
                            />
                          </div>
                          <div className="flex gap-2 justify-end">
                            <button type="button" onClick={() => setShowEduForm(false)} className="h-8 px-3 rounded-xl border border-slate-200 text-xs font-bold bg-white cursor-pointer">Cancel</button>
                            <button type="submit" className="h-8 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer">Add item</button>
                          </div>
                        </form>
                      )}

                      {educations.length === 0 ? (
                        <p className="text-xs text-slate-500 italic">No education history added yet.</p>
                      ) : (
                        <div className="space-y-3">
                          {educations.map((edu, index) => (
                            <div key={edu._id || index} className="flex gap-4 p-4 rounded-2xl border border-slate-200 bg-slate-50">
                              <div className="h-9 w-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                                <GraduationCap className="h-4 w-4" />
                              </div>
                              <div className="flex-1 flex items-center justify-between">
                                <div>
                                  <h4 className="font-bold text-slate-900 text-sm">{edu.degree}</h4>
                                  <p className="text-xs text-slate-500 font-semibold">{edu.school} • {edu.year}</p>
                                </div>
                                <button onClick={() => handleRemoveEducation(edu._id || index)} className="text-slate-400 hover:text-red-600 cursor-pointer">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;