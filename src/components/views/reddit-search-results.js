import React from 'react'
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/auth-context';
import { PostModal } from '../modals/save-post-modal';
import { Button } from 'react-bootstrap';
import Pagination from './paginator';

export default function RedditSearchResults() {
  const { searchResponse, currentPage, categories, currentUser } = useAuth();
  const clientUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_CLIENT : "http://localhost:3000";
  const serverUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_SERVER : "http://localhost:7979";
  const baseUrl = 'https://www.reddit.com'
  const [postsPerPage, setPostsPerPage] = React.useState(5);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = searchResponse?.slice(indexOfFirstPost, indexOfLastPost);
  const [show, setShow] = React.useState(false);
  const handleClose = () => setShow(false);
  const [postData, setPostData] = React.useState({})
  const [postItem, setPostItem] = React.useState({ categoryName: "" });
  
  const SearchResultData = (props) => {
    return (
      <tr>
        <td>{ props.searchResult.categoryName ? props.searchResult.categoryName : <p>N/A</p> }</td>
        <td>
        {props.searchResult.pathName ? <Link to={ {pathname: `${baseUrl}${props.searchResult.pathName}`} } target="_blank" onClick={() => alert('opening new tab')}>
            { props.searchResult.title || props.searchResult.link_title }
            </Link> : 
            <Link to={ `${baseUrl}${props.searchResult.data.permalink}` } target="_blank" onClick={() => alert('opening new tab')}>
            { props.searchResult.data.title || props.searchResult.data.link_title }
            </Link>}
        </td>
        <td>{ !props.searchResult.categoryName ? 
              <Button variant="outline-primary" onClick={() => btnClick({ name: props.searchResult.data.name, pathname: props.searchResult.data.permalink, title: props.searchResult.data.title,
                author: props.searchResult.data.author, subreddit: props.searchResult.data.subreddit_name_prefixed, body: props.searchResult.data.body, link_title: props.searchResult.data.link_title, 
                over_18: props.searchResult.data.over_18 })}
                >+</Button> : null }
        </td>
      </tr>
    );
  };

  const btnClick = async(value) => { // btn click will store the value into state, which we can then use to pass info to submitBookmark()
    await setShow(show => !show);
    await setPostData(value);
  };

  async function submitBookmark(e) {
    e.preventDefault();
    try {
      const categoryNameCheck = categories.map(category => category.categoryName.toUpperCase()); // returns category names (categoryName values)
      if (categoryNameCheck.includes(postItem.categoryName.toUpperCase())) {
        const categoryFilter = categories.filter(category => category.categoryName === postItem.categoryName); // should always return only 1 object

        handleClose();
        setPostItem({
          categoryName: ""
        });

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

  const displaySearchResult = () => {
    if (currentPosts.length > 0) {
      return currentPosts.map(searchResult => {
        return (
            <SearchResultData searchResult={searchResult} key={searchResult.permalink} />
        )
      }
    )} 
  };

  return (
    <>
      <h2>Search Results</h2>

      { searchResponse.length > 0 ? 
        <table className='table table-striped' style={{ marginTop: 20, border: "1px solid black" }}>
          <thead>
            <tr>
              <th style={{ margin: 10, border: "1px solid black", padding: "10px 10px" }}>Category</th>
              <th style={{ margin: 20, borderBottom: "1px solid black", padding: "10px 10px" }}>Bookmarks</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            { displaySearchResult() } 
          </tbody>
        </table>
      : <h2>No results</h2> }

      <Pagination postsPerPage={ postsPerPage } totalPosts={ searchResponse.length } />

      <datalist id='categoryName'>
        { categories?.map(results => { return (<option key={results._id}>{results.categoryName}</option> ) }) }
      </datalist>

      <PostModal show={show} handleClose={handleClose} list={"categoryName"} submitBookmark={submitBookmark} postItem={postItem} setPostItem={setPostItem} 
        postData={postData} />
    </>
  )
}
