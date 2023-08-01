import React, { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth-context';
import { Button, InputGroup, Form } from 'react-bootstrap';
import { useUserContext } from '../../contexts/user-context';
import { PostModal } from '../modals/save-post-modal';
import Pagination from './paginator';
import SyncLoader from 'react-spinners/SyncLoader';

export default function RedditPosts() {
  const serverUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_SERVER : "http://localhost:7979";
  const clientUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_CLIENT : "http://localhost:3000";
  const { savedList, setSavedList } = useUserContext();
  const clientid = process.env.REACT_APP_REDDIT_ID; // Reddit client ID
  const baseUrl = 'https://www.reddit.com'
  const navigate = useNavigate();
  const { currentUser, categories, currentPage, setCurrentPage, setSearchResponse } = useAuth();
  const bookmarkRef = useRef("");
  const [show, setShow] = React.useState(false);
  const handleClose = () => setShow(false);
  const [postData, setPostData] = React.useState({})
  const [postItem, setPostItem] = React.useState({ categoryName: "" });
  const [postsPerPage] = React.useState(5); // State for how many posts per page to show
  const [loading] = React.useState(false);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const paginatedPosts = savedList?.slice(indexOfFirstPost, indexOfLastPost); // Pagination by using slice() on array for fetched posts - returns sliced data
  const savedPostsRef = useRef();

  const FullList = (props) => { 

      return (
      <tr>
        {/* "name" is redditAPI's "fullname" identifier */}
        <td>{ props.listItem.id }</td>  
        <td>
          <Link to={`${baseUrl}${props.listItem.permalink}`} target="_blank" onClick={() => alert('opening new tab')}>
          { props.listItem.title || props.listItem.link_title + " (saved comment)" }
          </Link>
          </td>
          <td>
            <Button variant="outline-primary" onClick={() => btnClick({ name: props.listItem.name, pathName: props.listItem.permalink, title: props.listItem.title,
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
    navigate(`/search-results?${savedPostsRef.current.value}`)
    const savedPostsSearch = savedList.filter(post => { 
      if (post.data.title) {
      return post.data.title.toLowerCase().includes(savedPostsRef.current.value.toLowerCase())
      } 
    return post.data.link_title.toLowerCase().includes(savedPostsRef.current.value.toLowerCase())
  });

    setSearchResponse(savedPostsSearch)
  };

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
    const fetchRequest = await fetch(`${ serverUrl }/user-reddit/saved-reddit-posts`, 
    { credentials: "include" }
    )
    .then(res => res)
    .then(data => data.json())
    .catch((error) => console.log(error))
    console.log('savedlist: ', fetchRequest);
    setSavedList(fetchRequest)
  };

  // Display users reddit saved posts onto table
  function displayPosts() {
    if(savedList.length > 0) {
      return paginatedPosts.map((listItem) => {
        return (
          <FullList listItem={ listItem.data } key={ listItem.data.permalink } bookmarkRef={ bookmarkRef }/>
        );
      });
    }
  };

  // btnClick() will store the value into state, which we can then use to pass info to submitBookmark()
  const btnClick = async(value) => { 
    console.log("value: ", value);
    await setShow(show => !show);
    await setPostData(value);
  };
  
  async function submitBookmark(e) {
    e.preventDefault();
    try {
      const categoryNameCheck = categories.map(category => category.categoryName.toUpperCase()); // returns category names (categoryName values)
      if (categoryNameCheck.includes(postItem.categoryName.toUpperCase())) {
        const categoryFilter = categories.filter(category => category.categoryName === postItem.categoryName); // should always return only 1 object
        // const catId = categoryFilter.map(el => el._id).toString()

        handleClose();
        setPostItem({
          categoryName: ""
        });
        //next steps, fetch the category and update the list[] field. need to push into array?

        await fetch(`${ serverUrl }/bookmarker/saved-bookmarks`, {
          method: 'POST',
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...postItem, categoryId: categoryFilter[0]._id })
        });
      } else {
        alert('category does NOT exist OR check spelling - case sensitive');
      }
    } catch (error) {
      console.log(error);
    }
  };



  return (
    <>
      { loading ? <SyncLoader color='#0d6efd' size={15} loading={loading} /> : 
      <>
      { currentUser ?
      <>
        <Button variant="warning" size="md" onClick={ () => { openLogin() } }>Reddit Login</Button>{ <i> Login to Reddit to see your saved posts. (Click on the 'Load Bookmarks' button after logging into reddit)</i> }

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
                <th style={{ width: 10, border: "1px solid black" }} ><Button variant="link" size="sm" onClick={ () => getRedditPosts() }>Load Bookmarks</Button></th>
              </tr>
            </thead>
            <tbody>{ displayPosts() }</tbody>
          </table>
        </div>

        <Pagination postsPerPage={postsPerPage} totalPosts={savedList?.length} />
      </>
      : 'PLEASE LOGIN' }
      </>
      }

      <datalist id='categoryName'>
        { categories?.map(results => { return (<option key={results._id}>{results.categoryName}</option> ) }) }
      </datalist>

      <PostModal show={show} handleClose={handleClose} list={"categoryName"} categories={categories}
      submitBookmark={submitBookmark} postItem={postItem} setPostItem={setPostItem} postData={postData} />

    {/* *****ENSURE REDDIT TOKEN REVOKED AND STATE REMOVED***** */}
    {/* do a check if data has been rendered, if not then button shows. also, if no saved bookmarks, then return a string saying so  */}
    </>
  )
}
