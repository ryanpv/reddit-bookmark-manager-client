import React, { useContext } from 'react';

const UserContext = React.createContext();

export function useUserContext() {
  return useContext(UserContext)
}

export function UserProvider({ children }) {  
  const [savedList, setSavedList] = React.useState([]);
  const [categoryContent, setCategoryContent] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [categories, setCategories] = React.useState([]);




  const userContextValue = {
    savedList,
    setSavedList,
    categoryContent,
    setCategoryContent,
    categories,
    setCategories
  }

  return (
    <UserContext.Provider value={userContextValue}>
      { !loading && children}
    </UserContext.Provider>
  )
}
