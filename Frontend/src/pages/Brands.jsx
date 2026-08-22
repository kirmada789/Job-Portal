import React from 'react';

const Brands = ({ 
  sectionStyle = {}, 
  companies = [
    { name: "Amazon", src: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
    { name: "Spotify", src: "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg" },
    { name: "Netflix", src: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
    { name: "Dropbox", src: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Dropbox_logo_2017.svg" },
    { name: "Google", src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
    { name: "Airbnb", src: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_Bélo.svg" },
    { name: "HubSpot", src: "https://upload.wikimedia.org/wikipedia/commons/3/3f/HubSpot_Logo.svg" },
    { name: "Microsoft", src: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" }
  ] 
}) => (
  <div style={sectionStyle} className="pt-4 pb-8 max-w-7xl mx-auto px-6">
    <p className="text-center text-[#5E6D77] mb-8 text-[1.1rem]">
      Search for 148+ job positions across the world
    </p>
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 items-center justify-between">
      {companies.map((brand, i) => (
        <div
          key={i}
          className="flex justify-center items-center p-2 transition-all duration-300 ease-in-out cursor-default hover:scale-105"
        >
          <img 
            src={brand.src} 
            alt={brand.name} 
            loading="lazy" 
            className="max-h-[30px] w-auto object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      ))}
    </div>
  </div>
);

export default Brands;