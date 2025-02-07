import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div
      className="h-full bg-black"
      // style={{ backgroundImage: "url(/src/assets/7.jpg)" }}
    >
      <Outlet />
      {/* The Outlet is a natural component shows what is inside the MainLayout Router in the App.jsx */}
    </div>
  );
};

export default MainLayout;
