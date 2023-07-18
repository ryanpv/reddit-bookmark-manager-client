import React, { useRef, useState, useEffect } from "react";
import { useLocation, NavLink, useParams, useNavigate, } from "react-router-dom";
import { Button, Nav, Form, NavDropdown } from "react-bootstrap";
// import CategoryList from "./categoryList.js";
import { useAuth } from "../../contexts/auth-context.js";
import AppNavbar from "../navbars/navbar.js";


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
      navigate(`/app/category/${inputSearch.current.value}`)
    } else {
      alert("Search is case-sensitive. Please check spelling.")
    }
    inputSearch.current.value = null
    searchCategoryList() // call the function that reveals state instead of resetting state. any difference???
  }

///////////////////////////////////////////////////////////////////////////////////
  return (
    <>
      <header className="py-3 mb-4 border-bottom shadow">
          <div className="container-fluid align-items-center d-flex">
          </div>
          <AppNavbar />
      </header>
      <div className="container-fluid pb-3 flex-grow-1 d-flex flex-column flex-sm-row overflow-auto">
          <div className="row flex-grow-sm-1 flex-grow-0">
              <aside className="col-sm-3 flex-grow-sm-1 flex-shrink-1 flex-grow-0 sticky-top pb-sm-0 pb-3">
                  <div className="bg-light border rounded-3 p-1 h-100 sticky-top">
                      <ul className="nav nav-pills flex-sm-column flex-row mb-auto justify-content-between text-truncate">
                          <li className="nav-item">
                              <a href="#" className="nav-link px-2 text-truncate">
                                  <i className="bi bi-house fs-5"></i>
                                  <span className="d-none d-sm-inline"> Home</span>
                              </a>
                          </li>
                          <li>
                              <a href="#" className="nav-link px-2 text-truncate">
                                  <i className="bi bi-speedometer fs-5"></i>
                                  <span className="d-none d-sm-inline"> Dashboard</span>
                              </a>
                          </li>
                          <li>
                              <a href="#" className="nav-link px-2 text-truncate"><i className="bi bi-card-text fs-5"></i>
                                  <span className="d-none d-sm-inline"> Orders</span> </a>
                          </li>
                          <li>
                              <a href="#" className="nav-link px-2 text-truncate"><i className="bi bi-bricks fs-5"></i>
                                  <span className="d-none d-sm-inline"> Products</span> </a>
                          </li>
                          <li>
                              <a href="#" className="nav-link px-2 text-truncate"><i className="bi bi-people fs-5"></i>
                                  <span className="d-none d-sm-inline"> Customers</span> </a>
                          </li>
                      </ul>

                      <div className="text-center">
                      { addNewCategory ? 
                        <Button size="sm" className="w-75 text-center mt-2 mb-1" variant="outline-primary" onClick={addCategory}>+ Add New Category</Button> 
                        : 
                        <Form onSubmit={onSubmit}>
                          <Form.Control maxLength="40" size="sm" id="new-category" ref={categoryRef} type='text' 
                          value={cat.categoryName} 
                          onChange={ (e) => handleAddCategory({ categoryName: e.target.value }) }
                          placeholder="Type New Category Name"
                          />
                        </Form> }

                        { categorySearchState ? 
                        <Button className="w-75 text-center mt-1 mb-2" size="sm" variant="outline-primary" onClick={searchCategoryList}>Search Category List</Button>
                        : 
                        <Form onSubmit={submitCategorySearch}>
                          <Form.Control type="text" list="categoryName" ref={inputSearch} placeholder="Search Category Name" />
                        </Form> }

                      </div>
                  </div>
              </aside>
              <main className="col overflow-auto h-100">
                  <div className="bg-light border rounded-3 p-3">
                      <h2>Main</h2>
                      <p>Sriracha biodiesel taxidermy organic post-ironic, Intelligentsia salvia mustache 90's code editing brunch. Butcher polaroid VHS art party, hashtag Brooklyn deep v PBR narwhal sustainable mixtape swag wolf squid tote bag. Tote bag cronut semiotics, raw denim deep v taxidermy messenger bag. Tofu YOLO Etsy, direct trade ethical Odd Future jean shorts paleo. Forage Shoreditch tousled aesthetic irony, street art organic Bushwick artisan cliche semiotics ugh synth chillwave meditation. Shabby chic lomo plaid vinyl chambray Vice. Vice sustainable cardigan, Williamsburg master cleanse hella DIY 90's blog.</p>
                      <p>Ethical Kickstarter PBR asymmetrical lo-fi. Dreamcatcher street art Carles, stumptown gluten-free Kickstarter artisan Wes Anderson wolf pug. Godard sustainable you probably haven't heard of them, vegan farm-to-table Williamsburg slow-carb readymade disrupt deep v. Meggings seitan Wes Anderson semiotics, cliche American Apparel whatever. Helvetica cray plaid, vegan brunch Banksy leggings +1 direct trade. Wayfarers codeply PBR selfies. Banh mi McSweeney's Shoreditch selfies, forage fingerstache food truck occupy YOLO Pitchfork fixie iPhone fanny pack art party Portland.</p>
                      <hr />
                      <h4>More content...</h4>
                      <p>Ethical Kickstarter PBR asymmetrical lo-fi. Dreamcatcher street art Carles, stumptown gluten-free Kickstarter artisan Wes Anderson wolf pug. Godard sustainable you probably haven't heard of them, vegan farm-to-table Williamsburg slow-carb readymade disrupt deep v. Meggings seitan Wes Anderson semiotics, cliche American Apparel whatever. Helvetica cray plaid, vegan brunch Banksy leggings +1 direct trade. Wayfarers codeply PBR selfies. Banh mi McSweeney's Shoreditch selfies, forage fingerstache food truck occupy YOLO Pitchfork fixie iPhone fanny pack art party Portland.</p>
                      <hr />
                      <h4>More content...</h4>
                      <p>Sriracha biodiesel taxidermy organic post-ironic, Intelligentsia salvia mustache 90's code editing brunch. Butcher polaroid VHS art party, hashtag Brooklyn deep v PBR narwhal sustainable mixtape swag wolf squid tote bag. Tote bag cronut semiotics, raw denim deep v taxidermy messenger bag. Tofu YOLO Etsy, direct trade ethical Odd Future jean shorts paleo. Forage Shoreditch tousled aesthetic irony, street art organic Bushwick artisan cliche semiotics ugh synth chillwave meditation. Shabby chic lomo plaid vinyl chambray Vice. Vice sustainable cardigan, Williamsburg master cleanse hella DIY 90's blog.</p>
                  </div>
              </main>
          </div>
      </div>
    </>
  );
}

export default Sidebar;
