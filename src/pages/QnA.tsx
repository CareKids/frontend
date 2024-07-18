import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faPencilAlt, faLock } from '@fortawesome/free-solid-svg-icons';
import { useRecoilValue } from 'recoil';
import { loginState } from '../atom';

import Header from '../components/Header'
import Footer from '../components/Footer'
import Pagination from '../components/Pagination';

import { getQnAData } from '../api/load';
import { QnAInfo, QnAItem } from '../api/types';

const ITEMS_PER_PAGE = 10;
const QnA: React.FC = () => {
  // const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [qnaData, setQnAdata] = useState<QnAInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isLoggedIn = useRecoilValue(loginState);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        setLoading(true);
        const data = await getQnAData(currentPage, ITEMS_PER_PAGE);
        setQnAdata(data);
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

  const handleRowClick = (post: QnAItem) => {
    if (isLoggedIn) {
      navigate(`/qna/${post.id}`);
    }
    else {
      alert('로그인을 해주세요.');
    }
  };

  const handleWrite = () => {
    if (isLoggedIn) {
      navigate('/qna/write');
    }
    else {
      alert('로그인을 해주세요.');
    }
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!qnaData) return <div>데이터가 없습니다.</div>;

  const totalPages = qnaData.pageInfo.total;

  return (
    <div className='App'>
        <Header></Header>
        <div className="container mt-4">
            <h1 className="mb-4"><b>문의하기</b></h1>
            <div className="bg-white p-4 rounded shadow"> 
                <div className="row mb-4 align-items-center">
                    <div className="col-md-3">
                        {/* <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="검색"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div> */}
                    </div>
                    <div className="col-md-9 text-end">
                        <Button color="primary" onClick={handleWrite}>
                            <FontAwesomeIcon icon={faPencilAlt} className="me-2" />
                            작성하기
                        </Button>
                    </div>
                </div>

                <table className="table table-hover">
                    <thead className="table-light">
                    <tr>
                        <th className="text-center">번호</th>
                        <th>제목</th>
                        <th className="text-center">상태</th>
                        <th className="text-center">작성자</th>
                        <th className="text-center">작성일</th>
                    </tr>
                    </thead>
                    <tbody>
                    {qnaData?.pageList.map((post) => (
                        <tr key={post.id} onClick={() => handleRowClick(post)} style={{ cursor: 'pointer' }}>
                            <td className="text-center">{post.id}</td>
                            <td>
                                {post.title}
                                {post.secret && (
                                    <FontAwesomeIcon icon={faLock} className="ms-2 text-muted" />
                                )}
                            </td>
                            <td className="text-center">{post.questionCheck? "처리완료": "답변대기"}</td>
                            <td className="text-center">{post.users.nickname}</td>
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
        <Footer></Footer>
    </div>
  );
};

export default QnA;