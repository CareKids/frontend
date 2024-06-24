import React, { useState } from 'react';
import { Button, Input, InputGroup, Card, CardImg, CardBody, CardTitle, CardText, Row, Col, Container } from 'reactstrap';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';

import Header from '../components/Header';
import Footer from '../components/Footer';

interface SearchResult {
  category: string;
  placeName: string;
  address: string;
  openingHours: string;
  imageUrl: string;
  tags: string[];
}

const SearchResult: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  
  const searchResults: SearchResult[] = [
    {
      category: '음식점',
      placeName: '음식점 A',
      address: '서울시 강남구 역삼동',
      openingHours: '09:00 - 21:00',
      imageUrl: 'https://via.placeholder.com/150?text=Restaurant',
      tags: ['맛집', '한식'],
    },
    {
      category: '카페',
      placeName: '카페 B',
      address: '서울시 강남구 신사동',
      openingHours: '08:00 - 20:00',
      imageUrl: 'https://via.placeholder.com/150?text=Cafe',
      tags: ['커피', '디저트'],
    },
    {
      category: '쇼핑',
      placeName: '상점 C',
      address: '서울시 강남구 청담동',
      openingHours: '10:00 - 22:00',
      imageUrl: 'https://via.placeholder.com/150?text=Shop',
      tags: ['의류', '액세서리'],
    },
  ];

  const handleSearch = () => {
    // 검색하기 버튼 클릭 시 실행
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className='App'>
      <Header />
      <Container className="mt-4">
        <h1 className="mb-4"><b>장소</b></h1>

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

        {showFilters && (
          <div className="bg-light p-3 mb-4 rounded">
            <Row>
              <Col md={6}>
                <Input type="select" className="mb-2">
                  <option>카테고리 선택</option>
                  {/* Add category options */}
                </Input>
              </Col>
              <Col md={6}>
                <Input type="select">
                  <option>위치 선택</option>
                  {/* Add sorting options */}
                </Input>
              </Col>
            </Row>
          </div>
        )}

        <div className="mb-3">
          <div>검색 결과 {searchResults.length}건</div>
        </div>

        <Row>
          {searchResults.map((result, index) => (
            <Col md={4} key={index} className="mb-4">
              <Card className="h-100">
                <CardBody>
                  <Row>
                    <Col xs={8}>
                      <Button color="secondary" size="sm" className="mb-2" disabled>{result.category}</Button>
                      <CardTitle tag="h5" className="mb-3"><strong>{result.placeName}</strong></CardTitle>
                      <CardText>
                        <strong>주소 · </strong> {result.address}<br />
                        <strong>운영시간 · </strong> {result.openingHours}
                      </CardText>
                    </Col>
                    <Col xs={4}>
                      <CardImg src={result.imageUrl} alt={result.placeName} className="img-fluid rounded" style={{height: '100%', objectFit: 'cover'}} />
                    </Col>
                  </Row>
                  <div className="mt-3">
                    {result.tags.map((tag, tagIndex) => (
                      <Button
                        key={tagIndex}
                        color="primary"
                        outline
                        size="sm"
                        className="me-2 mb-2 rounded-pill"
                        style={{ fontSize: '0.8rem', pointerEvents: 'none' }}
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
        
        {/* TODO: Paginateion */}
        {/* <div className="d-flex justify-content-center">
          <Pagination>
              <PaginationItem>
              <PaginationLink first href="#" />
              </PaginationItem>
              <PaginationItem>
              <PaginationLink previous href="#" />
              </PaginationItem>
              <PaginationItem active>
              <PaginationLink href="#">
                  1
              </PaginationLink>
              </PaginationItem>
              <PaginationItem>
              <PaginationLink href="#">
                  2
              </PaginationLink>
              </PaginationItem>
              <PaginationItem>
              <PaginationLink next href="#" />
              </PaginationItem>
              <PaginationItem>
              <PaginationLink last href="#" />
              </PaginationItem>
          </Pagination>
        </div> */}
      </Container>
      <Footer />
    </div>    
  );
};

export default SearchResult;