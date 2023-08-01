import React from 'react'
import { useAuth } from '../../contexts/auth-context'

export default function HomePage() {
  const { currentUser } = useAuth();

  return (
    <>
      <h1>Reddit Bookmark Manager</h1>
      <p>Organize your saved Reddit posts in custom categories.</p>
      <hr></hr>
      { currentUser === "" ? 
        <p>Start by <a href="/login">logging in</a> or <a href="/sign-up">create an account</a>.</p>
        : <p>View all of your <a href="/user-reddit-posts">Reddit</a> posts and save them to your categories</p>
      }
    </>
  )
}
