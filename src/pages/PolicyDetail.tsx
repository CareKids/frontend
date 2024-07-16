import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList} from '@fortawesome/free-solid-svg-icons';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { getPolicyDetailData } from '../api/load';
import { DetailPolicyItem } from '../api/types';

const PlayDetail: React.FC = () => {
  const [policyItem, setPolicyItem] = useState<DetailPolicyItem | null>(null);
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
        const policyData = await getPolicyDetailData(id);
        setPolicyItem(policyData);
      } catch (err) {
        console.error('Failed to fetch policy data:', err);
        setError('정책 정보를 불러오는 데 실패했습니다.');
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
  if (!policyItem) return <div>No data available</div>;

  return (
    <div className='App'>
        <Header></Header>
        <Container className="mt-4">
            {policyItem.region.map((region) => (
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
                {region.name}
              </Button>
            ))}
            <h1 className="mb-2 mt-2"><strong>{policyItem.title}</strong></h1>
                
            <hr style={{ border: 'none', height: '2px', backgroundColor: '#dddddd' }} />
            <div className='mb-1'><strong>대상 연령</strong></div>
            <div className='mb-4'>
            {policyItem['age-tag'].map((tag) => (
              <Button
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
                {tag.name}
              </Button>
            ))}
            </div>
            <div><strong>정책 대상</strong></div>
            <div className='mb-4' style={{ whiteSpace: 'pre-wrap',  wordBreak: 'break-word' }}>{policyItem.target}</div> <div><strong>정책 내용</strong></div>
            <div className='mb-4' style={{ whiteSpace: 'pre-wrap',  wordBreak: 'break-word' }}>{policyItem.text}</div>            
            <div><strong>신청 방법</strong></div>
            <div className='mb-4' style={{ whiteSpace: 'pre-wrap',  wordBreak: 'break-word' }}>{policyItem.process}</div>             
            <div><strong>바로 가기</strong></div>
            <div className='mb-4' style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              <a 
                href={policyItem.url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ textDecoration: 'underline', color: 'inherit' }}
              >
                홈페이지
              </a>
            </div>
            <hr style={{ border: 'none', height: '2px', backgroundColor: '#dddddd' }} />
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

export default PlayDetail;