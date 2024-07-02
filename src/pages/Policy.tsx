import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, InputGroup, Card, CardBody, CardTitle, CardText, Row, Col, Container } from 'reactstrap';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import Header from '../components/Header';
import Footer from '../components/Footer';

interface Policies {
  id: number;
  title: string;
  type: string;
  content: string;
}

const Policy: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  // filter 버튼 클릭 여부
  const [showFilters, setShowFilters] = useState(false);
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
    
  // 임시 데이터
  const policies: Policies[] = [
    {
      id: 1,
      title: '모르면 손해 보는 2024년 달라지는 육아...',
      type: '강남구',
      content: '【베이비뉴스 김솔미 기자】 엄마아빠가 꼭 알아야 할 2024년 달라지는 육아 정책 13가지, 싹 다 모아봤어. 1. 첫만남이용권 바우처 다자녀 가구 지원 확대...'
    },
    {
      id: 2,
      title: '2024년 달라지는 육아정책 13가지',
      type: '강서구',
      content: '생애 초기 아동이 충분한 돌봄을 받을 수 있도록 부모급여 지원금액이 확대됐어. 지원대상은 0~1세 아동으로 0세는 월 70만 원에서 100만 원으로, 1세는 월 35만 원에서 50만 원으로 상향됐어. 지급방식은 현금 또는 바우처인데, 어린이집을 이용하는 경우 보육료...'
    },
  ]

  const filteredPosts = policies.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = () => {
    // 검색하기 버튼 클릭 시 실행
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className='App'>
      <Header />
      <Container className="mt-4">
        <h1 className="mb-4"><b>정책</b></h1>

        {/* 검색창 */}
        <div className="bg-white rounded-4 p-3 mb-4">
          <InputGroup>
            <Input placeholder="검색어 입력" className="border-1" />
            <Button color="primary" className="me-2" onClick={toggleFilters}>
              <FontAwesomeIcon icon={faFilter} className="me-2 rounded-4" />
              필터
            </Button>
            <Button color="primary" onClick={handleSearch}>
              <FontAwesomeIcon icon={faSearch} className="me-2 rounded-4" />
              검색하기
            </Button>
          </InputGroup>
        </div>

        {/* 필터 */}
        {showFilters && (
          <div className="bg-light p-3 mb-4 rounded">
            <Row>
              <Col md={6}>
                <Input type="select" className="mb-2">
                  <option>지역</option>
                  {/* TODO: 지역 목록 불러오기 */}
                </Input>
              </Col>
              <Col md={6}>
                <Input type="select">
                  <option>연령대</option>
                  {/* TODO: 연령대 목록 불러오기 */}
                </Input>
              </Col>
            </Row>
          </div>
        )}

        <div className="mb-3">
          <div>검색 결과 {policies.length}건</div>
        </div>
        
        {/* 정책 목록 리스트 */}
        <Row>
          {policies.map((result, index) => (
            <Col md={4} key={index} className="mb-4">
                <Card className="h-100">
                    <Link to={`/policy/${result.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <CardBody>
                            <Row>
                                <Col>
                                    <Button color="secondary" size="sm" className="mb-2" disabled>{result.type}</Button>
                                    <CardTitle tag="h5" className="mb-2"><strong>{result.title}</strong></CardTitle>
                                    <CardText>
                                        {result.content}
                                    </CardText>
                                </Col>
                            </Row>
                        </CardBody>
                    </Link>
                </Card>
            </Col>
          ))}
        </Row>        
                
        <nav aria-label="Page navigation" className="mt-4 bg-transparent">
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
      </Container>
      <Footer />
    </div>    
  );
};

export default Policy;