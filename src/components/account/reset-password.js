import React, { useRef } from 'react'
import { Button, Card, Form, Alert, Container } from 'react-bootstrap';
import { useAuth } from "../../contexts/auth-context.js"
import { Link } from 'react-router-dom';

export default function ResetPassword() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  // const [error, setError] = useState('');
  const { signup, error, setError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      passwordConfirmRef.current.value = null
      passwordRef.current.value = null
      return setError('Passwords do NOT match')
    }

    try {
      setError('')
      await signup(emailRef.current.value, passwordRef.current.value)

    } catch (err) {
      console.log(err);
      setError('Failed to create account with Firebase...')
    }

  }


  return (
    <>
    <Container className="mt-4" style={{ maxWidth: '325px' }}>
      <Card>
        <Card.Body>
          <h2 className='text-center mb-4'>Password Reset</h2>
          { error && <Alert variant='danger'>{ error }</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>

            <Button variant='outline-primary' className='w-100 mt-4'type='submit'>Reset Password</Button>
            <div className='w-100 text-center mt-4'>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>

      <div className='text-center mt-3'>
        <p>Go back to the <Link to='/login'>Login</Link> page</p>
      </div>
    </>
  )
}
