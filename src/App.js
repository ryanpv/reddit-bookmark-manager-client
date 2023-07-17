import React from "react";
import { Routes } from 'react-router-dom';
import { auth } from "./firebase";
import AppNavbar from "./components/navbars/navbar.js";

function App() {
  return (
    <div className="App">
      <AppNavbar />
    </div>
  );
}

export default App;
