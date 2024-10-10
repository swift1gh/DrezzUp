import React from "react";

const Product = ({ Image, Name, Color, Price, isSelected, selectProduct }) => {
  return (
    <div
      className={`flex justify-center items-center cursor-pointer ${
        isSelected ? "scale-110" : "scale-100"
      } transition-transform duration-300`} // Increase size when selected
      onClick={selectProduct}>
      <div
        className={`border border-[#474747]  md:hover:shadow-2xl rounded-2xl p-[6px] md:p-2 bg-white w-[10rem] md:w-[12rem] h-auto ${
          isSelected
            ? "border-b-4 border-2 border-[#464981] md:hover:border-slate-600 shadow-md"
            : ""
        }`}>
        <div className="p-1 bg-[#D9D9D9] w-auto h-[7rem] md:h-[8rem] justify-center items-center rounded-2xl shadow-inner border border-[#a3a3a3]">
          <img
            src={Image}
            alt={Name}
            className="h-[-webkit-fill-available] drop-shadow-lg backdrop-blur-3xl w-full"
          />
        </div>
        <div className="flex flex-col py-2">
          <h2 className="uppercase font-bold font-robotoCondensed text-[12px] md:text-[16px]">
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
