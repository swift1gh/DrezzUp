import React from "react";

const Product = ({ Image, Name, Color, Price }) => {
  return (
    <div className="flex justify-center items-center">
      <div className=" border border-black rounded-2xl p-1 md:p-2 bg-white w-[10rem] md:w-[12rem] h-auto">
        <div className="p-1 bg-[#D9D9D9] w-auto h-[7rem] md:h-[8rem] justify-center items-center rounded-2xl shadow-inner border border-[#a3a3a3]">
          <img
            src={Image}
            alt={Name}
            className="h-[-webkit-fill-available] drop-shadow-lg backdrop-blur-3xl"
          />
        </div>
        <div className="flex flex-col py-2">
          <h2 className="uppercase font-bold font-roboto text-[12px] md:text-[16px]">
            {Name}
          </h2>
          <span className="font-thin text-[10px] md:text-[12px]">{Color}</span>
        </div>
        <div className="w-full justify-center items-center text-center md:py-1">
          <span className="font-mono font-semibold text-[12px] md:text-[16px]">
            {Price}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Product;
