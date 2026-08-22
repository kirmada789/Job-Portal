import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  BriefcaseBusiness, 
  MapPin, 
  Phone, 
  Mail, 
  Send, 
  Apple, 
  Play, 
  Globe, 
  DollarSign, 
  Heart 
} from 'lucide-react';

function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        footer.classList.add('is-visible');
        observer.disconnect();
      }
    }, { threshold: 0.08 });

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={footerRef} className="footer-reveal bg-white text-slate-700 border-t border-slate-200 pt-16 pb-12 font-sans overflow-x-hidden shadow-sm">
      <style>{`
        .footer-reveal {
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 450ms ease-out, transform 450ms ease-out;
        }
        .footer-reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        
        {/* Top Section: Info & Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-slate-200">
          
          {/* Column 1: Company Info */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="group flex items-center gap-2.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8] shadow-md">
                <BriefcaseBusiness className="h-6 w-6 text-white" strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight text-slate-900">
                  Job<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8]">Portal</span>
                </span>
                <span className="text-[10px] font-semibold tracking-widest text-[#3c47c8] uppercase">Jobnetic Edition</span>
              </div>
            </Link>

            <div className="space-y-3 text-sm text-slate-600 font-medium">
              <p className="flex items-start gap-2.5">
                <MapPin className="h-5 w-5 text-[#3c47c8] shrink-0 mt-0.5" />
                <span>Aivon Tech Headquarters,<br />Ranchi, Jharkhand, India.</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#3c47c8] shrink-0" />
                <span>+91 87899 63987</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#3c47c8] shrink-0" />
                <span>support@aivontech.com</span>
              </p>
            </div>

            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-sm font-semibold text-slate-900 mb-2">Join our professional network</p>
              <div className="flex items-center rounded-xl border border-slate-300 bg-slate-50 p-1 max-w-md">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full bg-transparent px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                />
                <button className="bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition shadow-md">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Column 2: Categories */}
          <div>
            <h3 className="text-slate-900 font-bold text-base mb-4 tracking-wide">Browse Jobs</h3>
            <ul className="space-y-2.5 text-sm font-medium text-slate-600">
              <li><Link to="/seeker" className="hover:text-[#3c47c8] transition">All Jobs</Link></li>
              <li><Link to="/seeker" className="hover:text-[#3c47c8] transition">Full-time Roles</Link></li>
              <li><Link to="/seeker" className="hover:text-[#3c47c8] transition">Remote Jobs</Link></li>
              <li><Link to="/seeker" className="hover:text-[#3c47c8] transition">Internships</Link></li>
              <li><Link to="/seeker" className="hover:text-[#3c47c8] transition">Contract Jobs</Link></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="text-slate-900 font-bold text-base mb-4 tracking-wide">Company</h3>
            <ul className="space-y-2.5 text-sm font-medium text-slate-600">
              <li><Link to="/" className="hover:text-[#3c47c8] transition">About Aivon Tech</Link></li>
              <li><Link to="/" className="hover:text-[#3c47c8] transition">Careers</Link></li>
              <li><Link to="/" className="hover:text-[#3c47c8] transition">Success Stories</Link></li>
              <li><Link to="/" className="hover:text-[#3c47c8] transition">Partners</Link></li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h3 className="text-slate-900 font-bold text-base mb-4 tracking-wide">Resources</h3>
            <ul className="space-y-2.5 text-sm font-medium text-slate-600">
              <li><Link to="/" className="hover:text-[#3c47c8] transition">Help Center</Link></li>
              <li><Link to="/" className="hover:text-[#3c47c8] transition">Terms of Service</Link></li>
              <li><Link to="/" className="hover:text-[#3c47c8] transition">Privacy Policy</Link></li>
              <li><Link to="/" className="hover:text-[#3c47c8] transition">Contact Support</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-medium gap-4">
          <p>© 2026 Aivon Tech | Jobnetic Edition. All Rights Reserved</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" />
            <span>by Aivon Tech Team</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;