import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BriefcaseBusiness, Sparkles, Users, X, Edit2, Trash2, Search, CheckCircle2, XCircle, Eye, Mail, Phone, GraduationCap, Briefcase } from 'lucide-react';
import api from '../api/axios';

function RecruiterDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [showAppModal, setShowAppModal] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [searchJobQuery, setSearchJobQuery] = useState('');
  const [searchAppQuery, setSearchAppQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // 1. Fetch Recruiter's Own Jobs & Applications
  useEffect(() => {
    const fetchRecruiterData = async () => {
      try {
        const jobsResponse = await api.get("/jobs/recruiter-jobs");
        if (jobsResponse.data.success) {
          const backendJobs = jobsResponse.data.jobs.map((job) => ({
            id: job._id,
            title: job.title,
            company: job.company,
            location: job.location,
            salary: job.salary,
            type: job.jobType || 'Full-time',
            description: job.description
          }));
          setJobs(backendJobs);
          if (backendJobs.length && !selectedJobId) {
            setSelectedJobId(backendJobs[0].id);
          }

          let accumulatedApps = [];
          for (let job of backendJobs) {
            try {
              const appRes = await api.get(`/application/job/${job.id}`);
              const jobApps = (appRes.data.applications || appRes.data.application || []).map((app) => ({
                id: app._id,
                jobId: app.job,
                applicantName: app.application?.name || app.application?.fullName || app.user?.name || app.userId?.name || 'Candidate',
                email: app.application?.email || app.user?.email || app.userId?.email || 'No email provided',
                phone: app.phone || app.application?.phone || app.user?.phone || 'Not provided',
                bio: app.bio || app.application?.bio || 'No bio provided',
                skills: app.skills || app.application?.skills || [],
                experience: app.experience || app.application?.experience || [],
                education: app.education || app.application?.education || [],
                resume: app.resume || app.application?.resume || '',
                status: app.status || 'Pending'
              }));
              accumulatedApps = [...accumulatedApps, ...jobApps];
            } catch (err) {
              console.error(`Error fetching apps for job ${job.id}`, err);
            }
          }
          setAllApplications(accumulatedApps);
        }
      } catch (err) {
        console.error("Error loading recruiter data:", err);
      }
    };

    fetchRecruiterData();
  }, []);

  // 2. Fetch Applications for selected job pipeline view
  useEffect(() => {
    const fetchJobApplications = async () => {
      if (!selectedJobId) return;
      try {
        const response = await api.get(`/application/job/${selectedJobId}`);
        const appsData = response.data.applications || response.data.application || response.data || [];
        
        const formattedApps = appsData.map((app) => ({
          id: app._id,
          jobId: app.job,
          applicantName: app.application?.name || app.application?.fullName || app.user?.name || app.userId?.name || 'Candidate',
          email: app.application?.email || app.user?.email || app.userId?.email || 'No email provided',
          phone: app.phone || app.application?.phone || app.user?.phone || 'Not provided',
          bio: app.bio || app.application?.bio || 'No bio provided',
          skills: app.skills || app.application?.skills || [],
          experience: app.experience || app.application?.experience || [],
          education: app.education || app.application?.education || [],
          resume: app.resume || app.application?.resume || '',
          status: app.status || 'Pending'
        }));
        setApplications(formattedApps);
      } catch (err) {
        console.error("Error loading applications for job:", err);
      }
    };

    fetchJobApplications();
  }, [selectedJobId]);

  const deleteJob = async (jobId) => {
    try {
      const response = await api.delete(`/jobs/delete-job/${jobId}`);
      
      if (response.data.success) {
        const updatedJobs = jobs.filter((j) => j.id !== jobId);
        setJobs(updatedJobs);
        if (selectedJobId === jobId && updatedJobs.length > 0) {
          setSelectedJobId(updatedJobs[0].id);
        }
        alert("Job deleted successfully from database!");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete job from database.");
    }
    setShowDeleteConfirm(null);
  };

  const viewApplication = (applicationId) => {
    setSelectedAppId(applicationId);
    setShowAppModal(true);
  };

  // 3. Update Application Status API Integration
  const updateStatus = async (applicationId, newStatus) => {
    try {
      const response = await api.patch(`/application/status/${applicationId}/update`, { status: newStatus });
      if (response.data.success || response.status === 200) {
        const updatedApps = applications.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        );
        setApplications(updatedApps);

        const updatedAllApps = allApplications.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        );
        setAllApplications(updatedAllApps);

        alert(`Status updated to ${newStatus} successfully! Email notification sent to candidate.`);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert(error.response?.data?.message || "Failed to update application status.");
    }
  };

  const filteredJobs = jobs.filter((job) =>
    (job.title || '').toLowerCase().includes(searchJobQuery.toLowerCase()) ||
    (job.company || '').toLowerCase().includes(searchJobQuery.toLowerCase()) ||
    (job.location || '').toLowerCase().includes(searchJobQuery.toLowerCase())
  );

  const filteredApplications = applications.filter((app) => {
    const applicantName = app.applicantName || '';
    const applicantEmail = app.email || '';
    const matchesSearch =
      applicantName.toLowerCase().includes(searchAppQuery.toLowerCase()) ||
      applicantEmail.toLowerCase().includes(searchAppQuery.toLowerCase());
    const matchesFilter = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const selectedApp = applications.find((a) => a.id === selectedAppId);

  const stats = [
    { label: 'Open Positions', value: jobs.length, color: 'from-[#3c47c8] to-[#9795f3]', icon: BriefcaseBusiness },
    { label: 'Total Applicants', value: allApplications.length, color: 'from-emerald-500 to-green-600', icon: Users },
    { label: 'Viewed', value: allApplications.filter((app) => app.status === 'Viewed').length, color: 'from-blue-400 to-indigo-500', icon: Eye },
    { label: 'Shortlisted', value: allApplications.filter((app) => app.status === 'Shortlisted').length, color: 'from-purple-500 to-pink-500', icon: Sparkles },
    { label: 'Selected', value: allApplications.filter((app) => app.status === 'Selected').length, color: 'from-emerald-400 to-teal-600', icon: CheckCircle2 },
    { label: 'Rejected', value: allApplications.filter((app) => app.status === 'Rejected').length, color: 'from-red-400 to-rose-600', icon: XCircle },
  ];

  const statusOptions = ['Pending', 'Viewed', 'Shortlisted', 'Selected', 'Rejected'];

  return (
    <div className="min-h-screen flex flex-col justify-between overflow-x-hidden font-sans w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] bg-slate-50 m-0 p-0">
      
      <div className="w-full pb-16 space-y-8 m-0 p-0">
        
        {/* Recruiter Command Center Hero Section */}
        <div className="bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8] pt-36 pb-32 px-6 sm:px-12 text-center text-slate-900 shadow-md w-full">
          <div className="w-full px-4 sm:px-8 max-w-5xl mx-auto flex flex-col items-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/20 px-4 py-1.5 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur-md">
              <BriefcaseBusiness className="h-4 w-4 text-slate-900" />
              Recruiter Command Center
            </div>
            <h1 className="text-4xl font-bold sm:text-5xl tracking-tight text-slate-900">Hire top talent with a premium workflow.</h1>
            <p className="mt-3 text-base text-slate-900 font-medium sm:text-lg max-w-2xl">
              Post roles, review candidates, and manage applications with clarity and speed.
            </p>
            <div className="mt-8">
              <button onClick={() => navigate('/post-job')} className="rounded-xl bg-white px-8 py-3.5 font-semibold text-slate-900 shadow-xl hover:bg-slate-50 transition transform hover:-translate-y-0.5 cursor-pointer">
                + Post New Job
              </button>
            </div>
          </div>
        </div>

        <div className="w-full px-6 sm:px-10 lg:px-12 space-y-8">
          
          {/* Professional Stats Grid */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {stats.map((item) => {
              const IconComponent = item.icon;
              return (
                <div key={item.label} className="card-hover rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.06)] flex flex-col justify-between">
                  <div>
                    <div className={`mb-3 inline-flex p-2 rounded-xl bg-gradient-to-r ${item.color} text-white shadow-sm`}>
                      <IconComponent size={18} />
                    </div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{item.label}</p>
                  </div>
                  <p className="mt-3 text-2xl font-bold text-slate-800">{item.value}</p>
                </div>
              );
            })}
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.06)] sm:p-6">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Applicant Pipeline</h2>
                <p className="text-sm text-slate-500">Select a position to review incoming candidate applications</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 text-sm font-semibold text-indigo-700">
                <Users className="h-4 w-4" />
                {applications.length} candidates for selected role
              </div>
            </div>

            <div className="mb-6 flex flex-wrap gap-2.5">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <div key={job.id} className="group relative">
                    <button
                      onClick={() => setSelectedJobId(job.id)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition shadow-sm cursor-pointer ${selectedJobId === job.id ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                      {job.title} ({job.company})
                    </button>
                    {selectedJobId === job.id && (
                      <div className="absolute right-0 top-full mt-1.5 hidden gap-1.5 rounded-xl bg-white p-2 shadow-xl group-hover:flex z-20 border border-slate-200">
                        <button
                          onClick={() => navigate('/post-job')}
                          className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                        >
                          <Edit2 size={14} /> Edit
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(job.id)}
                          className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No jobs posted yet. Click "+ Post New Job" to get started.</p>
              )}
            </div>

            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1 md:max-w-xs">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search applicants..."
                  value={searchAppQuery}
                  onChange={(e) => setSearchAppQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-10 pr-3 text-sm focus:border-[#3c47c8] focus:ring-1 focus:ring-[#3c47c8] focus:outline-none"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-[#3c47c8] focus:outline-none font-medium text-slate-700 shadow-sm cursor-pointer"
              >
                <option value="All">All Status</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="min-w-full text-sm divide-y divide-slate-200">
                <thead className="bg-slate-50 text-slate-700 font-semibold">
                  <tr>
                    <th className="px-5 py-3.5 text-left">Applicant</th>
                    <th className="px-5 py-3.5 text-left">Status</th>
                    <th className="px-5 py-3.5 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredApplications.length > 0 ? (
                    filteredApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-5 py-4">
                          <div className="font-semibold text-slate-800">{app.applicantName}</div>
                          <div className="text-xs text-slate-500">{app.email}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
                              app.status === 'Rejected'
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : app.status === 'Shortlisted'
                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                : app.status === 'Selected'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : app.status === 'Viewed'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {app.status || 'Pending'}
                          </span>
                        </td>
                        <td className="px-5 py-4 flex items-center gap-3">
                          <button
                            onClick={() => viewApplication(app.id)}
                            className="rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition shadow-sm cursor-pointer"
                          >
                            View Details
                          </button>
                          <select
                            value={app.status || 'Pending'}
                            onChange={(e) => updateStatus(app.id, e.target.value)}
                            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold focus:border-[#3c47c8] focus:outline-none text-slate-700 shadow-sm cursor-pointer"
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-4 py-12 text-center text-slate-400 font-medium">
                        No applications found matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Ultra-Professional Application Details Modal with Soft Tint Backdrop */}
      {showAppModal && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-950/20 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-[32px] bg-white shadow-2xl border border-slate-100 max-h-[92vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 sm:px-8 py-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#3c47c8] to-[#9795f3] flex items-center justify-center text-white font-extrabold text-xl shadow-inner">
                  {selectedApp.applicantName ? selectedApp.applicantName.charAt(0).toUpperCase() : 'C'}
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-wide">{selectedApp.applicantName}</h2>
                  <p className="text-xs text-indigo-200 font-medium flex items-center gap-1.5 mt-0.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block"></span> Candidate Dossier & Evaluation
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAppModal(false);
                  setSelectedAppId(null);
                }}
                className="text-slate-300 hover:text-white p-2 rounded-xl hover:bg-white/10 transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body Scrollable */}
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 bg-slate-50/50">
              
              {/* Contact Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-sm flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                    <Mail size={16} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                    <p className="text-xs font-semibold text-slate-800 truncate mt-0.5">{selectedApp.email}</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-sm flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                    <Phone size={16} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</p>
                    <p className="text-xs font-semibold text-slate-800 truncate mt-0.5">{selectedApp.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Professional Bio */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm space-y-1.5">
                <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
                  Professional Bio / Summary
                </p>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {selectedApp.bio || 'No professional introduction provided.'}
                </p>
              </div>

              {/* Work Experience */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm space-y-3">
                <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase size={14} /> Work Experience
                </p>
                {selectedApp.experience && selectedApp.experience.length > 0 ? (
                  <div className="space-y-3">
                    {selectedApp.experience.map((exp, idx) => (
                      <div key={idx} className="relative pl-4 border-l-2 border-[#3c47c8] pb-2 last:pb-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                          <p className="text-xs font-bold text-slate-900">{exp.title} <span className="text-indigo-600 font-semibold">@ {exp.company}</span></p>
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md w-fit mt-1 sm:mt-0">{exp.duration}</span>
                        </div>
                        {exp.description && <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No professional work experience listed.</p>
                )}
              </div>

              {/* Education */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm space-y-3">
                <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap size={14} /> Education History
                </p>
                {selectedApp.education && selectedApp.education.length > 0 ? (
                  <div className="space-y-3">
                    {selectedApp.education.map((edu, idx) => (
                      <div key={idx} className="relative pl-4 border-l-2 border-emerald-500 pb-2 last:pb-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                          <p className="text-xs font-bold text-slate-900">{edu.degree}</p>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md w-fit mt-1 sm:mt-0">{edu.year}</span>
                        </div>
                        <p className="text-[11px] font-medium text-slate-500 mt-0.5">{edu.school}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No academic history listed.</p>
                )}
              </div>

              {/* Skills & Tech Stack */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm space-y-2">
                <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Skills & Tech Stack</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedApp.skills && selectedApp.skills.length > 0 ? (
                    selectedApp.skills.map((skill, index) => (
                      <span key={index} className="rounded-lg bg-indigo-50/80 border border-indigo-100 px-3 py-1 text-[11px] font-bold text-indigo-700">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No specific skills listed</span>
                  )}
                </div>
              </div>

              {/* Status & Resume Action Footer */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Application Pipeline Status</p>
                  <span
                    className={`inline-block rounded-full px-3.5 py-1 text-xs font-bold shadow-xs ${
                      selectedApp.status === 'Rejected'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : selectedApp.status === 'Shortlisted'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : selectedApp.status === 'Selected'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : selectedApp.status === 'Viewed'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {selectedApp.status || 'Pending'}
                  </span>
                </div>

                {selectedApp.resume ? (
                  <a
                    href={selectedApp.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto text-center rounded-xl bg-gradient-to-r from-[#3c47c8] to-[#9795f3] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:opacity-95 transition cursor-pointer"
                  >
                    View / Download Resume 📄
                  </a>
                ) : (
                  <span className="text-xs font-bold text-red-500 bg-red-50 px-3 py-2 rounded-xl border border-red-100">
                    Resume Not Available
                  </span>
                )}
              </div>

            </div>

            {/* Modal Footer Close Button */}
            <div className="px-6 sm:px-8 py-4 bg-white border-t border-slate-100 shrink-0">
              <button
                onClick={() => {
                  setShowAppModal(false);
                  setSelectedAppId(null);
                }}
                className="w-full rounded-xl bg-slate-100 hover:bg-slate-200 py-3 font-bold text-xs text-slate-700 transition cursor-pointer"
              >
                Close Candidate Dossier
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl border border-slate-100 text-center">
            <h2 className="text-xl font-bold text-slate-800">Delete Job Posting?</h2>
            <p className="mt-2 text-sm text-slate-500">
              Are you sure you want to delete this job posting? This action cannot be undone.
            </p>
            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteJob(showDeleteConfirm)}
                className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 font-semibold text-white transition hover:bg-red-700 shadow-lg shadow-red-500/20 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default RecruiterDashboard;