import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#FBF4F4] py-4 w-full flex justify-center items-center">
      <div className="text-sm">
        <p>
          &#169; DREZZUP. All Rights Reserved.{" "}
          <span className="justify-end">
            Developed by{" "}
            <a
              className="cursor-pointer text-blue-800"
              href="https://princeyekunya.netlify.app/">
              {" "}
              Swift
            </a>{" "}
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
