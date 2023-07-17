import React, { createContext, useContext } from 'react';

const UserContext = createContext();

export function useRedditAuth() {
  return useContext(UserContext)
}

export function UserProvider({ children }) {  
  const [savedList, setSavedList] = React.useState([]);
  const [categoryContent, setCategoryContent] = React.useState([]);
  const [loading, setLoading] = React.useState();




  const userContextValue = {
    savedList,
    setSavedList,
    categoryContent,
    setCategoryContent
  }

  return (
    <UserContext.Provider value={userContextValue}>
      { !loading && children}
    </UserContext.Provider>
  )
}
