import React from 'react'
import { useAuth } from '../../contexts/auth-context';
import { Button } from 'react-bootstrap';

export default function Pagination({ postsPerPage, totalPosts }) {
  const { setCurrentPage, setDocumentCount } = useAuth();
  const pageNumbers = [];
  const paginate = pageNumber => {
    const indexOfLastPost = pageNumber * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    setCurrentPage(pageNumber)
    setDocumentCount(indexOfFirstPost)
  }

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className='pagination'>
        {pageNumbers.map(number => (
          <div className='ml-2' key={number}>

          <li key={number} className='page-item'>
            {/* <button onClick={() => paginate(number)}>{number}</button> */}
            &nbsp;
            <div className="ml">
            <Button size="sm" variant="outline-primary" onClick={() => paginate(number)}>{number}</Button>
            </div>
            {/* &nbsp; */}
          </li>
          </div>
        ))}
      </ul>
    </nav>
  )
}
