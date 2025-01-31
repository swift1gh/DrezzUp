import React, { useState } from "react";
import { motion } from "motion/react";

const Product = ({
  Image,
  Name,
  Color,
  singlePrice,
  comboPrice,
  isSelected,
  selectProduct,
  loading,
}) => {
  const displayPrice = comboPrice || singlePrice;
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className={`flex justify-center items-center cursor-pointer ${
        isSelected ? "scale-105" : "scale-100"
      } transition-transform duration-100`}
      onClick={selectProduct}>
      <div
        className={`border border-[#474747] md:hover:shadow-2xl rounded-2xl p-[6px] md:p-2 bg-white w-[10rem] md:w-[12rem] h-auto ${
          isSelected
            ? "border-b-4 border-2 border-[#BD815A] md:hover:border-slate-600 shadow-md"
            : ""
        }`}>
        <div className="p-1 bg-[#D9D9D9] w-auto h-[7rem] md:h-[8rem] flex justify-center items-center rounded-2xl shadow-inner border border-[#a3a3a3] relative">
          {(!imageLoaded || loading) && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-10 h-10 border-4 border-gray-300 border-t-gray-400 rounded-full absolute"
            />
          )}
          <img
            src={Image}
            alt={Name}
            className={`h-full object-contain w-full transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(false)} // Handle failed image load
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
            {displayPrice}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Product;
