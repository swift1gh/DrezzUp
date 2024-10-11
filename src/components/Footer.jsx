import React from "react";

const Footer = () => {
  return (
    <div className="w-full flex justify-center items-center bg-[#FBF4F4] py-4">
      <div className="text-sm">
        <p>
          &#169; DREZZUP. All Rights Reserved. Devloped by
          <a
            className="cursor-pointer text-blue-800"
            href="https://princeyekunya.netlify.app/">
            {" "}
            Swift
          </a>
        </p>
      </div>
    </div>
  );
};

export default Footer;
