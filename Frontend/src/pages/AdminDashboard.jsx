import React, { useEffect, useState } from 'react';
import { 
  ShieldAlert, Activity, Briefcase, Fingerprint, Power, Zap, Cpu, Globe, 
  Terminal, Server, Building, Search, CreditCard, Map, ChevronDown, Lock 
} from 'lucide-react';
import api from '../api/axios';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [announcement, setAnnouncement] = useState('Initiating global hiring protocols across all secure nodes.');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showAllPartners, setShowAllPartners] = useState(false);
  const [activeTab, setActiveTab] = useState('All'); 
  
  const [terminalLogs, setTerminalLogs] = useState([
    { id: 1, time: '14:02:45', msg: 'Unauthorized access attempt blocked from IP 192.168.X.X', type: 'danger' },
    { id: 2, time: '13:45:10', msg: 'System automated database backup completed successfully.', type: 'success' },
    { id: 3, time: '13:15:00', msg: 'Recruiter profile [TechCorp Inc.] pending manual verification.', type: 'warning' },
  ]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/users');
        setUsers(response.data.users || []);
      } catch (error) {
        console.error('Failed to load users:', error);
      }
    };

    fetchUsers();
    
    // 🚀 ULTIMATE WHITE-SPACE FIX: Forces entire browser viewport to stay dark
    const rootElement = document.getElementById('root');
    const originalHtmlBg = document.documentElement.style.backgroundColor;
    const originalBodyBg = document.body.style.backgroundColor;
    const originalRootBg = rootElement ? rootElement.style.backgroundColor : '';
    const originalRootMinHeight = rootElement ? rootElement.style.minHeight : '';

    document.documentElement.style.backgroundColor = '#030712';
    document.body.style.backgroundColor = '#030712';
    if (rootElement) {
      rootElement.style.backgroundColor = '#030712';
      rootElement.style.minHeight = '100vh';
    }

    // Scroll reveal observer for butter-smooth loading on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.scroll-fade');
    elements.forEach(el => observer.observe(el));

    return () => {
      // Reverts back to normal when leaving the admin page
      document.documentElement.style.backgroundColor = originalHtmlBg;
      document.body.style.backgroundColor = originalBodyBg;
      if (rootElement) {
        rootElement.style.backgroundColor = originalRootBg;
        rootElement.style.minHeight = originalRootMinHeight;
      }
      observer.disconnect();
    };
  }, []);

  const toggleBlock = (userId) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, isBlocked: !user.isBlocked } : user
    );
    setUsers(updatedUsers);
  };

  const handlePublishAnnouncement = () => {
    if (announcement.trim() === '') return;
    const newLog = { 
      id: Date.now(), 
      time: new Date().toLocaleTimeString(), 
      msg: `Broadcast Sent: ${announcement.substring(0, 30)}...`, 
      type: 'info' 
    };
    setTerminalLogs([newLog, ...terminalLogs].slice(0, 5));
    setAnnouncement('');
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' ? true : activeTab === 'Blocked' ? user.isBlocked : !user.isBlocked;
    return matchesSearch && matchesTab;
  });

  const stats = [
    { label: 'Global Network Nodes', value: '14,205', growth: '+12%', color: 'from-cyan-400 to-blue-600', icon: Globe },
    { label: 'Verified Recruiters', value: '3,482', growth: '+8%', color: 'from-fuchsia-500 to-purple-600', icon: Briefcase },
    { label: 'Active Subscriptions', value: '1,290', growth: '+24%', color: 'from-emerald-400 to-teal-500', icon: CreditCard },
    { label: 'Isolated Threats', value: '47', growth: '-2%', color: 'from-rose-500 to-red-600', icon: ShieldAlert },
  ];

  const topPartners = [
    { name: 'TechNova Global', jobs: 342, tier: 'Enterprise', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop' },
    { name: 'Apex Financial', jobs: 156, tier: 'Premium', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop' },
    { name: 'HealthSync Sys', jobs: 89, tier: 'Verified', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop' },
    { name: 'Quantum AI', jobs: 512, tier: 'Enterprise', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop' },
    { name: 'Nexus Logistics', jobs: 210, tier: 'Premium', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600&auto=format&fit=crop' },
    { name: 'CyberShield Sec', jobs: 75, tier: 'Verified', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop' },
  ];

  const regionalTraffic = [
    { region: 'North America', users: '45.2K', load: 85, color: 'bg-cyan-500' },
    { region: 'Europe (EU-Central)', users: '32.8K', load: 65, color: 'bg-purple-500' },
    { region: 'Asia Pacific (APAC)', users: '68.5K', load: 92, color: 'bg-emerald-500' },
    { region: 'Middle East (MENA)', users: '12.4K', load: 45, color: 'bg-amber-500' },
  ];

  const serverNodes = [
    { id: 'US-EAST-1', status: 'Online', cpu: '45%', ram: '12GB' },
    { id: 'EU-WEST-2', status: 'Online', cpu: '62%', ram: '28GB' },
    { id: 'AP-SOUTH-1', status: 'Warning', cpu: '94%', ram: '60GB' },
    { id: 'SA-EAST-1', status: 'Online', cpu: '22%', ram: '8GB' },
  ];

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden font-sans text-slate-300 selection:bg-cyan-500/30 w-full" style={{ backgroundColor: '#030712' }}>
      
      {/* Inline styles for butter-smooth scroll reveal transitions */}
      <style>{`
        .scroll-fade {
          opacity: 0;
          transform: translateY(35px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }
        .scroll-fade.active {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <div className="pointer-events-none fixed -left-[20%] -top-[10%] h-[800px] w-[800px] rounded-full bg-indigo-600/10 blur-[150px]"></div>
      <div className="pointer-events-none fixed -bottom-[20%] -right-[10%] h-[900px] w-[900px] rounded-full bg-cyan-600/10 blur-[150px]"></div>
      <div className="pointer-events-none fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay"></div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col space-y-12 overflow-y-auto p-4 sm:p-6 lg:p-8">
        
        {/* HERO HEADER */}
        <div className="scroll-fade group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/40 p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl transition-all sm:p-12">
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"></div>
          
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                  <Cpu className="h-5 w-5" />
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">JobPortal Omniverse</span>
              </div>
              <h1 className="text-5xl font-black tracking-tighter text-white sm:text-6xl lg:text-7xl">
                Command <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 bg-clip-text text-transparent">Nexus.</span>
              </h1>
              <p className="mt-4 max-w-2xl text-lg font-medium leading-relaxed text-slate-400">
                You have GOD privileges. Monitor live revenue, global traffic, enterprise partners, and isolate network threats in real-time.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-3 pr-6 backdrop-blur-md">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_0_20px_rgba(52,211,153,0.4)]">
                  <Activity className="h-7 w-7 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold uppercase tracking-wider text-slate-400">Network Pulse</div>
                  <div className="flex items-center gap-2 text-2xl font-black text-white">
                    99.9% <span className="flex h-3 w-3 animate-pulse rounded-full bg-emerald-400"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CORE METRICS */}
        <div className="scroll-fade grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item, i) => {
            const Icon = item.icon; 
            return (
              <div key={i} className="group relative overflow-hidden rounded-[2rem] border border-white/5 bg-white/5 p-6 backdrop-blur-xl transition-all hover:-translate-y-2 hover:border-white/10 hover:bg-white/10 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
                <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${item.color} opacity-20 blur-2xl transition-all duration-500 group-hover:opacity-40`}></div>
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} shadow-lg transition-transform group-hover:scale-110`}>
                      <Icon className="h-7 w-7 text-white" strokeWidth={2} />
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${item.growth.includes('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                      {item.growth}
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-4xl font-black text-white">{item.value}</p>
                    <p className="mt-1 text-sm font-bold uppercase tracking-widest text-slate-400">{item.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* GLOBAL TRAFFIC & REVENUE */}
        <div className="scroll-fade grid gap-8 xl:grid-cols-[1.5fr_1fr]">
          <div className="flex flex-col rounded-[2.5rem] border border-white/10 bg-black/40 p-8 backdrop-blur-2xl">
            <div className="mb-8">
              <h2 className="flex items-center gap-3 text-2xl font-black text-white">
                <Map className="h-6 w-6 text-cyan-400" />
                Global Traffic Distribution
              </h2>
              <p className="mt-2 text-sm font-medium text-slate-400">Live active users and server load across regions.</p>
            </div>
            
            <div className="flex-1 space-y-8">
              {regionalTraffic.map((region, idx) => (
                <div key={idx}>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-bold text-white">{region.region}</span>
                    <span className="font-mono text-cyan-400">{region.users} Users</span>
                  </div>
                  <div className="relative h-3 w-full overflow-hidden rounded-full bg-white/5">
                    <div 
                      className={`absolute left-0 top-0 h-full rounded-full ${region.color} shadow-[0_0_15px_currentColor]`}
                      style={{ width: `${region.load}%`, transition: 'width 2s ease-in-out' }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col rounded-[2.5rem] border border-white/10 bg-black/40 p-8 backdrop-blur-2xl">
             <div className="mb-8">
                <h2 className="text-2xl font-black text-white">Financial Matrix</h2>
                <p className="mt-2 text-sm font-medium text-slate-400">Monthly Recurring Revenue (MRR)</p>
              </div>
              <div className="mb-8">
                <span className="text-6xl font-black text-white">$124.5k</span>
                <span className="ml-4 text-lg font-bold text-emerald-400">+14.2%</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-5">
                  <span className="font-bold text-white">Enterprise Plans</span>
                  <span className="font-mono text-lg text-slate-300">$84,000</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-5">
                  <span className="font-bold text-white">Recruiter Pro</span>
                  <span className="font-mono text-lg text-slate-300">$40,500</span>
                </div>
              </div>
          </div>
        </div>

        {/* PREMIUM HIRING PARTNERS */}
        <div className="scroll-fade rounded-[2.5rem] border border-white/10 bg-black/40 p-6 transition-all duration-500 sm:p-10 backdrop-blur-2xl">
          <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-6">
            <div>
              <h2 className="flex items-center gap-3 text-3xl font-black text-white">
                <Building className="h-8 w-8 text-purple-400" />
                Featured Enterprise Partners
              </h2>
            </div>
            
            <button 
              onClick={() => setShowAllPartners(!showAllPartners)}
              className="group flex items-center gap-2 rounded-full bg-cyan-500/10 px-6 py-3 text-sm font-bold text-cyan-400 transition-all hover:bg-cyan-500 hover:text-black active:scale-95"
            >
              {showAllPartners ? 'COLLAPSE LIST' : 'VIEW ALL DIRECTORY'} 
              <ChevronDown className={`h-5 w-5 transition-transform ${showAllPartners ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {(showAllPartners ? topPartners : topPartners.slice(0, 3)).map((partner, idx) => (
              <div 
                key={idx} 
                className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 transition-all duration-500 hover:-translate-y-2 hover:border-purple-500/50 hover:shadow-[0_15px_40px_rgba(168,85,247,0.3)]"
              >
                <div className="absolute inset-0 z-0">
                  <img src={partner.image} alt={partner.name} className="h-full w-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-70" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/80 to-transparent"></div>
                </div>
                <div className="relative z-10 flex h-64 flex-col justify-end p-8">
                  <span className="mb-auto inline-block w-fit rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-purple-300 backdrop-blur-md">
                    {partner.tier}
                  </span>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{partner.name}</h3>
                    <div className="mt-3 flex items-center gap-2 rounded-xl bg-black/50 p-3 w-fit backdrop-blur-md">
                      <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
                      <span className="text-sm font-bold text-slate-200">{partner.jobs} Active Postings</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ENTITY MATRIX */}
        <div className="scroll-fade rounded-[2.5rem] border border-white/10 bg-black/40 p-6 backdrop-blur-2xl sm:p-10">
          <div className="mb-8 flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl font-black text-white">Entity Matrix</h2>
              <div className="mt-2 h-1.5 w-24 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600"></div>
            </div>
            
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/50 p-1">
                {['All', 'Active', 'Blocked'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-lg px-6 py-2.5 text-sm font-bold transition-all ${activeTab === tab ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="relative w-full lg:w-72">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search entities..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/50 py-3 pl-12 pr-4 font-medium text-white outline-none transition-all focus:border-cyan-500"
                />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            {filteredUsers.length === 0 ? (
              <div className="py-10 text-center text-slate-500">No entities found in this sector.</div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.id} className="group flex flex-col justify-between gap-6 rounded-2xl border border-white/5 bg-white/5 p-5 transition-all hover:border-white/20 hover:bg-white/10 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <div className={`absolute -inset-1.5 rounded-full opacity-40 blur-md transition-all group-hover:opacity-100 ${user.isBlocked ? 'bg-rose-500' : 'bg-cyan-400'}`}></div>
                      <img src={`https://ui-avatars.com/api/?name=${user?.fullName}&background=random&color=fff&size=150`} alt={user.fullName} className="relative h-14 w-14 rounded-full border-2 border-[#030712] object-cover" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{user.fullName}</h3>
                      <p className="text-sm font-medium text-slate-400">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <span className="rounded-lg border border-white/10 bg-black/50 px-4 py-1.5 text-xs font-bold text-slate-300">
                      {user.role}
                    </span>
                    <button
                      onClick={() => toggleBlock(user.id)}
                      className={`flex h-12 items-center gap-2 rounded-xl px-6 font-bold uppercase tracking-wide transition-all active:scale-95 ${
                        user.isBlocked 
                          ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-black' 
                          : 'bg-rose-600 text-white hover:bg-rose-500'
                      }`}
                    >
                      <Power className="h-4 w-4" />
                      <span>{user.isBlocked ? 'Authorize' : 'Revoke'}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* CLUSTER INFRASTRUCTURE */}
        <div className="scroll-fade rounded-[2.5rem] border border-white/10 bg-black/40 p-6 backdrop-blur-2xl sm:p-10">
          <div className="mb-8 flex items-center gap-3">
            <Server className="h-8 w-8 text-indigo-400" />
            <h2 className="text-3xl font-black text-white">Cluster Infrastructure</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {serverNodes.map(node => (
              <div key={node.id} className={`rounded-2xl border ${node.status === 'Warning' ? 'border-amber-500/30 bg-amber-500/5' : 'border-white/10 bg-white/5'} p-6`}>
                <div className="mb-6 flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-white">{node.id}</span>
                  <span className={`h-3 w-3 rounded-full ${node.status === 'Warning' ? 'animate-pulse bg-amber-400' : 'bg-emerald-400'}`}></span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold text-slate-400"><span>CPU Usage</span><span className="text-white">{node.cpu}</span></div>
                  <div className="flex justify-between text-xs font-bold text-slate-400"><span>Memory</span><span className="text-white">{node.ram}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TERMINAL & BROADCAST */}
        <div className="scroll-fade grid gap-8 xl:grid-cols-[1fr_1fr]">
          <div className="flex flex-col overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/60 backdrop-blur-3xl">
            <div className="flex items-center justify-between border-b border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-3">
                <Terminal className="h-5 w-5 text-cyan-400" />
                <h2 className="text-lg font-bold uppercase tracking-widest text-white">Sys_Terminal</h2>
              </div>
            </div>
            <div className="flex-1 p-6 font-mono text-sm">
              <div className="space-y-4">
                {terminalLogs.map(log => (
                  <div key={log.id} className={log.type === 'danger' ? 'text-rose-400' : log.type === 'success' ? 'text-emerald-400' : log.type === 'info' ? 'text-cyan-400' : 'text-amber-400'}>
                    {'>'} {log.type === 'danger' ? 'ERRR:' : log.type === 'success' ? 'SYNC:' : log.type === 'info' ? 'EXEC:' : 'WARN:'} {log.msg}
                  </div>
                ))}
                <div className="flex items-center gap-2 pt-4 text-cyan-500">
                  <span>root@nexus-core:~#</span>
                  <span className="h-5 w-2.5 animate-pulse bg-cyan-400"></span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/40 backdrop-blur-2xl">
            <div className="border-b border-white/10 bg-white/5 p-8">
              <h2 className="text-2xl font-black text-white">Global Broadcast</h2>
            </div>
            <div className="flex flex-col p-8">
              <div className="group relative rounded-2xl border border-white/10 bg-black/50 p-1">
                <textarea
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  rows="5"
                  className="mt-2 w-full resize-none bg-transparent p-4 font-mono text-base text-cyan-50 outline-none"
                  placeholder="Enter transmission payload..."
                />
              </div>
              <button 
                onClick={handlePublishAnnouncement}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-5 font-black uppercase tracking-widest text-white transition-all hover:brightness-125 active:scale-95"
              >
                Execute Broadcast
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* FINAL FOOTER */}
      <div className="relative z-20 mt-auto w-full border-t border-white/10 bg-[#030712] p-8 shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-3 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-6 py-3 text-sm font-bold tracking-widest text-emerald-400">
            <Lock className="h-5 w-5" />
            END-TO-END ENCRYPTED CONNECTION
          </div>
          <div className="text-center sm:text-right">
            <div className="text-sm font-bold tracking-widest text-slate-300">JOBPORTAL CORE ADMIN v2.4.0</div>
            <div className="mt-1 flex items-center justify-center gap-2 text-xs font-medium text-slate-500 sm:justify-end">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span> 
              ALL SYSTEMS OPERATIONAL
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default AdminDashboard;