import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Card, CardBody, CardTitle, CardText, CardImg, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import Header from '../components/Header';
import './PlaceMap.css'

import { PlaceMapItem } from '../api/types';

interface Recommendation {
    id: string;
    metadata: PlaceMapItem;
}
  
interface LocationState {
    searchResults: {
        recommendations: Recommendation[];
    };
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  paginate: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, paginate }) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPages = 10;
    const sidePages = 4;

    if (totalPages <= maxPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pageNumbers.push(1);

    if (currentPage > sidePages + 1) {
      pageNumbers.push('...');
    }

    const start = Math.max(2, currentPage - sidePages);
    const end = Math.min(totalPages - 1, currentPage + sidePages);

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    if (currentPage < totalPages - sidePages) {
      pageNumbers.push('...');
    }

    pageNumbers.push(totalPages);

    return pageNumbers;
  };

  return (
    <nav aria-label="Page navigation" className="mt-4 bg-transparent">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button className="page-link text-primary" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
        </li>
        {getPageNumbers().map((number, index) => (
          <li key={index} className={`page-item ${currentPage === number ? 'active' : ''}`}>
            {number === '...' ? (
              <span className="page-link">...</span>
            ) : (
              <button
                onClick={() => paginate(number as number)}
                className={`page-link ${currentPage === number ? 'bg-primary border-primary' : 'text-primary'}`}
              >
                {number}
              </button>
            )}
          </li>
        ))}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button className="page-link text-primary" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </li>
      </ul>
    </nav>
  );
};

