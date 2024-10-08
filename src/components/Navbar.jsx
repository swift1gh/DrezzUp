import React from "react";
import Search from "../assets/search.svg";
import Cart from "../assets/cart.svg";

const Navbar = () => {
  return (
    <div className="bg-[#FBF4F4] shadow-md">
      <div className=" flex flex-row justify-between items-center px-5 py-2 md:px-14 pt-5">
        <h1 className="font-sans font-semibold text-[15px] md:text-[25px]">
          <span className="text-white bg-black">DREZZ</span>
          UP
        </h1>

        <div className="flex justify-center items-center gap-5">
          <img src={Search} alt="" className="h-4 md:h-6" />
          <img src={Cart} alt="" className="h-4 md:h-6" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
