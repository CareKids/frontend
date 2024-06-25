import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, InputGroup, Card, CardBody, CardTitle, CardText, Row, Col, Container } from 'reactstrap';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';

import Header from '../components/Header';
import Footer from '../components/Footer';

interface Play {
  id: number;
  title: string;
  type: string;
  content: string;
}

const Play: React.FC = () => {
    // filter 버튼 클릭 여부
    const [showFilters, setShowFilters] = useState(false);
    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };
    
    // 임시 데이터
    const plays: Play[] = [
        {
        id: 1,
        title: '공놀이',
        type: '24개월 미만',
        content: '24개월 미만 아이와 함께하기 좋은 놀이를 소개 드리겠습니다. 실내에서 할 수 있는 활동적인 놀이로...'
        },
        {
        id: 2,
        title: '밥먹기',
        type: '5세 이상 ~ 7세 미만',
        content: '야채를 안 먹는 우리 아이한테 어떻게하면 놀이를 접목시켜서 야채에 대한 거부감을 줄여줄 수 있을...'
        },
    ]

  const handleSearch = () => {
    // 검색하기 버튼 클릭 시 실행
  };

  return (
    <div className='App'>
      <Header />
      <Container className="mt-4">
        <h1 className="mb-4"><b>놀이 정보</b></h1>

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
                  <option>연령대</option>
                  {/* TODO: 연령대 목록 불러오기 */}
                </Input>
              </Col>
            </Row>
          </div>
        )}

        <div className="mb-3">
          <div>검색 결과 {plays.length}건</div>
        </div>
        
        {/* 장소 목록 리스트 */}
        <Row>
          {plays.map((result, index) => (
            <Col md={4} key={index} className="mb-4">
                <Card className="h-100">
                    <Link to={`/play/${result.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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

export default Play;