import React, { useEffect } from 'react';

const FreelancerSection = ({ 
  sectionStyle = {}, 
  freelancerFeatures = [
    { title: "Create a Standout Profile", desc: "Add your best work, skills, and certifications to attract premium clients." },
    { title: "Get Personalized Job Matches", desc: "Receive project suggestions that fit your expertise and preferences." },
    { title: "Apply Instantly", desc: "Send tailored proposals with a single click save time, win more work." },
    { title: "Grow & Get Paid Securely", desc: "Deliver quality work, receive reviews, and enjoy fast, secure payments." }
  ] 
}) => {
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
      
      {/* Scroll animation styles */}
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
        
        {/* Left Side: Text, Features Grid & Buttons */}
        <div className="scroll-fade">
          
          {/* Animated Company Image placed cleanly above the heading without overlapping */}
          <div className="mb-4 w-16 h-16">
            <img 
              src="/animated image.png" 
              alt="Decoration" 
              className="w-full h-full object-contain drop-shadow-md animate-pulse"
            />
          </div>

          <h2 className="text-[2.5rem] font-bold text-[#0A2540] leading-tight">
            Your Next Opportunity, <br />One Click Away
          </h2>
          <p className="text-[#5E6D77] my-4 text-[1.05rem]">
            Showcase Your Skills, Get Matched With Projects You Love, And Build A Successful Freelance Career.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6">
            {freelancerFeatures.map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-transparent transition-all duration-300 ease-in-out cursor-default hover:bg-[#f8fafc] hover:scale-[1.02]"
              >
                <div className="bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8] bg-clip-text text-transparent text-[1.5rem] mb-2 font-bold">&#x2713;</div>
                <h4 className="font-semibold text-[#0A2540] m-0 text-[0.95rem]">{item.title}</h4>
                <p className="text-[0.85rem] text-[#5E6D77] mt-1 m-0 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-4 mt-8 flex-wrap">
            <button
              className="py-3 px-8 bg-gradient-to-r from-[#d3c4f5] via-[#9795f3] to-[#3c47c8] text-black border-none rounded-[10px] font-semibold cursor-pointer transition-all duration-300 shadow-md hover:scale-[1.02] hover:shadow-[0_8px_20px_rgba(60,71,200,0.4)]"
            >
              Start Earning Today &rarr;
            </button>
            <button
              className="py-3 px-8 bg-transparent text-[#635BFF] border-2 border-[#635BFF] rounded-[10px] font-semibold cursor-pointer transition-all duration-300 hover:bg-[#f1f5f9] hover:scale-[1.02]"
            >
              Get Job Alerts
            </button>
          </div>
        </div>

        {/* Right Side: Image matching reference layout */}
        <div className="scroll-fade flex justify-center items-center">
          <div className="relative w-full max-w-[500px]">
            <img
              src="https://demoapus1.com/jobnetic/wp-content/uploads/2025/10/h67.jpg"
              alt="Freelancer"
              loading="lazy"
              className="w-full h-auto rounded-[20px] shadow-lg object-cover transition-transform duration-400 ease-in-out hover:scale-[1.02]"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default FreelancerSection;