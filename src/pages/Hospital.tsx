import React, { useState } from 'react';
import { Button, Input, InputGroup, Card, CardBody, CardTitle, CardText, Row, Col, Container } from 'reactstrap';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';

import Header from '../components/Header';
import Footer from '../components/Footer';

interface Hospital {
  id: number;
  placeName: string;
  phone: string;
  address: string;
  type: string;
  openingHours: string;
}

const Hospital: React.FC = () => {
  // filter 버튼 클릭 여부
  const [showFilters, setShowFilters] = useState(false);
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // 임시 데이터
  const hospitals: Hospital[] = [
    {
      id: 1,
      placeName: '케어키즈 소아과',
      address: '서울시 강남구 역삼동',
      phone: '010-1234-5678',
      type: '내과',
      openingHours: '09:00 - 21:00',
    },
    {
      id: 2,
      placeName: '키즈케어 약국',
      address: '서울시 강남구 신사동',
      phone: '010-1234-5678',
      type: '약국',
      openingHours: '08:00 - 20:00',
    },
  ];

  const handleSearch = () => {
    // 검색하기 버튼 클릭 시 실행
  };

  return (
    <div className='App'>
      <Header />
      <Container className="mt-4">
        <h1 className="mb-4"><b>긴급 진료기관</b></h1>

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
                <Input type="select">
                  <option>위치 선택</option>
                  {/* TODO: 지역 목록 불러오기 */}
                </Input>
              </Col>
            </Row>
          </div>
        )}

        <div className="mb-3">
          <div>검색 결과 {hospitals.length}건</div>
        </div>
        
        {/* 장소 목록 리스트 */}
        <Row>
          {hospitals.map((result, index) => (
            <Col md={4} key={index} className="mb-4">
              <Card className="h-100">
                <CardBody>
                  <Row>
                    <Col>
                      <Button color="secondary" size="sm" className="mb-2" disabled>{result.type}</Button>
                      <CardTitle tag="h5" className="mb-2"><strong>{result.placeName}</strong></CardTitle>
                      <CardText>
                        <strong>진료 항목 · </strong> {result.type}<br />
                        <strong>주소 · </strong> {result.address}<br />
                        <strong>연락처 · </strong> {result.phone}<br />
                        <strong>운영시간 · </strong> {result.openingHours}
                      </CardText>
                    </Col>
                  </Row>
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

export default Hospital;