import React, { useState, useEffect, useCallback, useRef  } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Card, CardBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faDownload } from '@fortawesome/free-solid-svg-icons';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { getQnADetailData } from '../api/load';
import { DetailQnaInfo, ApiError } from '../api/types';

function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'message' in error &&
    typeof (error as ApiError).status === 'number' &&
    typeof (error as ApiError).message === 'string'
  );
}

const QnADetail: React.FC = () => {
  const [qnaInfo, setQnaInfo] = useState<DetailQnaInfo | null>(null);
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const fetchAttemptedRef = useRef(false);

  const fetchItem = useCallback(async () => {
    if (!id || fetchAttemptedRef.current) return;

    fetchAttemptedRef.current = true;
    setLoading(true);

    try {
      const qnaData = await getQnADetailData(id);
      setQnaInfo(qnaData);
    } catch (err) {
      if (isApiError(err)) {
        if (err.status === 400 && err.message === " 잠겨 있는 글입니다.") {
          alert("비밀글입니다.");
          navigate('/qna', { replace: true });
        } else {
          setError(err.message);
        }
      } else {
        setError('문의 사항을 불러오는 데 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  if (!id) {
    return <div>유효하지 않은 ID입니다.</div>;
  }

  const handleGoBack = () => {
    navigate(-1);
  };
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!qnaInfo) return <div>No data available</div>;

  return (
    <div className='App'>
      <Header />
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
        {qnaInfo.data.check? "처리완료": "답변대기"}
        </Button>

        <h1 className="mb-2 mt-2"><strong>{qnaInfo.data.title}</strong></h1>
        <div>{qnaInfo.data.author.nickname}</div>
            
        <hr style={{ border: 'none', height: '2px', backgroundColor: '#dddddd' }} />
        <div style={{ whiteSpace: 'pre-wrap' }}>{qnaInfo.data.text}</div>
        
        {qnaInfo.files && qnaInfo.files.length > 0 && (
          <div className="mt-3">
            {qnaInfo.files.map((file, index) => (
              <div key={index} className="mb-2">
                <FontAwesomeIcon icon={faDownload} className="me-2" />
                <a href={file['file-path']} download>{file.fileName}</a>
              </div>
            ))}
          </div>
        )}

        <hr style={{ border: 'none', height: '2px', backgroundColor: '#dddddd' }} />

        {qnaInfo.data.answer && (
          <Card className="mt-4 mb-4">
            <CardBody>
              <div style={{ whiteSpace: 'pre-wrap' }}>{qnaInfo.data.answer}</div>
              {/* <div className="mt-3 text-muted">
                {post.answer.author} · {post.answer.date}
              </div> */}
            </CardBody>
          </Card>
        )}

        <div className="text-center mt-4">
          <Button color="primary" onClick={handleGoBack}>
            <FontAwesomeIcon icon={faList} className="me-2" />
            목록으로 돌아가기
          </Button>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default QnADetail;