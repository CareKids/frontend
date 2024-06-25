import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

import Header from '../components/Header'
import Footer from '../components/Footer'

interface Post {
  id: number;
  title: string;
  author: string;
  date: string;
  progress: string;
}

const QnA: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const dummyPosts: Post[] = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    title: `게시글 제목 ${i + 1}`,
    author: '케어키즈',
    date: '2024-06-24',
    progress: '처리완료',
  }));

  const filteredPosts = dummyPosts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  const navigate = useNavigate();
  const handleRowClick = (postId: number) => {
    navigate(`/qna/${postId}`);
  };

  const handleWrite = () => {
    navigate('/qna/write');
  };

  return (
    <div className='App'>
        <Header></Header>
        <div className="container mt-4">
            <h1 className="mb-4"><b>문의하기</b></h1>
            <div className="bg-white p-4 rounded shadow"> 
                <div className="row mb-4 align-items-center">
                    <div className="col-md-3">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="검색"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
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
                    {currentPosts.map((post) => (
                        <tr key={post.id} onClick={() => handleRowClick(post.id)} style={{ cursor: 'pointer' }}>
                            <td className="text-center">{post.id}</td>
                            <td>{post.title}</td>
                            <td className="text-center">{post.progress}</td>
                            <td className="text-center">{post.author}</td>
                            <td className="text-center">{post.date}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                
                <nav aria-label="Page navigation" className="mt-4">
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link text-primary" onClick={() => paginate(currentPage - 1)}>
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        </li>
                        {Array.from({ length: Math.ceil(filteredPosts.length / postsPerPage) }).map((_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <button 
                            onClick={() => paginate(index + 1)} 
                            className={`page-link ${currentPage === index + 1 ? 'bg-primary border-primary' : 'text-primary'}`}
                            >
                            {index + 1}
                            </button>
                        </li>
                        ))}
                        <li className={`page-item ${currentPage === Math.ceil(filteredPosts.length / postsPerPage) ? 'disabled' : ''}`}>
                        <button className="page-link text-primary" onClick={() => paginate(currentPage + 1)}>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
        <Footer></Footer>
    </div>
  );
};

export default QnA;