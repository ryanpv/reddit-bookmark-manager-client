import React, { useEffect, useContext } from "react";
import { useNavigate, Redirect, useLocation, NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/auth-context";
// import { UserContext } from "./UserContext";
// import { useRedditAuth } from "./UserContext";
import { Button, Nav, ButtonGroup } from "react-bootstrap";
import DeleteModal from "../modals/delete-modal";
// import CategoryContent from "./categoryContent";
// import SyncLoader from "react-spinners/SyncLoader";

function CategoryList({ categories, setCategories }) { // states are [categories, setCategories]
  const serverUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_SERVER : "http://localhost:7979"
  const navigate = useNavigate();
  const { currentUser, setCategoryIdData, setCurrentPage, setDocumentCount } = useAuth()
  const token = currentUser && currentUser.accessToken
  // const { categoryContent, setCategoryContent } = useRedditAuth();
  const [categoryName, setCategoryName] = React.useState(""); // Value of button, which is the category name
  const [delInputValue, setDelInputValue] = React.useState({ categoryValue: "" }); // Input value from the delete modal
  const [show, setShow] = React.useState(false); // state for modals
  // const [loading, setLoading] = React.useState(false);
  const handleClose = () => setShow(false);
  

  const CategoryMapping = (props) => (
  <>
    <li>
        <ButtonGroup className="w-75 text-center" size="sm">
          <Button 
            className="w-75 text-center mt-1 mb-1" 
            size="sm" variant="outline-primary" 
            onClick={ () => handleBtnClick(props.category.categoryName, props.category._id) }
            >{ props.category.categoryName }</Button>
          <Button 
            className="mr-2 mt-1 mb-1" 
            variant="danger" 
            size="sm" 
            onClick={ () => delBtnClick(props.category.categoryName) }
            >x</Button>
        </ButtonGroup>
    </li>
  </>
  );

  async function delBtnClick(value) {
    await setShow(show => !show)
    await setCategoryName(value)
  };

  async function delCategory(e) {
    e.preventDefault();
    // Compares spelling of category with user's input to delete category
    if (delInputValue.categoryValue === categoryName) {
      await fetch(`${ serverUrl }/bookmarker/category-list`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ categoryName: categoryName }),
      });

      // Filter out removed category instead of fetching DB twice
      const newList = categories.filter((category) => category.categoryName !== categoryName);
      setCategories(newList);
      navigate("/")

      handleClose();
    } else {
      alert("DOES NOT MATCH")
    }
  };

  function getList() {
    if (currentUser !== "" && categories.length) {
      return categories.map((category) => {
        return (
            <CategoryMapping category={ category } key={ category._id } delCategory={ () => delCategory(category.categoryName) } />
          )
        })
      } else {
        setCategories([])
      }
    };


  async function handleBtnClick(categoryName, categoryId) {
    // const singleDoc = await fetch(`http://localhost:4554/querycategory/${categoryId}`, {
    //   headers: {
    //     Authorization: `Bearer ${token}`
    //   }
    // }
    // )
    // const docRecord = await singleDoc.json();
    // const categoryNameArr = docRecord?.map(el => el.categoryName)
    const categoryUrl = categoryName.replace(/ /g, "-")
    // console.log("clicked on category", categoryName);
    // await setCategoryContent(docRecord)
    setCategoryIdData({categoryName, categoryId})
    setDocumentCount(0)

    navigate(`/user/category/${categoryName.replace(/ /g, "-")}`)
  };

  return (
    <>
    {/* must return function call here so the component actually renders the results. otherwise, it will only return
    the values and not render anything */}
    { 
    // loading ? <SyncLoader color='#0d6efd' size={15} loading={loading} /> :
      categories.length ? 
        <ul className="nav nav-pills flex-sm-column flex-row mb-auto justify-content-between text-truncate">
          { currentUser !== "" ? getList() : null }
        </ul>
      : null 
    }

    <DeleteModal show={ show } handleClose={ handleClose } delCategory={ delCategory}  categoryName={ categoryName } 
      delInputValue={ delInputValue } setDelInputValue={ setDelInputValue } />

    </>
  )
}


export default CategoryList

// try to set content as state 