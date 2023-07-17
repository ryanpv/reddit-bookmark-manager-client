import React, { useRef, useState, useContext } from 'react'
import { Button, Card, Form, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth-context.js';


export default function Login() {
  const emailRef = useRef()
  const passwordRef = useRef()

  const { login, currentUser } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false) // good ux pattern???
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setError('')
      setLoading(true)
      await login(emailRef.current.value, passwordRef.current.value)

      // await auth.currentUser.getIdToken().then(function(idToken) {
      //   // console.log(`User Token: ${idToken}`);
      //   // loginCustomJwt(idToken)
      //   setUser(idToken)
        
      // })
      // openLogin()

      navigate.push('/admin/profile')
    } catch {
      setError('Failed to sign in')
      passwordRef.current.value = null
    }
    setLoading(false)
    emailRef.current.value = null
    passwordRef.current.value = null

  }
  


  return (
    <>{currentUser ? <h2>Logged in as {currentUser.email}</h2> :
    
      <Card>
        <Card.Body>
          <h2 className='text-center mb-4'>Log In</h2>
          {error && <Alert variant='danger'>{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>

            <Button variant="outline-primary" disabled={loading} className='w-100 mt-2' type='submit'>Log In.</Button>
          </Form>

          <div className='w-100 text-center mt-3'>
            <Link to="/admin/forgot-password">Forgot Password?</Link> 
          </div>

        </Card.Body>
      </Card>
      }

      { currentUser ? null : 
      <div className='w-100 text-center mt-2'>
        Need an account? <Link to='/admin/signup'>Sign up</Link>
      </div>
      }
    </>
  )
}

