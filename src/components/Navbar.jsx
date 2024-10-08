import React from "react";
import Search from "../assets/search.svg";
import Cart from "../assets/cart.svg";

const Navbar = () => {
  return (
    <div className="bg-[#FBF4F4] shadow-md">
      <div className=" flex flex-row justify-between items-center px-5 py-2 md:px-14 pt-5">
        <h1 className="font-sans font-semibold text-[20px] md:text-[25px] cursor-default">
          <span className="text-white bg-black">DREZZ</span>
          UP
        </h1>

        <div className="flex justify-center items-center gap-5">
          <img src={Search} alt="" className="h-5 md:h-6 cursor-pointer" />
          <img src={Cart} alt="" className="h-5 md:h-6 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
