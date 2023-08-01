import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
// import CategoryList from "./categoryList.js";
import { useUserContext } from "../../contexts/user-context.js";
import { useAuth } from "../../contexts/auth-context.js";
import CategoryList from "./category-list.js";
import SyncLoader from "react-spinners/SyncLoader.js";

function Sidebar({ color, image, routes }) { // 'routes' parameter is reference to the routes prop from "/Sidebar.js" to share the routes array data
  const serverUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_SERVER : "http://localhost:7979"
  const categoryInputRef = useRef();
  const inputSearch = useRef();
  const navigate = useNavigate();
  const { categories, setCategories } = useUserContext();
  const { currentUser } = useAuth();
  const [confirmValue, setConfirmValue] = useState(""); // useEffect dependency to rerender app when new category added
  const [categoryInputValue, setCategoryInputValue] = useState({ categoryName: "" });
  const [newCategoryInput, setNewCategoryInput] = useState(true); // to reveal input to add new category
  const [categorySearchState, setCategorySearchState] = useState(true);
  const [loading, setLoading] = useState(false)

//////////////////////////////////////////
  React.useEffect(() => {
    async function getCategoryList() {
      if(currentUser !== "" || currentUser !== null) {
        setLoading(true);
        const response = await fetch(`${ serverUrl }/bookmarker/category-list`, {
          credentials: "include",
          headers: {
            "Content-type": "application/json",
          },
        });
        const categoryRecords = await response.json();

        setCategories(categoryRecords)
        setLoading(false);
      } else { 
      console.log("No user currently logged in")
      setCategories([]) 
      setLoading(false);
      }
  };

  getCategoryList()
  }, [serverUrl, currentUser, confirmValue, setCategories]);

  function handleAddCategory(value) {
    return setCategoryInputValue((prevCategories) => {
      return { ...prevCategories, ...value }
    })
  };

  async function submitNewCategory(e) {
    e.preventDefault();
  // duplicateCheck to see if category name already exists 
    const duplicateCheck = categories ? categories.filter(category => category.categoryName.toUpperCase() === categoryInputValue.categoryName.toUpperCase()) : []

    if (categoryInputValue.categoryName === "" || !/\S/.test(categoryInputValue.categoryName) || categoryInputValue.categoryName.includes('  ')) {
      categoryInputRef.current.value = ""
      alert("Please enter a proper category name. Do not include double-spacing.")
      setNewCategoryInput(addNewCategory => !addNewCategory)

    } else if (duplicateCheck.length < 1 && categoryInputValue.categoryName !== "") {
      setLoading(true);

      await fetch(`${ serverUrl }/bookmarker/category-list`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryInputValue)
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
        return;
      });

      // Reset state for input field STATE
      setCategoryInputValue({ categoryName: "" });

      // Reset state of "+ Add New Category" button after input submission
      setNewCategoryInput(addNewCategory => !addNewCategory)
      // Reset input value of "+ Add New Category" to empty
      setConfirmValue(categoryInputRef.current.value)
      categoryInputRef.current.value = ""
      setLoading(false);

    } else {
      categoryInputRef.current.value = ""
      alert("Category name ALREADY exists.")
      
    }
  categoryInputRef.current.value = null
  }

  // Function to change state for "+ Add New Category" to show input field/button
  function addCategory() {
    setNewCategoryInput(addNewCategory => !addNewCategory)
  }

  // Switches form input state back to button/vice versa
  function searchCategoryList() {
    setCategorySearchState(categoryNameSearch => !categoryNameSearch)
  }

  function submitCategorySearch(e) {
    e.preventDefault();

    const categoryNameId = categories.length > 0 && categories.map(category => category.categoryName)

    if (categoryNameId && categoryNameId.includes(inputSearch.current.value)) {
      navigate(`/user/category/${ inputSearch.current.value.replace(/ /g, "-") }`)
    } else {
      alert("Search is case-sensitive. Please check spelling.")
    }
    inputSearch.current.value = null
    searchCategoryList() // call the function that reveals state instead of resetting state. any difference???
  }

///////////////////////////////////////////////////////////////////////////////////
  return (
    <>
      <aside className="col-sm-3 flex-grow-sm-1 flex-shrink-1 flex-grow-0 sticky-top pb-sm-0 pb-3">
          <div className="bg-light border rounded-3 p-1 h-100 sticky-to">
              <ul className="nav nav-pills flex-sm-column flex-row mb-auto justify-content-between text-truncate">
                  <li className="nav-item">
                      <a href="/" className="nav-link px-2 text-truncate">
                          <i className="bi bi-house fs-5"></i>
                          <span className="d-none d-sm-inline"> Home</span>
                      </a>
                  </li>
                  <li>
                      <a href="/user-reddit-posts" className="nav-link px-2 text-truncate">
                          <i className="bi bi-reddit fs-5"></i>
                          <span className="d-none d-sm-inline"> Your Reddit Posts</span>
                      </a>
                  </li>
              </ul>
                <div className="bookmark-funcs">
              { currentUser !== "" ?
                  <ul className="nav nav-pills flex-sm-column flex-row mb-auto justify-content-between text-truncate">
                    <li>
                { newCategoryInput ? 
                  <Button size="sm" className="w-75 text-center mt-2 mb-1" variant="outline-primary" onClick={addCategory}>+ Add New Category</Button> 
                  : 
                  <Form onSubmit={submitNewCategory}>
                    <Form.Control maxLength="40" size="sm" id="new-category" ref={ categoryInputRef } type='text' 
                    value={categoryInputValue.categoryName} 
                    onChange={ (e) => handleAddCategory({ categoryName: e.target.value }) }
                    placeholder="Type New Category Name"
                    />
                  </Form> }
                    </li>
                    <li>
                  { categorySearchState ? 
                  <Button className="w-75 text-center mt-1 mb-2" size="sm" variant="outline-primary" onClick={searchCategoryList}>Search Category List</Button>
                  : 
                  <Form onSubmit={submitCategorySearch}>
                    <Form.Control type="text" list="categoryName" ref={inputSearch} placeholder="Search Category Name" />
                  </Form> }
                    </li>
                  </ul>
                  : null }
                  <hr></hr>
                  { loading ? <SyncLoader color='#0d6efd' size={15} loading={loading} /> : 
                    <ul className="nav nav-pills flex-sm-column flex-row mb-auto justify-content-between text-truncate">
                      { currentUser !== "" ? <CategoryList categories={ categories } setCategories={ setCategories }/> : null }
                    </ul>
                  }
                </div>
          </div>
      </aside>

      <datalist id='categoryName'>
        { categories?.map(results => { return (<option key={results._id}>{results.categoryName}</option> ) }) }
      </datalist>
    </>
  );
}

export default Sidebar;
