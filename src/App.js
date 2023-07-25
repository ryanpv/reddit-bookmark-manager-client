import React from "react";
import { Routes, Route } from 'react-router-dom';
import AppNavbar from "./components/navbars/navbar.js";
import { useAuth } from "./contexts/auth-context.js";
import Sidebar from "./components/sidebar/sidebar.js";
import Signup from "./components/account/signup";
import Login from "./components/account/login";
import ResetPassword from "./components/account/reset-password";
import RedditPosts from "./components/views/reddit-posts";
import LogCallback from "./components/views/log-callback";
import RedditSearchResults from "./components/views/reddit-search-results";
import CategoryContent from "./components/views/category-content";


function App() {
  const { currentUser } = useAuth();

  return (
    <>
      <div className="App">
      <header className="py-3 mb-4 border-bottom shadow">
        <AppNavbar />
      </header>
          <div className="row flex-grow-sm-1 flex-grow-0">
        <Sidebar />
          <div className="col overflow-auto h-100">
                <div className="bg-light border rounded-3 p-3">
                  <Routes>
                    <Route path="/user-reddit-posts" element={ <RedditPosts /> } />
                    <Route path="/log_callback" element={ <LogCallback /> } />
                    <Route path="/search-results" element={ <RedditSearchResults /> } />
                    { <Route path="/login" element={ <Login /> } /> }
                    <Route path="/sign-up" element={ <Signup /> } />
                    <Route path="/forgot-password" element={ <ResetPassword /> } />
                    { currentUser !== "" ? <Route path="/user/category/:params" element={ <CategoryContent /> } /> : null }
                  </Routes>
        
                </div>
              </div>
          </div>
          </div>

    </>
  );
}

export default App;