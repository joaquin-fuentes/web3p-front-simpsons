import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

const LayoutConNav = () => {
  return (
    <div className="d-flex flex-column border-2 alturaMinimaContenedor">
      <Header></Header>
      <main>
        <Outlet></Outlet>
      </main>
      <Footer></Footer>
    </div>
  );
};

export default LayoutConNav;
