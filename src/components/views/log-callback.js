import React from 'react'
// import { useLocation, Redirect } from 'react-router-dom/cjs/react-router-dom.min'
import { useLocation, Navigate } from 'react-router-dom';

export default function LogCallback() {
  const serverUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_SERVER : "http://localhost:7979";
  const location = useLocation();
  
  React.useEffect(() => {
    const code = `${location.search.split('=')[2]}`

    async function redditToken() {
      await fetch(`${ serverUrl }/user-reddit/log_callback?code=${code}`, { credentials:"include" })
    };

    redditToken();
  });

  return (
    <>
    <div>LogCallback</div>
    <Navigate to="/user-reddit-posts" />
    {/* <Redirect to="/user-reddit-posts" />  */}
    </>
  )
}
