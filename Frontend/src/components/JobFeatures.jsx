import React, { useEffect } from 'react';
import { FiUsers, FiSearch, FiFileText, FiDollarSign } from 'react-icons/fi';

const JobFeatures = () => {
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

  const features = [
    {
      icon: <FiUsers className="w-7 h-7 text-[#9795f3]" />,
      title: "Join your work community",
      description: "Browse curated listings tailored all in one smart platform."
    },
    {
      icon: <FiSearch className="w-7 h-7 text-[#9795f3]" />,
      title: "Find and apply to jobs",
      description: "Browse curated listings tailored all in one smart platform."
    },
    {
      icon: <FiFileText className="w-7 h-7 text-[#9795f3]" />,
      title: "Search company reviews",
      description: "Browse curated listings tailored all in one smart platform."
    },
    {
      icon: <FiDollarSign className="w-7 h-7 text-[#9795f3]" />,
      title: "Compare salaries",
      description: "Browse curated listings tailored all in one smart platform."
    }
  ];

  return (
    <section className="image-zoom-reveal py-16 px-4 sm:px-6 lg:px-8 bg-transparent border-b border-slate-100">
      
      {/* Ultra-slow and buttery-smooth zoom-in & reveal styles */}
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

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((item, index) => (
          <div key={index} className="space-y-3 text-center lg:text-left p-4">
            <div className="w-14 h-14 bg-gradient-to-r from-[#d3c4f5]/30 via-[#9795f3]/30 to-[#3c47c8]/30 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 shadow-sm">
              {item.icon}
            </div>
            <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default JobFeatures;