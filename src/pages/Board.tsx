import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import Header from '../components/Header'
import Footer from '../components/Footer'

import { getBoardData } from '../api/load';
import { BoardInfo, BoardItem } from '../api/types';

const ITEMS_PER_PAGE = 10;

const Board: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [boardData, setBoardData] = useState<BoardInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        setLoading(true);
        const data = await getBoardData(currentPage, ITEMS_PER_PAGE);
        setBoardData(data);
        setError(null);
      } catch (err) {
        setError('데이터를 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBoardData();
  }, [currentPage]);

  const handleRowClick = (postId: number) => {
    navigate(`/board/${postId}`);
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!boardData) return <div>데이터가 없습니다.</div>;

  const filteredPosts = boardData.pageList.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = boardData.pageInfo.total;

  return (
    <div className='App'>
      <Header />
      <div className="container mt-4">
        <h1 className="mb-4"><b>공지사항</b></h1>
        <div className="bg-white p-4 rounded shadow">          
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th className="text-center">번호</th>
                <th>제목</th>
                <th className="text-center">작성일</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post: BoardItem) => (
                <tr key={post.id} onClick={() => handleRowClick(post.id)} style={{ cursor: 'pointer' }}>
                  <td className="text-center">{post.id}</td>
                  <td>{post.title}</td>
                  <td className="text-center">{new Date(post.createdAt[0], post.createdAt[1] - 1, post.createdAt[2]).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <nav aria-label="Page navigation" className="mt-4">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link text-primary" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
              </li>
              {Array.from({ length: totalPages }).map((_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                  <button 
                    onClick={() => paginate(index + 1)} 
                    className={`page-link ${currentPage === index + 1 ? 'bg-primary border-primary' : 'text-primary'}`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link text-primary" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Board;