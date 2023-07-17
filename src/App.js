import React from "react";
import { useLocation } from 'react-router-dom';
import { auth } from "./firebase";
import AppNavbar from "./components/navbars/navbar.js";
import { useAuth } from "./contexts/auth-context.js";
import { UserProvider } from "./contexts/user-context";
import Sidebar from "./components/sidebar/sidebar";
import sidebarRoutes from "./sidebar-routes";

function App() {
  const [image, setImage] = React.useState();
  const [color, setColor] = React.useState("blue");
  const [hasImage, setHasImage] = React.useState(true);
  const location = useLocation();
  const mainPanel = React.useRef(null);
  const [token, setToken] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [tokauth, setTokAuth] = React.useState(false || window.localStorage.getItem('tokauth') === 'true')
  const { categories, setCategories, categoryIdData } = useAuth();


  return (
    <>
      <UserProvider>
        <Sidebar color={ color} image={ hasImage ? image : "" } routes={ sidebarRoutes }
          categories={ categories } setCategories={ setCategories} />
        <AppNavbar />
      </UserProvider>
    </>

  );
}

export default App;
