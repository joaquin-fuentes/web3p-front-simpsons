import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const UserRoute = () => {
  const usuarioLogueado = JSON.parse(sessionStorage.getItem("usuario") || null);

  if (usuarioLogueado) {
    return <Outlet></Outlet>;
  } else {
    return <Navigate to="/login"></Navigate>;
  }
};

export default UserRoute;
