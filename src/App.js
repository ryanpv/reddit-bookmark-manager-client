import React from "react";
import { useLocation, Routes, Route } from 'react-router-dom';
import { auth } from "./firebase";
import AppNavbar from "./components/navbars/navbar.js";
import { useAuth } from "./contexts/auth-context.js";
import { UserProvider } from "./contexts/user-context";
import Sidebar from "./components/sidebar/sidebar.js";
import sidebarRoutes from "./sidebar-routes";
import Signup from "./components/account/signup";
import Login from "./components/account/login";
import ResetPassword from "./components/account/reset-password";
import RedditPosts from "./components/views/reddit-posts";
import LogCallback from "./components/views/log-callback";


function App() {
  const [image, setImage] = React.useState();
  const [color, setColor] = React.useState("blue");
  const [hasImage, setHasImage] = React.useState(true);
  const location = useLocation();
  const mainPanel = React.useRef(null);
  const [token, setToken] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [tokauth, setTokAuth] = React.useState(false || window.localStorage.getItem('tokauth') === 'true')
  const { categories, setCategories, categoryIdData, currentUser } = useAuth();

  return (
    <>
      <div className="App">
      <header className="py-3 mb-4 border-bottom shadow">
        <AppNavbar />
      </header>
          {/* <div className="container-fluid align-items-center d-flex"> */}
      {/* <div className="container-fluid pb-3 flex-grow-1 d-flex flex-column flex-sm-row overflow-auto"> */}
          <div className="row flex-grow-sm-1 flex-grow-0">
        <Sidebar />
          <div className="col overflow-auto h-100">
                <div className="bg-light border rounded-3 p-3">
                  <Routes>
                    <Route path="/user-reddit-posts" element={ <RedditPosts /> } />
                    <Route path="/log_callback" element={ <LogCallback /> } />
                    <Route path="/login" element={ <Login /> } />
                    <Route path="/sign-up" element={ <Signup /> } />
                    <Route path="/forgot-password" element={ <ResetPassword /> } />
                  </Routes>
        
                </div>
              </div>
          </div>
          </div>
      {/* </div> */}
          {/* </div> */}

    </>
  );
}

export default App;