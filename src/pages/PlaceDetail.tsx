import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, CardBody, Row, Col, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faChild, faPhone, faClock, faMapMarkerAlt, faList } from '@fortawesome/free-solid-svg-icons';

import Header from '../components/Header';
import Footer from '../components/Footer';

interface PlaceDetail {
  id: string;
  category: string;
  name: string;
  address: string;
  phone: string;
  openingHours: string;
  price: string;
  tags: string[];
  features: { icon: any; label: string }[];
}

const PlaceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const placeDetail: PlaceDetail = {
    id: id || '',
    category: '음식점',
    name: '레스토랑',
    address: '서울시 강남구 테헤란로 123',
    phone: '02-1234-5678',
    openingHours: '매일 11:00 - 22:00',
    price: '1인당 20,000원 ~ 30,000원',
    tags: ['이탈리안', '파스타', '피자', '와인'],
    features: [
      { icon: faCar, label: '주차 가능' },
      { icon: faChild, label: '놀이 시설' },
    ],
  };
  
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className='App'>
      <Header></Header>
      <Container className="mt-4">
        <Button
        color="secondary"
        outline
        size="sm"
        className="mb-2 rounded-pill"
        style={{
            fontSize: '0.8rem',
            borderColor: '#6c757d',
            color: '#6c757d',
            pointerEvents: 'none' 
        }}
        >
        {placeDetail.category}
        </Button>
        <h2 className="mt-2 mb-4"><strong>{placeDetail.name}</strong></h2>
        
        <Card className="mb-4" style={{ border: 'none' }}>
        <CardBody>
          <Row className="mb-3">
          {placeDetail.features.map((feature, index) => (
              <Col key={index} xs="auto" className="text-center m-2">
              <FontAwesomeIcon icon={feature.icon} size="2x" className="mb-2" />
              <div style={{ fontSize: '0.8rem', pointerEvents: 'none' }}>{feature.label}</div>
              </Col>
          ))}
          </Row>
          
          <hr style={{ border: 'none', height: '2px', backgroundColor: '#e9ecef' }} />
          
          <Row>
          <Col md={6}>
              <p><FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />{placeDetail.address}</p>
              <p><FontAwesomeIcon icon={faPhone} className="me-2" />{placeDetail.phone}</p>
              <p><FontAwesomeIcon icon={faClock} className="me-2" />{placeDetail.openingHours}</p>
          </Col>
          <Col md={6}>
              <p><strong>가격 정보</strong></p>
              <p>{placeDetail.price}</p>
          </Col>
          </Row>
          
          <hr style={{ border: 'none', height: '2px', backgroundColor: '#e9ecef' }} />
          
          <div>
          {placeDetail.tags.map((tag, index) => (
              <Button
              key={index}
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

        <div className="text-center mt-4">
        <Button color="primary" onClick={handleGoBack}>
            <FontAwesomeIcon icon={faList} className="me-2" />
            목록으로 돌아가기
        </Button>
        </div>
      </Container>
      <Footer></Footer>
    </div>
  );
};

export default PlaceDetail;