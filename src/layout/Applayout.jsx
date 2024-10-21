import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import "../App.css";
const Applayout = () => {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  );
};

export default Applayout;
