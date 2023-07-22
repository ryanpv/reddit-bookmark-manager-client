import React, { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth-context';
import { Button, InputGroup, Form } from 'react-bootstrap';
// import { PostModal } from '../components/Modals/PostModal'
// import Pagination from "../layouts/Pagination"
import { useUserContext } from '../../contexts/user-context';

export default function RedditPosts() {
  const serverUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_SERVER : "http://localhost:7979";
  const clientUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_CLIENT : "http://localhost:3000";
  const { savedList, setSavedList } = useUserContext;
  const clientid = process.env.REACT_APP_REDDIT_ID;
  const baseUrl = 'https://www.reddit.com'
  const navigate = useNavigate();
  const { currentUser, categories, currentPage, setCurrentPage, setSearchResponse } = useAuth();
  const token = currentUser && currentUser.accessToken
  const bookmarkRef = useRef("");
  const [show, setShow] = React.useState(false);
  const handleClose = () => setShow(false);
  const [searchSavedPosts, setSearchSavedPosts] = React.useState([])
  const [postData, setPostData] = React.useState({})
  const [postItem, setPostItem] = React.useState(
    {
    categoryName: "",
    categoryId: ""
   })
  //  const [currentPage, setCurrentPage] = React.useState(1);
   const [fetchedPostsPerPage, setFetchedPostsPerPage] = React.useState(5);
   const indexOfLastPost = currentPage * fetchedPostsPerPage;
   const indexOfFirstPost = indexOfLastPost - fetchedPostsPerPage;
   const currentPosts = savedList?.slice(indexOfFirstPost, indexOfLastPost);
   const savedPostsRef = useRef();
  
  const FullList = (props) => { 

      return (
      <tr>
        {/* "name" is redditAPI's "fullname" identifier */}
        <td>{ props.listItem.id }</td>  
        <td>
          <Link to={{pathname: `${baseUrl}${props.listItem.permalink}`}} target="_blank" onClick={() => alert('opening new tab')}>
          { props.listItem.title || props.listItem.link_title + " (saved comment)" }
          </Link>
          </td>
          <td>
            {/* <Button onClick={() => btnClick(props.listItem.name) }>+</Button> */}
            <Button variant="outline-primary" onClick={() => btnClick({ name: props.listItem.name, pathname: props.listItem.permalink, title: props.listItem.title,
               author: props.listItem.author, subreddit: props.listItem.subreddit_name_prefixed, body: props.listItem.body, link_title: props.listItem.link_title, 
               over_18: props.listItem.over_18 })}
               >+</Button>
          </td>
      </tr>
  )};
  

  // Search ALL saved reddit posts/bookmarks

  function filterList(e) {
    e.preventDefault();
    setCurrentPage(1)

    navigate(`/admin/search-results?${savedPostsRef.current.value}`)
    const savedPostsSearch = savedList.filter(el => { if (el.title) {
      return el.title.toLowerCase().includes(savedPostsRef.current.value.toLowerCase())
    } 
    return el.link_title.toLowerCase().includes(savedPostsRef.current.value.toLowerCase())
  })

    setSearchResponse(savedPostsSearch)
  }

  // React.useEffect(() => {
  //   async function totalProcess(token) {
  //     if (token) {
  //       getRedditPosts()
  //     } else {
  //     // return setSavedList([]) // must be done quicker/earlier?? still logs once before logout rerender
  //     }
  //   }
  //   totalProcess(token)
  //   }, [savedList?.length])

    async function openLogin() {
      try {
        window.location.href = (
          `https://www.reddit.com/api/v1/authorize?client_id=${ clientid }&response_type=code&state=rvreddapp-prod&redirect_uri=${ clientUrl }/log_callback&duration=permanent&scope=identity+history`
        )
      } catch (error) {
        console.log(error);
      }
  }

  // Retrieve users' saved posts/comments
  async function getRedditPosts() {
    const fetchRequest = await fetch(`${ serverUrl }/user-reddit/saved-posts`, 
    { credentials: "include" }
    )
    .then(res => res)
    .then(data => data.json())
    .catch((error) => console.log(error))
    
    // const fetchedData = await fetchRequest.json()
    await setSavedList(fetchRequest)
    // console.log("refresh success");
    // console.log(savedList); // response array
  }


  function displayPosts() {
    
    if(savedList) {
      return currentPosts.map((listItem) => {
        return (
          <FullList listItem={listItem} key={listItem.permalink} bookmarkRef={bookmarkRef}/>
        )
      })
    }
  }

  const btnClick = async(value) => { // btn click will store the value into state, which we can then use to pass info to submitBookmark()
    await setShow(show => !show);
    await setPostData(value);
    // console.log(value);
  }
  
  async function submitBookmark(e) {
    e.preventDefault();
    
    const categoryIdName = categories.map(category => category.categoryName.toUpperCase()) // returns category names (categoryName values)
    const keyId = categories.filter(category => category.categoryName.toUpperCase() === postItem.categoryName.toUpperCase()) // returns the single category that === input
    // const _id = keyId[0]._id;
    // accessing the _id through this method since the filter should return an array with only a single obj
    // can map() toUpperCase to categoryId for case insensitivity *** better for search
    // console.log(categoryIdName);

    
    try {
      if (categoryIdName.includes(postItem.categoryName.toUpperCase())) {
        const categoryFilter = categories?.filter(category => category.categoryName === postItem.categoryName)
        const catId = categoryFilter.map(el => el._id).toString()

      handleClose();
      setPostItem({
        categoryName: "",
        categoryId: ""
       });
      // is this good practice accessing the array object?


      //next steps, fetch the category and update the list[] field. need to push into array?
      // await fetch(`http://localhost:4554/update/${_id}`, {
      await fetch(`https://saveredd-api.onrender.com/addbookmark`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({...postItem, categoryId: catId})
      });
      
    } else {alert('category does NOT exist OR check spelling - case sensitive')}

  } catch (error) {
    console.log(error);
  }
  }



  return (
    <>
    <div>
      </div>
    {/* { currentUser ? <button onClick={ () => { openLogin() } }>Login with Reddit</button> : 'PLEASE LOGIN' } */}
    {/* <button onClick={ () => { getReddit() } }>get reddit</button> */}

    { currentUser ?
    <>
    <Button variant="warning" size="md" onClick={ () => { openLogin() } }>Reddit Login</Button>{ <i> Login to Reddit to see your saved posts. (Click on the 'Load Bookmarks' button after logging into reddit)</i> }

    <div>


    <div>
    <h3>All Saved Reddit Content</h3>        
    <InputGroup className="mb-3">
        <Form className="w-25 d-flex justify-content-center" onSubmit={filterList}>
            <Form.Control
              type="text"
              placeholder="Search For Bookmark"
              // className="me-2"
              aria-label="Search"
              ref={savedPostsRef}                          
              />
          </Form>
      </InputGroup>
      
      <table className='table table-striped' style={{ marginTop: 20, border: "1px solid black" }}>
        <thead>
            <tr>
              <th style={{ margin: 20, border: "1px solid black", padding: "10px 10px" }}>ID</th>
              <th style={{ margin: 20, border: "1px solid black", padding: "10px 10px" }}>Bookmarks</th>
              <th style={{ width: 10, border: "1px solid black" }} ><Button variant="link" size="sm" onClick={() => getRedditPosts()}>Load Bookmarks</Button></th>
            </tr>
        </thead>
        {/* <tbody>{displayPosts()}</tbody> */}
      </table>
    </div>

    </div>


    {/* <div>
    <Pagination postsPerPage={fetchedPostsPerPage} totalPosts={savedList?.length} />
    </div> */}
    </>
    : 'PLEASE LOGIN' }

    <datalist id='categoryName'>
      { categories?.map(results => { return (<option key={results._id}>{results.categoryName}</option> ) }) }
    </datalist>
    {/* <div>
  <PostModal show={show} handleClose={handleClose} list={"categoryName"} categories={categories}
  submitBookmark={submitBookmark} postItem={postItem} setPostItem={setPostItem} postData={postData} />
    </div> */}

    {/* *****ENSURE REDDIT TOKEN REVOKED AND STATE REMOVED***** */}
    {/* do a check if data has been rendered, if not then button shows. also, if no saved bookmarks, then return a string saying so  */}
    </>

  )
}
