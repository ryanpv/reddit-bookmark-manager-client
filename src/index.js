import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './contexts/auth-context';
import "bootstrap/dist/css/bootstrap.min.css"; // bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css'; // bootstrap-icons
import { UserProvider } from './contexts/user-context';



const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <AuthProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </AuthProvider>
  </BrowserRouter>
);
