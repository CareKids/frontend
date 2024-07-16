import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, InputGroup, Card, CardBody, CardTitle, CardText, Row, Col, Container } from 'reactstrap';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { getPolicyData, filterPolicyData, getRegions, getAgeTags } from '../api/load';
import { PolicyBoardInfo, PolicyItem, Region, AgeTag } from '../api/types';

const formatTime = (time: number): string => {
  return time.toString().padStart(2, '0');
};

const ITEMS_PER_PAGE = 12;
const Policy: React.FC = () => {
  const [policyInfo, setPolicyInfo] = useState<PolicyBoardInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedAge, setSelectedAge] = useState<AgeTag | null>(null);
  const [ages, setAges] = useState<AgeTag[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [regions, setRegions] = useState<Region[]>([]);

  useEffect(() => {
    fetchRegions();
    fetchAges();
    fetchInitialPolicyData();
  }, []);

  useEffect(() => {
    searchAndFilter();
  }, [selectedRegion, selectedAge]);  

  const fetchRegions = async () => {
    try {
      const regionData = await getRegions();
      setRegions(regionData);
    } catch (err) {
      console.error('Failed to fetch regions:', err);
      setError('지역 정보를 불러오는 데 실패했습니다.');
    }
  };

  const fetchAges = async () => {
    try {
      const ageData = await getAgeTags();
      setAges(ageData);
    } catch (err) {
      console.error('Failed to fetch ages:', err);
      setError('나이 정보를 불러오는 데 실패했습니다.');
    }
  };

  const fetchInitialPolicyData = async () => {
    setLoading(true);
    try {
      const data = await getPolicyData(currentPage, ITEMS_PER_PAGE);
      setPolicyInfo(data);

      if (!selectedRegion && data.region) {
        setSelectedRegion(data.region);
      }

      if (!selectedAge && data['age-tag']) {
        setSelectedAge(data['age-tag'])
      }      
    } catch (err) {
      setError('정책 정보를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const searchAndFilter = async (page: number = currentPage) => {
    if (!searchTerm && !selectedRegion) {
      return fetchInitialPolicyData();
    }

    setLoading(true);
    try {
      const data = await filterPolicyData(
        { 
          query: searchTerm || null, 
          region: selectedRegion || {},
          "age-tag": selectedAge || {}
        }, 
        page
      );
      setPolicyInfo(data);
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

  const handleAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const ageId = Number(event.target.value);
    const selectedAge = ages.find(age => age.id === ageId) || null;
    setSelectedAge(selectedAge);
  };

  const paginate = (pageNumber: number) => {
    searchAndFilter(pageNumber);
  };
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!policyInfo) return <div>No data available</div>;

  const totalPages = policyInfo.pageInfo.total;

  return (
    <div className='App'>
      <Header />
      <Container className="mt-4">
        <h1 className="mb-4"><b>정책</b></h1>

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
                  value={selectedAge?.id || ''} 
                  onChange={handleAgeChange}
                >
                  {ages.map((age) => (
                    <option key={age.id} value={age.id}>{age.name}</option>
                  ))}
                </Input>
              </Col>
            </Row>
          </div>
        )}

        <Row>
          {policyInfo.pageList.map((item: PolicyItem) => (
            <div className="col-md-4 mb-4" key={item.id}>
              <div className="card" style={{ borderRadius: '10px', backgroundColor: '#ffffff' }}>
                <Link to={`/policy/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="card-body">
                      <h4 className="card-title"
                          style={{
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-word',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: 'vertical',
                          }}>{item.title}</h4>
                      <div className="card-text mb-2" 
                          style={{
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-word',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 5,
                              WebkitBoxOrient: 'vertical',
                              minHeight: '100px',
                              maxHeight: '100px',
                              fontSize: '14px'
                          }}>
                          {item.description}
                      </div>
                    </div>
                </Link>
              </div>
          </div>
          ))}
        </Row>
        
        <nav aria-label="Page navigation" className="mt-4 bg-transparent">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link text-primary" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
            </li>
            {Array.from({ length: totalPages }).map((_, index) => (
              <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                <button
                  onClick={() => paginate(index + 1)}
                  className={`page-link ${currentPage === index + 1 ? 'bg-primary border-primary' : 'text-primary'}`}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link text-primary" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </li>
          </ul>
        </nav>
      </Container>
      <Footer />
    </div>    
  );
};

export default Policy;