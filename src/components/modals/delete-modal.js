import React from 'react'
import { Modal, Button } from 'react-bootstrap'

export default function DeleteModal({ show, handleClose, delCategory, categoryName, delInputValue, setDelInputValue }) {
  // const [post, setPost] = React.useState({
  //   bookmarkItem: ""
  // })
  const categoryDeleteRef = React.useRef("");

  async function handleDeleteCategory(value) { 
    return setDelInputValue((prev) => {
      return { ...prev, ...value } 
    })
  }

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>DELETE "{categoryName}" Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Type in category name to confirm delete. (<i>Case sensitive</i>)
          <form onSubmit={delCategory}>
            <label>Category</label>
            &nbsp;
            <input id="category_name" ref={categoryDeleteRef} 
            onChange={ (e) => handleDeleteCategory({ categoryValue: e.target.value }) }
            >
            </input>
          </form>
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>

          { delInputValue.categoryValue === categoryName ? 
          <Button variant="danger" onClick={delCategory}>
            Confirm Delete
          </Button>
          : 
          <Button variant="danger" disabled>
          Confirm Delete
        </Button> }

        </Modal.Footer>
      </Modal>
    </>
  )
}
