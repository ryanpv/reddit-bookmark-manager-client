import React, { useEffect, useContext } from "react";
import { useHistory, Redirect, useLocation, NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/auth-context";
// import { UserContext } from "./UserContext";
// import { useRedditAuth } from "./UserContext";
import { Button, Nav, ButtonGroup } from "react-bootstrap";
// import CategoryContent from "./categoryContent";
// import DeleteModal from "components/Modals/DeleteModal.js"


function CategoryList({ categories, setCategories }) { // states are [categories, setCategories]

  const history = useHistory();
  const { currentUser, setCategoryIdData, setCurrentPage, setDocumentCount } = useAuth()
  const token = currentUser && currentUser._delegate.accessToken
  // const { categoryContent, setCategoryContent } = useRedditAuth();
  const [categoryName, setCategoryName] = React.useState("")
  const [delInputValue, setDelInputValue] = React.useState({ string: "" })
  const [show, setShow] = React.useState(false)
  const handleClose = () => setShow(false);
  
  const CategoryMapping = (props) => (
    // <div className="category-list">
  <>
    <div>
        <ButtonGroup className="w-100 text-center mt-1">
          <Button className="w-100 text-center ml-2 mr-2" variant="primary" size="sm" onClick={ () => handleBtnClick(props.category.categoryName, props.category._id) }>{ props.category.categoryName }</Button>
          <Button className="mr-2 mb-2" variant="danger" size="xs" onClick={ () => delBtnClick(props.category.categoryName) }>x</Button>
        </ButtonGroup>
    </div>
  </>
      
  // </div>
  )

  async function delBtnClick(value) {
    await setShow(show => !show)
    await setCategoryName(value)
  }

  async function delCategory(e) {
    e.preventDefault();

    if (delInputValue.string === categoryName) {

    await fetch(`https://saveredd-api.onrender.com/remove-category/${ categoryName }`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const newList = categories.filter((category) => category.categoryName !== categoryName);
    setCategories(newList);
    history.push(`/admin/profile`)
    // console.log("leftover categories", newList.length);
    handleClose();

  } else {
    alert("DOES NOT MATCH")
  }

  }


  function getList() {
    // "if()" check needed to be done otherwise React will try to map the null categories state and throw error
    // can also do conditional check where the function is called exactly
    // if (categories.length) {
      return categories.map((category) => {
        return (
          // <div key={category._id}>
            <CategoryMapping category={ category } key={ category._id } delCategory={ () => delCategory(category.categoryName) } />
          // {/* </div> */}
          )
        })
      // }
  }
  // console.log("category list loaded");

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

    history.push(`/admin/category/${categoryName.replace(/ /g, "-")}`)

  }

  return (
    <>
    {/* must return function call here so the component actually renders the results. otherwise, it will only return
    the values and not render anything */}
    { categories.length ? 
    // <ButtonGroup vertical>
      <div>

      { getList() }
      </div>

    // {/* </ButtonGroup> */}
    : null }
    <DeleteModal show={ show } handleClose={ handleClose } delCategory={ delCategory}  categoryName={ categoryName } 
      delInputValue={ delInputValue } setDelInputValue={ setDelInputValue } />

    </>

  )
}


export default CategoryList

// try to set content as state 