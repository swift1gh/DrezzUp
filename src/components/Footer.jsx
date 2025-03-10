import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#FBF4F4] py-5 md:py-4 w-full mt-auto border-t border-gray-200 mt-28">
      <div className="container mx-auto px-4 md:px-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start">
            <h1 className="font-sans font-semibold text-[20px] mb-2">
              <span className="text-white bg-black px-1 py-0.5 rounded-sm">
                DREZZ
              </span>
              <span className="text-[#BD815A] font-bold">UP</span>
            </h1>
            <p className="text-sm text-gray-600">Premium Sneaker Collection</p>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <p className="text-sm mb-2">
              &#169;2025 DREZZUP. All Rights Reserved
            </p>
            <span className="flex justify-end text-xs text-gray-500 gap-x-1">
              Developed by
              <a
                className="cursor-pointer text-[#BD815A] hover:text-[#a06b4a] transition-colors duration-200"
                href="https://princeyekunya.netlify.app/"
                target="_blank"
                rel="noopener noreferrer">
                Swift
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
