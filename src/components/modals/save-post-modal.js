import React from 'react'
import { Modal, Button } from 'react-bootstrap'

export function PostModal({ show, handleClose, submitBookmark, postItem, setPostItem, postData }) {
  const bookmarkRef = React.useRef("");

  async function handleAddBookmark(value) { 
    return setPostItem((prev) => {
      return { ...prev, ...value, ...postData} 
    })
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Bookmark</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Type in category name.
          <form onSubmit={submitBookmark}>
            <label>Category</label>
            &nbsp;
            <input id="cat_name" ref={bookmarkRef} list="categoryName" value={postItem.categoryName} 
            onChange={ (e) => handleAddBookmark({ categoryName: e.target.value })}></input>
          </form>
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="outline-primary" onClick={submitBookmark}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
