import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, InputGroup, Card, CardImg, CardBody, CardTitle, CardText, Row, Col, Container } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { getPlaceData, filterPlaceData, getRegionAndCate } from '../api/load';
import { PlaceInfo, Region, MainCate } from '../api/types';
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 12;
const SearchResult: React.FC = () => {
  const [placeInfo, setPlaceInfo] = useState<PlaceInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);  
  const [maincates, setMaincate] = useState<MainCate[]>([]);
  const [selectedMaincate, setSelectedMaincate] = useState<MainCate | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchRegionsAndMainCate();
    fetchInitialPlaceData();
  }, []);

  useEffect(() => {
    searchAndFilter();
  }, [selectedRegion, selectedMaincate]);

  const fetchRegionsAndMainCate = async () => {
    try {
      const data = await getRegionAndCate();
      setRegions(data.region);
      setMaincate(data.categories);
    } catch (err) {
      console.error('Failed to fetch regions:', err);
      setError('지역 정보를 불러오는 데 실패했습니다.');
    }
  };

  const fetchInitialPlaceData = async () => {
    setLoading(true);
    try {
      const data = await getPlaceData(currentPage, ITEMS_PER_PAGE);
      setPlaceInfo(data);

      if (!selectedRegion && data.region) {
        setSelectedRegion(data.region);
      }  
    } catch (err) {
      setError('장소 정보를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const searchAndFilter = async (page: number = currentPage) => {
    if (!searchTerm && !selectedRegion) {
      return fetchInitialPlaceData();
    }

    setLoading(true);
    try {
      const data = await filterPlaceData(
        { 
          query: searchTerm || null, 
          region: selectedRegion || {},
          maincate: selectedMaincate || {}
        }, 
        page
      );
      setPlaceInfo(data);
      setCurrentPage(page);
    } catch (err) {
      setError('검색에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchAndFilter = () => {
    searchAndFilter(1);
  };

  const handleRegionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const regionId = Number(event.target.value);
    const selectedRegion = regions.find(region => region.id === regionId) || null;
    setSelectedRegion(selectedRegion);
  };

  const handleMaincateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const cateId = Number(event.target.value);
    const selectedMaincate = maincates.find(cate => cate.id === cateId) || null;
    setSelectedMaincate(selectedMaincate);
  };

  const paginate = (pageNumber: number) => {
    searchAndFilter(pageNumber);
  };
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!placeInfo) return <div>No data available</div>;

  const totalPages = placeInfo.pageInfo.total;

  return (
    <div className='App'>
      <Header />
      <Container className="mt-4">
        <h1 className="mb-4"><b>장소</b></h1>

        <div className="bg-white rounded-4 p-3 mb-4">
          <InputGroup>
            <Input 
              placeholder="검색어 입력" 
              className="border-1" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button color="primary" className="me-2" onClick={toggleFilters}>
              <FontAwesomeIcon icon={faFilter} className="me-2 rounded-4" />
              필터
            </Button>
            <Button color="primary" onClick={handleSearchAndFilter}>
              <FontAwesomeIcon icon={faSearch} className="me-2 rounded-4" />
              검색하기
            </Button>
          </InputGroup>
        </div>

        {showFilters && (
          <div className="bg-light p-3 mb-4 rounded">
            <Row>
              <Col md={6}>
                <Input 
                  type="select" 
                  value={selectedRegion?.id || ''} 
                  onChange={handleRegionChange}
                >
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>{region.name}</option>
                  ))}
                </Input>
              </Col>
              <Col md={6}>
                <Input 
                  type="select" 
                  value={selectedMaincate?.id || ''} 
                  onChange={handleMaincateChange}
                >
                  {maincates.map((cate) => (
                    <option key={cate.id} value={cate.id}>{cate.name}</option>
                  ))}
                </Input>
              </Col>
            </Row>
          </div>
        )}
        
        {placeInfo && placeInfo.pageList && placeInfo.pageList.length > 0 ? (
          <Row>
            {placeInfo.pageList.map((result, index) => (
              <Col md={4} key={index} className="mb-4">
                <Card className="h-100">
                  <Link to={`/place/${result.placeId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <CardBody>
                      <Row>
                        <Col xs={8}>
                          <Button color="secondary" size="sm" className="mb-2" disabled>{result.placeMaincate.name}</Button>
                          <CardTitle tag="h5" className="mb-2"><strong>{result.placeName}</strong></CardTitle>
                          <CardText>
                            <strong>주소 · </strong> {result.placeNewAddress}<br />
                            <strong>운영시간 · </strong> {result.placeOperateTime}
                          </CardText>
                        </Col>
                        <Col xs={4}>
                          <CardImg src={result.placeImgUrl} alt={result.placeName} className="img-fluid rounded" style={{height: '100%', maxHeight: '200px', objectFit: 'cover'}} />
                        </Col>
                      </Row>
                      <div className="mt-3">
                        {result.placeKeywords && result.placeKeywords.length > 0 ? (
                          result.placeKeywords.map((tag, tagIndex) => (
                            <Button
                              key={tagIndex}
                              color="primary"
                              outline
                              size="sm"
                              className="me-2 mb-2 rounded-pill"
                              style={{ fontSize: '0.8rem', pointerEvents: 'none' }}
                            >
                              {tag.keywordName}
                            </Button>
                          ))
                        ) : (
                          <div></div>
                        )}
                      </div>
                    </CardBody>
                  </Link>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p>결과가 없습니다.</p>
        )}
        
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        />
      </Container>
      <Footer />
    </div>    
  );
};

export default SearchResult;