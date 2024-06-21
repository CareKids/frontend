import React from 'react';
import { Button, Input, InputGroup, Card, CardImg, CardBody, CardTitle, CardText } from 'reactstrap';

import Header from '../components/Header'
import Footer from '../components/Footer'

const SearchResult = () => {
  // 예시 데이터
  const searchResults = [
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
    // 다른 검색 결과들...
  ];

  const handleSearch = () => {
    // 검색하기 버튼 클릭 시 실행될 함수
  };

  return (
    <div className='App'>
        <Header></Header>
        <div className="container mt-4">
            <h1><b>장소</b></h1>

            <div className="mb-3">
                <InputGroup>
                    <Input placeholder="검색어 입력" />
                    <Button outline color="secondary">필터</Button>
                    <Button color="primary" onClick={handleSearch}>검색하기</Button>
                </InputGroup>
            </div>

            <div className="mb-3">
                <div>검색 결과 {searchResults.length}건</div>
            </div>

            <div className="row">
            {searchResults.map((result, index) => (
                <div key={index} className="col-lg-4 mb-4">
                <Card> 
                    <CardImg top src={result.imageUrl} style={{ maxHeight: '200px', objectFit: 'cover' }} alt={result.placeName} />

                    <CardBody>
                    <Button color="secondary" disabled>{result.category}</Button>

                    <CardTitle className="mt-3">{result.placeName}</CardTitle>

                    <CardText>
                        <strong>주소 · </strong> {result.address}<br />
                        <strong>운영시간 · </strong> {result.openingHours}
                    </CardText>

                    <div className="mt-3">
                        {result.tags.map((tag, tagIndex) => (
                        <Button key={tagIndex} outline color="info" className="mr-2">{tag}</Button>
                        ))}
                    </div>
                    </CardBody>
                </Card>
                </div>
            ))}
            </div>
        </div>
        <Footer></Footer>
    </div>    
  );
};

export default SearchResult;
