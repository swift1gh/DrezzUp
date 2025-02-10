import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#FBF4F4] py-4 w-full flex justify-between px-4 md:px-10 items-center mt-auto">
      <div className="text-sm">
        <p>&#169;2025 DREZZUP. All Rights Reserved </p>
      </div>
      <span className="flex justify-end text-xs text-gray-500 gap-x-1">
        Developed by
        <a
          className="cursor-pointer text-blue-800"
          href="https://princeyekunya.netlify.app/"
          target="_blank"
          rel="noopener noreferrer">
          Swift
        </a>
      </span>
    </footer>
  );
};

export default Footer;
