import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LogoNav from "./assets/imagenesSimpsons/logo.png";
import HomePage from "./pages/HomePage";
import AppRouter from "./routes/AppRouter";
import "sweetalert2/dist/sweetalert2.min.css";

const App = () => {
  return <AppRouter></AppRouter>;
};

export default App;
