import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      {/* The Outlet is a natural component shows what is inside the MainLayout Router in the App.jsx */}
    </>
  );
};

export default MainLayout;
