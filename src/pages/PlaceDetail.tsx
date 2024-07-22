import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, CardBody, Row, Col, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faChild, faPhone, faClock, faMapMarkerAlt, faList } from '@fortawesome/free-solid-svg-icons';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { getPlaceDetailData } from '../api/load';
import { PlaceAdminItem } from '../api/adminTypes';

const PlaceDetail: React.FC = () => {
  const [placeItem, setPlaceItem] = useState<PlaceAdminItem | null>(null);
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setError('유효하지 않은 ID입니다.');
      setLoading(false);
      return;
    }

    const fetchItem = async () => {    
      setLoading(true);
      try {
        const placeData = await getPlaceDetailData(id);
        setPlaceItem(placeData);
      } catch (err) {
        console.error('Failed to fetch play data:', err);
        setError('놀이 정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchItem();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!placeItem) return <div>No data available</div>;

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
        {placeItem.maincate.name}
        </Button>
        <h2 className="mt-2 mb-4"><strong>{placeItem.name}</strong></h2>
        
        <Card className="mb-4" style={{ border: 'none' }}>
        <CardBody>
          <Row className="mb-3">
              <Col xs="auto" className="text-center m-2">
                <FontAwesomeIcon icon={faCar} size="2x" className="mb-2" />
                <div style={{ fontSize: '0.8rem', pointerEvents: 'none' }}>{placeItem['parking-type']}</div>
              </Col>
              <Col xs="auto" className="text-center m-2">
                <FontAwesomeIcon icon={faChild} size="2x" className="mb-2" />
                <div style={{ fontSize: '0.8rem', pointerEvents: 'none' }}>{placeItem.type}</div>
              </Col>
          </Row>
          
          <hr style={{ border: 'none', height: '2px', backgroundColor: '#e9ecef' }} />
          
          <Row>
          <Col md={6}>
              <p><FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />{placeItem["new-address"]}</p>
              <p><FontAwesomeIcon icon={faPhone} className="me-2" />{placeItem.phone}</p>
              <p><FontAwesomeIcon icon={faClock} className="me-2" />{placeItem['operate-time']? placeItem['operate-time']: '정보없음'}</p>
          </Col>
          <Col md={6}>
              <p><strong>가격 정보</strong></p>
              <p>{placeItem['is-free']}</p>
          </Col>
          </Row>
          
          <hr style={{ border: 'none', height: '2px', backgroundColor: '#e9ecef' }} />
          
          <div>
          {placeItem.keywords.map((keyword, index) => (
              <Button
              key={index}
              color="primary"
              outline
              size="sm"
              className="me-2 mb-2 rounded-pill"
              style={{ fontSize: '0.8rem', pointerEvents: 'none' }}
              >
              {keyword.keywordName}
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