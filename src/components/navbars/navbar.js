import React from 'react'
import { Button, Container, Form, Nav, Navbar } from 'react-bootstrap'
import { useAuth } from "../../contexts/auth-context.js"
import { useNavigate, NavLink } from 'react-router-dom'

function AppNavbar() {
  const { currentUser, setSearchResponse, logout, setCurrentPage } = useAuth();
  const serverUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_SERVER : "http://localhost:7979";
  const navigate = useNavigate();
  const searchRef = React.useRef('');

  async function searchSubmit(e) {
    e.preventDefault();
    // redirect to page with all results
    navigate(`/search-results?${searchRef.current.value}`)

    setCurrentPage(1)
    if (searchRef.current.value === "" || !/\S/.test(searchRef.current.value)) { 
      alert("Please type in a search query")
      searchRef.current.value = null

    } else {
      const bookmarkSearch = await fetch(`${ serverUrl }/bookmarker/saved-bookmarks/${ searchRef.current.value }`, {
        credentials: "include",
        headers: {
          "Content-type": "application/json"
        },
      });

      const response = await bookmarkSearch.json()
      setSearchResponse(response)
      searchRef.current.value = null
    }
  };

  async function handleLogout(e) {
    e.preventDefault()
    try {
      await logout()
      navigate('/')
    } catch {
      alert('failed to log out')
    }
  };

  return (
    <>
      <Container fluid>
        <Navbar bg="light" expand="lg" fixed='sticky'>
          <a href="/" className="d-flex align-items-center link-dark text-decoration-none">
            <i className="bi bi-bootstrap fs-2 text-dark"></i>
          </a>
          
          <Navbar.Toggle aria-controls="navbarScroll" />

          <Navbar.Collapse id="navbarScroll">
            <Form className="w-100 me-3" onSubmit={searchSubmit}>
              <Form.Control
                type="search"
                placeholder="Search For Bookmark"
                aria-label="Search"
                ref={searchRef}
                // onChange={ (e) => handleBookmarkSearch(e.target.value)}
                />
            </Form>
              {/* <Button size="" variant="outline-primary" onClick={(e) => searchSubmit(e)}>Search</Button> */}    

            <Nav>
              { currentUser ? 
              <Button variant='link' onClick={(e) => handleLogout(e)}>Log Out</Button>
              :
              <>
              <NavLink to="/login">Log In</NavLink>
              <NavLink to="/sign-up">Sign Up</NavLink> 
              </>
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Container>
    </>
  )
}

export default AppNavbar