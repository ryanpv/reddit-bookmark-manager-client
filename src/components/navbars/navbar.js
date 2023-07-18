import React from 'react'
import { Button, Container, Form, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { useAuth } from "../../contexts/auth-context.js"
import { Redirect, useNavigate, NavLink } from 'react-router-dom'

export default function AppNavbar() {
  const { currentUser, setSearchResponse, logout, setCurrentPage } = useAuth();
  const token = currentUser && currentUser._delegate.accessToken
  
  const navigate = useNavigate();
  const searchRef = React.useRef('')
  const [searchItem, setSearchItem] = React.useState("")

  async function searchSubmit(e) {
    e.preventDefault();
    // redirect to page with all results
    navigate(`/app/search-results?${searchRef.current.value}`)
    // console.log(searchRef.current.value.split(" "));
    setCurrentPage(1)
    if (searchRef.current.value === "" || !/\S/.test(searchRef.current.value)) 
    { alert("Please type in a search query")
    searchRef.current.value = null
    setSearchItem("")
    
  } else {

    const bookmarkSearch = await fetch(`https://saveredd-api.onrender.com/bookmarks/${searchRef.current.value}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
    const response = await bookmarkSearch.json()
     setSearchResponse(response)
    searchRef.current.value = null
    setSearchItem("")
  }
}


  function handleBookmarkSearch(value) {
    return setSearchItem((prev) => {
      return { ...prev, ...value }
    })
  }

  async function handleLogout(e) {
    e.preventDefault()

    try {
      await logout()
      navigate('/app/login')
    } catch {
      alert('failed to log out')
    }
  }


  return (
    <>
    <Navbar bg="light" expand="lg" fixed='sticky'>
      <Container fluid>
        <a href="/test" className="d-flex align-items-center link-dark text-decoration-none">
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
              onChange={ (e) => handleBookmarkSearch(e.target.value)}
              />
          </Form>
            <Button size="" variant="outline-primary" onClick={(e) => searchSubmit(e)}>Search</Button>

          <Nav
            className="ml-auto"
            // style={{ maxHeight: '50px' }}
            navbarScroll
          >
            { token ? <Button variant="danger" onClick={handleLogout}>Log Out</Button> : <NavLink to="login" >Log in</NavLink> }

          </Nav>
          


        </Navbar.Collapse>
      </Container>
    </Navbar>
    </>
  )
}
