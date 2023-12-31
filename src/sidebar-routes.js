// import UserProfile from "views/UserProfile.js";
import Signup from "./components/account/signup.js";
import Login from "./components/account/login.js";
// import AllBookmarksDev from "views/AllBookmarks-dev"
// import AllBookmarks from "views/AllBookmarks"

const sidebarRoutes = [
  // {
  //   path: "/profile",
  //   name: "User Profile",
  //   icon: "nc-icon nc-circle-09",
  //   component: UserProfile,
  //   layout: "/admin"
  // },
  // {
  //   path: "/all-bookmarks",
  //   name: "All Bookmarks",
  //   icon: "nc-icon nc-layers-3",
  //   component: AllBookmarks,
  //   layout: "/admin"
  // },
  {
    path: "/signup",
    name: "Sign Up",
    icon: "",
    component: Signup,
    layout: "/app"
  },
  {
    path: "/login",
    name: "Log In",
    icon: "",
    component: Login,
    layout: "/app"
  }
];

export default sidebarRoutes;
