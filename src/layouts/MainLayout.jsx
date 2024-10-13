import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Outlet />
      {/* The Outlet is a natural component shows what is inside the MainLayout Router in the App.jsx */}
    </>
  );
};

export default MainLayout;
