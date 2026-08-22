import React, { useEffect, useRef, useState } from 'react';

const Categories = ({ 
  categoriesRef, 
  categories = [
    { name: "Graphics & Design", jobs: 4, icon: "🎨" },
    { name: "Digital Marketing", jobs: 4, icon: "📈" },
    { name: "Writing & Translation", jobs: 0, icon: "✍️" },
    { name: "Music & Audio", jobs: 1, icon: "🎵" },
    { name: "Programming & Tech", jobs: 8, icon: "💻" },
    { name: "Video & Animation", jobs: 3, icon: "🎬" }
  ], 
  sectionStyle = {} 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const localRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = categoriesRef || localRef;
    if (currentRef.current) {
      observer.observe(currentRef.current);
    }

    return () => observer.disconnect();
  }, [categoriesRef]);

  const scrollingCategories = [...categories, ...categories, ...categories];

  return (
    <div 
      ref={categoriesRef || localRef} 
      style={sectionStyle}
      className={`pt-8 overflow-hidden bg-white rounded-[24px] mt-8 pb-12 max-w-[85rem] mx-auto px-6 transition-all duration-700 ease-out border border-[#e2e8f0] shadow-lg ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4 px-2">
        <div>
          <h2 className="text-[2.5rem] font-bold text-[#0f172a] m-0">Browse Jobs By Category</h2>
          <p className="text-[1.1rem] text-[#64748b] mt-2 mb-0">Find Jobs from 100+ Categories</p>
        </div>
        <a 
          href="#" 
          className="text-[#2563eb] font-semibold no-underline flex items-center gap-2 transition-colors duration-200 hover:text-[#1d4ed8]"
        >
          Explore All Categories &rarr;
        </a>
      </div>

      <div
        className="flex gap-6 w-max pl-2"
        style={{
          animation: isVisible ? "scrollRightToLeft 25s linear infinite" : "none",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.animationPlayState = "paused"; }}
        onMouseLeave={(e) => { e.currentTarget.style.animationPlayState = "running"; }}
      >
        {scrollingCategories.map((cat, index) => (
          <div
            key={`${cat.name}-${index}`}
            className="bg-[#edf3ff] p-[2rem_2.5rem] rounded-[20px] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.04)] border border-[#d2e3fc] transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer text-center min-w-[220px] shrink-0 hover:shadow-[0_20px_30px_-10px_rgba(37,99,235,0.12)] hover:scale-110 hover:-translate-y-1.5 hover:border-[#2563eb]/40"
          >
            <div className="text-[3rem] drop-shadow-sm">
              {cat.icon}
            </div>
            <h3 className="text-[1.2rem] font-bold mt-3 text-[#0f172a]">
              {cat.name}
            </h3>
            <p className="text-[#2563eb] text-[0.9rem] font-semibold mt-1">
              {cat.jobs} Jobs Available
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;