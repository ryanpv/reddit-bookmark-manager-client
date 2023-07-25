import React, { useContext, useState, useEffect } from "react"
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
  signOut, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "./user-context.js";

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const { categories, setCategories } = useUserContext();
  const serverUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_SERVER : "http://localhost:7979"
  const [currentUser, setCurrentUser] = useState("")
  const [loading, setLoading] = useState(false)
  const [searchResponse, setSearchResponse] = React.useState([])
  const [categoryIdData, setCategoryIdData] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [bookmarksIndex, setbookmarksIndex] = React.useState(0);
  const [userEmailStore, setUserEmailStore] = useState("")
  const [error, setError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(1)
  
  const navigate = useNavigate();
  const providerGoogle = new GoogleAuthProvider();
  
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
  };

  async function login(email, password) {
    if (loginAttempts > 5 && userEmailStore === email) {
      console.log('too many login attempts');

      await fetch(`${ serverUrl }/disable-user`, { 
        method: 'POST',
        headers: {
          "Content-type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ userEmail: email })
      });
    } else if (userEmailStore !== email) {
      setLoginAttempts(1)
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        setLoginAttempts(1)
        // console.log('user: ', userCredential.user)
        // setCurrentUser(userCredential.user.displayName ? userCredential.user.displayName : userCredential.user.email); 
        navigate('/')
        return userCredential.user
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        console.log('err: ', errorMessage);
        setLoginAttempts((prev) => prev + 1);
        setError(errorMessage);
      });
  };

  async function logout() {
    try {
      await fetch(`${ serverUrl }/logout`, {
        method: "DELETE"
      });
      setCurrentUser("")
      setCategories([])
      setCategoryIdData("")
  
      return signOut(auth)
    } catch (err) {
      console.log(err)
    }
  };

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email)
  };

  function loginWithGoogle(){
    signInWithPopup(auth, providerGoogle)
      .then(async (result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email; // email of user
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
      navigate('/');
  };

  useEffect(() => { 
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          await fetch(`${ serverUrl }/users/login-session`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              "Content-type": "application/json"
            },
            body: JSON.stringify({ accessToken: user._delegate.accessToken, isRegUser: user._delegate.isRegUser })
          });
          setCurrentUser(user._delegate.displayName ? user._delegate.displayName : user._delegate.email)
        } else {
          setCurrentUser("")
        }
        
        setLoading(false)
      } catch (err) {
        console.log("Auth error: ", err)
        setError("Login error")
      }
    });

    return unsubscribe
  }, [serverUrl])


  const value = {
    documentCount: bookmarksIndex,
    setDocumentCount: setbookmarksIndex,
    currentPage,
    setCurrentPage,
    categoryIdData,
    setCategoryIdData,
    searchResponse,
    setSearchResponse,
    currentUser,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    categories,
    setCategories,
    setUserEmailStore,
    error,
    setError
  }

  return (
    <AuthContext.Provider value={value}>
      { !loading && children }
    </AuthContext.Provider>
  )
}