const PlaceMap: React.FC = () => {
    const [selectedPlace, setSelectedPlace] = useState<PlaceMapItem | null>(null);
    const [map, setMap] = useState<any>(null);
    const [markers, setMarkers] = useState<any[]>([]);
    const [searchResults, setSearchResults] = useState<PlaceMapItem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [wordcloudImage, setWordcloudImage] = useState<string | null>(null);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [imageError, setImageError] = useState<string | null>(null);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const state = location.state as LocationState;
        if (state && state.searchResults) {
            const results = state.searchResults.recommendations.map(item => item.metadata);
            setSearchResults(results);
        }
    }, [location]);

    useEffect(() => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.REACT_APP_API_ID}`;
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            if (searchResults.length > 0) {
                const center = new window.naver.maps.LatLng(searchResults[0].latitude, searchResults[0].longitude);
                const mapInstance = new window.naver.maps.Map('map', {
                    center: center,
                    zoom: 14
                });
                setMap(mapInstance);
            }
        };

        return () => {
            document.body.removeChild(script);
        };
    }, [searchResults]);

    useEffect(() => {
        if (map) {
            markers.forEach(marker => marker.setMap(null));

            const indexOfLastItem = currentPage * itemsPerPage;
            const indexOfFirstItem = indexOfLastItem - itemsPerPage;
            const currentItems = searchResults.slice(indexOfFirstItem, indexOfLastItem);

            const newMarkers = currentItems.map(place => {
                const marker = new window.naver.maps.Marker({
                    position: new window.naver.maps.LatLng(place.latitude, place.longitude),
                    map: map,
                    title: place.content,
                });

                window.naver.maps.Event.addListener(marker, 'click', () => handlePlaceClick(place));

                return marker;
            });

            setMarkers(newMarkers);
        }
    }, [map, searchResults, currentPage]);

    useEffect(() => {
        if (selectedPlace && selectedPlace.wordcloud_img_arr) {
            setIsImageLoading(true);
            setImageError(null);
            fetch('http://localhost:5000/decode_image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ base64_encode_str: selectedPlace.wordcloud_img_arr }),
                credentials: 'include',
            })
            .then(response => response.json())
            .then(data => {
                setWordcloudImage(data.img_data);
                setIsImageLoading(false);
            })
            .catch(error => {
                console.error('Error fetching wordcloud image:', error);
                setImageError('워드클라우드 이미지를 불러오는데 실패했습니다.');
                setIsImageLoading(false);
            });
        } else {
            setWordcloudImage(null);
        }
    }, [selectedPlace]);

    const handleClick = () => {
      navigate('/search');
    };

    const handlePlaceClick = (place: PlaceMapItem) => {
        setSelectedPlace(place);
        
        if (map) {
            map.setCenter(new window.naver.maps.LatLng(place.latitude, place.longitude));
            map.setZoom(17);
        }
    };

    const handleBackClick = () => {
        setSelectedPlace(null);
        if (map) {
            map.setZoom(14);
        }
    };

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = searchResults.slice(indexOfFirstItem, indexOfLastItem);

    const renderListView = () => (
        <>
            <div className="p-3" style={{ width: '100%' }}>
                <button className="btn btn-primary w-100" onClick={handleClick}>다시 찾아보기</button>
            </div>
            <div>
            {currentItems.map((result, index) => (
                    <Card key={result.content} className="" style={{ border: 'none', borderBottom: '1px solid #dee2e6', cursor: 'pointer' }} onClick={() => handlePlaceClick(result)}>
                        <CardBody>
                            <Row>
                                <Row className="align-items-center mb-2 pe-0">
                                    <Col>
                                    <Button color="secondary" size="sm" className="mb-2" disabled>{result.large_category}</Button>
                                    <CardTitle tag="h5" className="mb-2"><strong>{result.content}</strong></CardTitle>
                                    </Col>
                                </Row>
                                <CardText>
                                    <strong>AI 별점 · </strong> {(result.ai_score * 10).toFixed(1)}<br />
                                    <strong>주소 · </strong> {result.new_address}<br />
                                    <strong>전화번호 · </strong> {result.tel_number}<br />
                                </CardText>
                            </Row>
                        </CardBody>
                    </Card>
                ))}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(searchResults.length / itemsPerPage)}
                paginate={paginate}
            />
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
                    <CardBody>
                        <Button color="secondary" size="sm" className="mb-2" disabled>{selectedPlace.large_category}</Button>
                        <CardTitle tag="h4" className="mb-3"><strong>{selectedPlace.content}</strong></CardTitle>
                        <CardText tag="div">
                            <div className="mb-3">
                                <strong>AI 별점</strong>
                                <span className="small"> (리뷰 데이터 활용 자동 생성)</span>
                                <div>{(selectedPlace.ai_score * 10).toFixed(1)}</div>
                            </div>
                            <div className="mb-3">
                                <strong>자치구</strong>
                                <div>{selectedPlace.gu_name}</div>
                            </div>
                            <div className="mb-3">
                                <strong>상세 주소</strong>
                                <div>{selectedPlace.new_address}</div>
                            </div>
                            <div className="mb-3">
                                <strong>전화번호</strong>
                                <div>{selectedPlace.tel_number}</div>
                            </div>
                            <div className="mb-3">
                                <strong>장소 설명</strong>
                                <div>{selectedPlace.facility_introduction}</div>
                            </div>
                            <div className="mb-3">
                                <strong>키워드</strong>
                                <div>
                                    {selectedPlace.positive_keyword.split(',').map((keyword, index) => (
                                        <Button
                                            key={index}
                                            color="secondary"
                                            outline
                                            size="sm"
                                            className="mb-2 me-2"
                                            style={{
                                                fontSize: '0.8rem',
                                                borderColor: '#6c757d',
                                                color: '#6c757d',
                                                pointerEvents: 'none'
                                            }}
                                        >
                                            {keyword.trim()}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            {isImageLoading && <div>워드클라우드 이미지 로딩 중...</div>}
                            {imageError && <div className="text-danger">{imageError}</div>}                            
                            {wordcloudImage && (
                                <div className="mb-3">
                                    <strong>워드클라우드</strong>
                                    <img src={wordcloudImage} alt="Wordcloud" style={{width: '100%', height: 'auto'}} />
                                </div>
                            )}
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