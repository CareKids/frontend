import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList } from '@fortawesome/free-solid-svg-icons';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { getPlayDetailData } from '../api/load';
import { DetailPlayItem } from '../api/types';

const PlayDetail: React.FC = () => {
  const [playItem, setPlayItem] = useState<DetailPlayItem | null>(null);
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
        const playData = await getPlayDetailData(id);
        setPlayItem(playData);
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
  if (!playItem) return <div>No data available</div>;

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
            {playItem['age-tag'].name}
            </Button>
            <h1 className="mb-2 mt-2"><strong>{playItem.title}</strong></h1>
                
            <hr style={{ border: 'none', height: '2px', backgroundColor: '#dddddd' }} />
            <div><strong>놀이 도구</strong></div>
            <div className='mb-4' style={{ whiteSpace: 'pre-wrap',  wordBreak: 'break-word' }}>{playItem.tools}</div>
            <div><strong>추천 나이</strong></div>
            <div className='mb-4' style={{ whiteSpace: 'pre-wrap',  wordBreak: 'break-word' }}>{playItem['recommend-age']}</div>
            <div><strong>놀이 방법</strong></div>
            <div className='mb-4' style={{ whiteSpace: 'pre-wrap',  wordBreak: 'break-word' }}>{playItem.text}</div>
            <div className='mb-1'><strong>발달 영역</strong></div>
            <div className='mb-4'>
            {playItem['dev-domains'].map((domain) => (
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
                {domain.devDomainType}
              </Button>
            ))}
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