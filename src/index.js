import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './contexts/auth-context';
import "bootstrap/dist/css/bootstrap.min.css"; // bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css'; // bootstrap-icons
import AppNavbar from './components/navbars/navbar';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <App /> } />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);
