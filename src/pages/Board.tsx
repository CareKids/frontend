import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import Header from '../components/Header'
import Footer from '../components/Footer'
import Pagination from '../components/Pagination';

import { getBoardData } from '../api/load';
import { BoardInfo, BoardItem } from '../api/types';

const ITEMS_PER_PAGE = 10;
const Board: React.FC = () => {
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
              {boardData['pageList'].map((post: BoardItem) => (
                <tr key={post.id} onClick={() => handleRowClick(post.id)} style={{ cursor: 'pointer' }}>
                  <td className="text-center">{post.id}</td>
                  <td>{post.title}</td>
                  <td className="text-center">{new Date(post.createdAt[0], post.createdAt[1] - 1, post.createdAt[2]).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={paginate}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Board;