import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  paginate: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, paginate }) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPages = 10;
    const sidePages = 4;

    if (totalPages <= maxPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pageNumbers.push(1);

    if (currentPage > sidePages + 1) {
      pageNumbers.push('...');
    }

    const start = Math.max(2, currentPage - sidePages);
    const end = Math.min(totalPages - 1, currentPage + sidePages);

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    if (currentPage < totalPages - sidePages) {
      pageNumbers.push('...');
    }

    pageNumbers.push(totalPages);

    return pageNumbers;
  };

  return (
    <nav aria-label="Page navigation" className="mt-4 bg-transparent">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button className="page-link text-primary" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
        </li>
        {getPageNumbers().map((number, index) => (
          <li key={index} className={`page-item ${currentPage === number ? 'active' : ''}`}>
            {number === '...' ? (
              <span className="page-link">...</span>
            ) : (
              <button
                onClick={() => paginate(number as number)}
                className={`page-link ${currentPage === number ? 'bg-primary border-primary' : 'text-primary'}`}
              >
                {number}
              </button>
            )}
          </li>
        ))}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button className="page-link text-primary" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;