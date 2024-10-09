import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ Btn, Destination, onClick }) => {
  return (
    <div className="bg-[#FBF4F4] shadow-md fixed top-0 w-full z-50">
      <div className="flex flex-row justify-between items-center px-5 py-2 md:px-14 pt-5 gap-3">
        <h1 className="font-sans font-semibold text-[20px] md:text-[25px] cursor-default">
          <span className="text-white bg-black">DREZZ</span>
          UP
        </h1>

        <div className="flex justify-center items-center gap-5">
          <Link to={Destination}>
            <button
              onClick={onClick}
              className="bg-[#BD815A] p-2 px-3 md:p-3 border rounded-[18px] border-[#00000089]">
              <span className="text-white">{Btn}</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
