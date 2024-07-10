import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, InputGroup, Card, CardImg, CardBody, CardTitle, CardText, Row, Col } from 'reactstrap';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

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
    lat: number;
    lng: number;
  }

const PlaceMap: React.FC = () => {
    const [selectedPlace, setSelectedPlace] = useState<SearchResult | null>(null);
    const [map, setMap] = useState<any>(null);
    const [markers, setMarkers] = useState<any[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.REACT_APP_API_ID}`;
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            const center = new window.naver.maps.LatLng(37.3595704, 127.105399);
            const mapInstance = new window.naver.maps.Map('map', {
                center: center,
                zoom: 16
            });
            setMap(mapInstance);
        };

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        if (map && searchResults.length > 0) {
            const newMarkers = searchResults.map(place => {
                const marker = new window.naver.maps.Marker({
                    position: new window.naver.maps.LatLng(place.lat, place.lng),
                    map: map,
                    title: place.placeName,
                    icon: {
                        url: 'https://navermaps.github.io/maps.js.ncp/docs/img/example/pin_default.png',
                        size: new window.naver.maps.Size(24, 37),
                        anchor: new window.naver.maps.Point(12, 37),
                        scaledSize: new window.naver.maps.Size(24, 37)
                    }
                });

                window.naver.maps.Event.addListener(marker, 'click', () => handlePlaceClick(place));

                return marker;
            });

            setMarkers(newMarkers);
        }
    }, [map]);

    useEffect(() => {
        if (map && selectedPlace) {
            const position = new window.naver.maps.LatLng(selectedPlace.lat, selectedPlace.lng);
            map.setCenter(position);
            map.setZoom(18);

            markers.forEach(marker => {
                if (marker.getTitle() === selectedPlace.placeName) {
                    marker.setIcon({
                        url: 'https://navermaps.github.io/maps.js.ncp/docs/img/example/pin_default.png',
                        size: new window.naver.maps.Size(30, 46),
                        anchor: new window.naver.maps.Point(15, 46),
                        scaledSize: new window.naver.maps.Size(30, 46)
                    });
                } else {
                    marker.setIcon({
                        url: 'https://navermaps.github.io/maps.js.ncp/docs/img/example/pin_selected.png',
                        size: new window.naver.maps.Size(24, 37),
                        anchor: new window.naver.maps.Point(12, 37),
                        scaledSize: new window.naver.maps.Size(24, 37)
                    });
                }
            });
        }
    }, [selectedPlace]);
  
    const handleClick = () => {
      navigate('/search');
    };

    const handlePlaceClick = (place: SearchResult) => {
        setSelectedPlace(place);
    };

    const handleBackClick = () => {
        setSelectedPlace(null);
        if (map) {
            map.setZoom(16);
            markers.forEach(marker => marker.setIcon(null));
        }
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
            lat: 37.3595704,
            lng: 127.105399
        },
        {
            id: '2',
            category: '카페',
            placeName: '카페 B',
            address: '서울시 강남구 신사동',
            openingHours: '08:00 - 20:00',
            imageUrl: 'https://via.placeholder.com/150?text=Cafe',
            tags: ['커피', '디저트'],
            lat: 37.3605704,
            lng: 127.106399
        },
        {
            id: '3',
            category: '쇼핑',
            placeName: '상점 C',
            address: '서울시 강남구 청담동',
            openingHours: '10:00 - 22:00',
            imageUrl: 'https://via.placeholder.com/150?text=Shop',
            tags: ['의류', '액세서리'],
            lat: 37.3585704,
            lng: 127.104399
        },
    ];

    const renderListView = () => (
        <>
            <div className="p-3" style={{ width: '100%' }}>
                <button className="btn btn-primary w-100" onClick={handleClick}>다시 찾아보기</button>
            </div>
            <div>
                {searchResults.map((result, index) => (
                    <Card key={result.id} className="mb-3" style={{ border: 'none', borderBottom: '1px solid #dee2e6', cursor: 'pointer' }} onClick={() => handlePlaceClick(result)}>
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
        </>
    );



    const renderDetailView = () => (
        <div className="detail-view" style={{ padding: '0', overflowY: 'auto', maxHeight: 'calc(100vh - 80px)' }}>
            <div className="p-3">
                <Button color="primary" onClick={handleBackClick}>
                    <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                    뒤로 가기
                </Button>
            </div>
            {selectedPlace && (
                <Card className="border-0">
                    <CardImg top width="100%" src={selectedPlace.imageUrl} alt={selectedPlace.placeName} style={{ height: '300px', objectFit: 'cover' }} />
                    <CardBody>
                        <div className="mb-3">
                            {selectedPlace.tags.map((tag, index) => (
                                <Button key={index} color="primary" outline size="sm" className="me-2 mb-2 rounded-pill">
                                    {tag}
                                </Button>
                            ))}
                        </div>
                        <CardTitle tag="h4" className="mb-3"><strong>{selectedPlace.placeName}</strong></CardTitle>
                        <CardText>
                            <strong>카테고리:</strong> {selectedPlace.category}<br />
                            <strong>주소:</strong> {selectedPlace.address}<br />
                            <strong>운영시간:</strong> {selectedPlace.openingHours}
                        </CardText>
                    </CardBody>
                </Card>
            )}
        </div>
    );      

    return (        
        <div className='App'>
            <Header />
            <div className="container-fluid no-padding" style={{margin: '0px'}}>
                <div className="row no-margin">
                    <div className="col-sm-auto bg-white" style={{ width: '400px', padding: '0', overflowY: 'auto', maxHeight: 'calc(100vh - 80px)' }}>
                        {selectedPlace ? renderDetailView() : renderListView()}
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
