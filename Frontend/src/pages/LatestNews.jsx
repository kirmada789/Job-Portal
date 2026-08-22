import React from 'react';

const LatestNews = ({ 
  newsRef, 
  newsVisible = true, 
  news = [
    {
      img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
      date: "Dec 24, 2025",
      author: "Ali Tufan",
      title: "12 Walkable Cities Where You Can Live Affordably"
    },
    {
      img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80",
      date: "Dec 24, 2025",
      author: "Ali Tufan",
      title: "Unveils The Best Canadian Cities For Biking"
    },
    {
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
      date: "Dec 24, 2025",
      author: "Ali Tufan",
      title: "Start An Online Business And Work From Home"
    },
    {
      img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80",
      date: "Dec 24, 2025",
      author: "Ali Tufan",
      title: "Front Becomes An Official Instagram Marketing Partner"
    }
  ], 
  sectionStyle = {} 
}) => (
  <div 
    ref={newsRef} 
    style={sectionStyle}
    className="pt-8 max-w-[85rem] mx-auto px-6"
  >
    <div className="flex justify-between items-center mb-2 flex-wrap gap-4 px-2">
      <div>
        <h2 className="text-[2.5rem] font-bold text-[#0A2540] m-0">Latest News</h2>
        <p className="text-[1.1rem] text-[#5E6D77] mt-2 mb-0">People love working with Jobnetic</p>
      </div>
      <a 
        href="#" 
        className="text-[#635BFF] font-semibold no-underline transition-colors duration-200 hover:text-[#3228ff]"
      >
        Explore More &rarr;
      </a>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      {news.map((item, i) => (
        <div
          key={i}
          style={{
            opacity: newsVisible ? 1 : 0,
            transform: newsVisible ? "translateY(0)" : "translateY(30px)",
          }}
          className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.12)] hover:-translate-y-1.5"
        >
          <div className="overflow-hidden h-[200px]">
            <img
              src={item.img}
              alt={item.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-400 ease-in-out hover:scale-105"
            />
          </div>
          <div className="p-[1.2rem_1.5rem]">
            <p className="text-[0.8rem] text-[#94a3b8] m-0">
              {item.date} · By {item.author}
            </p>
            <h4 className="font-semibold text-[#0A2540] mt-2 text-[1rem] leading-[1.4]">
              {item.title}
            </h4>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default LatestNews;