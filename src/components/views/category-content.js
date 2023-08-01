import React from "react";
import { Card, Container, Row, Col, Button, Nav } from "react-bootstrap";
import { useParams, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../contexts/auth-context";
import { useUserContext } from "../../contexts/user-context";
import Pagination from "./paginator";
import SyncLoader from "react-spinners/SyncLoader";

// PASS IN PROPS
const CategoryContent = () => {
  const serverUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_SERVER : "http://localhost:7979";
  const location = useLocation();
  const { params } = useParams();
  const urlParams = params.replace(/-/g, " ");
  const { currentUser, categoryIdData, categories, currentPage, bookmarksIndex, setBookmarksIndex } = useAuth();
  const { categoryContent, setCategoryContent } = useUserContext();
  const baseUrl = 'https://www.reddit.com';
  const [imageContent, setImageContent] = React.useState({});
  const [galleryContent, setGalleryContent] = React.useState({});
  const [textData, setTextData] = React.useState("");
  const [videoContent, setVideoContent] = React.useState({});
  const [NSFWContent, setNSFWContent] = React.useState({});
  const [postsPerPage] = React.useState(5);
  const [commentBody, setCommentBody] = React.useState({})
  const [showText, setShowText] = React.useState(false)
  const [loading, setLoading] = React.useState(false);

  ////////////
  React.useEffect(() => {
    async function getCategoryContent () {
      setLoading(true);
      const filterCategoryData = await categories.filter((category) => category.categoryName.toUpperCase() === urlParams.toUpperCase());
      const initialObj = {};
      const getCategoryId = await filterCategoryData.reduce((acc, curr) => (acc, curr), initialObj);

      if (filterCategoryData.length < 1) {
        console.log('non-existent category');
        // history.push('/admin/profile');
        // create component that will navigate to a page does not exist**********
      } else if (getCategoryId.categoryName) {
        // console.log(getCategoryId);
        // const skipNum = parseInt(documentCount)
        setLoading(true);
        const singleDoc = await fetch(`${ serverUrl }/bookmarker/category-list/${ getCategoryId._id }/${ bookmarksIndex }`, {
          credentials: "include",
          headers: {
            "Content-type": "application/json"
            }
          }
        );
        const docRecord = await singleDoc.json();

        setCategoryContent(docRecord)
        setLoading(false);
      };
      setLoading(false)
    };
    getCategoryContent();

  }, [location, currentPage, bookmarksIndex, categories, serverUrl, urlParams, setCategoryContent]);

  //////////////////////
  const BookmarkList = (props) => (
    <tr>
      {/* <td>{ props.bookmark.bookmarkItem }</td> */}
      <td>
        <>
          <Nav.Link onClick={ () => hyperLinkClick({ pathName: props.bookmark.pathName, over_18: props.bookmark.over_18, body: props.bookmark.body, author: props.bookmark.author }) } 
          // to={{pathname: `${baseUrl}${props.bookmark.pathName}`}} target="_blank"
          >{ props.bookmark.title || props.bookmark.link_title + " ***(Saved Comment)" }
            </Nav.Link>
          &nbsp;&nbsp;&nbsp;
          <Button size="xs" variant="danger" onClick={() => deleteBookmark(props.bookmark._id)}>Delete</Button>
        </>
        </td>
    </tr>
  );


  async function deleteBookmark(bookmarkId) {
    await fetch(`${ serverUrl }/bookmarker/remove-bookmark/${bookmarkId}`, {
      method: "DELETE",
      credentials: "include",
    });
    const updateBookmarkList = categoryContent.categoryData.filter((contentList) => contentList._id !== bookmarkId);
    setCategoryContent((prev) => { return { categoryData: updateBookmarkList, docCount: prev.docCount - 1 } });
    setBookmarksIndex(prev => prev - 5)
  };
  
  function displayBookmarkList() {
    if (categoryContent && categoryContent.categoryData.length) {
      return categoryContent.categoryData.map((bookmark) => {
        return (
          <BookmarkList bookmark={bookmark} key={bookmark._id} />
        )
      })
    } else {
      return ;
    }
  };
  
  async function hyperLinkClick(value) { // pass in the prop's pathname
  setLoading(true);
  setShowText(false) // using this state to reduce amount of visible text on each link click from textContent - will allow users to see reduced text each click

    if (value.body !== "") {
      setCommentBody({body: value.body, author: value.author})
    } else {
      setCommentBody({})
    }

    if (!value.over_18 || value.over_18 === "false") {
    const contentFetch = await 
    fetch(`${baseUrl}${value.pathName}.json`)
    .then((response) => response.json())
    .then((result) => result.map(data => data.data.children));

  
    switch (true) {
      case ((contentFetch[0][0].data.selftext_html !== null && !contentFetch[0][0].data.post_hint) || contentFetch[0][0].data.post_hint === "self"):
        // const selfTextData = contentFetch[0][0].data 
        setTextData(contentFetch[0][0].data) // .selftext for text
        setImageContent({})
        setGalleryContent({})
        setVideoContent({})
        setNSFWContent({})
        break;
      case (contentFetch[0][0].data.post_hint === "image" || contentFetch[0][0].data.post_hint === "link"):
        setImageContent(contentFetch[0][0].data); // .url for image url
        setTextData("")
        setGalleryContent({})
        setVideoContent({})
        setNSFWContent({})
        break;
      case (contentFetch[0][0].data.is_gallery):
        setGalleryContent(contentFetch[0][0].data) // .url for gallery url
        setTextData("")
        setImageContent({})
        setVideoContent({})
        setNSFWContent({})
        break;
      case (contentFetch[0][0].data.is_video || contentFetch[0][0].data.post_hint === "rich:video"):
        setVideoContent(contentFetch[0][0].data)
        setGalleryContent({})
        setTextData("")
        setImageContent({})
        setNSFWContent({})
        break;
      default:
        }

    } else {
      setLoading(true);
      
      if (window.confirm("Do you wish to view NSFW content?")) {
      const nsfwFetch = await 
      fetch(`${baseUrl}${value.pathName}.json?q=cat&nsfw=1&include_over_18=on`)
      .then((response) => response.json())
      .then((result) => result.map(data => data.data.children))
      // console.log("nsfw content", nsfwFetch[0][0].data);

        setNSFWContent(nsfwFetch[0][0].data)
        setVideoContent({})
        setGalleryContent({})
        setTextData("")
        setImageContent({})
        setLoading(false);

      } else {
        setNSFWContent({})
        setCommentBody({})
        setLoading(false);
      }
    }
    setLoading(false);
  };

  function expandText(e) {
    e.preventDefault();
    setShowText(true)
  };

  function limitText(textBody) {
    if (textBody && textBody.length > 2500) {
      return (
        <>
          <p>
            { textBody.slice(0, 2500) }<Button onClick={(e) => expandText(e)} size="xs" variant="link">...expand</Button>
          </p>
        </>
      )
    }
    return (
      <p>{ textBody }</p>
    )
  };


  return(
    
    <div className="category-content">
      <h5><b>Current User: </b>{ currentUser ? currentUser.email : "not logged in" }</h5>

      <Container fluid>
        
      { categoryContent.categoryData?.length > 0 ? 
      <>

      <h2>Category: { categoryIdData.categoryName }</h2>

      <Row>
          <Col md="4">
              <Card>
                    <>
                  <Card.Header>
                      <Card.Title as="h4">Saved Posts List</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <table className='table table-striped' style={ { marginTop: 20, border: "1px solid black" } }>
                      <thead>
                          <tr>
                            {/* <th style={{ margin: 20, border: "1px solid black", padding: "10px 10px" }}>ID</th> */}
                            <th style={ { margin: 20, border: "1px solid black", padding: "10px 10px" } }>Bookmarks</th>
                          </tr>
                      </thead>
                      { loading ? <SyncLoader color='#0d6efd' size={15} loading={loading} /> : 
                          <tbody>{ displayBookmarkList() }</tbody>
                        }
                    </table>
                  </Card.Body>
                    <Pagination postsPerPage={ postsPerPage } totalPosts={ categoryContent.docCount } />
                    </>
              </Card>
          </Col>

          {/* /////////////////////////// Content Column /////////////////////////// */}

          <Col md="8">
            { loading ? <SyncLoader color='#0d6efd' size={15} loading={loading} /> :
            <>
            {
              textData?.permalink || imageContent?.permalink || galleryContent.permalink
              || videoContent.permalink || NSFWContent.permalink ?
              <Card>
                  <Card.Header>
                      <h6>{ textData?.subreddit_name_prefixed || imageContent?.subreddit_name_prefixed || galleryContent.subreddit_name_prefixed 
                      || videoContent.subreddit_name_prefixed || NSFWContent.subreddit_name_prefixed }</h6>
                      &nbsp;
                      <Card.Title as="h4">
                        { textData.url ? <Link to={ `${baseUrl}${textData.permalink}` } target="_blank">{ textData?.title }</Link> : null }
                        { imageContent.url ? <Link to={ `${baseUrl}${imageContent.permalink}` } target="_blank">{ imageContent?.title }</Link> : null }
                        { galleryContent.url ? <Link to={ `${baseUrl}${galleryContent.permalink}` } target="_blank">{ galleryContent?.title }</Link> : null }
                        { videoContent.url ? <Link to={ `${baseUrl}${videoContent.permalink}` } target="_blank">{ videoContent?.title }</Link> : null }
                        { NSFWContent.url ? <Link to={ `${baseUrl}${NSFWContent.permalink}` } target="_blank">{ NSFWContent?.title }</Link> : null }
                        </Card.Title>
                      <h6>u/{ textData.author || imageContent.author || galleryContent.author || videoContent.author || NSFWContent.author }</h6>
                  </Card.Header>
                  <Card.Body>
                      <>
                      <div>
                    
                      {/* { textData.selftext ? <p>{ textData.selftext }</p> : null }  */}
                      { textData.selftext && showText === false ? limitText(textData.selftext) : <p>{textData.selftext}</p> } 

                      { imageContent.selftext ? <p>{ imageContent.selftext }</p> : null } 
                      
                      { imageContent.post_hint === "image" ? <img className="img-fluid" src={ `${ imageContent.url }` } alt={`${ imageContent.title }`} /> : null }

                      { imageContent.post_hint === "link" ? 
                        <video controls width="250" key={ imageContent.url }>
                        <source src={ `${ imageContent.preview.reddit_video_preview.fallback_url }` } type="video/mp4"/>
                        <source src={ `${ imageContent.preview.reddit_video_preview.fallback_url }` } type="video/WebM"/>
                      </video>
                      : null }
                      
                      { videoContent.is_video ? 
                        <video controls width="250" key={ videoContent.url }>
                          <source src={ `${ videoContent.secure_media.reddit_video.fallback_url }` } type="video/mp4"/>
                          <source src={ `${ videoContent.secure_media.reddit_video.fallback_url }` } type="video/WebM"/>
                        </video>
                        : null }

                      { videoContent.post_hint === "rich:video" ? 
                        <video controls width="250" key={ videoContent.url }>
                          <source src={ `${ videoContent.preview.reddit_video_preview.fallback_url }` } type="video/mp4"/>
                          <source src={ `${ videoContent.preview.reddit_video_preview.fallback_url }` } type="video/WebM"/>
                        </video>
                        : null }                      

                      { galleryContent.url ? 
                      <>
                      <p>Reddit image galleries must be viewed in separate window.</p>
                      <Link to={{pathname: `${galleryContent.url}`}} target="_blank">Click this link if you wish to continue</Link> 
                      </>
                      : null }
                      
                      { NSFWContent.is_video &&
                        <video controls width="250" key={ NSFWContent.url }>
                          <source src={ `${ NSFWContent.secure_media.reddit_video.fallback_url }` } type="video/mp4"/>
                          <source src={ `${ NSFWContent.secure_media.reddit_video.fallback_url }` } type="video/WebM"/>
                        </video> }

                      { NSFWContent.post_hint === "rich:video" ? 
                        <video controls width="250" key={ NSFWContent.url }>
                        <source src={ `${ NSFWContent.preview.reddit_video_preview.fallback_url }` } type="video/mp4"/>
                        <source src={ `${ NSFWContent.preview.reddit_video_preview.fallback_url }` } type="video/WebM"/>
                      </video>
                        : null }

                      { NSFWContent.post_hint === "image" ? <img className="img-fluid" src={ NSFWContent.url } alt={ `${ NSFWContent.title }` } /> : null }

                      { NSFWContent.selftext ? <p>{ NSFWContent.selftext }</p> : null}
                      
                      </div>
                      </>
                      {/* <Link to={ {pathname: textData.url || imageResult.url || galleryContent.url } } target="_blank" >Open in new tab</Link> */}
                  </Card.Body>
              </Card>
              : null } 

              { commentBody.body ? 
              <Card>
                <Card.Body>
                  <h5>Saved Comment: </h5>
                  <h6>Commenter: u/ { commentBody.author }</h6>
                  &nbsp;
                 <p>{ commentBody.body }</p>
                </Card.Body>
              </Card>
                : null }
              </>
              }
          </Col>
      </Row> 
      </>
                          : <h1><strong>CATEGORY "{ params }" EITHER DOES NOT EXIST OR DOES NOT CURRENTLY HAVE SAVED BOOKMARKS</strong></h1> }
    </Container>

    </div>
  )
}

export default CategoryContent;

// return route and have route go to dynamic url
// create dynamic route paths (with useParams) and have button fetch that route??
// useFetch() to fetch data - tut 26 for reference

// can we use render prop to render component clones with dynamic data???***
// if possible, this method will be used to render all the different data using clones of this template component 
// or use createElement()??? https://reactjs.org/docs/react-api.html#createelement