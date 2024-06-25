import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, InputGroup, Card, CardImg, CardBody, CardTitle, CardText, Row, Col } from 'reactstrap';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';

import Header from '../components/Header';
import './PlaceMap.css'

interface SearchResult {
    id: string;
    category: string;
    placeName: string;
    address: string;
    openingHours: string;
    imageUrl: string;
    tags: string[];
  }

const PlaceMap: React.FC = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.REACT_APP_API_ID}`;
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            const center = new window.naver.maps.LatLng(37.3595704, 127.105399);
            const map = new window.naver.maps.Map('map', {
                center: center,
                zoom: 16
            });
        };

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const navigate = useNavigate();
  
    const handleClick = () => {
      navigate('/search');
    };

    const searchResults: SearchResult[] = [
        {
            id: '1',
            category: '음식점',
            placeName: '음식점 A',
            address: '서울시 강남구 역삼동',
            openingHours: '09:00 - 21:00',
            imageUrl: 'https://via.placeholder.com/150?text=Restaurant',
            tags: ['맛집', '한식'],
        },
        {
            id: '2',
            category: '카페',
            placeName: '카페 B',
            address: '서울시 강남구 신사동',
            openingHours: '08:00 - 20:00',
            imageUrl: 'https://via.placeholder.com/150?text=Cafe',
            tags: ['커피', '디저트'],
        },
        {
            id: '3',
            category: '쇼핑',
            placeName: '상점 C',
            address: '서울시 강남구 청담동',
            openingHours: '10:00 - 22:00',
            imageUrl: 'https://via.placeholder.com/150?text=Shop',
            tags: ['의류', '액세서리'],
        },
      ];

      
    const [likedPlaces, setLikedPlaces] = useState<string[]>([]);
    
    const handleLike = (id: string) => {
        setLikedPlaces(prev => {
            const isLiked = prev.includes(id);
            return isLiked ? prev.filter(placeId => placeId !== id) : [...prev, id];
        });
    };
    
    const isLiked = (id: string) => likedPlaces.includes(id);

    return (        
        <div className='App'>
            <Header />
            <div className="container-fluid no-padding" style={{margin: '0px'}}>
                <div className="row no-margin">
                    <div className="col-sm-auto bg-white" style={{ minWidth: '400px', padding: '0px', overflowY: 'auto', maxHeight: 'calc(100vh - 80px)' }}>
                        <div className="p-3" style={{ width: '100%' }}>
                            <button className="btn btn-primary w-100" onClick={handleClick}>다시 찾아보기</button>
                        </div>
                        <div>
                        {searchResults.map((result, index) => (
                             <Card className="mb-3" style={{ border: 'none', borderBottom: '1px solid #dee2e6' }}>
                             <CardBody>
                               <Row>
                                 <CardImg 
                                   src={result.imageUrl} 
                                   alt={result.placeName} 
                                   className="img-fluid rounded" 
                                   style={{
                                     objectFit: 'cover',
                                     height: '200px',
                                     width: '100%'
                                   }} 
                                 />
                                    <Row className="align-items-center mb-3 mt-3 pe-0">
                                        <Col>
                                            <CardTitle tag="h5" className="mb-0"><strong>{result.placeName}</strong></CardTitle>
                                        </Col>
                                        <Col xs="auto" className='pe-0'>
                                            <Button
                                            color="link"
                                            className="p-0"
                                            onClick={() => handleLike(result.id)}
                                            >
                                            <FontAwesomeIcon 
                                                icon={isLiked(result.id) ? faHeart : farHeart} 
                                                size="lg"
                                                className={isLiked(result.id) ? "text-danger" : "text-secondary"}
                                            />
                                            </Button>
                                        </Col>
                                        </Row>
                                    <CardText>
                                        <strong>주소 · </strong> {result.address}<br />
                                        <strong>운영시간 · </strong> {result.openingHours}
                                    </CardText>
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
                        ))}
                        </div>
                        <div className="d-flex justify-content-center">
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
                        </div>
                    </div>
                <div className="col" style={{padding: '0px'}}>
                    <div id="map" className="h-screen relative z-0" style={{ height: 'calc(100vh - 80px)' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlaceMap;
