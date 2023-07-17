import React, { useRef, useState, useEffect } from "react";
import { useLocation, NavLink, useParams, useNavigate, } from "react-router-dom";
import { Button, Nav, Form } from "react-bootstrap";
// import CategoryList from "./categoryList.js";
import { useAuth } from "../../contexts/auth-context.js";


function Sidebar({ color, image, routes, categories, setCategories }) { // 'routes' parameter is reference to the routes prop from "/Sidebar.js" to share the routes array data
  const location = useLocation();
  const categoryRef = useRef();
  const inputSearch = useRef();
  const navigate = useNavigate();
  const { currentUser, setCurrentPage } = useAuth();
  // console.log("current", currentUser._delegate.uid);
  const token = currentUser && currentUser._delegate.accessToken;
  const newCategory = document.getElementById("new-category");
  const categorySearch = document.getElementById("inputSearch");
  const [confirmValue, setConfirmValue] = useState("");
  const [cat, setCat] = useState({
    userId: "",
    categoryName: "",
    }
  );
  const activeRoute = (routeName) => {
    return location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };
  const [addNewCategory, setAddNewCategory] = useState(true); // to reveal input to add new category
  const [categorySearchState, setCategorySearchState] = useState(true);


//////////////////////////////////////////

  React.useEffect(() => {
    async function getCategoryList(token) {

      if(token) {

      const response = await fetch("https://saveredd-api.onrender.com/categorylist", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const categoryRecords = await response.json();

      await setCategories(categoryRecords)
    } else { 
    // console.log("not logged in/token not fetched yet") 
    }
  } 
    getCategoryList(token)
  }, [confirmValue, token])


  function handleAddCategory(value) {
    return setCat((prevCategories) => {
      return { ...prevCategories, ...value }
    })
  }
  // console.log(cat);

  async function onSubmit(e) {
    e.preventDefault();

    const submitCategoryName = categoryRef.current.value
    const newCat = { ...cat }
// duplicateCheck to see if category name already exists 
    const duplicateCheck = categories.filter(category => category.categoryName.toUpperCase() === newCat.categoryName.toUpperCase() )
// try to refactor to ternary with "false" statements as true
// use sort() method to also display them in order
    if (submitCategoryName === "" || !/\S/.test(submitCategoryName) || submitCategoryName.includes('  ')) {
      categoryRef.current.value = ""
      alert("Please enter a proper category name. Do not include double-spacing.")
      setAddNewCategory(addNewCategory => !addNewCategory)

    } else if (duplicateCheck.length < 1 && newCategory) {

    await fetch("https://saveredd-api.onrender.com/categorylist/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newCat)
    })
    .catch(error => {
      console.log(error);
      return;
    })

    setCat({
      userId: "",
      categoryName: "",
      })
    
    setConfirmValue(newCategory.value)
    setAddNewCategory(addNewCategory => !addNewCategory)
    categoryRef.current.value = ""

  } else {
    categoryRef.current.value = ""
    alert("Category name ALREADY exists.")
    
  }
  
  categoryRef.current.value = null
  }

  function addCategory() {
    setAddNewCategory(addNewCategory => !addNewCategory)
  }

  function searchCategoryList() {
    setCategorySearchState(categoryNameSearch => !categoryNameSearch)
  }

  function submitCategorySearch(e) {
    e.preventDefault();

    const categoryNameId = categories.map(category => category.categoryName)
    // console.log(categoryNameId);

    if (categoryNameId.includes(inputSearch.current.value)) {
      navigate(`/admin/category/${inputSearch.current.value}`)
    } else {
      alert("Search is case-sensitive. Please check spelling.")
    }
    inputSearch.current.value = null
    searchCategoryList() // call the function that reveals state instead of resetting state. any difference???
  }

///////////////////////////////////////////////////////////////////////////////////
  return (
    <>
    <div className="sidebar" data-image={image} data-color={color}>    
      <div className="sidebar-wrapper">
        <div className="logo d-flex align-items-center justify-content-start">
          <span className="simple-text">{ currentUser && currentUser._delegate.email.split('@')[0] }</span>
        </div>

        <Nav>
          {routes.map((prop, key) => {
            if (!prop.redirect)
              return (
                <li
                className={ activeRoute(prop.path) }
                key={key}
                >
                  <NavLink
                    to={prop.layout + prop.path}
                    className="nav-link"
                    // activeClassName="active"
                    >
                    <i className={prop.icon} />
                    <p>{prop.name}</p> 
                    {/* ^^^ renders the 'name' to the sidebar  */}
                  </NavLink>
                </li>
              );

              return null;
            })}

            <div className="text-center">
            { token ? 
            <>
        {/* <div className="text-center">  */}
          { addNewCategory ? 
            <Button size="sm" className="w-75 text-center mt-2 mb-2" variant="outline-light" onClick={addCategory}>+ Add New Category</Button> 
            : 
            <Form onSubmit={onSubmit}>
              <Form.Control maxLength="40" size="sm" id="new-category" ref={categoryRef} type='text' 
              value={cat.categoryName} 
              onChange={ (e) => handleAddCategory({ categoryName: e.target.value }) }
              placeholder="Type New Category Name"
              />
            </Form>
        }
        {/* </div>  */}
        </>
        : null } 
        </div>

        { currentUser ?
        <div className="text-center">
            { categorySearchState ? 
        <Button className="w-75 text-center mt-2 mb-2" size="sm" variant="outline-light" onClick={searchCategoryList}>Search Category List</Button>
        : <Form onSubmit={submitCategorySearch}>
            <Form.Control type="text" list="categoryName" ref={inputSearch} placeholder="Search Category Name" />
          </Form> }
        </div>
        : null }

              {/* must make sure currentUser exists before rendering category list  */}
            {/* {currentUser ? <CategoryList categories={categories} setCategories={setCategories} /> : null} */}
        </Nav>

      </div>

      <datalist id='categoryName'>
      { categories?.map(results => { return (<option key={results._id}>{results.categoryName}</option> ) }) }
    </datalist>

    </div>
    </>
  );
}

export default Sidebar;
