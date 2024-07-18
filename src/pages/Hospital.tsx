import React, { useState, useEffect } from 'react';
import { Button, Input, InputGroup, Card, CardBody, CardTitle, CardText, Row, Col, Container } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Pagination from '../components/Pagination';

import { getHospitalData, filterHospitalData, getRegions } from '../api/load';
import { HospitalInfo, HospitalItem, Region } from '../api/types';

const formatTime = (time: number): string => {
  return time.toString().padStart(2, '0');
};

const ITEMS_PER_PAGE = 12;
const Hospital: React.FC = () => {
  const [hospitalInfo, setHospitalInfo] = useState<HospitalInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [regions, setRegions] = useState<Region[]>([]);

  useEffect(() => {
    fetchRegions();
    fetchInitialHospitalData();
  }, []);

  useEffect(() => {
    searchAndFilter();
  }, [selectedRegion]);

  const fetchRegions = async () => {
    try {
      const regionData = await getRegions();
      setRegions(regionData);
    } catch (err) {
      console.error('Failed to fetch regions:', err);
      setError('지역 정보를 불러오는 데 실패했습니다.');
    }
  };

  const fetchInitialHospitalData = async () => {
    setLoading(true);
    try {
      const data = await getHospitalData(currentPage, ITEMS_PER_PAGE);
      setHospitalInfo(data);

      if (!selectedRegion && data.region) {
        setSelectedRegion(data.region);
      }

    } catch (err) {
      setError('병원 정보를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const searchAndFilter = async (page: number = currentPage) => {
    if (!searchTerm && !selectedRegion) {
      return fetchInitialHospitalData();
    }

    setLoading(true);
    try {
      const data = await filterHospitalData(
        { 
          query: searchTerm || null, 
          region: selectedRegion || {}
        }, 
        page
      );
      setHospitalInfo(data);
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

  const toggleFilters = () => setShowFilters(!showFilters);

  const handleRegionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const regionId = Number(event.target.value);
    const selectedRegion = regions.find(region => region.id === regionId) || null;
    setSelectedRegion(selectedRegion);
  };

  const paginate = (pageNumber: number) => {
    searchAndFilter(pageNumber);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!hospitalInfo) return <div>No data available</div>;

  const totalPages = hospitalInfo.pageInfo.total;

  return (
    <div className='App'>
      <Header />
      <Container className="mt-4">
        <h1 className="mb-4"><b>긴급 진료기관</b></h1>

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
            </Row>
          </div>
        )}
        
        <Row>
          {hospitalInfo.pageList.map((hospital: HospitalItem) => (
            <Col md={4} key={hospital.id} className="mb-4">
              <Card className="h-100">
                <CardBody>
                  <Row>
                    <Col>
                      <Button color="secondary" size="sm" className="mb-2" disabled>{hospital.region.name}</Button>
                      <CardTitle tag="h5" className="mb-2"><strong>{hospital.name}</strong></CardTitle>
                      <CardText>
                        <strong>진료 항목 · </strong> {hospital.type}<br />
                        <strong>주소 · </strong> {hospital["new-address"] || hospital.address}<br />
                        <strong>연락처 · </strong> {hospital.phone}<br />
                        <strong>운영시간 · </strong> 
                        {hospital["operate-time"].map((time, index) => (
                          <span key={index}>
                            {time["operation-day"]}: {formatTime(time.startTime[0])}:{formatTime(time.startTime[1])} - {formatTime(time.endTime[0])}:{formatTime(time.endTime[1])}
                            {index < hospital["operate-time"].length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </CardText>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
        
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

export default Hospital;